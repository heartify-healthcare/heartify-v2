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
    borderRadius: 10,
    padding: width * 0.04,
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  sessionId: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: width * 0.035,
    color: '#7f8c8d',
  },
  expandButton: {
    padding: width * 0.02,
  },
  expandIcon: {
    fontSize: width * 0.05,
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
    color: '#27ae60',
    fontSize: width * 0.038,
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