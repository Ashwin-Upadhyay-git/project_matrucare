export const generateOtp = () => `${Math.floor(100000 + Math.random() * 900000)}`;

export const isOtpExpired = (expiresAt) => {
  if (!expiresAt) return true;
  return new Date(expiresAt).getTime() <= Date.now();
};
