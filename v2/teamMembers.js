use hgnData

db.teamMembers.drop();


db.createView('teamMembers', 'userProfiles',
[
{$match: {isActive: true}},
{$project : {_id:1, teams:1, role:1, firstName:1, lastName:1}},
{$unwind:{ path: "$teams", preserveNullAndEmptyArrays:true}},
{$group : {_id: "$teams", members : 
  {$addToSet : {userid : "$_id", role : "$role" , fullName : {$concat : ["$firstName", " ", "$lastName"]  }}}}},
{$lookup: {
from: "userProfiles",
pipeline : [{$match : {isActive: true,role : {$in : ["Administrator", "Core Team"]} }},{$project : {_id: 0, userid : "$_id", role : "$role" , fullName : {$concat : ["$firstName", " ", "$lastName"]  }}}],
as : "admins"
}},
{$lookup: {from : "teams", localField: "_id", foreignField: "_id", as : "teamInfo"}},
{$project : {
_id:1 , teamName : {$arrayElemAt : ["$teamInfo.teamName", 0]},
members : {$setUnion: ["$members", "$admins"]}
}},

]
)