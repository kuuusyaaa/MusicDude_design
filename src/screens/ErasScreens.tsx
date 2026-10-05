import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, MDButton, MDInput, MDText, type TabId } from '../../MusicDude';
import { EvidencePill, Gutter, ScreenFrame, ScreenTitle, Supporting, SurfaceCard } from '../ui';

export type Era = {
  id: string; date: string; title: string; body: string; facts: readonly string[]; artists: string; activity: readonly number[];
};

export const sampleEras: readonly Era[] = [
  { id: 'after-hours', date: 'JUL – OCT 2026 · LATEST', title: 'After hours',
    body: 'Your listening moved into the small hours. Softer guitars and slower rhythms became familiar company.',
    facts: ['−14 BPM', '62% after midnight', 'Low energy'], artists: 'Beach House · The xx · Men I Trust',
    activity: [20, 23, 16, 28, 33, 27, 30, 40, 44, 35, 48, 39, 46, 51, 42, 53] },
  { id: 'loud-spring', date: 'FEB – JUN 2026', title: 'The loud spring',
    body: 'Guitars came forward and the pace picked up. You returned to a small set of records, then explored their edges.',
    facts: ['+18 BPM', '41% guitar-led', '28 new artists'], artists: 'Fontaines D.C. · IDLES · Wolf Alice',
    activity: [20, 32, 40, 25, 46, 52, 38, 49, 41, 35, 48, 29, 36, 40, 31, 26] },
  { id: 'wider-world', date: 'OCT 2025 – JAN 2026', title: 'A wider world',
    body: 'Your library crossed more borders. French pop and West African grooves appeared alongside your old favourites.',
    facts: ['6 languages', '12 regions', '35% new artists'], artists: 'L’Impératrice · Khruangbin · Tinariwen',
    activity: [12, 18, 15, 23, 20, 29, 34, 24, 40, 33, 46, 38, 43, 49, 40, 51] },
] as const;

export function EraCard({ era, premium = true, onOpen, onRename }:
  { era: Era; premium?: boolean; onOpen?: () => void; onRename?: () => void }) {
  return <SurfaceCard style={e.card}>
    <MDText variant="small" color={colors.blue100}>{era.date}</MDText>
    <Pressable accessibilityRole="button" onPress={onOpen} style={e.titleRow}>
      <MDText variant="h1" style={e.flex}>{era.title}</MDText><MDText variant="h2" color={colors.blue100}>›</MDText>
    </Pressable>
    <Supporting>{era.body}</Supporting>
    <View style={e.facts}>{era.facts.map(fact => <EvidencePill key={fact} label={fact} />)}</View>
    <MDText variant="small" color={colors.textSecondary}>DEFINING ARTISTS</MDText>
    <MDText variant="small" color={colors.blue100}>{era.artists}</MDText>
    <MDText variant="small" color={colors.textSecondary}>Listening activity · during this era</MDText>
    <View accessibilityRole="image" accessibilityLabel="Relative listening activity" style={e.sparkline}>
      {era.activity.map((height, index) => <View key={index} style={[e.sparkBar, index > 11 && e.sparkBarActive, { height }]} />)}
    </View>
    <MDButton label={premium ? 'Rename this era' : 'Rename · Premium'} variant="secondary" onPress={onRename} />
  </SurfaceCard>;
}

function ErasHeader({ subtitle }: { subtitle: string }) {
  return <><ScreenTitle>Your Eras</ScreenTitle><Gutter><Supporting>{subtitle}</Supporting></Gutter></>;
}

export function ErasPremiumScreen({ eras = sampleEras, onOpenEra, onRename, onTabChange }:
  { eras?: readonly Era[]; onOpenEra?: (era: Era) => void; onRename?: (era: Era) => void; onTabChange: (tab: TabId) => void }) {
  return <ScreenFrame activeTab="eras" onTabChange={onTabChange} contentStyle={e.content}>
    <ErasHeader subtitle="Oct 2025 – Oct 2026 · 3 eras" />
    {eras.map(era => <EraCard key={era.id} era={era} onOpen={() => onOpenEra?.(era)} onRename={() => onRename?.(era)} />)}
  </ScreenFrame>;
}

