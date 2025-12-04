import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
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

import { styles } from '@/styles/verify-otp';
import { verifyOtp, requestVerify } from '@/api';

// Define navigation prop type
interface VerifyOtpScreenProps {
  navigation?: {
    navigate: (screen: string) => void;
  };
}

const VerifyOtpScreen: React.FC<VerifyOtpScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  
  // State for the 6 OTP digits
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState<boolean>(false);

  // Create refs for each input field
  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Get email from navigation params
  const params = useLocalSearchParams();
  const email = params.email as string;

  // Initialize the refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const router = useRouter();

  // Handle input change for each OTP digit
  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers
    if (!/^[0-9]$/.test(value) && value !== '') {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next input if a digit was entered
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace key press
  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP function
  const handleVerifyOtp = async () => {
    const otpString = otp.join('');

    // Validate OTP
    if (otpString.length !== 6) {
      Alert.alert(t('common.error'), t('verifyOtp.validation.incompleteOtp'));
      return;
    }

    if (!email) {
      Alert.alert(t('common.error'), t('verifyOtp.validation.emailNotFound'));
      return;
    }

    setLoading(true);

    try {
      // Call verify OTP API
      await verifyOtp({
        email: email,
        otpCode: otpString,
      });

      // Navigate to login on success
      Alert.alert(
        t('common.success'),
        t('verifyOtp.verificationSuccess'),
        [
          {
            text: t('common.ok'),
            onPress: () => {
              router.push('/login');
            }
          }
        ]
      );
    } catch (error: any) {
      Alert.alert(
        t('verifyOtp.verificationFailed'),
        error.message || t('verifyOtp.verificationError')
      );
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP function
  const handleResendOtp = async () => {
    if (!email) {
      Alert.alert(t('common.error'), t('verifyOtp.validation.emailNotFound'));
      return;
    }

    setLoading(true);

    try {
      // Call request verify API
      await requestVerify({
        email: email,
      });

      Alert.alert(
        t('common.success'),
        t('verifyOtp.resendSuccess'),
        [
          {
            text: t('common.ok'),
            onPress: () => {
              setOtp(Array(6).fill(''));
              inputRefs.current[0]?.focus();
            }
          }
        ]
      );
    } catch (error: any) {
      Alert.alert(
        t('verifyOtp.resendFailed'),
        error.message || t('verifyOtp.resendError')
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
              <Text style={styles.title}>{t('verifyOtp.title')}</Text>

              <Text style={styles.description}>
                {email 
                  ? t('verifyOtp.description', { email }) 
                  : t('verifyOtp.descriptionNoEmail')
                }
              </Text>

              <View style={styles.otpContainer}>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    style={styles.otpInput}
                    value={otp[index]}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    selectTextOnFocus
                    autoCapitalize="none"
                  />
                ))}
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleVerifyOtp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    {t('auth.verifyOtp')}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleResendOtp}
                disabled={loading}
              >
                <Text style={styles.resendText}>
                  {t('verifyOtp.resendText')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VerifyOtpScreen;