import React, { useMemo } from 'react';
import {
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  GestureResponderEvent,
} from 'react-native';
import { State, TapGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  and,
  call,
  cond,
  eq,
  set,
  sub,
  useCode,
} from 'react-native-reanimated';
import { withSpringTransition } from './withSpringTransition';
import { useTapGestureHandler, useValue } from './useTapGestureHandler';

const AnimatedTouchableWithoutFeedback = Animated.createAnimatedComponent(
  TouchableWithoutFeedback
);

export type TouchableScaleProps = Omit<
  TouchableWithoutFeedbackProps,
  'onPress'
> & {
  activeScale?: number;
  onPress?: () => void;
};

let longPressCalled = false;

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
          if (longPressCalled) {
            longPressCalled = false;
            return;
          }
          onPress?.();
        })
      ),
      set(lastState, tapHandler.state),
    ],
    [onPress, disabled, longPressCalled]
  );

  const onLongPress = useMemo(
    () =>
      longPressProp
        ? (e: GestureResponderEvent) => {
            longPressCalled = true;
            longPressProp(e);
          }
        : undefined,
    [longPressProp]
  );

  return (
    <TapGestureHandler
      {...tapHandler.gestureHandler}
      // Otherwise animation stops after short time on android
      maxDurationMs={10000000000}
      // Otherwise gesture is accepted on iOS even if touch up outside the element
      maxDeltaX={40}
      maxDeltaY={40}
    >
      <AnimatedTouchableWithoutFeedback onLongPress={onLongPress} {...props}>
        <Animated.View style={style} pointerEvents="box-only">
          {children}
        </Animated.View>
      </AnimatedTouchableWithoutFeedback>
    </TapGestureHandler>
  );
};

export default TouchableScale;
