import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Animated
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface PredictionData {
  id: number;
  user_id: number;
  age: number;
  chol: number;
  cp: number;
  exang: number;
  fbs: number;
  oldpeak: number;
  prediction: string;
  probability: number;
  restecg: number;
  sex: number;
  slope: number;
  thalach: number;
  trestbps: number;
}

const sampleData: PredictionData[] = [
  {
    id: 2,
    user_id: 1,
    age: 18,
    chol: 284,
    cp: 2,
    exang: 0,
    fbs: 0,
    oldpeak: 0.0,
    prediction: "NEGATIVE",
    probability: 0.03538578748703003,
    restecg: 0,
    sex: 0,
    slope: 1,
    thalach: 120,
    trestbps: 120
  },
  {
    id: 3,
    user_id: 2,
    age: 55,
    chol: 210,
    cp: 1,
    exang: 1,
    fbs: 1,
    oldpeak: 1.8,
    prediction: "POSITIVE",
    probability: 0.847283,
    restecg: 2,
    sex: 1,
    slope: 2,
    thalach: 140,
    trestbps: 150
  }
];

interface PredictionCardProps {
  data: PredictionData;
}

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
    outputRange: [0, 450], // Increased from 400 to 450 to accommodate all content
  });

  const formatSex = (sex: number): string => {
    return sex === 1 ? 'Male' : 'Female';
  };

  const formatProbability = (prob: number): string => {
    return `${(prob * 100).toFixed(2)}%`;
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
              <Text style={styles.detailLabel}>Cholesterol:</Text>
              <Text style={styles.detailValue}>{data.chol}</Text>
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
              <Text style={styles.detailLabel}>Fasting Blood Sugar:</Text>
              <Text style={styles.detailValue}>{data.fbs}</Text>
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
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Oldpeak:</Text>
              <Text style={styles.detailValue}>{data.oldpeak}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Slope:</Text>
              <Text style={styles.detailValue}>{data.slope}</Text>
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
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Predictions</Text>
        <Text style={styles.description}>
          View your cardiovascular health predictions and risk assessments
        </Text>
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {sampleData.map((prediction) => (
            <PredictionCard key={prediction.id} data={prediction} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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

export default PredictionsScreen;