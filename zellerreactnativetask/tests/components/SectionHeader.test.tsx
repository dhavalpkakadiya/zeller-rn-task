/**
 * SectionHeader Component Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { SectionHeader } from '../../src/components/SectionHeader';

describe('SectionHeader', () => {
    it('should render section title', () => {
        const { getByText } = render(<SectionHeader title="A" />);
        expect(getByText('A')).toBeTruthy();
    });

    it('should render different section titles', () => {
        const titles = ['A', 'B', 'C', 'Z'];

        titles.forEach(title => {
            const { getByText } = render(<SectionHeader title={title} />);
            expect(getByText(title)).toBeTruthy();
        });
    });

    it('should render single character title', () => {
        const { getByText } = render(<SectionHeader title="M" />);
        expect(getByText('M')).toBeTruthy();
    });
});

