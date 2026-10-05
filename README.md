# MusicDude — React Native UI kit

Передача дизайн-системы **со страницы Figma `sys` (`77:5665`)**. Это библиотека компонентов, а не готовое приложение и не код всех экранов MusicDude. Репозиторий был пустым; существующей кодовой библиотеки и Code Connect mapping не было.

## Что скопировать разработчику

Скопируйте **`MusicDude.tsx` и `figma-assets.ts` в одну папку** вашего React Native-проекта. Первый файл содержит компоненты, палитру, типографику и размеры. Второй — встроенные оригинальные графические ресурсы Figma, поэтому папки с внешними PNG не нужны. `Example.tsx` — рабочий пример использования/каталог компонентов.

Зависимости: React, React Native и `react-native-svg`.

```sh
# В существующем bare React Native приложении:
npm install react-native-svg
# Для iOS выполните обычную для своего проекта установку pods.

# В существующем Expo приложении вместо команды выше:
npx expo install react-native-svg
```

Не заменяйте версии React / React Native в приложении версиями из этого репозитория: здесь они зафиксированы только для проверки пакета. Сам пакет не требует Expo и не создаёт навигацию или серверную логику.

```tsx
import { useState } from 'react';
import { View } from 'react-native';
import { MusicDudeProvider, MDButton, MDInput, LibraryMode, NavBar,
  colors, type TabId, type LibraryModeValue } from './design/MusicDude';

export function MyScreen() {
  const [name, setName] = useState('');
  const [mode, setMode] = useState<LibraryModeValue>('library');
  const [tab, setTab] = useState<TabId>('portrait');
  return (
    <MusicDudeProvider fonts={{ headingBold: 'DarkerGrotesque-Bold' }}>
      <View style={{ flex: 1, backgroundColor: colors.surface, gap: 16 }}>
        <View style={{ paddingHorizontal: 20 }}>
          <LibraryMode value={mode} onChange={setMode} />
        </View>
        <MDInput label="Username" value={name} onChangeText={setName}
          placeholder="Enter your username" />
        <View style={{ paddingHorizontal: 20 }}>
          <MDButton label="Continue" onPress={() => console.log(name)} />
        </View>
        <View style={{ flex: 1 }} />
        <NavBar active={tab} onChange={setTab} />
      </View>
    </MusicDudeProvider>
  );
}
```

## Шрифты — обязательная настройка

- Figma: **Darker Grotesque Bold** (заголовки, кнопки, фильтры) и **Helvetica Regular/Bold** (основной текст, подписи).
- В `fonts/` включён официальный variable-файл **Darker Grotesque** из Google Fonts вместе с лицензией SIL Open Font License. До отображения UI загрузите его под ключом `DarkerGrotesque-Bold` (пример ниже); именно это имя ожидает код по умолчанию.
- Expo: `useFonts({ 'DarkerGrotesque-Bold': require('./fonts/DarkerGrotesque-Variable.ttf') })`. В bare React Native добавьте `./fonts` в `react-native.config.js`, выполните `npx react-native-asset`, затем пересоберите приложение. Подробности — в `fonts/README.md`.
- На iOS код использует системную Helvetica. На Android по умолчанию `sans-serif` / `sans-serif-medium` — это **явная приблизительная замена**, не пиксельное совпадение. Для точного результата нужен разрешённый к использованию файл Helvetica и переданные `bodyRegular` / `bodyBold`, либо согласованный с дизайнером кроссплатформенный шрифт.
- Локально найденные файлы Helvetica в репозиторий не добавлены: Helvetica — коммерческий шрифт, а наличие файла в системе не подтверждает право на его повторное распространение. Если у команды есть web/app-лицензия, положите разрешённые файлы в приложение и передайте их зарегистрированные имена через `MusicDudeProvider`.
- Без правильных шрифтов будут отличаться ширины, переносы и вертикальное положение текста. Сначала настройте шрифты, потом сравнивайте дизайн.

## Соответствие Figma → код

| Раздел / исходные узлы | Реализация | Состояния |
| --- | --- | --- |
| Палитра `77:5666` | `colors`, `Gradient` | 17 цветов; primary, pressed, selected, navActive, signature |
| txt `77:5766` | `MDText`, `TextBlock` | h1, h2, body, small, button, navBar |
| txt composites `77:5775`, `77:5782`, `77:5787` | `MixedTextRow`, `TextSelectorRow`, `RatingRow` | Сохранены светлые варианты, как в исходнике |
| Status bar `77:5800` | `MusicDudeStatusBar`, `StatusBarPreview` | Настоящий OS StatusBar + статический экспорт для макетов |
| Home bar `77:5829` | `HomeBarPreview` | Только макет; в приложении используется системный индикатор |
| icons `77:5834` | `Icon`, `ArrowIcon` | main, library, social, eras, profile: stroke/solid; 4 стрелки |
| Navigation `77:5909` | `NavButton`, `NavBar` | 5 активных вкладок; active/inactive |
| Buttons `77:5988` | `MDButton` | 3 уровня × default/pressed/disabled/loading |
| Input `77:6023`–`77:6039` | `MDInput` | empty/editing/filled/error/disabled |
| Selector `77:6050`–`77:6062` | `MDSelector` | empty/selected/open/disabled |
| Filter chip `77:6079`–`77:6085` | `FilterChip` | default/pressed/selected/disabled |
| Library mode `77:6099`, `77:6104` | `LibraryMode`, `SegmentedControl` | Оба режима; подписи можно заменить для Register/Log in |

