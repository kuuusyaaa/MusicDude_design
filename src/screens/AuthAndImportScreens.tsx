import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  colors, MDButton, MDInput, MDText, SegmentedControl,
} from '../../MusicDude';
import {
  EvidencePill, Gutter, MusicDudeLogo, ProgressBar, ScreenFrame, ScreenTitle,
  SectionTitle, Supporting, SurfaceCard,
} from '../ui';

export function WelcomeScreen({ onGetStarted, onLogin }:
  { onGetStarted?: () => void; onLogin?: () => void }) {
  return <ScreenFrame contentStyle={a.welcomeContent}>
    <View style={a.logo}><MusicDudeLogo size={216} dark /></View>
    <View style={a.welcomeCopy}>
      <MDText variant="h1" style={a.hero}>Meet your{`\n`}music.</MDText>
      <Supporting>The eras, places and moods{`\n`}that make your sound.</Supporting>
    </View>
    <Gutter style={a.buttonStack}>
      <MDButton label="Get started" onPress={onGetStarted} />
      <MDButton label="Log in" variant="tertiary" onPress={onLogin} />
    </Gutter>
  </ScreenFrame>;
}

export function RegisterScreen({ onRegister, onLogin }:
  { onRegister?: (values: { firstName: string; email: string; password: string }) => void; onLogin?: () => void }) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  return <ScreenFrame contentStyle={a.authContent}>
    <Gutter><SegmentedControl value="register" onChange={v => v === 'login' && onLogin?.()}
      options={[{ value: 'register', label: 'Create account' }, { value: 'login', label: 'Log in' }]} /></Gutter>
    <View style={a.fields}>
      <MDInput label="First name" placeholder="Enter your name" value={firstName} onChangeText={setFirstName} />
      <MDInput label="E-mail" placeholder="Enter your E-mail" value={email} onChangeText={setEmail}
        keyboardType="email-address" autoCapitalize="none" />
      <MDInput label="Password" placeholder="********" value={password} onChangeText={setPassword} secureTextEntry />
      <MDInput label="Confirm password" placeholder="********" value={confirm} onChangeText={setConfirm} secureTextEntry
        error={confirm && confirm !== password ? 'Passwords do not match.' : undefined} />
    </View>
    <Gutter><MDButton label="Sign up" disabled={!firstName || !email || !password || password !== confirm}
      onPress={() => onRegister?.({ firstName, email, password })} /></Gutter>
  </ScreenFrame>;
}

