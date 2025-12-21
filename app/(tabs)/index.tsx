import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { styles } from '@/styles/(tabs)/index';
import { ECGSessionCard } from '@/components/predictions';
import { LoadingScreen, ErrorScreen } from '@/components';
import { getECGSessions, getECGRecording, getPrediction, getExplanation } from '@/api';
import type { ECGSession } from '@/types';

const PredictionsScreen: React.FC = () => {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<ECGSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  // Fetch ECG sessions on component mount
  useEffect(() => {
    fetchECGSessions();
  }, []);

  const fetchECGSessions = async (page: number = 0, append: boolean = false) => {
    try {
      if (!append) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);
      
      // Fetch ECG sessions list
      const response = await getECGSessions(page, 10, 'createdAt', 'desc');
      
      // Initialize sessions with loading states
      const initializedSessions = response.content.map(session => ({
        ...session,
        loadingState: {
          ecgRecording: 'idle' as const,
          prediction: 'idle' as const,
          explanation: 'idle' as const,
        }
      }));
      
      if (append) {
        // Append new sessions to existing list
        setSessions(prevSessions => [...prevSessions, ...initializedSessions]);
      } else {
        // Replace with new sessions (initial load or refresh)
        setSessions(initializedSessions);
      }
      
      // Update pagination state
      setCurrentPage(response.number);
      setHasMoreData(!response.last);
    } catch (err: any) {
      console.error('Failed to fetch ECG sessions:', err);
      setError(err.message || t('predictions.errorLoadingSessions'));
      if (!append) {
        Alert.alert(
          t('common.error'),
          t('predictions.errorLoadingSessionsRetry'),
          [{ text: t('common.ok') }]
        );
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setCurrentPage(0);
    setHasMoreData(true);
    await fetchECGSessions(0, false);
    setRefreshing(false);
  };

  const loadMoreSessions = () => {
    // Don't load more if:
    // 1. Already loading
    // 2. No more data available
    // 3. Currently refreshing
    if (isLoadingMore || !hasMoreData || refreshing || isLoading) {
      return;
    }

    const nextPage = currentPage + 1;
    fetchECGSessions(nextPage, true);
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#e74c3c" />
        <Text style={styles.footerText}>{t('predictions.loadingMore')}</Text>
      </View>
    );
  };

  const renderItem = ({ item, index }: { item: ECGSession; index: number }) => (
    <ECGSessionCard
      key={item.id}
      session={item}
      index={index}
      styles={styles}
      onExpand={handleExpand}
    />
  );

  const renderListHeader = () => (
    <View>
      <Text style={styles.title}>{t('predictions.title')}</Text>
      <Text style={styles.description}>
        {t('predictions.description')}
      </Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {t('predictions.noSessions')}
      </Text>
    </View>
  );

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
        t('common.error'),
        t('predictions.errorLoadingDetails'),
        [{ text: t('common.ok') }]
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

  // Loading state
  if (isLoading) {
    return <LoadingScreen message={t('predictions.loading')} />;
  }

  // Error state
  if (error) {
    return (
      <ErrorScreen
        title={t('common.error')}
        message={error}
        onRetry={fetchECGSessions}
        retryText={t('common.tryAgain')}
      />
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <FlatList
        data={sessions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        contentContainerStyle={[
          styles.contentContainer,
          sessions.length === 0 && styles.emptyContentContainer
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#e74c3c"
            colors={['#e74c3c']}
          />
        }
        onEndReached={loadMoreSessions}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
};

export default PredictionsScreen;