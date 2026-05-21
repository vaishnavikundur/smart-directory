import client from './client';
import type {
  Contact,
  ContactFormData,
  ContactQueryParams,
  DuplicateCheckParams,
  ImportResult,
  PaginatedResponse,
} from '@/types';

export const contactsApi = {
  getContacts: async (params?: ContactQueryParams): Promise<PaginatedResponse<Contact>> => {
    const response = await client.get<PaginatedResponse<Contact>>('/contacts', { params });
    return response.data;
  },

  getContact: async (id: string): Promise<Contact> => {
    const response = await client.get<Contact>(`/contacts/${id}`);
    return response.data;
  },

  createContact: async (data: ContactFormData): Promise<Contact> => {
    const response = await client.post<Contact>('/contacts', data);
    return response.data;
  },

  updateContact: async (id: string, data: Partial<ContactFormData>): Promise<Contact> => {
    const response = await client.patch<Contact>(`/contacts/${id}`, data);
    return response.data;
  },

  deleteContact: async (id: string): Promise<void> => {
    await client.delete(`/contacts/${id}`);
  },

  checkDuplicate: async (params: DuplicateCheckParams): Promise<{ isDuplicate: boolean; contact?: Contact }> => {
    const response = await client.get<{ isDuplicate: boolean; contact?: Contact }>('/contacts/check-duplicate', {
      params,
    });
    return response.data;
  },

  autocomplete: async (prefix: string): Promise<Contact[]> => {
    const response = await client.get<{ contacts: Contact[] }>('/contacts/autocomplete', {
      params: { prefix },
    });
    return response.data.contacts;
  },

  importContacts: async (contacts: Partial<ContactFormData>[]): Promise<ImportResult> => {
    const response = await client.post<ImportResult>('/contacts/import', { contacts });
    return response.data;
  },

  exportContacts: async (format: 'csv' | 'json'): Promise<Blob> => {
    const response = await client.get('/contacts/export', {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },

  getRecent: async (): Promise<Contact[]> => {
    const response = await client.get<{ recent: Contact[] }>('/recent');
    return response.data.recent;
  },

  addRecent: async (contactId: string): Promise<void> => {
    await client.post('/recent', { contactId });
  },
};
