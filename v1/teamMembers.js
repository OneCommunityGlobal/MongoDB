use hgnData

db.teamMembers.drop();


db.createView('teamMembers', 'userProfiles',

[
{$match: {isActive: true}},
{$project : {_id:1, teams:1, role:1, firstName:1, lastName:1}},
{$unwind: "$teams"},
{$group : {_id: "$teams", members : {$addToSet : {userid : "$_id", role : "$role" , fullName : {$concat : ["$firstName", " ", "$lastName"]  }}}}}

])