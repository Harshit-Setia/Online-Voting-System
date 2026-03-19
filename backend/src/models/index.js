import User from "../modules/users/user.model.js";
import Election from "../modules/elections/election.model.js";
import Candidate from "../modules/candidates/candidate.model.js";
import Vote from "../modules/votes/vote.model.js";

/*
User → Votes
*/
User.hasMany(Vote, { foreignKey: "voter_id" });
Vote.belongsTo(User, { foreignKey: "voter_id" });

/*
Election → Candidates
*/
Election.hasMany(Candidate, { foreignKey: "election_id" });
Candidate.belongsTo(Election, { foreignKey: "election_id" });

/*
Candidate → Votes
*/
Candidate.hasMany(Vote, { foreignKey: "candidate_id" });
Vote.belongsTo(Candidate, { foreignKey: "candidate_id" });

/*
Election → Votes
*/
Election.hasMany(Vote, { foreignKey: "election_id" });
Vote.belongsTo(Election, { foreignKey: "election_id" });

export { User, Election, Candidate, Vote };