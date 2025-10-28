import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from '@/styles/(tabs)/health';
import { 
  Dropdown, 
  DatePicker, 
  cpOptions, 
  exangOptions, 
  sexOptions
} from '@/components/health';
import { convertGMTToYYYYMMDD, validateAge } from '@/utils';
import type { HealthUserData, HealthFormData } from '@/types';

const HealthScreen: React.FC = () => {
  const [userData, setUserData] = useState<HealthUserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<HealthFormData>({
    dob: '',
    cp: undefined as number | undefined,
    exang: undefined as number | undefined,
    sex: undefined as number | undefined,
    trestbps: ''
  });

  const [originalData, setOriginalData] = useState<HealthFormData>({
    dob: '',
    cp: undefined as number | undefined,
    exang: undefined as number | undefined,
    sex: undefined as number | undefined,
    trestbps: ''
  });

  // Fetch user profile data
  const fetchUserProfile = async () => {
    // Mock user data
    const mockUserData: HealthUserData = {
      email: 'demo@heartify.com',
      id: 1,
      is_verified: true,
      phonenumber: '1234567890',
      role: 'user',
      username: 'demouser',
      created_at: new Date().toISOString(),
      dob: '1990-01-15',
      cp: 2,
      exang: 0,
      sex: 1,
      trestbps: 130
    };

    setUserData(mockUserData);
    
    const convertedDob = convertGMTToYYYYMMDD(mockUserData.dob || '');
    const newFormData = {
      dob: convertedDob,
      cp: mockUserData.cp,
      exang: mockUserData.exang,
      sex: mockUserData.sex,
      trestbps: mockUserData.trestbps?.toString() || ''
    };
    
    setFormData(newFormData);
    setOriginalData(newFormData);

    // Check if health data exists - if yes, set isEditing to false
    const hasHealthData = mockUserData.dob && mockUserData.cp !== null && 
                         mockUserData.exang !== null && mockUserData.sex !== null && 
                         mockUserData.trestbps !== null;
    setIsEditing(!hasHealthData);
  };

  // Load user data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setOriginalData({ ...formData });
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.dob || !formData.trestbps ||
      formData.cp === undefined || formData.exang === undefined || formData.sex === undefined) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Validate date of birth
    if (!validateAge(formData.dob)) {
      Alert.alert('Error', 'Please enter a valid date of birth (age must be between 10-100 years)');
      return;
    }

    // Validate numeric inputs
    const trestbps = parseInt(formData.trestbps);

    if (isNaN(trestbps) || trestbps < 50 || trestbps > 300) {
      Alert.alert('Error', 'Please enter a valid blood pressure (50-300 mm Hg)');
      return;
    }

    // Update local state
    if (userData) {
      const updatedUserData = {
        ...userData,
        dob: formData.dob,
        cp: formData.cp,
        exang: formData.exang,
        sex: formData.sex,
        trestbps: trestbps
      };
      setUserData(updatedUserData);
    }

    Alert.alert(
      'Success',
      userData?.dob ? 'Health data updated successfully! (UI Demo Mode)' : 'Health data submitted successfully! (UI Demo Mode)',
      [
        {
          text: 'OK',
          onPress: () => {
            setIsEditing(false);
            setOriginalData({ ...formData });
          }
        }
      ]
    );
  };

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.contentContainer, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ fontSize: 16, color: '#7f8c8d' }}>No user data available</Text>
        </View>
      </SafeAreaView>
    );
  }

  const hasHealthData = formData.dob !== '' &&
    userData.cp !== null && userData.cp !== undefined &&
    userData.exang !== null && userData.exang !== undefined &&
    userData.sex !== null && userData.sex !== undefined &&
    userData.trestbps !== null && userData.trestbps !== undefined;

  const isFormDisabled = hasHealthData && !isEditing;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Health Information</Text>
          <Text style={styles.description}>
            {hasHealthData
              ? 'Review and update your health information'
              : 'Please provide your health information for cardiovascular risk assessment'
            }
          </Text>

          <View style={styles.formContainer}>
            {/* Date of Birth Picker */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Date of Birth *</Text>
              <DatePicker
                selectedDate={formData.dob}
                onDateSelect={(date) => setFormData({ ...formData, dob: date })}
                disabled={isFormDisabled}
              />
            </View>

            {/* Sex Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Sex *</Text>
              <Dropdown
                options={sexOptions}
                selectedValue={formData.sex}
                onSelect={(value) => setFormData({ ...formData, sex: value })}
                placeholder="Select sex"
                disabled={isFormDisabled}
              />
            </View>

            {/* Chest Pain Type Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Chest Pain Type *</Text>
              <Dropdown
                options={cpOptions}
                selectedValue={formData.cp}
                onSelect={(value) => setFormData({ ...formData, cp: value })}
                placeholder="Select chest pain type"
                disabled={isFormDisabled}
              />
            </View>

            {/* Exercise Induced Angina Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Exercise Induced Angina *</Text>
              <Dropdown
                options={exangOptions}
                selectedValue={formData.exang}
                onSelect={(value) => setFormData({ ...formData, exang: value })}
                placeholder="Select exercise induced angina"
                disabled={isFormDisabled}
              />
            </View>

            {/* Resting Blood Pressure Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Resting Blood Pressure (mm Hg) *</Text>
              <TextInput
                style={[styles.input, isFormDisabled && styles.disabledInput]}
                value={formData.trestbps}
                onChangeText={(text) => setFormData({ ...formData, trestbps: text })}
                placeholder="Enter resting blood pressure"
                keyboardType="numeric"
                editable={!isFormDisabled}
                placeholderTextColor="#bdc3c7"
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              {hasHealthData && !isEditing ? (
                <TouchableOpacity style={styles.button} onPress={handleEdit}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.buttonText}>
                      {hasHealthData ? 'Update' : 'Submit'}
                    </Text>
                  </TouchableOpacity>

                  {hasHealthData && (
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={handleCancel}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HealthScreen;