import { useSubtitleAction } from "@/apis/hooks";
import { useModals, withModal } from "@/modules/modals";
import { createTask, dispatchTask } from "@/modules/task";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Divider, Group, NumberInput, Stack } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { FunctionComponent } from "react";

const TaskName = "Changing Time";

function convertToAction(h: number, m: number, s: number, ms: number) {
  return `shift_offset(h=${h},m=${m},s=${s},ms=${ms})`;
}

interface Props {
  selections: FormType.ModifySubtitle[];
  onSubmit?: VoidFunction;
}

const TimeOffsetForm: FunctionComponent<Props> = ({ selections, onSubmit }) => {
  const { mutateAsync } = useSubtitleAction();
  const modals = useModals();

  const form = useForm({
    initialValues: {
      positive: true,
      hour: 0,
      min: 0,
      sec: 0,
      ms: 0,
    },
    validationRules: {
      hour: (v) => v >= 0,
      min: (v) => v >= 0,
      sec: (v) => v >= 0,
      ms: (v) => v >= 0,
    },
  });

  const enabled =
    form.values.hour > 0 ||
    form.values.min > 0 ||
    form.values.sec > 0 ||
    form.values.ms > 0;

  return (
    <form
      onSubmit={form.onSubmit(({ positive, hour, min, sec, ms }) => {
        const action = convertToAction(hour, min, sec, ms);

        const tasks = selections.map((s) =>
          createTask(s.path, mutateAsync, {
            action,
            form: s,
          })
        );

        dispatchTask(tasks, TaskName);
        onSubmit?.();
        modals.closeSelf();
      })}
    >
      <Stack>
        <Group align="end" spacing="xs" noWrap>
          <Button
            color="gray"
            variant="filled"
            onClick={() =>
              form.setValues((f) => ({ ...f, positive: !f.positive }))
            }
          >
            <FontAwesomeIcon
              icon={form.values.positive ? faPlus : faMinus}
            ></FontAwesomeIcon>
          </Button>
          <NumberInput
            label="hour"
            {...form.getInputProps("hour")}
          ></NumberInput>
          <NumberInput label="min" {...form.getInputProps("min")}></NumberInput>
          <NumberInput label="sec" {...form.getInputProps("sec")}></NumberInput>
          <NumberInput label="ms" {...form.getInputProps("ms")}></NumberInput>
        </Group>
        <Divider></Divider>
        <Button disabled={!enabled} type="submit">
          Start
        </Button>
      </Stack>
    </form>
  );
};

export const TimeOffsetModal = withModal(TimeOffsetForm, "time-offset", {
  title: "Change Time",
});

export default TimeOffsetForm;
