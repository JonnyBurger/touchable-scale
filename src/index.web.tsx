import {
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
} from 'react-native';
import React from 'react';

export type TouchableScaleProps = Omit<
  TouchableWithoutFeedbackProps,
  'onPress'
> & {
  activeScale?: number;
  onPress?: () => void;
};

const TouchableScale: React.FC<TouchableScaleProps> = ({
  children,
  ...props
}) => {
  return (
    <TouchableWithoutFeedback {...props}>{children}</TouchableWithoutFeedback>
  );
};

export default TouchableScale;
