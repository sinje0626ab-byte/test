import type { ReactNode } from 'react';
import { Pressable } from './Pressable';
import s from './Card.module.css';

/** 그림자 대신 배경색 차이로 구분하는 카드 */
export function Card({ title, aside, children, onPress, className }: { title?: ReactNode; aside?: ReactNode; children: ReactNode; onPress?: () => void; className?: string }) {
  const head = (title || aside) && (
    <div className={s.head}>
      {title && <h3 className={s.title}>{title}</h3>}
      {aside && <span className={s.aside}>{aside}</span>}
    </div>
  );
  if (onPress)
    return (
      <Pressable className={`${s.card} ${className ?? ''}`} onClick={onPress}>
        {head}
        {children}
      </Pressable>
    );
  return (
    <section className={`${s.card} ${className ?? ''}`}>
      {head}
      {children}
    </section>
  );
}

/** 아이콘 + 짧은 안내 + 행동 버튼 */
export function EmptyState({ icon, title, message, action }: { icon: ReactNode; title: string; message: string; action?: ReactNode }) {
  return (
    <div className={s.empty}>
      <div className={s.emptyIcon}>{icon}</div>
      <p className={s.emptyTitle}>{title}</p>
      <p className={s.emptyMessage}>{message}</p>
      {action && <div className={s.emptyAction}>{action}</div>}
    </div>
  );
}
