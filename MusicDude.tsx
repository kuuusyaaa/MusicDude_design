/** MusicDude / sys — React Native handoff. Source node IDs: figma-snapshot.json.
 * Copy this file AND figma-assets.ts. No app/backend/navigation framework required.
 * Fonts are supplied by the host app; see README before judging visual fidelity.
 */
import React, { createContext, forwardRef, useContext, useId, useState } from 'react';
import {
  Image, Platform, Pressable, StatusBar, StyleSheet, Text, TextInput, View,
  type ImageStyle, type PressableProps, type StyleProp, type TextInputProps,
  type TextProps, type TextStyle, type ViewProps, type ViewStyle,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { figmaAssets, type FigmaAssetName } from './figma-assets';

export const colors = {
  canvas: '#080B12', surface: '#111722', raised: '#1B2433', border: '#2D3A50',
  textPrimary: '#F4F7FF', textSecondary: '#A6B4CB', textMuted: '#7F91AE',
  onAccent: '#FFFFFF', defaultBlack: '#000000',
  blue950: '#071D49', blue800: '#103B8F', blue600: '#1951FC', blue500: '#3781FC',
  blue400: '#00A6FF', blue300: '#59C7FF', blue200: '#97DDFF', blue100: '#CBEFFD',
} as const;
export const metrics = {
  referenceWidth: 402, pageInset: 20, fieldInset: 16, gap: 8,
  buttonHeight: 56, fieldHeight: 56, chipHeight: 44, radius: 16, pill: 100,
  navbarHeight: 62.5, tabWidth: 68, activeTabWidth: 69.5,
} as const;
export const typography = {
  h1: { fontSize: 32, lineHeight: 43.392 },
  h2: { fontSize: 20, lineHeight: 27.12 },
  body: { fontSize: 16, lineHeight: 22.08 },
  small: { fontSize: 12, lineHeight: 16.56 },
  button: { fontSize: 24, lineHeight: 32.544 },
  navBar: { fontSize: 8, lineHeight: 11.04 },
} as const;
export type TextVariant = keyof typeof typography;
export type MusicDudeFonts = { headingBold: string; bodyRegular: string; bodyBold: string };
export const defaultFonts: MusicDudeFonts = {
  headingBold: 'DarkerGrotesque-Bold',
  bodyRegular: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif',
  bodyBold: Platform.OS === 'ios' ? 'Helvetica-Bold' : 'sans-serif-medium',
};
const FontContext = createContext(defaultFonts);
export function MusicDudeProvider({ fonts, children }: { fonts?: Partial<MusicDudeFonts>; children: React.ReactNode }) {
  return <FontContext.Provider value={{ ...defaultFonts, ...fonts }}>{children}</FontContext.Provider>;
}

/** Plain text, without Figma's outer component padding. Use TextBlock for that. */
export function MDText({ variant = 'body', color = colors.textPrimary, bold = false, style, ...props }:
  TextProps & { variant?: TextVariant; color?: string; bold?: boolean }) {
  const fonts = useContext(FontContext);
  const heading = variant === 'h1' || variant === 'h2' || variant === 'button';
  return <Text {...props} style={[typography[variant], {
    color, fontFamily: heading ? fonts.headingBold : bold ? fonts.bodyBold : fonts.bodyRegular,
    includeFontPadding: false,
  }, style]} />;
}
export function TextBlock({ variant = 'body', children, style, textStyle, ...props }:
  Omit<React.ComponentProps<typeof MDText>, 'style'> & { style?: StyleProp<ViewStyle>; textStyle?: StyleProp<TextStyle> }) {
  return <View style={[{ paddingHorizontal: 20, paddingVertical: variant === 'h2' || variant === 'navBar' ? 0 : 8 }, style]}>
    <MDText {...props} variant={variant} style={textStyle}>{children}</MDText>
  </View>;
}

export type GradientName = 'primary' | 'primaryPressed' | 'selected' | 'navActive' | 'signature';
export const gradients = {
  primary: { colors: [colors.blue800, colors.blue600], offsets: [0, 1], start: [0.25, 0.25], end: [0.75, -0.25] },
  primaryPressed: { colors: [colors.blue950, colors.blue800], offsets: [0, 1], start: [0.25, 0.25], end: [0.75, -0.25] },
  selected: { colors: [colors.raised, colors.blue950], offsets: [0, 1], start: [0, 0], end: [1, 0] },
  navActive: { colors: [colors.raised, '#081020', '#1B3046'], offsets: [0, 0.55, 1], start: [0, 0], end: [1, 0] },
  signature: { colors: [colors.blue950, colors.blue600, colors.blue400, colors.blue100], offsets: [0, 0.4, 0.7, 1], start: [0, 0], end: [1, 0] },
} as const;
/** Gradient layer, not an interactive element. Parent controls clipping/radius. */
export function Gradient({ name = 'primary' }: { name?: GradientName }) {
  const id = `md${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const g = gradients[name];
  return <Svg pointerEvents="none" accessible={false} style={StyleSheet.absoluteFill} width="100%" height="100%">
    <Defs><LinearGradient id={id} x1={`${g.start[0] * 100}%`} y1={`${g.start[1] * 100}%`}
      x2={`${g.end[0] * 100}%`} y2={`${g.end[1] * 100}%`}>
      {g.colors.map((color, i) => <Stop key={i} offset={g.offsets[i]} stopColor={color} />)}
    </LinearGradient></Defs><Rect width="100%" height="100%" fill={`url(#${id})`} />
  </Svg>;
}

export type IconName = 'main' | 'library' | 'social' | 'eras' | 'profile';
export type ArrowDirection = 'right' | 'down' | 'left' | 'up';
function Asset({ name, width, height, color, style }: { name: FigmaAssetName; width?: number; height?: number; color?: string; style?: StyleProp<ImageStyle> }) {
  const a = figmaAssets[name];
  return <Image accessible={false} source={{ uri: a.uri }} resizeMode="contain"
    style={[{ width: width ?? a.width, height: height ?? a.height }, color ? { tintColor: color } : undefined, style]} />;
}
/** Original 3x Figma export. Do not tint multicolour solid icons unless intentional. */
export function Icon({ name, variant = 'stroke', size = 44, color }: { name: IconName; variant?: 'stroke' | 'solid'; size?: number; color?: string }) {
  return <Asset name={`${name}-${variant}`} width={size} height={size} color={color} />;
}
export function ArrowIcon({ direction = 'right', size = 44, color = colors.blue100 }: { direction?: ArrowDirection; size?: number; color?: string }) {
  return <Asset name={`arrow-${direction}`} width={size} height={size} color={color} />;
}

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonState = 'default' | 'pressed' | 'disabled' | 'loading';
export function buttonAppearance(variant: ButtonVariant, state: ButtonState) {
  const disabled = state === 'disabled', pressed = state === 'pressed';
  return {
    backgroundColor: variant === 'primary' ? colors.surface : variant === 'secondary'
      ? pressed ? colors.canvas : colors.surface : pressed ? colors.raised : 'transparent',
    borderWidth: variant === 'secondary' ? 1 : 0,
    borderColor: colors.border,
    textColor: disabled ? colors.textMuted : variant === 'primary' ? colors.textPrimary : colors.blue100,
    gradient: variant === 'primary' && !disabled ? pressed ? 'primaryPressed' as const : 'primary' as const : undefined,
  };
}
export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string; variant?: ButtonVariant; loading?: boolean; loadingLabel?: string;
  /** For a component gallery only. Real presses/disabled/loading work without this. */
  state?: ButtonState; style?: StyleProp<ViewStyle>;
};
export function MDButton({ label, variant = 'primary', loading = false, loadingLabel = 'Loading…', state,
  disabled = false, style, accessibilityState, ...props }: ButtonProps) {
  const busy = loading || state === 'loading';
  const blocked = disabled || state === 'disabled' || busy;
  const visual = (pressed: boolean): ButtonState => disabled || state === 'disabled' ? 'disabled' : busy ? 'loading' : state ?? (pressed ? 'pressed' : 'default');
  return <Pressable {...props} accessibilityRole="button" disabled={blocked}
    accessibilityState={{ ...accessibilityState, disabled: blocked, busy }}
    style={({ pressed }) => { const a = buttonAppearance(variant, visual(pressed)); return [s.button, { backgroundColor: a.backgroundColor, borderWidth: a.borderWidth, borderColor: a.borderColor }, style]; }}>
    {({ pressed }) => { const a = buttonAppearance(variant, visual(pressed)); return <>
      {a.gradient && <Gradient name={a.gradient} />}
      {/* The 6px bottom compensation is from the user's corrected button, not a typo. */}
      <MDText variant="button" color={a.textColor} style={s.buttonText}>{busy ? loadingLabel : label}</MDText>
    </>; }}
  </Pressable>;
}

export type InputState = 'empty' | 'editing' | 'filled' | 'error' | 'disabled';
export type InputProps = TextInputProps & {
  label: string; state?: InputState; error?: string; containerStyle?: StyleProp<ViewStyle>;
};
export const MDInput = forwardRef<TextInput, InputProps>(function MDInput({ label, state, error, containerStyle,
  style, editable = true, onFocus, onBlur, accessibilityLabel, ...props }, ref) {
  const fonts = useContext(FontContext), [focused, setFocused] = useState(false);
  const blocked = !editable || state === 'disabled';
  const emphasized = !blocked && (focused || state === 'editing' || state === 'error' || Boolean(error));
  return <View style={[s.fieldOuter, containerStyle]}>
    <MDText variant="h2" color={colors.textSecondary}>{label}</MDText>
    <TextInput {...props} ref={ref} editable={!blocked} accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ ...props.accessibilityState, disabled: blocked }}
      placeholderTextColor={colors.textMuted} selectionColor={colors.blue300}
      onFocus={e => { setFocused(true); onFocus?.(e); }} onBlur={e => { setFocused(false); onBlur?.(e); }}
      style={[s.input, typography.body, { fontFamily: fonts.bodyRegular, color: blocked ? colors.textMuted : colors.textPrimary,
        borderColor: emphasized ? colors.blue100 : colors.border }, props.multiline && s.multiline, style]} />
    {error ? <MDText variant="small" color={colors.blue100} accessibilityLiveRegion="polite">{error}</MDText> : null}
  </View>;
});

