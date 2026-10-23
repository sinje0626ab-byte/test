import { motion } from 'framer-motion';
import { forwardRef, useState, type ReactNode, type UIEvent } from 'react';
import { spring } from '../lib/motion';
import s from './Page.module.css';

interface Props {
  title: string;
  /** 큰 제목 자리에 제목 대신 보여 줄 내용 (기본: title) */
  largeTitle?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
  /** 탭 바가 없는 화면(상세)이면 false */
  tabBar?: boolean;
}

/** 이만큼 스크롤하면 큰 제목이 바 가운데 작은 제목으로 바뀐다 */
const COLLAPSE_AT = 36;

/**
 * 라지 타이틀 내비게이션. 큰 제목은 콘텐츠와 함께 스크롤되고,
 * 일정 이상 내려가면 상단 바에 작은 제목 + 블러 배경이 생긴다.
 */
export const Page = forwardRef<HTMLDivElement, Props>(function Page({ title, largeTitle, left, right, children, tabBar = true }, ref) {
  const [collapsed, setCollapsed] = useState(false);
  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const c = e.currentTarget.scrollTop > COLLAPSE_AT;
    if (c !== collapsed) setCollapsed(c);
  };

  return (
    <div className={s.page}>
      <header className={s.bar}>
        <motion.div className={s.barBg} initial={false} animate={{ opacity: collapsed ? 1 : 0 }} transition={spring} />
        <div className={s.side}>{left}</div>
        <motion.h2 className={s.smallTitle} initial={false} animate={{ opacity: collapsed ? 1 : 0, y: collapsed ? 0 : 4 }} transition={spring} aria-hidden={!collapsed}>
          {title}
        </motion.h2>
        <div className={`${s.side} ${s.right}`}>{right}</div>
      </header>
      <div ref={ref} className={`${s.scroll} ${tabBar ? s.withTabBar : ''}`} onScroll={onScroll}>
        <h1 className={s.largeTitle}>{largeTitle ?? title}</h1>
        {children}
      </div>
    </div>
  );
});
