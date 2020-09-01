import { useRef } from 'react';
import Animated from 'react-native-reanimated';
import {
  State,
  GestureHandlerStateChangeNativeEvent,
  TapGestureHandlerEventExtra,
} from 'react-native-gesture-handler';
import { createVector } from './vectors';

const { Value, event } = Animated;

const useConst = <T>(initialValue: T | (() => T)): T => {
  const ref = useRef<{ value: T }>();
  if (ref.current === undefined) {
    // Box the value in an object so we can tell if it's initialized even if the initializer
    // returns/is undefined
    ref.current = {
      value:
        typeof initialValue === 'function'
          ? (initialValue as Function)()
          : initialValue,
    };
  }
  return ref.current.value;
};

export const useValue = <V extends string | number | boolean>(value: V) =>
  useConst(() => new Value(value));

export const onGestureEvent = (
  nativeEvent: Partial<
    Animated.Adaptable<
      GestureHandlerStateChangeNativeEvent & TapGestureHandlerEventExtra
    >
  >
) => {
  const gestureEvent = event([{ nativeEvent }]);
  return {
    onHandlerStateChange: gestureEvent,
    onGestureEvent: gestureEvent,
  };
};

const tapGestureHandler = () => {
  const state = new Value(State.UNDETERMINED);
  const position = createVector(0);
  const absolutePosition = createVector(0);
  const gestureHandler = onGestureEvent({
    // @ts-expect-error
    state,
    x: position.x,
    y: position.y,
    absoluteX: absolutePosition.x,
    absoluteY: absolutePosition.y,
  });
  return {
    gestureHandler,
    position,
    absolutePosition,
    state,
  };
};

export const useTapGestureHandler = () => useConst(() => tapGestureHandler());
