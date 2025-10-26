import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from '@/styles/(tabs)/index';
import { PredictionCard, PredictionData } from '@/components/predictions';

const PredictionsScreen: React.FC = () => {
  const [predictions, setPredictions] = useState<PredictionData[]>([]);

  const fetchPredictions = async () => {
    // Mock predictions data
    const mockPredictions: PredictionData[] = [
      {
        id: 3,
        user_id: 1,
        age: 45,
        cp: 2,
        exang: 0,
        prediction: 'NEGATIVE',
        probability: 0.85,
        restecg: 1,
        sex: 1,
        thalach: 150,
        trestbps: 130,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        user_id: 1,
        age: 55,
        cp: 3,
        exang: 1,
        prediction: 'POSITIVE',
        probability: 0.72,
        restecg: 1,
        sex: 0,
        thalach: 140,
        trestbps: 145,
        created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 1,
        user_id: 1,
        age: 50,
        cp: 1,
        exang: 0,
        prediction: 'NEGATIVE',
        probability: 0.90,
        restecg: 0,
        sex: 1,
        thalach: 160,
        trestbps: 120,
        created_at: new Date(Date.now() - 172800000).toISOString()
      }
    ];

    // Sort predictions by ID in descending order (newest first)
    const sortedData = mockPredictions.sort((a, b) => b.id - a.id);
    setPredictions(sortedData);
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No Predictions Yet</Text>
      <Text style={styles.emptyStateDescription}>
        You haven't made any heart disease predictions yet.
        Start by making your first prediction!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Predictions</Text>
        <Text style={styles.description}>
          View your cardiovascular health predictions and risk assessments
        </Text>

        {predictions.length === 0 ? (
          renderEmptyState()
        ) : (
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {predictions.map((prediction) => (
              <PredictionCard key={prediction.id} data={prediction} />
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default PredictionsScreen;