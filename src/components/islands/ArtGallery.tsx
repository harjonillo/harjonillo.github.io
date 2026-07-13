import { useRef, useState } from 'react';

export type ArtPiece = {
  title: string;
  medium: 'ink' | 'watercolor' | 'acrylic' | 'oil';
  year?: number;
  image?: string;
};

const FILTERS = ['all', 'ink', 'watercolor', 'acrylic', 'oil'] as const;
type Filter = (typeof FILTERS)[number];

// Stand-in swatches until real scans land (see brief §10, step 6).
const FALLBACK: Record<ArtPiece['medium'], string> = {
  ink: '#364958',
  watercolor: '#55828B',
  acrylic: '#473D3D',
  oil: '#5E504F',
};

export default function ArtGallery({ pieces }: { pieces: ArtPiece[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [active, setActive] = useState<ArtPiece | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = (piece: ArtPiece) => {
    setActive(piece);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  const shown = pieces.filter((p) => filter === 'all' || p.medium === filter);

  return (
    <>
      <div className="art-filters" role="group" aria-label="Filter by medium">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={filter === f ? 'on' : ''}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="art-grid">
        {shown.map((piece) => (
          <button
            key={`${piece.medium}-${piece.title}`}
            className="art-item"
            style={{
              backgroundColor: FALLBACK[piece.medium],
              backgroundImage: piece.image ? `url(${piece.image})` : undefined,
            }}
            onClick={() => open(piece)}
          >
            {piece.medium} · {piece.title}
          </button>
        ))}
      </div>

      {/* Native <dialog>: Esc closes and focus is trapped by the browser. */}
      <dialog
        ref={dialogRef}
        className="lightbox"
        onClose={() => setActive(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
      >
        {active && (
          <figure>
            {active.image ? (
              <img src={active.image} alt={active.title} />
            ) : (
              <div className="lightbox-swatch" style={{ background: FALLBACK[active.medium] }} />
            )}
            <figcaption>
              <span className="meta">
                {active.medium}
                {active.year ? ` · ${active.year}` : ''}
              </span>
              <p>{active.title}</p>
            </figcaption>
          </figure>
        )}
        <button className="lightbox-close" onClick={close} aria-label="Close">
          ×
        </button>
      </dialog>
    </>
  );
}
