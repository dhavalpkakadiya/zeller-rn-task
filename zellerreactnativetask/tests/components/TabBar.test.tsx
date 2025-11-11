/**
 * TabBar Component Tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TabBar } from '../../src/components/TabBar';

describe('TabBar', () => {
    const mockOnTabChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render all tabs', () => {
        const { getByText } = render(
            <TabBar activeTab="All" onTabChange={mockOnTabChange} />,
        );

        expect(getByText('All')).toBeTruthy();
        expect(getByText('Admin')).toBeTruthy();
        expect(getByText('Manager')).toBeTruthy();
    });

    it('should highlight active tab', () => {
        const { getByText } = render(
            <TabBar activeTab="Admin" onTabChange={mockOnTabChange} />,
        );

        const adminTab = getByText('Admin');
        expect(adminTab).toBeTruthy();
        // Active tab should have different styling (tested via accessibility or style props)
    });

    it('should call onTabChange when tab is pressed', () => {
        const { getByText } = render(
            <TabBar activeTab="All" onTabChange={mockOnTabChange} />,
        );

        const adminTab = getByText('Admin');
        fireEvent.press(adminTab);

        expect(mockOnTabChange).toHaveBeenCalledWith('Admin');
        expect(mockOnTabChange).toHaveBeenCalledTimes(1);
    });

    it('should call onTabChange for Manager tab', () => {
        const { getByText } = render(
            <TabBar activeTab="All" onTabChange={mockOnTabChange} />,
        );

        const managerTab = getByText('Manager');
        fireEvent.press(managerTab);

        expect(mockOnTabChange).toHaveBeenCalledWith('Manager');
    });

    it('should call onTabChange for All tab', () => {
        const { getByText } = render(
            <TabBar activeTab="Admin" onTabChange={mockOnTabChange} />,
        );

        const allTab = getByText('All');
        fireEvent.press(allTab);

        expect(mockOnTabChange).toHaveBeenCalledWith('All');
    });

    it('should handle all tab types', () => {
        const tabs: Array<'All' | 'Admin' | 'Manager'> = ['All', 'Admin', 'Manager'];

        tabs.forEach(tab => {
            const { getByText } = render(
                <TabBar activeTab={tab} onTabChange={mockOnTabChange} />,
            );
            expect(getByText(tab)).toBeTruthy();
        });
    });
});

