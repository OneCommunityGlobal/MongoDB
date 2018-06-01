
use hgnData

db.userProjects.drop()

db.createView('userProjects', 
'userProfiles',
[
{$project : {_id:1 ,name : {$concat : ["$firstName", " ", "$lastName"]}, projects:1}},
{$lookup : { from: "projects", localField: "projects", foreignField: "_id", as: "projectDetails" } },
{$addFields: {projectDetails : {$filter : {input : "$projectDetails", as : "project", cond : {$eq: ["$$project.isActive", true]}}}}},
{$unwind: {path : "$projectDetails", preserveNullAndEmptyArrays: true}},
{$project : {_id:1,name:1, projectId :"$projectDetails._id", projectName :"$projectDetails.projectName"}},
{$group : {_id : "$_id", projects : {$addToSet :{projectId : "$projectId", projectName : "$projectName"} }}},
{$unwind : {path: "$projects", preserveNullAndEmptyArrays: true}},
{$sort : {_id : 1, "projects.projectName" : 1}},
{$group : {_id : "$_id", projects : {$push :"$projects" }}},


])