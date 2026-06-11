import { Check, ChevronDown, Loader2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { Attribute, Category } from "../models/category";
import { useItemContext } from "../context/use-item-context";
import { AttributeValue } from "../models/item";
import { useEffect, useMemo, useState } from "react";
import {
  dedupeFilterOptionValues,
  normalizeFilterOptionDisplayValue,
} from "../utils/applicationAttributeValue";

type FilterComponentProps = {
  attribute: Attribute;
  category: Category;
  filtroInfo: {
    numParte: string;
    referencia: string;
    vehiculo?: {
      selectedFilters?: Array<{ attributeId: string; value: string }>;
    };
  };
  open: boolean;
  selectedValue: string;
  enabled: boolean;
  availableOptions: string[];
  loading?: boolean;
  onToggleOpen: (open: boolean) => void;
  onSelect: (name: string) => void;
};

const FilterComponent = ({
  attribute,
  open,
  selectedValue,
  enabled,
  availableOptions,
  loading = false,
  onToggleOpen,
  onSelect,
}: FilterComponentProps) => {
  const { valuesAttributes } = useItemContext();
  const [itemsToDisplay, setItemsToDisplay] = useState<string[]>([]);

  const selectedDisplayValue = useMemo(
    () => normalizeFilterOptionDisplayValue(selectedValue, attribute),
    [selectedValue, attribute]
  );

  useEffect(() => {
    if (availableOptions && availableOptions.length > 0) {
      setItemsToDisplay(dedupeFilterOptionValues(availableOptions, attribute));
    } else if (!enabled && selectedValue === "") {
      setItemsToDisplay([]);
    } else {
      const getValues = valuesAttributes.filter(
        (attributeObject) => attributeObject.attributeId === attribute.id
      );

      const allValues =
        getValues[0]?.values
          .flat()
          .map((attributeValue: AttributeValue) => {
            return (
              attributeValue.valueString ||
              attributeValue.valueNumber?.toString() ||
              attributeValue.valueBoolean?.toString() ||
              attributeValue.valueDate?.toString()
            );
          })
          .filter(
            (value): value is string =>
              value !== null && value !== undefined && typeof value === "string"
          ) || [];

      setItemsToDisplay(dedupeFilterOptionValues(allValues, attribute));
    }
  }, [attribute, valuesAttributes, enabled, selectedValue, availableOptions]);

  return (
    <Popover open={open} onOpenChange={onToggleOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          disabled={!enabled}
          className="w-full py-8 justify-between text-[#545454] bg-white shadow-sm"
        >
          {selectedValue ? (
            <div>
              <h4 className="font-bold text-left mb-1">{attribute.displayName || attribute.name}</h4>
              {selectedDisplayValue}
            </div>
          ) : (
            <div className="text-left">
              <h4 className="font-bold">{attribute.displayName || attribute.name}</h4>
              <p className="font-light text-[15px] mt-1">
                {loading
                  ? "Cargando opciones…"
                  : `Seleccionar ${(attribute.displayName || attribute.name).toLowerCase()}`}
              </p>
            </div>
          )}
          {loading && !selectedValue ? (
            <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin text-naranja" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-100 text-naranja" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="start"
        collisionPadding={12}
        className="z-[100] w-[var(--radix-popover-trigger-width)] max-w-[400px] overflow-hidden p-0"
        onWheel={(event) => event.stopPropagation()}
        onTouchMove={(event) => event.stopPropagation()}
      >
        <Command
          className="max-h-[min(320px,var(--radix-popover-content-available-height))]"
          filter={(value, search) => {
            const query = search.trim().toLowerCase();
            if (!query) return 1;
            return value.toLowerCase().includes(query) ? 1 : 0;
          }}
        >
          <CommandInput
            placeholder={`Buscar ${(attribute.displayName || attribute.name).toLowerCase()}...`}
          />
          <CommandList className="max-h-[min(280px,var(--radix-popover-content-available-height))] overflow-y-auto overscroll-contain">
            {loading && itemsToDisplay.length === 0 ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin text-naranja" />
                Cargando opciones…
              </div>
            ) : null}
            <CommandEmpty>
              No se encontró {(attribute.displayName || attribute.name).toLowerCase()}.
            </CommandEmpty>
            <CommandGroup>
              <CommandItem
                className="hover:bg-gray-100 hover:cursor-pointer"
                value="__clear__"
                onSelect={() => onSelect("")}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedValue === "" ? "opacity-100" : "opacity-0"
                  )}
                />
                <span>Sin Selección</span>
              </CommandItem>

              {itemsToDisplay.map((displayValue) => (
                <CommandItem
                  className="hover:cursor-pointer"
                  key={displayValue}
                  value={displayValue}
                  keywords={[displayValue]}
                  onSelect={() => onSelect(displayValue)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedDisplayValue === displayValue ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {displayValue}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default FilterComponent;
