import Vote from "./vote.model.js"
import Election from "../elections/election.model.js"
import Candidate from "../candidates/candidate.model.js"

// cast vote
export const castVote=async({userId,candidateId,electionId})=>{

    const election = await Election.findByPk(electionId)
    if(!election){
        throw Error("Election not found")
    }
    const now = new Date();
    const isWithinTime = now >= election.start_time && now <= election.end_time;
    if (election.status !== "active" || !isWithinTime){
        throw new Error("Voting is not allowed");
    }

    const candidate=await Candidate.findByPk(candidateId)
    if(!candidate){
        throw Error("Candidate not found")
    }

    if(candidate.electionId!==electionId){
        throw Error("Candidate does not belong to this election")
    }

    try {
        const vote=await Vote.create({
            voter_id:userId,
            candidate_id:candidateId,
            election_id:electionId
        })

        return vote
    } catch (error) {
        if(error.name==="SequelizeUniqueConstraintError"){
            throw Error("User has already voted")
        }
        throw error
    }
    
}