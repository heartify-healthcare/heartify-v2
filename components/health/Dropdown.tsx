import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';

import { styles } from '@/styles/(tabs)/health';
import type { DropdownOption } from '@/types';

interface DropdownProps {
  options: DropdownOption[];
  selectedValue: number | undefined;
  onSelect: (value: number) => void;
  placeholder: string;
  disabled?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
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
