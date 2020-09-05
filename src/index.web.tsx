import {
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
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
    return [
      propStyle,
      disabled
        ? {}
        : {
            transform: [{ scale: pressed ? effectiveActiveScale : 1 }],
          },
    ];
  }, [disabled, effectiveActiveScale, pressed, propStyle]);
  return (
    <TouchableWithoutFeedback
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={style}
      {...props}
    >
      {children}
    </TouchableWithoutFeedback>
  );
};

export default TouchableScale;