export type SelectorState = 'empty' | 'selected' | 'open' | 'disabled';
export function MDSelector({ label, value, placeholder = 'Choose an option', helper, state, disabled = false,
  onPress, style }: { label: string; value?: string; placeholder?: string; helper?: string; state?: SelectorState;
  disabled?: boolean; onPress?: () => void; style?: StyleProp<ViewStyle> }) {
  const blocked = disabled || state === 'disabled', open = state === 'open';
  return <View style={[s.fieldOuter, style]}>
    <MDText variant="small" color={blocked ? colors.textMuted : colors.blue100}>{label}</MDText>
    <Pressable accessibilityRole="button" accessibilityLabel={`${label}: ${value || placeholder}`}
      accessibilityState={{ disabled: blocked, expanded: open }} disabled={blocked} onPress={onPress} style={s.selectorTarget}>
      <View style={[s.selectorFace, { borderColor: open ? colors.blue100 : colors.border }]}>
        <MDText variant="h2" color={blocked ? colors.textMuted : colors.textPrimary} style={s.flex}>{value || placeholder}</MDText>
        <Asset name="selector-arrow" color={blocked ? colors.textMuted : colors.blue100} />
      </View>
    </Pressable>
    {helper ? <MDText variant="small" color={colors.textMuted}>{helper}</MDText> : null}
  </View>;
}

