import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  colors, FilterChip, LibraryMode, MDButton, MDInput, MDText,
  type LibraryModeValue, type TabId,
} from '../../MusicDude';
import {
  ChartCard, Gutter, ScreenFrame, ScreenTitle, Supporting, TrackRow,
} from '../ui';

const filterNames = ['Genre', 'Era', 'Region', 'Language', 'Mood', 'Tempo', 'Energy', 'Rarity'] as const;
const analytics = [
  { title: 'Genres', subtitle: 'Indie rock leads your collection.', rows: [['Indie rock', 42], ['Dream pop', 28], ['Electronic', 18], ['Other', 12]] },
  { title: 'Eras', subtitle: 'Release decades · strongest in the 2010s', rows: [['1980s', 8], ['1990s', 18], ['2000s', 26], ['2010s', 34], ['2020s', 14]] },
  { title: 'Regions', subtitle: 'Where your artists come from', rows: [['United Kingdom', 38], ['United States', 32], ['France', 16], ['Other', 14]] },
  { title: 'Languages', subtitle: 'English is your most common language.', rows: [['English', 68], ['French', 20], ['Other', 12]] },
  { title: 'Mood', subtitle: 'A calmer side to your collection', rows: [['Calm', 46], ['Reflective', 34], ['Upbeat', 20]] },
  { title: 'Energy', subtitle: 'Mostly low- and mid-energy tracks', rows: [['Low', 36], ['Medium', 44], ['High', 20]] },
  { title: 'Tempo', subtitle: 'Your sweet spot: 90–120 BPM', rows: [['Under 90 BPM', 24], ['90–120 BPM', 51], ['Over 120 BPM', 25]] },
  { title: 'Rarity', subtitle: 'A mix of familiar and less-heard music', rows: [['Popular', 28], ['Less familiar', 47], ['Rare finds', 25]] },
] as const;

function LibraryHeader({ mode, onModeChange }: { mode: LibraryModeValue; onModeChange: (mode: LibraryModeValue) => void }) {
  return <Gutter><LibraryMode value={mode} onChange={onModeChange} /></Gutter>;
}

export function LibraryAnalyticsScreen({ onModeChange, onChart, onBrowseTracks, onPlaylists, onConstructor, onTabChange }:
  { onModeChange?: (mode: LibraryModeValue) => void; onChart?: (category: string) => void; onBrowseTracks?: () => void;
    onPlaylists?: () => void; onConstructor?: () => void; onTabChange: (tab: TabId) => void }) {
  return <ScreenFrame activeTab="library" onTabChange={onTabChange} contentStyle={l.content}>
    <LibraryHeader mode="library" onModeChange={m => onModeChange?.(m)} />
    <ScreenTitle>Your library, in focus</ScreenTitle>
    <Gutter style={l.intro}><MDText variant="small" color={colors.blue100}>3,100 tracks · 428 artists</MDText>
      <MDText variant="small" color={colors.textSecondary}>Tap a chart to explore the tracks behind it.</MDText></Gutter>
    {analytics.map(item => <ChartCard key={item.title} title={item.title} subtitle={item.subtitle}
      rows={item.rows.map(([label, value]) => ({ label, value }))} onPress={() => onChart?.(item.title)} />)}
    <Gutter style={l.buttonStack}>
      <MDButton label="Browse all tracks" onPress={onBrowseTracks} />
      <MDButton label="Playlists" variant="secondary" onPress={onPlaylists} />
      <MDButton label="Constructor · Premium" variant="tertiary" onPress={onConstructor} />
    </Gutter>
  </ScreenFrame>;
}

function FilterControls({ selected, onOpen, onClear }:
  { selected: readonly string[]; onOpen?: (filter: string) => void; onClear?: () => void }) {
  return <View style={l.filterArea}>
    <View style={l.chips}>{filterNames.map(name => <FilterChip key={name} label={name} selected={selected.includes(name)}
      onPress={() => onOpen?.(name)} />)}</View>
    <View style={l.summary}><MDText variant="small" color={colors.blue100} style={l.flex}>Applied: Indie rock · Calm</MDText>
      <Pressable accessibilityRole="button" onPress={onClear}><MDText variant="small" color={colors.blue100}>Clear</MDText></Pressable></View>
  </View>;
}

export function LibraryTracksScreen({ mode = 'library', onModeChange, onFilter, onClear, onSort, onTrack, onAdd,
  onCreatePlaylist, onConstructor, onPlaylists, onTabChange }:
  { mode?: LibraryModeValue; onModeChange?: (mode: LibraryModeValue) => void; onFilter?: (filter: string) => void;
    onClear?: () => void; onSort?: () => void; onTrack?: (track: string) => void; onAdd?: (track: string) => void;
    onCreatePlaylist?: () => void; onConstructor?: () => void; onPlaylists?: () => void; onTabChange: (tab: TabId) => void }) {
  const [search, setSearch] = useState('');
  const tracks = mode === 'discover' ? [['Afterglow', 'Northbound', '86%'], ['Slow Motion', 'Paper Satellites', '62%']] :
    [['Night Drive', 'The Blue Hours', ''], ['Soft Focus', 'June Arcade', '']];
  return <ScreenFrame activeTab="library" onTabChange={onTabChange} contentStyle={l.content}>
    <LibraryHeader mode={mode} onModeChange={m => onModeChange?.(m)} />
    <MDInput label="Search" placeholder="Search artists or tracks" value={search} onChangeText={setSearch} />
    <FilterControls selected={['Genre', 'Mood']} onOpen={onFilter} onClear={onClear} />
    <View style={l.resultsHeading}><MDText variant="h2" style={l.flex}>{mode === 'discover' ? 'Recommended for you' : '48 tracks'}</MDText>
      <Pressable accessibilityRole="button" onPress={onSort}><MDText variant="small" color={colors.textSecondary}>
        {mode === 'discover' ? 'Compatibility' : 'Recency'} ↓</MDText></Pressable></View>
    <View style={l.trackStack}>{tracks.map(([title, artist, score]) => <TrackRow key={title} title={title} artist={artist} score={score || undefined}
      onPress={() => onTrack?.(title)} onAdd={mode === 'discover' ? () => onAdd?.(title) : undefined} />)}</View>
    <Gutter style={l.buttonStack}>
      <MDButton label="Create playlist from filter" onPress={onCreatePlaylist} />
      <MDButton label="Constructor · Premium" variant="secondary" onPress={onConstructor} />
      <MDButton label="Playlists" variant="tertiary" onPress={onPlaylists} />
    </Gutter>
  </ScreenFrame>;
}

