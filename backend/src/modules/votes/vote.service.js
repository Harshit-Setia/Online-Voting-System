import Vote from "./vote.model.js"
import Election from "../elections/election.model.js"
import Candidate from "../candidates/candidate.model.js"
import User from "../users/user.model.js"
import AppError from "../../utils/AppError.js"
import crypto from "crypto"
import { sendEmail } from "../../utils/mailer.js"

export const generateAndSendOTP = async (userId, electionId) => {
    const election = await Election.findByPk(electionId)
    if (!election) throw new AppError("Election not found", 404)
    
    if (election.status !== "active") {
        throw new AppError("Voting is not allowed for this election right now", 400)
    }

    const user = await User.findByPk(userId)
    if (!user) throw new AppError("User not found", 404)

    // Generate 6 digit OTP
    const otp = crypto.randomInt(100000, 999999).toString()
    
    // Set expiry to 10 minutes from now
    user.otp = otp
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000)
    await user.save()

    const message = `Your OTP to cast a vote for ${election.title} is: ${otp}. It will expire in 10 minutes.`;
    const subject = `Your Secure OTP for ${election.title}`;
    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1a202c; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="color: #10b981; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">OVS Secure Portal</h2>
          <p style="color: #718096; margin: 5px 0 0 0; font-size: 14px;">Online Voting System</p>
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: #2d3748;">Hello <strong>${user.name}</strong>,</p>
        <p style="font-size: 16px; line-height: 1.6; color: #2d3748;">You have requested a secure One-Time Password (OTP) to cast your vote in: <strong>${election.title}</strong>.</p>
        <div style="margin: 35px 0; text-align: center;">
          <div style="font-size: 38px; font-weight: 800; letter-spacing: 6px; color: #111827; background-color: #f3f4f6; padding: 18px 35px; border-radius: 12px; border: 1px dashed #d1d5db; display: inline-block; font-family: monospace;">${otp}</div>
        </div>
        <p style="font-size: 14px; color: #6b7280; text-align: center; margin-bottom: 25px;">This secure code is valid for <strong>10 minutes</strong>. If you did not initiate this request, please secure your account immediately.</p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 25px 0;" />
        <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">&copy; ${new Date().getFullYear()} Online Voting System (OVS). All rights reserved.</p>
      </div>
    `;

    // Send Email (completely free and highly reliable)
    try {
        await sendEmail(user.email, subject, message, htmlMessage);
        console.log(`✉️ OTP Email sent successfully to ${user.email}`);
    } catch (emailError) {
        console.error(`⚠️ Failed to send OTP Email to ${user.email}:`, emailError.message);
        throw new AppError('Failed to deliver OTP email. Please check your SMTP settings.', 500);
    }
    
    return otp;
}

// cast vote
export const castVote=async({userId, candidateId, electionId, otp})=>{

    const election = await Election.findByPk(electionId)
    if(!election){
        throw new AppError("Election not found", 404)
    }
    if (election.status !== "active"){
        throw new AppError("Voting is not allowed", 400)
    }

    const candidate = await Candidate.findByPk(candidateId)
    if(!candidate){
        throw new AppError("Candidate not found", 404)
    }

    if (Number(candidate.election_id) !== Number(electionId)) {
        throw new AppError("Candidate does not belong to this election", 400)
    }

    const user = await User.findByPk(userId)
    if (!user) throw new AppError("User not found", 404)

    // Verify OTP
    if (!user.otp || user.otp !== otp) {
        throw new AppError("Invalid OTP", 400)
    }

    if (new Date() > user.otpExpiresAt) {
        throw new AppError("OTP has expired. Please request a new one.", 400)
    }

    try {
        const vote = await Vote.create({
            voter_id: userId,
            candidate_id: candidateId,
            election_id: electionId
        })

        // Clear OTP after successful vote
        user.otp = null
        user.otpExpiresAt = null
        await user.save()

        return vote
    } catch (error) {
        if(error.name === "SequelizeUniqueConstraintError"){
            throw new AppError("User has already voted", 400)
        }
        throw error
    }
    
}