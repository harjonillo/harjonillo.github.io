/**
 * Optical Bench Simulator embed. The simulator lives in its own repo; iframe to
 * its deployed URL is the low-coupling default (brief §7). Until that URL
 * exists, render the placeholder ray diagram from the mockup.
 */
type Props = { src?: string };

export default function OpticalBench({ src }: Props) {
  if (src) {
    return <iframe className="bench-frame" src={src} title="Optical Bench Simulator" loading="lazy" />;
  }

  return (
    <div className="demo-box">
      <svg viewBox="0 0 200 150" role="img" aria-label="Rays converging through a lens">
        <line x1="10" y1="45" x2="95" y2="45" stroke="#FCF6EE" strokeWidth="2" opacity="0.85" />
        <line x1="10" y1="75" x2="95" y2="75" stroke="#FCF6EE" strokeWidth="2" opacity="0.85" />
        <line x1="10" y1="105" x2="95" y2="105" stroke="#FCF6EE" strokeWidth="2" opacity="0.85" />
        <ellipse cx="100" cy="75" rx="10" ry="45" fill="rgba(85,130,139,0.45)" stroke="#8FB3BB" strokeWidth="2" />
        <line x1="105" y1="45" x2="175" y2="75" stroke="#FCF6EE" strokeWidth="2" opacity="0.85" />
        <line x1="105" y1="75" x2="175" y2="75" stroke="#FCF6EE" strokeWidth="2" opacity="0.85" />
        <line x1="105" y1="105" x2="175" y2="75" stroke="#FCF6EE" strokeWidth="2" opacity="0.85" />
        <circle cx="175" cy="75" r="4" fill="#FCF6EE" />
      </svg>
      <span className="demo-label">[ SIMULATOR EMBED — PENDING DEPLOYED URL ]</span>
    </div>
  );
}
