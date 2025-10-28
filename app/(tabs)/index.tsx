import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '@/styles/(tabs)/index';
import { 
  ECGSessionCard, 
  mockECGSessions, 
  mockDetailedData,
  type ECGSession 
} from '@/components/predictions';

const PredictionsScreen: React.FC = () => {
  const [sessions, setSessions] = useState<ECGSession[]>(mockECGSessions);

  // Simulate fetching ECG sessions on component mount
  useEffect(() => {
    // In real implementation, this would be an API call:
    // fetchECGSessions();
    setSessions(mockECGSessions);
  }, []);

  // Handle session expansion - simulate fetching detailed data
  const handleExpand = (sessionId: string) => {
    // Find the session and its ecgId
    const session = sessions.find(s => s.id === sessionId);
    if (!session || session.ecgRecording) return; // Already loaded

    // Simulate API calls to fetch detailed data
    // In real implementation, this would be:
    // 1. GET /ecg-recordings/${session.ecgId}
    // 2. GET /predictions/${session.predictionId}
    // 3. GET /explanations/${session.explanationId}

    const detailedData = mockDetailedData[session.ecgId];
    if (detailedData) {
      // Update the session with detailed data
      setSessions(prevSessions =>
        prevSessions.map(s =>
          s.id === sessionId
            ? {
                ...s,
                ecgRecording: detailedData.ecgRecording,
                prediction: detailedData.prediction,
                explanation: detailedData.explanation
              }
            : s
        )
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Predictions</Text>
          <Text style={styles.description}>
            View your cardiovascular health predictions and risk assessments
          </Text>

          {sessions.length === 0 ? (
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