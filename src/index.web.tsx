import {
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  View,
  StyleSheet,
} from 'react-native';
import React, { useState, useCallback, useMemo } from 'react';

export type TouchableScaleProps = Omit<
  TouchableWithoutFeedbackProps,
  'onPress'
> & {
  activeScale?: number;
  onPress?: () => void;
};

const TouchableScale: React.FC<TouchableScaleProps> = ({
  style: propStyle,
  disabled,
  children,
  activeScale,
  ...props
}) => {
  const effectiveActiveScale =
    typeof activeScale !== 'undefined' ? activeScale : 0.95;
  const [pressed, setPressed] = useState(false);
  const onPressIn = useCallback(() => {
    setPressed(true);
  }, []);
  const onPressOut = useCallback(() => {
    setPressed(false);
  }, []);
  const style = useMemo(() => {
    return StyleSheet.compose(
      propStyle,
      disabled
        ? {}
        : {
            transform: [{ scale: pressed ? effectiveActiveScale : 1 }],
          }
    );
  }, [disabled, effectiveActiveScale, pressed, propStyle]);
  return (
    <TouchableWithoutFeedback
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      {...props}
    >
      <View style={style}>{children}</View>
    </TouchableWithoutFeedback>
  );
};

export default TouchableScale;
