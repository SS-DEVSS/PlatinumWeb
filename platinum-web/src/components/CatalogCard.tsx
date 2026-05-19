import { Card, CardContent } from "./ui/card";
import { Car } from "lucide-react";

type CatalogCardVariant = "default" | "labelOnly";

type CatalogCardProps = {
  title: string;
  imageUrl?: string | null;
  count?: number;
  countLabel?: string;
  onClick: () => void;
  variant?: CatalogCardVariant;
};

function CatalogCard({
  title,
  imageUrl,
  count,
  countLabel = "artículos",
  onClick,
  variant = "default",
}: CatalogCardProps) {
  const hasImage = imageUrl && imageUrl.trim() !== "";
  const displayCount =
    count !== undefined && count !== null ? count : null;

  const interactiveProps = {
    role: "button" as const,
    tabIndex: 0,
    onClick,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    },
  };

  if (variant === "labelOnly") {
    return (
      <Card
        {...interactiveProps}
        className="cursor-pointer border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md hover:border-naranja/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-naranja focus-visible:ring-offset-2"
      >
        <CardContent className="px-4 py-3 text-center">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">
            {title}
          </h3>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      {...interactiveProps}
      className="cursor-pointer overflow-hidden transition-shadow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-naranja focus-visible:ring-offset-2"
    >
      <div className="w-full aspect-square bg-white flex items-center justify-center p-6 border-b">
        {hasImage ? (
          <img
            src={imageUrl!}
            alt={title}
            className="w-full h-full object-contain"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent) {
                const fallback = parent.querySelector(".catalog-card-fallback");
                if (fallback) (fallback as HTMLElement).classList.remove("hidden");
              }
            }}
          />
        ) : null}
        <div
          className={`catalog-card-fallback flex flex-col items-center justify-center text-gray-400 ${hasImage ? "hidden" : ""}`}
        >
          <Car className="w-24 h-24 text-gray-300" strokeWidth={1.25} aria-hidden />
        </div>
      </div>
      <CardContent className="p-4 bg-gray-50 text-center">
        <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-2">
          {title}
        </h3>
        {displayCount !== null && (
          <p className="text-sm text-gray-600">
            {displayCount} {countLabel}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default CatalogCard;
