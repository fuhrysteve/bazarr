import { useSystem, useSystemSettings } from "@/apis/hooks";
import { Action } from "@/components";
import { Layout } from "@/constants";
import { useNavbar } from "@/contexts/Navbar";
import { useIsOnline } from "@/contexts/Online";
import { Environment, useGotoHomepage } from "@/utilities";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import {
  Anchor,
  Avatar,
  Badge,
  Burger,
  Divider,
  Group,
  Header,
  MediaQuery,
  Menu,
} from "@mantine/core";
import { FunctionComponent } from "react";

const AppHeader: FunctionComponent = () => {
  const { data: settings } = useSystemSettings();
  const hasLogout = settings?.auth.type === "form";

  const { show, showed } = useNavbar();

  const online = useIsOnline();
  const offline = !online;

  const { shutdown, restart, logout } = useSystem();

  const goHome = useGotoHomepage();

  return (
    <Header p="md" height={Layout.HEADER_HEIGHT}>
      <Group position="apart">
        <Group>
          <MediaQuery
            smallerThan={Layout.MOBILE_BREAKPOINT}
            styles={{ display: "none" }}
          >
            <Anchor onClick={goHome}>
              <Avatar
                alt="brand"
                size={32}
                src={`${Environment.baseUrl}/static/logo64.png`}
              ></Avatar>
            </Anchor>
          </MediaQuery>
          <MediaQuery
            largerThan={Layout.MOBILE_BREAKPOINT}
            styles={{ display: "none" }}
          >
            <Burger
              opened={showed}
              onClick={() => show(!showed)}
              size="sm"
            ></Burger>
          </MediaQuery>
          <Badge size="lg" radius="sm" color="gray">
            Bazarr
          </Badge>
        </Group>
        <Group spacing="xs" position="right">
          <Menu
            control={
              <Action
                loading={offline}
                color={offline ? "yellow" : undefined}
                icon={faGear}
                variant="light"
              ></Action>
            }
          >
            <Menu.Item onClick={() => restart()}>Restart</Menu.Item>
            <Menu.Item onClick={() => shutdown()}>Shutdown</Menu.Item>
            <Divider></Divider>
            <Menu.Item hidden={!hasLogout} onClick={() => logout()}>
              Logout
            </Menu.Item>
          </Menu>
        </Group>
      </Group>
    </Header>
  );
};

export default AppHeader;
