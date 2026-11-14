import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { signupSchema } from '../schemas/authSchemas';
import api from '../services/api';

const SignupPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (values) => {
    try {
      await api.post('/api/auth/signup', {
        fullName: values.fullName,
        email: values.email,
        password: values.password
      });
      toast.success('OTP sent to your email.');
      navigate('/verify-otp', { state: { email: values.email } });
    } catch (error) {
      toast.error(error.message || 'Unable to create account.');
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
        <p className="mt-2 text-sm text-slate-600">Register to unlock the hackathon portal.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
            <input {...register('fullName')} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none ring-0 transition focus:border-indigo-500" placeholder="Your full name" />
            {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input type="email" {...register('email')} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-indigo-500" placeholder="you@example.com" />
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input type="password" {...register('password')} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-indigo-500" placeholder="Create a strong password" />
            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Confirm Password</label>
            <input type="password" {...register('confirmPassword')} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-indigo-500" placeholder="Confirm your password" />
            {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
