import { useEffect, useState } from "react";
import { Category, CategoryAttributesTypes } from "../models/category";

export const categoriesSample: Category[] = [
  {
    id: "1",
    image:
      "https://www.platinumdriveline.com/wp-content/uploads/2020/07/NewBoxes-4-2048x1365.jpg",
    name: "Balatas",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus rem minus, soluta officia ipsam repudiandae quia rerum voluptatibus ipsum minima",
    brands: [
      {
        id: "1",
        name: "Platinum Driveline",
        logo_img_url:
          "https://www.platinumdriveline.com/wp-content/uploads/2020/07/NewBoxes-4-2048x1365.jpg",
      },
    ],
    products: ["test", "dsad"],
  },
  {
    id: "2",
    image:
      "https://www.platinumdriveline.com/wp-content/uploads/2020/07/NewBoxes-4-2048x1365.jpg",
    name: "Clutches",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus rem minus, soluta officia ipsam repudiandae quia rerum voluptatibus ipsum minima",
    brands: [
      {
        id: "1",
        name: "Platinum Driveline",
        logo_img_url:
          "https://www.platinumdriveline.com/wp-content/uploads/2020/07/NewBoxes-4-2048x1365.jpg",
      },
    ],
    attributes: [
      {
        id: "1",
        id_category: "1",
        name: "Diametro",
        type: CategoryAttributesTypes.NUMERIC,
        required: true,
      },
      {
        id: "2",
        id_category: "1",
        name: "Dientes",
        type: CategoryAttributesTypes.NUMERIC,
        required: false,
      },
      {
        id: "3",
        id_category: "2",
        name: "Marca",
        type: CategoryAttributesTypes.STRING,
        required: true,
      },
      {
        id: "4",
        id_category: "2",
        name: "Modelo",
        type: CategoryAttributesTypes.STRING,
        required: false,
      },
    ],
    products: ["test", "dsad", "sadas"],
  },
];

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    setCategories(categoriesSample);
  }, []);
  return { categories };
};
