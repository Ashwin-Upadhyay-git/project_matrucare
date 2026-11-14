import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { contactSchema } from '../schemas/authSchemas';
import api from '../services/api';

const ContactPage = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (values) => {
    try {
      await api.post('/api/contact', values);
      toast.success('Message sent successfully.');
      reset();
    } catch (error) {
      toast.error(error.message || 'Unable to send message.');
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Contact us</h1>
        <p className="mt-2 text-sm text-slate-600">We would love to hear from you.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
            <input {...register('name')} className="w-full rounded-xl border border-slate-300 px-3 py-2.5" placeholder="Your name" />
            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input type="email" {...register('email')} className="w-full rounded-xl border border-slate-300 px-3 py-2.5" placeholder="you@example.com" />
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Message</label>
            <textarea {...register('message')} className="min-h-32 w-full rounded-xl border border-slate-300 px-3 py-2.5" placeholder="How can we help?" />
            {errors.message && <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-60">
            {isSubmitting ? 'Sending...' : 'Send message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