export function ErasFreeScreen({ eras = sampleEras, onOpenEra, onUpgrade, onTabChange }:
  { eras?: readonly Era[]; onOpenEra?: (era: Era) => void; onUpgrade?: () => void; onTabChange: (tab: TabId) => void }) {
  const latest = eras[0];
  return <ScreenFrame activeTab="eras" onTabChange={onTabChange} contentStyle={e.content}>
    <ErasHeader subtitle="Oct 2025 – Oct 2026 · 3 eras" />
    <EraCard era={latest} premium={false} onOpen={() => onOpenEra?.(latest)} onRename={onUpgrade} />
    <SurfaceCard style={e.gate}>
      <MDText variant="h2">There’s more to your story</MDText>
      <MDText variant="small" color={colors.blue100}>2 earlier eras · Oct 2025 – Jun 2026</MDText>
      <Supporting>See how your listening changed across the full timeline, and give each era your own name.</Supporting>
      <MDButton label="Explore Premium" onPress={onUpgrade} />
    </SurfaceCard>
  </ScreenFrame>;
}

export function ErasEmptyScreen({ onImport, onTabChange }:
  { onImport?: () => void; onTabChange: (tab: TabId) => void }) {
  return <ScreenFrame activeTab="eras" onTabChange={onTabChange} contentStyle={e.content}>
    <ErasHeader subtitle="Your listening history, chapter by chapter" />
    <SurfaceCard style={e.empty}>
      <MDText variant="h1">Every era starts somewhere</MDText>
      <Supporting>Your library needs listening dates before we can find its eras.</Supporting>
      <Supporting>Import a Spotify data export for your full play history. Liked Songs also include the date each track was saved.</Supporting>
    </SurfaceCard>
    <Gutter><Supporting>Your library and Portrait still work.</Supporting><MDButton label="Import listening history" onPress={onImport} /></Gutter>
  </ScreenFrame>;
}

export function ErasRenameScreen({ era = sampleEras[0], onSave, onKeepOriginal, onTabChange }:
  { era?: Era; onSave?: (name: string) => void; onKeepOriginal?: () => void; onTabChange: (tab: TabId) => void }) {
  const [name, setName] = useState(era.title);
  return <ScreenFrame activeTab="eras" onTabChange={onTabChange} contentStyle={e.renameContent}>
    <ScreenTitle>Name this era</ScreenTitle>
    <Gutter><MDText variant="small" color={colors.blue100}>Jul – Oct 2026 · Premium</MDText></Gutter>
    <MDInput label="Era name" value={name} onChangeText={setName} />
    <Gutter><Supporting>Make it yours. Your name replaces the generated title across your timeline.</Supporting></Gutter>
    <Gutter style={e.renameActions}>
      <MDButton label="Save name" disabled={!name.trim()} onPress={() => onSave?.(name.trim())} />
      <MDButton label="Keep original name" variant="secondary" onPress={onKeepOriginal} />
    </Gutter>
  </ScreenFrame>;
}

const e = StyleSheet.create({
  content: { gap: 16 }, card: { minHeight: 500, gap: 10 }, titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  flex: { flex: 1, minWidth: 0 }, facts: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sparkline: { height: 58, flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  sparkBar: { flex: 1, minWidth: 6, borderRadius: 3, backgroundColor: colors.raised }, sparkBarActive: { backgroundColor: colors.blue600 },
  gate: { minHeight: 264, gap: 14 }, empty: { minHeight: 340, justifyContent: 'center', gap: 20 },
  renameContent: { minHeight: 874, gap: 16 }, renameActions: { marginTop: 'auto', gap: 8 },
});
