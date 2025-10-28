import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ECGChart } from '@/components';
import { formatDateTime, formatFeatureName, formatProbability } from '@/utils';
import type {
  ECGSessionCardProps,
} from '@/types';

export const ECGSessionCard: React.FC<ECGSessionCardProps> = ({ 
  session, 
  index, 
  styles,
  onExpand 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    if (onExpand && !isExpanded) {
      onExpand(session.id);
    }
  };

  return (
    <View style={styles.sessionCard}>
      {/* Card Header */}
      <TouchableOpacity onPress={handleExpand} activeOpacity={0.7}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.sessionId}>Session #{index + 1}</Text>
            <Text style={styles.sessionDate}>{formatDateTime(session.createdAt)}</Text>
          </View>
          <View style={styles.expandButton}>
            <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Expanded Content */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          {/* ECG Recording Section */}
          {session.ecgRecording && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>ECG Recording</Text>
              
              {/* Raw Signal Chart */}
              <ECGChart
                data={session.ecgRecording.rawData.signal}
                label={`Raw Signal - Lead ${session.ecgRecording.rawData.lead}`}
                color="#3498db"
              />

              {/* Denoised Signal Chart */}
              <ECGChart
                data={session.ecgRecording.denoisedData.signal}
                label={`Denoised Signal - Lead ${session.ecgRecording.denoisedData.lead}`}
                color="#27ae60"
              />

              {/* Sampling Rate */}
              <View style={styles.samplingRateContainer}>
                <Text style={styles.samplingRateText}>
                  Sampling Rate: <Text style={styles.samplingRateValue}>{session.ecgRecording.samplingRate} Hz</Text>
                </Text>
              </View>
            </View>
          )}

          {/* Prediction Section */}
          {session.prediction && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Prediction Results</Text>
              
              <View style={styles.predictionContainer}>
                <View style={styles.predictionRow}>
                  <Text style={styles.predictionLabel}>Diagnosis:</Text>
                  <Text style={[styles.predictionValue, styles.diagnosisValue]}>
                    {session.prediction.diagnosis}
                  </Text>
                </View>

                <View style={styles.predictionRow}>
                  <Text style={styles.predictionLabel}>Probability:</Text>
                  <Text style={[styles.predictionValue, styles.probabilityValue]}>
                    {formatProbability(session.prediction.probability)}
                  </Text>
                </View>

                {/* Features */}
                <View style={styles.featuresContainer}>
                  <Text style={styles.featuresTitle}>Features:</Text>
                  {Object.entries(session.prediction.features).map(([key, value]) => (
                    <View key={key} style={styles.featureItem}>
                      <Text style={styles.featureLabel}>{formatFeatureName(key)}:</Text>
                      <Text style={styles.featureValue}>{value}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Explanation Section */}
          {session.explanation && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>AI Explanation</Text>
              
              <View style={styles.explanationContainer}>
                {/* Prompt Info */}
                <View style={styles.explanationSection}>
                  <Text style={styles.explanationLabel}>Analysis Input:</Text>
                  <View style={styles.promptContainer}>
                    <Text style={styles.promptText}>
                      Diagnosis: {session.explanation.prompt.diagnosis}
                    </Text>
                    <Text style={styles.promptText}>
                      Probability: {formatProbability(session.explanation.prompt.probability)}
                    </Text>
                    <Text style={styles.promptText}>
                      Features: {JSON.stringify(session.explanation.prompt.features, null, 2)}
                    </Text>
                  </View>
                </View>

                {/* Summary */}
                <View style={styles.explanationSection}>
                  <Text style={styles.explanationLabel}>Summary:</Text>
                  <Text style={styles.explanationText}>
                    {session.explanation.explanation.summary}
                  </Text>
                </View>

                {/* Details */}
                <View style={styles.explanationSection}>
                  <Text style={styles.explanationLabel}>Details:</Text>
                  <Text style={styles.explanationText}>
                    {session.explanation.explanation.details}
                  </Text>
                </View>

                {/* Recommendation */}
                <View style={styles.explanationSection}>
                  <Text style={styles.explanationLabel}>Recommendation:</Text>
                  <Text style={styles.explanationText}>
                    {session.explanation.explanation.recommendation}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};
