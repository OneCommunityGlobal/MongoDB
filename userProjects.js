use hgnData

db.userProjects.drop()

db.createView('userProjects', 
'userProfiles',
[
{$unwind : "$projects"},
{$project : {_id:1 , projects:1}},
{$lookup : { from: "projects", localField: "projects", foreignField: "_id", as: "projectDetails" } },
{$unwind: "$projectDetails"},
{$project : {_id:1, projectId :"$projectDetails._id", projectName :"$projectDetails.projectName", tasks : "$projectDetails.tasks"}},
{$group : {_id : "$_id", projects : {$addToSet :{projectId : "$projectId", projectName : "$projectName", tasks : "$tasks"} }}}


])



