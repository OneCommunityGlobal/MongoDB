use hgnData

db.myTeam.drop()


db.createView('myTeam', "userProfiles",[
{$facet: {

"teamsForNonAdmins":[{$match : {isActive: true ,role : {$nin: ["Core Team", "Administrator"]}}},
{$unwind: {path:"$teams", preserveNullAndEmptyArrays : true}},
{$project : {_id:1, role:1, teams:1, name : {$concat: ["$firstName", " ", "$lastName"]}}},
{$lookup : {
from : "userProfiles",
localField: "teams",
foreignField : "teams",
as : "members"
}},
{$unwind : "$members"},
{$match : {"members.isActive": true}},
{$group : {_id : {_id: "$_id", name : "$name", role : "$role"}, myteam : {$addToSet : {_id: "$members._id", 
  fullName:{$concat:[ "$members.firstName", " ","$members.lastName"]}, role:"$members.name"}} }}],
"teamsForAdmins" : [{$match : {isActive: true ,role : {$in: ["Core Team", "Administrator"]}}},
{$lookup : {
from: "userProfiles",
pipeline : [{$match : {isActive: true}}],
as : "allmembers"
}},
{$unwind : "$allmembers"},
{$group : {_id : {_id: "$_id", name : {$concat: ["$firstName", " ", "$lastName"]}, role : "$role"}, myteam : {$addToSet : {_id: "$allmembers._id", 
  fullName:{$concat:[ "$allmembers.firstName", " ","$allmembers.lastName"]}, role:"$allmembers.role"}} }}] 
}},

{$project: {allMembers:{$setUnion:['$teamsForNonAdmins','$teamsForAdmins']}}},
{$unwind: "$allMembers"},
{$replaceRoot: { newRoot: "$allMembers" }},
{$project : {_id : "$_id._id", name : "$_id.name", role: "$_id.role", myteam:1 }}

])