import * as resultService from "./result.service.js"

export const getResults = async (req, res) => {
  try {
    const results = await resultService.getResults(req.params.electionId)

    res.json(results)

  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const getWinner = async (req, res) => {
  try {
    const winner = await resultService.getWinner(req.params.electionId)

    res.json({
      candidate_id: winner.candidate_id,
      name: winner.Candidate.name,
      party: winner.Candidate.party,
      votes: winner.dataValues.votes
    })

  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}