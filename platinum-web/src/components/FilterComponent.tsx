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
  };
  open: boolean;
  selectedValue: string;
  enabled: boolean;
  onToggleOpen: (open: boolean) => void;
  onSelect: (name: string) => void;
};

const FilterComponent = ({
  attribute,
  // category,
  // filtroInfo,
  open,
  selectedValue,
  enabled,
  onToggleOpen,
  onSelect,
}: FilterComponentProps) => {
  const { valuesAttributes, selectedFilters, setSelectedFilters } =
    useItemContext();

  console.log(selectedFilters);

  const [itemsToDisplay, setitemsToDisplay] = useState<any[]>([]);
  const getValues = valuesAttributes.filter(
    (attributeObject) => attributeObject.attributeId === attribute.id
  );

  const finalValues = getValues[0].values
    .flat()
    .map((attributeValue: AttributeValue) => {
      const value =
        attributeValue.valueNumber ||
        attributeValue.valueString ||
        attributeValue.valueBoolean ||
        attributeValue.valueDate;

      return { value };
    });

  useEffect(() => {
    const cleanedFinalValues = (data: any) => {
      let unique: any[] = [];
      data.forEach((element: any) => {
        if (!unique.includes(element.value)) {
          unique.push(element.value);
        }
      });
      unique.sort();
      setitemsToDisplay(unique);
    };

    cleanedFinalValues(finalValues);
  }, []);

  return (
    <Popover open={open} onOpenChange={onToggleOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          disabled={!enabled}
          className="w-[300px] py-8 justify-between text-[#545454] bg-white shadow-sm"
        >
          {selectedValue ? (
            <div>
              <h4 className="font-bold text-left mb-1">{attribute.name}</h4>
              {selectedValue}
            </div>
          ) : (
            <div className="text-left">
              <h4 className="font-bold">{attribute.name}</h4>
              <p className="font-light text-[15px] mt-1">
                Seleccionar {attribute.name.toLowerCase()}
              </p>
            </div>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-100 text-naranja" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder={`Buscar ${attribute.name.toLowerCase()}...`}
          />
          <CommandList>
            <CommandEmpty>
              No se encontró {attribute.name.toLowerCase()}.
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

              {itemsToDisplay.map((value: any, index: number) => (
                <CommandItem
                  className="hover:cursor-pointer"
                  key={index}
                  value={value}
                  onSelect={(name: string) => {
                    setSelectedFilters((prev) => {
                      const updatedFilters = prev.filter(
                        (filter) => filter.value !== name
                      );
                      return [
                        ...updatedFilters,
                        { attributeId: attribute.id, value: name },
                      ];
                    });
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
