import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User } from '../types/User';
import { theme } from '../utils/theme';

interface UserListItemProps {
    user: User;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
}

export const UserListItem: React.FC<UserListItemProps> = ({
    user,
    onEdit,
    onDelete,
}) => {
    const getInitial = (name: string): string => {
        return name.charAt(0).toUpperCase();
    };

    return (
        <View style={styles.container}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitial(user.name)}</Text>
            </View>
            <View style={styles.userInfoContainer}>
                <View style={styles.nameRow}>
                    <Text style={styles.userName} numberOfLines={2}>{user.name}</Text>
                    {user.role && (
                        <View style={styles.roleContainer}>
                            <Text style={styles.userRole}>{user.role}</Text>
                        </View>
                    )}
                </View>
                <View style={styles.actionsContainer}>
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => onEdit(user)}
                            activeOpacity={0.7}>
                            <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.deleteButton]}
                            onPress={() => onDelete(user)}
                            activeOpacity={0.7}>
                            <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.divider,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.xl,
        backgroundColor: theme.colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    avatarText: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.primary,
    },
    userInfoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.xs,
    },
    userName: {
        flex: 1,
        fontSize: theme.fontSize.md,
        color: theme.colors.text,
        fontWeight: theme.fontWeight.regular,
        marginRight: theme.spacing.md,
    },
    roleContainer: {
        alignItems: 'flex-end',
        minWidth: 60,
    },
    userRole: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
    },
    actionsContainer: {
        alignItems: 'flex-end',
        marginTop: theme.spacing.xs,
    },
    actions: {
        flexDirection: 'row',
    },
    actionButton: {
        paddingVertical: 6,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.sm,
        backgroundColor: theme.colors.primaryLight,
        marginLeft: theme.spacing.sm,
    },
    deleteButton: {
        backgroundColor: theme.colors.errorLight,
    },
    editButtonText: {
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.primary,
    },
    deleteButtonText: {
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.error,
    },
});

