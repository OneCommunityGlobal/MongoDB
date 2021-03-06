
use hgnData

db.userProjects.drop()

db.createView('userProjects', 
'userProfiles',
[
{$unwind : "$projects"},
{$project : {_id:1 , projects:1}},
{$lookup : { from: "projects", localField: "projects", foreignField: "_id", as: "projectDetails" } },
{$unwind: {path : "$projectDetails", preserveNullAndEmptyArrays: true}},
{$match : {"projectDetails.isActive": true}},
{$project : {_id:1, projectId :"$projectDetails._id", projectName :"$projectDetails.projectName"}},
{$sort : {_id: 1, projectName : -1}},
{$group : {_id : "$_id", projects : {$addToSet :{projectId : "$projectId", projectName : "$projectName"} }}},
{$unwind : "$projects"},
{$sort : {_id : 1, "projects.projectName" : 1}},
{$group : {_id : "$_id", projects : {$push :"$projects" }}},

])