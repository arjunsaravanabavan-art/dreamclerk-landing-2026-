const items = [
  "iit madras",
  "iit bombay",
  "iit delhi",
  "bits pilani",
  "vit vellore",
  "srm chennai",
  "manipal",
  "nitte",
  "amrita",
  "pes bangalore",
  "rvce",
  "msrit",
];

export default function Marquee() {
  // duplicate the list once so the CSS keyframe (translateX -50%) loops seamlessly
  const list = [...items, ...items];
  return (
    <div className="marquee" aria-label="trusted by students from">
      <div className="marquee__track" role="list">
        {list.map((it, i) => (
          <span key={i} role="listitem">
            <b>{it}</b>
            <span className="dot" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}
