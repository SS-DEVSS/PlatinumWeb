import ComponenteEmbragueDetail from "../../../components/embrague/ComponenteEmbragueDetail";

const PLATO_FEATURES = [
  "Carcaza o tapa sometido a pruebas de dureza y resistencia.",
  "Protector antioxidante y lubricante.",
  "Ángulos y bordes desbastados eliminan los filos del acero.",
  "Diafragma o abanico producido con metal de alta calidad; puntas tratadas térmicamente para incrementar su dureza y evitar desgaste prematuro por fricción del collarín.",
  "Aros internos de acero al alto carbón para incrementar la vida útil de los componentes.",
  "Muelles endurecidos con templado: mayor flexibilidad y resistencia, mejora el desplazamiento equitativo del plato opresor.",
  "Acabado con maquinado fino para reducir el tiempo de asentamiento de la pasta del disco sobre la pista de fricción.",
  "Balanceo de alta precisión para evitar vibraciones.",
  "Remachado con equipo hidráulico de precisión.",
];

function Plato() {
  return (
    <ComponenteEmbragueDetail
      title="Plato"
      imageSrc="/images/componentes/VW03-2.png"
      imageAlt="Plato de embrague Platinum"
      features={PLATO_FEATURES}
      related={[
        {
          title: "Disco",
          href: "/Productos/Disco",
          imageSrc: "/images/componentes/NS73-3.png",
          imageAlt: "Disco de embrague Platinum",
        },
      ]}
    />
  );
}

export default Plato;
