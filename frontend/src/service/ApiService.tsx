import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiError } from "../interfaces/error";
import { warningAlert } from "../utils/toastAlerts";

class ApiService {
  private readonly api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "/api",
      timeout: 5000,
    });

    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // const token = KeycloakService.getToken();
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
      },
      (error: AxiosError) => Promise.reject(new Error(error.message)),
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (errorResponse: AxiosError) => {
        this.handleError(errorResponse);

        const errorMessage = (errorResponse.response?.data as ApiError)
          ?.mensagem;

        if (errorMessage && this.isScheduleConflict(errorMessage)) {
          return Promise.reject(errorResponse);
        }

        if (
          errorMessage &&
          this.isEditConflict(errorResponse.response?.data as ApiError)
        ) {
          return Promise.reject(errorResponse);
        }

        return Promise.reject(new Error(errorResponse.message));
      },
    );
  }

  private handleError(errorResponse: AxiosError) {
    const errorHandlers: Record<number, (data: ApiError) => void> = {
      401: (data: ApiError) => {
        // KeycloakService.doLogout();

        warningAlert(data.mensagem);
      },
      404: (data: ApiError) => warningAlert(data.mensagem),
      409: (data: ApiError) => {
        if (this.isScheduleConflict(data.mensagem)) {
          return;
        }
        if (this.isEditConflict(data)) {
          return;
        }

        warningAlert(data.mensagem);
      },
      422: (data: ApiError) => warningAlert(data.mensagem),
    };

    const response = errorResponse.response;

    if (response) {
      const { status } = response;
      const data = response.data as ApiError;

      if (status && errorHandlers[status]) {
        if (data?.mensagem) {
          errorHandlers[status](data);
        } else {
          warningAlert("Erro inesperado: dados da resposta inválidos.");
        }
      } else {
        warningAlert("Ocorreu um erro inesperado.");
      }
    } else {
      warningAlert("Erro de rede ou servidor indisponível.");
    }
  }

  isScheduleConflict(mensagem: string): boolean {
    if (mensagem.includes("Deseja continuar com a edição da agenda?")) {
      return true;
    }

    if (mensagem.includes("Deseja continuar com a criação da agenda?")) {
      return true;
    }

    return false;
  }

  isEditConflict(data: ApiError): boolean {
    const { mensagem } = data;

    if (
      mensagem.includes(
        "Não é possível salvar. A sigla informada já está cadastrada.",
      )
    ) {
      return true;
    }

    if (!Object.keys(data).includes("permite_reagendamento_automatico"))
      return false;

    if (
      mensagem.includes("O que deseja fazer com") ||
      mensagem.includes("Ao remover o(s) serviços")
    ) {
      return true;
    }

    return false;
  }

  async get<T>(
    endpoint: string,
    params: Record<string, unknown> = {},
    headers?: Record<string, string>,
  ): Promise<T> {
    const config: {
      params: Record<string, unknown>;
      headers?: Record<string, string>;
    } = { params };
    if (headers) {
      config.headers = headers;
    }

    const response = await this.api.get<T>(endpoint, config);
    return response.data;
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await this.api.post<T>(endpoint, data);
    return response.data;
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await this.api.put<T>(endpoint, data);
    return response.data;
  }

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await this.api.patch<T>(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string, data: unknown = {}): Promise<T> {
    const config = { data };
    const response = await this.api.delete<T>(endpoint, config);
    return response.data;
  }

  async postMultipart<T = unknown>(url: string, data: FormData) {
    return this.api
      .post<T>(url, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response.data);
  }
}

const apiService = new ApiService();
export default apiService;
