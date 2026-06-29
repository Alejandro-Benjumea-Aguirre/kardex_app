import api from '../../../lib/axios';
import type { ApiSuccessResponse } from '../../../types/api';
import type { Category } from '../../../types/domain';

export interface CategoryPayload {
  name:        string;
  slug:        string;
  description?: string;
  is_active:   boolean;
  parent_id?:  string;
}

export const CategoryService = {

  async getAll(): Promise<Category[]> {
    const { data } = await api.get<ApiSuccessResponse<Category[]>>('/category');
    console.log(data);
    const result = data.data as unknown;
    if (Array.isArray(result)) return result;
    if (result && typeof result === 'object' && Array.isArray((result as { data: unknown }).data)) {
      return (result as { data: Category[] }).data;
    }
    return [];
  },

  async create(payload: CategoryPayload): Promise<Category> {
    console.log(payload);
    const { data } = await api.post<ApiSuccessResponse<Category>>('/category', payload);
    return data.data;
  },

  async update(id: string, payload: CategoryPayload): Promise<Category> {
    const { data } = await api.put<ApiSuccessResponse<Category>>(`/category/${id}`, payload);
    return data.data;
  },

  async toggleActive(id: string, action: 'activate' | 'deactivate'): Promise<Category | null> {
    const { data } = await api.patch<ApiSuccessResponse<Category>>(`/category/${id}/activate`, { action });
    return data?.data ?? null;
  },

};
