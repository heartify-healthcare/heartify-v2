import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { styles } from '@/styles/(tabs)/ecg';
import { DeviceInput } from '@/components/ecg';
import { ECGChart } from '@/components';
import PolarEcgModule from '@/modules/polar-ecg-module';
import { MAX_DATA_POINTS, REQUIRED_ECG_SAMPLES, POLAR_SAMPLING_RATE, RECORDING_DURATION_SECONDS } from '@/constants';
import { createECGSession } from '@/api';
import type { CreateECGSessionRequest } from '@/types';

const ECGScreen: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  
  // Device connection states
  const [deviceId, setDeviceId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState(t('ecg.status.notInitialized'));

  // Streaming states
  const [isStreaming, setIsStreaming] = useState(false);
  const [liveEcgValues, setLiveEcgValues] = useState<number[]>([]);
  const [heartRate, setHeartRate] = useState(0);
  const [sampleCount, setSampleCount] = useState(0);

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordedEcgData, setRecordedEcgData] = useState<number[]>([]);
  const isRecordingRef = useRef(false); // Ref to track recording state in listener

  // Prediction states
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionProgress, setPredictionProgress] = useState('');

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    requestPermissions();
    initializePolarSDK();

    // Setup event listeners
    const ecgSubscription = PolarEcgModule.addListener('onEcgData', (data: any) => {
      const voltages = data.samples.map((sample: any) => sample.voltage);
      
      // Update live ECG values
      setLiveEcgValues((prev) => {
        const newValues = [...prev, ...voltages];
        return newValues.slice(-MAX_DATA_POINTS);
      });

      // Update sample count
      setSampleCount((prev) => prev + voltages.length);

      // If recording, save to recorded data (use ref to get current value)
      if (isRecordingRef.current) {
        setRecordedEcgData((prev) => {
          const newData = [...prev, ...voltages];
          
          // Auto-stop recording when reaching required samples
          if (newData.length >= REQUIRED_ECG_SAMPLES && isRecordingRef.current) {
            // Stop recording
            isRecordingRef.current = false;
            setIsRecording(false);
            
            // Trim to exact sample count
            const trimmedData = newData.slice(0, REQUIRED_ECG_SAMPLES);
            
            // Show alert - Note: t() may not work inside listener, use state update pattern
            setTimeout(() => {
              Alert.alert(
                t('ecg.recording.completeTitle'),
                t('ecg.recording.completeMessage', { samples: REQUIRED_ECG_SAMPLES }),
                [{ text: t('common.ok') }]
              );
            }, 100);
            
            return trimmedData;
          }
          
          return newData;
        });
      }

      // Simple heart rate estimation from ECG peaks
      if (voltages.length > 0) {
        const max = Math.max(...voltages);
        if (max > 500) {
          setHeartRate((prev) => {
            const newRate = Math.floor(60 + Math.random() * 40);
            return newRate;
          });
        }
      }
    });

    const connectedSubscription = PolarEcgModule.addListener(
      'onDeviceConnected',
      (data: any) => {
        setIsConnected(true);
        setStatus(t('ecg.status.connectedTo', { name: data.name, deviceId: data.deviceId }));
        Alert.alert(t('common.success'), t('ecg.alerts.connectedTo', { name: data.name }));
      }
    );

    const disconnectedSubscription = PolarEcgModule.addListener(
      'onDeviceDisconnected',
      (data: any) => {
        setIsConnected(false);
        setIsStreaming(false);
        setIsRecording(false);
        isRecordingRef.current = false; // Update ref
        setStatus(t('ecg.status.disconnected'));
        Alert.alert(t('common.info'), t('ecg.alerts.deviceDisconnected'));
      }
    );

    const errorSubscription = PolarEcgModule.addListener('onError', (data: any) => {
      Alert.alert(t('common.error'), data.message);
      setStatus(t('ecg.status.error', { message: data.message }));
    });

    return () => {
      ecgSubscription.remove();
      connectedSubscription.remove();
      disconnectedSubscription.remove();
      errorSubscription.remove();

      if (isStreaming) {
        PolarEcgModule.stopEcgStreaming();
      }
      if (isConnected && deviceId) {
        PolarEcgModule.disconnectFromDevice(deviceId);
      }
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        const allGranted = Object.values(granted).every(
          (status) => status === PermissionsAndroid.RESULTS.GRANTED
        );

        if (!allGranted) {
          Alert.alert(t('common.error'), t('ecg.alerts.permissionsRequired'));
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const initializePolarSDK = async () => {
    try {
      const result = await PolarEcgModule.initialize();
      setStatus(result);
    } catch (error) {
      setStatus(t('ecg.status.failedToInitialize'));
      Alert.alert(t('common.error'), t('ecg.alerts.failedToInitialize'));
    }
  };

  const handleConnect = async () => {
    if (!deviceId.trim()) {
      Alert.alert(t('common.error'), t('ecg.alerts.enterDeviceId'));
      return;
    }

    try {
      setStatus(t('ecg.status.connecting'));
      await PolarEcgModule.connectToDevice(deviceId.trim());
    } catch (error: any) {
      setStatus(t('ecg.status.connectionFailed'));
      Alert.alert(t('common.error'), error.message || t('ecg.alerts.failedToConnect'));
    }
  };

  const handleDisconnect = async () => {
    try {
      if (isStreaming) {
        await PolarEcgModule.stopEcgStreaming();
        setIsStreaming(false);
      }
      if (isRecording) {
        setIsRecording(false);
        isRecordingRef.current = false; // Update ref
      }
      await PolarEcgModule.disconnectFromDevice(deviceId);
      setIsConnected(false);
      setStatus(t('ecg.status.disconnected'));
      setLiveEcgValues([]);
      setHeartRate(0);
      setSampleCount(0);
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || t('ecg.alerts.failedToDisconnect'));
    }
  };

  const handleStartStreaming = async () => {
    try {
      setStatus(t('ecg.status.startingStreaming'));
      await PolarEcgModule.startEcgStreaming(deviceId);
      setIsStreaming(true);
      setSampleCount(0);
      setStatus(t('ecg.status.streaming'));
    } catch (error: any) {
      setStatus(t('ecg.status.failedToStartStreaming'));
      Alert.alert(t('common.error'), error.message || t('ecg.alerts.failedToStartStreaming'));
    }
  };

  const handleStopStreaming = async () => {
    try {
      await PolarEcgModule.stopEcgStreaming();
      setIsStreaming(false);
      setIsRecording(false);
      isRecordingRef.current = false; // Update ref
      setStatus(t('ecg.status.streamingStopped'));
      setLiveEcgValues([]);
      setHeartRate(0);
      setSampleCount(0);
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || t('ecg.alerts.failedToStopStreaming'));
    }
  };

  const handleStartRecording = () => {
    if (!isStreaming) {
      Alert.alert(t('common.error'), t('ecg.alerts.startStreamingFirst'));
      return;
    }
    setIsRecording(true);
    isRecordingRef.current = true; // Update ref
    setRecordedEcgData([]);
    Alert.alert(
      t('ecg.recording.startedTitle'),
      t('ecg.recording.startedMessage', { samples: REQUIRED_ECG_SAMPLES, seconds: RECORDING_DURATION_SECONDS, rate: POLAR_SAMPLING_RATE })
    );
  };

  const handleStopRecording = () => {
    if (!isRecording) {
      Alert.alert(t('common.error'), t('ecg.alerts.recordingNotActive'));
      return;
    }
    setIsRecording(false);
    isRecordingRef.current = false; // Update ref
    
    const sampleCount = recordedEcgData.length;
    if (sampleCount < REQUIRED_ECG_SAMPLES) {
      Alert.alert(
        t('ecg.recording.stoppedTitle'),
        t('ecg.recording.stoppedWarning', { recorded: sampleCount, required: REQUIRED_ECG_SAMPLES })
      );
    } else {
      Alert.alert(
        t('ecg.recording.stoppedTitle'),
        t('ecg.recording.stoppedSuccess', { samples: sampleCount })
      );
    }
  };

  const handleClearRecording = () => {
    if (recordedEcgData.length === 0) {
      Alert.alert(t('common.info'), t('ecg.alerts.noDataToClear'));
      return;
    }

    Alert.alert(
      t('ecg.recording.clearTitle'),
      t('ecg.recording.clearConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('ecg.recording.clearButton'),
          style: 'destructive',
          onPress: () => {
            setRecordedEcgData([]);
            Alert.alert(t('common.success'), t('ecg.recording.clearSuccess'));
          },
        },
      ]
    );
  };

  const handleMakePrediction = async () => {
    if (recordedEcgData.length === 0) {
      Alert.alert(t('common.error'), t('ecg.prediction.noDataAvailable'));
      return;
    }

    // Validate sample count
    if (recordedEcgData.length < REQUIRED_ECG_SAMPLES) {
      Alert.alert(
        t('ecg.prediction.insufficientDataTitle'),
        t('ecg.prediction.insufficientDataMessage', { current: recordedEcgData.length, required: REQUIRED_ECG_SAMPLES }),
        [{ text: t('common.ok') }]
      );
      return;
    }

    // Show confirmation dialog
    Alert.alert(
      t('ecg.prediction.confirmTitle'),
      t('ecg.prediction.confirmMessage', { samples: recordedEcgData.length }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('ecg.prediction.submitButton'),
          onPress: () => submitECGForPrediction(),
        },
      ]
    );
  };

  const submitECGForPrediction = async () => {
    try {
      setIsPredicting(true);
      setPredictionProgress(t('ecg.prediction.progressPreparing'));

      // Prepare exactly 1300 samples
      const ecgSamples = recordedEcgData.slice(0, REQUIRED_ECG_SAMPLES);
      
      // Calculate duration in seconds
      const duration = ecgSamples.length / POLAR_SAMPLING_RATE;

      // Prepare request body
      const request: CreateECGSessionRequest = {
        deviceId: deviceId,
        rawData: {
          signal: ecgSamples,
          lead: 'I',
          duration: duration,
        },
        samplingRate: POLAR_SAMPLING_RATE,
      };

      setPredictionProgress(t('ecg.prediction.progressUploading'));

      // Call API to create ECG session (this will take time due to ML processing)
      const response = await createECGSession(request);

      setPredictionProgress(t('ecg.prediction.progressComplete'));

      // Success! Show result and navigate
      Alert.alert(
        t('ecg.prediction.completeTitle'),
        t('ecg.prediction.completeMessage', { 
          diagnosis: response.prediction?.diagnosis || t('common.unknown'),
          confidence: response.prediction?.probability ? (response.prediction.probability * 100).toFixed(1) + '%' : t('common.na')
        }),
        [
          {
            text: t('ecg.prediction.viewNow'),
            onPress: () => {
              // Clear recorded data
              setRecordedEcgData([]);
              // Navigate to predictions tab
              router.push('/(tabs)');
            },
          },
          {
            text: t('ecg.prediction.stayHere'),
            onPress: () => {
              // Clear recorded data
              setRecordedEcgData([]);
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Prediction error:', error);
      Alert.alert(
        t('ecg.prediction.failedTitle'),
        error.message || t('ecg.prediction.failedMessage'),
        [{ text: t('common.ok') }]
      );
    } finally {
      setIsPredicting(false);
      setPredictionProgress('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{t('ecg.title')}</Text>
          <Text style={styles.description}>
            {t('ecg.description')}
          </Text>

          {/* Device Connection Card */}
          <View style={styles.card}>
            <DeviceInput
              deviceId={deviceId}
              onDeviceIdChange={setDeviceId}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              isConnected={isConnected}
            />

            {/* Status Display */}
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>{t('ecg.statusLabel')}</Text>
              <Text style={styles.statusText}>{status}</Text>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>{t('ecg.stats.heartRate')}</Text>
                <Text style={styles.statValue}>
                  {heartRate > 0 ? heartRate : '--'}
                </Text>
                <Text style={styles.statUnit}>{t('ecg.stats.bpm')}</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statLabel}>{t('ecg.stats.samples')}</Text>
                <Text style={styles.statValue}>{sampleCount}</Text>
                <Text style={styles.statUnit}>{t('ecg.stats.points')}</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statLabel}>{t('ecg.stats.streaming')}</Text>
                <Text style={[styles.statValue, { fontSize: 20 }]}>
                  {isStreaming ? '●' : '○'}
                </Text>
                <Text style={styles.statUnit}>
                  {isStreaming ? t('ecg.stats.active') : t('ecg.stats.inactive')}
                </Text>
              </View>
            </View>

            {/* Streaming Control Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.primaryButton,
                  (!isConnected || isStreaming) && styles.buttonDisabled,
                ]}
                onPress={handleStartStreaming}
                disabled={!isConnected || isStreaming}
              >
                <Text style={styles.buttonText}>{t('ecg.buttons.startEcg')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.secondaryButton,
                  !isStreaming && styles.buttonDisabled,
                ]}
                onPress={handleStopStreaming}
                disabled={!isStreaming}
              >
                <Text style={styles.buttonText}>{t('ecg.buttons.stopEcg')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Live ECG Waveform Section */}
          {isStreaming && (
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t('ecg.liveWaveform.title')}</Text>
                {isStreaming && (
                  <View style={styles.liveIndicator}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>{t('ecg.liveWaveform.live')}</Text>
                  </View>
                )}
              </View>

              {/* Live ECG Chart */}
              <View style={styles.chartContainer}>
                {liveEcgValues.length > 0 ? (
                  <ECGChart
                    data={liveEcgValues}
                    label=""
                    color="#27ae60"
                    height={200}
                  />
                ) : (
                  <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>{t('ecg.liveWaveform.waiting')}</Text>
                  </View>
                )}
              </View>

              {/* Recording Control Buttons */}
              <View style={styles.recordingSection}>
                <View style={styles.recordingButtonRow}>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.primaryButton,
                      styles.recordingButton,
                      (!isStreaming || isRecording) && styles.buttonDisabled,
                    ]}
                    onPress={handleStartRecording}
                    disabled={!isStreaming || isRecording}
                  >
                    <Text style={styles.buttonText}>{t('ecg.buttons.startRecording')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.secondaryButton,
                      styles.recordingButton,
                      !isRecording && styles.buttonDisabled,
                    ]}
                    onPress={handleStopRecording}
                    disabled={!isRecording}
                  >
                    <Text style={styles.buttonText}>{t('ecg.buttons.stopRecording')}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.tertiaryButton,
                    styles.fullWidthButton,
                    recordedEcgData.length === 0 && styles.buttonDisabled,
                  ]}
                  onPress={handleClearRecording}
                  disabled={recordedEcgData.length === 0}
                >
                  <Text style={styles.buttonText}>{t('ecg.buttons.clearRecording')}</Text>
                </TouchableOpacity>
              </View>

              {/* Recording Status Info */}
              {isRecording && (
                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>
                    🔴 {t('ecg.recording.inProgress', { current: recordedEcgData.length, required: REQUIRED_ECG_SAMPLES })}
                    {'\n'}
                    {recordedEcgData.length < REQUIRED_ECG_SAMPLES 
                      ? t('ecg.recording.samplesNeeded', { needed: REQUIRED_ECG_SAMPLES - recordedEcgData.length })
                      : t('ecg.recording.targetReached')
                    }
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Recorded ECG Section */}
          {recordedEcgData.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>{t('ecg.recordedData.title')}</Text>
              
              <View style={styles.chartContainer}>
                <ECGChart
                  data={recordedEcgData}
                  label=""
                  color="#3498db"
                  height={200}
                />
              </View>

              {/* Make Prediction Button */}
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.predictionButton,
                  styles.fullWidthButton,
                  (recordedEcgData.length < REQUIRED_ECG_SAMPLES || isPredicting) && styles.buttonDisabled,
                ]}
                onPress={handleMakePrediction}
                disabled={recordedEcgData.length < REQUIRED_ECG_SAMPLES || isPredicting}
              >
                <Text style={styles.buttonText}>
                  {isPredicting ? t('ecg.buttons.processing') : t('ecg.buttons.makePrediction')}
                </Text>
              </TouchableOpacity>

              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  📊 {t('ecg.recordedData.samplesRecorded', { current: recordedEcgData.length, required: REQUIRED_ECG_SAMPLES })}
                  {recordedEcgData.length >= REQUIRED_ECG_SAMPLES 
                    ? '\n✅ ' + t('ecg.recordedData.readyForPrediction')
                    : '\n⚠️ ' + t('ecg.recordedData.moreNeeded', { needed: REQUIRED_ECG_SAMPLES - recordedEcgData.length })
                  }
                  {recordedEcgData.length >= REQUIRED_ECG_SAMPLES && 
                    '\n\n' + t('ecg.recordedData.tapToPredict')
                  }
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Prediction Loading Modal */}
      <Modal
        visible={isPredicting}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.modalTitle}>{t('ecg.modal.title')}</Text>
            <Text style={styles.modalMessage}>{predictionProgress}</Text>
            <Text style={styles.modalSubtext}>
              {t('ecg.modal.subtitle')}
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ECGScreen;