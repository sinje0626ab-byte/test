import type { HTMLMotionProps } from 'framer-motion';
import { Pressable } from './Pressable';
import s from './Button.module.css';

interface Props extends HTMLMotionProps<'button'> {
  variant?: 'filled' | 'tinted' | 'gray' | 'plain';
  block?: boolean;
}

export function Button({ variant = 'filled', block, className, ...rest }: Props) {
  return <Pressable className={[s.button, s[variant], block && s.block, className].filter(Boolean).join(' ')} {...rest} />;
}
