import { cn } from "../lib/utils";

/** Mismo estilo que «Seleccione una categoría» en catálogo */
export const PAGE_TITLE_CLASS =
  "text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 text-center";

type PageTitleProps = {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
};

export default function PageTitle({
  children,
  className,
  as: Tag = "h1",
}: PageTitleProps) {
  return <Tag className={cn(PAGE_TITLE_CLASS, className)}>{children}</Tag>;
}
