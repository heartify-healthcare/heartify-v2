import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';

const { width, height } = Dimensions.get('window');

const ChangePasswordScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = () => {
    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (formData.newPassword.length < 8) {
      Alert.alert('Error', 'New password must be at least 8 characters long');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    // Simulate API call
    Alert.alert(
      'Success', 
      'Password changed successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            // TODO: Navigate back to settings
            setFormData({
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            });
          }
        }
      ]
    );
  };

  const handleCancel = () => {
    // TODO: Navigate back to settings
    Alert.alert('Cancel', 'This would navigate back to settings');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Change Password</Text>
          <Text style={styles.description}>
            Enter your current password and choose a new secure password
          </Text>

          <View style={styles.formContainer}>
            {/* Current Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Current Password *</Text>
              <TextInput
                style={styles.input}
                value={formData.currentPassword}
                onChangeText={(text) => setFormData({ ...formData, currentPassword: text })}
                placeholder="Enter current password"
                secureTextEntry
                placeholderTextColor="#bdc3c7"
              />
            </View>

            {/* New Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>New Password *</Text>
              <TextInput
                style={styles.input}
                value={formData.newPassword}
                onChangeText={(text) => setFormData({ ...formData, newPassword: text })}
                placeholder="Enter new password (min 8 characters)"
                secureTextEntry
                placeholderTextColor="#bdc3c7"
              />
            </View>

            {/* Confirm New Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm New Password *</Text>
              <TextInput
                style={styles.input}
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                placeholder="Confirm new password"
                secureTextEntry
                placeholderTextColor="#bdc3c7"
              />
            </View>

            {/* Password Requirements */}
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>Password Requirements:</Text>
              <Text style={styles.requirementText}>• At least 8 characters long</Text>
              <Text style={styles.requirementText}>• Mix of uppercase and lowercase letters</Text>
              <Text style={styles.requirementText}>• At least one number</Text>
              <Text style={styles.requirementText}>• At least one special character</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Change Password</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: width * 0.05,
    paddingBottom: height * 0.05,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: height * 0.01,
    textAlign: 'center',
  },
  description: {
    fontSize: width * 0.04,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: height * 0.03,
    lineHeight: width * 0.05,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: width * 0.05,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: height * 0.02,
  },
  inputLabel: {
    fontSize: width * 0.035,
    color: '#34495e',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#ecf0f1',
    borderRadius: 5,
    padding: width * 0.03,
    fontSize: width * 0.04,
    color: '#2c3e50',
  },
  requirementsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    padding: width * 0.03,
    marginBottom: height * 0.02,
  },
  requirementsTitle: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: height * 0.01,
  },
  requirementText: {
    fontSize: width * 0.03,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  buttonContainer: {
    marginTop: height * 0.02,
  },
  button: {
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    padding: width * 0.035,
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
    borderRadius: 5,
    padding: width * 0.035,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});

export default ChangePasswordScreen;