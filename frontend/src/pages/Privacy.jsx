import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-crema-100">
      <Header />
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-16">
        <div className="mb-8">
          <span className="inline-block text-xs uppercase tracking-[0.2em] text-jaen-500 font-semibold mb-2">Legal</span>
          <h1 className="font-display text-5xl text-jaen-700 font-semibold">Política de privacidad</h1>
        </div>

        <article className="bg-white border border-crema-300 rounded-3xl p-8 sm:p-10 space-y-8 text-piedra-700 leading-relaxed">
          <p>En AmigosJaén valoramos tu privacidad. Esta página describe cómo recopilamos, usamos y protegemos tu información personal.</p>

          <section>
            <h2 className="font-display text-xl text-jaen-700 font-semibold mb-3">¿Qué datos recopilamos?</h2>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Nombre, correo electrónico y contraseña cifrada al registrarte.</li>
              <li>Información de tus publicaciones, eventos y comentarios.</li>
              <li>Datos de uso y navegación en la plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-jaen-700 font-semibold mb-3">¿Para qué usamos tus datos?</h2>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Para gestionar tu cuenta y autenticación.</li>
              <li>Para mostrarte contenido personalizado y relevante.</li>
              <li>Para mejorar la seguridad y la experiencia de usuario.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-jaen-700 font-semibold mb-3">¿Compartimos tus datos?</h2>
            <p>No vendemos ni compartimos tus datos personales con terceros, salvo obligación legal.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-jaen-700 font-semibold mb-3">Tus derechos</h2>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Acceder, rectificar o eliminar tus datos personales.</li>
              <li>Solicitar la portabilidad de tus datos.</li>
              <li>Oponerte al tratamiento de tus datos.</li>
            </ul>
          </section>

          <p className="pt-4 border-t border-crema-200">
            Para ejercer tus derechos, escribe a{' '}
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
