import { Check, ChevronDown } from "lucide-react";

// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
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
import { Category } from "../models/category";
import { Button } from "./ui/button";
import { useState } from "react";
import { cn } from "../lib/utils";

type FilterSectionProps = {
  categories: Category[];
};

const FilterSection = ({ categories }: FilterSectionProps) => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();

  const handleSelect = (name: string) => {
    const selected = categories.find((category) => category.name === name);
    setSelectedCategory(selected?.id);
    setOpen(false);
  };

  return (
    <div className="w-full flex gap-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="w-[300px] py-8 justify-between text-[#545454] bg-white shadow-sm"
          >
            {selectedCategory ? (
              <div>
                <h4 className="font-bold text-left mb-1">Marca</h4>
                {
                  categories.find(
                    (category) => category.id === selectedCategory
                  )?.name
                }
              </div>
            ) : (
              <div className="text-left">
                <h4 className="font-bold">Marca</h4>
                <p className="font-light text-[15px] mt-1">
                  Seleccionar la marca
                </p>
              </div>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-100 text-naranja" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Buscar marca..." />
            <CommandList>
              <CommandEmpty>No se encontró la marca.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCategory === category.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {category.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="w-[300px] py-8 justify-between text-[#545454] bg-white shadow-sm"
          >
            {selectedCategory ? (
              <div>
                <h4 className="font-bold text-left mb-1">Marca</h4>
                {
                  categories.find(
                    (category) => category.id === selectedCategory
                  )?.name
                }
              </div>
            ) : (
              <div className="text-left">
                <h4 className="font-bold">Marca</h4>
                <p className="font-light text-[15px] mt-1">
                  Seleccionar la marca
                </p>
              </div>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-100 text-naranja" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Buscar marca..." />
            <CommandList>
              <CommandEmpty>No se encontró la marca.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCategory === category.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {category.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="w-[300px] py-8 justify-between text-[#545454] bg-white shadow-sm"
          >
            {selectedCategory ? (
              <div>
                <h4 className="font-bold text-left mb-1">Marca</h4>
                {
                  categories.find(
                    (category) => category.id === selectedCategory
                  )?.name
                }
              </div>
            ) : (
              <div className="text-left">
                <h4 className="font-bold">Marca</h4>
                <p className="font-light text-[15px] mt-1">
                  Seleccionar la marca
                </p>
              </div>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-100 text-naranja" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Buscar marca..." />
            <CommandList>
              <CommandEmpty>No se encontró la marca.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCategory === category.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {category.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="w-[300px] py-8 justify-between text-[#545454] bg-white shadow-sm"
          >
            {selectedCategory ? (
              <div>
                <h4 className="font-bold text-left mb-1">Marca</h4>
                {
                  categories.find(
                    (category) => category.id === selectedCategory
                  )?.name
                }
              </div>
            ) : (
              <div className="text-left">
                <h4 className="font-bold">Marca</h4>
                <p className="font-light text-[15px] mt-1">
                  Seleccionar la marca
                </p>
              </div>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-100 text-naranja" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Buscar marca..." />
            <CommandList>
              <CommandEmpty>No se encontró la marca.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCategory === category.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {category.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="w-[300px] py-8 justify-between text-[#545454] bg-white shadow-sm"
          >
            {selectedCategory ? (
              <div>
                <h4 className="font-bold text-left mb-1">Marca</h4>
                {
                  categories.find(
                    (category) => category.id === selectedCategory
                  )?.name
                }
              </div>
            ) : (
              <div className="text-left">
                <h4 className="font-bold">Marca</h4>
                <p className="font-light text-[15px] mt-1">
                  Seleccionar la marca
                </p>
              </div>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-100 text-naranja" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Buscar marca..." />
            <CommandList>
              <CommandEmpty>No se encontró la marca.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCategory === category.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {category.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* <Select>
        <SelectTrigger className="h-full">
          {categories.length > 0 ? (
            <div className="text-left">
              <h4 className="font-bold">Marca</h4>
              <p className="text-[#545454]">Seleccionar la marca</p>
            </div>
          ) : (
            <SelectValue placeholder="Platinum Driveline" />
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categorías</SelectLabel>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="h-full">
          {categories.length > 0 ? (
            <div className="text-left">
              <h4 className="font-bold">Modelo</h4>
              <p className="text-[#545454]">Seleccionar el modelo</p>
            </div>
          ) : (
            <SelectValue placeholder="Platinum Driveline" />
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categorías</SelectLabel>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="h-full">
          {categories.length > 0 ? (
            <div className="text-left">
              <h4 className="font-bold">Tipo</h4>
              <p className="text-[#545454]">Seleccionar el Tipo</p>
            </div>
          ) : (
            <SelectValue placeholder="Platinum Driveline" />
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categorías</SelectLabel>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="h-full">
          {categories.length > 0 ? (
            <div className="text-left">
              <h4 className="font-bold">Motor</h4>
              <p className="text-[#545454]">Seleccionar motor</p>
            </div>
          ) : (
            <SelectValue placeholder="Platinum Driveline" />
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categorías</SelectLabel>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="h-full">
          {categories.length > 0 ? (
            <div className="text-left">
              <h4 className="font-bold">Año</h4>
              <p className="text-[#545454]">Seleccionar año</p>
            </div>
          ) : (
            <SelectValue placeholder="Platinum Driveline" />
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categorías</SelectLabel>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select> */}
    </div>
  );
};

export default FilterSection;
