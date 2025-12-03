import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import Svg, { Polyline, Line, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface ECGChartProps {
  data: number[];
  label: string;
  color?: string;
  height?: number;
}

export const ECGChart: React.FC<ECGChartProps> = ({ 
  data, 
  label, 
  color = '#e74c3c',
  height = 150 
}) => {
  const chartWidth = width * 0.82;
  const chartHeight = height;
  const padding = 20;

  // Calculate min and max values for scaling
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const valueRange = maxValue - minValue || 1;

  // Generate points for the polyline
  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (chartWidth - 2 * padding);
    const y = chartHeight - padding - ((value - minValue) / valueRange) * (chartHeight - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chartWrapper}>
        <Svg width={chartWidth} height={chartHeight} style={styles.svg}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding + ratio * (chartHeight - 2 * padding);
            return (
              <Line
                key={`h-${ratio}`}
                x1={padding}
                y1={y}
                x2={chartWidth - padding}
                y2={y}
                stroke="#ecf0f1"
                strokeWidth="1"
              />
            );
          })}
          
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const x = padding + ratio * (chartWidth - 2 * padding);
            return (
              <Line
                key={`v-${ratio}`}
                x1={x}
                y1={padding}
                x2={x}
                y2={chartHeight - padding}
                stroke="#ecf0f1"
                strokeWidth="1"
              />
            );
          })}

          {/* Y-axis labels */}
          <SvgText
            x={5}
            y={padding + 5}
            fontSize="10"
            fill="#7f8c8d"
          >
            {maxValue.toFixed(2)}
          </SvgText>
          <SvgText
            x={5}
            y={chartHeight - padding + 5}
            fontSize="10"
            fill="#7f8c8d"
          >
            {minValue.toFixed(2)}
          </SvgText>

          {/* ECG Signal Line */}
          <Polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
          />
        </Svg>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>
          Data Points: <Text style={styles.infoValue}>{data.length}</Text>
        </Text>
        <Text style={styles.infoText}>
          Range: <Text style={styles.infoValue}>{minValue.toFixed(2)} - {maxValue.toFixed(2)}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: width * 0.035,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 8,
  },
  chartWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  svg: {
    backgroundColor: '#fafafa',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 5,
  },
  infoText: {
    fontSize: width * 0.03,
    color: '#7f8c8d',
  },
  infoValue: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});
