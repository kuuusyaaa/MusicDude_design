import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, MDButton, MDText, type TabId } from '../../MusicDude';
import {
  Artwork, ConstellationGraphic, Gutter, ScreenFrame, ScreenTitle, SectionTitle,
  Supporting, SurfaceCard,
} from '../ui';

const facets = [
  ['Regions', 'United Kingdom · United States'],
  ['Eras', '1990s · 2010s'],
  ['Languages', 'English · French'],
  ['Genres', 'Dream pop · Indie rock'],
] as const;

export function PortraitScreen({ activeTab = 'portrait', onTabChange, onMoreLikeThis, onLessLikeThis,
  onWhy, onConstellation, onFacet, onBlindSpot }:
  { activeTab?: TabId; onTabChange: (tab: TabId) => void; onMoreLikeThis?: () => void; onLessLikeThis?: () => void;
    onWhy?: () => void; onConstellation?: () => void; onFacet?: (facet: string) => void; onBlindSpot?: () => void }) {
  return <ScreenFrame activeTab={activeTab} onTabChange={onTabChange} contentStyle={p.content}>
    <ScreenTitle>Your music portrait</ScreenTitle>
    <Gutter><Supporting>You gravitate toward hazy guitars,{`\n`}soft edges and late-night energy.</Supporting></Gutter>

    <SurfaceCard style={p.daily}>
      <MDText variant="small" color={colors.blue100}>TODAY’S PICK · FAMILIAR, BUT NEW</MDText>
      <Artwork label="NORTHBOUND" />
      <MDText variant="h1">Afterglow</MDText>
      <MDText variant="small" color={colors.textSecondary}>Northbound</MDText>
      <Supporting>Soft guitars and a slow pulse echo the quieter side of your library.</Supporting>
      <MDButton label="More of this" variant="secondary" onPress={onMoreLikeThis} style={p.cardButton} />
      <MDButton label="Get me out of this" variant="tertiary" onPress={onLessLikeThis} style={p.cardButton} />
    </SurfaceCard>
    <Pressable accessibilityRole="button" onPress={onWhy} style={p.why}>
      <MDText variant="small" color={colors.blue100}>Why this? · Premium breakdown</MDText>
    </Pressable>

    <SectionTitle>Your constellation</SectionTitle>
    <Pressable accessibilityRole="button" onPress={onConstellation} style={p.constellation}>
      <MDText variant="small" color={colors.textSecondary}>Mood · Energy · Brightness</MDText>
      <ConstellationGraphic size={322} />
    </Pressable>

    <SectionTitle>Explore your library</SectionTitle>
    <View style={p.facets}>{facets.map(([title, value]) => <Pressable key={title} accessibilityRole="button"
      onPress={() => onFacet?.(title)} style={p.facet}>
      <View style={p.flex}><MDText variant="h2" color={colors.blue100}>{title}</MDText>
        <MDText variant="small" color={colors.textSecondary}>{value}</MDText></View>
      <MDText variant="h2" color={colors.blue100}>›</MDText>
    </Pressable>)}</View>

    <SectionTitle>Your blind spots</SectionTitle>
    <Gutter><MDText variant="small" color={colors.textSecondary}>Sounds you haven’t explored much yet.</MDText></Gutter>
    <Pressable accessibilityRole="button" onPress={onBlindSpot} style={p.blindSpot}>
      <MDText variant="h2" color={colors.blue100}>West African grooves</MDText>
      <MDText variant="small" color={colors.textSecondary}>Explore in Discover · Premium</MDText>
    </Pressable>
  </ScreenFrame>;
}

export function RightMomentCard({ onExplore }: { onExplore?: () => void }) {
  return <SurfaceCard style={p.moment}>
    <MDText variant="small" color={colors.blue100}>RIGHT NOW · PREMIUM</MDText>
    <MDText variant="h1">Ready for a change of pace?</MDText>
    <Supporting>You’ve stayed with a quiet mood for a while.{`\n`}Try a brighter direction when you’re ready.</Supporting>
    <Pressable accessibilityRole="button" onPress={onExplore}><MDText variant="h2" color={colors.blue100}>Explore a brighter sound</MDText></Pressable>
  </SurfaceCard>;
}

const p = StyleSheet.create({
  content: { gap: 16 }, daily: { minHeight: 510, gap: 8 }, cardButton: { minHeight: 48 }, why: { paddingHorizontal: 20 },
  constellation: { marginHorizontal: 20, padding: 20, borderRadius: 20, backgroundColor: colors.canvas, gap: 10, alignItems: 'center' },
  facets: { gap: 6 }, facet: { minHeight: 54, marginHorizontal: 20, paddingHorizontal: 20, borderRadius: 12,
    backgroundColor: colors.canvas, flexDirection: 'row', alignItems: 'center', gap: 8 }, flex: { flex: 1, minWidth: 0 },
  blindSpot: { minHeight: 80, marginHorizontal: 20, paddingHorizontal: 20, borderRadius: 20, backgroundColor: colors.canvas, justifyContent: 'center' },
  moment: { marginHorizontal: 0, minHeight: 210 },
});