export type PickerKind = 'genre' | 'era' | 'sort';
const pickerData = {
  genre: { title: 'Genre', help: 'Choose one or more genres.', options: ['Indie rock', 'Dream pop', 'Electronic', 'Alternative', 'Jazz', 'Hip-hop', 'Soul'] },
  era: { title: 'Era', help: 'Choose decades to narrow your library.', options: ['All eras', '2020s', '2010s', '2000s', '1990s', '1980s', 'Before 1980'] },
  sort: { title: 'Sort by', help: 'Choose one order for Discover.', options: ['Compatibility', 'Rarity', 'Recency'] },
} as const;

export function LibraryPickerScreen({ kind, mode = 'library', initial, onCancel, onApply, onTabChange }:
  { kind: PickerKind; mode?: LibraryModeValue; initial?: readonly string[]; onCancel?: () => void;
    onApply?: (values: readonly string[]) => void; onTabChange: (tab: TabId) => void }) {
  const spec = pickerData[kind];
  const [selected, setSelected] = useState<readonly string[]>(initial ?? [spec.options[0]]);
  const multi = kind !== 'sort';
  const toggle = (option: string) => setSelected(current => multi ?
    current.includes(option) ? current.filter(value => value !== option) : [...current, option] : [option]);
  const selectedSet = useMemo(() => new Set(selected), [selected]);
  return <View style={l.modalRoot}>
    <LibraryTracksScreen mode={mode} onTabChange={onTabChange} />
    <View style={l.veil} />
    <View style={l.sheet}>
      <View style={l.handle} />
      <View style={l.sheetHeader}><MDText variant="h1" style={l.flex}>{spec.title}</MDText>
        <Pressable accessibilityRole="button" onPress={onCancel}><MDText variant="small" color={colors.blue100}>Cancel</MDText></Pressable></View>
      <MDText variant="small" color={colors.textSecondary}>{spec.help}</MDText>
      <View style={l.options}>{spec.options.map(option => {
        const active = selectedSet.has(option);
        return <Pressable accessibilityRole={multi ? 'checkbox' : 'radio'} accessibilityState={{ checked: active }} key={option}
          onPress={() => toggle(option)} style={[l.option, active && l.optionSelected]}>
          <MDText variant="h2" color={active ? colors.blue100 : colors.textPrimary} style={l.flex}>{option}</MDText>
          {active ? <MDText variant="small" color={colors.blue100}>Selected</MDText> : null}
        </Pressable>;
      })}</View>
      {kind === 'sort' ? <MDText variant="small" color={colors.textSecondary}>Compatibility ranks tracks by taste match.{`\n`}Rarity surfaces less familiar tracks.{`\n`}Recency shows the newest additions first.</MDText> : null}
      <MDButton label={kind === 'sort' ? 'Apply sort' : 'Apply filters'} onPress={() => onApply?.(selected)} />
    </View>
  </View>;
}

export const LibraryGenreOpenScreen = (props: Omit<React.ComponentProps<typeof LibraryPickerScreen>, 'kind'>) => <LibraryPickerScreen {...props} kind="genre" />;
export const LibraryEraOpenScreen = (props: Omit<React.ComponentProps<typeof LibraryPickerScreen>, 'kind'>) => <LibraryPickerScreen {...props} kind="era" />;
export const LibrarySortOpenScreen = (props: Omit<React.ComponentProps<typeof LibraryPickerScreen>, 'kind'>) => <LibraryPickerScreen {...props} kind="sort" />;

const l = StyleSheet.create({
  content: { gap: 16 }, intro: { gap: 5 }, buttonStack: { gap: 8 }, filterArea: { gap: 12 },
  chips: { paddingHorizontal: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  summary: { paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 8 }, flex: { flex: 1, minWidth: 0 },
  resultsHeading: { paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 8 }, trackStack: { gap: 8 },
  modalRoot: { flex: 1, backgroundColor: colors.surface }, veil: { ...StyleSheet.absoluteFillObject, top: 60, backgroundColor: 'rgba(8,11,18,0.90)' },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, minHeight: 694, paddingHorizontal: 20, paddingTop: 28, paddingBottom: 35,
    borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, gap: 12 },
  handle: { position: 'absolute', top: 12, alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.textSecondary },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 }, options: { gap: 8 },
  option: { minHeight: 48, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border,
    flexDirection: 'row', alignItems: 'center', gap: 8 }, optionSelected: { borderColor: colors.blue100, backgroundColor: colors.raised },
});
