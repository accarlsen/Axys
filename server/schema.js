const graphql = require('graphql');
const Task = require('./models/task');
const Person = require('./models/person');
const _ = require('lodash');
const mutationTest = require('./models/mutationTest');
const Project = require('./models/project')
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
        description: { type: GraphQLString},
        date: { type: GraphQLString },
        estimatedTime: { type: GraphQLFloat},
        usedTime: { type: GraphQLFloat},
        authorId: { type: GraphQLString },
        clockifyId: { type: GraphQLString}
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
        done: { type: GraphQLBoolean },
        progress: { type: GraphQLInt },
        weight: { type: GraphQLInt },
        parentId: { type: GraphQLID },
        authorId: { type: GraphQLString},
        author: {
            type: PersonType,
            resolve(parent, args) {
                return Person.findById(parent.authorId);
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

const PersonType = new GraphQLObjectType({
    name: 'Person',
    fields: () => ({
        id: { type: GraphQLID },
        fname: { type: GraphQLString },
        lname: { type: GraphQLString },
        email: { type: GraphQLString },
        admin: { type: GraphQLBoolean },
        password: { type: GraphQLString },
        tasks: {
            type: new GraphQLList(TaskType),
            resolve(parent, args) {
                return Task.find({ authorId: parent.id });
            }
        }
    })
});

const AuthType = new GraphQLObjectType({
    name: 'Auth',
    fields: () => ({
        personId: { type: GraphQLID },
        token: { type: GraphQLString },
        tokenExpiration: { type: GraphQLInt },
        admin: { type: GraphQLBoolean}
    })
})


//Root-Query________________________________________________________

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        project: {
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
        },
        person: {
            type: PersonType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Person.findById(args.id);
            }
        },
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args, context) {
                if (!context.isAuth) {
                    throw new Error('Unauthenticated user');
                }
                return Project.find();
            }
        },
        tasks: {
            type: new GraphQLList(TaskType),
            args: { authorId: { type: GraphQLID } },
            resolve(parent, args, context) {
                if (!context.isAuth) {
                    throw new Error('Unauthenticated user');
                }
                return Task.find({ authorId: args.authorId, done: false });
            }
        },
        persons: {
            type: new GraphQLList(PersonType),
            resolve(parent, args) {
                return Person.find({});
            }
        },
        login: {
            type: AuthType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(parent, args) {
                console.log(args.email)
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
                /*
                return Person.findOne({email: args.email})
                .then(person => {
                    if(!person){
                        throw new Error('User does not exist');
                    }
                    return bcrypt.compare(args.password, person.password);
                })
                .then(isEqual => {
                    if (!isEqual){
                        throw new Error('Wrong password'); //Change to invalid input after testing
                    }
                    const token = jwt.sign({personId: person.id, email: person.email}, 'somesupersecretkey', {
                        expiresIn: '1h'
                    });
                    return { personId: person.id, token: token, tokenExpiration: 1}
                })
                .catch(err => {
                    throw err
                });
                    */

            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addMutationTest: {
            type: MutationType,
            args: {
                name: { type: GraphQLString },
                done: { type: GraphQLBoolean }
            },
            resolve(parent, args, req) {
                if (!req.isAuth) {
                    throw new Error('Unauthenticated user');
                }
                let mt = new mutationTest({
                    name: args.name,
                    done: args.done
                });
                return mt.save();
            }
        },
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
                const person = await Person.findById(context.personId);
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
                /*if (!context.isAuth) { //Check if auth
                    throw new Error('Unauthenticated user');
                }
                const person1 = await Person.findById(context.personId); //Check if admin
                if (!person1.admin) {
                    throw new Error('Unauthorized user');
                }*/

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
                            email: args.email,
                            password: hashedPassword,
                            admin: false,
                            wins: 0,
                            losses: 0
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
        addTask: {
            type: TaskType,
            args: {
                name: { type: GraphQLString },
                authorId: { type: GraphQLString },
                parentId: { type: GraphQLString },
            },
            resolve(parent, args, context) {
                if (!context.isAuth) {
                    throw new Error('Unauthenticated user');
                }
                let task = new Task({
                    name: args.name,
                    done: false,
                    weight: 1,
                    progress: 1,
                    authorId: args.authorId,
                    parentId: args.parentId,
                });
                return task.save();
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
        taskDone: {
            type: TaskType,
            args: {
                id: { type: GraphQLID },
                done: { type: GraphQLBoolean }
            },
            resolve(parent, args) {
                return Task.findByIdAndUpdate(args.id, { done: args.done }, { new: true });
                //return Task.findById(args.id);

            }
        },
        deleteTask: {
            type: TaskType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(args) {
                return Task.findByIdAndDelete(args.id, { useFindAndModify: false });
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});