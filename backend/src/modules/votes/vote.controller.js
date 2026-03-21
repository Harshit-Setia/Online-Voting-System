import * as voteService from "./vote.service.js"

export const castVote=async(req,res)=>{
    try {
        const userId=req.user.id
        const {candidate_id,election_id}=req.body

        const vote=await voteService.castVote({
            userId,
            candidateId:candidate_id,
            electionId:election_id
        })

        res.status(201).json({message:"Vote casted successfully",voteId:vote.id})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}