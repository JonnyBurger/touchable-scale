import type { TransformsStyle, StyleProp } from 'react-native';
import type Animated from 'react-native-reanimated';

export type Adaptable<T> =
  | T
  | Animated.Node<T>
  | ReadonlyArray<T | Animated.Node<T> | ReadonlyArray<T | Animated.Node<T>>>;

export type TransformStyleTypes = TransformsStyle['transform'] extends
  | readonly (infer T)[]
  | undefined
  ? T
  : never;
export type AdaptTransforms<T> = {
  [P in keyof T]: Adaptable<T[P] extends string ? number | string : T[P]>;
};
export type AnimatedTransform = AdaptTransforms<TransformStyleTypes>[];

export type AnimateStyle<S extends object> = {
  [K in keyof S]: K extends 'transform'
    ? AnimatedTransform
    : S[K] extends ReadonlyArray<any>
    ? ReadonlyArray<AnimateStyle<S[K][0]>>
    : S[K] extends object
    ? AnimateStyle<S[K]>
    :
        | S[K]
        | Animated.Node<
            // allow `number` where `string` normally is to support colors
            S[K] extends string | undefined ? S[K] | number : S[K]
          >;
};

export type AnimateProps<
  S extends object,
  P extends {
    style?: StyleProp<S>;
  }
> = {
  [K in keyof P]: K extends 'style'
    ? StyleProp<AnimateStyle<S>>
    : P[K] | Animated.Node<P[K]>;
};
