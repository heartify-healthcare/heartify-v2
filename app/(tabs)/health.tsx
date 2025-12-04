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
import { useTranslation } from 'react-i18next';

import { styles } from '@/styles/(tabs)/health';
import { 
  Dropdown, 
  DatePicker
} from '@/components/health';
import { useHealthOptions } from '@/hooks';
import { convertGMTToYYYYMMDD, validateAge } from '@/utils';
import type { HealthUserData, HealthFormData } from '@/types';
import { getProfile, updateHealth } from '@/api';
import type { User } from '@/types';

const HealthScreen: React.FC = () => {
  const { t } = useTranslation();
  const { cpOptions, exangOptions, sexOptions } = useHealthOptions();
  
  const [userData, setUserData] = useState<HealthUserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    try {
      setIsLoading(true);
      const profile: User = await getProfile();
      
      // Map User to HealthUserData
      const mappedUserData: HealthUserData = {
        email: profile.email,
        id: profile.id,
        is_verified: profile.isVerified ?? false,
        phonenumber: profile.phonenumber || '',
        role: profile.role,
        username: profile.username,
        created_at: profile.createdAt,
        dob: profile.dob,
        cp: profile.cp,
        exang: profile.exang,
        sex: profile.sex,
        trestbps: profile.trestbps
      };

      setUserData(mappedUserData);
      
      const convertedDob = profile.dob ? convertGMTToYYYYMMDD(profile.dob) : '';
      const newFormData = {
        dob: convertedDob,
        cp: profile.cp,
        exang: profile.exang,
        sex: profile.sex,
        trestbps: profile.trestbps?.toString() || ''
      };
      
      setFormData(newFormData);
      setOriginalData(newFormData);

      // Check if health data exists
      // If NO health data, enable editing mode automatically
      // If HAS health data, disable editing (user can click Edit button)
      const hasHealthData = !!(
        profile.dob && 
        profile.cp !== null && profile.cp !== undefined &&
        profile.exang !== null && profile.exang !== undefined &&
        profile.sex !== null && profile.sex !== undefined &&
        profile.trestbps !== null && profile.trestbps !== undefined
      );
      setIsEditing(!hasHealthData);
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      Alert.alert(t('common.error'), error.message || t('health.updateFailed'));
    } finally {
      setIsLoading(false);
    }
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
      Alert.alert(t('common.error'), t('health.validation.fillAllFields'));
      return;
    }

    // Validate date of birth
    if (!validateAge(formData.dob)) {
      Alert.alert(t('common.error'), t('health.validation.invalidDob'));
      return;
    }

    // Validate numeric inputs
    const trestbps = parseInt(formData.trestbps);

    if (isNaN(trestbps) || trestbps < 50 || trestbps > 300) {
      Alert.alert(t('common.error'), t('health.validation.invalidBloodPressure'));
      return;
    }

    try {
      // Call API to update health data
      const updatedProfile = await updateHealth({
        dob: formData.dob,
        sex: formData.sex,
        cp: formData.cp,
        trestbps: trestbps,
        exang: formData.exang
      });

      // Update local state with response
      const mappedUserData: HealthUserData = {
        email: updatedProfile.email,
        id: updatedProfile.id,
        is_verified: updatedProfile.isVerified ?? false,
        phonenumber: updatedProfile.phonenumber || '',
        role: updatedProfile.role,
        username: updatedProfile.username,
        created_at: updatedProfile.createdAt,
        dob: updatedProfile.dob,
        cp: updatedProfile.cp,
        exang: updatedProfile.exang,
        sex: updatedProfile.sex,
        trestbps: updatedProfile.trestbps
      };
      setUserData(mappedUserData);

      Alert.alert(
        t('common.success'),
        userData?.dob ? t('health.updateSuccess') : t('health.submitSuccess'),
        [
          {
            text: t('common.ok'),
            onPress: () => {
              setIsEditing(false);
              setOriginalData({ ...formData });
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Error updating health data:', error);
      Alert.alert(t('common.error'), error.message || t('health.updateFailed'));
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.contentContainer, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ fontSize: 16, color: '#3498db' }}>{t('health.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state if no user data
  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.contentContainer, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ fontSize: 16, color: '#e74c3c', marginBottom: 16 }}>{t('health.failedToLoad')}</Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={fetchUserProfile}
          >
            <Text style={styles.buttonText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Check if user has completed health data
  const hasHealthData = !!(
    userData.dob && 
    userData.cp !== null && userData.cp !== undefined &&
    userData.exang !== null && userData.exang !== undefined &&
    userData.sex !== null && userData.sex !== undefined &&
    userData.trestbps !== null && userData.trestbps !== undefined
  );

  const isFormDisabled = hasHealthData && !isEditing;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{t('health.title')}</Text>
          <Text style={styles.description}>
            {hasHealthData
              ? t('health.descriptionExisting')
              : t('health.descriptionNew')
            }
          </Text>

          {/* Info box for new users */}
          {!hasHealthData && (
            <View style={{
              backgroundColor: '#e3f2fd',
              padding: 16,
              borderRadius: 8,
              marginBottom: 20,
              borderLeftWidth: 4,
              borderLeftColor: '#2196f3'
            }}>
              <Text style={{ 
                fontSize: 14, 
                color: '#1976d2',
                fontWeight: '600',
                marginBottom: 8
              }}>
                {t('health.infoBox.title')}
              </Text>
              <Text style={{ fontSize: 13, color: '#424242', lineHeight: 20 }}>
                {t('health.infoBox.message')}
              </Text>
            </View>
          )}

          <View style={styles.formContainer}>
            {/* Date of Birth Picker */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('health.fields.dobLabel')}</Text>
              <DatePicker
                selectedDate={formData.dob}
                onDateSelect={(date) => setFormData({ ...formData, dob: date })}
                disabled={isFormDisabled}
              />
            </View>

            {/* Sex Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('health.fields.sexLabel')}</Text>
              <Dropdown
                options={sexOptions}
                selectedValue={formData.sex}
                onSelect={(value) => setFormData({ ...formData, sex: value })}
                placeholder={t('health.fields.sexPlaceholder')}
                disabled={isFormDisabled}
              />
            </View>

            {/* Chest Pain Type Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('health.fields.chestPainLabel')}</Text>
              <Dropdown
                options={cpOptions}
                selectedValue={formData.cp}
                onSelect={(value) => setFormData({ ...formData, cp: value })}
                placeholder={t('health.fields.chestPainPlaceholder')}
                disabled={isFormDisabled}
              />
            </View>

            {/* Exercise Induced Angina Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('health.fields.exerciseAnginaLabel')}</Text>
              <Dropdown
                options={exangOptions}
                selectedValue={formData.exang}
                onSelect={(value) => setFormData({ ...formData, exang: value })}
                placeholder={t('health.fields.exerciseAnginaPlaceholder')}
                disabled={isFormDisabled}
              />
            </View>

            {/* Resting Blood Pressure Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('health.fields.bloodPressureLabel')}</Text>
              <TextInput
                style={[styles.input, isFormDisabled && styles.disabledInput]}
                value={formData.trestbps}
                onChangeText={(text) => setFormData({ ...formData, trestbps: text })}
                placeholder={t('health.fields.bloodPressurePlaceholder')}
                keyboardType="numeric"
                editable={!isFormDisabled}
                placeholderTextColor="#bdc3c7"
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              {hasHealthData && !isEditing ? (
                <TouchableOpacity style={styles.button} onPress={handleEdit}>
                  <Text style={styles.buttonText}>{t('common.edit')}</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.buttonText}>
                      {hasHealthData ? t('common.update') : t('common.submit')}
                    </Text>
                  </TouchableOpacity>

                  {hasHealthData && (
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={handleCancel}
                    >
                      <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
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