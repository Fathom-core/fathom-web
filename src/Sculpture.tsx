export default function Sculpture({ paused }: { paused: boolean }) {
  return <div className="sculpture-shell" data-motion={paused ? "paused" : "active"}>
    <img className="sculpture-poster" src="/models/fathom-core.webp"
      alt="A crowned, blindfolded sculpture in violet light, representing independent intelligence"
      fetchPriority="high" />
  </div>;
}
