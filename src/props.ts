import type {
  TouchableWithoutFeedbackProps,
  ViewStyle,
  StyleProp,
} from 'react-native';

export type TouchableScaleProps = Omit<
  TouchableWithoutFeedbackProps,
  'onPress' | 'onLongPress' | 'style'
> & {
  // The scale of the touchable when it is pressed. Default: 0.95
  activeScale?: number;
  // How long the transition should last when the button is pressed in miliseconds. Default: 60
  transitionDuration?: number;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
};
