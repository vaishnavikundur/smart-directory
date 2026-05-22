import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Mail, Building, MapPin, AlertCircle, Camera } from 'lucide-react';
import { useUiStore } from '../stores/uiStore';
import { useContact, useCreateContact, useUpdateContact } from '../hooks/useContacts';
import { TagInput } from './TagInput';
import { contactsApi } from '../api/contacts';

const contactSchema = zod.object({
  name: zod.string().min(1, 'Name is required'),
  email: zod.string().email('Invalid email').or(zod.string().length(0)),
  phone: zod.string().optional(),
  photo: zod.string().optional(),
  company: zod.string().optional(),
  address: zod.string().optional(),
  tags: zod.array(zod.string()).default([]),
});

type ContactFormValues = zod.infer<typeof contactSchema>;

export const ContactModal: React.FC = () => {
  const { activeModal, editingContactId, closeModal } = useUiStore();
  const [duplicateWarning, setDuplicateWarning] = useState<{ email?: string; phone?: string; name?: string }>({});

  const isOpen = activeModal === 'addContact' || activeModal === 'editContact';
  const isEdit = activeModal === 'editContact';

  const { data: contact, isLoading: isLoadingContact } = useContact(editingContactId);
  const createContactMutation = useCreateContact();
  const updateContactMutation = useUpdateContact();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      photo: '',
      company: '',
      address: '',
      tags: [],
    },
  });

  const photoValue = watch('photo');

  // Pre-fill form on edit mode
  useEffect(() => {
    if (isEdit && contact) {
      reset({
        name: contact.name,
        email: contact.email || '',
        phone: contact.phone || '',
        photo: contact.photo || '',
        company: contact.company || '',
        address: contact.address || '',
        tags: contact.tags || [],
      });
      setDuplicateWarning({});
    } else if (!isEdit) {
      reset({
        name: '',
        email: '',
        phone: '',
        photo: '',
        company: '',
        address: '',
        tags: [],
      });
      setDuplicateWarning({});
    }
  }, [contact, isEdit, reset]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('photo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const checkDuplicateField = async (field: 'email' | 'phone' | 'name', value: string) => {
    if (!value) return;
    try {
      const params = field === 'email' ? { email: value } : field === 'phone' ? { phone: value } : { name: value };
      const response = await contactsApi.checkDuplicate(params);
      
      if (response.isDuplicate && response.contact) {
        if (isEdit && response.contact.id === editingContactId) return;

        let errorMsg = `Duplicate detected: already assigned to ${response.contact!.name}`;
        if (field === 'name') errorMsg = 'Contact with this name already exists.';
        if (field === 'phone') errorMsg = 'Contact with this mobile number already exists.';

        setDuplicateWarning((prev) => ({
          ...prev,
          [field]: errorMsg,
        }));
      } else {
        setDuplicateWarning((prev) => {
          const updated = { ...prev };
          delete updated[field];
          return updated;
        });
      }
    } catch (err) {
      console.error('Failed to check duplicates', err);
    }
  };

  const onSubmit = async (values: ContactFormValues) => {
    const formattedData = {
      name: values.name,
      email: values.email || undefined,
      phone: values.phone || undefined,
      photo: values.photo || undefined,
      company: values.company || undefined,
      address: values.address || undefined,
      tags: values.tags,
    };

    try {
      if (duplicateWarning.name) {
        setError('name', { type: 'manual', message: duplicateWarning.name });
        return;
      }
      if (duplicateWarning.phone) {
        setError('phone', { type: 'manual', message: duplicateWarning.phone });
        return;
      }

      if (isEdit && editingContactId) {
        await updateContactMutation.mutateAsync({
          id: editingContactId,
          data: formattedData,
        });
      } else {
        await createContactMutation.mutateAsync(formattedData);
      }
      closeModal();
      reset();
    } catch (err: any) {
      console.error('Failed to submit contact', err);
      const errorMessage = err.response?.data?.error || 'Failed to save contact.';
      if (errorMessage.toLowerCase().includes('name')) {
        setError('name', { type: 'manual', message: errorMessage });
      } else if (errorMessage.toLowerCase().includes('mobile number') || errorMessage.toLowerCase().includes('phone')) {
        setError('phone', { type: 'manual', message: errorMessage });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="bg-resend-surface-card relative z-10 w-full max-w-xl p-8 rounded-resend-lg shadow-2xl border border-resend-hairline"
        >
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 text-resend-ash hover:text-resend-ink p-1 bg-resend-surface-elevated hover:bg-resend-surface-card border border-transparent hover:border-resend-hairline-strong rounded-resend-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-8">
            <h2 className="text-[24px] font-medium tracking-resend-tight text-resend-ink font-display">
              {isEdit ? 'Edit Contact' : 'New Contact'}
            </h2>
          </div>

          {isEdit && isLoadingContact ? (
            <div className="py-12 flex justify-center items-center">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="flex flex-col items-center justify-center mb-6">
                <label className="relative cursor-pointer group">
                  <div className="w-24 h-24 rounded-resend-full overflow-hidden bg-resend-surface-elevated border border-dashed border-resend-hairline-strong flex items-center justify-center group-hover:border-resend-ash transition-colors">
                    {photoValue ? (
                      <img src={photoValue} alt="Contact" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-resend-ash group-hover:text-resend-charcoal transition-colors" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                {photoValue && (
                  <button
                    type="button"
                    onClick={() => setValue('photo', '')}
                    className="text-[12px] text-red-500 hover:text-red-600 mt-2 font-medium"
                  >
                    Remove Photo
                  </button>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-resend-charcoal uppercase tracking-widest">Name *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-resend-ash" />
                  <input
                    type="text"
                    {...register('name')}
                    placeholder="Enter name"
                    onBlur={(e) => checkDuplicateField('name', e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
                {errors.name && (
                  <p className="text-[12px] text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.name.message}
                  </p>
                )}
                {!errors.name && duplicateWarning.name && (
                  <p className="text-[12px] text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {duplicateWarning.name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-resend-charcoal uppercase tracking-widest">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-resend-ash" />
                    <input
                      type="text"
                      {...register('email')}
                      placeholder="Enter email"
                      onBlur={(e) => checkDuplicateField('email', e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[12px] text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-resend-charcoal uppercase tracking-widest">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-resend-ash" />
                    <input
                      type="text"
                      {...register('phone')}
                      placeholder="Enter phone number"
                      onBlur={(e) => checkDuplicateField('phone', e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[12px] text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.phone.message}
                    </p>
                  )}
                  {!errors.phone && duplicateWarning.phone && (
                    <p className="text-[12px] text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {duplicateWarning.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-resend-charcoal uppercase tracking-widest">Company</label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-resend-ash" />
                  <input
                    type="text"
                    {...register('company')}
                    placeholder="Enter company"
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-resend-charcoal uppercase tracking-widest">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-resend-ash" />
                  <textarea
                    {...register('address')}
                    placeholder="Enter address"
                    rows={2}
                    className="input-field pl-10 resize-none py-2.5"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-resend-charcoal uppercase tracking-widest">Tags</label>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <TagInput value={field.value} onChange={field.onChange} />
                  )}
                />
              </div>

              <div className="flex gap-4 justify-end pt-6 mt-8 border-t border-resend-hairline">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createContactMutation.isPending || updateContactMutation.isPending}
                  className="btn-primary flex items-center justify-center min-w-[120px]"
                >
                  {createContactMutation.isPending || updateContactMutation.isPending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-resend-full animate-spin" />
                  ) : isEdit ? (
                    'Save'
                  ) : (
                    'Add'
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default ContactModal;
