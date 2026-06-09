import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Button, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../../store/authSlice';
import { AppDispatch, RootState } from '../../store';

export default function ProfileScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await dispatch(logout());
            // Navigation will be handled by AppNavigator
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text variant="headlineMedium" style={styles.avatarText}>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <Text variant="headlineSmall" style={styles.email}>
              {user?.email || 'User'}
            </Text>
            <Text variant="bodyMedium" style={styles.userId}>
              User ID: {user?.id || 'N/A'}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Account Settings
          </Text>
          <Divider style={styles.divider} />
          
          <Button
            mode="text"
            onPress={() => {}}
            style={styles.menuItem}
            icon="account-edit"
          >
            Edit Profile
          </Button>
          
          <Button
            mode="text"
            onPress={() => {}}
            style={styles.menuItem}
            icon="lock"
          >
            Change Password
          </Button>
          
          <Button
            mode="text"
            onPress={() => {}}
            style={styles.menuItem}
            icon="bell"
          >
            Notifications
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            About
          </Text>
          <Divider style={styles.divider} />
          
          <Button
            mode="text"
            onPress={() => {}}
            style={styles.menuItem}
            icon="information"
          >
            App Version: 1.0.0
          </Button>
          
          <Button
            mode="text"
            onPress={() => {}}
            style={styles.menuItem}
            icon="file-document"
          >
            Terms & Conditions
          </Button>
          
          <Button
            mode="text"
            onPress={() => {}}
            style={styles.menuItem}
            icon="shield-lock"
          >
            Privacy Policy
          </Button>
        </Card.Content>
      </Card>

      <View style={styles.logoutContainer}>
        <Button
          mode="contained"
          onPress={handleLogout}
          buttonColor="#f44336"
          style={styles.logoutButton}
        >
          Logout
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    marginBottom: 0,
    elevation: 2,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  email: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userId: {
    color: '#757575',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 8,
  },
  menuItem: {
    justifyContent: 'flex-start',
    marginVertical: 4,
  },
  logoutContainer: {
    padding: 16,
  },
  logoutButton: {
    paddingVertical: 4,
  },
});

