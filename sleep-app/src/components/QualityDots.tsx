import s from './QualityDots.module.css';

/** 개운함 1~5 를 점 다섯 개로 */
export function QualityDots({ value }: { value: number }) {
  return (
    <span className={s.dots} role="img" aria-label={`개운함 ${value}점`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`${s.dot} ${i <= value ? s.on : ''}`} />
      ))}
    </span>
  );
}
