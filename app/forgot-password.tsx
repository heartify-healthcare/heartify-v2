import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { styles } from '@/styles/forgot-password';
import { recoverPassword } from '@/api';

// Define navigation prop type
interface ForgotPasswordScreenProps {
  navigation?: {
    navigate: (screen: string) => void;
  };
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Navigation function (placeholder)
  const handleLogin = (): void => {
    // Navigate to login screen
    router.push("/login");
  };

  const handleResetPassword = async (): Promise<void> => {
    // Basic validation
    if (!username.trim() || !email.trim() || !phoneNumber.trim()) {
      Alert.alert(t('common.error'), t('forgotPassword.validation.fillAllFields'));
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(t('common.error'), t('forgotPassword.validation.invalidEmail'));
      return;
    }

    setLoading(true);

    try {
      // Call recover password API
      await recoverPassword({
        username: username.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(), // lowercase 'n' to match backend
      });

      Alert.alert(
        t('common.success'),
        t('forgotPassword.recoverySuccess'),
        [
          {
            text: t('common.ok'),
            onPress: () => {
              setUsername('');
              setEmail('');
              setPhoneNumber('');
              router.push('/login');
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        t('forgotPassword.recoveryFailed'),
        error.message || t('forgotPassword.recoveryError')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentContainer}>
            <Text style={styles.appName}>{t('common.appName')}</Text>

            <View style={styles.formContainer}>
              <Text style={styles.title}>{t('forgotPassword.title')}</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t('forgotPassword.usernameLabel')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('forgotPassword.usernamePlaceholder')}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t('forgotPassword.emailLabel')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('forgotPassword.emailPlaceholder')}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t('forgotPassword.phoneLabel')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('forgotPassword.phonePlaceholder')}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>{t('auth.resetPassword')}</Text>
                )}
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>{t('forgotPassword.rememberedPassword')}</Text>
                <TouchableOpacity onPress={handleLogin}>
                  <Text style={styles.loginLink}>{t('auth.logIn')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;