import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import getCurrentUser from './utils/firebase/getCurrentUser';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_API_URL,
});

const authLink = setContext(async (_, { headers }) => {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser) {
      const token = await currentUser.getIdToken();
      return {
        headers: {
          ...headers,
          authorization: token,
        },
      };
    }
  } catch (e) {
    console.log(e);
  }
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
