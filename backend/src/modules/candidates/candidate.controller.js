import * as candidateService from "./candidate.service.js"

export const addCandidate = async (req, res) => {
  try {
    const candidate = await candidateService.addCandidate(
      req.body,
      req.file
    )

    res.status(201).json({
      message: "Candidate added",
      candidateId: candidate.id,
      photo_url: candidate.photo_url
    })

  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const getCandidates=async(req,res)=>{
    const candidates=await candidateService.getCandidatesByElection(req.params.electionId)

    res.json(candidates)
}

export const deleteCandidate=async (req,res) => {
    try {
        await candidateService.deleteCandidate(req.params.id)

        res.json({message:"Candidate deleted"})
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}