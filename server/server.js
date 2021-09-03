const express = require('express');
import mongoose from 'mongoose';
import { ApolloServer, gql } from 'apollo-server-express';
import isAuth from './middleware/is-auth.js';
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const schema = require('./schema.js')
const cors = require('cors')
const isAuthMiddleWare = require('./middleware/is-auth')

const server = async () => {
  const app = express();

  mongoose.set('useFindAndModify', false); //Avoid depricated functions for findOneAndModify


  const server = new ApolloServer({
    schema,
    graphiql: true,
    context: ({req, res}) => (isAuthMiddleWare(req, res))
  })

  //app.use(isAuthMiddleWare);
  server.applyMiddleware({ app })
  try {
    await mongoose.connect("mongodb+srv://testUser:XCphx5dG1usNDhmp@cluster0.flezh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { 
      useNewUrlParser: true,
      useUnifiedTopology: true 
    })
  }
  catch(err){ console.log(err) }
  

  app.listen({ port: 5000 }, () => {
    console.log("server started on port: 5000");
  })
} 

server();