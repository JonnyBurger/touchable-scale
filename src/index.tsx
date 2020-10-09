import React, { useCallback, useMemo } from 'react';
import {
  Platform,
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
  or,
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
  const lastState = useValue(State.UNDETERMINED);
  const scaleFactor = useMemo(
    () =>
      cond(
        or(
          eq(tapHandler.state, State.BEGAN),
          eq(tapHandler.state, State.ACTIVE),
          and(eq(tapHandler.state, State.FAILED), eq(lastState, State.BEGAN))
        ),
        1 - effectiveActiveScale,
        0
      ),
    [tapHandler.state, lastState, effectiveActiveScale]
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

  if (Platform.OS === 'android') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useCode(
      () => [
        cond(
          and(
            or(
              eq(lastState, State.ACTIVE),
              eq(lastState, State.BEGAN),
              eq(lastState, State.FAILED)
            ),
            eq(State.END, tapHandler.state)
          ),
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
  }

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
              {...tapHandler.gestureHandler}
              // Otherwise animation stops after short time on android
              maxDurationMs={10000000000}
              hitSlop={5}
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
    }
    return (
      <TapGestureHandler
        {...tapHandler.gestureHandler}
        // Otherwise animation stops after short time on android
        maxDurationMs={10000000000}
        hitSlop={5}
      >
        <AnimatedTouchableWithoutFeedback {...props}>
          <Animated.View style={style} pointerEvents="box-only">
            {children}
          </Animated.View>
        </AnimatedTouchableWithoutFeedback>
      </TapGestureHandler>
    );
  }
  if (Platform.OS === 'ios') {
    return (
      <TapGestureHandler
        {...tapHandler.gestureHandler}
        maxDeltaX={40}
        maxDeltaY={40}
      >
        <AnimatedTouchableWithoutFeedback
          {...props}
          onPress={onPress}
          onLongPress={longPressProp}
        >
          <Animated.View style={style} pointerEvents="box-only">
            {children}
          </Animated.View>
        </AnimatedTouchableWithoutFeedback>
      </TapGestureHandler>
    );
  }
  throw new Error(`TouchableScale not supported on ${Platform.OS}`);
};

export default TouchableScale;
