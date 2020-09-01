// Inlined from redash 14.2.1, shoutout to William

import Animated, { SpringUtils, Value, Clock } from 'react-native-reanimated';
import { State } from 'react-native-gesture-handler';

const { block, startClock, set, cond, eq, spring } = Animated;

const defaultSpringConfig = SpringUtils.makeDefaultConfig();

type SpringConfig = Partial<Omit<Animated.SpringConfig, 'toValue'>>;

export const withSpringTransition = (
  value: Animated.Node<number>,
  springConfig: SpringConfig = defaultSpringConfig,
  velocity: Animated.Adaptable<number> = 0,
  gestureState: Animated.Value<State> = new Value(State.UNDETERMINED)
) => {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };
  const config = {
    toValue: new Value(0),
    damping: 15,
    mass: 1,
    stiffness: 150,
    overshootClamping: false,
    restSpeedThreshold: 1,
    restDisplacementThreshold: 1,
    ...springConfig,
  };
  return block([
    startClock(clock),
    set(config.toValue, value),
    cond(
      eq(gestureState, State.ACTIVE),
      [set(state.velocity, velocity), set(state.position, value)],
      spring(clock, state, config)
    ),
    state.position,
  ]);
};
