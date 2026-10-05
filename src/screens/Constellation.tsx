import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, MDText } from '../../MusicDude';
import { ConstellationGraphic } from '../ui';

export function Constellation({ size = 520 }: { size?: number }) {
  return <View style={[c.frame, { width: size, height: size }]}>
    <ConstellationGraphic size={size} />
    <MDText variant="small" style={c.calm}>calm</MDText>
    <MDText variant="small" style={c.energetic}>energetic</MDText>
    <MDText variant="small" style={c.light}>light</MDText>
    <MDText variant="small" style={c.dark}>dark</MDText>
  </View>;
}

const c = StyleSheet.create({
  frame: { position: 'relative', backgroundColor: colors.surface, borderRadius: 35, overflow: 'hidden' },
  calm: { position: 'absolute', left: '8%', top: '51%' }, energetic: { position: 'absolute', right: '1%', top: '52%' },
  light: { position: 'absolute', left: '50%', top: '10%' }, dark: { position: 'absolute', left: '50%', bottom: '10%' },
});
