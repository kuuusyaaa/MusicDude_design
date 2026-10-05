import React from 'react';
import {
  Pressable, ScrollView, StyleSheet, View,
  type ScrollViewProps, type StyleProp, type ViewStyle,
} from 'react-native';
import Svg, { Circle, G, Line, Rect } from 'react-native-svg';
import {
  ArrowIcon, colors, MDButton, MDText, NavBar, type TabId,
} from '../MusicDude';

export const layout = {
  referenceWidth: 402,
  screenGutter: 20,
  sectionGap: 16,
  cardPadding: 20,
  cardRadius: 20,
  rowRadius: 16,
  footerHeight: 102,
} as const;

export function ScreenFrame({ children, activeTab, onTabChange, contentStyle, ...props }:
  ScrollViewProps & { activeTab?: TabId; onTabChange?: (tab: TabId) => void; contentStyle?: StyleProp<ViewStyle> }) {
  return <View style={s.screen}>
    <ScrollView {...props} style={s.scroll} contentContainerStyle={[s.content, activeTab && s.withNav, contentStyle]}
      keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
    {activeTab && onTabChange ? <View style={s.footer}><NavBar active={activeTab} onChange={onTabChange} /></View> : null}
  </View>;
}

export function Gutter({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.gutter, style]}>{children}</View>;
}

export function SurfaceCard({ children, style, accessible = false }:
  { children: React.ReactNode; style?: StyleProp<ViewStyle>; accessible?: boolean }) {
  return <View accessible={accessible} style={[s.card, style]}>{children}</View>;
}

export function ScreenTitle({ children }: { children: React.ReactNode }) {
  return <MDText variant="h1" style={s.screenTitle}>{children}</MDText>;
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <MDText variant="h1" style={s.sectionTitle}>{children}</MDText>;
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <MDText variant="small" color={colors.blue100}>{children}</MDText>;
}

export function Supporting({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <MDText color={colors.textSecondary} style={style}>{children}</MDText>;
}

export function MusicDudeLogo({ size = 216, dark = false }: { size?: number; dark?: boolean }) {
  return <Svg width={size} height={size} viewBox="0 0 512 512" accessibilityRole="image" accessibilityLabel="MusicDude">
    <Rect width="512" height="512" rx="25" fill={dark ? colors.canvas : colors.blue500} />
    <Rect x="131" y="383" width="250" height="131" fill={colors.blue950} />
    <Rect x="231" y="362" width="50" height="56" fill="#E9BC99" />
    <Rect x="176" y="182" width="160" height="180" fill="#EABD9B" />
    <Circle cx="351" cy="256" r="40" fill={colors.blue500} />
    <Rect x="332.6" y="212" width="28" height="88" rx="14" fill={colors.blue800} />
    <Circle cx="161" cy="256" r="40" fill={colors.blue500} />
    <Rect x="151.4" y="212" width="28" height="88" rx="14" fill={colors.blue800} />
    <Rect x="271" y="410" width="7" height="111" rx="3.5" fill={colors.blue500} />
    <Rect x="234" y="410" width="7" height="111" rx="3.5" fill={colors.blue500} />
  </Svg>;
}

export function ProgressBar({ value }: { value: number }) {
  const safe = Math.max(0, Math.min(100, value));
  return <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: safe }} style={s.progressTrack}>
    <View style={[s.progressValue, { width: `${safe}%` }]} />
  </View>;
}

export function EvidencePill({ label }: { label: string }) {
  return <View style={s.evidence}><MDText variant="small" color={colors.blue100}>{label}</MDText></View>;
}

export function Artwork({ label, style }: { label?: string; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.artwork, style]}>
    <View style={s.orbitLarge} /><View style={s.orbitMedium} /><View style={s.orbitSmall} />
    {label ? <MDText variant="small" color={colors.blue100} style={s.artLabel}>{label}</MDText> : null}
  </View>;
}

