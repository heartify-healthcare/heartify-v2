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
  contentContainer: {
    flex: 1,
    padding: width * 0.05,
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
  },
  scrollView: {
    flex: 1,
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: height * 0.02,
    marginHorizontal: width * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: width * 0.04,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardId: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  cardUserId: {
    fontSize: width * 0.035,
    color: '#7f8c8d',
    marginTop: 2,
  },
  // New style for timestamp in collapsed header
  cardTimestamp: {
    fontSize: width * 0.032,
    color: '#8e44ad',
    marginTop: 4,
    fontWeight: '500',
  },
  predictionBadge: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.005,
    borderRadius: 15,
    marginRight: width * 0.03,
  },
  predictionText: {
    color: 'white',
    fontSize: width * 0.03,
    fontWeight: 'bold',
  },
  arrowContainer: {
    padding: width * 0.02,
  },
  arrow: {
    fontSize: width * 0.04,
    color: '#7f8c8d',
  },
  expandedContent: {
    overflow: 'hidden',
  },
  detailsContainer: {
    paddingHorizontal: width * 0.04,
  },
  detailsGrid: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.008,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ecf0f1',
  },
  detailLabel: {
    fontSize: width * 0.035,
    color: '#34495e',
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: width * 0.035,
    color: '#2c3e50',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: '#bdc3c7',
    marginVertical: height * 0.015,
  },
  predictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.01,
  },
  predictionLabel: {
    fontSize: width * 0.04,
    color: '#34495e',
    fontWeight: 'bold',
  },
  predictionValue: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  probabilityValue: {
    fontSize: width * 0.04,
    color: '#3498db',
    fontWeight: 'bold',
  },
});