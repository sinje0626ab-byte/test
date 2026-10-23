import { AnimatePresence, motion, useDragControls, type DragControls } from 'framer-motion';
import { createContext, useContext, useEffect, useRef, type PointerEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { sheetSpring, spring } from '../lib/motion';
import s from './Sheet.module.css';

const DragCtx = createContext<DragControls | null>(null);

interface Props {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
}

/**
 * 아래에서 올라오는 바텀 시트. 상단 그래버·헤더를 아래로 끌면 닫힌다.
 * 끄는 영역을 헤더로 한정해야 안쪽 스크롤·휠 피커와 부딪히지 않는다.
 */
export function Sheet({ open, onClose, label, children }: Props) {
  return createPortal(
    <AnimatePresence>{open && <SheetPanel key="sheet" onClose={onClose} label={label}>{children}</SheetPanel>}</AnimatePresence>,
    document.body,
  );
}

function SheetPanel({ onClose, label, children }: Omit<Props, 'open'>) {
  const controls = useDragControls();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    panelRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      prev?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <>
      <motion.div className={s.backdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={spring} onClick={onClose} />
      <motion.div
        ref={panelRef}
        className={s.panel}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={sheetSpring}
        drag="y"
        dragControls={controls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.04, bottom: 1 }}
        dragTransition={{ bounceStiffness: 400, bounceDamping: 35 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 120 || info.velocity.y > 600) onClose();
        }}
      >
        <DragCtx.Provider value={controls}>
          <div className={s.grabZone} onPointerDown={(e) => controls.start(e)}>
            <div className={s.grabber} />
          </div>
          {children}
        </DragCtx.Provider>
      </motion.div>
    </>
  );
}

/** 시트 상단 바: 왼쪽 버튼 · 가운데 제목 · 오른쪽 버튼. 여기를 끌어도 시트가 닫힌다 */
export function SheetHeader({ title, left, right }: { title: ReactNode; left?: ReactNode; right?: ReactNode }) {
  const controls = useContext(DragCtx);
  const onPointerDown = (e: PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return; // 버튼 누르기는 끌기로 보지 않는다
    controls?.start(e);
  };
  return (
    <div className={s.header} onPointerDown={onPointerDown}>
      <div className={s.headerSide}>{left}</div>
      <h2 className={s.headerTitle}>{title}</h2>
      <div className={`${s.headerSide} ${s.headerRight}`}>{right}</div>
    </div>
  );
}

/** 시트 안쪽 스크롤 영역 */
export function SheetBody({ children }: { children: ReactNode }) {
  return <div className={s.body}>{children}</div>;
}

/** 시트 헤더용 글자 버튼 */
export function SheetButton({ children, onClick, bold, disabled }: { children: ReactNode; onClick: () => void; bold?: boolean; disabled?: boolean }) {
  return (
    <motion.button
      type="button"
      className={`${s.textButton} ${bold ? s.bold : ''}`}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ opacity: 0.4 }}
      transition={spring}
    >
      {children}
    </motion.button>
  );
}
