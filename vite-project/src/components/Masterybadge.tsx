import type { MasteryLevel } from '../types/quiz';
import styles from './MasteryBadge.module.css';

interface MasteryBadgeProps {
  level: MasteryLevel;
  /** Show the label text next to the dot */
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const LABELS: Record<MasteryLevel, string> = {
  red: 'Not Mastered',
  yellow: 'Developing',
  green: 'Mastered',
};

const ICONS: Record<MasteryLevel, string> = {
  red: '✕',
  yellow: '◑',
  green: '✓',
};

export function MasteryBadge({ level, showLabel = false, size = 'md' }: MasteryBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[level]} ${styles[size]}`} title={LABELS[level]}>
      <span className={styles.icon}>{ICONS[level]}</span>
      {showLabel && <span className={styles.label}>{LABELS[level]}</span>}
    </span>
  );
}