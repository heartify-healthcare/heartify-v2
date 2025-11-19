import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '@/styles/(tabs)/index';
import { ECGSessionCard } from '@/components/predictions';
import { getECGSessions, getECGRecording, getPrediction, getExplanation } from '@/api';
import type { ECGSession } from '@/types';

const PredictionsScreen: React.FC = () => {
  const [sessions, setSessions] = useState<ECGSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch ECG sessions on component mount
  useEffect(() => {
    fetchECGSessions();
  }, []);

  const fetchECGSessions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch ECG sessions list
      const response = await getECGSessions(0, 10, 'createdAt', 'desc');
      
      // Initialize sessions with loading states
      const initializedSessions = response.content.map(session => ({
        ...session,
        loadingState: {
          ecgRecording: 'idle' as const,
          prediction: 'idle' as const,
          explanation: 'idle' as const,
        }
      }));
      
      setSessions(initializedSessions);
    } catch (err: any) {
      console.error('Failed to fetch ECG sessions:', err);
      setError(err.message || 'Failed to load ECG sessions');
      Alert.alert(
        'Error',
        'Failed to load ECG sessions. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchECGSessions();
    setRefreshing(false);
  };

  // Handle session expansion - fetch detailed data progressively
  const handleExpand = async (sessionId: string) => {
    // Find the session
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    // If already loaded all data, don't fetch again
    if (session.loadingState?.ecgRecording === 'loaded' && 
        session.loadingState?.prediction === 'loaded' && 
        session.loadingState?.explanation === 'loaded') {
      return;
    }

    try {
      // Step 1: Fetch ECG Recording
      if (!session.ecgRecording && session.loadingState?.ecgRecording !== 'loaded') {
        // Set loading state for ECG recording
        setSessions(prevSessions =>
          prevSessions.map(s =>
            s.id === sessionId
              ? {
                  ...s,
                  loadingState: {
                    ...s.loadingState!,
                    ecgRecording: 'loading',
                  }
                }
              : s
          )
        );

        // Fetch ECG recording data
        const ecgRecording = await getECGRecording(session.ecgId);
        
        // Update with ECG recording data
        setSessions(prevSessions =>
          prevSessions.map(s =>
            s.id === sessionId
              ? {
                  ...s,
                  ecgRecording,
                  loadingState: {
                    ...s.loadingState!,
                    ecgRecording: 'loaded',
                  }
                }
              : s
          )
        );
      }

      // Step 2: Fetch Prediction
      if (!session.prediction && session.loadingState?.prediction !== 'loaded') {
        // Set loading state for prediction
        setSessions(prevSessions =>
          prevSessions.map(s =>
            s.id === sessionId
              ? {
                  ...s,
                  loadingState: {
                    ...s.loadingState!,
                    prediction: 'loading',
                  }
                }
              : s
          )
        );

        // Fetch prediction data
        const prediction = await getPrediction(session.predictionId);
        
        // Update with prediction data
        setSessions(prevSessions =>
          prevSessions.map(s =>
            s.id === sessionId
              ? {
                  ...s,
                  prediction,
                  loadingState: {
                    ...s.loadingState!,
                    prediction: 'loaded',
                  }
                }
              : s
          )
        );
      }

      // Step 3: Fetch Explanation
      if (!session.explanation && session.loadingState?.explanation !== 'loaded') {
        // Set loading state for explanation
        setSessions(prevSessions =>
          prevSessions.map(s =>
            s.id === sessionId
              ? {
                  ...s,
                  loadingState: {
                    ...s.loadingState!,
                    explanation: 'loading',
                  }
                }
              : s
          )
        );

        // Fetch explanation data
        const explanation = await getExplanation(session.explanationId);
        
        // Update with explanation data
        setSessions(prevSessions =>
          prevSessions.map(s =>
            s.id === sessionId
              ? {
                  ...s,
                  explanation,
                  loadingState: {
                    ...s.loadingState!,
                    explanation: 'loaded',
                  }
                }
              : s
          )
        );
      }
    } catch (err: any) {
      console.error('Failed to fetch session details:', err);
      Alert.alert(
        'Error',
        'Failed to load session details. Please try again.',
        [{ text: 'OK' }]
      );
      
      // Set error state for the failed step
      setSessions(prevSessions =>
        prevSessions.map(s =>
          s.id === sessionId
            ? {
                ...s,
                loadingState: {
                  ecgRecording: s.ecgRecording ? 'loaded' : s.loadingState?.ecgRecording === 'loading' ? 'error' : s.loadingState!.ecgRecording,
                  prediction: s.prediction ? 'loaded' : s.loadingState?.prediction === 'loading' ? 'error' : s.loadingState!.prediction,
                  explanation: s.explanation ? 'loaded' : s.loadingState?.explanation === 'loading' ? 'error' : s.loadingState!.explanation,
                }
              }
            : s
        )
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#e74c3c"
            colors={['#e74c3c']}
          />
        }
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Predictions</Text>
          <Text style={styles.description}>
            View your cardiovascular health predictions and risk assessments
          </Text>

          {isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Loading ECG sessions...</Text>
            </View>
          ) : error ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{error}</Text>
            </View>
          ) : sessions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No ECG sessions found. Start a new recording to see predictions here.
              </Text>
            </View>
          ) : (
            sessions.map((session, index) => (
              <ECGSessionCard
                key={session.id}
                session={session}
                index={index}
                styles={styles}
                onExpand={handleExpand}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PredictionsScreen;