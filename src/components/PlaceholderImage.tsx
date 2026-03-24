import type { CSSProperties } from 'react';

const iconStyle: CSSProperties = {
  width: '40%',
  height: '40%',
  maxWidth: 48,
  maxHeight: 48,
  opacity: 0.35,
};

/**
 * Gray placeholder when `picture` is null — Apple-style minimal image icon.
 */
export function PlaceholderImage({
  className,
  style,
  label = '无预览',
}: {
  className?: string;
  style?: CSSProperties;
  label?: string;
}) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #e8e8ed 0%, #d2d2d7 100%)',
        borderRadius: 'inherit',
        ...style,
      }}
      role="img"
      aria-label={label}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8e8e93"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={iconStyle}
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8.5" cy="10" r="1.5" fill="#8e8e93" stroke="none" />
        <path d="M21 15l-5-5-4 4-2-2-3 3" />
      </svg>
    </div>
  );
}
