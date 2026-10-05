import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  colors, MDText, TextBlock, MDButton, MDInput, MDSelector, FilterChip, LibraryMode,
  Icon, ArrowIcon, NavBar, MusicDudeProvider, MusicDudeStatusBar,
  MixedTextRow, TextSelectorRow, RatingRow, Gradient,
  type TabId, type LibraryModeValue, type IconName,
} from './MusicDude';

/** Mount inside your app's safe-area boundary AFTER loading the bundled
 * fonts/DarkerGrotesque-Variable.ttf under the key DarkerGrotesque-Bold.
 * This is a component gallery, not a MusicDude product screen.
 */
export default function MusicDudeGallery() {
  const [tab, setTab] = useState<TabId>('portrait');
  const [mode, setMode] = useState<LibraryModeValue>('library');
  const [name, setName] = useState('');
  const [selected, setSelected] = useState(false);
  const [genre, setGenre] = useState<string>();
  const [notice, setNotice] = useState('Ready');
  return <MusicDudeProvider>
    <MusicDudeStatusBar />
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView contentContainerStyle={{ paddingVertical: 24, gap: 16 }} keyboardShouldPersistTaps="handled">
        <TextBlock variant="h1">MusicDude UI kit</TextBlock>
        <TextBlock variant="small" color={colors.textSecondary}>Live component gallery · {notice}</TextBlock>
        <View style={{ marginHorizontal: 20, minHeight: 100, borderRadius: 20, overflow: 'hidden', justifyContent: 'center' }}>
          <Gradient name="signature" /><TextBlock variant="h1">Sound in blue.</TextBlock>
        </View>
        <TextBlock variant="h2">Typography</TextBlock>
        <TextBlock variant="h1">Heading</TextBlock><TextBlock variant="h2">Subheading</TextBlock>
        <TextBlock>Regular text</TextBlock><TextBlock variant="small">Small text</TextBlock>
        <View style={{ paddingHorizontal: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {Object.entries(colors).map(([key, value]) => <View key={key} style={{ width: 106, gap: 4 }}>
            <View style={{ height: 32, borderRadius: 8, backgroundColor: value, borderWidth: 1, borderColor: colors.border }} />
            <MDText variant="small">{key}</MDText><MDText variant="small" color={colors.textMuted}>{value}</MDText>
          </View>)}
        </View>
        <TextBlock variant="h2">Buttons</TextBlock>
        {(['primary', 'secondary', 'tertiary'] as const).map(variant => <View key={variant} style={{ paddingHorizontal: 20, gap: 8 }}>
          <MDButton variant={variant} label={`${variant} button`} onPress={() => setNotice(`${variant} pressed`)} />
          <MDButton variant={variant} label="Pressed preview" state="pressed" />
          <MDButton variant={variant} label="Disabled" disabled />
          <MDButton variant={variant} label="Loading" loading />
        </View>)}
        <TextBlock variant="h2">Inputs & selectors</TextBlock>
        <MDInput label="Username" placeholder="Enter your username" value={name} onChangeText={setName} autoCapitalize="none" />
        <MDInput label="Editing preview" state="editing" value="musicdude" onChangeText={() => {}} />
        <MDInput label="Filled preview" value="musicdude" onChangeText={() => {}} />
        <MDInput label="Error preview" value="music dude" error="Use a name without spaces." onChangeText={() => {}} />
        <MDInput label="Disabled preview" placeholder="Enter your username" editable={false} />
        <MDSelector label="Favorite genre" value={genre} helper="Tap to toggle the example selection"
          onPress={() => setGenre(genre ? undefined : 'Indie rock')} />
        <MDSelector label="Open preview" state="open" value="Indie rock" helper="Choose an option below" />
        <MDSelector label="Disabled preview" disabled helper="Choose one genre" />
        <TextBlock variant="h2">Filters & mode</TextBlock>
        <View style={{ paddingHorizontal: 20, gap: 16 }}>
          <LibraryMode value={mode} onChange={setMode} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <FilterChip label="Indie rock" selected={selected} onPress={() => setSelected(!selected)} />
            <FilterChip label="Pressed" state="pressed" /><FilterChip label="Disabled" disabled />
          </View>
        </View>
        <TextBlock variant="h2">Original Figma icons</TextBlock>
        <View style={{ paddingHorizontal: 20, flexDirection: 'row', flexWrap: 'wrap' }}>
          {(['main', 'library', 'social', 'eras', 'profile'] as IconName[]).map(icon => <View key={icon}>
            <Icon name={icon} /><Icon name={icon} variant="solid" />
          </View>)}
          {(['left', 'right', 'up', 'down'] as const).map(direction => <ArrowIcon key={direction} direction={direction} />)}
        </View>
        <TextBlock variant="h2">Legacy txt composites (as drawn)</TextBlock>
        <View style={{ backgroundColor: '#FFFFFF', paddingVertical: 12, gap: 8 }}>
          <MixedTextRow title="Subheading" addition="Addition" onPress={() => setNotice('Mixed row')} />
          <TextSelectorRow title="Subheading" onPress={() => setNotice('Text selector')} />
          <RatingRow rank={10} name="Name" rating="4.5" />
        </View>
      </ScrollView>
      <View style={{ paddingVertical: 12 }}><NavBar active={tab} onChange={setTab} /></View>
    </View>
  </MusicDudeProvider>;
}
