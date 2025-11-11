import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
} from 'react-native';
import { User } from '../types/User';
import { theme } from '../utils/theme';

interface DeleteConfirmModalProps {
    visible: boolean;
    user: User | null;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    visible,
    user,
    onClose,
    onConfirm,
}) => {
    if (!user) {
        return null;
    }

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Delete User</Text>
                    <Text style={styles.message}>
                        Are you sure you want to delete {user.name}? This action cannot be undone.
                    </Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                            activeOpacity={0.8}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.deleteButton]}
                            onPress={onConfirm}
                            activeOpacity={0.8}>
                            <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: theme.colors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    modalContent: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xxl,
        width: '100%',
        maxWidth: 400,
    },
    title: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    message: {
        fontSize: theme.fontSize.md,
        color: theme.colors.secondary,
        marginBottom: theme.spacing.xxl,
        lineHeight: 22,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    button: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xxl,
        borderRadius: theme.borderRadius.md,
        minWidth: 100,
        alignItems: 'center',
        marginLeft: theme.spacing.md,
    },
    cancelButton: {
        backgroundColor: theme.colors.surface,
    },
    cancelButtonText: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.secondary,
    },
    deleteButton: {
        backgroundColor: theme.colors.error,
    },
    deleteButtonText: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.textOnPrimary,
    },
});

