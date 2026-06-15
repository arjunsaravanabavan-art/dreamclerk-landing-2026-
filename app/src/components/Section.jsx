/**
 * Section — common scaffold for a band of the page.
 * Renders a vertical lane with optional eyebrow / title / lede, then children.
 * Strict no-overlap: each section reserves its own padding-block and border-top.
 *
 * Props:
 *  - id        (optional) anchor
 *  - kind      "default" | "dark" | "flush-into-dark"
 *  - command   (optional) mono $ command rendered as the eyebrow (e.g. "$ how --steps")
 *  - label     (optional) plain uppercase eyebrow (e.g. "the protocol")
 *  - title     (optional) h2 title
 *  - lede      (optional) supporting paragraph
 *  - children  section body
 *  - className (optional) extra classes
 */
export default function Section({
  id,
  kind = "default",
  command,
  label,
  title,
  lede,
  children,
  className = "",
}) {
  const cls = [
    "section",
    kind === "dark" ? "section--dark" : "",
    kind === "flush-into-dark" ? "section--dark section--flush-into-dark" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const hasHead = command || label || title || lede;
  return (
    <section id={id} className={cls}>
      <div className="wrap">
        {hasHead && (
          <header className="section-head">
            <div className="section-head__label">
              {command && <span className="cmd">$ {command}</span>}
              {label && <span>{label}</span>}
            </div>
            <div className="section-head__body">
              {title && <h2 className="section-head__title">{title}</h2>}
              {lede && <p className="section-head__lede">{lede}</p>}
            </div>
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
