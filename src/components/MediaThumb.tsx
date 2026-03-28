import { PlaceholderImage } from './PlaceholderImage';
import type { CSSProperties } from 'react';
import { useConfiguratorStore } from '../useConfiguratorStore';
import { msg } from '../translations';

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
  const uiLocale = useConfiguratorStore((s) => s.uiLocale);
  const disabledTitle = msg(uiLocale).disabledMismatch;

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
          title={disabled ? disabledTitle : undefined}
        />
      </div>
    );
  }

  return (
    <div style={wrap} title={disabled ? disabledTitle : undefined}>
      <PlaceholderImage style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

/** Up to three door photos (e.g. aluminum frame C–E columns). Falls back to single `picture`. */
export function FramePicturesStrip({
  pictures,
  fallbackPicture,
  alt,
  disabled,
}: {
  pictures: readonly string[];
  fallbackPicture: string | null;
  alt: string;
  disabled?: boolean;
}) {
  const uiLocale = useConfiguratorStore((s) => s.uiLocale);
  const disabledTitle = msg(uiLocale).disabledMismatch;

  const list = pictures.length > 0
    ? [...pictures]
    : fallbackPicture
      ? [fallbackPicture]
      : [];

  const wrap: CSSProperties = {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    flexShrink: 0,
    opacity: disabled ? 0.5 : 1,
  };

  if (list.length === 0) {
    return (
      <div style={wrap} title={disabled ? disabledTitle : undefined}>
        <div style={{ width: '100%', aspectRatio: '4 / 3' }}>
          <PlaceholderImage style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    );
  }

  if (list.length === 1) {
    return (
      <div style={wrap} title={disabled ? disabledTitle : undefined}>
        <div style={{ width: '100%', aspectRatio: '4 / 3' }}>
          <img
            src={list[0]}
            alt={alt}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        ...wrap,
        display: 'grid',
        gridTemplateColumns: `repeat(${list.length}, 1fr)`,
        gap: 3,
        aspectRatio: '4 / 3',
      }}
      title={disabled ? disabledTitle : undefined}
    >
      {list.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt={`${alt}-${i + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ))}
    </div>
  );
}
