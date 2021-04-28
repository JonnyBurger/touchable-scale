import { TouchableWithoutFeedback, View, StyleSheet } from 'react-native';
import React, { useState, useCallback, useMemo } from 'react';
import type { TouchableScaleProps } from './props';
import { DEFAULT_ACTIVE_SCALE, DEFAULT_DURATION } from './config';

const TouchableScale: React.FC<TouchableScaleProps> = ({
  style: propStyle,
  disabled,
  children,
  activeScale,
  transitionDuration,
  ...props
}) => {
  const effectiveActiveScale =
    typeof activeScale !== 'undefined' ? activeScale : DEFAULT_ACTIVE_SCALE;
  const effectiveDuration =
    typeof transitionDuration !== 'undefined'
      ? transitionDuration
      : DEFAULT_DURATION;
  const [pressed, setPressed] = useState(false);
  const onPressIn = useCallback(() => {
    setPressed(true);
  }, []);
  const onPressOut = useCallback(() => {
    setPressed(false);
  }, []);
  const style = useMemo(() => {
    return StyleSheet.compose(
      StyleSheet.compose(propStyle, {
        // @ts-expect-error
        transition: `transform ${(effectiveDuration / 1000).toFixed(2)}s`,
      }),
      disabled
        ? {}
        : {
            transform: [{ scale: pressed ? effectiveActiveScale : 1 }],
          }
    );
  }, [disabled, effectiveActiveScale, effectiveDuration, pressed, propStyle]);
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
