type Props = {
  label: string;
  value: string;
  detail: string;
  tone: "price" | "income" | "power";
};

export default function StatCard({ label, value, detail, tone }: Props) {
  return (
    <div className={`reading reading--${tone}`}>
      <span className="reading-swatch" aria-hidden="true" />
      <div className="reading-copy">
        <p>{label}</p>
        <span>{detail}</span>
      </div>
      <strong>{value}</strong>
    </div>
  );
}
