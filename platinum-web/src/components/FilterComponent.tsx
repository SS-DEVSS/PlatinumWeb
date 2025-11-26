import { Check, ChevronDown } from "lucide-react";
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
import { useItemContext } from "../context/Item-context";
import { AttributeValue } from "../models/item";
import { useEffect, useState } from "react";

type FilterComponentProps = {
  attribute: Attribute;
  category: Category;
  filtroInfo: {
    numParte: string;
    referencia: string;
    vehiculo?: {
      selectedFilters?: Array<{ attributeId: string, value: string }>;
    };
  };
  open: boolean;
  selectedValue: string;
  enabled: boolean;
  availableOptions: string[];
  onToggleOpen: (open: boolean) => void;
  onSelect: (name: string) => void;
};

const FilterComponent = ({
  attribute,
  open,
  selectedValue,
  enabled,
  availableOptions,
  onToggleOpen,
  onSelect,
}: FilterComponentProps) => {
  const { valuesAttributes } = useItemContext();
  const [itemsToDisplay, setItemsToDisplay] = useState<string[]>([]);

  useEffect(() => {
    // If we have specific available options for this filter, use those
    if (availableOptions && availableOptions.length > 0) {
      setItemsToDisplay(availableOptions);
    } else if (!enabled && selectedValue === "") {
      // If filter is disabled and no value selected, show empty list
      setItemsToDisplay([]);
    } else {
      // Otherwise get all possible values for this attribute
      const getValues = valuesAttributes.filter(
        (attributeObject) => attributeObject.attributeId === attribute.id
      );

      const allValues = getValues[0]?.values
        .flat()
        .map((attributeValue: AttributeValue) => {
          return attributeValue.valueString ||
            attributeValue.valueNumber?.toString() ||
            attributeValue.valueBoolean?.toString() ||
            attributeValue.valueDate?.toString();
        })
        .filter((value): value is string => value !== null && value !== undefined && typeof value === 'string') || [];

      // Remove duplicates and sort
      const uniqueValues = Array.from(new Set(allValues)).sort();
      setItemsToDisplay(uniqueValues);
    }
  }, [attribute.id, valuesAttributes, enabled, selectedValue, availableOptions]);

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
              {selectedValue}
            </div>
          ) : (
            <div className="text-left">
              <h4 className="font-bold">{attribute.displayName || attribute.name}</h4>
              <p className="font-light text-[15px] mt-1">
                Seleccionar {(attribute.displayName || attribute.name).toLowerCase()}
              </p>
            </div>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-100 text-naranja" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[var(--radix-popover-trigger-width)] max-w-[400px] p-0">
        <Command>
          <CommandInput
            placeholder={`Buscar ${(attribute.displayName || attribute.name).toLowerCase()}...`}
          />
          <CommandList>
            <CommandEmpty>
              No se encontró {(attribute.displayName || attribute.name).toLowerCase()}.
            </CommandEmpty>
            <CommandGroup>
              <CommandItem
                className="hover:bg-gray-100 hover:cursor-pointer"
                value=""
                onSelect={() => onSelect("")}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedValue === "" ? "opacity-100" : "opacity-0"
                  )}
                />{" "}
                <span>Sin Selección</span>
              </CommandItem>

              {itemsToDisplay.map((value: string, index: number) => (
                <CommandItem
                  className="hover:cursor-pointer"
                  key={index}
                  value={value}
                  onSelect={(name: string) => {
                    onSelect(name);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {value}
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