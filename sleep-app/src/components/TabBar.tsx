import { ChartColumn, House, List, Settings, type LucideIcon } from 'lucide-react';
import s from './TabBar.module.css';

export type TabId = 'home' | 'logs' | 'stats' | 'settings';

const TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: '홈', icon: House },
  { id: 'logs', label: '기록', icon: List },
  { id: 'stats', label: '통계', icon: ChartColumn },
  { id: 'settings', label: '설정', icon: Settings },
];

/** 하단 탭 바. 탭 간 전환은 iOS 처럼 즉시 바뀐다 */
export function TabBar({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  return (
    <nav className={s.bar} role="tablist" aria-label="화면">
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={active === id}
          className={`${s.tab} ${active === id ? s.active : ''}`}
          onClick={() => onChange(id)}
        >
          <Icon size={25} strokeWidth={active === id ? 2 : 1.75} absoluteStrokeWidth={false} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
