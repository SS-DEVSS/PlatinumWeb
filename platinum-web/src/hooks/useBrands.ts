import { useEffect, useState } from "react";
import { Brand } from "../models/brand";

const brandsSample: Brand[] = [
  {
    id: "1",
    logo_img_url: "LOGOPlatinum",
    name: "Platinum Driveline",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus rem minus, soluta officia ipsam repudiandae quia rerum voluptatibus ipsum minima",
  },
  {
    id: "2",
    logo_img_url: "",
    name: "Delphi",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus rem minus, soluta officia ipsam repudiandae quia rerum voluptatibus ipsum minima",
  },
  {
    id: "3",
    logo_img_url: "",
    name: "FTE",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus rem minus, soluta officia ipsam repudiandae quia rerum voluptatibus ipsum minima",
  },
];

export const useBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  useEffect(() => {
    setBrands(brandsSample);
  }, []);
  return { brands };
};
