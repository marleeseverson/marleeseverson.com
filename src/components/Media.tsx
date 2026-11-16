import type { MediaItem } from '@/data/projects';
import { imageSource } from '@/lib/media';
import s from './Media.module.css';

interface PictureProps {
  id: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/** Responsive image from the media manifest. Renders a labelled fallback if the asset is missing. */
export function Picture({ id, alt, sizes, priority, className }: PictureProps) {
  const src = imageSource(id);
  if (!src) return <Missing label={id} />;
  return (
    <img
      className={className}
      src={src.src}
      srcSet={src.srcSet}
      sizes={sizes}
      width={src.width}
      height={src.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
    />
  );
}

function Missing({ label }: { label: string }) {
  return (
    <div className={s.missing} role="img" aria-label={`Media not yet available: ${label}`}>
      <span className="mono">media pending</span>
      <span className={`mono ${s.missingPath}`}>{label}</span>
    </div>
  );
}

interface FigureProps {
  item: MediaItem;
  figure: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}

/** One media item (image, GIF or video) in a ruled frame with a figure caption. */
export function MediaFigure({ item, figure, sizes, priority, className, imgClassName }: FigureProps) {
  return (
    <figure className={`${s.figure} ${className ?? ''}`}>
      <div className={`${s.frame} themed`}>
        {item.kind === 'image' && (
          <Picture id={item.id} alt={item.alt} sizes={sizes} priority={priority} className={imgClassName} />
        )}
        {item.kind === 'gif' && (
          <img className={imgClassName} src={item.src} alt={item.alt} loading="lazy" decoding="async" />
        )}
        {item.kind === 'video' && (
          <video
            className={imgClassName}
            src={item.src}
            poster={item.poster}
            controls
            playsInline
            muted
            loop
            preload="metadata"
            aria-label={item.alt}
          />
        )}
        <span className={s.corner} data-corner="tl" aria-hidden="true" />
        <span className={s.corner} data-corner="tr" aria-hidden="true" />
        <span className={s.corner} data-corner="bl" aria-hidden="true" />
        <span className={s.corner} data-corner="br" aria-hidden="true" />
      </div>
      {item.caption && (
        <figcaption className={`mono ${s.caption}`}>
          <span className={s.figureNo}>Fig. {figure}</span> {item.caption}
        </figcaption>
      )}
    </figure>
  );
}

interface GalleryProps {
  items: MediaItem[];
  /** Figure number prefix, e.g. "01" → Fig. 01.2, 01.3 … */
  prefix: string;
  startAt?: number;
}

/** Grid of extra media for a project. Renders nothing while a project has no extra media. */
export function MediaGallery({ items, prefix, startAt = 2 }: GalleryProps) {
  if (items.length === 0) return null;
  return (
    <div className={s.gallery} data-count={Math.min(items.length, 3)}>
      {items.map((item, i) => (
        <MediaFigure
          key={i}
          item={item}
          figure={`${prefix}.${startAt + i}`}
          sizes="(min-width: 900px) 46vw, 92vw"
          className={s.galleryItem}
        />
      ))}
    </div>
  );
}
