import { describe, expect, test, mock } from 'bun:test';
import React from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';

// Native host mocks: test component logic without pretending this is a device screenshot.
const host = (name: string) => React.forwardRef<unknown, any>((props, ref) =>
  React.createElement(name, { ...props, ref }, props.children));
mock.module('react-native', () => ({
  View: host('View'), Text: host('Text'), Image: host('Image'), TextInput: host('TextInput'),
  StatusBar: host('StatusBar'), Platform: { OS: 'ios' },
  StyleSheet: { create: (x: unknown) => x, absoluteFill: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 } },
  Pressable: (props: any) => React.createElement('Pressable', { ...props, style: typeof props.style === 'function' ? props.style({ pressed: false }) : props.style },
    typeof props.children === 'function' ? props.children({ pressed: false }) : props.children),
}));
mock.module('react-native-svg', () => ({ default: host('Svg'), Defs: host('Defs'), LinearGradient: host('LinearGradient'), Rect: host('Rect'), Stop: host('Stop') }));
const { MDButton, MDInput, MDSelector, FilterChip, LibraryMode, NavBar, colors, buttonAppearance, tabs } = await import('../MusicDude');
const { figmaAssets } = await import('../figma-assets');
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
function mount(element: React.ReactElement) { let r!: ReactTestRenderer; act(() => { r = create(element); }); return r; }

describe('Figma assets and tokens', () => {
  test('all 28 assets are real PNGs with measured dimensions and Figma IDs', () => {
    expect(Object.keys(figmaAssets)).toHaveLength(28);
    for (const asset of Object.values(figmaAssets)) {
      const bytes = Buffer.from(asset.uri.split(',')[1], 'base64');
      expect(bytes.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
      expect(bytes.readUInt32BE(16)).toBeGreaterThanOrEqual(Math.floor(asset.width * 3));
      expect(bytes.readUInt32BE(20)).toBeGreaterThanOrEqual(Math.floor(asset.height * 3));
      expect(asset.figmaNodeId).toContain('77:');
    }
  });
  test('17 measured palette entries and five navigation choices', () => {
    expect(Object.keys(colors)).toHaveLength(17); expect(tabs).toHaveLength(5);
  });
  test('button emphasis and states match the component set', () => {
    expect(buttonAppearance('primary', 'pressed').gradient).toBe('primaryPressed');
    expect(buttonAppearance('primary', 'disabled').gradient).toBeUndefined();
    expect(buttonAppearance('secondary', 'pressed').backgroundColor).toBe(colors.canvas);
    expect(buttonAppearance('tertiary', 'default').backgroundColor).toBe('transparent');
  });
});
describe('Native component logic (mocked host)', () => {
  test('loading and disabled buttons cannot fire', () => {
    for (const props of [{ loading: true }, { disabled: true }, { state: 'disabled' as const }]) {
      const r = mount(<MDButton label="Save" {...props} />);
      const p = r.root.findByType('Pressable' as any); expect(p.props.disabled).toBe(true);
      act(() => r.unmount());
    }
  });
  test('button forwards action and accessible name', () => {
    const action = mock(); const r = mount(<MDButton label="Save" onPress={action} />);
    const p = r.root.findByType('Pressable' as any); act(() => p.props.onPress()); expect(action).toHaveBeenCalledTimes(1);
    expect(p.props.accessibilityRole).toBe('button'); act(() => r.unmount());
  });
  test('input focus, error and disabling preserve controlled value', () => {
    const r = mount(<MDInput label="Username" value="name" error="Not available" onChangeText={() => {}} />);
    const input = r.root.findByType('TextInput' as any); expect(input.props.value).toBe('name');
    expect(input.props.style[2].borderColor).toBe(colors.blue100);
    act(() => input.props.onFocus({})); act(() => input.props.onBlur({}));
    act(() => r.update(<MDInput label="Username" value="name" state="disabled" />));
    expect(r.root.findByType('TextInput' as any).props.editable).toBe(false); act(() => r.unmount());
  });
  test('selector exposes open and disabled states', () => {
    const r = mount(<MDSelector label="Genre" state="open" value="Indie rock" />);
    expect(r.root.findByType('Pressable' as any).props.accessibilityState.expanded).toBe(true);
    act(() => r.update(<MDSelector label="Genre" disabled />));
    expect(r.root.findByType('Pressable' as any).props.disabled).toBe(true); act(() => r.unmount());
  });
  test('chip exposes selected state and invokes change', () => {
    const fn = mock(); const r = mount(<FilterChip label="Indie rock" selected onPress={fn} />);
    const p = r.root.findByType('Pressable' as any); expect(p.props.accessibilityState.checked).toBe(true);
    act(() => p.props.onPress()); expect(fn).toHaveBeenCalledTimes(1); act(() => r.unmount());
  });
  test('mode and navbar return semantic values, not display labels', () => {
    const fn = mock(); const r = mount(<LibraryMode value="library" onChange={fn} />);
    act(() => r.root.findAllByType('Pressable' as any)[1].props.onPress()); expect(fn).toHaveBeenCalledWith('discover');
    act(() => r.update(<NavBar active="eras" onChange={fn} />));
    const buttons = r.root.findAllByType('Pressable' as any); expect(buttons).toHaveLength(5);
    expect(buttons[3].props.accessibilityState.selected).toBe(true);
    act(() => buttons[2].props.onPress()); expect(fn).toHaveBeenCalledWith('community'); act(() => r.unmount());
  });
});
