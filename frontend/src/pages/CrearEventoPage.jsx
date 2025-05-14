import CrearEvento from "./components/CrearEvento";
import Header from "./components/Header";
import Footer from "./components/Footer";

function CrearEventoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="flex-grow p-4">
        <CrearEvento />
      </div>
      <Footer />
    </div>
  );
}

export default CrearEventoPage;
