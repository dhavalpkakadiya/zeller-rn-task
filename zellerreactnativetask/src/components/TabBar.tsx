import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../utils/theme';

export type TabType = 'All' | 'Admin' | 'Manager';

interface TabBarProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
    const tabs: TabType[] = ['All', 'Admin', 'Manager'];

    return (
        <View style={styles.container}>
            {tabs.map(tab => (
                <TouchableOpacity
                    key={tab}
                    style={[
                        styles.tab,
                        activeTab === tab && styles.activeTab,
                    ]}
                    onPress={() => onTabChange(tab)}
                    activeOpacity={0.7}>
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === tab && styles.activeTabText,
                        ]}>
                        {tab}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: theme.colors.background,
        paddingVertical: theme.spacing.md,
    },
    tab: {
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.xl,
        marginRight: theme.spacing.sm,
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    activeTab: {
        backgroundColor: theme.colors.primaryLight,
        borderColor: theme.colors.primary,
    },
    tabText: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.textSecondary,
    },
    activeTabText: {
        color: theme.colors.primary,
        fontWeight: theme.fontWeight.semibold,
    },
});

