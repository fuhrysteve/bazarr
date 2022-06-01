import SocketIO from "@/modules/socketio";
import { LOG } from "@/utilities/console";
import { setLoginRequired } from "@/utilities/event";
import Axios, { AxiosError, AxiosInstance, CancelTokenSource } from "axios";
import { Environment } from "../../utilities";
class BazarrClient {
  axios!: AxiosInstance;
  source!: CancelTokenSource;

  constructor() {
    const baseUrl = `${Environment.baseUrl}/api/`;

    LOG("info", "initializing BazarrClient with", baseUrl);

    this.initialize(baseUrl, Environment.apiKey);
    SocketIO.initialize();
  }

  initialize(url: string, apikey?: string) {
    this.axios = Axios.create({
      baseURL: url,
    });

    this.axios.defaults.headers.post["Content-Type"] = "application/json";
    this.axios.defaults.headers.common["X-API-KEY"] = apikey ?? "AUTH_NEEDED";

    this.source = Axios.CancelToken.source();

    this.axios.interceptors.request.use((config) => {
      config.cancelToken = this.source.token;
      return config;
    });

    this.axios.interceptors.response.use(
      (resp) => {
        if (resp.status >= 200 && resp.status < 300) {
          return Promise.resolve(resp);
        } else {
          this.handleError(resp.status);
          return Promise.reject(resp);
        }
      },
      (error: AxiosError) => {
        if (error.response) {
          const response = error.response;
          this.handleError(response.status);
        } else {
          error.message = "You have disconnected to Bazarr backend";
        }
        return Promise.reject(error);
      }
    );
  }

  handleError(code: number) {
    switch (code) {
      case 401:
        setLoginRequired();
        break;
      case 500:
        break;
      default:
        break;
    }
  }
}

export default new BazarrClient();
