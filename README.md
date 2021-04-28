<p align="center">
  <img src="https://user-images.githubusercontent.com/1629785/91853017-e2d7d580-ec61-11ea-8f17-e1b709b25bf2.gif"><br/> <br>
  <strong>@jonny/touchable-scale</strong>
  <br>
React Native Button that animates it's scale when pressed.
  <br>
</p>

## Installation

```sh
npm install @jonny/touchable-scale
```

Also requires [Reanimated 2](https://github.com/software-mansion/react-native-reanimated) and [Gesture Handler](https://github.com/software-mansion/react-native-gesture-handler).

> Since Version 1.0.0, only Reanimated 2 is supported. If you are still using Reanimated 1, install the latest version of the 0.x release line.

## Usage

```tsx
import TouchableScale from '@jonny/touchable-scale';

export const MyComponent: React.FC = () => {
  const onPress = useCallback(() => console.log('pressed'));
  return <TouchableScale onPress={onPress}></TouchableScale>;
};
```

## API

`<TouchableScale/>` follows the same API as `<TouchableOpacity/>` and should be more or less a drop-in replacement without any changes.

The prop `activeScale` controls the scale while the button is pressed. The default is `0.95`.

The prop `transitionDuration` controls the duration of the transition when the button is pressed in miliseconds. The default is 60.

There are no event objects in the `onPress` callback. See below in the disadvantages section.

You can use the exported `TouchableScaleProps` type to create typed higher order components.

## Advantages over TouchableOpacity

- `<TouchableScale>` is a joyful, modern-looking, animated Touchable.
- Implemented in Reanimated, `<TouchableScale/>` does not have to cross the bridge to update it's state. It can therefore react to touches faster and feels more snappy.

## Disadvantages over TouchableOpacity

- Only `onPress` and `onLongPress` events are supported. Other touch events such as `onPressIn` don't work on Android because these events are not being propagated when the button is wrapped in Gesture Handlers. Avoid using this component when you need to listen to events other than `onPress` or `onLongPress`.

- A press is detected using Gesture Handler state instead of the Touchable Event system, this means there is no event object in the callback: `onPress={(e) => console.log(e) // undefined}`.

- Additional dependency on Reanimated and Gesture Handler.

## See also

- [react-native-scale-button](https://github.com/sa8ab/react-native-scale-button) - Button written in Reanimated 2

## Credits

Contains functions taken from [Redash](https://github.com/wcandillon/react-native-redash). Shoutout to William.

## License

MIT
