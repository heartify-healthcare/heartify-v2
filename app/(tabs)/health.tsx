import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert
} from 'react-native';

import { styles } from '@/styles/(tabs)/health';

interface UserData {
  email: string;
  id: number;
  is_verified: boolean;
  phonenumber: string;
  role: string;
  username: string;
  dob?: string; // Changed from age to dob
  cp?: number;
  exang?: number;
  sex?: number;
  trestbps?: number;
}

interface DropdownOption {
  label: string;
  value: number;
}

const cpOptions: DropdownOption[] = [
  { label: "Typical angina", value: 1 },
  { label: "Atypical angina", value: 2 },
  { label: "Non-anginal pain", value: 3 },
  { label: "Asymptomatic", value: 4 }
];

const exangOptions: DropdownOption[] = [
  { label: "Yes", value: 1 },
  { label: "No", value: 0 }
];

const sexOptions: DropdownOption[] = [
  { label: "Male", value: 1 },
  { label: "Female", value: 0 }
];

interface DropdownProps {
  options: DropdownOption[];
  selectedValue: number | undefined;
  onSelect: (value: number) => void;
  placeholder: string;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ 
  options, 
  selectedValue, 
  onSelect, 
  placeholder, 
  disabled = false 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const selectedOption = options.find(option => option.value === selectedValue);

  const handleSelect = (value: number) => {
    onSelect(value);
    setIsVisible(false);
  };

