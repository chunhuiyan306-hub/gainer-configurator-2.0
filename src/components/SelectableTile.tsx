import type { CSSProperties, ReactNode } from 'react';
import { useConfiguratorStore } from '../useConfiguratorStore';
import { msg } from '../translations';

type SelectableTileProps = {
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
  style?: CSSProperties;
};

/**
 * Opacity 0.5 + no activation when disabled.
 * Uses a div (not button[disabled]) so `title` tooltip still shows on hover.
 */
export function SelectableTile({
  selected,
  disabled,
  onClick,
  children,
  style,
}: SelectableTileProps) {
  const uiLocale = useConfiguratorStore((s) => s.uiLocale);
  const disabledTitle = msg(uiLocale).disabledMismatch;

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-pressed={selected}
      title={disabled ? disabledTitle : undefined}
      onClick={() => {
        if (!disabled) onClick();
      }}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        textAlign: 'left',
        padding: 0,
        margin: 0,
        border: selected ? '2px solid var(--accent)' : '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--surface)',
        boxShadow: selected ? '0 4px 20px rgba(0, 113, 227, 0.12)' : 'var(--shadow)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease',
        overflow: 'hidden',
        WebkitTapHighlightColor: 'transparent',
        outline: 'none',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