export type ChipState = 'default' | 'pressed' | 'selected' | 'disabled';
export function FilterChip({ label, selected = false, disabled = false, state, onPress, style }:
  { label: string; selected?: boolean; disabled?: boolean; state?: ChipState; onPress?: () => void; style?: StyleProp<ViewStyle> }) {
  const checked = selected || state === 'selected', blocked = disabled || state === 'disabled';
  return <Pressable accessibilityRole="checkbox" accessibilityLabel={label} accessibilityState={{ checked, disabled: blocked }}
    onPress={onPress} disabled={blocked} style={({ pressed }) => [s.chip, {
      borderColor: checked && !blocked ? colors.blue100 : colors.border,
      backgroundColor: !blocked && (pressed || state === 'pressed') ? colors.raised : colors.surface,
    }, style]}>
    {checked && !blocked ? <Gradient name="selected" /> : null}
    <MDText variant="h2" color={blocked ? colors.textMuted : colors.blue100}>{label}</MDText>
  </Pressable>;
}

export type SegmentOption<T extends string> = { value: T; label: string; disabled?: boolean };
/** Same control as Library mode and Register / Log in. Controlled, label lengths can vary. */
export function SegmentedControl<T extends string>({ options, value, onChange, style }:
  { options: readonly SegmentOption<T>[]; value: T; onChange: (value: T) => void; style?: StyleProp<ViewStyle> }) {
  return <View accessibilityRole="tablist" style={[s.segments, style]}>
    {options.map(option => <Pressable key={option.value} accessibilityRole="tab" accessibilityLabel={option.label}
      accessibilityState={{ selected: option.value === value, disabled: !!option.disabled }} disabled={option.disabled}
      onPress={() => onChange(option.value)} style={[s.segment, option.value === value && s.segmentSelected]}>
      {option.value === value && <Gradient name="selected" />}
      <MDText variant="h2" color={option.disabled || option.value !== value ? colors.textMuted : colors.blue100}
        style={s.center}>{option.label}</MDText>
    </Pressable>)}
  </View>;
}
export type LibraryModeValue = 'library' | 'discover';
export function LibraryMode(props: { value: LibraryModeValue; onChange: (mode: LibraryModeValue) => void; style?: StyleProp<ViewStyle> }) {
  return <SegmentedControl {...props} options={[{ value: 'library', label: 'My library' }, { value: 'discover', label: 'Discover' }]} />;
}

