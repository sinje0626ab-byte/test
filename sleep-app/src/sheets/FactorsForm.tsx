import { useState } from 'react';
import { Button } from '../components/Button';
import { Chips, Switch, type Option } from '../components/controls';
import { Cell, Group } from '../components/Group';
import { PickerRow, TimeWheel } from '../components/pickers';
import { SheetBody } from '../components/Sheet';
import type { Alcohol, ClockTime, DailyFactors, DateKey } from '../types';
import s from './forms.module.css';

const DRANK: Option<boolean>[] = [
  { value: false, label: '안 마심' },
  { value: true, label: '마심' },
];
const ALCOHOL: Option<Alcohol>[] = [
  { value: 'none', label: '안 마심' },
  { value: 'some', label: '조금' },
  { value: 'heavy', label: '많이' },
];
// 분 단위로 저장하되 고르기는 구간으로. 비교 기준(30분)을 가르도록 값을 정했다
const MINUTE_BUCKETS = [0, 20, 45, 90];
const EXERCISE: Option<number>[] = [
  { value: 0, label: '안 함' },
  { value: 20, label: '~30분' },
  { value: 45, label: '~1시간' },
  { value: 90, label: '1시간+' },
];
const NAP: Option<number>[] = [
  { value: 0, label: '안 잠' },
  { value: 20, label: '~30분' },
  { value: 45, label: '~1시간' },
  { value: 90, label: '1시간+' },
];
const STRESS = ([1, 2, 3, 4, 5] as const).map((v) => ({ value: v, label: String(v) }));

/** 불러온 값이 구간 값과 다르면 가장 가까운 칩에 표시 */
const toBucket = (m: number | undefined) =>
  m === undefined ? undefined : MINUTE_BUCKETS.reduce((best, b) => (Math.abs(b - m) < Math.abs(best - m) ? b : best), MINUTE_BUCKETS[0]);

interface Props {
  date: DateKey;
  initial?: DailyFactors;
  onSave: (f: DailyFactors) => void;
}

/** 전날 생활 요인. 전부 선택 입력 — 칩을 다시 누르면 비울 수 있다 */
export function FactorsForm({ date, initial, onSave }: Props) {
  const [caffeine, setCaffeine] = useState<ClockTime | null | undefined>(initial?.caffeineLastTime);
  const [lastCup, setLastCup] = useState<ClockTime>(initial?.caffeineLastTime ?? '13:00');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [alcohol, setAlcohol] = useState(initial?.alcohol);
  const [exercise, setExercise] = useState(toBucket(initial?.exerciseMinutes));
  const [nap, setNap] = useState(toBucket(initial?.napMinutes));
  const [screen, setScreen] = useState(initial?.screenBeforeBed ?? false);
  const [stress, setStress] = useState(initial?.stress);

  const save = () => {
    const f: DailyFactors = { date, screenBeforeBed: screen };
    if (caffeine !== undefined) f.caffeineLastTime = caffeine === null ? null : lastCup;
    if (alcohol) f.alcohol = alcohol;
    // 구간을 바꾸지 않았으면 원래 분 값을 그대로 둔다
    if (exercise !== undefined) f.exerciseMinutes = exercise === toBucket(initial?.exerciseMinutes) ? initial!.exerciseMinutes : exercise;
    if (nap !== undefined) f.napMinutes = nap === toBucket(initial?.napMinutes) ? initial!.napMinutes : nap;
    if (stress) f.stress = stress;
    onSave(f);
  };

  return (
    <SheetBody>
      <p className={s.lead}>전날 하루가 수면과 어떻게 이어지는지 보려고 모아요. 모르는 항목은 비워 두세요.</p>

      <div className={s.field}>
        <h3 className={s.fieldLabel}>카페인</h3>
        <Chips
          label="카페인"
          options={DRANK}
          value={caffeine === undefined ? undefined : caffeine !== null}
          allowDeselect
          onChange={(v) => {
            setCaffeine(v === undefined ? undefined : v ? lastCup : null);
            setPickerOpen(!!v);
          }}
        />
        {typeof caffeine === 'string' && (
          <div className={s.groupTight}>
            <Group>
              <PickerRow label="마지막으로 마신 시각" display={lastCup} open={pickerOpen} onToggle={() => setPickerOpen((o) => !o)}>
                <TimeWheel
                  value={lastCup}
                  label="마지막으로 마신 시각"
                  onChange={(v) => {
                    setLastCup(v);
                    setCaffeine(v);
                  }}
                />
              </PickerRow>
            </Group>
          </div>
        )}
      </div>

      <div className={s.field}>
        <h3 className={s.fieldLabel}>술</h3>
        <Chips label="술" options={ALCOHOL} value={alcohol} onChange={setAlcohol} allowDeselect />
      </div>

      <div className={s.field}>
        <h3 className={s.fieldLabel}>운동</h3>
        <Chips label="운동" options={EXERCISE} value={exercise} onChange={setExercise} allowDeselect />
      </div>

      <div className={s.field}>
        <h3 className={s.fieldLabel}>낮잠</h3>
        <Chips label="낮잠" options={NAP} value={nap} onChange={setNap} allowDeselect />
      </div>

      <div className={s.field}>
        <h3 className={s.fieldLabel}>스트레스</h3>
        <Chips label="스트레스" options={STRESS} value={stress} onChange={setStress} allowDeselect />
        <p className={s.scale}>
          <span>1 낮음</span>
          <span>5 높음</span>
        </p>
      </div>

      <Group>
        <Cell title="자기 전 30분 동안 폰 사용" value={<Switch checked={screen} onChange={setScreen} label="자기 전 30분 동안 폰 사용" />} />
      </Group>

      <Button block onClick={save}>
        저장
      </Button>
    </SheetBody>
  );
}
