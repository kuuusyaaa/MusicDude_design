# Figma `sys/ref` → React Native

Source page: `sys/ref` (`0:1`). Reference mobile width: **402 px**.

| Figma node | Frame | Code |
| --- | --- | --- |
| `20:873` | welcome | `WelcomeScreen` |
| `27:946` | register | `RegisterScreen` |
| `27:999` | log_in | `LoginScreen` |
| `29:1426` | import_music / empty · full content | `ImportMusicScreen` |
| `34:1543` | connect_spotify / login | `ConnectSpotifyScreen state="login"` |
| `34:1590` | connect_spotify / importing | `ConnectSpotifyScreen state="importing"` |
| `34:1639` | connect_spotify / error | `ConnectSpotifyScreen state="error"` |
| `35:1725` | listening_permission / iOS / not_granted | `ListeningPermissionScreen granted={false}` |
| `35:1783` | listening_permission / iOS / granted | `ListeningPermissionScreen granted` |
| `38:1839`, `38:2003` | Portrait full / viewport | `PortraitScreen` |
| `49:2612` | Library / Analytics · full content | `LibraryAnalyticsScreen` |
| `49:3248` | Library / Genre / open | `LibraryGenreOpenScreen` |
| `49:3320` | Library / Era / open | `LibraryEraOpenScreen` |
| `49:3392` | Library / Sort by / open | `LibrarySortOpenScreen` |
| `64:4887` | Library / Discover / full content | `LibraryTracksScreen mode="discover"` |
| `66:5120` | Your Eras / Premium / full content | `ErasPremiumScreen` |
| `66:5331` | Your Eras / Free / full content | `ErasFreeScreen` |
| `66:5466` | Your Eras / No dated history | `ErasEmptyScreen` |
| `66:5561` | Your Eras / Rename | `ErasRenameScreen` |
| `91:7094` | Constellation | `Constellation` / `ConstellationGraphic` |
| `83:6518` | Logo / MusicDude blue | `MusicDudeLogo`, `assets/musicdude-logo-primary.svg` |
| `90:6822` | Logo / MusicDude dark | `MusicDudeLogo dark`, `assets/musicdude-logo-dark.svg` |

## Layout translation

- Screen gutter: `20`.
- Screen reference width: `402`; application code fills the device width rather than fixing it.
- Cards: horizontal margin `20`, inner padding `20`, radius `20`, one-pixel `border` stroke.
- Rows: radius `12–16`, minimum height `48–72` depending on content.
- Screen sections: `16` vertical spacing unless the Figma frame specifies a tighter `8` gap.
- Buttons/fields: `56` minimum height. Chips: `44` minimum height.
- Long Figma frames (`Import`, `Portrait full`, `Library Analytics`, `Eras full`) map to a vertical `ScrollView`.
- Navbar is fixed above the bottom edge; pass safe-area handling from the host app and do not add two bottom insets.
- Modal filter states use a `24` top radius sheet over a 90% canvas-colour veil.

Static positions from the 402 px Figma reference were converted into semantic stacks and flexible rows. Absolute positioning is limited to fixed navigation, modal sheets, artwork decoration and graph labels.

## Assets

- `assets/musicdude-logo-primary.svg` and `assets/musicdude-logo-dark.svg` are reconstructed from the exact primitive geometry and colors of nodes `83:6518` and `90:6822`.
- `assets/icons/` contains 46 direct SVG exports. `assets/icons/manifest.json` records every source component node ID.
- The original 28 embedded PNG 3× resources remain in `figma-assets.ts` as transformer-free runtime fallbacks.
- `MusicDudeLogo` and `ConstellationGraphic` are scalable native SVG implementations using `react-native-svg`.

## Intentional implementation boundaries

- Callbacks expose navigation, import, filtering, Spotify, permission and Premium actions. The host application supplies navigation and backend behavior.
- Spotify provider UI is a placeholder. Do not recreate Spotify credentials UI inside MusicDude.
- Track names, charts, scores, artists and dates in the Figma file are illustrative sample data.
- iOS permission text follows the Figma state. Android permission behavior needs a product/platform specification.
