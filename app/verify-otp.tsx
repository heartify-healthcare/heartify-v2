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
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from '@/styles/verify-otp';

// Define navigation prop type
interface VerifyOtpScreenProps {
  navigation?: {
    navigate: (screen: string) => void;
  };
}

const VerifyOtpScreen: React.FC<VerifyOtpScreenProps> = ({ navigation }) => {
  // State for the 6 OTP digits
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));

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
      Alert.alert('Error', 'Please enter a complete 6-digit OTP');
      return;
    }

    if (!email) {
      Alert.alert('Error', 'Email not found. Please go back and try again.');
      return;
    }

    // Navigate immediately for UI demo
    Alert.alert(
      'Success',
      'OTP verified successfully! (UI Demo Mode)',
      [
        {
          text: 'OK',
          onPress: () => {
            router.push('/login');
          }
        }
      ]
    );
  };

  // Resend OTP function
  const handleResendOtp = async () => {
    if (!email) {
      Alert.alert('Error', 'Email not found. Please go back and try again.');
      return;
    }

    // Show success immediately for UI demo
    Alert.alert(
      'Success',
      'OTP has been resent to your email! (UI Demo Mode)',
      [
        {
          text: 'OK',
          onPress: () => {
            setOtp(Array(6).fill(''));
            inputRefs.current[0]?.focus();
          }
        }
      ]
    );
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
            <Text style={styles.appName}>Heartify</Text>

            <View style={styles.formContainer}>
              <Text style={styles.title}>Verify OTP</Text>

              <Text style={styles.description}>
                Please enter the 6-digit OTP sent to {email ? email : 'your email'} to continue.
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
              >
                <Text style={styles.buttonText}>
                  Verify OTP
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleResendOtp}
              >
                <Text style={styles.resendText}>
                  Didn't receive the code? Resend OTP
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