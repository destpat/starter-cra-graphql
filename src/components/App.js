import React from 'react';
import AppRouter from './router/AppRouter';
import { ApolloProvider } from 'react-apollo';
import { client } from './apolloClient';
import './App.css';

function App() {
  return (
    <ApolloProvider client={client}>
      <AppRouter />
    </ApolloProvider>
  );
}

export default App;
