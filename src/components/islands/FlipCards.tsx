import { useState } from 'react';

export type CardDef = { question: string; items: string[] };

/** Pick a random item, avoiding an immediate repeat. */
function pick(items: string[], current: string | null): string {
  if (items.length === 0) return '—';
  if (items.length === 1) return items[0];
  let next = current;
  while (next === current) next = items[Math.floor(Math.random() * items.length)];
  return next as string;
}

function FlipCard({ question, items }: CardDef) {
  const [flipped, setFlipped] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);

  const onClick = () => {
    if (!flipped) setAnswer((current) => pick(items, current));
    setFlipped((f) => !f);
  };

  return (
    <button
      className={`flip-card${flipped ? ' flipped' : ''}`}
      onClick={onClick}
      aria-pressed={flipped}
    >
      <span className="flip-inner">
        <span className="flip-face flip-front" aria-hidden={flipped}>
          <span className="flip-q">{question}</span>
          <span className="meta">tap to ask</span>
        </span>
        <span className="flip-face flip-back" aria-hidden={!flipped} aria-live="polite">
          <span className="flip-a">{flipped ? answer : ''}</span>
          <span className="meta">tap to ask again</span>
        </span>
      </span>
    </button>
  );
}

export default function FlipCards({ cards }: { cards: CardDef[] }) {
  return (
    <div className="flip-grid">
      {cards.map((card) => (
        <FlipCard key={card.question} {...card} />
      ))}
    </div>
  );
}
