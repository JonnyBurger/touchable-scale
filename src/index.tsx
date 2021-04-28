import React, { useCallback } from 'react';
import { Platform, TouchableWithoutFeedback } from 'react-native';
import {
  LongPressGestureHandler,
  LongPressGestureHandlerStateChangeEvent,
  State,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { TouchableScaleProps } from './props';
import { DEFAULT_ACTIVE_SCALE, DEFAULT_DURATION } from './config';

const AnimatedTouchableWithoutFeedback = Animated.createAnimatedComponent(
  TouchableWithoutFeedback
);

const TouchableScale: React.FC<TouchableScaleProps> = ({
  style: propStyle,
  children,
  onPress,
  disabled,
  activeScale,
  transitionDuration,
  onLongPress: longPressProp,
  ...props
}) => {
  const scale = useSharedValue(1);
  const effectiveDuration =
    typeof transitionDuration !== 'undefined'
      ? transitionDuration
      : DEFAULT_DURATION;

  const canReleaseToTriggerPress = useSharedValue(false);
  // Don't call onPress when longPress already was called
  const effectiveActiveScale =
    typeof activeScale !== 'undefined' ? activeScale : DEFAULT_ACTIVE_SCALE;
  const tapHandler = useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
    onCancel: () => {
      scale.value = withTiming(1, { duration: effectiveDuration });
      canReleaseToTriggerPress.value = false;
    },
    onEnd: () => {
      scale.value = withTiming(1, { duration: effectiveDuration });
      if (!canReleaseToTriggerPress.value) {
        return;
      }
      canReleaseToTriggerPress.value = false;
      if (disabled || !onPress) {
        return;
      }
      runOnJS(onPress)?.();
    },
    onFail: () => {
      scale.value = withTiming(1, { duration: effectiveDuration });
      canReleaseToTriggerPress.value = false;
    },
    onFinish: () => {
      scale.value = withTiming(1, { duration: effectiveDuration });
      canReleaseToTriggerPress.value = false;
    },
    onStart: () => {
      canReleaseToTriggerPress.value = true;
      scale.value = withTiming(effectiveActiveScale, {
        duration: effectiveDuration,
      });
    },
  });

  const style = useAnimatedStyle(() => {
    return {
      transform: [{ scale: disabled ? 1 : scale.value }],
    };
  }, [disabled]);

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

  if (Platform.OS === 'android') {
    if (longPressProp) {
      return (
        <LongPressGestureHandler onHandlerStateChange={onHandlerStateChange}>
          <Animated.View>
            <TapGestureHandler
              onGestureEvent={tapHandler}
              // Otherwise animation stops after short time on android
              maxDurationMs={10000000000}
              hitSlop={5}
              maxDelayMs={0}
              numberOfTaps={1}
            >
              <AnimatedTouchableWithoutFeedback {...props} style={style}>
                <Animated.View style={propStyle} pointerEvents="box-only">
                  {children}
                </Animated.View>
              </AnimatedTouchableWithoutFeedback>
            </TapGestureHandler>
          </Animated.View>
        </LongPressGestureHandler>
      );
    }
    return (
      <TapGestureHandler
        onGestureEvent={tapHandler}
        // Otherwise animation stops after short time on android
        maxDurationMs={10000000000}
        hitSlop={5}
        maxDelayMs={0}
        numberOfTaps={1}
      >
        <AnimatedTouchableWithoutFeedback
          {...props}
          disabled={disabled}
          style={style}
        >
          <Animated.View style={propStyle} pointerEvents="box-only">
            {children}
          </Animated.View>
        </AnimatedTouchableWithoutFeedback>
      </TapGestureHandler>
    );
  }
  if (Platform.OS === 'ios') {
    return (
      <TapGestureHandler
        onGestureEvent={tapHandler}
        maxDeltaX={40}
        maxDeltaY={40}
      >
        <AnimatedTouchableWithoutFeedback
          {...props}
          disabled={disabled}
          style={style}
          onLongPress={longPressProp}
        >
          <Animated.View style={propStyle} pointerEvents="box-only">
            {children}
          </Animated.View>
        </AnimatedTouchableWithoutFeedback>
      </TapGestureHandler>
    );
  }
  throw new Error(`TouchableScale not supported on ${Platform.OS}`);
};

export default TouchableScale;

export { TouchableScaleProps } from './props';
