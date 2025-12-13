import type { StyleProp, ViewStyle } from 'react-native';

export type OnLoadEventPayload = {
  url: string;
};

export type PolarEcgModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
  
  onEcgData: (data: { samples: Array<{ voltage: number }> }) => void;
  onDeviceConnected: (data: { name: string; deviceId: string }) => void;
  onDeviceDisconnected: (data: any) => void;
  onError: (data: { message: string }) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type PolarEcgModuleViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};
