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
  onReset: () => void;
};

const FilterComponent = ({
  attribute,
  category,
  filtroInfo,
  open,
  selectedValue,
  enabled,
  onToggleOpen,
  onSelect,
  onReset,
}: FilterComponentProps) => {
  return (
    <Popover open={open} onOpenChange={onToggleOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          disabled={!enabled}
          className="w-[300px] py-8 justify-between text-[#545454] bg-white shadow-sm"
          onClick={onReset}
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
              {/* Cambiar esto de abajo */}
              {category.attributes?.variant?.map((attribute: Attribute) => (
                <CommandItem
                  key={attribute.id}
                  value={attribute.name}
                  onSelect={() => onSelect(attribute.name)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === attribute.name
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {attribute.name}
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
