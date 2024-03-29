const graphql = require('graphql');
const Task = require('./models/task');
const FriendRequest = require('./models/friendRequest');
const Person = require('./models/person');
const _ = require('lodash');
const Project = require('./models/project')
const Comment = require('./models/comment')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLFloat,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean
} = graphql;



const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        createdTimeStamp: {type: GraphQLInt},
        creatorId: { type: GraphQLString },
        adminIds: {type: GraphQLList(GraphQLString)},
        memberIds: {type: GraphQLList(GraphQLString)},
        
        simplifiedTasks: {type: GraphQLBoolean},
        inviteRequired: {type: GraphQLBoolean},
        inviteAdminExclusive: {type: GraphQLBoolean},

        creator: {
            type: PersonType,
            resolve(parent, args) {
                return Person.findById(parent.creatorId);
            }
        },
        admins: {
            type: new GraphQLList(PersonType),
            resolve(parent, args) {
                return Person.find({ '_id': { $in: parent.adminIds } });
            }
        },
        members: {
            type: new GraphQLList(PersonType),
            resolve(parent, args) {
                return Person.find({ '_id': { $in: parent.memberIds } });
            }
        }
    })
})

const TaskType = new GraphQLObjectType({
    name: 'Task',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        progress: { type: GraphQLInt },
        weight: { type: GraphQLInt },
        parentId: { type: GraphQLID },
        authorId: { type: GraphQLString },
        assigneeId: { type: GraphQLString },
        projectId: {type: GraphQLString},
        date: { type: GraphQLString },
        time: { type: GraphQLString },
        plannedDate: {type: GraphQLString},

        done: { type: GraphQLBoolean },
        timestampDone: { type: GraphQLInt },
        dateDone: { type: GraphQLString },
        timeDone: { type: GraphQLString },

        accepted: { type: GraphQLBoolean },
        timestampAccepted: { type: GraphQLInt },
        dateAccepted: { type: GraphQLString },
        timeAccepted: { type: GraphQLString },

        ignored: { type: GraphQLBoolean },
        timestampIgnored: { type: GraphQLInt },
        dateIgnored: { type: GraphQLString },
        timeIgnored: { type: GraphQLString },

        author: {
            type: PersonType,
            resolve(parent, args) {
                return Person.findById(parent.authorId);
            }
        },
        assignee: {
            type: PersonType,
            resolve(parent, args) {
                return Person.findById(parent.assigneeId);
            }
        },
        comments: {
            type: new GraphQLList(CommentType),
            resolve(parent, args) {
                return Comment.find({ taskId: parent.id });
            }
        },
        subtasks: {
            type: new GraphQLList(TaskType),
            resolve(parent, args) {
                return Task.find({ parentId: parent.id });
            }
        },
        parent: {
            type: TaskType,
            resolve(parent, args) {
                return Task.findById(parent.parentId);
            }
        }
    })
});

const CommentType = new GraphQLObjectType({
    name: 'Comment',
    fields: () => ({
        id: { type: GraphQLID },
        text: { type: GraphQLString },
        authorId: { type: GraphQLString },
        taskId: { type: GraphQLString },
        likes: { type: GraphQLList(GraphQLString) },

        date: { type: GraphQLString },
        time: { type: GraphQLString },
        timestamp: { type: GraphQLInt },

        author: {
            type: PersonType,
            resolve(parent, args) {
                return Person.findById(parent.authorId);
            }
        },
        parent: {
            type: TaskType,
            resolve(parent, args) {
                return Task.findById(parent.parentId);
            }
        },
        likers: {
            type: new GraphQLList(PersonType),
            resolve(parent, args) {
                return Person.find({ '_id': { $in: parent.likes } });
            }
        }
    })
});

