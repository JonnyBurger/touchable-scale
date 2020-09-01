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

Also requires [Reanimated](https://github.com/software-mansion/react-native-reanimated) and [Gesture Handler](https://github.com/software-mansion/react-native-gesture-handler).

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

There are no event objects in the `onPress` callback. See below in the disadvantages section.

You can use the exported `TouchableScaleProps` type to create typed higher order components.

## Advantages over TouchableOpacity

- `<TouchableScale>` is a joyful, modern-looking, animated Touchable.
- Implemented in Reanimated, `<TouchableScale/>` does not have to cross the bridge to update it's state. It can therefore react to touches faster and feels more snappy.

## Disadvantages over TouchableOpacity

- A press is detected using Gesture Handler state instead of the Touchable Event system, this means there is no event object in the callback: `onPress={(e) => console.log(e) // undefined}`.

- Additional dependency on Reanimated and Gesture Handler.

## Credits

Contains functions taken from [Redash](https://github.com/wcandillon/react-native-redash). Shoutout to William.

## License

MIT
