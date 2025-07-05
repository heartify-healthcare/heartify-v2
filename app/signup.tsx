import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';

import { styles } from '@/styles/signup';

// Define navigation prop type
interface SignUpScreenProps {
  navigation?: {
    navigate: (screen: string) => void;
  };
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const router = useRouter();

  // Navigation function (placeholder)
  const handleLogin = (): void => {
    // Navigate to login screen
    router.push("/login");
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = (): void => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSignUp = async (): Promise<void> => {
    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (username.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare request payload
      const payload = {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        phonenumber: phoneNumber.trim() || null,
        password: password
      };

      // Make API call to register endpoint
      const response = await fetch('http://192.168.1.20:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful
        Alert.alert(
          'Success', 
          data.message || 'Registration successful! Please check your email for verification code.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to OTP verification screen
                // Pass email as parameter for OTP verification
                router.push({
                  pathname: '/verify-otp',
                  params: { email: email.trim().toLowerCase() }
                });
              }
            }
          ]
        );
      } else {
        // Registration failed
        const errorMessage = data.error || 'Registration failed. Please try again.';
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
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
            <Text style={styles.appName}>Heartify</Text>
            
            <View style={styles.formContainer}>
              <Text style={styles.title}>Sign Up</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Username *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Create a username"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  editable={!isLoading}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password *</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Create a password (min 6 characters)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={togglePasswordVisibility}
                    disabled={isLoading}
                  >
                    <Text style={styles.eyeIcon}>
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm Password *</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={toggleConfirmPasswordVisibility}
                    disabled={isLoading}
                  >
                    <Text style={styles.eyeIcon}>
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <TouchableOpacity 
                style={[styles.button, isLoading && { opacity: 0.6 }]} 
                onPress={handleSignUp}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Signing Up...' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
              
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={handleLogin} disabled={isLoading}>
                  <Text style={styles.loginLink}>Log In</Text>
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