use hgnData

db.myTeam.drop()


db.createView('myTeam', "userProfiles",[
{$match : {isActive:true}},
{$project : {_id:1, name : {$concat: ["$firstName", " ", "$lastName"]}, role:1, teams:1}},
{$unwind : {path:"$teams", preserveNullAndEmptyArrays:true}},
{$lookup : {from: "teamMembers", localField: "teams", foreignField: "_id", as : "teammembers"}},
{$project : {_id:1, name:1, role:1,teams:1, members : {$arrayElemAt: ["$teammembers.members", 0]}}},
{$unwind : "$members"},
{$group : {_id:{id:"$_id", name: "$name", role: "$role"},  myteam: {$addToSet : {_id : "$members.userid", fullName :"$members.fullName", role : "$members.role"}}}},
{$project: {_id: "$_id.id", name: "$_id.name", role: "$_id.role", myteam:1}}

])