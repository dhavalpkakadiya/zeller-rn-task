import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, UserRole } from '../types/User';
import { theme } from '../utils/theme';

interface UserModalProps {
    visible: boolean;
    user: User | null; // null for add mode, User for edit mode
    onClose: () => void;
    onSubmit: (userData: {
        id?: string; // Only present in edit mode
        firstName: string;
        lastName: string;
        email: string;
        role: UserRole;
    }) => void;
}

interface ValidationErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
}

export const UserModal: React.FC<UserModalProps> = ({
    visible,
    user,
    onClose,
    onSubmit,
}) => {
    const isEditMode = user !== null;
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<UserRole>('Manager');
    const [errors, setErrors] = useState<ValidationErrors>({});

    // Populate form when user changes (edit mode) or modal opens (add mode)
    useEffect(() => {
        if (isEditMode && user) {
            const nameParts = user.name.split(' ');
            setFirstName(nameParts[0] || '');
            setLastName(nameParts.slice(1).join(' ') || '');
            setEmail(user.email || '');
            setRole(user.role);
        } else {
            // Reset form for add mode
            setFirstName('');
            setLastName('');
            setEmail('');
            setRole('Manager');
        }
        setErrors({});
    }, [user, isEditMode, visible]);

    // Validation functions
    const validateName = (name: string): string | undefined => {
        if (!name || name.trim().length === 0) {
            return 'Name should not be empty';
        }
        // Check for special characters (only alphabets and spaces allowed)
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(name)) {
            return 'Name cannot contain special characters (only alphabets and spaces allowed)';
        }
        return undefined;
    };

    const validateFullName = (first: string, last: string): string | undefined => {
        const fullName = `${first} ${last}`.trim();
        if (fullName.length > 50) {
            return 'Name must not exceed 50 characters';
        }
        return undefined;
    };

    const validateEmail = (emailValue: string): string | undefined => {
        if (!emailValue || emailValue.trim().length === 0) {
            // Email is optional, so no error if empty
            return undefined;
        }
        // Basic email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailValue)) {
            return 'Email must be in valid format';
        }
        return undefined;
    };

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        // Validate first name
        const firstNameError = validateName(firstName);
        if (firstNameError) {
            newErrors.firstName = firstNameError;
        }

        // Validate last name
        const lastNameError = validateName(lastName);
        if (lastNameError) {
            newErrors.lastName = lastNameError;
        }

        // Validate full name length (only if both names are valid)
        if (!firstNameError && !lastNameError) {
            const fullNameError = validateFullName(firstName, lastName);
            if (fullNameError) {
                newErrors.lastName = fullNameError;
            }
        }

        // Validate email
        const emailError = validateEmail(email);
        if (emailError) {
            newErrors.email = emailError;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFirstNameChange = (text: string) => {
        setFirstName(text);
        // Clear error when user starts typing
        if (errors.firstName) {
            setErrors(prev => ({ ...prev, firstName: undefined }));
        }
    };

    const handleLastNameChange = (text: string) => {
        setLastName(text);
        // Clear error when user starts typing
        if (errors.lastName) {
            setErrors(prev => ({ ...prev, lastName: undefined }));
        }
    };

    const handleEmailChange = (text: string) => {
        setEmail(text);
        // Clear error when user starts typing
        if (errors.email) {
            setErrors(prev => ({ ...prev, email: undefined }));
        }
    };

    const handleSubmit = () => {
        if (validateForm()) {
            if (isEditMode && user) {
                onSubmit({
                    id: user.id,
                    firstName,
                    lastName,
                    email,
                    role,
                });
            } else {
                onSubmit({
                    firstName,
                    lastName,
                    email,
                    role,
                });
            }
        }
    };

    const handleClose = () => {
        // Reset form and errors when closing
        setFirstName('');
        setLastName('');
        setEmail('');
        setRole('Manager');
        setErrors({});
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={handleClose}>
            <SafeAreaView style={styles.modalContainer} edges={['top']}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}>
                    <View style={styles.modalContent}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                            <Text style={styles.title}>
                                {isEditMode ? 'Edit User' : 'New User'}
                            </Text>
                        </View>

                    <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[
                                    styles.input,
                                    errors.firstName && styles.inputError,
                                ]}
                                placeholder="First Name"
                                placeholderTextColor={theme.colors.placeholder}
                                value={firstName}
                                onChangeText={handleFirstNameChange}
                            />
                            {errors.firstName && (
                                <Text style={styles.errorText}>{errors.firstName}</Text>
                            )}
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[
                                    styles.input,
                                    errors.lastName && styles.inputError,
                                ]}
                                placeholder="Last Name"
                                placeholderTextColor={theme.colors.placeholder}
                                value={lastName}
                                onChangeText={handleLastNameChange}
                            />
                            {errors.lastName && (
                                <Text style={styles.errorText}>{errors.lastName}</Text>
                            )}
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[
                                    styles.input,
                                    errors.email && styles.inputError,
                                ]}
                                placeholder="Email"
                                placeholderTextColor={theme.colors.placeholder}
                                value={email}
                                onChangeText={handleEmailChange}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            {errors.email && (
                                <Text style={styles.errorText}>{errors.email}</Text>
                            )}
                        </View>

                        <View style={styles.roleContainer}>
                            <Text style={styles.roleLabel}>User Role</Text>
                            <View style={styles.roleSelector}>
                                <TouchableOpacity
                                    style={[
                                        styles.roleButton,
                                            styles.roleButtonLeft,
                                        role === 'Admin' && styles.roleButtonActive,
                                    ]}
                                        onPress={() => setRole('Admin')}
                                        activeOpacity={0.7}>
                                    <Text
                                        style={[
                                            styles.roleButtonText,
                                            role === 'Admin' && styles.roleButtonTextActive,
                                        ]}>
                                        Admin
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.roleButton,
                                            styles.roleButtonRight,
                                        role === 'Manager' && styles.roleButtonActive,
                                    ]}
                                        onPress={() => setRole('Manager')}
                                        activeOpacity={0.7}>
                                    <Text
                                        style={[
                                            styles.roleButtonText,
                                            role === 'Manager' && styles.roleButtonTextActive,
                                        ]}>
                                        Manager
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit}
                            activeOpacity={0.8}>
                            <Text style={styles.submitButtonText}>
                                {isEditMode ? 'Update User' : 'Create User'}
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    modalContent: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.lg,
        paddingBottom: theme.spacing.sm,
    },
    closeButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: theme.fontSize.xl,
        color: theme.colors.primary,
        fontWeight: '300',
    },
    title: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        marginLeft: theme.spacing.lg,
    },
    form: {
        paddingHorizontal: theme.spacing.lg,
    },
    inputContainer: {
        marginTop: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    input: {
        fontSize: theme.fontSize.md,
        color: theme.colors.text,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: 0,
    },
    inputError: {
        borderBottomColor: theme.colors.error,
    },
    errorText: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.error,
        marginTop: theme.spacing.xs,
        marginBottom: theme.spacing.xs,
    },
    roleContainer: {
        marginTop: theme.spacing.xxl,
    },
    roleLabel: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    roleSelector: {
        flexDirection: 'row',
    },
    roleButton: {
        flex: 1,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    roleButtonLeft: {
        marginRight: theme.spacing.md / 2,
    },
    roleButtonRight: {
        marginLeft: theme.spacing.md / 2,
    },
    roleButtonActive: {
        backgroundColor: theme.colors.primaryLight,
        borderColor: theme.colors.primary,
    },
    roleButtonText: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.textSecondary,
    },
    roleButtonTextActive: {
        color: theme.colors.primary,
        fontWeight: theme.fontWeight.semibold,
    },
    submitButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.xl,
        paddingVertical: theme.spacing.lg,
        alignItems: 'center',
        marginTop: theme.spacing.xxxl,
        marginBottom: theme.spacing.lg,
    },
    submitButtonText: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.textOnPrimary,
    },
});

