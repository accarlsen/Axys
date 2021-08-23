import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import AuthContext from './context/auth-context';
import {setContext} from 'apollo-link-context';
import {createUploadLink} from 'apollo-upload-client';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { onError } from 'apollo-link-error'
import { Token } from 'graphql';

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message))
})

const authLink = setContext((_, {headers}) => {
  const token = localStorage.getItem('token');
  console.log(token);
  return{
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(createUploadLink({uri: 'http://localhost:5000/graphql'})),
  cache: new InMemoryCache(),

})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App/>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();