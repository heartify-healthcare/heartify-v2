import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';

import { styles } from '@/styles/(tabs)/settings';

interface UserData {
  email: string;
  id: number;
  is_verified: boolean;
  phonenumber: string;
  role: string;
  username: string;
  age: number;
  cp: number;
  exang: number;
  sex: number;
  trestbps: number;
  create_at: string;
}

const SettingsScreen: React.FC = () => {
  const router = useRouter();

  // Mock user data - simulate data from backend
  const mockUserData: UserData = {
    email: "songokupkj@gmail.com",
    id: 1,
    is_verified: true,
    phonenumber: "0865942420",
    role: "user",
    username: "songokupkj",
    age: 50,
    cp: 1,
    exang: 1,
    sex: 1,
    trestbps: 120,
    create_at: "2025-05-27 19:44:48.565008"
  };

  // State management
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: mockUserData.username,
    email: mockUserData.email,
    phonenumber: mockUserData.phonenumber,
    role: mockUserData.role
  });

  const [originalData, setOriginalData] = useState({
    username: mockUserData.username,
    email: mockUserData.email,
    phonenumber: mockUserData.phonenumber,
    role: mockUserData.role
  });

  const handleEdit = () => {
    setIsEditing(true);
    setOriginalData({ ...formData });
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setIsEditing(false);
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.username.trim() || !formData.email.trim() || !formData.phonenumber.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Phone number validation (basic)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phonenumber.replace(/\s/g, ''))) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    // Simulate API call
    Alert.alert(
      'Success', 
      'Profile updated successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            setIsEditing(false);
            setOriginalData({ ...formData });
          }
        }
      ]
    );
  };

  const handleChangePassword = () => {
    // TODO: Navigate to /change-password route
    // In a real app, you would use navigation like:
    // navigation.navigate('ChangePassword');
    // Alert.alert(
    //   'Change Password',
    //   'This would navigate to the change password screen.\n\nRoute: /change-password',
    //   [{ text: 'OK' }]
    // );
    router.push("/change-password");
  };

  const getVerificationStatus = () => {
    return mockUserData.is_verified ? 'Verified' : 'Not Verified';
  };

  const getVerificationColor = () => {
    return mockUserData.is_verified ? '#27ae60' : '#e74c3c';
  };

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
              <Text style={styles.inputLabel}>Phone Number *</Text>
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
                  <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Save Changes</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
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
              <Text style={styles.infoValue}>{mockUserData.id}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Member Since:</Text>
              <Text style={styles.infoValue}>{mockUserData.create_at}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Login:</Text>
              <Text style={styles.infoValue}>{Date.now()}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;