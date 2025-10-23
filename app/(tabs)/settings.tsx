import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from '@/styles/(tabs)/settings';

interface UserData {
  email: string;
  id: number;
  is_verified: boolean;
  phonenumber: string | null;
  role: string;
  username: string;
  created_at: string;
  dob: string | null;
  cp: number | null;
  exang: number | null;
  sex: number | null;
  trestbps: number | null;
}

const SettingsScreen: React.FC = () => {
  const router = useRouter();

  // State management
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phonenumber: '',
    role: ''
  });

  const [originalData, setOriginalData] = useState({
    username: '',
    email: '',
    phonenumber: '',
    role: ''
  });

  // Get authorization headers
  const getAuthHeaders = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      const tokenType = await AsyncStorage.getItem('token_type');
      
      if (!accessToken || !tokenType) {
        throw new Error('No authentication token found');
      }

      return {
        'Authorization': `${tokenType} ${accessToken}`,
        'Content-Type': 'application/json',
      };
    } catch (error) {
      console.error('Error getting auth headers:', error);
      throw error;
    }
  };

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      
      // PUT YOUR API CALLING TO FETCH USER PROFILE CODE HERE
      // After fetching data:
      // setUserData(data);
      // setFormData({ username: data.username || '', email: data.email || '', phonenumber: data.phonenumber || '', role: data.role || '' });
      // setOriginalData(newFormData);
      
    } catch (error) {
      console.error('Error fetching user profile:', error);
      Alert.alert('Error', 'Failed to load user profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async () => {
    try {
      setIsSaving(true);
      
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

      // PUT YOUR API CALLING TO UPDATE USER PROFILE CODE HERE
      // After updating data:
      // setUserData(updatedUser);
      // setOriginalData({ ...formData });
      // setIsEditing(false);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Clear stored data
      await AsyncStorage.multiRemove(['access_token', 'token_type', 'user_data']);
      
      // Navigate to login screen
      router.replace('/login');
      
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to logout properly');
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={{ marginTop: 10, color: '#7f8c8d' }}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
                    style={[styles.button, isSaving && { opacity: 0.7 }]} 
                    onPress={handleSubmit}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text style={styles.buttonText}>Save Changes</Text>
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.cancelButton, isSaving && { opacity: 0.7 }]} 
                    onPress={handleCancel}
                    disabled={isSaving}
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