const PersonType = new GraphQLObjectType({
    name: 'Person',
    fields: () => ({
        id: { type: GraphQLID },
        fname: { type: GraphQLString },
        lname: { type: GraphQLString },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        admin: { type: GraphQLBoolean },
        password: { type: GraphQLString },
        friendIds: { type: GraphQLList(GraphQLString) },
        tasks: {
            type: new GraphQLList(TaskType),
            resolve(parent, args) {
                return Task.find({ assigneeId: parent.id });
            }
        },
        friends: {
            type: new GraphQLList(PersonType),
            resolve(parent, args) {
                return Person.find({ '_id': { $in: parent.friendIds } });
            }
        }
    })
});

const FriendRequestType = new GraphQLObjectType({
    name: 'FriendRequest',
    fields: () => ({
        id: { type: GraphQLID },
        senderId: { type: GraphQLString },
        recieverId: { type: GraphQLString },
        answer: { type: GraphQLBoolean },
        valid: { type: GraphQLBoolean },
        sender: {
            type: PersonType,
            resolve(parent, args) {
                return Person.findById(parent.senderId);
            }
        }
    })
})

const AuthType = new GraphQLObjectType({
    name: 'Auth',
    fields: () => ({
        personId: { type: GraphQLID },
        token: { type: GraphQLString },
        tokenExpiration: { type: GraphQLInt },
        admin: { type: GraphQLBoolean }
    })
})

const ProgressType = new GraphQLObjectType({
    name: 'Progress',
    fields: () => ({
        amntPlanned: { type: GraphQLInt },
        amntDone: { type: GraphQLInt }
    })
})

//Helper methods____________________________________________________
function checkExists(object, objectName){
    if (object === null || object === undefined) {
        throw new Error("Failed to find " + (objectName.split("").length > 0 ? objectName : "object") + " in database");
    }
    return true
}

//Authorization verification methods________________________________

async function checkProjectRole(projectId, personId, typeCheck, project){
    if(project === null){
        project = await Project.findOne({'_id' : projectId})
        checkExists(project, "Project")
    }   

    if(typeCheck === "member" && project.memberIds.includes(personId)){
        return true
    }
    else if(typeCheck === "admin" && project.adminIds.includes(personId)){
        return true
    } 
    else if(typeCheck === "owner" && project.creatorId === personId){
        return true
    }
    else{
        throw new Error("Unauthorized: You do not have the required auhtorization.");
    }
}


