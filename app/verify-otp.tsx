import { useRouter } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

const { width, height } = Dimensions.get('window');

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
  const handleVerifyOtp = () => {
    const otpString = otp.join('');
    // Implement OTP verification logic here
    console.log('Verifying OTP:', otpString);
  };

  // Resend OTP function
  const handleResendOtp = () => {
    // Implement resend OTP logic here
    console.log('Resending OTP');
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
            <Text style={styles.appName}>Cardiovascular Disease Prediction</Text>
            
            <View style={styles.formContainer}>
              <Text style={styles.title}>Verify OTP</Text>
              
              <Text style={styles.description}>
                Please enter the 6-digit OTP sent to your email to continue.
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
              
              <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
                <Text style={styles.buttonText}>Verify OTP</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handleResendOtp}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: width * 0.05,
  },
  appName: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: height * 0.05,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: width * 0.05,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  description: {
    fontSize: width * 0.035,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: height * 0.03,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.03,
  },
  otpInput: {
    width: width * 0.11,
    height: width * 0.13,
    backgroundColor: '#ecf0f1',
    borderRadius: 5,
    fontSize: width * 0.05,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
  },
  button: {
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    padding: width * 0.035,
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  resendText: {
    fontSize: width * 0.035,
    color: '#3498db',
    textAlign: 'center',
  },
});

export default VerifyOtpScreen;