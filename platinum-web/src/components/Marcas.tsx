import BrandCard from "./BrandCard";
// import PLATINUMBOX from "../../../public/images/cajas/Clutch.png";
// import DELPHIBOX from "../../../public/images/cajas/cajaDelphiLogo.png";
// import BRAKEPADSBOX from "../../../public/images/cajas/CajaPastilla.png";

const Marcas = () => {
  return (
    <div className="bg-gris_oscuro px-3 md:px-6 lg:px-10 xl:px-20">
      <h1 className="py-6 lg:py-12 text-white">Nuestros Productos</h1>
      <div className="flex flex-wrap justify-center gap-4 md:gap-10 pb-14 2xl:pb-0">
        <BrandCard
          image={"Clutch"}
          text={"Sistema de Embrague"}
          brand={"PLATINUM DRIVELINE"}
          link={"Productos"}
          text_button={"Conoce Más"}
        />
        <BrandCard
          image={"cajaDelphiLogo"}
          text={"Pastilla de Freno"}
          brand={"PLATINUM DRIVELINE"}
          link={"pastillas"}
          text_button={"Visitar"}
        />
        <BrandCard
          image={"CajaPastilla"}
          text={"Suspensión"}
          brand={"DELPHI"}
          link={"delphi"}
          text_button={"Visitar"}
        />
      </div>
    </div>
  );
};

export default Marcas;
