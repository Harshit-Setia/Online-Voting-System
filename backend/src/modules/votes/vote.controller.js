import * as voteService from "./vote.service.js";
import User from "../users/user.model.js";
import AppError from "../../utils/AppError.js";

export const castVote=async(req, res, next)=>{
    try {
        const userId = req.user.id
        const {candidate_id, election_id, otp} = req.body

        const vote = await voteService.castVote({
            userId,
            candidateId: candidate_id,
            electionId: election_id,
            otp
        })
        res.status(201).json({message: "Vote casted successfully", voteId: vote.id})
    } catch (error) {
        next(error)
    }
}

export const requestOTP = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { election_id } = req.body;

        const otp = await voteService.generateAndSendOTP(userId, election_id);
        // Log OTP to server console for visibility
        console.info(`📨 OTP generated for user ${userId}: ${otp}`);
        res.status(200).json({ message: "OTP sent to your registered email address", otp });
    } catch (error) {
        next(error)
    }
}