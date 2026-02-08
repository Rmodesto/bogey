import { ReactNode } from "react";

const variants = {
  default: "bg-mist-blue text-deep-ice-blue",
  success: "bg-volt-mist text-volt-lime",
  error: "bg-red-50 text-red-500",
};

export default function Badge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: keyof typeof variants;
}) {
  return (
    <span className={`${variants[variant]} text-xs font-semibold px-3 py-1 rounded-full`}>
      {children}
    </span>
  );
}
