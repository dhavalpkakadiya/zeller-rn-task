import { gql } from '@apollo/client';
import { apolloClient } from '../config/graphql';
import { User } from '../types/User';

const LIST_ZELLER_CUSTOMERS = gql`
  query ListZellerCustomers(
    $filter: TableZellerCustomerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listZellerCustomers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        email
        role
      }
      nextToken
    }
  }
`;

interface ZellerCustomer {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
}

interface ListZellerCustomersResponse {
  listZellerCustomers: {
    items: ZellerCustomer[];
    nextToken: string | null;
  };
}

export const fetchUsersFromAPI = async (): Promise<User[]> => {
  try {
    const response = await apolloClient.query<ListZellerCustomersResponse>({
      query: LIST_ZELLER_CUSTOMERS,
      fetchPolicy: 'network-only',
    });

    const customers = response.data.listZellerCustomers.items;

    const users: User[] = customers
      .filter(customer => customer.id && customer.name && customer.role)
      .map(customer => ({
        id: customer.id,
        name: customer.name!,
        email: customer.email || undefined,
        role: customer.role as 'Admin' | 'Manager',
      }));

    return users;
  } catch (error) {
    console.error('Error fetching users from API:', error);
    throw error;
  }
};
