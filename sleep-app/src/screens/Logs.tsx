import { animate, AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { List, Plus } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Button } from '../components/Button';
import { EmptyState } from '../components/Card';
import { Group } from '../components/Group';
import { Page } from '../components/Page';
import { Pressable } from '../components/Pressable';
import { QualityDots } from '../components/QualityDots';
import { useUI } from '../components/ui';
import { fmtDateLong, fmtDayOfMonth, fmtMonth } from '../lib/format';
import { spring, valueSpring } from '../lib/motion';
import { clockOf, formatDuration, sleepMin } from '../lib/sleepCalc';
import type { LogSheetInit } from '../sheets/LogSheet';
import { useStore } from '../store/store';
import type { SleepLog } from '../types';
import s from './Logs.module.css';

const DELETE_W = 88;

export function Logs({ openSheet }: { openSheet: (i: LogSheetInit) => void }) {
  const { logs, deleteLog } = useStore();
  const ui = useUI();
  const [openId, setOpenId] = useState<string | null>(null);

  // 날짜 역순, 월별 섹션
  const months = useMemo(() => {
    const out: { key: string; logs: SleepLog[] }[] = [];
    for (const l of logs) {
      const key = l.date.slice(0, 7);
      if (out.at(-1)?.key !== key) out.push({ key, logs: [] });
      out.at(-1)!.logs.push(l);
    }
    return out;
  }, [logs]);

  const remove = async (l: SleepLog) => {
    const ok = await ui.confirm({ title: `${fmtDateLong(l.date)} 기록을 삭제할까요?`, message: '이 날의 생활 요인도 함께 삭제돼요.', confirmLabel: '기록 삭제', destructive: true });
    setOpenId(null);
    if (ok) deleteLog(l.id);
  };

  return (
    <Page
      title="기록"
      right={
        <Pressable className={s.addButton} onClick={() => openSheet({ mode: 'manual' })} aria-label="기록 추가">
          <Plus size={26} strokeWidth={2} />
        </Pressable>
      }
    >
      {logs.length === 0 ? (
        <EmptyState
          icon={<List size={28} strokeWidth={1.75} />}
          title="기록이 비어 있어요"
          message="홈에서 '잘게요'와 '일어났어요'를 누르면 여기에 쌓여요."
          action={
            <Button variant="tinted" onClick={() => openSheet({ mode: 'manual' })}>
              직접 입력
            </Button>
          }
        />
      ) : (
        months.map((m) => (
          <Group key={m.key} header={fmtMonth(`${m.key}-01`)}>
            <AnimatePresence initial={false}>
              {m.logs.map((l) => (
                <motion.div key={l.id} exit={{ height: 0, opacity: 0 }} transition={spring} style={{ overflow: 'hidden' }}>
                  <SwipeRow
                    open={openId === l.id}
                    onOpenChange={(o) => setOpenId(o ? l.id : null)}
                    onPress={() => (openId ? setOpenId(null) : openSheet({ mode: 'edit', log: l }))}
                    onDelete={() => remove(l)}
                    label={fmtDateLong(l.date)}
                  >
                    <span className={s.left}>
                      <span className={s.date}>{fmtDayOfMonth(l.date)}</span>
                      <span className={s.range}>
                        {clockOf(l.bedTime)} – {clockOf(l.wakeTime)}
                      </span>
                    </span>
                    <span className={s.right}>
                      <span className={s.duration}>{formatDuration(sleepMin(l))}</span>
                      <QualityDots value={l.quality} />
                    </span>
                  </SwipeRow>
                </motion.div>
              ))}
            </AnimatePresence>
          </Group>
        ))
      )}
    </Page>
  );
}

/** 왼쪽으로 밀면 뒤에서 삭제 버튼이 나오는 셀 (iOS 스와이프 삭제) */
function SwipeRow({
  open,
  onOpenChange,
  onPress,
  onDelete,
  label,
  children,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onPress: () => void;
  onDelete: () => void;
  label: string;
  children: ReactNode;
}) {
  const x = useMotionValue(0);
  const dragged = useRef(false);
  // 닫혀 있을 때는 삭제 버튼을 감춘다 (둥근 모서리 틈으로 빨간색이 비치지 않게)
  const deleteOpacity = useTransform(x, (v) => (v < -0.5 ? 1 : 0));

  useEffect(() => {
    const c = animate(x, open ? -DELETE_W : 0, valueSpring);
    return () => c.stop();
  }, [open, x]);

  return (
    <div className={s.swipe}>
      <motion.button type="button" className={s.delete} style={{ width: DELETE_W, opacity: deleteOpacity }} onClick={onDelete} tabIndex={open ? 0 : -1} aria-label={`${label} 삭제`}>
        삭제
      </motion.button>
      <motion.div
        className={s.front}
        style={{ x }}
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: -DELETE_W, right: 0 }}
        dragElastic={{ left: 0.25, right: 0.05 }}
        dragMomentum={false}
        onDragStart={() => {
          dragged.current = true;
        }}
        onDragEnd={(_, info) => {
          const shouldOpen = info.velocity.x < -300 || (info.velocity.x <= 300 && x.get() < -DELETE_W / 2);
          onOpenChange(shouldOpen);
          // 상태가 그대로면 effect 가 안 돌아서 직접 제자리로 보낸다
          animate(x, shouldOpen ? -DELETE_W : 0, valueSpring);
        }}
      >
        <button
          type="button"
          className={s.row}
          aria-label={`${label} 수정`}
          onClick={() => {
            if (dragged.current) {
              dragged.current = false;
              return;
            }
            onPress();
          }}
          onPointerDown={() => {
            dragged.current = false;
          }}
        >
          {children}
        </button>
      </motion.div>
    </div>
  );
}
