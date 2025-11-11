import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../utils/theme';

interface SectionHeaderProps {
    title: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        backgroundColor: theme.colors.background,
    },
    title: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.secondary,
    },
});

