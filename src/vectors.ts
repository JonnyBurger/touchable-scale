import type Animated from 'react-native-reanimated';

interface Vector<
  T extends Animated.Adaptable<number> = Animated.Adaptable<number>
> {
  x: T;
  y: T;
}

type Create = {
  (): Vector<0>;
  <T extends Animated.Adaptable<number>>(x: T, y?: T): Vector<T>;
};

export const createVector: Create = <T extends Animated.Adaptable<number>>(
  x?: T,
  y?: T
) => ({
  x: x ?? 0,
  y: y ?? x ?? 0,
});
