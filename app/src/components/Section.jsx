export default function Section({ id, eyebrow, title, intro, children, className = "" }) {
  return (
    <section id={id} className={"sec " + className}>
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-eyebrow">{eyebrow}</div>
          <h2 className="sec-title">{title}</h2>
          {intro && <p className="sec-intro">{intro}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
