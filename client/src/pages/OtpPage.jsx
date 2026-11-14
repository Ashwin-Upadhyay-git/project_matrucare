import { useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const OtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const otpValue = useMemo(() => otp.join(''), [otp]);

  const handleChange = (index, value) => {
    const sanitized = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = sanitized;
    setOtp(next);

    if (sanitized && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = (event.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6).split('');
    if (pasted.length !== 6) return;
    setOtp(pasted);
    inputRefs.current[5]?.focus();
  };

  const handleVerify = async () => {
    if (otpValue.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP.');
      return;
    }

    try {
      await api.post('/api/auth/verify-otp', { email, otp: otpValue });
      toast.success('OTP verified. Please log in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'OTP verification failed.');
    }
  };

  const handleResend = async () => {
    try {
      await api.post('/api/auth/resend-otp', { email });
      toast.success('A new OTP has been sent.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error(error.message || 'Could not resend OTP.');
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Verify your email</h1>
        <p className="mt-2 text-sm text-slate-600">Enter the 6-digit OTP sent to {email || 'your email'}.</p>

        <div className="mt-8 flex gap-3" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              value={digit}
              inputMode="numeric"
              maxLength={1}
              aria-label={`OTP digit ${index + 1}`}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              className="h-14 w-12 rounded-xl border border-slate-300 text-center text-xl font-semibold focus:border-indigo-500 focus:outline-none"
            />
          ))}
        </div>

        <button type="button" onClick={handleVerify} className="mt-8 w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500">
          Verify OTP
        </button>

        <button type="button" onClick={handleResend} className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:border-slate-400">
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default OtpPage;