export const tabs = [
  { id: 'portrait', label: 'Main' }, { id: 'library', label: 'Library' },
  { id: 'community', label: 'Social' }, { id: 'eras', label: 'Eras' }, { id: 'profile', label: 'Profile' },
] as const;
export type TabId = typeof tabs[number]['id'];
export function NavButton({ tab, active = false, disabled = false, onPress, style }:
  { tab: TabId; active?: boolean; disabled?: boolean; onPress?: () => void; style?: StyleProp<ViewStyle> }) {
  const item = tabs.find(t => t.id === tab)!;
  return <Pressable accessibilityRole="tab" accessibilityLabel={item.label} accessibilityState={{ selected: active, disabled }}
    disabled={disabled} onPress={onPress} style={[s.navButton, active && s.navButtonActive, disabled && { opacity: 0.5 }, style]}>
    {active && <Gradient name="navActive" />}
    <Asset name={`nav-${tab}-${active ? 'active' : 'inactive'}`} width={44} height={36} />
    <MDText variant="navBar" bold={active} color={active ? colors.blue100 : colors.textMuted} style={s.navLabel}>{item.label}</MDText>
  </Pressable>;
}
/** Responsive 402 reference width; inset belongs here, do not wrap in another 20px gutter. */
export function NavBar({ active, onChange, bottomInset = 0, style }:
  { active: TabId; onChange: (tab: TabId) => void; bottomInset?: number; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.navOuter, { paddingBottom: bottomInset }, style]}>
    <View accessibilityRole="tablist" style={s.navBackground}>
      {tabs.map(tab => <NavButton key={tab.id} tab={tab.id} active={active === tab.id} onPress={() => onChange(tab.id)} style={s.flex} />)}
    </View>
  </View>;
}

/** Native OS chrome in real apps. Figma static chrome is available only for previews. */
export function MusicDudeStatusBar() { return <StatusBar barStyle="light-content" />; }
export function StatusBarPreview({ width = 402 }: { width?: number }) {
  return <Asset name="status-bar-preview" width={width} height={width * 60 / 402} />;
}
export function HomeBarPreview({ width = 402 }: { width?: number }) {
  return <Asset name="home-bar-preview" width={width} height={width * 35.046 / 402} />;
}
export function Screen({ children, style, ...props }: ViewProps) {
  return <View {...props} style={[{ flex: 1, backgroundColor: colors.surface }, style]}>{children}</View>;
}

