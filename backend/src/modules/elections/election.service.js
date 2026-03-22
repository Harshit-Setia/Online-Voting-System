import Election from "./election.model.js"

// create election (admin)
export const createElection=async({title,description,start_time,end_time})=>{
    if(new Date(start_time)>=new Date(end_time)){
        throw Error("Start time must be before end time")
    }

    const election = await Election.create({
        title,
        description,
        start_time,
        end_time,
        status:"upcoming"
    })

    return election
}

// get all elections
export const getAllElections=async()=>{
    return Election.findAll()
}

// get single election
export const getElectionById=async(id)=>{
    const election=await Election.findByPk(id)
    if(!election){
        throw Error("Election not found")
    }
    return election
}

// start election (admin)
export const startElection=async(id)=>{
    const election=await Election.findByPk(id)
    if(!election){
        throw Error("Election not found")
    }

    if(election.status!=="upcoming"){
        throw Error("Election cannot be started")
    }
    
    election.status="active"
    await election.save()

    return election
}

// end election (admin)
export const endElection=async(id)=>{
    const election=await Election.findByPk(id)
    if(!election){
        throw Error("Election not found")
    }

    if(election.status!=="active"){
        throw Error("Election is not active")
    }

    election.status="ended"
    await election.save()

    return election
}