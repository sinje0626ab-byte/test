import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Download, Info, Trash2, Upload } from 'lucide-react';
import { useRef, useState, type ChangeEvent } from 'react';
import { Cell, Group } from '../components/Group';
import { HoursWheel, PickerRow, TimeWheel } from '../components/pickers';
import { Page } from '../components/Page';
import { Pressable } from '../components/Pressable';
import { useUI } from '../components/ui';
import { sheetSpring } from '../lib/motion';
import { dateKeyOf, formatDuration } from '../lib/sleepCalc';
import { useStore } from '../store/store';
import s from './Settings.module.css';

type Picker = 'bed' | 'wake' | 'hours';

export function Settings() {
  const store = useStore();
  const ui = useUI();
  const { settings } = store;
  const [open, setOpen] = useState<Picker | null>(null);
  const [detail, setDetail] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const toggle = (p: Picker) => setOpen((cur) => (cur === p ? null : p));

  const exportJson = async () => {
    const data = await store.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jamgirok-${dateKeyOf(new Date())}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const importJson = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    let data: unknown;
    try {
      data = JSON.parse(await file.text());
    } catch {
      ui.toast({ message: 'JSON 파일을 읽을 수 없어요' });
      return;
    }
    const n = Array.isArray((data as { logs?: unknown[] })?.logs) ? (data as { logs: unknown[] }).logs.length : 0;
    const ok = await ui.confirm({
      title: `기록 ${n}개를 불러올까요?`,
      message: '지금 있는 기록과 설정은 파일 내용으로 바뀌어요.',
      confirmLabel: '불러오기',
      destructive: store.logs.length > 0,
    });
    if (!ok) return;
    try {
      await store.importAll(data);
      ui.check('불러왔어요');
    } catch (err) {
      ui.toast({ message: err instanceof Error ? err.message : '불러오지 못했어요' });
    }
  };

  const clearAll = async () => {
    const first = await ui.confirm({ title: '모든 기록을 삭제할까요?', message: `수면 기록 ${store.logs.length}개와 설정이 모두 지워져요.`, confirmLabel: '전체 삭제', destructive: true });
    if (!first) return;
    const second = await ui.confirm({ title: '정말 삭제할까요?', message: '되돌릴 수 없어요. 필요하면 먼저 내보내기를 해 두세요.', confirmLabel: '삭제하기', destructive: true });
    if (!second) return;
    await store.clearAll();
    ui.check('삭제했어요');
  };

  return (
    <div className={s.stack}>
      <motion.div className={s.layer} animate={{ x: detail ? '-30%' : 0 }} transition={sheetSpring} aria-hidden={detail}>
        <Page title="설정">
          <Group header="목표" footer="통계의 목표선과 수면 부채 계산에 쓰여요.">
            <PickerRow label="취침 시각" display={settings.targetBedTime} open={open === 'bed'} onToggle={() => toggle('bed')}>
              <TimeWheel label="목표 취침 시각" value={settings.targetBedTime} onChange={(v) => store.saveSettings({ ...settings, targetBedTime: v })} />
            </PickerRow>
            <PickerRow label="기상 시각" display={settings.targetWakeTime} open={open === 'wake'} onToggle={() => toggle('wake')}>
              <TimeWheel label="목표 기상 시각" value={settings.targetWakeTime} onChange={(v) => store.saveSettings({ ...settings, targetWakeTime: v })} />
            </PickerRow>
            <PickerRow label="수면시간" display={formatDuration(settings.targetSleepHours * 60)} open={open === 'hours'} onToggle={() => toggle('hours')}>
              <HoursWheel value={settings.targetSleepHours} onChange={(v) => store.saveSettings({ ...settings, targetSleepHours: v })} />
            </PickerRow>
          </Group>

          <Group header="데이터" footer="기록은 이 브라우저에만 저장돼요. 기기를 바꾸기 전에 내보내 두세요.">
            <Cell icon={<Download size={18} strokeWidth={2} />} title="내보내기" value="JSON" onPress={exportJson} />
            <Cell icon={<Upload size={18} strokeWidth={2} />} title="불러오기" onPress={() => fileRef.current?.click()} />
          </Group>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={importJson} />

          <Group>
            <Cell icon={<Trash2 size={18} strokeWidth={2} />} title="전체 삭제" destructive onPress={clearAll} />
          </Group>

          <Group>
            <Cell icon={<Info size={18} strokeWidth={2} />} title="잠기록에 대해" chevron onPress={() => setDetail(true)} />
          </Group>
        </Page>
      </motion.div>

      <AnimatePresence>
        {detail && (
          <motion.div key="about" className={`${s.layer} ${s.detail}`} initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={sheetSpring}>
            <Page
              title="잠기록에 대해"
              largeTitle="잠기록"
              left={
                <Pressable className={s.back} onClick={() => setDetail(false)} whileTap={{ opacity: 0.4 }}>
                  <ChevronLeft size={28} strokeWidth={2.25} />
                  설정
                </Pressable>
              }
            >
              <Group footer="버전 0.1 · 1단계">
                <div className={s.about}>
                  <p>언제 자고 언제 깼는지만 적고, 쌓인 기록으로 내 수면 패턴을 살펴보는 앱이에요.</p>
                  <p>보여 드리는 수치는 모두 본인 기록 기반 참고 지표예요. 건강 상태를 판단하는 용도가 아니에요.</p>
                  <p>기록은 서버로 보내지 않고 이 브라우저에만 저장돼요.</p>
                </div>
              </Group>
              <Group header="계산 방법">
                <Cell title="수면시간" subtitle="깬 시각 − 잔 시각" />
                <Cell title="수면 부채" subtitle="최근 7일 (목표 − 실제) 합계, 기록 없는 날 제외" />
              </Group>
            </Page>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
