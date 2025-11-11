/**
 * UserList Component Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { UserList } from '../../src/components/UserList';
import { User } from '../../src/types/User';

describe('UserList', () => {
    const mockUsers: User[] = [
        { id: '1', name: 'Alice', role: 'Admin' },
        { id: '2', name: 'Bob', role: 'Manager' },
        { id: '3', name: 'Charlie', role: 'Admin' },
        { id: '4', name: 'David', role: 'Manager' },
    ];

    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnRefresh = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render all users when filter is All', () => {
        const { getByText } = render(
            <UserList
                users={mockUsers}
                filterType="All"
                searchQuery=""
                refreshing={false}
                onRefresh={mockOnRefresh}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />,
        );

        expect(getByText('Alice')).toBeTruthy();
        expect(getByText('Bob')).toBeTruthy();
        expect(getByText('Charlie')).toBeTruthy();
        expect(getByText('David')).toBeTruthy();
    });

    it('should filter users by Admin role', () => {
        const { getByText, queryByText } = render(
            <UserList
                users={mockUsers}
                filterType="Admin"
                searchQuery=""
                refreshing={false}
                onRefresh={mockOnRefresh}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />,
        );

        expect(getByText('Alice')).toBeTruthy();
        expect(getByText('Charlie')).toBeTruthy();
        expect(queryByText('Bob')).toBeNull();
        expect(queryByText('David')).toBeNull();
    });

    it('should filter users by Manager role', () => {
        const { getByText, queryByText } = render(
            <UserList
                users={mockUsers}
                filterType="Manager"
                searchQuery=""
                refreshing={false}
                onRefresh={mockOnRefresh}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />,
        );

        expect(getByText('Bob')).toBeTruthy();
        expect(getByText('David')).toBeTruthy();
        expect(queryByText('Alice')).toBeNull();
        expect(queryByText('Charlie')).toBeNull();
    });

    it('should filter users by search query', () => {
        const { getByText, queryByText } = render(
            <UserList
                users={mockUsers}
                filterType="All"
                searchQuery="Alice"
                refreshing={false}
                onRefresh={mockOnRefresh}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />,
        );

        expect(getByText('Alice')).toBeTruthy();
        expect(queryByText('Bob')).toBeNull();
        expect(queryByText('Charlie')).toBeNull();
        expect(queryByText('David')).toBeNull();
    });

    it('should filter by both role and search query', () => {
        const { getByText, queryByText } = render(
            <UserList
                users={mockUsers}
                filterType="Admin"
                searchQuery="Alice"
                refreshing={false}
                onRefresh={mockOnRefresh}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />,
        );

        expect(getByText('Alice')).toBeTruthy();
        expect(queryByText('Charlie')).toBeNull(); // Matches Admin but not search
        expect(queryByText('Bob')).toBeNull();
        expect(queryByText('David')).toBeNull();
    });

    it('should group users alphabetically', () => {
        const users: User[] = [
            { id: '1', name: 'Bob', role: 'Admin' },
            { id: '2', name: 'Alice', role: 'Manager' },
            { id: '3', name: 'Charlie', role: 'Admin' },
        ];

        const { getAllByText } = render(
            <UserList
                users={users}
                filterType="All"
                searchQuery=""
                refreshing={false}
                onRefresh={mockOnRefresh}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />,
        );

        // Should have section headers (may appear multiple times in list)
        const aHeaders = getAllByText('A');
        const bHeaders = getAllByText('B');
        const cHeaders = getAllByText('C');
        expect(aHeaders.length).toBeGreaterThan(0);
        expect(bHeaders.length).toBeGreaterThan(0);
        expect(cHeaders.length).toBeGreaterThan(0);
    });

    it('should handle empty users list', () => {
        const { queryByText } = render(
            <UserList
                users={[]}
                filterType="All"
                searchQuery=""
                refreshing={false}
                onRefresh={mockOnRefresh}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />,
        );

        expect(queryByText('Alice')).toBeNull();
    });

    it('should handle case insensitive search', () => {
        const { getByText } = render(
            <UserList
                users={mockUsers}
                filterType="All"
                searchQuery="alice"
                refreshing={false}
                onRefresh={mockOnRefresh}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />,
        );

        expect(getByText('Alice')).toBeTruthy();
    });
});

