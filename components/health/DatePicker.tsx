import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';

import { styles } from '@/styles/(tabs)/health';

interface DatePickerProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  disabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({ 
  selectedDate, 
  onDateSelect, 
  disabled = false 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tempDay, setTempDay] = useState<number>(1);
  const [tempMonth, setTempMonth] = useState<number>(1);
  const [tempYear, setTempYear] = useState<number>(new Date().getFullYear());

  React.useEffect(() => {
    if (selectedDate && isVisible) {
      const [year, month, day] = selectedDate.split('-').map(Number);
      setTempYear(year);
      setTempMonth(month);
      setTempDay(day);
    } else if (isVisible && !selectedDate) {
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
