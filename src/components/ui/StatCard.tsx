type Props = {
  title: string;
  value: string;
  delta: string;
  positive: boolean;
};

export default function StatCard({ title, value, delta, positive }: Props) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
      <p
        className={`text-sm mt-1 ${
          positive ? "text-green-600" : "text-red-600"
        }`}
      >
        {delta}
      </p>
    </div>
  );
}
