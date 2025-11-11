import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Animated,
    ActivityIndicator,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '../types/User';
import { TabBar, TabType } from '../components/TabBar';
import { UserList } from '../components/UserList';
import { UserModal } from '../components/UserModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { userService } from '../services/userService';
import { theme } from '../utils/theme';

export const UserListScreen: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [activeTab, setActiveTab] = useState<TabType>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const pagerRef = useRef<PagerView>(null);
    const tabPosition = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const initializeApp = async () => {
            try {
                setLoading(true);
                await userService.initialize();
                const dbUsers = await userService.loadUsersFromDatabase();

                if (dbUsers.length === 0) {
                    const apiUsers = await userService.syncUsersFromAPI();
                    setUsers(apiUsers);
                } else {
                    setUsers(dbUsers);
                }
            } catch (error) {
                console.error('Error initializing app:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeApp();
    }, []);

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        const index = tab === 'All' ? 0 : tab === 'Admin' ? 1 : 2;
        pagerRef.current?.setPage(index);
        Animated.spring(tabPosition, {
            toValue: index,
            useNativeDriver: false,
        }).start();
    };

    const handlePageChange = (page: number) => {
        const tabs: TabType[] = ['All', 'Admin', 'Manager'];
        setActiveTab(tabs[page]);
        Animated.spring(tabPosition, {
            toValue: page,
            useNativeDriver: false,
        }).start();
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const refreshedUsers = await userService.refreshUsers();
            setUsers(refreshedUsers);
        } catch (error) {
            console.error('Error refreshing users:', error);
            const dbUsers = await userService.loadUsersFromDatabase();
            setUsers(dbUsers);
        } finally {
            setRefreshing(false);
        }
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setShowUserModal(true);
    };

    const handleAddUser = () => {
        setSelectedUser(null);
        setShowUserModal(true);
    };

    const handleSubmitUser = async (userData: {
        id?: string;
        firstName: string;
        lastName: string;
        email: string;
        role: 'Admin' | 'Manager';
    }) => {
        try {
            if (userData.id) {
                const updatedUser: User = {
                    id: userData.id,
                    name: `${userData.firstName} ${userData.lastName}`.trim(),
                    email: userData.email || undefined,
                    role: userData.role,
                };
                await userService.updateUser(updatedUser);
                setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
            } else {
                const newUser: User = {
                    id: Date.now().toString(),
                    name: `${userData.firstName} ${userData.lastName}`.trim(),
                    email: userData.email || undefined,
                    role: userData.role,
                };
                await userService.addUser(newUser);
                setUsers([...users, newUser]);
            }
            setShowUserModal(false);
            setSelectedUser(null);
        } catch (error) {
            console.error('Error saving user:', error);
            setShowUserModal(false);
            setSelectedUser(null);
        }
    };

    const handleDeleteUser = (user: User) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedUser) {
            try {
                await userService.deleteUser(selectedUser.id);
                setUsers(users.filter(user => user.id !== selectedUser.id));
                setShowDeleteModal(false);
                setSelectedUser(null);
            } catch (error) {
                console.error('Error deleting user:', error);
                setShowDeleteModal(false);
                setSelectedUser(null);
            }
        }
    };

    const getFilteredUsers = (tab: TabType): User[] => {
        if (tab === 'All') {
            return users;
        }
        return users.filter(user => user.role === tab);
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={styles.loadingText}>Loading users...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.headerRow}>
                <View style={styles.tabBarContainer}>
                    <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
                </View>
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => setShowSearch(!showSearch)}>
                    <Text style={styles.searchIcon}>🔍</Text>
                </TouchableOpacity>
            </View>

            {showSearch && (
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by name..."
                        placeholderTextColor={theme.colors.placeholder}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCapitalize="none"
                        autoFocus={true}
                    />
                </View>
            )}

            <PagerView
                ref={pagerRef}
                style={styles.pagerView}
                initialPage={0}
                onPageSelected={e => handlePageChange(e.nativeEvent.position)}>
                <View key="0" style={styles.page}>
                    <UserList
                        users={getFilteredUsers('All')}
                        filterType="All"
                        searchQuery={searchQuery}
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        onEdit={handleEditUser}
                        onDelete={handleDeleteUser}
                    />
                </View>
                <View key="1" style={styles.page}>
                    <UserList
                        users={getFilteredUsers('Admin')}
                        filterType="Admin"
                        searchQuery={searchQuery}
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        onEdit={handleEditUser}
                        onDelete={handleDeleteUser}
                    />
                </View>
                <View key="2" style={styles.page}>
                    <UserList
                        users={getFilteredUsers('Manager')}
                        filterType="Manager"
                        searchQuery={searchQuery}
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        onEdit={handleEditUser}
                        onDelete={handleDeleteUser}
                    />
                </View>
            </PagerView>

            <TouchableOpacity
                style={styles.fab}
                onPress={handleAddUser}
                activeOpacity={0.8}>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>

            <UserModal
                visible={showUserModal}
                user={selectedUser}
                onClose={() => {
                    setShowUserModal(false);
                    setSelectedUser(null);
                }}
                onSubmit={handleSubmitUser}
            />

            <DeleteConfirmModal
                visible={showDeleteModal}
                user={selectedUser}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                }}
                onConfirm={handleConfirmDelete}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: theme.spacing.md,
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.divider,
    },
    tabBarContainer: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.divider,
    },
    headerTitle: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
    },
    searchButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: theme.spacing.md,
    },
    searchIcon: {
        fontSize: theme.fontSize.lg,
    },
    searchContainer: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.divider,
    },
    searchInput: {
        fontSize: theme.fontSize.md,
        color: theme.colors.text,
        paddingVertical: theme.spacing.sm,
    },
    pagerView: {
        flex: 1,
    },
    page: {
        flex: 1,
    },
    fab: {
        position: 'absolute',
        right: theme.spacing.lg,
        bottom: theme.spacing.lg,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    fabIcon: {
        fontSize: 28,
        color: theme.colors.textOnPrimary,
        fontWeight: '300',
    },
});

