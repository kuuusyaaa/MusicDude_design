# Fonts

## Darker Grotesque

`DarkerGrotesque-Variable.ttf` взят из официального каталога Google Fonts. Лицензия находится рядом в `OFL-Darker-Grotesque.txt`.

Expo:

```tsx
const [loaded] = useFonts({
  'DarkerGrotesque-Bold': require('./fonts/DarkerGrotesque-Variable.ttf'),
});

if (!loaded) return null;
return <MusicDudeProvider>{/* app */}</MusicDudeProvider>;
```

Bare React Native — добавьте в корень приложения файл `react-native.config.js`:

```js
module.exports = { assets: ['./fonts'] };
```

После этого выполните `npx react-native-asset` и пересоберите приложение. Если ваша сборка регистрирует другое family name, передайте его явно:

```tsx
<MusicDudeProvider fonts={{ headingBold: 'YourRegisteredFamilyName' }}>
  {/* app */}
</MusicDudeProvider>
```

## Helvetica

Helvetica Regular/Bold используются в исходной Figma для основного текста. На iOS код обращается к системным `Helvetica` и `Helvetica-Bold`; на Android использует близкие системные fallback-шрифты.

Файлы Helvetica намеренно не включены: системная установка не даёт права на публикацию коммерческих font-файлов в GitHub. При наличии подходящей лицензии подключите свои файлы и передайте зарегистрированные имена:

```tsx
<MusicDudeProvider fonts={{
  bodyRegular: 'Helvetica',
  bodyBold: 'Helvetica-Bold',
}}>
  {/* app */}
</MusicDudeProvider>
```
