use hgnData

db.myTeam.drop()


db.createView('myTeam', "userProfiles",[
{$match : {isActive:true}},
{$project : {_id:1, firstName:1, lastName:1, teams:1}},
{$unwind : "$teams"},
{$lookup : {from: "teamMembers", localField: "teams", foreignField: "_id", as : "teammembers"}},
{$project : {_id:1, lastName:1, firstName:1,teams:1, members : {$arrayElemAt: ["$teammembers.members", 0]}}},
{$unwind : "$members"},
{$group : {_id: "$_id",  myteam: {$addToSet : {_id : "$members.userid", fullName :"$members.fullName", role : "$members.role"}}}}

])