import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Category } from "../models/category";

type FilterSectionProps = {
  categories: Category[];
};

const FilterSection = ({ categories }: FilterSectionProps) => {
  return (
    <div className="w-full flex gap-4">
      <Select>
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
      </Select>
    </div>
  );
};

export default FilterSection;
