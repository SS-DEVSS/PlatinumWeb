import Footer from "../components/Footer";
import Header from "../components/Header";

type PlatinumLayoutProps = {
  children: React.ReactNode;
};

const PlatinumLayout = ({ children }: PlatinumLayoutProps) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default PlatinumLayout;
