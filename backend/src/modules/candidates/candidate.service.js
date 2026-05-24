import Candidate from "./candidate.model.js"
import Election from "../elections/election.model.js"
import {uploadImage} from "../../utils/cloudUpload.js"
import AppError from "../../utils/AppError.js"

// add a candidate to election
export const addCandidate=async({name, party, election_id}, file)=>{
    const election = await Election.findByPk(election_id)
    if(!election) throw new AppError("Election not found", 404)

    let photo_url = null
    if(file){
        const result = await uploadImage(file.buffer)
        photo_url = result.secure_url
    }

    const candidate = await Candidate.create({
        name,
        party,
        election_id,
        photo_url
    })

    return candidate
}

// get all candidates in an election
export const getCandidatesByElection = async(electionId)=>{
    return Candidate.findAll({
        where: { election_id: electionId }
    })
}

// delete a candidate
export const deleteCandidate=async(id)=>{
    const candidate = await Candidate.findByPk(id)
    if(!candidate) throw new AppError("Candidate not found", 404)
    
    await candidate.destroy()

    return true
} 

// update a candidate's details
export const updateCandidate = async (id, payload) => {
  const candidate = await Candidate.findByPk(id);
  if (!candidate) throw new AppError('Candidate not found', 404);
  await candidate.update(payload);
  return candidate;
};