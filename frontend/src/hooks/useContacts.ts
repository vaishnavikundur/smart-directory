import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsApi } from '@/api/contacts';
import type { Contact, ContactFormData, ContactQueryParams, PaginatedResponse } from '@/types';

export function useContacts(params?: ContactQueryParams) {
  return useQuery({
    queryKey: ['contacts', params],
    queryFn: () => contactsApi.getContacts(params),
  });
}

export function useContact(id: string | null) {
  return useQuery({
    queryKey: ['contact', id],
    queryFn: () => contactsApi.getContact(id!),
    enabled: !!id,
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContactFormData) => contactsApi.createContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ContactFormData> }) =>
      contactsApi.updateContact(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contact'] });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contactsApi.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) =>
      contactsApi.updateContact(id, { isFavorite } as unknown as Partial<ContactFormData>),
    onMutate: async ({ id, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: ['contacts'] });

      const previousQueries = queryClient.getQueriesData<PaginatedResponse<Contact>>({
        queryKey: ['contacts'],
      });

      queryClient.setQueriesData<PaginatedResponse<Contact>>(
        { queryKey: ['contacts'] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((contact) =>
              contact.id === id ? { ...contact, isFavorite } : contact
            ),
          };
        }
      );

      return { previousQueries };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useAutocomplete(prefix: string) {
  return useQuery({
    queryKey: ['autocomplete', prefix],
    queryFn: () => contactsApi.autocomplete(prefix),
    enabled: prefix.length >= 2,
  });
}

export function useImportContacts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contacts: Partial<ContactFormData>[]) => contactsApi.importContacts(contacts),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useRecentContacts() {
  return useQuery({
    queryKey: ['recentContacts'],
    queryFn: () => contactsApi.getRecent(),
  });
}
