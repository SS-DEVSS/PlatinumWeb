import ComponenteEmbragueDetail from "../../../components/embrague/ComponenteEmbragueDetail";

const DISCO_FEATURES = [
  "Alta resistencia al desgaste por excelente composición de materiales.",
  "Amortiguador torsional templado con acabado anodizado.",
  "Segmentos con tratamiento térmico de alta flexibilidad: arranques más suaves sin vibraciones y mayor resistencia al sobrecalentamiento.",
  "Pastas a base de fibras de vidrio aglutinado con resina polimérica de primera calidad, con metales en un porcentaje mayor a otras marcas en el mercado.",
  "Pastas ranuradas que generan flujo de aire entre la superficie y la pista de fricción, favoreciendo el enfriamiento.",
  "Eje estriado (estrías) forjado con prueba de dureza, temple y altas temperaturas.",
];

function Disco() {
  return (
    <ComponenteEmbragueDetail
      title="Disco"
      imageSrc="/images/componentes/NS73-3.png"
      imageAlt="Disco de embrague Platinum"
      features={DISCO_FEATURES}
      related={[
        {
          title: "Plato",
          href: "/Productos/Plato",
          imageSrc: "/images/componentes/VW03-2.png",
          imageAlt: "Plato de embrague Platinum",
        },
      ]}
    />
  );
}

export default Disco;
