import AppError from "../../utils/AppError.js";
import User from "./user.model.js";

/**
 * Generate an OTP for the user's mobile number.
 * In this simplified version we just store the OTP and log it to the console
 * (or you could return it in the API response for testing).
 */
export const generateMobileOtp = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError('User not found', 404);
  if (!user.mobile) throw new AppError('Mobile number not set for user', 400);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await user.update({ otp, otpExpiresAt: expires });
  // Simple approach: log OTP to console (dev only)
  console.info(`🔐 OTP for ${user.mobile}: ${otp} (expires in 5 min)`);
  return { message: 'OTP generated (check server console)', otp };
};


/**
 * Verify the OTP entered by the user.
 */
export const verifyMobileOtp = async (userId, code) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError('User not found', 404);
  if (!user.otp || !user.otpExpiresAt) throw new AppError('No OTP requested', 400);
  if (user.otp !== code) throw new AppError('Invalid OTP', 400);
  if (user.otpExpiresAt < new Date()) throw new AppError('OTP has expired', 400);

  await user.update({ isMobileVerified: true, otp: null, otpExpiresAt: null });
  return { message: 'Mobile number verified' };
};
