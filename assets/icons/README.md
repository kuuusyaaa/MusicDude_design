# MusicDude SVG icons

These 46 SVG files are direct exports of the current Figma components. `manifest.json` maps every filename back to its Figma node ID.

For bare React Native, either:

1. Configure `react-native-svg-transformer` and import an SVG as a component; or
2. Convert the selected SVG to a local `react-native-svg` component with the application's existing asset pipeline.

Example with a configured transformer:

```tsx
import SearchIcon from './assets/icons/search.svg';

<SearchIcon width={44} height={44} />
```

The existing `Icon` and `ArrowIcon` components continue to use embedded PNG 3× fallbacks, so adding an SVG transformer is optional. Do not ship both renderers for the same on-screen icon.
