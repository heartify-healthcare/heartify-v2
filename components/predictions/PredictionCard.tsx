import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';

import { styles } from '@/styles/(tabs)/index';
import { PredictionData } from './types';
import { formatSex, formatProbability, formatTimestamp, getPredictionColor } from './utils';

const { height } = Dimensions.get('window');

interface PredictionCardProps {
  data: PredictionData;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;

    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setIsExpanded(!isExpanded);
  };

  const arrowRotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const expandedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 320],
  });

  return (
    <View style={styles.cardContainer}>
      {/* Collapsed Header */}
      <TouchableOpacity style={styles.cardHeader} onPress={toggleExpanded}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.cardId}>ID: {data.id}</Text>
            <Text style={styles.cardUserId}>User ID: {data.user_id}</Text>
            <Text style={styles.cardTimestamp}>{formatTimestamp(data.created_at)}</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={[styles.predictionBadge, { backgroundColor: getPredictionColor(data.prediction) }]}>
              <Text style={styles.predictionText}>{data.prediction}</Text>
            </View>
            <Animated.View style={[styles.arrowContainer, { transform: [{ rotate: arrowRotation }] }]}>
              <Text style={styles.arrow}>▼</Text>
            </Animated.View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Expanded Content */}
      <Animated.View style={[styles.expandedContent, { height: expandedHeight, opacity: animation, paddingBottom: height * 0.01 }]}>
        <ScrollView style={styles.detailsContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.detailsGrid}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Age:</Text>
              <Text style={styles.detailValue}>{data.age}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Sex:</Text>
              <Text style={styles.detailValue}>{formatSex(data.sex)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Chest Pain (CP):</Text>
              <Text style={styles.detailValue}>{data.cp}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Resting BP:</Text>
              <Text style={styles.detailValue}>{data.trestbps}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Rest ECG:</Text>
              <Text style={styles.detailValue}>{data.restecg}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Max Heart Rate:</Text>
              <Text style={styles.detailValue}>{data.thalach}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Exercise Angina:</Text>
              <Text style={styles.detailValue}>{data.exang}</Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.predictionRow}>
              <Text style={styles.predictionLabel}>Prediction:</Text>
              <Text style={[styles.predictionValue, { color: getPredictionColor(data.prediction) }]}>
                {data.prediction}
              </Text>
            </View>

            <View style={styles.predictionRow}>
              <Text style={styles.predictionLabel}>Probability:</Text>
              <Text style={styles.probabilityValue}>{formatProbability(data.probability)}</Text>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
};
