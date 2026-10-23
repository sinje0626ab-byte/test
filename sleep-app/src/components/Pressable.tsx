import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';
import { pressSpring, tapFeedback } from '../lib/motion';

/** 누르는 순간 scale 0.97 + 투명도로 눌림 피드백을 주는 버튼 */
export const Pressable = forwardRef<HTMLButtonElement, HTMLMotionProps<'button'>>(function Pressable(
  { whileTap, transition, type = 'button', ...rest },
  ref,
) {
  return <motion.button ref={ref} type={type} whileTap={whileTap ?? tapFeedback} transition={transition ?? pressSpring} {...rest} />;
});
