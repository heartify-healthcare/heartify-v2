import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { styles } from '@/styles/(tabs)/index';

const { width, height } = Dimensions.get('window');

interface PredictionData {
  id: number;
  user_id: number;
  age: number;
  cp: number;
  exang: number;
  prediction: string;
  probability: number;
  restecg: number;
  sex: number;
  thalach: number;
  trestbps: number;
  created_at: string;
}

interface PredictionCardProps {
  data: PredictionData;
}

const API_BASE_URL = 'http://192.168.1.20:5000';

const PredictionCard: React.FC<PredictionCardProps> = ({ data }) => {
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

  const formatSex = (sex: number): string => {
    return sex === 1 ? 'Male' : 'Female';
  };

  const formatProbability = (prob: number): string => {
    return `${(prob * 100).toFixed(2)}%`;
  };

  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);

      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      };

      return date.toLocaleDateString('en-US', options).replace(',', ' -');
    } catch (error) {
      return timestamp;
    }
  };

  const getPredictionColor = (prediction: string): string => {
    return prediction === 'POSITIVE' ? '#e74c3c' : '#27ae60';
  };

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

const PredictionsScreen: React.FC = () => {
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPredictions = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Get auth token from AsyncStorage
      const token = await AsyncStorage.getItem('access_token');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/predictions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied');
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }

      const data = await response.json();

      // Sort predictions by ID in descending order (newest first)
      const sortedData = data.sort((a: PredictionData, b: PredictionData) => b.id - a.id);

      setPredictions(sortedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch predictions';
      setError(errorMessage);
      console.error('Error fetching predictions:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  const handleRefresh = () => {
    fetchPredictions(true);
  };

  const handleRetry = () => {
    fetchPredictions();
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No Predictions Yet</Text>
      <Text style={styles.emptyStateDescription}>
        You haven't made any heart disease predictions yet.
        Start by making your first prediction!
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorState}>
      <Text style={styles.errorTitle}>Unable to Load Predictions</Text>
      <Text style={styles.errorDescription}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingState}>
      <ActivityIndicator size="large" color="#e74c3c" />
      <Text style={styles.loadingText}>Loading predictions...</Text>
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return renderLoadingState();
    }

    if (error) {
      return renderErrorState();
    }

    if (predictions.length === 0) {
      return renderEmptyState();
    }

    return (
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#e74c3c']}
            tintColor="#e74c3c"
          />
        }
      >
        {predictions.map((prediction) => (
          <PredictionCard key={prediction.id} data={prediction} />
        ))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Predictions</Text>
        <Text style={styles.description}>
          View your cardiovascular health predictions and risk assessments
        </Text>

        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

export default PredictionsScreen;