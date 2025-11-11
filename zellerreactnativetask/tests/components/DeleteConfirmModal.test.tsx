/**
 * DeleteConfirmModal Component Tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DeleteConfirmModal } from '../../src/components/DeleteConfirmModal';
import { User } from '../../src/types/User';

describe('DeleteConfirmModal', () => {
    const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
    };

    const mockOnClose = jest.fn();
    const mockOnConfirm = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should not render when visible is false', () => {
        const { queryByText } = render(
            <DeleteConfirmModal
                visible={false}
                user={mockUser}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
            />,
        );

        expect(queryByText('Delete User')).toBeNull();
    });

    it('should not render when user is null', () => {
        const { queryByText } = render(
            <DeleteConfirmModal
                visible={true}
                user={null}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
            />,
        );

        expect(queryByText('Delete User')).toBeNull();
    });

    it('should render modal with user name when visible and user provided', () => {
        const { getByText } = render(
            <DeleteConfirmModal
                visible={true}
                user={mockUser}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
            />,
        );

        expect(getByText('Delete User')).toBeTruthy();
        expect(getByText(/Are you sure you want to delete John Doe\?/)).toBeTruthy();
    });

    it('should call onClose when cancel button is pressed', () => {
        const { getByText } = render(
            <DeleteConfirmModal
                visible={true}
                user={mockUser}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
            />,
        );

        const cancelButton = getByText('Cancel');
        fireEvent.press(cancelButton);

        expect(mockOnClose).toHaveBeenCalled();
        expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it('should call onConfirm when delete button is pressed', () => {
        const { getByText } = render(
            <DeleteConfirmModal
                visible={true}
                user={mockUser}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
            />,
        );

        const deleteButton = getByText('Delete');
        fireEvent.press(deleteButton);

        expect(mockOnConfirm).toHaveBeenCalled();
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should display correct message with user name', () => {
        const user: User = {
            id: '2',
            name: 'Jane Smith',
            role: 'Manager',
        };

        const { getByText } = render(
            <DeleteConfirmModal
                visible={true}
                user={user}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
            />,
        );

        expect(getByText(/Are you sure you want to delete Jane Smith\?/)).toBeTruthy();
    });
});

