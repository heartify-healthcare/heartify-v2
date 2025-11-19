import { 
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: width * 0.05,
    paddingBottom: height * 0.05,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: height * 0.01,
    textAlign: 'center',
  },
  description: {
    fontSize: width * 0.04,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: height * 0.03,
    lineHeight: width * 0.05,
  },
  // Card Container
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: width * 0.045,
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  // Status Container
  statusContainer: {
    backgroundColor: '#ecf0f1',
    padding: width * 0.035,
    borderRadius: 8,
    marginBottom: height * 0.015,
  },
  statusLabel: {
    fontSize: width * 0.032,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  statusText: {
    fontSize: width * 0.038,
    fontWeight: '600',
    color: '#2c3e50',
  },
  // Stats Row
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.015,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: width * 0.03,
    borderRadius: 8,
    marginHorizontal: width * 0.01,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: width * 0.03,
    color: '#7f8c8d',
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 2,
  },
  statUnit: {
    fontSize: width * 0.028,
    color: '#95a5a6',
  },
  // Streaming Section
  streamingSection: {
    marginTop: height * 0.02,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: height * 0.015,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    paddingHorizontal: width * 0.025,
    paddingVertical: height * 0.006,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginRight: 4,
  },
  liveText: {
    fontSize: width * 0.028,
    fontWeight: 'bold',
    color: '#fff',
  },
  // Buttons
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.015,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    padding: width * 0.035,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: width * 0.01,
  },
  primaryButton: {
    backgroundColor: '#27ae60',
  },
  secondaryButton: {
    backgroundColor: '#e74c3c',
  },
  tertiaryButton: {
    backgroundColor: '#95a5a6',
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
  fullWidthButton: {
    width: '100%',
    marginHorizontal: 0,
  },
  // Recording Section
  recordingSection: {
    marginTop: height * 0.025,
  },
  recordingButtonRow: {
    flexDirection: 'row',
    gap: width * 0.02,
    marginBottom: height * 0.015,
  },
  recordingButton: {
    flex: 1,
  },
  // Chart Container
  chartContainer: {
    marginVertical: height * 0.015,
  },
  noDataContainer: {
    backgroundColor: '#2c3e50',
    borderRadius: 8,
    padding: width * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  noDataText: {
    fontSize: width * 0.038,
    color: '#ecf0f1',
    textAlign: 'center',
  },
  // Prediction Button
  predictionButton: {
    backgroundColor: '#3498db',
    marginTop: height * 0.015,
  },
  // Info Box
  infoBox: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: width * 0.035,
    marginTop: height * 0.02,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  infoText: {
    fontSize: width * 0.035,
    color: '#856404',
    lineHeight: width * 0.05,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: width * 0.08,
    alignItems: 'center',
    width: width * 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: height * 0.02,
    marginBottom: height * 0.015,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: width * 0.04,
    color: '#3498db',
    marginBottom: height * 0.015,
    textAlign: 'center',
    fontWeight: '600',
  },
  modalSubtext: {
    fontSize: width * 0.035,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: width * 0.05,
  },
});