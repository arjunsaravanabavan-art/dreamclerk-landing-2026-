/**
 * SectionLabel — small terminal-eyebrow above a section heading.
 * Used by all sections that need a $ command-style label.
 */
export default function SectionLabel({ status = "ok", children, ...rest }) {
  return (
    <div className="section-label" data-status={status} {...rest}>
      <span className={"dot dot--" + status} aria-hidden="true" />
      <span className="section-label__text">{children}</span>
    </div>
  );
}
