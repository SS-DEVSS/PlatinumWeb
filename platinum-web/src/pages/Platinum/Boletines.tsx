import Boletin from "../../components/BoletinCardPlatinum";
import ContactButton from "../../components/ContactButton";
import { boletines } from "../../data/boletines";
import PlatinumLayout from "../../Layouts/PlatinumLayout";

function Boletines() {
  return (
    <PlatinumLayout>
      <main className="px-5 xl:px-40">
        <h1 className="py-6 lg:py-9">Nuestros Boletines</h1>
        <section className="flex flex-wrap justify-evenly mb-5 px-4 gap-2 mx-auto w-full">
          {boletines.map((boletin) => (
            <Boletin
              key={boletin.title}
              img={boletin.image}
              title={boletin.title}
              description={boletin.description}
            />
          ))}
        </section>
        <ContactButton />
      </main>
    </PlatinumLayout>
  );
}

export default Boletines;
