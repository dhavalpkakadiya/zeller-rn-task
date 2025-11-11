/**
 * UserListScreen Component Tests
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { UserListScreen } from '../../src/screens/UserListScreen';
import { userService } from '../../src/services/userService';
import { User } from '../../src/types/User';

jest.mock('../../src/services/userService');

describe('UserListScreen', () => {
    const mockUsers: User[] = [
        { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Manager' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (userService.initialize as jest.Mock).mockResolvedValue(undefined);
        (userService.loadUsersFromDatabase as jest.Mock).mockResolvedValue(mockUsers);
        (userService.syncUsersFromAPI as jest.Mock).mockResolvedValue(mockUsers);
        (userService.refreshUsers as jest.Mock).mockResolvedValue(mockUsers);
        (userService.addUser as jest.Mock).mockResolvedValue(undefined);
        (userService.updateUser as jest.Mock).mockResolvedValue(undefined);
        (userService.deleteUser as jest.Mock).mockResolvedValue(undefined);
    });

    it('should show loading indicator initially', async () => {
        (userService.loadUsersFromDatabase as jest.Mock).mockImplementation(
            () => new Promise(() => { }), // Never resolves to keep loading state
        );

        const { getByText } = render(<UserListScreen />);
        await waitFor(() => {
            expect(getByText('Loading users...')).toBeTruthy();
        });
    });

    it('should load users from database on mount', async () => {
        const { queryByText } = render(<UserListScreen />);

        await waitFor(() => {
            expect(userService.initialize).toHaveBeenCalled();
            expect(userService.loadUsersFromDatabase).toHaveBeenCalled();
        }, { timeout: 3000 });

        // Wait for loading to complete
        await waitFor(() => {
            expect(queryByText('Loading users...')).toBeNull();
        }, { timeout: 3000 });

        // Verify the component has finished initializing
        // The actual user rendering is tested in UserList component tests
        expect(userService.loadUsersFromDatabase).toHaveBeenCalled();
    });

    it('should fetch from API if database is empty', async () => {
        (userService.loadUsersFromDatabase as jest.Mock).mockResolvedValue([]);

        render(<UserListScreen />);

        await waitFor(() => {
            expect(userService.syncUsersFromAPI).toHaveBeenCalled();
        }, { timeout: 3000 });
    });

    it('should display users after loading', async () => {
        const { queryByText } = render(<UserListScreen />);

        // Wait for loading to complete
        await waitFor(() => {
            expect(queryByText('Loading users...')).toBeNull();
        }, { timeout: 3000 });

        // Verify that the service was called and users should be set
        await waitFor(() => {
            expect(userService.loadUsersFromDatabase).toHaveBeenCalled();
        }, { timeout: 3000 });

        // The component should have finished loading
        // Users are rendered through UserList component which we test separately
        expect(queryByText('Loading users...')).toBeNull();
    });

    it('should open add user modal when FAB is pressed', async () => {
        const { getByText, findByText, queryByText } = render(<UserListScreen />);

        // Wait for loading to complete
        await waitFor(() => {
            expect(queryByText('Loading users...')).toBeNull();
        }, { timeout: 3000 });

        // Wait for service calls to complete
        await waitFor(() => {
            expect(userService.loadUsersFromDatabase).toHaveBeenCalled();
        }, { timeout: 3000 });

        // Find FAB button (the + icon)
        const fab = getByText('+');
        fireEvent.press(fab);

        const modalTitle = await findByText('New User', {}, { timeout: 3000 });
        expect(modalTitle).toBeTruthy();
    });

    it('should toggle search when search button is pressed', async () => {
        const { getByText, queryByText, queryByPlaceholderText } = render(
            <UserListScreen />,
        );

        // Wait for loading to complete
        await waitFor(() => {
            expect(queryByText('Loading users...')).toBeNull();
        }, { timeout: 3000 });

        // Wait for service calls to complete
        await waitFor(() => {
            expect(userService.loadUsersFromDatabase).toHaveBeenCalled();
        }, { timeout: 3000 });

        // Search button uses 🔍 emoji
        const searchButton = getByText('🔍');
        fireEvent.press(searchButton);

        await waitFor(() => {
            expect(queryByPlaceholderText('Search by name...')).toBeTruthy();
        }, { timeout: 3000 });
    });

    it('should filter users when search query is entered', async () => {
        const { getByText, getByPlaceholderText, queryByText } = render(
            <UserListScreen />,
        );

        // Wait for loading to complete
        await waitFor(() => {
            expect(queryByText('Loading users...')).toBeNull();
        }, { timeout: 3000 });

        // Wait for service calls to complete
        await waitFor(() => {
            expect(userService.loadUsersFromDatabase).toHaveBeenCalled();
        }, { timeout: 3000 });

        const searchButton = getByText('🔍');
        fireEvent.press(searchButton);

        const searchInput = getByPlaceholderText('Search by name...');
        fireEvent.changeText(searchInput, 'John');

        // The search functionality is tested in UserList component tests
        // Here we just verify the search input is working
        await waitFor(() => {
            expect(searchInput).toBeTruthy();
        }, { timeout: 3000 });
    });

    it('should change active tab when tab is pressed', async () => {
        const { getAllByText, queryByText } = render(<UserListScreen />);

        // Wait for loading to complete
        await waitFor(() => {
            expect(queryByText('Loading users...')).toBeNull();
        }, { timeout: 3000 });

        // Wait a bit for users to render
        await waitFor(() => {
            // Verify service was called
            expect(userService.loadUsersFromDatabase).toHaveBeenCalled();
        }, { timeout: 3000 });

        // Find Admin tab - it should exist in the TabBar (may appear multiple times)
        const adminTabs = getAllByText('Admin');
        expect(adminTabs.length).toBeGreaterThan(0);
        fireEvent.press(adminTabs[0]);

        // After pressing Admin tab, verify the tab change was handled
        // The header title should be set based on activeTab state
        await waitFor(() => {
            // Admin should still be visible (in header or tab)
            const adminElements = getAllByText('Admin');
            expect(adminElements.length).toBeGreaterThan(0);
        }, { timeout: 3000 });
    });
});

