import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

export default function PageHeader({
  backHref,
  backLabel,
  rightContent,
}: {
  backHref: string;
  backLabel: string;
  rightContent?: ReactNode;
}) {
  return (
    <header className="bg-white border-b border-divider-gray px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href={backHref} className="flex items-center gap-2 text-slate hover:text-jet-black text-sm">
          <ArrowLeft className="w-4 h-4" /> {backLabel}
        </Link>
        {rightContent}
      </div>
    </header>
  );
}
