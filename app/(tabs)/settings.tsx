import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Switch
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { styles } from '@/styles/(tabs)/settings';
import { formatDate } from '@/utils';
import type { SettingsUserData, SettingsFormData } from '@/types';
import { getProfile, updateProfile, logout } from '@/api';
import type { User } from '@/types';
import { changeLanguage, getCurrentLanguage } from '@/i18n';

const SettingsScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  // State management
  const [userData, setUserData] = useState<SettingsUserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
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

  // Language state
  const [isVietnamese, setIsVietnamese] = useState(getCurrentLanguage() === 'vi');

  // Handle language toggle
  const handleLanguageToggle = async (value: boolean) => {
    setIsVietnamese(value);
    const newLanguage = value ? 'vi' : 'en';
    await changeLanguage(newLanguage);
  };

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      
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
      setLoadError(error.message || t('settings.updateFailed'));
    } finally {
      setIsLoading(false);
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
      
      Alert.alert(t('common.success'), t('settings.updateSuccess'));
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert(t('common.error'), error.message || t('settings.updateFailed'));
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

  // Update language state when i18n language changes
  useEffect(() => {
    setIsVietnamese(i18n.language === 'vi');
  }, [i18n.language]);

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
      Alert.alert(t('common.error'), t('settings.validation.usernameEmailRequired'));
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert(t('common.error'), t('settings.validation.invalidEmail'));
      return;
    }

    // Phone number validation (if provided)
    if (formData.phonenumber && formData.phonenumber.trim()) {
      const phoneRegex = /^[0-9]{10,15}$/;
      if (!phoneRegex.test(formData.phonenumber.replace(/\s/g, ''))) {
        Alert.alert(t('common.error'), t('settings.validation.invalidPhone'));
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
      t('settings.logout.title'),
      t('settings.logout.message'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('settings.logout.button'),
          style: 'destructive',
          onPress: handleLogout,
        },
      ]
    );
  };

  const getVerificationStatus = () => {
    return userData?.is_verified ? t('settings.verified') : t('settings.notVerified');
  };

  const getVerificationColor = () => {
    return userData?.is_verified ? '#27ae60' : '#e74c3c';
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={{ color: '#7f8c8d', fontSize: 16, marginTop: 16 }}>
            {t('settings.loadingProfile')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (loadError || !userData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
          <Text style={{ color: '#e74c3c', fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
            {t('settings.failedToLoad')}
          </Text>
          <Text style={{ color: '#7f8c8d', fontSize: 14, textAlign: 'center', marginBottom: 24 }}>
            {loadError || t('settings.unableToRetrieve')}
          </Text>
          <TouchableOpacity
            style={[styles.button, { paddingHorizontal: 32 }]}
            onPress={fetchUserProfile}
          >
            <Text style={styles.buttonText}>{t('common.tryAgain')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{t('settings.title')}</Text>
          <Text style={styles.description}>
            {t('settings.description')}
          </Text>

          {/* Language Settings Section */}
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>{t('settings.language.title')}</Text>
            
            <View style={styles.languageContainer}>
              <Text style={[styles.languageLabel, !isVietnamese && styles.languageActive]}>
                {t('settings.language.english')}
              </Text>
              <Switch
                value={isVietnamese}
                onValueChange={handleLanguageToggle}
                trackColor={{ false: '#3498db', true: '#e74c3c' }}
                thumbColor="#ffffff"
              />
              <Text style={[styles.languageLabel, isVietnamese && styles.languageActive]}>
                {t('settings.language.vietnamese')}
              </Text>
            </View>
          </View>

          {/* Profile Information Section */}
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>{t('settings.profileSection')}</Text>

            {/* Username */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('settings.usernameLabel')}</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.disabledInput]}
                value={formData.username}
                onChangeText={(text) => setFormData({ ...formData, username: text })}
                placeholder={t('settings.usernamePlaceholder')}
                editable={isEditing}
                placeholderTextColor="#bdc3c7"
              />
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('settings.emailLabel')}</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.disabledInput]}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder={t('settings.emailPlaceholder')}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={isEditing}
                placeholderTextColor="#bdc3c7"
              />
            </View>

            {/* Phone Number */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('settings.phoneLabel')}</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.disabledInput]}
                value={formData.phonenumber}
                onChangeText={(text) => setFormData({ ...formData, phonenumber: text })}
                placeholder={t('settings.phonePlaceholder')}
                keyboardType="phone-pad"
                editable={isEditing}
                placeholderTextColor="#bdc3c7"
              />
            </View>

            {/* Role (Read-only) */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('settings.roleLabel')}</Text>
              <View style={[styles.input, styles.disabledInput, styles.roleContainer]}>
                <Text style={styles.roleText}>{formData.role}</Text>
              </View>
            </View>

            {/* Account Status */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('settings.accountStatusLabel')}</Text>
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
                    <Text style={styles.buttonText}>{t('settings.editProfile')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.secondaryButton} onPress={handleChangePassword}>
                    <Text style={styles.secondaryButtonText}>{t('auth.changePassword')}</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.buttonText}>{t('settings.saveChanges')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancel}
                  >
                    <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          {/* Account Information Section */}
          <View style={styles.infoContainer}>
            <Text style={styles.sectionTitle}>{t('settings.accountSection')}</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('settings.userId')}</Text>
              <Text style={styles.infoValue}>{userData.id}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('settings.memberSince')}</Text>
              <Text style={styles.infoValue}>{formatDate(userData.created_at)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('settings.lastLogin')}</Text>
              <Text style={styles.infoValue}>{t('settings.currentSession')}</Text>
            </View>
          </View>

          {/* Logout Section */}
          <View style={styles.logoutContainer}>
            <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
              <Text style={styles.logoutButtonText}>{t('settings.logout.button')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;