import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { styles } from '@/styles/change-password';
import { changePassword } from '@/api';

const ChangePasswordScreen: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Single toggle function for all password fields
  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      Alert.alert(t('common.error'), t('changePassword.validation.fillAllFields'));
      return;
    }

    if (formData.newPassword.length < 6) {
      Alert.alert(t('common.error'), t('changePassword.validation.passwordMinLength'));
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert(t('common.error'), t('changePassword.validation.passwordsNotMatch'));
      return;
    }

    setLoading(true);

    try {
      // Call change password API
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      Alert.alert(
        t('common.success'),
        t('changePassword.success'),
        [
          {
            text: t('common.ok'),
            onPress: () => {
              setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
              });
              router.push('/(tabs)/settings');
            }
          }
        ]
      );
    } catch (error: any) {
      Alert.alert(
        t('changePassword.failed'),
        error.message || t('changePassword.error')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/(tabs)/settings");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{t('changePassword.title')}</Text>
          <Text style={styles.description}>
            {t('changePassword.description')}
          </Text>

          <View style={styles.formContainer}>
            {/* Current Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('changePassword.currentPasswordLabel')}</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={formData.currentPassword}
                  onChangeText={(text) => setFormData({ ...formData, currentPassword: text })}
                  placeholder={t('changePassword.currentPasswordPlaceholder')}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#bdc3c7"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={togglePasswordVisibility}
                >
                  <Text style={styles.eyeIcon}>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('changePassword.newPasswordLabel')}</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={formData.newPassword}
                  onChangeText={(text) => setFormData({ ...formData, newPassword: text })}
                  placeholder={t('changePassword.newPasswordPlaceholder')}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#bdc3c7"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={togglePasswordVisibility}
                >
                  <Text style={styles.eyeIcon}>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm New Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('changePassword.confirmPasswordLabel')}</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                  placeholder={t('changePassword.confirmPasswordPlaceholder')}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#bdc3c7"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={togglePasswordVisibility}
                >
                  <Text style={styles.eyeIcon}>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Password Requirements */}
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>{t('changePassword.requirements.title')}</Text>
              <Text style={styles.requirementText}>• {t('changePassword.requirements.minLength')}</Text>
              <Text style={styles.requirementText}>• {t('changePassword.requirements.mixCase')}</Text>
              <Text style={styles.requirementText}>• {t('changePassword.requirements.number')}</Text>
              <Text style={styles.requirementText}>• {t('changePassword.requirements.special')}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>{t('auth.changePassword')}</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;