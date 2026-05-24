import { toUTC } from "../../utils/convertToUTC.js"
import * as electionService from "./election.service.js"

export const  createElection=async (req, res, next) => {
    try {
        const {start_time, end_time} = req.body
        req.body.start_time = toUTC(start_time)
        req.body.end_time = toUTC(end_time)
        const election = await electionService.createElection(req.body)

        res.status(201).json({message: "Election created", electionId: election.id})
    } catch (error) {
        next(error)
    }
}

export const getAllElections=async (req, res, next) => {
    try {
        const elections = await electionService.getAllElections()
        res.json(elections)
    } catch (error) {
        next(error)
    }
}

export const getElectionById=async (req, res, next) => {
    try {
        const election = await electionService.getElectionById(req.params.id)
        res.json(election)
    } catch (error) {
        next(error)
    }
}

export const startElection=async (req, res, next) => {
    try {
        await electionService.startElection(req.params.id)
        res.json({message: "Election started"})
    } catch (error) {
        next(error)
    }
}

export const endElection=async (req, res, next) => {
    try {
        await electionService.endElection(req.params.id)
        res.json({message: "Election ended"})
    } catch (error) {
        next(error)
    }
}

export const deleteElection = async (req, res, next) => {
  try {
    const election = await electionService.getElectionById(req.params.id);
    await election.destroy();
    res.json({ message: 'Election deleted' });
  } catch (error) {
    next(error);
  }
};