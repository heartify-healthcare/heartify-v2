import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

export interface DeviceInputProps {
  deviceId: string;
  onDeviceIdChange: (deviceId: string) => void;
  onConnect: () => void;
  onDisconnect: () => void;
  isConnected: boolean;
  disabled?: boolean;
}

export const DeviceInput: React.FC<DeviceInputProps> = ({
  deviceId,
  onDeviceIdChange,
  onConnect,
  onDisconnect,
  isConnected,
  disabled = false,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('ecg.deviceInput.label')}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, disabled && styles.disabledInput]}
          value={deviceId}
          onChangeText={onDeviceIdChange}
          placeholder={t('ecg.deviceInput.placeholder')}
          placeholderTextColor="#bdc3c7"
          editable={!isConnected && !disabled}
        />
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.connectButton,
            (isConnected || disabled) && styles.buttonDisabled,
          ]}
          onPress={onConnect}
          disabled={isConnected || disabled}
        >
          <Text style={styles.buttonText}>{t('ecg.deviceInput.connect')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.disconnectButton,
            (!isConnected || disabled) && styles.buttonDisabled,
          ]}
          onPress={onDisconnect}
          disabled={!isConnected || disabled}
        >
          <Text style={styles.buttonText}>{t('ecg.deviceInput.disconnect')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: width * 0.035,
    color: '#34495e',
    marginBottom: 8,
    fontWeight: '600',
  },
  inputRow: {
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#ecf0f1',
    borderRadius: 5,
    padding: width * 0.03,
    fontSize: width * 0.04,
    color: '#2c3e50',
  },
  disabledInput: {
    backgroundColor: '#f8f9fa',
    color: '#7f8c8d',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    borderRadius: 5,
    padding: width * 0.035,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectButton: {
    backgroundColor: '#27ae60',
  },
  disconnectButton: {
    backgroundColor: '#e74c3c',
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
});