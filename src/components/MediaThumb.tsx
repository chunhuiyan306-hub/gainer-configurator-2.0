import { PlaceholderImage } from './PlaceholderImage';
import type { CSSProperties } from 'react';

const DISABLED_TOOLTIP = '与当前门框参数不匹配';

export function MediaThumb({
  picture,
  alt,
  disabled,
  style,
}: {
  picture: string | null;
  alt: string;
  disabled?: boolean;
  style?: CSSProperties;
}) {
  const wrap: CSSProperties = {
    width: '100%',
    aspectRatio: '4 / 3',
    borderRadius: 12,
    overflow: 'hidden',
    flexShrink: 0,
    ...style,
  };

  if (picture) {
    return (
      <div style={wrap}>
        <img
          src={picture}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: disabled ? 0.5 : 1,
          }}
          title={disabled ? DISABLED_TOOLTIP : undefined}
        />
      </div>
    );
  }

  return (
    <div style={wrap} title={disabled ? DISABLED_TOOLTIP : undefined}>
      <PlaceholderImage style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
