import React, { useCallback, useMemo } from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  ViewStyle,
} from 'react-native';
import {
  LongPressGestureHandler,
  LongPressGestureHandlerStateChangeEvent,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  and,
  call,
  cond,
  eq,
  set,
  sub,
  useCode,
} from 'react-native-reanimated';
import type { AnimateProps } from './animated-types';
import { useTapGestureHandler, useValue } from './useTapGestureHandler';
import { withSpringTransition } from './withSpringTransition';

const AnimatedTouchableWithoutFeedback = Animated.createAnimatedComponent(
  TouchableWithoutFeedback
);

export type TouchableScaleProps = Omit<
  AnimateProps<ViewStyle, TouchableWithoutFeedbackProps>,
  'onPress' | 'onLongPress'
> & {
  activeScale?: number;
  onPress?: () => void;
  onLongPress?: () => void;
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
});

const TouchableScale: React.FC<TouchableScaleProps> = ({
  style: propStyle,
  children,
  onPress,
  disabled,
  activeScale,
  onLongPress: longPressProp,
  ...props
}) => {
  // Don't call onPress when longPress already was called
  const effectiveActiveScale =
    typeof activeScale !== 'undefined' ? activeScale : 0.95;
  const tapHandler = useTapGestureHandler();
  const scaleFactor = useMemo(
    () => cond(eq(tapHandler.state, State.BEGAN), 1 - effectiveActiveScale, 0),
    [tapHandler.state, effectiveActiveScale]
  );

  const style = useMemo(() => {
    return [
      propStyle,
      disabled
        ? {}
        : {
            transform: [{ scale: sub(1, withSpringTransition(scaleFactor)) }],
          },
    ];
  }, [disabled, propStyle, scaleFactor]);

  const lastState = useValue(State.UNDETERMINED);

  useCode(
    () => [
      cond(
        and(eq(lastState, State.BEGAN), eq(State.END, tapHandler.state)),
        call([], () => {
          if (disabled) {
            return;
          }
          onPress?.();
        })
      ),
      set(lastState, tapHandler.state),
    ],
    [onPress, disabled]
  );

  const onHandlerStateChange = useCallback(
    (event: LongPressGestureHandlerStateChangeEvent) => {
      if (event.nativeEvent.state === State.ACTIVE) {
        if (longPressProp) {
          longPressProp();
        }
      }
    },
    [longPressProp]
  );

  return (
    <LongPressGestureHandler onHandlerStateChange={onHandlerStateChange}>
      <Animated.View style={styles.flex1}>
        <TapGestureHandler
          {...tapHandler.gestureHandler}
          // Otherwise animation stops after short time on android
          maxDurationMs={10000000000}
          // Otherwise gesture is accepted on iOS even if touch up outside the element
          maxDeltaX={40}
          maxDeltaY={40}
        >
          <AnimatedTouchableWithoutFeedback {...props}>
            <Animated.View style={style} pointerEvents="box-only">
              {children}
            </Animated.View>
          </AnimatedTouchableWithoutFeedback>
        </TapGestureHandler>
      </Animated.View>
    </LongPressGestureHandler>
  );
};

export default TouchableScale;
