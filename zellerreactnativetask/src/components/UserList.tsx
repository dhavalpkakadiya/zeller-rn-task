import React, { useMemo } from 'react';
import { FlatList, StyleSheet, RefreshControl } from 'react-native';
import { User } from '../types/User';
import { UserListItem } from './UserListItem';
import { SectionHeader } from './SectionHeader';
import { TabType } from './TabBar';
import { theme } from '../utils/theme';

interface UserListProps {
    users: User[];
    filterType: TabType;
    searchQuery: string;
    refreshing: boolean;
    onRefresh: () => void;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
}

interface GroupedUser {
    letter: string;
    users: User[];
}

export const UserList: React.FC<UserListProps> = ({
    users,
    filterType,
    searchQuery,
    refreshing,
    onRefresh,
    onEdit,
    onDelete,
}) => {
    const groupedUsers = useMemo(() => {
        // Filter users based on tab and search query
        let filteredUsers = users;

        // Filter by role
        if (filterType !== 'All') {
            filteredUsers = filteredUsers.filter(user => user.role === filterType);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            filteredUsers = filteredUsers.filter(user =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase()),
            );
        }

        // Group by first letter
        const grouped: { [key: string]: User[] } = {};
        filteredUsers.forEach(user => {
            const firstLetter = user.name.charAt(0).toUpperCase();
            if (!grouped[firstLetter]) {
                grouped[firstLetter] = [];
            }
            grouped[firstLetter].push(user);
        });

        // Convert to array and sort
        const result: GroupedUser[] = Object.keys(grouped)
            .sort()
            .map(letter => ({
                letter,
                users: grouped[letter].sort((a, b) =>
                    a.name.localeCompare(b.name),
                ),
            }));

        return result;
    }, [users, filterType, searchQuery]);

    const renderItem = ({ item }: { item: GroupedUser }) => {
        return (
            <>
                <SectionHeader title={item.letter} />
                {item.users.map(user => (
                    <UserListItem
                        key={user.id}
                        user={user}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </>
        );
    };

    return (
        <FlatList
            data={groupedUsers}
            renderItem={renderItem}
            keyExtractor={item => item.letter}
            style={styles.list}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    list: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
});

