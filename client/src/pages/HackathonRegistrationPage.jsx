import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { registrationSchema } from '../schemas/authSchemas';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const defaultTeamMember = { name: '', email: '' };

const HackathonRegistrationPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      mobileNumber: '',
      collegeName: '',
      course: '',
      branch: '',
      yearOfStudy: '',
      domain: '',
      projectName: '',
      pptLink: '',
      prototypeLink: '',
      demoVideoLink: '',
      teamSize: 1,
      teamMembers: []
    }
  });

  const selectedTeamSize = watch('teamSize', 1);

  useEffect(() => {
    const members = getValues('teamMembers') || [];
    const requiredMembers = Math.max(Number(selectedTeamSize) - 1, 0);

    const nextMembers = Array.from({ length: requiredMembers }, (_, index) => members[index] || { ...defaultTeamMember });
    setValue('teamMembers', nextMembers, { shouldValidate: true });
  }, [selectedTeamSize, getValues, setValue]);

  const teamMembers = useMemo(() => watch('teamMembers') || [], [watch]);

  const onSubmit = async (values) => {
    try {
      await api.post('/api/hackathon/register', {
        ...values,
        email: user?.email
      });
      toast.success('Registration submitted successfully.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Registration failed.');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Hackathon registration</h1>
        <p className="mt-2 text-sm text-slate-600">Complete your team and project details below.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
              <input {...register('fullName')} className="w-full rounded-xl border border-slate-300 px-3 py-2.5" />
              {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email Address</label>
              <input {...register('email')} readOnly className="w-full rounded-xl border border-slate-300 bg-slate-100 px-3 py-2.5" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Mobile Number</label>
              <input {...register('mobileNumber')} className="w-full rounded-xl border border-slate-300 px-3 py-2.5" placeholder="9876543210" />
              {errors.mobileNumber && <p className="mt-2 text-sm text-red-600">{errors.mobileNumber.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">College Name</label>
              <input {...register('collegeName')} className="w-full rounded-xl border border-slate-300 px-3 py-2.5" placeholder="College or university" />
              {errors.collegeName && <p className="mt-2 text-sm text-red-600">{errors.collegeName.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Course</label>
              <select {...register('course')} className="w-full rounded-xl border border-slate-300 px-3 py-2.5">
                <option value="">Select</option>
                <option value="B.Tech">B.Tech</option>
                <option value="M.Tech">M.Tech</option>
                <option value="BCA">BCA</option>
                <option value="MCA">MCA</option>
                <option value="BSc">BSc</option>
                <option value="Other">Other</option>
              </select>
              {errors.course && <p className="mt-2 text-sm text-red-600">{errors.course.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Branch</label>
              <select {...register('branch')} className="w-full rounded-xl border border-slate-300 px-3 py-2.5">
                <option value="">Select</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
                <option value="Other">Other</option>
              </select>
              {errors.branch && <p className="mt-2 text-sm text-red-600">{errors.branch.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Year of Study</label>
              <select {...register('yearOfStudy')} className="w-full rounded-xl border border-slate-300 px-3 py-2.5">
                <option value="">Select</option>
                <option value="1st year">1st year</option>
                <option value="2nd year">2nd year</option>
                <option value="3rd year">3rd year</option>
                <option value="4th year">4th year</option>
              </select>
              {errors.yearOfStudy && <p className="mt-2 text-sm text-red-600">{errors.yearOfStudy.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Domain / Track</label>
              <select {...register('domain')} className="w-full rounded-xl border border-slate-300 px-3 py-2.5">
                <option value="">Select</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Web Development">Web Development</option>
                <option value="IoT">IoT</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Blockchain">Blockchain</option>
                <option value="Other">Other</option>
              </select>
              {errors.domain && <p className="mt-2 text-sm text-red-600">{errors.domain.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Project Name</label>
              <input {...register('projectName')} className="w-full rounded-xl border border-slate-300 px-3 py-2.5" placeholder="Your project or solution name" />
              {errors.projectName && <p className="mt-2 text-sm text-red-600">{errors.projectName.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">PPT Link</label>
              <input {...register('pptLink')} className="w-full rounded-xl border border-slate-300 px-3 py-2.5" placeholder="https://drive.google.com/..." />
              {errors.pptLink && <p className="mt-2 text-sm text-red-600">{errors.pptLink.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Prototype Link</label>
              <input {...register('prototypeLink')} className="w-full rounded-xl border border-slate-300 px-3 py-2.5" placeholder="https://github.com/..." />
              {errors.prototypeLink && <p className="mt-2 text-sm text-red-600">{errors.prototypeLink.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Demo Video Link (optional)</label>
              <input {...register('demoVideoLink')} className="w-full rounded-xl border border-slate-300 px-3 py-2.5" placeholder="https://youtube.com/..." />
              {errors.demoVideoLink && <p className="mt-2 text-sm text-red-600">{errors.demoVideoLink.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Team Size</label>
              <select {...register('teamSize', { valueAsNumber: true })} className="w-full rounded-xl border border-slate-300 px-3 py-2.5">
                {[1, 2, 3, 4, 5].map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>

          {teamMembers.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="mb-5 text-lg font-semibold text-slate-900">Team members</h2>
              <div className="space-y-4">
                {teamMembers.map((member, index) => (
                  <div key={index} className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Member Name</label>
                      <input {...register(`teamMembers.${index}.name`)} className="w-full rounded-xl border border-slate-300 px-3 py-2.5" placeholder="Member name" />
                      {errors.teamMembers?.[index]?.name && <p className="mt-2 text-sm text-red-600">{errors.teamMembers[index].name.message}</p>}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Member Email</label>
                      <input type="email" {...register(`teamMembers.${index}.email`)} className="w-full rounded-xl border border-slate-300 px-3 py-2.5" placeholder="member@example.com" />
                      {errors.teamMembers?.[index]?.email && <p className="mt-2 text-sm text-red-600">{errors.teamMembers[index].email.message}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-60">
            {isSubmitting ? 'Submitting...' : 'Submit registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HackathonRegistrationPage;
