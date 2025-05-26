import React from 'react';
import { 
  View, 
  Text, 
  SafeAreaView,
  StyleSheet,
  Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');

const HealthScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Health</Text>
        <Text style={styles.description}>
          Monitor your health metrics and track your progress
        </Text>
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>
            Health data and metrics will appear here
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flex: 1,
    padding: width * 0.05,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  description: {
    fontSize: width * 0.04,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: height * 0.03,
  },
  placeholderCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: width * 0.05,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: height * 0.2,
  },
  placeholderText: {
    fontSize: width * 0.04,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default HealthScreen;