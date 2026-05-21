import { z } from 'zod';

export const createContactSchema = z.object({
  name: z
    .string({ required_error: 'Contact name is required' })
    .min(1, 'Name cannot be empty')
    .trim(),
  phone: z.string().trim().optional(),
  email: z.string().email('Invalid email format').trim().toLowerCase().optional().or(z.literal('')),
  company: z.string().trim().optional(),
  address: z.string().trim().optional(),
  tags: z.array(z.string().trim()).optional().default([]),
  isFavorite: z.boolean().optional().default(false),
});

export const updateContactSchema = createContactSchema.partial();

export const importContactsSchema = z.array(createContactSchema);

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
