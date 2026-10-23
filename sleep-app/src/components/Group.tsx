import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import s from './Group.module.css';

/** 인셋 그룹 리스트: 둥근 모서리 그룹 + 들여 쓴 헤어라인 */
export function Group({ header, footer, children, className }: { header?: ReactNode; footer?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`${s.section} ${className ?? ''}`}>
      {header && <h3 className={s.header}>{header}</h3>}
      <div className={s.list}>{children}</div>
      {footer && <p className={s.footer}>{footer}</p>}
    </section>
  );
}

interface CellProps {
  title: ReactNode;
  subtitle?: ReactNode;
  value?: ReactNode;
  icon?: ReactNode;
  chevron?: boolean;
  destructive?: boolean;
  accent?: boolean;
  onPress?: () => void;
  children?: ReactNode;
  ariaLabel?: string;
}

/** 그룹 안의 한 줄. onPress 가 있으면 누를 수 있는 셀이 된다 */
export function Cell({ title, subtitle, value, icon, chevron, destructive, accent, onPress, children, ariaLabel }: CellProps) {
  const body = (
    <>
      {icon && <span className={`${s.icon} ${destructive ? s.iconDestructive : ''}`}>{icon}</span>}
      <span className={s.text}>
        <span className={`${s.title} ${destructive ? s.destructive : ''} ${accent ? s.accent : ''}`}>{title}</span>
        {subtitle && <span className={s.subtitle}>{subtitle}</span>}
      </span>
      {value !== undefined && <span className={s.value}>{value}</span>}
      {chevron && <ChevronRight className={s.chevron} size={18} strokeWidth={2.25} aria-hidden />}
    </>
  );
  return (
    <div className={icon ? s.withIcon : undefined}>
      {onPress ? (
        <button type="button" className={`${s.cell} ${s.pressable}`} onClick={onPress} aria-label={ariaLabel}>
          {body}
        </button>
      ) : (
        <div className={s.cell}>{body}</div>
      )}
      {children}
    </div>
  );
}
