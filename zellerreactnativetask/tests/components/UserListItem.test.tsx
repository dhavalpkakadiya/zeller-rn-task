/**
 * UserListItem Component Tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { UserListItem } from '../../src/components/UserListItem';
import { User } from '../../src/types/User';

describe('UserListItem', () => {
    const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
    };

    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render user information correctly', () => {
        const { getByText } = render(
            <UserListItem user={mockUser} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
        );

        expect(getByText('John Doe')).toBeTruthy();
        expect(getByText('Admin')).toBeTruthy();
    });

    it('should display user initial in avatar', () => {
        const { getByText } = render(
            <UserListItem user={mockUser} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
        );

        expect(getByText('J')).toBeTruthy();
    });

    it('should handle user without email', () => {
        const userWithoutEmail: User = {
            id: '2',
            name: 'Jane Smith',
            role: 'Manager',
        };

        const { getByText, queryByText } = render(
            <UserListItem
                user={userWithoutEmail}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />,
        );

        expect(getByText('Jane Smith')).toBeTruthy();
        expect(getByText('Manager')).toBeTruthy();
    });

    it('should call onEdit when edit button is pressed', () => {
        const { getByText } = render(
            <UserListItem user={mockUser} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
        );

        const editButton = getByText('Edit');
        fireEvent.press(editButton);

        expect(mockOnEdit).toHaveBeenCalledWith(mockUser);
        expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });

    it('should call onDelete when delete button is pressed', () => {
        const { getByText } = render(
            <UserListItem user={mockUser} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
        );

        const deleteButton = getByText('Delete');
        fireEvent.press(deleteButton);

        expect(mockOnDelete).toHaveBeenCalledWith(mockUser);
        expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });

    it('should display correct initial for different names', () => {
        const user1: User = { id: '1', name: 'Alice', role: 'Admin' };
        const user2: User = { id: '2', name: 'Bob', role: 'Manager' };

        const { getByText: getByText1 } = render(
            <UserListItem user={user1} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
        );
        expect(getByText1('A')).toBeTruthy();

        const { getByText: getByText2 } = render(
            <UserListItem user={user2} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
        );
        expect(getByText2('B')).toBeTruthy();
    });

    it('should handle user without role display', () => {
        const userWithoutRole: User = {
            id: '3',
            name: 'Test User',
            role: 'Manager',
        };

        const { getByText } = render(
            <UserListItem
                user={userWithoutRole}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />,
        );

        expect(getByText('Test User')).toBeTruthy();
        expect(getByText('Manager')).toBeTruthy();
    });
});