//Root-Query________________________________________________________

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        profile: {
            type: PersonType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args, context) {
                //Check if self
                if(args.id === context.personId) return Person.findOne({'_id': context.personId});

                //Check if friend
                const target = await Person.findOne({'_id': args.id});
                if(target.friendIds.includes(context.personId)) return target

                //Check if person is sender of friend request
                const targetFriendReq = await FriendRequest.findOne({senderId: args.id, recieverId: context.personId})
                if(targetFriendReq.senderId === args.id) return target

                return null
            }
        },
        tasks: {
            type: new GraphQLList(TaskType),
            resolve(parent, args, context) {
                if (!context.isAuth) {
                    throw new Error('Unauthenticated user');
                }
                return Task.find({ assigneeId: context.personId, done: false, ignored: {$ne: true} });
            }
        },
        tasksInProject: {
            type: new GraphQLList(TaskType),
            args: {
                id: {type: GraphQLString},
                includeCompleted: {type: GraphQLBoolean},
            },
            async resolve(parent, args, context) {
                if (!context.isAuth) {
                    throw new Error('Unauthenticated user');
                }

                //Validate data-access-rights
                const project = await Project.find({
                    '_id': args.id, 
                    $or: [
                        { adminIds: context.personId},
                        { memberIds: context.personId},
                    ]}
                )
                checkExists(project, "Project")
                
                let tasks;
                if(args.includeCompleted){
                    tasks = await Task.find({ projectId: args.id });
                } else{
                    tasks = await Task.find({ projectId: args.id, done: false });
                }
                return tasks;
            }
        },
        progress: {
            // TODO: receive input for a specified date
            type: ProgressType,
            async resolve(parent, args, context) {
                if (!context.isAuth) {
                    throw new Error('Unauthenticated user');
                }
                var today = new Date();
                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

                const amntPlanned = await Task.find({ assigneeId: context.personId, plannedDate: date, ignored: {$ne: true} });
                const amntDone = await Task.find({ assigneeId: context.personId, plannedDate: date, done: true, ignored: {$ne: true} });

                return { amntPlanned: amntPlanned.length, amntDone: amntDone.length };
            }
        },
        createdAssignments: {
            type: new GraphQLList(TaskType),
            resolve(parent, args, context) {
                if (!context.isAuth) {
                    throw new Error('Unauthenticated user');
                }
                return Task.find({ authorId: context.personId, $and: [{assigneeId: {$ne: context.personId}}, {assigneeId: {$ne: null}}] , done: false });
            }
        },
        comments: {
            type: new GraphQLList(CommentType),
            args: { taskId: { type: GraphQLID } },
            resolve(parent, args, context) {
                if (!context.isAuth) {
                    throw new Error('Unauthenticated user');
                }
                return Comment.find({ taskId: args.taskId });
            }
        },
        /*persons: {
            type: new GraphQLList(PersonType),
            resolve(parent, args) {
                return Person.find({});
            }
        },*/
        friendRequests: {
            type: new GraphQLList(FriendRequestType),
            resolve(parent, args, context) {
                return FriendRequest.find({ recieverId: context.personId, answer: false, valid: true })
            }
        },
        friends: {
            type: new GraphQLList(PersonType),
            async resolve(parent, args, context) {
                const person = await Person.findById(context.personId);
                if (person === null || person === undefined) {
                    throw new Error('Failed to find person in database');
                }
                return Person.find({ '_id': { $in: person.friendIds } }); //Does'nt work with id, must be '_id' since string-array

            }
        },
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args, context) {
                if (!context.isAuth) {
                    throw new Error('Unauthenticated user');
                }
                return Project.find({ 
                    $or: [
                        { adminIds: context.personId},
                        { memberIds: context.personId},
                    ]
                })
            }
        },
        project: {
            type: ProjectType,
            args: {
                id: {type: GraphQLString},
            },
            resolve(parent, args, context) {
                if (!context.isAuth) {
                    throw new Error('Unauthenticated user');
                }
                return Project.findOne({ 
                    $or: [
                        { '_id': args.id, adminIds: context.personId},
                        { '_id': args.id, memberIds: context.personId},
                    ]
                })
            }
        },
        login: {
            type: AuthType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(parent, args) {
                const person = await Person.findOne({ email: args.email });
                if (!person) {
                    throw new Error('User does not exist');
                }
                const isEqual = await bcrypt.compare(args.password, person.password);
                if (!isEqual) {
                    throw new Error('Wrong password'); //Change to invalid input after testing
                }
                const token = jwt.sign({ personId: person.id, email: person.email }, 'somesupersecretkey', {
                    expiresIn: '2h'
                });
                return { personId: person.id, token: token, tokenExpiration: 1, admin: person.admin }
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addPerson: {
            type: PersonType,
            args: {
                fname: { type: GraphQLString },
                lname: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(parent, args, context) {
                return Person.findOne({ email: args.email })

                .then(person => {
                    if (person) {
                        throw new Error('User already exists.');
                    }
                    return bcrypt.hash(args.password, 12)
                })
                .then(hashedPassword => {
                    let person = new Person({
                        fname: args.fname,
                        lname: args.lname,
                        name: args.fname + " " + args.lname,
                        email: args.email,
                        password: hashedPassword,
                        admin: false,
                        friendIds: [],
                    });
                    return person.save();
                })
                .then(result => {
                    return { ...result._doc, _id: result.id }
                })
                .catch(err => {
                    throw err;
                });
            }
        },
        editProfile: {
            type: PersonType,
            args: {
                curPassword: {type: GraphQLString},
                newFName: {type: GraphQLString},
                newLName: {type: GraphQLString},
                newEmail: {type: GraphQLString},
                newPassword: {type: GraphQLString}
            },
            async resolve(parent, args, context){
                
                if (!context.isAuth) { //Auth
                    throw new Error('Unauthenticated user');
                }

                //Validate current password
                const person = await Person.findOne({ '_id': context.personId });
                const isEqual = await bcrypt.compare(args.curPassword, person.password);
                if (!isEqual) {
                    throw new Error('Wrong password'); //Change to invalid input after testing
                }

                //Check wether the password should be changed or not
                let newPasswordHashed;
                if(args.newPassword.split("").length === 0){
                    newPasswordHashed = person.password;
                } else{
                    newPasswordHashed = await bcrypt.hash(args.password, 12);
                }
                
                //Update db and return updated person-document
                return Person.findByIdAndUpdate(
                    context.personId, 
                    {   
                        fname: args.newFName,
                        lname: args.newLName,
                        name: args.newFName + " " + args.newLName,
                        email: args.newEmail,
                        password: newPasswordHashed 
                    }, 
                    { new: true }
                );
            }
        },
        addTask: {
            type: TaskType,
            args: {
                name: { type: GraphQLString },
                assigneeId: { type: GraphQLString },
                parentId: { type: GraphQLString },
                projectId: {type: GraphQLString},
            },
            async resolve(parent, args, context) {

                //Auth
                if (!context.isAuth) {
                    throw new Error('Unauthenticated user');
                }

                //Check if assignment or task
                let accepted = false;
                if(context.personId === args.assigneeId) {
                    accepted = true;
                }
                else{ //Check if assigning friend
                    const person = await Person.findOne({ '_id': context.personId })
                    if (!person.friendIds.includes(args.assigneeId)) {
                        throw new Error('Error creating task: Assignee not in users friendslist');
                    }
                }

                //Date & time
                let today = new Date();
                let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

                //New Task
                let task = new Task({
                    name: args.name,
                    weight: 1,
                    progress: 1,
                    assigneeId: args.assigneeId,
                    authorId: context.personId,
                    parentId: args.parentId,
                    projectId: args.projectId,
                    date: date,
                    time: time,

                    done: false,
                    accepted: accepted,
                    ignored: false,
                });
                return task.save();
            }
        },
        addComment: {
            type: CommentType,
            args: {
                text: { type: GraphQLString },
                taskId: { type: GraphQLString },
            },
            resolve(parent, args, context) {
                
                if (!context.isAuth) { //Auth
                    throw new Error('Unauthenticated user');
                }

                //Date & time
                let today = new Date();
                let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

                //New Task
                let comment = new Comment({
                    text: args.text,
                    taskId: args.taskId,
                    authorId: context.personId,
                    likes: [],

                    date: date,
                    time: time,
                    timestamp: today.getTime(),
                });
                return comment.save();
            }
        },
        addProject: {
            type: ProjectType,
            args: {
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                simplifiedTasks: { type: GraphQLBoolean },
                inviteRequired: { type: GraphQLBoolean },
                inviteAdminExclusive: { type: GraphQLBoolean },
            },
            async resolve(parent, args, context) {
                
                if (!context.isAuth) { //Auth
                    throw new Error('Unauthenticated user');
                }

                let timestamp = new Date();

                //New Project
                let project = new Project({
                    name: args.name,
                    description: args.description,
                    createdTimestamp: timestamp.getTime(),
                    creatorId: context.personId,
                    adminIds: [context.personId],
                    memberIds: [context.personId],

                    simplifiedTasks: args.simplifiedTasks,
                    inviteRequired: args.inviteRequired,
                    inviteAdminExclusive: args.inviteAdminExclusive,
                });
                return project.save();

            }
        },
        sendFriendRequest: {
            type: FriendRequestType,
            args: { email: { type: GraphQLString } },
            async resolve(parent, args, context) {
                //Auth
                if (!context.isAuth) {
                    throw new Error('Unauthenticated user');
                }

                //Verify reciever and get their id
                const reciever = await Person.findOne({ email: args.email });
                if (reciever === undefined || reciever === null) {
                    throw new Error('No user with that email');
                }
                if (reciever.id === context.personId) {
                    throw new Error('Cannot send request to self');
                }

                //Check if request already sent to recipient
                const similarRequests = await FriendRequest.findOne({
                    senderId: context.personId,
                    recieverId: reciever.id,
                    valid: true
                })
                if (similarRequests !== undefined && similarRequests !== null) {
                    throw new Error('Cannot send multiple requests to the same person');
                }

                //New FriendRequest
                let friendRequest = new FriendRequest({
                    senderId: context.personId,
                    recieverId: reciever.id,
                    answer: false,
                    valid: true,
                })
                return friendRequest.save();
            }
        },
        /*selectWinner: {
            type: MatchType,
            args: {
                id: { type: GraphQLString },
                winner: { type: GraphQLString },
                winnerP: { type: GraphQLString },
                loser: { type: GraphQLString },
                loserP: { type: GraphQLString },
            },
            async resolve(parent, args, context) {
                console.log('_________________________________')
                console.log(args.winner)
                console.log(args.loser)
                console.log(args.winnerP)
                console.log(args.loserP)
                if (!context.isAuth) { //Check if auth
                    throw new Error('Unauthenticated user');
                }
                const person = await Person.findById(context.personId); //Check if admin
                if (!person.admin) {
                    throw new Error('Unauthorized user');
                }

                //get and test data
                const fighterW = await Fighter.findById(args.winner);
                if(!fighterW){
                    console.log('Could not find fighterW');
                    throw new Error('Could not find fighterW')
                }
                const fighterL = await Fighter.findById(args.loser);
                if(!fighterL){
                    console.log('Could not find fighterL');
                    throw new Error('Could not find fighterL')
                }
                const personW = await Person.findById(args.winnerP);
                if(!personW){
                    console.log('Could not find personW');
                    throw new Error('Could not find personW')
                }
                const personL = await Person.findById(args.loserP);
                if(!personL){
                    console.log('Could not find personL');
                    throw new Error('Could not find personL')
                }

                //Update Figher-scores
                const fwWins = fighterW.wins += 1;
                await Fighter.findByIdAndUpdate(args.winner, { wins: fwWins }, { new: true, useFindAndModify: false });

                
                const flLosses = fighterL.losses += 1;
                await Fighter.findByIdAndUpdate(args.loser, { losses: flLosses }, { new: true, useFindAndModify: false })

                //Update Person-scores
                const pwWins = personW.wins += 1;
                await Person.findByIdAndUpdate(args.winnerP, { wins: pwWins }, { new: true, useFindAndModify: false });

                
                const plLosses = personL.losses += 1;
                await Person.findByIdAndUpdate(args.loserP, { losses: plLosses }, { new: true, useFindAndModify: false })

                //Update and return match
                return Match.findByIdAndUpdate(args.id, { winner: args.winner }, { new: true, useFindAndModify: false });
            }
        },*/
        answerFriendRequest: {
            type: FriendRequestType,
            args: {
                id: { type: GraphQLString },
                answer: { type: GraphQLBoolean },
                senderId: { type: GraphQLString }
            },
            async resolve(parent, args, context) {
                //Validate friend request
                const friendRequest = await FriendRequest.findById(args.id);
                if (friendRequest === null || friendRequest === undefined) {
                    throw new Error('Failed to find friend-request in database');
                }

                if (args.answer) { //If accepted
                    //Add sender to recipient's friend list
                    await Person.findByIdAndUpdate(
                        context.personId, { $push: { friendIds: friendRequest.senderId } }, { new: true }
                    );

                    //Add reciever to sender's friend list
                    await Person.findByIdAndUpdate(
                        friendRequest.senderId, { $push: { friendIds: context.personId } }, { new: true }
                    );

                    //Modify friend request with given answer

                    return FriendRequest.findByIdAndUpdate(
                        args.id, { answer: true }, { new: true }
                    );
                }
                return FriendRequest.findByIdAndUpdate( //If rejected
                    args.id, { valid: false }, { new: true }
                );
            }
        },
        removeFriend: {
            type: PersonType,
            args: {
                friendId: { type: GraphQLID }
            },
            async resolve(parent, args, context) {
                //Validation of recipient unecessary, 
                //will only remove the specific person if already in network

                //TODO: Remove shared tasks?

                //Invalidate saved friend requests (cannot send a new friend request atm.)
                await FriendRequest.updateOne(
                    {
                        $or: [ //Check for both possible combinations of senders and recipients
                            { senderId: context.personId, recieverId: args.friendId, valid: true },
                            { senderId: args.friendId, recieverId: context.personId, valid: true },
                        ]
                    },
                    { valid: false },
                    {}
                )

                //Remove the removing party from the other party's network
                await Person.findByIdAndUpdate(
                    args.friendId, { $pull: { friendIds: context.personId } }, { new: true }
                )

                //Remove the other party form the remover's network
                return Person.findByIdAndUpdate(
                    context.personId, { $pull: { friendIds: args.friendId } }, { new: true }
                )
            }
        },
        completeTask: {
            type: TaskType,
            args: {
                id: { type: GraphQLID },
                done: { type: GraphQLBoolean }
            },
            async resolve(parent, args, context) {
                //Auth
                if (!context.isAuth) {
                    throw new Error('Unauthenticated user');
                }

                //Date & time
                var today = new Date();

                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

                return Task.updateMany(
                    {'_id': args.id, assigneeId: context.personId},
                    {
                        done: args.done,
                        timestampDone: today.getTime(),
                        dateDone: date,
                        timeDone: time
                    },
                    { new: true }
                );
            }
        },
        acceptTask: {
            type: TaskType,
            args: {
                id: { type: GraphQLID },
            },
            async resolve(parent, args, context) {
                //Auth
                if (!context.isAuth) {
                    throw new Error('Unauthenticated user');
                }

                //Date & time
                var today = new Date();

                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

                return Task.updateMany(
                    {'_id': args.id, assigneeId: context.personId},
                    {
                        accepted: true,
                        timestampAccepted: today.getTime(),
                        dateAccepted: date,
                        timeAccepted: time
                    },
                    { new: true }
                );
            }
        },
        ignoreTask: {
            type: TaskType,
            args: {
                id: { type: GraphQLID },
            },
            async resolve(parent, args, context) {
                //Auth
                if (!context.isAuth) {
                    throw new Error('Unauthenticated user');
                }

                //Date & time
                var today = new Date();

                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

                return Task.updateMany(
                    {'_id': args.id, assigneeId: context.personId},
                    {
                        ignored: true,
                        timestampIgnored: today.getTime(),
                        dateIgnored: date,
                        timeIgnored: time
                    },
                    { new: true }
                );
            }
        },
        planTask: {
            type: TaskType,
            args: {
                id: { type: GraphQLString },
            },
            resolve(parent, args, context) {
                //Auth
                if (!context.isAuth) {
                    throw new Error('Unauthenticated user');
                }

                //Date & time
                var today = new Date();
                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

                return Task.updateMany(
                    {'_id': args.id, assigneeId: context.personId},
                    {
                        plannedDate: date
                    },
                    { new: true }
                );
            }
        },
        planTasks: {
            type: TaskType,
            args: {
                id: { type: GraphQLList(GraphQLString) },
            },
            resolve(parent, args, context) {
                //Auth
                if (!context.isAuth) {
                    throw new Error('Unauthenticated user');
                }

                //Date & time
                var today = new Date();
                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

                return Task.updateMany(
                    {'_id': {$in: args.id}, assigneeId: context.personId},
                    {
                        plannedDate: date
                    },
                    { new: true }
                );
            }
        },
        deleteTask: {
            type: TaskType,
            args: {
                id: { type: GraphQLID }
            },
            async resolve(parent, args, context) {
                //Auth
                if (!context.isAuth) {
                    throw new Error('Unauthenticated user');
                }

                const task = await Task.findById(args.id)
                if (task.authorId !== context.personId && task.assigneeId !== context.personId) {
                    throw new Error('Cannot delete task: Unauthorized');
                }

                return Task.findByIdAndDelete(args.id, { useFindAndModify: false });
            }
        },
        likeComment: { //Handles liking and un-liking
            type: CommentType,
            args: {
                id: { type: GraphQLID },
            },
            async resolve(parent, args, context) {
                const comment = await Comment.findById(args.id);
                if (comment === null || comment === undefined) {
                    throw new Error('Failed to find comment in database');
                }

                //TODO consider adding auth that only authorized people can like comment

                if(comment.likes.includes(context.personId)){ //Already liked -> un-like
                    return Comment.findByIdAndUpdate(
                        args.id, { $pull: { likes: context.personId } }, { new: true }
                    )
                } else{ //Else -> like
                    return Comment.findByIdAndUpdate(
                        args.id, { $push: { likes: context.personId } }, { new: true }
                    )
                }
            }
        },
        deleteComment: {
            type: CommentType,
            args: {
                id: { type: GraphQLID},
            },
            resolve(parent, args, context) {
                //TODO: check auth

                return Comment.findByIdAndDelete(args.id, { useFindAndModify: false });
            }
        },
        addPersonToProject: {
            type: ProjectType,
            args: {
                projectId: {type: GraphQLID},
                newMemberId: {type: GraphQLID},
                asAdmin: {type: GraphQLBoolean},
            },
            async resolve(parent, args, context){
                //If adding member -> admin/owner requiered, if adding admin -> owner required
                if (args.asAdmin) {
                    checkProjectRole(args.projectId, context.personId, "owner", null)
                } else{
                    checkProjectRole(args.projectId, context.personId, "admin", null)
                }

                if (args.asAdmin) {
                    await Project.findByIdAndUpdate(
                        args.projectId, 
                        { 
                            $push: { memberIds: args.newMemberId },
                            $push: { adminIds: args.newMemberId},
                        }, 
                        { new: true }
                    );
                } else {
                    await Project.findByIdAndUpdate(
                        args.projectId, { $push: { memberIds: args.newMemberId } }, { new: true }
                    );
                }
            }
        },
        removePersonFromProject: {
            type: ProjectType,
            args: {
                projectId: {type: GraphQLID},
                userId: {type: GraphQLID},
            },
            async resolve(parent, args, context) {                

                const project = await Project.findOne({'_id' : args.projectId})
                checkExists(project, "Project")

                if (project.creatorId === context.personId) {
                    if(context.personId === args.userId) { //Error if owner tries to remove themselves
                        throw new Error("An owner cannot leave their own project, consider deleting the project instead.");
                    }
                    else if(project.adminIds.includes(args.userId)){ //When owner removes an admin
                        await Project.findByIdAndUpdate(
                            args.projectId, 
                            { 
                                $pull: { memberIds: args.userId },
                                $pull: { adminIds: args.userId } 
                            }, 
                            { new: true }
                        )
                    }
                    else{ //When owner removes a member
                        args.projectId, { $pull: { memberIds: args.userId } }, { new: true }
                    }
                }
                else if (project.adminIds.includes(context.personId) && (project.creatorId !== args.userId && !project.adminIds.includes(args.personId))){ //When an admin removes a member
                    await Project.findByIdAndUpdate(
                        args.projectId, { $pull: { memberIds: args.userId } }, { new: true }
                    )                
                }
                else{
                    throw new Error("Unauthorized: You do not have the required auhtorization.");
                }
            }
        },
        leaveProject: {
            type: ProjectType,
            args: {
                projectId: {type: GraphQLID},
            },
            async resolve(parent, args, context) {                

                const project = await Project.findOne({'_id' : args.projectId})
                checkExists(project, "Project")

                if (project.creatorId === context.personId) { //Error if the owner attempts to leave their own project
                    throw new Error("An owner cannot leave their own project, consider deleting the project instead.");
                }
                else if (project.adminIds.includes(context.personId)){ //When an admin leaves
                    await Project.findByIdAndUpdate(
                        args.projectId, 
                        { 
                            $pull: { memberIds: context.personId },
                            $pull: { adminIds: context.personId } 
                        }, 
                        { new: true }
                    )             
                }
                else{ //When a member leaves
                    await Project.findByIdAndUpdate(
                        args.projectId, { $pull: { memberIds: context.personId } }, { new: true }
                    )   
                }
            }
        }

    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});