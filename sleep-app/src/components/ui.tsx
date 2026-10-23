import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { popSpring, sheetSpring, spring } from '../lib/motion';
import s from './ui.module.css';

// 앱 어디서나 띄우는 겹침 UI: 되돌리기 토스트, 확인 액션시트, 저장 완료 체크

interface ToastOptions {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

export interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmLabel: string;
  destructive?: boolean;
  cancelLabel?: string;
}

interface UI {
  toast(o: ToastOptions): void;
  confirm(o: ConfirmOptions): Promise<boolean>;
  check(label?: string): void;
}

const Ctx = createContext<UI | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<(ToastOptions & { id: number }) | null>(null);
  const [confirmState, setConfirmState] = useState<{ o: ConfirmOptions; resolve: (v: boolean) => void } | null>(null);
  const [checkState, setCheckState] = useState<{ id: number; label: string } | null>(null);
  const seq = useRef(0);

  const ui = useMemo<UI>(
    () => ({
      toast: (o) => setToast({ ...o, id: ++seq.current }),
      confirm: (o) => new Promise<boolean>((resolve) => setConfirmState({ o, resolve })),
      check: (label = '저장했어요') => setCheckState({ id: ++seq.current, label }),
    }),
    [],
  );

  // 토스트 자동 닫기
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast((cur) => (cur?.id === toast.id ? null : cur)), toast.duration ?? 3000);
    return () => window.clearTimeout(t);
  }, [toast]);

  // 체크는 짧게 튀어나왔다 사라진다
  useEffect(() => {
    if (!checkState) return;
    const t = window.setTimeout(() => setCheckState((cur) => (cur?.id === checkState.id ? null : cur)), 900);
    return () => window.clearTimeout(t);
  }, [checkState]);

  const answer = useCallback(
    (v: boolean) => {
      confirmState?.resolve(v);
      setConfirmState(null);
    },
    [confirmState],
  );

  return (
    <Ctx.Provider value={ui}>
      {children}
      {createPortal(
        <>
          <AnimatePresence>
            {toast && (
              <motion.div
                key={toast.id}
                className={s.toast}
                role="status"
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={spring}
              >
                <span className={s.toastText}>{toast.message}</span>
                {toast.actionLabel && (
                  <motion.button
                    type="button"
                    className={s.toastAction}
                    whileTap={{ opacity: 0.5 }}
                    onClick={() => {
                      toast.onAction?.();
                      setToast(null);
                    }}
                  >
                    {toast.actionLabel}
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {checkState && (
              <motion.div
                key={checkState.id}
                className={s.hud}
                role="status"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={popSpring}
              >
                <motion.span initial={{ scale: 0.2, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ ...popSpring, delay: 0.05 }}>
                  <Check size={54} strokeWidth={2.5} />
                </motion.span>
                <span className={s.hudLabel}>{checkState.label}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <ActionSheet state={confirmState?.o ?? null} onAnswer={answer} />
        </>,
        document.body,
      )}
    </Ctx.Provider>
  );
}

/** 아래에서 올라오는 확인용 액션시트 (삭제·덮어쓰기 같은 위험 작업) */
function ActionSheet({ state, onAnswer }: { state: ConfirmOptions | null; onAnswer: (v: boolean) => void }) {
  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onAnswer(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state, onAnswer]);

  return (
    <AnimatePresence>
      {state && (
        <>
          <motion.div key="bd" className={s.backdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={spring} onClick={() => onAnswer(false)} />
          <motion.div
            key="as"
            className={s.actionSheet}
            role="alertdialog"
            aria-modal="true"
            aria-label={state.title ?? state.confirmLabel}
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            exit={{ y: '110%' }}
            transition={sheetSpring}
          >
            <div className={s.asGroup}>
              {(state.title || state.message) && (
                <div className={s.asHead}>
                  {state.title && <p className={s.asTitle}>{state.title}</p>}
                  {state.message && <p className={s.asMessage}>{state.message}</p>}
                </div>
              )}
              <button type="button" className={`${s.asButton} ${state.destructive ? s.asDestructive : ''}`} onClick={() => onAnswer(true)} autoFocus>
                {state.confirmLabel}
              </button>
            </div>
            <div className={`${s.asGroup} ${s.asCancelGroup}`}>
              <button type="button" className={`${s.asButton} ${s.asCancel}`} onClick={() => onAnswer(false)}>
                {state.cancelLabel ?? '취소'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function useUI(): UI {
  const ui = useContext(Ctx);
  if (!ui) throw new Error('UIProvider 밖에서 useUI 를 썼어요');
  return ui;
}
