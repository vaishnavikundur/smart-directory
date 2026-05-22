export interface User {
  id: string;
  email: string;
  name: string;
  preferences: {
    theme: 'dark' | 'light';
  };
}

export interface Contact {
  id: string;
  userId: string;
  name: string;
  phone?: string;
  email?: string;
  photo?: string;
  company?: string;
  address?: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface ImportResult {
  imported: number;
  failed: { row: number; error: string }[];
}

export interface ContactFormData {
  name: string;
  email?: string;
  phone?: string;
  photo?: string;
  company?: string;
  address?: string;
  tags: string[];
}

export interface ContactQueryParams {
  search?: string;
  tag?: string;
  favorite?: boolean;
  sortBy?: 'name' | 'createdAt' | 'company';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface DuplicateCheckParams {
  email?: string;
  phone?: string;
  excludeId?: string;
}
