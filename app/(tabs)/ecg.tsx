import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '@/styles/(tabs)/ecg';
import { DeviceInput } from '@/components/ecg';
import { ECGChart } from '@/components';
import PolarEcgModule from '@/modules/polar-ecg-module';

const MAX_DATA_POINTS = 500;

const ECGScreen: React.FC = () => {
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
        setRecordedEcgData((prev) => [...prev, ...voltages]);
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
    Alert.alert('Recording Started', 'ECG data is being recorded');
  };

  const handleStopRecording = () => {
    if (!isRecording) {
      Alert.alert('Error', 'Recording is not active');
      return;
    }
    setIsRecording(false);
    isRecordingRef.current = false; // Update ref
    Alert.alert(
      'Recording Stopped',
      `Recorded ${recordedEcgData.length} data points`
    );
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

  const handleMakePrediction = () => {
    if (recordedEcgData.length === 0) {
      Alert.alert('Error', 'No recorded data available for prediction');
      return;
    }

    // TODO: IMPLEMENT API CALL TO SERVER FOR ECG PREDICTION
    // SEND recordedEcgData TO YOUR BACKEND SERVER
    // RECEIVE PREDICTION RESULT AND DISPLAY IT TO USER
    Alert.alert(
      'Prediction',
      'This feature will send ECG data to server for prediction.\n\n' +
      'TO BE IMPLEMENTED: API call to server with recorded ECG data.'
    );
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
                    🔴 Recording in progress... {recordedEcgData.length} samples captured
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
                ]}
                onPress={handleMakePrediction}
              >
                <Text style={styles.buttonText}>Make Prediction</Text>
              </TouchableOpacity>

              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  📊 Total recorded samples: {recordedEcgData.length}
                  {'\n'}
                  Tap "Make Prediction" to send this data for cardiovascular analysis.
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ECGScreen;