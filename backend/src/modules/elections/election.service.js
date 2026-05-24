import Election from "./election.model.js"
import AppError from "../../utils/AppError.js"
import Vote from "../votes/vote.model.js"
import User from "../users/user.model.js"

// create election (admin)
export const createElection=async({title, description, start_time, end_time})=>{
    if(new Date(start_time) >= new Date(end_time)){
        throw new AppError("Start time must be before end time", 400)
    }

    const election = await Election.create({
        title,
        description,
        start_time,
        end_time,
        status: "upcoming"
    })

    return election
}

// get all elections
export const getAllElections=async()=>{
    const elections = await Election.findAll()
    const totalVoters = await User.count({ where: { role: 'voter' } })

    const electionsWithStats = await Promise.all(elections.map(async (election) => {
        const votesCast = await Vote.count({ where: { election_id: election.id } })
        return {
            ...election.toJSON(),
            votesCast,
            totalVoters
        }
    }))

    return electionsWithStats
}

// get single election
export const getElectionById=async(id)=>{
    const election = await Election.findByPk(id)
    if(!election){
        throw new AppError("Election not found", 404)
    }
    return election
}

// start election (admin)
export const startElection=async(id)=>{
    const election = await Election.findByPk(id)
    if(!election){
        throw new AppError("Election not found", 404)
    }

    if(election.status !== "upcoming"){
        throw new AppError("Election cannot be started", 400)
    }
    
    election.status = "active"
    await election.save()

    return election
}

// end election (admin)
export const endElection=async(id)=>{
    const election = await Election.findByPk(id)
    if(!election){
        throw new AppError("Election not found", 404)
    }

    if(election.status !== "active"){
        throw new AppError("Election is not active", 400)
    }

    election.status = "ended"
    await election.save()

    return election
}

// update election (admin)
export const updateElection = async (id, updates) => {
    const election = await Election.findByPk(id)
    if (!election) {
        throw new AppError("Election not found", 404)
    }

    const newStartTime = updates.start_time !== undefined ? updates.start_time : election.start_time
    const newEndTime = updates.end_time !== undefined ? updates.end_time : election.end_time

    if (new Date(newStartTime) >= new Date(newEndTime)) {
        throw new AppError("Start time must be before end time", 400)
    }

    await election.update(updates)
    return election
}