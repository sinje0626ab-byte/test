import type { Transition } from 'framer-motion';

// 모든 움직임은 스프링으로만. 선형/이징 애니메이션은 쓰지 않는다.

/** 기본: 빠르고 튀지 않는 스프링 */
export const spring: Transition = { type: 'spring', stiffness: 400, damping: 35 };
/** 시트·화면 이동처럼 큰 물체 */
export const sheetSpring: Transition = { type: 'spring', stiffness: 380, damping: 38, mass: 0.9 };
/** 눌림 피드백 */
export const pressSpring: Transition = { type: 'spring', stiffness: 700, damping: 40 };
/** 확인 체크처럼 살짝 튀는 것 */
export const popSpring: Transition = { type: 'spring', stiffness: 520, damping: 22 };

/** 누르는 순간 눌림 피드백 */
export const tapFeedback = { scale: 0.97, opacity: 0.7 };

/** animate(motionValue, …) 에 바로 넘기는 기본 스프링 */
export const valueSpring = { type: 'spring', stiffness: 400, damping: 35 } as const;
