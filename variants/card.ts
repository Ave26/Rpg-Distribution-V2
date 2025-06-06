import { tv, type VariantProps } from "tailwind-variants";

export const card = tv({
  base: "rounded-xl p-4 transition-shadow bg-slate-800",
  variants: {
    intent: {
      default: "bg-white",
      danger: "bg-red-100 text-red-800 border border-red-300",
      success: "bg-emerald-500 text-green-800 border border-green-300",
    },
    shadow: {
      none: "",
      md: "shadow-md",
      lg: "shadow-lg",
    },
  },
  defaultVariants: {
    intent: "default",
    shadow: "none",
  },
});
