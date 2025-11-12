import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from '@/styles/(tabs)/settings';
import { formatDate } from '@/utils';
import type { SettingsUserData, SettingsFormData } from '@/types';
import { getProfile, updateProfile, logout } from '@/api';
import type { User } from '@/types';

const SettingsScreen: React.FC = () => {
  const router = useRouter();

  // State management
  const [userData, setUserData] = useState<SettingsUserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<SettingsFormData>({
    username: '',
    email: '',
    phonenumber: '',
    role: ''
  });

  const [originalData, setOriginalData] = useState<SettingsFormData>({
    username: '',
    email: '',
    phonenumber: '',
    role: ''
  });

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const profile: User = await getProfile();
      
      // Map User to SettingsUserData
      const mappedUserData: SettingsUserData = {
        email: profile.email,
        id: profile.id,
        is_verified: profile.isVerified ?? false,
        phonenumber: profile.phonenumber,
        role: profile.role,
        username: profile.username,
        created_at: profile.createdAt,
        dob: profile.dob,
        cp: profile.cp,
        exang: profile.exang,
        sex: profile.sex,
        trestbps: profile.trestbps
      };

      setUserData(mappedUserData);
      const newFormData = {
        username: profile.username || '',
        email: profile.email || '',
        phonenumber: profile.phonenumber || '',
        role: profile.role || ''
      };
      setFormData(newFormData);
      setOriginalData(newFormData);
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      Alert.alert('Error', error.message || 'Failed to load profile');
    }
  };

  // Update user profile
  const updateUserProfile = async () => {
    // Prepare update data (only send changed fields)
    const updateData: any = {};
    if (formData.username !== originalData.username) updateData.username = formData.username;
    if (formData.email !== originalData.email) updateData.email = formData.email;
    if (formData.phonenumber !== originalData.phonenumber) updateData.phonenumber = formData.phonenumber;

    // If no changes, just exit editing mode
    if (Object.keys(updateData).length === 0) {
      setIsEditing(false);
      return;
    }

    try {
      // Call API to update profile
      const updatedProfile = await updateProfile(updateData);

      // Map updated profile to SettingsUserData
      const mappedUserData: SettingsUserData = {
        email: updatedProfile.email,
        id: updatedProfile.id,
        is_verified: updatedProfile.isVerified ?? false,
        phonenumber: updatedProfile.phonenumber,
        role: updatedProfile.role,
        username: updatedProfile.username,
        created_at: updatedProfile.createdAt,
        dob: updatedProfile.dob,
        cp: updatedProfile.cp,
        exang: updatedProfile.exang,
        sex: updatedProfile.sex,
        trestbps: updatedProfile.trestbps
      };
      setUserData(mappedUserData);
      
      setOriginalData({ ...formData });
      setIsEditing(false);
      
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      // Navigate to login screen
      router.replace('/login');
    } catch (error: any) {
      console.error('Error logging out:', error);
      // Still navigate to login even if logout fails
      router.replace('/login');
    }
  };

  // Load user data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setOriginalData({ ...formData });
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.username.trim() || !formData.email.trim()) {
      Alert.alert('Error', 'Username and email are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Phone number validation (if provided)
    if (formData.phonenumber && formData.phonenumber.trim()) {
      const phoneRegex = /^[0-9]{10,15}$/;
      if (!phoneRegex.test(formData.phonenumber.replace(/\s/g, ''))) {
        Alert.alert('Error', 'Please enter a valid phone number');
        return;
      }
    }

    await updateUserProfile();
  };

  const handleChangePassword = () => {
    router.push("/change-password");
  };

  const confirmLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: handleLogout,
        },
      ]
    );
  };

  const getVerificationStatus = () => {
    return userData?.is_verified ? 'Verified' : 'Not Verified';
  };

  const getVerificationColor = () => {
    return userData?.is_verified ? '#27ae60' : '#e74c3c';
  };

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: '#e74c3c', fontSize: 16 }}>Failed to load user data</Text>
          <TouchableOpacity
            style={[styles.button, { marginTop: 20 }]}
            onPress={fetchUserProfile}
          >
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.description}>
            Manage your account preferences and profile information
          </Text>

          {/* Profile Information Section */}
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Profile Information</Text>

            {/* Username */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Username *</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.disabledInput]}
                value={formData.username}
                onChangeText={(text) => setFormData({ ...formData, username: text })}
                placeholder="Enter username"
                editable={isEditing}
                placeholderTextColor="#bdc3c7"
              />
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.disabledInput]}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="Enter email"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={isEditing}
                placeholderTextColor="#bdc3c7"
              />
            </View>

            {/* Phone Number */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.disabledInput]}
                value={formData.phonenumber}
                onChangeText={(text) => setFormData({ ...formData, phonenumber: text })}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                editable={isEditing}
                placeholderTextColor="#bdc3c7"
              />
            </View>

            {/* Role (Read-only) */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Role</Text>
              <View style={[styles.input, styles.disabledInput, styles.roleContainer]}>
                <Text style={styles.roleText}>{formData.role}</Text>
              </View>
            </View>

            {/* Account Status */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Account Status</Text>
              <View style={[styles.input, styles.disabledInput, styles.statusContainer]}>
                <Text style={[styles.statusText, { color: getVerificationColor() }]}>
                  {getVerificationStatus()}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              {!isEditing ? (
                <>
                  <TouchableOpacity style={styles.button} onPress={handleEdit}>
                    <Text style={styles.buttonText}>Edit Profile</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.secondaryButton} onPress={handleChangePassword}>
                    <Text style={styles.secondaryButtonText}>Change Password</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.buttonText}>Save Changes</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancel}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          {/* Account Information Section */}
          <View style={styles.infoContainer}>
            <Text style={styles.sectionTitle}>Account Information</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>User ID:</Text>
              <Text style={styles.infoValue}>{userData.id}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Member Since:</Text>
              <Text style={styles.infoValue}>{formatDate(userData.created_at)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Login:</Text>
              <Text style={styles.infoValue}>Current Session</Text>
            </View>
          </View>

          {/* Logout Section */}
          <View style={styles.logoutContainer}>
            <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;