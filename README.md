# MusicDude — bare React Native design handoff

Code handoff for Figma page **`sys/ref` (`0:1`)**: design tokens, reusable components, full screen compositions, states, cards, filters, charts, logos and example data.

This repository is UI code, not an application backend. Screen actions are exposed as callbacks so the product app can connect its own navigation, authentication, Spotify integration, permissions and data.

## Install into an existing bare React Native app

Copy `MusicDude.tsx`, `figma-assets.ts`, `src/`, `assets/` and `fonts/` into the application. Install the SVG dependency:

```sh
npm install react-native-svg
cd ios && pod install && cd ..
```

Copy `react-native.config.js` or merge its font path into the application's existing config, then link the bundled Darker Grotesque font:

```sh
npx react-native-asset
```

Do not replace the host application's React or React Native versions with the dev versions in this repository.

## Entry point

```tsx
import {
  MusicDudeProvider,
  WelcomeScreen,
  LibraryAnalyticsScreen,
  type TabId,
} from './design';

export function Welcome() {
  return <MusicDudeProvider>
    <WelcomeScreen
      onGetStarted={() => navigation.navigate('Register')}
      onLogin={() => navigation.navigate('Login')}
    />
  </MusicDudeProvider>;
}

export function Library() {
  const changeTab = (tab: TabId) => navigation.navigate(tab);
  return <MusicDudeProvider>
    <LibraryAnalyticsScreen
      onTabChange={changeTab}
      onChart={category => navigation.navigate('FilteredTracks', { category })}
    />
  </MusicDudeProvider>;
}
```

## Screen exports

- `WelcomeScreen`
- `RegisterScreen`, `LoginScreen`
- `ImportMusicScreen`
- `ConnectSpotifyScreen`: `login`, `importing`, `error`
- `ListeningPermissionScreen`: granted / not granted
- `PortraitScreen`, `RightMomentCard`
- `LibraryAnalyticsScreen`
- `LibraryTracksScreen`: My library / Discover
- `LibraryGenreOpenScreen`, `LibraryEraOpenScreen`, `LibrarySortOpenScreen`
- `ErasPremiumScreen`, `ErasFreeScreen`, `ErasEmptyScreen`, `ErasRenameScreen`
- `Constellation`, `ConstellationGraphic`

The exact Figma-node mapping and layout decisions are documented in [`docs/figma-map.md`](docs/figma-map.md). The same mapping is available to code through `figmaScreenMap`.
`figma-current-map.json` is the machine-readable inventory of the current page; the older `figma-snapshot.json` remains the detailed snapshot of the original component-system page.

## Reusable components

The original system remains in `MusicDude.tsx`:

- `MDText`, `TextBlock` and typography tokens;
- `MDButton`: primary/secondary/tertiary and default/pressed/disabled/loading;
- `MDInput`: empty/editing/filled/error/disabled;
- `MDSelector`;
- `FilterChip`;
- `SegmentedControl` and `LibraryMode`;
- `NavBar`, `NavButton`, icons and arrows;
- `Gradient`, colors and metrics.

`src/ui.tsx` adds the screen-level building blocks:

- `ScreenFrame` with scrolling and fixed navigation;
- `SurfaceCard`;
- `MusicDudeLogo`;
- `Artwork`, `TrackRow`, `ChartCard`;
- `EvidencePill`, `ProgressBar`;
- `ConstellationGraphic`.

## Layout measurements

- Reference width: `402`.
- Screen gutter: `20`.
- Common section gap: `16`; compact internal gap: `8`.
- Card outer margin and inner padding: `20`; card radius: `20`.
- Buttons and fields: minimum `56` high.
- Chips: minimum `44` high.
- Field inner horizontal padding: `16`; field radius: `16`.
- Pill radius: `100`.
- Navbar: `20` outer horizontal gutter, `8 × 4` internal padding, `62.5` minimum height.

Long Figma frames are implemented as vertical `ScrollView` content. Absolute positioning is limited to fixed navigation, modal sheets, graph labels and decorative artwork.

## Assets

- `assets/musicdude-logo-primary.svg`: node `83:6518`.
- `assets/musicdude-logo-dark.svg`: node `90:6822`.
- `assets/icons/`: 46 direct SVG exports from the current Figma icon components, with `manifest.json` mapping filenames to node IDs.
- `MusicDudeLogo`: native scalable implementation of the same geometry.
- `ConstellationGraphic`: native scalable implementation of node `91:7094`.
- `figma-assets.ts`: 28 original Figma PNG exports at 3× used as transformer-free runtime fallbacks.

The application can keep the PNG fallbacks or configure `react-native-svg-transformer` and import the SVG files directly. The two logo SVGs are reconstructed from exact Figma rectangle/ellipse geometry; the 46 icon SVGs are direct Figma exports.

## Fonts

- Figma headings/buttons: **Darker Grotesque Bold**.
- Figma body/navigation: **Helvetica Regular/Bold**.
- `fonts/DarkerGrotesque-Variable.ttf` is included with its SIL OFL license.
- The default registered name expected by the kit is `DarkerGrotesque-Bold`.
- iOS uses system `Helvetica` / `Helvetica-Bold`.
- Android defaults to `sans-serif` / `sans-serif-medium` until the host app supplies licensed Helvetica files.

Local Helvetica files were not committed because the provided `COPYRIGHT.txt` is not a redistribution license. If the team owns an app redistribution license, add those files to the host app and pass the registered family names:

```tsx
<MusicDudeProvider fonts={{
  headingBold: 'DarkerGrotesque-Bold',
  bodyRegular: 'Helvetica',
  bodyBold: 'Helvetica-Bold',
}}>
  {/* app */}
</MusicDudeProvider>
```

## Product boundaries

- Spotify login is provider-owned UI. The code intentionally renders the Figma placeholder rather than imitating a credential form.
- Chart values, tracks, artists, percentages and era dates are illustrative Figma data.
- Screen callbacks do not implement network requests, authentication, navigation or billing.
- Native permission prompts must be invoked by the host application.
- Safe-area handling belongs to the host application's root. Do not apply the bottom inset both outside and inside `NavBar`.

## Verification

```sh
bun install --frozen-lockfile
bun run typecheck
bun test
```

The checks cover TypeScript, source-node mapping, asset integrity and component behavior. Before release, run the screens on both iOS and Android and compare screenshots after loading the correct fonts.

`Example.tsx` is the component gallery. `ScreenExample.tsx` is a dependency-free walkthrough of the major screens for a bare React Native host.
