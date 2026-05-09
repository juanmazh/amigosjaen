import CrearEvento from "./components/CrearEvento";
import Header from "./components/Header";
import Footer from "./components/Footer";

function CrearEventoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-crema-100">
      <Header />
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12">
        <div className="mb-8">
          <span className="inline-block text-xs uppercase tracking-[0.2em] text-jaen-500 font-semibold mb-2">
            Nueva propuesta
          </span>
          <h1 className="font-display text-4xl text-jaen-700 font-semibold">Crear evento</h1>
          <p className="text-piedra-500 mt-2">Comparte tu plan con la comunidad de Jaén.</p>
        </div>
        <CrearEvento />
      </main>
      <Footer />
    </div>
  );
}

export default CrearEventoPage;