  return (
    <>
      <TouchableOpacity 
        style={[styles.dropdownButton, disabled && styles.disabledInput]} 
        onPress={() => !disabled && setIsVisible(true)}
        disabled={disabled}
      >
        <Text style={[
          styles.dropdownText, 
          !selectedOption && styles.placeholderText,
          disabled && styles.disabledText
        ]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text style={[styles.dropdownArrow, disabled && styles.disabledText]}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{placeholder}</Text>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.modalOption,
                  selectedValue === option.value && styles.selectedOption
                ]}
                onPress={() => handleSelect(option.value)}
              >
                <Text style={[
                  styles.modalOptionText,
                  selectedValue === option.value && styles.selectedOptionText
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

interface DatePickerProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  disabled?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateSelect, disabled = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tempDay, setTempDay] = useState<number>(1);
  const [tempMonth, setTempMonth] = useState<number>(1);
  const [tempYear, setTempYear] = useState<number>(new Date().getFullYear());

  // Initialize temp values when modal opens
  React.useEffect(() => {
    if (selectedDate && isVisible) {
      const [year, month, day] = selectedDate.split('-').map(Number);
      setTempYear(year);
      setTempMonth(month);
      setTempDay(day);
    } else if (isVisible && !selectedDate) {
      // Set default to a reasonable birth year (e.g., 30 years ago)
      const currentYear = new Date().getFullYear();
      setTempYear(currentYear - 30);
      setTempMonth(1);
      setTempDay(1);
    }
  }, [isVisible, selectedDate]);

  const formatDisplayDate = (dateString: string): string => {
    if (!dateString) return '';
    try {
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month, 0).getDate();
  };

  const generateYears = (): number[] => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 100; year <= currentYear - 10; year++) {
      years.push(year);
    }
    return years.reverse();
  };

  const generateMonths = (): { label: string; value: number }[] => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months.map((month, index) => ({ label: month, value: index + 1 }));
  };

  const generateDays = (): number[] => {
    const daysInMonth = getDaysInMonth(tempMonth, tempYear);
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const handleConfirm = () => {
    const formattedDate = `${tempYear}-${tempMonth.toString().padStart(2, '0')}-${tempDay.toString().padStart(2, '0')}`;
    onDateSelect(formattedDate);
    setIsVisible(false);
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  return (
    <>
      <TouchableOpacity 
        style={[styles.dropdownButton, disabled && styles.disabledInput]} 
        onPress={() => !disabled && setIsVisible(true)}
        disabled={disabled}
      >
        <Text style={[
          styles.dropdownText, 
          !selectedDate && styles.placeholderText,
          disabled && styles.disabledText
        ]}>
          {selectedDate ? formatDisplayDate(selectedDate) : 'Select date of birth'}
        </Text>
        <Text style={[styles.dropdownArrow, disabled && styles.disabledText]}>📅</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerModal}>
            <Text style={styles.modalTitle}>Select Date of Birth</Text>
            
            <View style={styles.datePickerContainer}>
              {/* Year Picker */}
              <View style={styles.datePickerColumn}>
                <Text style={styles.datePickerLabel}>Year</Text>
                <ScrollView style={styles.datePickerScroll} showsVerticalScrollIndicator={false}>
                  {generateYears().map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.datePickerOption,
                        tempYear === year && styles.selectedDateOption
                      ]}
                      onPress={() => setTempYear(year)}
                    >
                      <Text style={[
                        styles.datePickerOptionText,
                        tempYear === year && styles.selectedDateOptionText
                      ]}>
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Month Picker */}
              <View style={styles.datePickerColumn}>
                <Text style={styles.datePickerLabel}>Month</Text>
                <ScrollView style={styles.datePickerScroll} showsVerticalScrollIndicator={false}>
                  {generateMonths().map((month) => (
                    <TouchableOpacity
                      key={month.value}
                      style={[
                        styles.datePickerOption,
                        tempMonth === month.value && styles.selectedDateOption
                      ]}
                      onPress={() => setTempMonth(month.value)}
                    >
                      <Text style={[
                        styles.datePickerOptionText,
                        tempMonth === month.value && styles.selectedDateOptionText
                      ]}>
                        {month.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Day Picker */}
              <View style={styles.datePickerColumn}>
                <Text style={styles.datePickerLabel}>Day</Text>
                <ScrollView style={styles.datePickerScroll} showsVerticalScrollIndicator={false}>
                  {generateDays().map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.datePickerOption,
                        tempDay === day && styles.selectedDateOption
                      ]}
                      onPress={() => setTempDay(day)}
                    >
                      <Text style={[
                        styles.datePickerOptionText,
                        tempDay === day && styles.selectedDateOptionText
                      ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.datePickerButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const HealthScreen: React.FC = () => {
  // Mock existing user data - simulate data from backend
  const mockUserData: UserData = {
    email: "songokupkj@gmail.com",
    id: 1,
    is_verified: true,
    phonenumber: "0865942420",
    role: "user",
    username: "songokupkj",
    dob: "1974-05-15", // Changed from age to dob
    cp: 1,
    exang: 1,
    sex: 1,
    trestbps: 120
  };

  // Check if health data exists
  const hasHealthData = mockUserData.dob !== undefined && 
                       mockUserData.cp !== undefined && 
                       mockUserData.exang !== undefined && 
                       mockUserData.sex !== undefined && 
                       mockUserData.trestbps !== undefined;

  // State management
  const [isEditing, setIsEditing] = useState(!hasHealthData);
  const [formData, setFormData] = useState({
    dob: mockUserData.dob || '', // Changed from age to dob
    cp: mockUserData.cp,
    exang: mockUserData.exang,
    sex: mockUserData.sex,
    trestbps: mockUserData.trestbps?.toString() || ''
  });

  const [originalData, setOriginalData] = useState({
    dob: mockUserData.dob || '', // Changed from age to dob
    cp: mockUserData.cp,
    exang: mockUserData.exang,
    sex: mockUserData.sex,
    trestbps: mockUserData.trestbps?.toString() || ''
  });

  const handleEdit = () => {
    setIsEditing(true);
    setOriginalData({ ...formData });
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setIsEditing(false);
  };

  const validateAge = (dob: string): boolean => {
    if (!dob) return false;
    
    try {
      const [year, month, day] = dob.split('-').map(Number);
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age >= 10 && age <= 100;
    } catch {
      return false;
    }
  };

  const handleSubmit = () => {
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

    // Simulate API call
    Alert.alert(
      'Success', 
      hasHealthData ? 'Health data updated successfully!' : 'Health data submitted successfully!',
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
                  <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>
                      {hasHealthData ? 'Update' : 'Submit'}
                    </Text>
                  </TouchableOpacity>
                  
                  {hasHealthData && (
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
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