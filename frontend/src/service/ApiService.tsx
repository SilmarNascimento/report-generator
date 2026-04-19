import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiError } from "../interfaces/error";
import { warningAlert } from "../utils/toastAlerts";

const TOKEN_KEY = "@app:token";

class ApiService {
  private readonly api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: "/api",
      timeout: 5000,
    });

    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
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

        return Promise.reject(errorResponse);
      },
    );
  }

  private handleError(errorResponse: AxiosError) {
    const errorHandlers: Record<number, (data: ApiError) => void> = {
      401: () => {
        warningAlert("Usuário ou senha inválidos.");
        if (localStorage.getItem(TOKEN_KEY)) {
          localStorage.removeItem(TOKEN_KEY);
          window.location.href = "/login";
        }
      },
      403: () => {
        warningAlert("Você não tem permissão para acessar este recurso.");
      },
      404: (data: ApiError) => warningAlert(data.mensagem),
      409: (data: ApiError) => {
        if (this.isScheduleConflict(data.mensagem)) return;
        if (this.isEditConflict(data)) return;
        warningAlert(data.mensagem);
      },
      422: (data: ApiError) => warningAlert(data.mensagem),
    };

    const response = errorResponse.response;

    if (response) {
      const { status } = response;
      const data = response.data as ApiError;

      if (status && errorHandlers[status]) {
        if (status === 401 || status === 403) {
          errorHandlers[status](data);
        } else if (data?.mensagem) {
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
    return (
      mensagem.includes("Deseja continuar com a edição da agenda?") ||
      mensagem.includes("Deseja continuar com a criação da agenda?")
    );
  }

  isEditConflict(data: ApiError): boolean {
    const { mensagem } = data;

    if (
      mensagem.includes(
        "Não é possível salvar. A sigla informada já está cadastrada.",
      )
    )
      return true;

    if (!Object.keys(data).includes("permite_reagendamento_automatico"))
      return false;

    return (
      mensagem.includes("O que deseja fazer com") ||
      mensagem.includes("Ao remover o(s) serviços")
    );
  }

  async get<T>(
    endpoint: string,
    params: Record<string, unknown> = {},
    headers?: Record<string, string>,
    extraConfig?: AxiosRequestConfig,
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      ...extraConfig,
      params: { ...params, ...extraConfig?.params },
      headers: { ...headers, ...extraConfig?.headers },
    };
    const response = await this.api.get<T>(endpoint, config);
    return response.data;
  }

  async post<T>(
    endpoint: string,
    data: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.api.post<T>(endpoint, data, config);
    return response.data;
  }

  async put<T>(
    endpoint: string,
    data: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.api.put<T>(endpoint, data, config);
    return response.data;
  }

  async patch<T>(
    endpoint: string,
    data: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.api.patch<T>(endpoint, data, config);
    return response.data;
  }

  async delete<T>(
    endpoint: string,
    data: unknown = {},
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.api.delete<T>(endpoint, { data, ...config });
    return response.data;
  }

  async postMultipart<T = unknown>(
    endpoint: string,
    data: FormData,
    config?: AxiosRequestConfig,
  ) {
    const response = await this.api.post<T>(endpoint, data, {
      headers: { "Content-Type": "multipart/form-data" },
      ...config,
    });
    return response.data;
  }

  async getFullResponse<T = Blob>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return await this.api.get<T>(endpoint, { ...config, responseType: "blob" });
  }
}

const apiService = new ApiService();
export default apiService;
