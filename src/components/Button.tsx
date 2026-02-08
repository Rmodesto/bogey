import Link from "next/link";
import { ReactNode, ButtonHTMLAttributes } from "react";

const variants = {
  primary: "bg-volt-green hover:bg-volt-lime text-jet-black font-semibold rounded-full",
  outline: "border border-divider-gray hover:border-slate text-jet-black font-semibold rounded-full",
};

type ButtonProps = {
  variant?: keyof typeof variants;
  href?: string;
  children: ReactNode;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export default function Button({
  variant = "primary",
  href,
  children,
  className = "",
  ...rest
}: ButtonProps) {
  const classes = `${variants[variant]} px-6 py-3 text-sm ${className}`;

  if (href) {
    return (
      <Link href={href} className={`inline-flex items-center gap-2 ${classes}`}>
        {children}
      </Link>
    );
  }

  return (
    <button className={`flex items-center gap-2 ${classes}`} {...rest}>
      {children}
    </button>
  );
}
