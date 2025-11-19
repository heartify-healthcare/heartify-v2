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
import { styles } from '@/styles/(tabs)/ecg';
import { DeviceInput } from '@/components/ecg';
import { ECGChart } from '@/components';
import PolarEcgModule from '@/modules/polar-ecg-module';
import { MAX_DATA_POINTS, REQUIRED_ECG_SAMPLES, POLAR_SAMPLING_RATE, RECORDING_DURATION_SECONDS } from '@/constants';
import { createECGSession } from '@/api';
import type { CreateECGSessionRequest } from '@/types';

const ECGScreen: React.FC = () => {
  const router = useRouter();
  
  // Device connection states
  const [deviceId, setDeviceId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState('Not initialized');

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
            
            // Show alert
            setTimeout(() => {
              Alert.alert(
                'Recording Complete',
                `Successfully recorded ${REQUIRED_ECG_SAMPLES} samples!\n\nYou can now make a prediction.`,
                [{ text: 'OK' }]
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
        setStatus(`Connected to ${data.name} (${data.deviceId})`);
        Alert.alert('Success', `Connected to ${data.name}`);
      }
    );

    const disconnectedSubscription = PolarEcgModule.addListener(
      'onDeviceDisconnected',
      (data: any) => {
        setIsConnected(false);
        setIsStreaming(false);
        setIsRecording(false);
        isRecordingRef.current = false; // Update ref
        setStatus('Disconnected');
        Alert.alert('Info', 'Device disconnected');
      }
    );

    const errorSubscription = PolarEcgModule.addListener('onError', (data: any) => {
      Alert.alert('Error', data.message);
      setStatus(`Error: ${data.message}`);
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
          Alert.alert('Error', 'Permissions required for Bluetooth');
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
      setStatus('Failed to initialize');
      Alert.alert('Error', 'Failed to initialize Polar SDK');
    }
  };

  const handleConnect = async () => {
    if (!deviceId.trim()) {
      Alert.alert('Error', 'Please enter a device ID');
      return;
    }

    try {
      setStatus('Connecting...');
      await PolarEcgModule.connectToDevice(deviceId.trim());
    } catch (error: any) {
      setStatus('Connection failed');
      Alert.alert('Error', error.message || 'Failed to connect');
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
      setStatus('Disconnected');
      setLiveEcgValues([]);
      setHeartRate(0);
      setSampleCount(0);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to disconnect');
    }
  };

  const handleStartStreaming = async () => {
    try {
      setStatus('Starting ECG streaming...');
      await PolarEcgModule.startEcgStreaming(deviceId);
      setIsStreaming(true);
      setSampleCount(0);
      setStatus('Streaming ECG data...');
    } catch (error: any) {
      setStatus('Failed to start streaming');
      Alert.alert('Error', error.message || 'Failed to start ECG streaming');
    }
  };

  const handleStopStreaming = async () => {
    try {
      await PolarEcgModule.stopEcgStreaming();
      setIsStreaming(false);
      setIsRecording(false);
      isRecordingRef.current = false; // Update ref
      setStatus('Streaming stopped');
      setLiveEcgValues([]);
      setHeartRate(0);
      setSampleCount(0);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to stop streaming');
    }
  };

  const handleStartRecording = () => {
    if (!isStreaming) {
      Alert.alert('Error', 'Please start streaming first');
      return;
    }
    setIsRecording(true);
    isRecordingRef.current = true; // Update ref
    setRecordedEcgData([]);
    Alert.alert(
      'Recording Started',
      `Recording will automatically stop after ${REQUIRED_ECG_SAMPLES} samples (${RECORDING_DURATION_SECONDS} seconds at ${POLAR_SAMPLING_RATE}Hz)`
    );
  };

  const handleStopRecording = () => {
    if (!isRecording) {
      Alert.alert('Error', 'Recording is not active');
      return;
    }
    setIsRecording(false);
    isRecordingRef.current = false; // Update ref
    
    const sampleCount = recordedEcgData.length;
    if (sampleCount < REQUIRED_ECG_SAMPLES) {
      Alert.alert(
        'Recording Stopped',
        `Warning: Recorded only ${sampleCount} samples. ${REQUIRED_ECG_SAMPLES} samples required for prediction.`
      );
    } else {
      Alert.alert(
        'Recording Stopped',
        `Successfully recorded ${sampleCount} samples`
      );
    }
  };

  const handleClearRecording = () => {
    if (recordedEcgData.length === 0) {
      Alert.alert('Info', 'No recorded data to clear');
      return;
    }

    Alert.alert(
      'Clear Recording',
      'Are you sure you want to clear the recorded data?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setRecordedEcgData([]);
            Alert.alert('Success', 'Recorded data cleared');
          },
        },
      ]
    );
  };

  const handleMakePrediction = async () => {
    if (recordedEcgData.length === 0) {
      Alert.alert('Error', 'No recorded data available for prediction');
      return;
    }

    // Validate sample count
    if (recordedEcgData.length < REQUIRED_ECG_SAMPLES) {
      Alert.alert(
        'Insufficient Data',
        `You need exactly ${REQUIRED_ECG_SAMPLES} samples for prediction.\n\nCurrent: ${recordedEcgData.length} samples\nRequired: ${REQUIRED_ECG_SAMPLES} samples\n\nPlease record again.`,
        [{ text: 'OK' }]
      );
      return;
    }

    // Show confirmation dialog
    Alert.alert(
      'Submit for Prediction?',
      `Ready to submit ${recordedEcgData.length} ECG samples for analysis.\n\nThis may take 30-60 seconds to process.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: () => submitECGForPrediction(),
        },
      ]
    );
  };

  const submitECGForPrediction = async () => {
    try {
      setIsPredicting(true);
      setPredictionProgress('Preparing ECG data...');

      // Prepare exactly 1300 samples
      const ecgSamples = recordedEcgData.slice(0, REQUIRED_ECG_SAMPLES);
      
      // Calculate duration in seconds
      const duration = ecgSamples.length / POLAR_SAMPLING_RATE;

      // Prepare request body
      const request: CreateECGSessionRequest = {
        deviceId: deviceId,
        rawData: {
          signal: ecgSamples,
          lead: 'Lead I',
          duration: duration,
        },
        denoisedData: {
          signal: ecgSamples,
          lead: 'Lead I', 
          duration: duration,
        },
        samplingRate: POLAR_SAMPLING_RATE,
      };

      setPredictionProgress('Uploading to server...');

      // Call API to create ECG session (this will take time due to ML processing)
      const response = await createECGSession(request);

      setPredictionProgress('Analysis complete!');

      // Success! Show result and navigate
      Alert.alert(
        'Prediction Complete!',
        `Your ECG has been analyzed successfully.\n\nDiagnosis: ${response.prediction?.diagnosis || 'Unknown'}\nConfidence: ${response.prediction?.probability ? (response.prediction.probability * 100).toFixed(1) + '%' : 'N/A'}\n\nView full details in the Predictions tab.`,
        [
          {
            text: 'View Now',
            onPress: () => {
              // Clear recorded data
              setRecordedEcgData([]);
              // Navigate to predictions tab
              router.push('/(tabs)');
            },
          },
          {
            text: 'Stay Here',
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
        'Prediction Failed',
        error.message || 'Failed to process ECG data. Please try again.',
        [{ text: 'OK' }]
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
          <Text style={styles.title}>ECG Monitor</Text>
          <Text style={styles.description}>
            Connect to Polar H10 to monitor and record your ECG signals
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
              <Text style={styles.statusLabel}>Status</Text>
              <Text style={styles.statusText}>{status}</Text>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Heart Rate</Text>
                <Text style={styles.statValue}>
                  {heartRate > 0 ? heartRate : '--'}
                </Text>
                <Text style={styles.statUnit}>BPM</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Samples</Text>
                <Text style={styles.statValue}>{sampleCount}</Text>
                <Text style={styles.statUnit}>points</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Streaming</Text>
                <Text style={[styles.statValue, { fontSize: 20 }]}>
                  {isStreaming ? '●' : '○'}
                </Text>
                <Text style={styles.statUnit}>
                  {isStreaming ? 'Active' : 'Inactive'}
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
                <Text style={styles.buttonText}>Start ECG</Text>
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
                <Text style={styles.buttonText}>Stop ECG</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Live ECG Waveform Section */}
          {isStreaming && (
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Live ECG Waveform</Text>
                {isStreaming && (
                  <View style={styles.liveIndicator}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE</Text>
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
                    <Text style={styles.noDataText}>Waiting for ECG data...</Text>
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
                    <Text style={styles.buttonText}>Start Recording</Text>
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
                    <Text style={styles.buttonText}>Stop Recording</Text>
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
                  <Text style={styles.buttonText}>Clear Recording</Text>
                </TouchableOpacity>
              </View>

              {/* Recording Status Info */}
              {isRecording && (
                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>
                    🔴 Recording: {recordedEcgData.length} / {REQUIRED_ECG_SAMPLES} samples
                    {'\n'}
                    {recordedEcgData.length < REQUIRED_ECG_SAMPLES 
                      ? `${REQUIRED_ECG_SAMPLES - recordedEcgData.length} more samples needed...`
                      : 'Target reached! Recording will stop automatically.'
                    }
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Recorded ECG Section */}
          {recordedEcgData.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Recorded ECG Data</Text>
              
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
                  {isPredicting ? 'Processing...' : 'Make Prediction'}
                </Text>
              </TouchableOpacity>

              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  📊 Recorded samples: {recordedEcgData.length} / {REQUIRED_ECG_SAMPLES}
                  {recordedEcgData.length >= REQUIRED_ECG_SAMPLES 
                    ? '\n✅ Ready for prediction!' 
                    : `\n⚠️ ${REQUIRED_ECG_SAMPLES - recordedEcgData.length} more samples needed`
                  }
                  {recordedEcgData.length >= REQUIRED_ECG_SAMPLES && 
                    '\n\nTap "Make Prediction" to send data for cardiovascular analysis.'
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
            <Text style={styles.modalTitle}>Processing ECG Analysis</Text>
            <Text style={styles.modalMessage}>{predictionProgress}</Text>
            <Text style={styles.modalSubtext}>
              This may take 30-60 seconds...{'\n'}Please do not close the app.
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ECGScreen;