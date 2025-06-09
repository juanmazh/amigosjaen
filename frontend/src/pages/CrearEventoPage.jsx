// crear eventos
import CrearEvento from "./components/CrearEvento";
import Header from "./components/Header";
import Footer from "./components/Footer";

function CrearEventoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 to-purple-200">
      <Header />
      <div className="flex-grow p-4">
        <CrearEvento />
      </div>
      <Footer />
    </div>
  );
}

export default CrearEventoPage;