/** Composite variants from txt, not a second component design. */
export function MixedTextRow({ title, addition, onPress }: { title: string; addition: string; onPress?: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={s.mixedRow}>
    <MDText variant="h2" color={colors.defaultBlack} style={s.flex}>{title}</MDText>
    <MDText color={colors.blue300}>{addition}</MDText><Asset name="mixed-arrow" />
  </Pressable>;
}
export function TextSelectorRow({ title, onPress }: { title: string; onPress?: () => void }) {
  return <View style={s.legacyOuter}><Pressable accessibilityRole="button" onPress={onPress} style={s.legacyFace}>
    <MDText variant="h2" color={colors.defaultBlack} style={s.flex}>{title}</MDText><Asset name="selector-arrow" />
  </Pressable></View>;
}
export function RatingRow({ rank, name, rating }: { rank: string | number; name: string; rating: string | number }) {
  return <View style={s.legacyOuter}><View style={[s.legacyFace, { borderRadius: 0 }]}>
    <MDText variant="h2" color={colors.defaultBlack}>{rank}.</MDText>
    <MDText variant="h2" color={colors.defaultBlack} style={s.flex}>{name}</MDText>
    <MDText variant="h2" color={colors.defaultBlack}>{rating}</MDText>
  </View></View>;
}

const s = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 }, center: { textAlign: 'center' },
  button: { minHeight: 56, borderRadius: 100, paddingHorizontal: 16, paddingBottom: 6,
    overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  buttonText: { textAlign: 'center', paddingHorizontal: 20, paddingVertical: 8 },
  fieldOuter: { paddingHorizontal: 20, gap: 8, alignSelf: 'stretch' },
  input: { minHeight: 56, borderWidth: 1, borderRadius: 16, backgroundColor: colors.surface,
    paddingHorizontal: 16, paddingVertical: 0, includeFontPadding: false },
  multiline: { minHeight: 88, textAlignVertical: 'top', paddingVertical: 12 },
  selectorTarget: { minHeight: 56, justifyContent: 'center' },
  selectorFace: { minHeight: 47, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1,
    borderRadius: 16, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', gap: 8 },
  chip: { minHeight: 44, paddingHorizontal: 16, paddingVertical: 6.5, borderWidth: 1, borderRadius: 100,
    overflow: 'hidden', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
  segments: { minHeight: 56, padding: 5, borderWidth: 1, borderColor: colors.border,
    borderRadius: 100, backgroundColor: colors.surface, flexDirection: 'row', gap: 4 },
  segment: { flex: 1, minWidth: 0, minHeight: 44, paddingHorizontal: 8, paddingVertical: 6.5,
    borderRadius: 100, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'transparent' },
  segmentSelected: { borderColor: colors.blue100 },
  navOuter: { paddingHorizontal: 20, width: '100%' },
  // Current master uses 8px + border, not the earlier verbal draft's 16px.
  navBackground: { minHeight: 62.5, borderWidth: 1, borderColor: colors.border, borderRadius: 100,
    backgroundColor: colors.surface, paddingHorizontal: 8, paddingVertical: 4, flexDirection: 'row', alignItems: 'center' },
  navButton: { width: 68, minHeight: 51, borderRadius: 100, backgroundColor: colors.surface,
    justifyContent: 'center', alignItems: 'center', paddingTop: 2, paddingBottom: 6, overflow: 'hidden' },
  navButtonActive: { minHeight: 52.5, borderWidth: 0.75, borderColor: 'rgba(151,221,255,0.28)' },
  navLabel: { marginTop: -4, textAlign: 'center' },
  mixedRow: { minHeight: 44, paddingHorizontal: 20, flexDirection: 'row', gap: 8, alignItems: 'center' },
  legacyOuter: { paddingHorizontal: 20 },
  legacyFace: { minHeight: 47, paddingVertical: 8, paddingHorizontal: 16, borderWidth: 1,
    borderColor: colors.blue600, borderRadius: 10, backgroundColor: colors.onAccent,
    flexDirection: 'row', gap: 4, alignItems: 'center' },
});
