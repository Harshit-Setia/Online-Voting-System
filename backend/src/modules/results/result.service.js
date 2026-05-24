import { sequelize } from "../../config/database.js"
import Candidate from "../candidates/candidate.model.js"
import Election from "../elections/election.model.js"
import Vote from "../votes/vote.model.js"
import AppError from "../../utils/AppError.js"

// get result
export const getResults=async(electionId)=>{
    const election = await Election.findByPk(electionId)
    if(!election) throw new AppError("Election not found", 404)
    if (election.status !== "ended") {
        throw new AppError("Results not available yet", 403)
    }

    const results = await Vote.findAll({
        where: {election_id: electionId},
        attributes: [
            "candidate_id",
            [sequelize.fn("COUNT", sequelize.col("candidate_id")), "votes"]
        ],
        include: [{
            model: Candidate,
            attributes: ["name", "party", "photo_url"]
        }],

        group: ["Vote.candidate_id", "Candidate.id", "Candidate.name", "Candidate.party", "Candidate.photo_url"],
        order: [[sequelize.literal("votes"), "DESC"]]
    })

    return results
}

// get winner
export const getWinner = async (electionId) => {

  const results = await getResults(electionId)

  if (results.length === 0) {
    throw new AppError("No votes found", 404)
  }

  const winner = results[0]

  return winner
}