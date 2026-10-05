import React, { useState } from 'react';
import { MusicDudeProvider, type TabId } from './MusicDude';
import {
  ConnectSpotifyScreen, ErasPremiumScreen, ImportMusicScreen, LibraryAnalyticsScreen,
  LoginScreen, PortraitScreen, RegisterScreen, WelcomeScreen,
} from './src/screens';

type Route = 'welcome' | 'register' | 'login' | 'import' | 'spotify' | 'portrait' | 'library' | 'eras';

/** Dependency-free screen gallery for a bare React Native host app. Replace this state switch with its navigator. */
export default function MusicDudeScreenExample() {
  const [route, setRoute] = useState<Route>('welcome');
  const changeTab = (tab: TabId) => setRoute(tab === 'library' ? 'library' : tab === 'eras' ? 'eras' : 'portrait');
  let screen: React.ReactNode;
  switch (route) {
    case 'register': screen = <RegisterScreen onLogin={() => setRoute('login')} onRegister={() => setRoute('import')} />; break;
    case 'login': screen = <LoginScreen onRegister={() => setRoute('register')} onLogin={() => setRoute('portrait')} />; break;
    case 'import': screen = <ImportMusicScreen onConnectSpotify={() => setRoute('spotify')} onDemo={() => setRoute('portrait')} />; break;
    case 'spotify': screen = <ConnectSpotifyScreen state="login" onBack={() => setRoute('import')} />; break;
    case 'portrait': screen = <PortraitScreen onTabChange={changeTab} />; break;
    case 'library': screen = <LibraryAnalyticsScreen onTabChange={changeTab} />; break;
    case 'eras': screen = <ErasPremiumScreen onTabChange={changeTab} />; break;
    default: screen = <WelcomeScreen onGetStarted={() => setRoute('register')} onLogin={() => setRoute('login')} />;
  }
  return <MusicDudeProvider>{screen}</MusicDudeProvider>;
}
