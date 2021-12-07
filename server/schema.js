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



const MutationType = new GraphQLObjectType({
    name: 'MutationTest',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        done: { type: GraphQLBoolean }
    })
});

const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        date: { type: GraphQLString },
        estimatedTime: { type: GraphQLFloat },
        usedTime: { type: GraphQLFloat },
        authorId: { type: GraphQLString },
        clockifyId: { type: GraphQLString }
        /*fighters: {
            type: new GraphQLList(FighterType),
            resolve(parent, args) {
                return Fighter.find({ projectId: parent.id });
            }
        }*/
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
        date: { type: GraphQLString },
        time: { type: GraphQLString },

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


//Root-Query________________________________________________________

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        /*project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Project.findById(args.id);
            }
        },
        task: {
            type: TaskType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Task.findById(args.id);
            }
        },*/
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
        createdAssignments: {
            type: new GraphQLList(TaskType),
            resolve(parent, args, context) {
                if (!context.isAuth) {
                    throw new Error('Unauthenticated user');
                }
                return Task.find({ authorId: context.personId, assigneeId: { $ne: context.personId }, done: false });
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
        addProject: {
            type: ProjectType,
            args: {
                name: { type: GraphQLString },
                time: { type: GraphQLString },
                authorId: { type: GraphQLString },
            },
            async resolve(parent, args, context) {
                if (!context.isAuth) {
                    throw new Error('Unauthenticated user');
                }
                const person = await Person.findOne({ '_id': context.personId });
                if (!person.admin) {
                    throw new Error('Unauthorized user');
                }
                let project = new Project({
                    name: args.name,
                    time: args.time,
                    authorId: person.id
                });
                return project.save();
            }
        },
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
            },
            resolve(parent, args, context) {

                //Auth
                if (!context.isAuth) {
                    throw new Error('Unauthenticated user');
                }

                //TODO Check if assigning friend

                //Date & time
                let today = new Date();

                let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

                //Check if assignment or task
                let accepted = false;
                if(context.personId === args.assigneeId) {
                    accepted = true;
                }

                //New Task
                let task = new Task({
                    name: args.name,
                    weight: 1,
                    progress: 1,
                    assigneeId: args.assigneeId,
                    authorId: context.personId,
                    parentId: args.parentId,
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
        taskDone: {
            type: TaskType,
            args: {
                id: { type: GraphQLID },
                done: { type: GraphQLBoolean }
            },
            resolve(parent, args, context) {

                //TODO auth that modified task is assigned to modifier

                //Date & time
                var today = new Date();

                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

                return Task.findByIdAndUpdate(
                    args.id,
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
        taskAccepted: {
            type: TaskType,
            args: {
                id: { type: GraphQLID },
            },
            resolve(parent, args, context) {

                //TODO auth that modified task is assigned to modifier

                //Date & time
                var today = new Date();

                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

                return Task.findByIdAndUpdate(
                    args.id,
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
        taskIgnored: {
            type: TaskType,
            args: {
                id: { type: GraphQLID },
            },
            resolve(parent, args, context) {

                //TODO auth that modified task is assigned to modifier

                //Date & time
                var today = new Date();

                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

                return Task.findByIdAndUpdate(
                    args.id,
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
        commentLiked: { //Handles liking and un-liking
            type: CommentType,
            args: {
                id: { type: GraphQLID },
            },
            async resolve(parent, args, context) {
                const comment = await Comment.findById(args.id);
                if (comment === null || comment === undefined) {
                    throw new Error('Failed to find friend-request in database');
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
        deleteTask: {
            type: TaskType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                return Task.findByIdAndDelete(args.id, { useFindAndModify: false });
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});