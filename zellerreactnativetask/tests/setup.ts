import '@testing-library/jest-native/extend-expect';

// Suppress console errors in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

// Mock Realm
jest.mock('realm', () => {
  // Create a mock Object class
  class MockRealmObject {
    static schema: any;
    toUser?: () => any;
  }

  const mockRealmInstance = {
    objects: jest.fn(() => []),
    objectForPrimaryKey: jest.fn(),
    create: jest.fn(),
    write: jest.fn(callback => {
      if (callback) callback();
    }),
    delete: jest.fn(),
    close: jest.fn(),
  };

  const Realm = jest.fn().mockImplementation(() => mockRealmInstance);
  Realm.open = jest.fn().mockResolvedValue(mockRealmInstance);
  Realm.Object = MockRealmObject;

  return {
    __esModule: true,
    default: Realm,
  };
});

// Mock Apollo Client
jest.mock('../src/config/graphql', () => ({
  apolloClient: {
    query: jest.fn(),
  },
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }: any) => children,
    SafeAreaView: ({ children, ...props }: any) =>
      React.createElement(View, props, children),
    useSafeAreaInsets: () => inset,
  };
});

// Mock react-native-pager-view
jest.mock('react-native-pager-view', () => {
  const React = require('react');
  const { View } = require('react-native');
  return React.forwardRef((props: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({
      setPage: jest.fn(),
    }));
    return React.createElement(View, props, props.children);
  });
});

// Mock Animated - React Native preset handles this