`figma-snapshot.json` содержит исходную структуру **всех 9 разделов**: названия, node IDs, размеры, цвета, текст и доступные свойства. Информационные заголовки разделов, подписи размеров и демонстрационная композиция палитры не превращены в отдельные продуктовые компоненты. Цвета и графические ресурсы из них учтены.

## Важные детали переноса

- Базовая ширина макета — **402**, боковые поля — **20**, поля и кнопки — **56**, чипы — **44**. Корневую ширину не фиксируем: интерфейс заполняет доступную ширину устройства.
- `MDInput`, `MDSelector`, `TextBlock`, `NavBar` уже содержат боковые поля. Не добавляйте им второй отступ 20. `MDButton`, `FilterChip`, `LibraryMode` отступами экрана не владеют.
- Сохранена пользовательская компенсация **6 px снизу** в кнопках. Она связана с метриками Darker Grotesque. Не «центрируйте» её до загрузки правильного шрифта.
- Промежуток между иконкой и подписью navbar взят из текущего компонента, а не из ранней переписки. В неактивной вкладке нет запрета на нажатие: `inactive` не означает `disabled`.
- Навбар по умолчанию отображает **Main / Library / Social / Eras / Profile**, как текущая Figma. Программные ключи — `portrait/library/community/eras/profile`.
- На странице у некоторых демонстрационных чипов слишком маленькая фиксированная ширина: текст `Genre` переносится. Код использует ширину по содержимому, а не воспроизводит этот дефект. Кнопки и поля имеют минимальную высоту, допускающую увеличение при крупном системном шрифте.
- `MDText` по умолчанию светлый для тёмного приложения, хотя несколько голых мастеров txt имеют чёрную заливку. Для буквального вида мастера задайте `color={colors.defaultBlack}`. Светлые composite-варианты txt сохранены отдельно, не перекрашены молча.
- Error в Figma использует голубую обводку, без красного. Код сохраняет это и добавляет опциональный текст ошибки для доступности. Focus — только реальное редактирование поля на мобильном, hover-стилей нет.
- `MDSelector` предоставляет `onPress` и состояние `open`, но **не реализует экран выбора**, которого нет на странице sys. Подключите свой sheet/list к этому событию. Чип тоже вызывает callback — продуктовую фильтрацию делает приложение.
- `MDButton` loading показывает `Loading…`, как Figma, и блокирует нажатия. `state` используется для галереи; реальные нажатия, `disabled`, `loading` работают без ручного переключения состояний.
- Векторные пути недоступны через текущий Bridge. **28 ресурсов экспортированы как PNG 3× с прозрачностью**, встроены в `figma-assets.ts`; они не перерисованы приблизительно. SVG-градиенты рисуются кодом. Для масштабирования значительно выше исходных 44 px следует заменить PNG на оригинальные SVG после ручного экспорта из Figma. Стрелки сохранены ровно как в исходных вариантах, даже если геометрия варианта не соответствует его названию.
- Не используйте `StatusBarPreview` / `HomeBarPreview` в настоящих экранах: они содержат статическую графику устройства. Оберните приложение в safe-area решение вашего проекта, передавайте нижний inset в `NavBar` либо обрабатывайте его снаружи, но не дважды. Native keyboard handling — ответственность экрана приложения.
- `signature` воспроизводит указанный порядок цветов палитры; позиции промежуточных stops приближённые. Остальные градиенты основаны на считанных stops и координатах handles. Сложные Figma glow/effects активной иконки включены в её растровый экспорт; растяжение и native text rasterization могут отличаться от Figma.

## Проверка

```sh
bun install --frozen-lockfile
bun run typecheck
bun test
```

Проверки: TypeScript; наличие и размер всех 28 PNG; палитра; состояния кнопок; controlled input/focus/disabled; selector; chip; mode switch; navbar callbacks. Native host-компоненты в unit-тестах замоканы. Это **не** запуск на iOS/Android и **не** pixel-perfect visual QA. Перед релизом разработчик должен открыть `Example.tsx` на обоих устройствах, загрузить шрифты и проверить safe area, масштаб текста и VoiceOver/TalkBack.

Справка по использованным API: [React Native Pressable](https://reactnative.dev/docs/pressable), [TextInput](https://reactnative.dev/docs/textinput), [react-native-svg](https://github.com/software-mansion/react-native-svg/blob/main/USAGE.md).

## Границы передачи

В Figma ничего не изменялось. Код относится только к странице **sys**, а не к прежним страницам с Portrait/Library/Eras. Навигация, импорт музыки, авторизация, фильтрация каталога и backend не входят в этот пакет. Дизайн-ассеты и права на бренд остаются у владельца MusicDude; открытая лицензия на них данным handoff не предоставляется.
