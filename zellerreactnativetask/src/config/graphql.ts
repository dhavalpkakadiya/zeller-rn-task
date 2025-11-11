import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { Platform } from 'react-native';

const getGraphQLUri = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:9002/graphql';
    }
    return 'http://localhost:9002/graphql';
  }
  return 'http://localhost:9002/graphql';
};

const httpLink = new HttpLink({
  uri: getGraphQLUri(),
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
});
