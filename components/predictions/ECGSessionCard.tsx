import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ECGChart } from '@/components';
import { formatDateTime, formatFeatureName, formatProbability, formatFeatureValue } from '@/utils';
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
          <View style={styles.sessionNumberBadge}>
            <Text style={styles.sessionNumberText}>#{index + 1}</Text>
          </View>
          <View style={styles.cardHeaderCenter}>
            <Text style={styles.sessionId}>ECG Session</Text>
            <View style={styles.sessionDateContainer}>
              <Text style={styles.sessionDateIcon}>📅</Text>
              <Text style={styles.sessionDate}>{formatDateTime(session.createdAt)}</Text>
            </View>
            {session.deviceId && (
              <View style={styles.deviceContainer}>
                <Text style={styles.deviceIcon}>📱</Text>
                <Text style={styles.deviceText}>{session.deviceId}</Text>
              </View>
            )}
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
          {session.loadingState?.ecgRecording === 'loading' && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>ECG Recording</Text>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3498db" />
                <Text style={styles.loadingText}>Loading ECG data...</Text>
              </View>
            </View>
          )}
          
          {session.ecgRecording && session.loadingState?.ecgRecording === 'loaded' && (
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
          {session.loadingState?.prediction === 'loading' && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Prediction Results</Text>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#27ae60" />
                <Text style={styles.loadingText}>Loading prediction data...</Text>
              </View>
            </View>
          )}
          
          {session.prediction && session.loadingState?.prediction === 'loaded' && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Prediction Results</Text>
              
              <View style={styles.predictionContainer}>
                {/* Model Version */}
                <View style={styles.predictionRow}>
                  <Text style={styles.predictionLabel}>Model Version:</Text>
                  <Text style={styles.predictionValue}>
                    v{session.prediction.modelVersion}
                  </Text>
                </View>

                {/* Diagnosis */}
                <View style={styles.predictionRow}>
                  <Text style={styles.predictionLabel}>Diagnosis:</Text>
                  <Text style={[
                    styles.predictionValue, 
                    styles.diagnosisValue,
                    session.prediction.diagnosis === 'Normal Sinus Rhythm' 
                      ? styles.diagnosisNormal 
                      : styles.diagnosisAbnormal
                  ]}>
                    {session.prediction.diagnosis}
                  </Text>
                </View>

                {/* Probability */}
                <View style={styles.predictionRow}>
                  <Text style={styles.predictionLabel}>Confidence:</Text>
                  <Text style={[styles.predictionValue, styles.probabilityValue]}>
                    {formatProbability(session.prediction.probability, 2)}
                  </Text>
                </View>

                {/* Features */}
                <View style={styles.featuresContainer}>
                  <Text style={styles.featuresTitle}>Physiological Features:</Text>
                  
                  {/* Heart Rate */}
                  {session.prediction.features.heart_rate !== null && 
                   session.prediction.features.heart_rate !== undefined && (
                    <View style={styles.featureItem}>
                      <Text style={styles.featureLabel}>
                        {formatFeatureName('heart_rate')}:
                      </Text>
                      <Text style={styles.featureValue}>
                        {formatFeatureValue('heart_rate', session.prediction.features.heart_rate)}
                      </Text>
                    </View>
                  )}

                  {/* HRV RMSSD */}
                  {session.prediction.features.hrv_rmssd !== null && 
                   session.prediction.features.hrv_rmssd !== undefined && (
                    <View style={styles.featureItem}>
                      <Text style={styles.featureLabel}>
                        {formatFeatureName('hrv_rmssd')}:
                      </Text>
                      <Text style={styles.featureValue}>
                        {formatFeatureValue('hrv_rmssd', session.prediction.features.hrv_rmssd)}
                      </Text>
                    </View>
                  )}

                  {/* QRS Duration */}
                  {session.prediction.features.qrs_duration !== null && 
                   session.prediction.features.qrs_duration !== undefined && (
                    <View style={styles.featureItem}>
                      <Text style={styles.featureLabel}>
                        {formatFeatureName('qrs_duration')}:
                      </Text>
                      <Text style={styles.featureValue}>
                        {formatFeatureValue('qrs_duration', session.prediction.features.qrs_duration)}
                      </Text>
                    </View>
                  )}

                  {/* R Amplitude */}
                  {session.prediction.features.r_amplitude !== null && 
                   session.prediction.features.r_amplitude !== undefined && (
                    <View style={styles.featureItem}>
                      <Text style={styles.featureLabel}>
                        {formatFeatureName('r_amplitude')}:
                      </Text>
                      <Text style={styles.featureValue}>
                        {formatFeatureValue('r_amplitude', session.prediction.features.r_amplitude)}
                      </Text>
                    </View>
                  )}

                  {/* Signal Energy */}
                  {session.prediction.features.signal_energy !== null && 
                   session.prediction.features.signal_energy !== undefined && (
                    <View style={styles.featureItem}>
                      <Text style={styles.featureLabel}>
                        {formatFeatureName('signal_energy')}:
                      </Text>
                      <Text style={styles.featureValue}>
                        {formatFeatureValue('signal_energy', session.prediction.features.signal_energy)}
                      </Text>
                    </View>
                  )}

                  {/* R Peaks Count */}
                  {session.prediction.features.r_peaks_count !== null && 
                   session.prediction.features.r_peaks_count !== undefined && (
                    <View style={styles.featureItem}>
                      <Text style={styles.featureLabel}>
                        {formatFeatureName('r_peaks_count')}:
                      </Text>
                      <Text style={styles.featureValue}>
                        {formatFeatureValue('r_peaks_count', session.prediction.features.r_peaks_count)}
                      </Text>
                    </View>
                  )}

                  {/* No features available message */}
                  {Object.entries(session.prediction.features).filter(([_, value]) => 
                    value !== null && value !== undefined
                  ).length === 0 && (
                    <View style={styles.featureItem}>
                      <Text style={styles.featureLabel}>
                        No features available
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Explanation Section */}
          {session.loadingState?.explanation === 'loading' && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>AI Explanation</Text>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#9b59b6" />
                <Text style={styles.loadingText}>Loading AI explanation...</Text>
              </View>
            </View>
          )}
          
          {session.explanation && session.loadingState?.explanation === 'loaded' && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>AI Explanation</Text>
              
              <View style={styles.explanationContainer}>
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

                {/* Recommendations */}
                <View style={styles.explanationSection}>
                  <Text style={styles.explanationLabel}>Recommendations:</Text>
                  <Text style={styles.explanationText}>
                    {session.explanation.explanation.recommendations}
                  </Text>
                </View>

                {/* Risk Level */}
                <View style={styles.explanationSection}>
                  <Text style={styles.explanationLabel}>Risk Level:</Text>
                  <Text style={[
                    styles.explanationText,
                    { 
                      fontWeight: 'bold',
                      color: session.explanation.explanation.risk_level === 'low' ? '#27ae60' :
                             session.explanation.explanation.risk_level === 'medium' ? '#f39c12' : '#e74c3c'
                    }
                  ]}>
                    {session.explanation.explanation.risk_level.toUpperCase()}
                  </Text>
                </View>

                {/* Next Steps */}
                <View style={styles.explanationSection}>
                  <Text style={styles.explanationLabel}>Next Steps:</Text>
                  <Text style={styles.explanationText}>
                    {session.explanation.explanation.next_steps}
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
