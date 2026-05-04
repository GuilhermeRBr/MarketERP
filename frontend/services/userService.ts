import api from "./api";
import {
  User,
  CreateUserDTO,
  UpdateUserDTO,
  UserListResponse,
} from "@/types/User";

class UserService {
  private readonly basePath = "/users";

  // Listar todos os usuários
  async getAll(): Promise<UserListResponse[]> {
    const response = await api.get<UserListResponse[]>(this.basePath);
    return response.data;
  }

  // Buscar usuário por ID
  async getById(id: number): Promise<UserListResponse> {
    const response = await api.get<UserListResponse>(`${this.basePath}/${id}`);
    return response.data;
  }

  // Criar novo usuário (registrar funcionário)
  async create(data: CreateUserDTO): Promise<UserListResponse> {
    const response = await api.post<UserListResponse>(
      `${this.basePath}/register`,
      data
    );
    return response.data;
  }

  // Atualizar usuário (apenas status ativo/inativo)
  async update(id: number, data: UpdateUserDTO): Promise<UserListResponse> {
    const response = await api.patch<UserListResponse>(
      `${this.basePath}/${id}`,
      data
    );
    return response.data;
  }

  // Soft delete - desativar usuário
  async deactivate(id: number): Promise<UserListResponse> {
    return this.update(id, { active: false });
  }

  // Reativar usuário
  async activate(id: number): Promise<UserListResponse> {
    return this.update(id, { active: true });
  }
}

export const userService = new UserService();