export function LoginScreen({ onLogin, onRegister, onForgotPassword }:
  { onLogin?: (values: { email: string; password: string }) => void; onRegister?: () => void; onForgotPassword?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return <ScreenFrame contentStyle={a.authContent}>
    <Gutter><SegmentedControl value="login" onChange={v => v === 'register' && onRegister?.()}
      options={[{ value: 'register', label: 'Create account' }, { value: 'login', label: 'Log in' }]} /></Gutter>
    <View style={a.fields}>
      <MDInput label="E-mail" placeholder="Enter your E-mail" value={email} onChangeText={setEmail}
        keyboardType="email-address" autoCapitalize="none" />
      <MDInput label="Password" placeholder="********" value={password} onChangeText={setPassword} secureTextEntry />
    </View>
    <Gutter style={a.buttonStack}>
      <MDButton label="Log in" disabled={!email || !password} onPress={() => onLogin?.({ email, password })} />
      <MDButton label="Forgot password" variant="tertiary" onPress={onForgotPassword} />
    </Gutter>
  </ScreenFrame>;
}

function ImportSection({ title, body, children }:
  { title: string; body?: React.ReactNode; children: React.ReactNode }) {
  return <View style={a.importSection}>
    <SectionTitle>{title}</SectionTitle>
    {body ? <Gutter><MDText variant="small" color={colors.textSecondary}>{body}</MDText></Gutter> : null}
    {children}
  </View>;
}

export function ImportMusicScreen({ onConnectSpotify, onImportLink, onChooseFile, onImportList, onStartScan, onDemo }:
  { onConnectSpotify?: () => void; onImportLink?: (link: string) => void; onChooseFile?: () => void;
    onImportList?: (tracks: string) => void; onStartScan?: () => void; onDemo?: () => void }) {
  const [link, setLink] = useState('');
  const [tracks, setTracks] = useState('');
  const [search, setSearch] = useState('');
  return <ScreenFrame contentStyle={a.importContent}>
    <ScreenTitle>Import music</ScreenTitle>
    <Gutter><MDText variant="small" color={colors.textSecondary}>Bring your music. Choose any way below.</MDText></Gutter>
    <ImportSection title="Connect Spotify" body="Import Liked Songs and when you saved them.">
      <Gutter><MDButton label="Connect Spotify" variant="secondary" onPress={onConnectSpotify} /></Gutter>
    </ImportSection>
    <ImportSection title="Import a link" body="Playlist, album or track · no login needed">
      <MDInput label="Public Spotify link" placeholder="Paste a public Spotify link" value={link} onChangeText={setLink} />
      <Gutter><MDButton label="Import link" variant="secondary" disabled={!link} onPress={() => onImportLink?.(link)} /></Gutter>
    </ImportSection>
    <ImportSection title="Upload a file" body={<>iTunes Library.xml, Spotify export or text list.{`\n`}Spotify exports bring your full listening history.</>}>
      <Gutter><MDButton label="Choose file" variant="secondary" onPress={onChooseFile} /></Gutter>
    </ImportSection>
    <ImportSection title="Paste a track list">
      <MDInput label="Tracks" placeholder={'Artist - Title\nOne track per line'} multiline value={tracks} onChangeText={setTracks} />
      <Gutter><MDButton label="Import list" variant="secondary" disabled={!tracks} onPress={() => onImportList?.(tracks)} /></Gutter>
    </ImportSection>
    <ImportSection title="Search and add" body="Search the catalogue to add individual tracks.">
      <MDInput label="Search" placeholder="Search artists or tracks" value={search} onChangeText={setSearch} />
    </ImportSection>
    <Gutter style={a.buttonStack}>
      <MDText variant="h2" color={colors.textSecondary}>0 tracks added</MDText>
      <MDButton label="Start scan" disabled onPress={onStartScan} />
      <MDText variant="small" color={colors.textSecondary}>Add at least one track to start your scan.</MDText>
      <MDButton label="Try a demo library" variant="tertiary" onPress={onDemo} />
      <MDText variant="small" color={colors.textSecondary}>Your 14-day trial starts with your first scan.</MDText>
    </Gutter>
  </ScreenFrame>;
}

export type SpotifyState = 'login' | 'importing' | 'error';
export function ConnectSpotifyScreen({ state, imported = 1240, total = 3100, onRetry, onBack }:
  { state: SpotifyState; imported?: number; total?: number; onRetry?: () => void; onBack?: () => void }) {
  const percent = total ? Math.round(imported / total * 100) : 0;
  return <ScreenFrame contentStyle={a.spotifyContent}>
    <ScreenTitle>Connect Spotify</ScreenTitle>
    <Gutter><Supporting>{state === 'login' ? 'Sign in to import your Liked Songs automatically.' :
      state === 'importing' ? 'Your Liked Songs are on their way.' : 'Let’s get your music connected.'}</Supporting></Gutter>
    {state === 'login' ? <>
      <SurfaceCard style={a.spotifyPanel}>
        <MDText variant="h1">Spotify</MDText><MDText variant="h2" color={colors.blue100}>Secure sign-in</MDText>
        <Supporting>Spotify’s sign-in page appears here.{`\n`}Account and permission steps are provided by Spotify.</Supporting>
        <MDText variant="small" color={colors.textSecondary}>Embedded web view · design placeholder</MDText>
      </SurfaceCard>
      <Gutter><MDText variant="small" color={colors.textSecondary}>MusicDude never sees your Spotify password.{`\n`}Import starts once sign-in is complete.</MDText></Gutter>
    </> : state === 'importing' ? <>
      <SurfaceCard style={a.progressCard}>
        <MDText variant="h2" color={colors.blue100}>Importing your Liked Songs…</MDText>
        <MDText variant="h1">{imported.toLocaleString()} / {total.toLocaleString()}</MDText>
        <MDText variant="small" color={colors.textSecondary}>Tracks imported · {percent}%</MDText><ProgressBar value={percent} />
      </SurfaceCard>
      <Gutter><Supporting>Large libraries can take a little longer.{`\n`}Your import continues if you go back.</Supporting>
        <MDText variant="small" color={colors.textSecondary}>You can return here to check the latest count.</MDText></Gutter>
    </> : <>
      <SurfaceCard style={a.errorCard}><MDText variant="h1">Unable to connect</MDText>
        <Supporting>We couldn’t finish connecting to Spotify.{`\n`}Try signing in again.</Supporting></SurfaceCard>
      <Gutter style={a.buttonStack}><MDText variant="small" color={colors.textSecondary}>Retry opens a fresh Spotify sign-in.</MDText>
        <MDButton label="Retry" onPress={onRetry} /></Gutter>
    </>}
    <Gutter style={a.spotifyBack}><MDButton label="Back to Import music" variant="tertiary" onPress={onBack} /></Gutter>
  </ScreenFrame>;
}

export function ListeningPermissionScreen({ granted, onGrant, onContinue, onSkip }:
  { granted: boolean; onGrant?: () => void; onContinue?: () => void; onSkip?: () => void }) {
  return <ScreenFrame contentStyle={a.permissionContent}>
    <ScreenTitle>{granted ? 'Listening access is on' : <>Let MusicDude notice{`\n`}what you play</>}</ScreenTitle>
    <Gutter><Supporting>{granted ? 'Apple Music is connected. Your listening can now shape in-the-moment suggestions.' :
      'Get cards and check-ins inspired by what you’re listening to right now.'}</Supporting></Gutter>
    <SurfaceCard style={a.coverage}>
      <MDText variant="h2" color={colors.blue100}>On this iPhone</MDText>
      <MDText variant="h2">Apple Music</MDText><MDText variant="small" color={colors.textSecondary}>Track, artist and album currently playing.</MDText>
      <MDText variant="h2">Spotify: history only</MDText><MDText variant="small" color={colors.textSecondary}>iOS does not let us see Spotify as it plays.{`\n`}We can still use your imported history.</MDText>
    </SurfaceCard>
    <Gutter style={a.permissionStatus}>
      <MDText variant="small" color={colors.textSecondary}>Listening information, not audio recordings.</MDText>
      <MDText variant="h2" color={granted ? colors.blue100 : colors.textSecondary}>{granted ? 'Access granted' : 'Access not granted'}</MDText>
      <MDText variant="small" color={colors.textSecondary}>{granted ? 'Permission confirmed. You can continue.' :
        'Optional. Your daily card, portrait, eras and graph still work without access.'}</MDText>
    </Gutter>
    <Gutter style={a.buttonStack}>
      <MDButton label={granted ? 'Continue' : 'Grant access'} onPress={granted ? onContinue : onGrant} />
      {!granted ? <MDButton label="Not now" variant="tertiary" onPress={onSkip} /> : null}
      <MDText variant="small" color={colors.textSecondary}>{granted ? 'You can manage access from Profile.' : 'You can enable this later from Profile.'}</MDText>
    </Gutter>
  </ScreenFrame>;
}

const a = StyleSheet.create({
  welcomeContent: { minHeight: 874, paddingTop: 136 }, logo: { alignItems: 'center' }, welcomeCopy: { marginTop: 58, paddingHorizontal: 20, gap: 8 },
  hero: { fontSize: 48, lineHeight: 48 }, buttonStack: { gap: 12 },
  authContent: { gap: 28 }, fields: { gap: 8 }, importContent: { gap: 12, paddingBottom: 48 }, importSection: { gap: 8, marginTop: 12 },
  spotifyContent: { minHeight: 874, gap: 16 }, spotifyPanel: { minHeight: 414, paddingTop: 32, gap: 24 },
  progressCard: { minHeight: 232, paddingTop: 24, gap: 18 }, errorCard: { minHeight: 216, paddingTop: 28, gap: 20 }, spotifyBack: { marginTop: 'auto' },
  permissionContent: { minHeight: 874, gap: 14 }, coverage: { minHeight: 204, gap: 6 }, permissionStatus: { gap: 8 },
});
