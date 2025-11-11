/**
 * Zeller React Native Code Challenge
 *
 * @format
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './src/config/graphql';
import { UserListScreen } from './src/screens/UserListScreen';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <SafeAreaProvider>
        <UserListScreen />
      </SafeAreaProvider>
    </ApolloProvider>
  );
}

export default App;
