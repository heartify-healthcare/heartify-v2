import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LoadingScreenProps {
  message?: string;
}

interface ErrorScreenProps {
  title: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        {message && (
          <Text style={styles.loadingText}>{message}</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ 
  title, 
  message, 
  onRetry, 
  retryText = 'Try Again' 
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>{title}</Text>
        {message && (
          <Text style={styles.errorMessage}>{message}</Text>
        )}
        {onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryButtonText}>{retryText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#7f8c8d',
    fontSize: 16,
    marginTop: 16,
  },
  errorTitle: {
    color: '#e74c3c',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    color: '#7f8c8d',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
