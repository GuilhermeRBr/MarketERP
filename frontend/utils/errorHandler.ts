import { AxiosError } from "axios";
import { ApiError } from "@/types/ApiResponse";

/**
 * Extrai mensagem de erro de uma resposta da API
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError | undefined;

    // Se tem mensagem customizada da API
    if (apiError?.message) {
      return apiError.message;
    }

    // Mensagens padrão por status code
    switch (error.response?.status) {
      case 400:
        return "Dados inválidos. Verifique as informações e tente novamente.";
      case 401:
        return "Não autorizado. Faça login novamente.";
      case 403:
        return "Você não tem permissão para realizar esta ação.";
      case 404:
        return "Recurso não encontrado.";
      case 422:
        return "Erro de validação. Verifique os dados enviados.";
      case 500:
        return "Erro interno do servidor. Tente novamente mais tarde.";
      default:
        return error.message || "Erro ao processar requisição.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Erro desconhecido.";
}

/**
 * Extrai erros de validação de campos
 */
export function getValidationErrors(
  error: unknown
): Record<string, string[]> | null {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError | undefined;
    return apiError?.errors || null;
  }
  return null;
}

/**
 * Verifica se é erro de rede
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return !error.response && error.code === "ERR_NETWORK";
  }
  return false;
}
