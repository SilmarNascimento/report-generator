import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  //InternalAxiosRequestConfig,
} from "axios";
import { ApiError } from "../types/error";
import { warningAlert } from "../utils/toastAlerts";

class ApiService {
  private readonly api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080",
      timeout: 5000,
    });

    // this.api.interceptors.request.use(
    //   (config: InternalAxiosRequestConfig) => {
    //     const token = KeycloakService.getToken();
    //     if (token) {
    //       config.headers.Authorization = `Bearer ${token}`;
    //     }
    //     return config;
    //   },
    //   (error: AxiosError) => Promise.reject(new Error(error.message))
    // );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (errorResponse: AxiosError) => {
        this.handleError(errorResponse);
        return Promise.reject(new Error(errorResponse.message));
      }
    );
  }

  private handleError(errorResponse: AxiosError) {
    const errorHandlers: Record<number, (data: ApiError) => void> = {
      401: (data: ApiError) => {
        warningAlert(data.mensagem);
        window.location.href = "/login";
      },
      404: (data: ApiError) => warningAlert(data.mensagem),
      409: (data: ApiError) => {
        if (
          data.mensagem.includes(
            "Existem usuários vinculados a esse perfil."
          ) ||
          data.mensagem.includes("Já existe uma agenda para o(s) serviço(s)")
        )
          return;
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

  async get<T>(
    endpoint: string,
    params: Record<string, unknown> = {},
    headers?: Record<string, string>
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

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.api.delete<T>(endpoint);
    return response.data;
  }
}

const apiService = new ApiService();
export default apiService;
