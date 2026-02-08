export default function ProgressBar({
  value,
  colorFn,
  containerClass = "bg-divider-gray rounded-full h-2",
  barClass,
}: {
  value: number;
  colorFn?: (value: number) => string;
  containerClass?: string;
  barClass?: string;
}) {
  const color = barClass ?? (colorFn ? colorFn(value) : "bg-volt-green");

  return (
    <div className={containerClass}>
      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}
