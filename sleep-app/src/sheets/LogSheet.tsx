import { useRef } from 'react';
import { Cell, Group } from '../components/Group';
import { Sheet, SheetBody, SheetButton, SheetHeader } from '../components/Sheet';
import { useUI } from '../components/ui';
import { fmtDateLong } from '../lib/format';
import { useStore } from '../store/store';
import type { SleepLog } from '../types';
import { defaultStart, SleepFields, startFromLog, useSaveEntry, useSleepEntry } from './entry';

/** 열려 있는 시트: 새 기록이면 log 없이, 수정이면 그 기록 */
export type LogSheetTarget = { log?: SleepLog };

/** 기록 추가·수정 바텀 시트. target 이 null 이면 닫힌다 */
export function LogSheet({ target, onClose }: { target: LogSheetTarget | null; onClose: () => void }) {
  // 닫히는 애니메이션 동안에도 내용이 남아 있도록 마지막 값을 기억한다
  const last = useRef(target);
  const seq = useRef(0);
  if (target && target !== last.current) seq.current += 1;
  if (target) last.current = target;
  const shown = last.current;
  return (
    <Sheet open={!!target} onClose={onClose} label={shown?.log ? '기록 수정' : '기록 추가'}>
      {shown && <EntryForm key={seq.current} log={shown.log} onClose={onClose} />}
    </Sheet>
  );
}

function EntryForm({ log, onClose }: { log?: SleepLog; onClose: () => void }) {
  const store = useStore();
  const ui = useUI();
  const start = useRef(log ? startFromLog(log) : defaultStart(store.settings)).current;
  const entry = useSleepEntry(start, log);
  const saveEntry = useSaveEntry();

  const save = async () => {
    if (await saveEntry(entry, log)) onClose();
  };

  const remove = async () => {
    if (!log) return;
    const ok = await ui.confirm({ title: `${fmtDateLong(log.date)} 기록을 삭제할까요?`, confirmLabel: '기록 삭제', destructive: true });
    if (!ok) return;
    await store.deleteLog(log.id);
    onClose();
  };

  return (
    <>
      <SheetHeader
        title={log ? '기록 수정' : '기록 추가'}
        left={<SheetButton onClick={onClose}>취소</SheetButton>}
        right={
          <SheetButton bold onClick={save}>
            저장
          </SheetButton>
        }
      />
      <SheetBody>
        <SleepFields entry={entry} />
        {log && (
          <Group>
            <Cell title="기록 삭제" destructive onPress={remove} />
          </Group>
        )}
      </SheetBody>
    </>
  );
}
