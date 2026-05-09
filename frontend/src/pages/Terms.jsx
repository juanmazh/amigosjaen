import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-crema-100">
      <Header />
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-16">
        <div className="mb-8">
          <span className="inline-block text-xs uppercase tracking-[0.2em] text-jaen-500 font-semibold mb-2">Legal</span>
          <h1 className="font-display text-5xl text-jaen-700 font-semibold">Términos de servicio</h1>
        </div>

        <article className="bg-white border border-crema-300 rounded-3xl p-8 sm:p-10 space-y-8 text-piedra-700 leading-relaxed">
          <p>Bienvenido a AmigosJaén. Al usar nuestra plataforma, aceptas los siguientes términos y condiciones:</p>

          <section>
            <h2 className="font-display text-xl text-jaen-700 font-semibold mb-3">Uso de la plataforma</h2>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Debes ser mayor de edad o contar con permiso de tus tutores legales.</li>
              <li>No está permitido publicar contenido ofensivo, ilegal o que infrinja derechos de terceros.</li>
              <li>Nos reservamos el derecho de suspender cuentas que incumplan las normas.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-jaen-700 font-semibold mb-3">Propiedad intelectual</h2>
            <p>El contenido generado por los usuarios es propiedad de sus autores, pero concedes a AmigosJaén una licencia para mostrarlo en la plataforma.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-jaen-700 font-semibold mb-3">Limitación de responsabilidad</h2>
            <p>No nos hacemos responsables de los contenidos publicados por los usuarios ni de daños derivados del uso de la plataforma.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-jaen-700 font-semibold mb-3">Modificaciones</h2>
            <p>Podemos modificar estos términos en cualquier momento. Te notificaremos los cambios relevantes.</p>
          </section>

          <p className="pt-4 border-t border-crema-200">
            Si tienes dudas, contacta con{' '}
            <a href="mailto:juanmazh.dev@gmail.com" className="text-jaen-600 hover:text-jaen-700 font-medium underline-offset-2 hover:underline">
              juanmazh.dev@gmail.com
            </a>.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
