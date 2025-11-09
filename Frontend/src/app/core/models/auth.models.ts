export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Worker' | 'User';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface DecodeTokenResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface UsersListResponse {
  admins: User[];
  workers: User[];
  users: User[];
}

