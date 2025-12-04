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

import { styles } from '@/styles/signup';
import { register, requestVerify } from '@/api';

// Define navigation prop type
interface SignUpScreenProps {
  navigation?: {
    navigate: (screen: string) => void;
  };
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Navigation function (placeholder)
  const handleLogin = (): void => {
    // Navigate to login screen
    router.push("/login");
  };

  // Single toggle function for both password fields
  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = async (): Promise<void> => {
    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert(t('common.error'), t('signup.validation.fillAllFields'));
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(t('common.error'), t('signup.validation.passwordsNotMatch'));
      return;
    }

    if (password.length < 6) {
      Alert.alert(t('common.error'), t('signup.validation.passwordMinLength'));
      return;
    }

    if (username.length < 3) {
      Alert.alert(t('common.error'), t('signup.validation.usernameMinLength'));
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(t('common.error'), t('signup.validation.invalidEmail'));
      return;
    }

    setLoading(true);

    try {
      // Register user (backend automatically sends OTP email)
      await register({
        username: username.trim(),
        email: email.trim(),
        password: password,
        phonenumber: phoneNumber.trim() || undefined, // lowercase 'n' to match backend
      });

      // Navigate to OTP verification screen
      Alert.alert(
        t('common.success'),
        t('signup.registrationSuccess'),
        [
          {
            text: t('common.ok'),
            onPress: () => {
              router.push({
                pathname: '/verify-otp',
                params: { email: email.trim() },
              });
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        t('signup.registrationFailed'),
        error.message || t('signup.registrationError')
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
              <Text style={styles.title}>{t('signup.title')}</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t('signup.usernameLabel')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('signup.usernamePlaceholder')}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t('signup.emailLabel')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('signup.emailPlaceholder')}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t('signup.phoneLabel')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('signup.phonePlaceholder')}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t('signup.passwordLabel')}</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder={t('signup.passwordPlaceholder')}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
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

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t('signup.confirmPasswordLabel')}</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder={t('signup.confirmPasswordPlaceholder')}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
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

              <TouchableOpacity
                style={styles.button}
                onPress={handleSignUp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    {t('auth.signUp')}
                  </Text>
                )}
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>{t('signup.hasAccount')}</Text>
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

export default SignUpScreen;