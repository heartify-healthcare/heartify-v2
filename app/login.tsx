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
import AsyncStorage from '@react-native-async-storage/async-storage';

import { styles } from '@/styles/login';

// Define navigation prop type
interface LoginScreenProps {
  navigation?: {
    navigate: (screen: string) => void;
  };
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // Navigation functions (placeholders)
  const handleForgotPassword = (): void => {
    // Navigate to forgot password screen
    router.push("/forgot-password");
  };

  const handleSignUp = (): void => {
    // Navigate to sign up screen
    router.push("/signup");
  };

  const handleLogin = async (): Promise<void> => {
    // Basic validation
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare request payload
      const payload = {
        username: username.trim(),
        password: password
      };

      // Make API call to login endpoint
      const response = await fetch('http://192.168.1.20:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        const { access_token, token_type, user } = data;
        
        try {
          // Store authentication data
          await AsyncStorage.multiSet([
            ['access_token', access_token],
            ['token_type', token_type],
            ['user_data', JSON.stringify(user)]
          ]);

          Alert.alert(
            'Success', 
            `Welcome back, ${user.username}!`,
            [
              {
                text: 'OK',
                onPress: () => {
                  // Navigate to main app or dashboard
                  router.replace('/(tabs)');
                }
              }
            ]
          );
        } catch (storageError) {
          console.error('Error storing authentication data:', storageError);
          Alert.alert('Warning', 'Login successful but failed to store session data');
        }
      } else {
        // Login failed
        const errorMessage = data.error || 'Login failed. Please try again.';
        Alert.alert('Error', errorMessage);
        
        // Clear password field on error
        setPassword('');
      }
    } catch (error) {
      console.error('Login error:', error);
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
            <Text style={styles.appDescription}>A Mobile Application for Cardiovascular Disease Prediction</Text>
            <Text style={styles.slogan}>"Your Heart, Your Future"</Text>
            
            <View style={styles.formContainer}>
              <Text style={styles.title}>Login</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your username"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  editable={!isLoading}
                />
              </View>
              
              <TouchableOpacity 
                onPress={handleForgotPassword}
                disabled={isLoading}
              >
                <Text style={[styles.forgotPassword, isLoading && { opacity: 0.6 }]}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, isLoading && { opacity: 0.6 }]} 
                onPress={handleLogin}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Text>
              </TouchableOpacity>
              
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={handleSignUp} disabled={isLoading}>
                  <Text style={[styles.signupLink, isLoading && { opacity: 0.6 }]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;