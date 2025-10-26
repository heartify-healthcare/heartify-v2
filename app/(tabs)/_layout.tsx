import { Tabs } from 'expo-router';
import React from 'react';
import { Image, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#e74c3c',
        tabBarInactiveTintColor: '#7f8c8d',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Predictions',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require('../../assets/images/predictions.png')}
              style={[styles.tabIcon, { tintColor: color }]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ecg"
        options={{
          title: 'ECG',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require('../../assets/images/ecg.png')}
              style={[styles.tabIcon, { tintColor: color }]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: 'Health',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require('../../assets/images/health.png')}
              style={[styles.tabIcon, { tintColor: color }]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require('../../assets/images/settings.png')}
              style={[styles.tabIcon, { tintColor: color }]}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
});