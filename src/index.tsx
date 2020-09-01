import React, { useMemo } from 'react';
import {
  GestureResponderEvent,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
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
import {
  useTapGestureHandler,
  useValue,
  withSpringTransition,
} from 'react-native-redash';

const AnimatedTouchableWithoutFeedback = Animated.createAnimatedComponent(
  TouchableWithoutFeedback
);

export const TouchableScale: React.FC<
  Omit<TouchableWithoutFeedbackProps, 'onPress'> & {
    onPress?: (event: GestureResponderEvent) => void;
  }
> = ({ style: propStyle, children, onPress, disabled, ...props }) => {
  const tapHandler = useTapGestureHandler();
  const scaleFactor = useMemo(
    () => cond(eq(tapHandler.state, State.BEGAN), 0.05, 0),
    [tapHandler.state]
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
        call([], () =>
          disabled
            ? undefined
            : onPress?.((null as unknown) as GestureResponderEvent)
        )
      ),
      set(lastState, tapHandler.state),
    ],
    [onPress, disabled]
  );

  return (
    <TapGestureHandler
      {...tapHandler.gestureHandler}
      maxDurationMs={10000000}
      maxDeltaX={100}
      maxDeltaY={100}
    >
      <AnimatedTouchableWithoutFeedback {...props}>
        <Animated.View style={style} pointerEvents="box-only">
          {children}
        </Animated.View>
      </AnimatedTouchableWithoutFeedback>
    </TapGestureHandler>
  );
};
