import { LucideIcon } from "lucide-react";
import Card from "./Card";

export default function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <Card>
      <Icon className="w-6 h-6 text-deep-ice-blue mb-3" />
      <p className="text-3xl font-semibold text-jet-black">{value}</p>
      <p className="text-slate text-sm">{label}</p>
    </Card>
  );
}
