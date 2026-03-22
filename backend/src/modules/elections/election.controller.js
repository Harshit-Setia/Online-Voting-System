import * as electionService from "./election.service.js"

export const createElection=async (req,res) => {
    try {
        const election=await electionService.createElection(req.body)

        res.status(201).json({message:"Election created",electionId:election.id})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

export const getAllElections=async (req,res) => {
    const elections=await electionService.getAllElections()
    res.json(elections)
}

export const getElectionById=async (req,res) => {
    try {
        const election=await electionService.getElectionById(req.params.id)
        res.json(election)
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}

export const startElection=async (req,res) => {
    try {
        await electionService.startElection(req.params.id)
        res.json({message:"Election started"})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

export const endElection=async (req,res) => {
    try {
        await electionService.endElection(req.params.id)
        res.json({message:"Election ended"})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}