import { ReactNode } from "react";

export default function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`bg-white border border-divider-gray rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
}
