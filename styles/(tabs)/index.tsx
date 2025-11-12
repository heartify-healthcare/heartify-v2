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
  // ECG Session Card Styles
  sessionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: width * 0.04,
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.005,
  },
  sessionNumberBadge: {
    backgroundColor: '#e74c3c',
    borderRadius: 20,
    width: width * 0.12,
    height: width * 0.12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.03,
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  sessionNumberText: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardHeaderCenter: {
    flex: 1,
  },
  sessionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.005,
  },
  sessionId: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginRight: width * 0.02,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d5f4e6',
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.003,
    borderRadius: 10,
  },
  statusDot: {
    fontSize: width * 0.025,
    color: '#27ae60',
    marginRight: width * 0.01,
  },
  statusText: {
    fontSize: width * 0.028,
    color: '#27ae60',
    fontWeight: '600',
  },
  sessionDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.003,
  },
  sessionDateIcon: {
    fontSize: width * 0.035,
    marginRight: width * 0.015,
  },
  sessionDate: {
    fontSize: width * 0.035,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  deviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceIcon: {
    fontSize: width * 0.03,
    marginRight: width * 0.015,
  },
  deviceText: {
    fontSize: width * 0.03,
    color: '#95a5a6',
    fontStyle: 'italic',
  },
  expandButton: {
    backgroundColor: '#fff5f5',
    borderRadius: 20,
    padding: width * 0.025,
    paddingHorizontal: width * 0.03,
    borderWidth: 1,
    borderColor: '#ffe0e0',
  },
  expandIcon: {
    fontSize: width * 0.045,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  // Expanded Content Styles
  expandedContent: {
    marginTop: height * 0.02,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: height * 0.02,
  },
  sectionContainer: {
    marginBottom: height * 0.025,
  },
  sectionTitle: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: height * 0.015,
  },
  // ECG Recording Styles
  chartContainer: {
    marginBottom: height * 0.02,
  },
  chartLabel: {
    fontSize: width * 0.035,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: height * 0.01,
  },
  samplingRateContainer: {
    backgroundColor: '#ecf0f1',
    borderRadius: 5,
    padding: width * 0.03,
    marginTop: height * 0.01,
  },
  samplingRateText: {
    fontSize: width * 0.035,
    color: '#2c3e50',
  },
  samplingRateValue: {
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  // Prediction Styles
  predictionContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: width * 0.035,
    marginBottom: height * 0.015,
  },
  predictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  predictionLabel: {
    fontSize: width * 0.035,
    color: '#34495e',
    fontWeight: '500',
  },
  predictionValue: {
    fontSize: width * 0.035,
    color: '#2c3e50',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  diagnosisValue: {
    fontSize: width * 0.038,
  },
  diagnosisNormal: {
    color: '#27ae60',
  },
  diagnosisAbnormal: {
    color: '#e74c3c',
  },
  probabilityValue: {
    color: '#e74c3c',
  },
  featuresContainer: {
    marginTop: height * 0.01,
  },
  featuresTitle: {
    fontSize: width * 0.035,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: height * 0.008,
  },
  featureItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: height * 0.005,
    paddingLeft: width * 0.03,
  },
  featureLabel: {
    fontSize: width * 0.032,
    color: '#7f8c8d',
  },
  featureValue: {
    fontSize: width * 0.032,
    color: '#2c3e50',
    fontWeight: '500',
  },
  // Explanation Styles
  explanationContainer: {
    backgroundColor: '#fff5f5',
    borderRadius: 8,
    padding: width * 0.035,
  },
  explanationSection: {
    marginBottom: height * 0.015,
  },
  explanationLabel: {
    fontSize: width * 0.035,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: height * 0.005,
  },
  explanationText: {
    fontSize: width * 0.033,
    color: '#2c3e50',
    lineHeight: width * 0.045,
  },
  promptContainer: {
    backgroundColor: '#ecf0f1',
    borderRadius: 5,
    padding: width * 0.025,
    marginBottom: height * 0.01,
  },
  promptText: {
    fontSize: width * 0.03,
    color: '#7f8c8d',
    fontFamily: 'monospace',
  },
  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.05,
    minHeight: height * 0.1,
  },
  loadingText: {
    fontSize: width * 0.035,
    color: '#7f8c8d',
    marginTop: height * 0.01,
    textAlign: 'center',
  },
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.1,
  },
  emptyText: {
    fontSize: width * 0.04,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});