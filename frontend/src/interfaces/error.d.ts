export interface ApiError {
  response: {
    data: {
      message: string;
    };
  };
  status: number;
  mensagem: string;
  data_ocorrido: string;
  permite_reagendamento_automatico?: boolean;
}