export function TrackRow({ title, artist, score, onPress, onAdd }:
  { title: string; artist: string; score?: string; onPress?: () => void; onAdd?: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={s.trackRow}>
    <Artwork style={s.trackArt} />
    <View style={s.trackCopy}>
      <MDText variant="h2">{title}</MDText>
      <MDText variant="small" color={colors.textSecondary}>{artist}</MDText>
    </View>
    {score ? <MDText variant="small" color={colors.blue100}>{score}</MDText> : null}
    {onAdd ? <MDButton label="Add" variant="secondary" onPress={onAdd} style={s.addButton} /> : <ArrowIcon direction="right" size={32} />}
  </Pressable>;
}

export function ChartCard({ title, subtitle, rows, onPress }:
  { title: string; subtitle: string; rows: readonly { label: string; value: number }[]; onPress?: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={s.chartCard}>
    <View style={s.titleRow}><MDText variant="h2" style={s.flex}>{title}</MDText><ArrowIcon direction="right" size={32} /></View>
    <MDText variant="small" color={colors.textSecondary}>{subtitle}</MDText>
    <View style={s.chartRows}>{rows.map((row, index) => <View key={row.label} style={s.chartRow}>
      <View style={s.titleRow}><MDText variant="small" color={colors.blue100} style={s.flex}>{row.label}</MDText>
        <MDText variant="small" color={colors.textSecondary}>{row.value}%</MDText></View>
      <View style={s.progressTrack}><View style={[s.progressValue, index ? s.progressMuted : undefined, { width: `${row.value}%` }]} /></View>
    </View>)}</View>
  </Pressable>;
}

export const constellationPoints = [
  [128, 122, colors.blue600], [177, 104, colors.blue500], [149, 150, colors.blue600], [177, 160, colors.blue500],
  [256, 127, colors.blue400], [230, 102, colors.blue400], [230, 170, colors.blue400], [285, 175, colors.blue400],
  [332, 109, colors.blue300], [327, 127, colors.blue300], [304, 107, colors.blue300], [309, 127, colors.blue300],
  [349, 145, colors.blue300], [354, 122, colors.blue200], [349, 78, colors.blue200], [388, 88, colors.blue100],
  [388, 132, colors.blue200], [365, 107, colors.blue200], [319, 175, colors.blue400], [276, 243, colors.blue500],
  [252, 222, colors.blue500], [225, 253, colors.blue600], [194, 227, colors.blue600], [159, 225, colors.blue600],
  [159, 259, colors.blue800], [187, 258, colors.blue600], [194, 283, colors.blue800], [139, 293, colors.blue950],
  [133, 263, colors.blue800], [124, 227, colors.blue800], [95, 259, colors.blue950], [105, 293, colors.blue950], [90, 315, colors.blue950],
] as const;

export function ConstellationGraphic({ size = 362 }: { size?: number }) {
  return <Svg width={size} height={size} viewBox="0 0 520 520" accessibilityRole="image" accessibilityLabel="Listening constellation">
    <Rect width="520" height="520" rx="35" fill={colors.surface} stroke={colors.border} />
    <Line x1="247" y1="72" x2="247" y2="448" stroke={colors.border} />
    <Line x1="59" y1="260" x2="435" y2="260" stroke={colors.border} />
    <G>{constellationPoints.map(([x, y, color], index) => <Circle key={index} cx={x + 73} cy={y + 74} r="5" fill={color} />)}</G>
  </Svg>;
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface }, scroll: { flex: 1 },
  content: { paddingTop: 68, paddingBottom: 35, backgroundColor: colors.surface }, withNav: { paddingBottom: 126 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 102, paddingTop: 5, backgroundColor: colors.surface },
  gutter: { paddingHorizontal: 20 }, card: { marginHorizontal: 20, padding: 20, borderRadius: 20, backgroundColor: colors.canvas,
    borderWidth: 1, borderColor: colors.border, gap: 8 },
  screenTitle: { paddingHorizontal: 20 }, sectionTitle: { marginHorizontal: 20 },
  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden', backgroundColor: colors.raised },
  progressValue: { height: 6, borderRadius: 3, backgroundColor: colors.blue600 }, progressMuted: { backgroundColor: colors.blue100 },
  evidence: { minHeight: 36, paddingHorizontal: 12, borderRadius: 100, justifyContent: 'center', backgroundColor: colors.raised },
  artwork: { minHeight: 154, borderRadius: 14, overflow: 'hidden', backgroundColor: colors.blue950,
    borderWidth: 1, borderColor: colors.blue800, justifyContent: 'flex-end', padding: 16 },
  orbitLarge: { position: 'absolute', width: 194, height: 194, borderRadius: 97, borderWidth: 1, borderColor: colors.blue200, top: -34, left: 64 },
  orbitMedium: { position: 'absolute', width: 154, height: 154, borderRadius: 77, borderWidth: 1, borderColor: colors.blue300, top: -14, left: 84 },
  orbitSmall: { position: 'absolute', width: 114, height: 114, borderRadius: 57, borderWidth: 1, borderColor: colors.blue400, top: 6, left: 104 },
  artLabel: { textAlign: 'center' }, trackRow: { minHeight: 72, marginHorizontal: 20, padding: 12, borderRadius: 16, borderWidth: 1,
    borderColor: colors.border, backgroundColor: colors.canvas, flexDirection: 'row', alignItems: 'center', gap: 12 },
  trackArt: { width: 48, minHeight: 48, padding: 0, borderRadius: 10 }, trackCopy: { flex: 1, minWidth: 0 },
  addButton: { minHeight: 44, width: 64, paddingHorizontal: 0 },
  chartCard: { marginHorizontal: 20, padding: 20, borderRadius: 20, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.canvas, gap: 4 }, titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 }, flex: { flex: 1 },
  chartRows: { paddingTop: 10, gap: 14 }, chartRow: { gap: 5 },
});
