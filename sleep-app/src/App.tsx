import { MotionConfig } from 'framer-motion';
import { useState } from 'react';
import { TabBar, type TabId } from './components/TabBar';
import { UIProvider } from './components/ui';
import { Home } from './screens/Home';
import { Logs } from './screens/Logs';
import { Settings } from './screens/Settings';
import { Stats } from './screens/Stats';
import { LogSheet, type LogSheetInit } from './sheets/LogSheet';
import { StoreProvider } from './store/store';

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <StoreProvider>
        <UIProvider>
          <Shell />
        </UIProvider>
      </StoreProvider>
    </MotionConfig>
  );
}

function Shell() {
  const [tab, setTab] = useState<TabId>('home');
  const [sheet, setSheet] = useState<LogSheetInit | null>(null);

  // 탭은 모두 띄워 두고 보이는 것만 바꾼다 — iOS 처럼 즉시 전환되고 스크롤 위치도 남는다
  const screen = (id: TabId, node: React.ReactNode) => (
    <div key={id} hidden={tab !== id} style={{ position: 'absolute', inset: 0 }}>
      {node}
    </div>
  );

  return (
    <>
      {screen('home', <Home openSheet={setSheet} />)}
      {screen('logs', <Logs openSheet={setSheet} />)}
      {screen('stats', <Stats openSheet={setSheet} />)}
      {screen('settings', <Settings />)}
      <TabBar active={tab} onChange={setTab} />
      <LogSheet init={sheet} onClose={() => setSheet(null)} />
    </>
  );
}
