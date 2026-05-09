import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

function About() {
  return (
    <div className="min-h-screen flex flex-col bg-crema-100">
      <Header />
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-16">
        <div className="mb-10 text-center">
          <span className="inline-block text-xs uppercase tracking-[0.2em] text-jaen-500 font-semibold mb-3">
            La historia detrás
          </span>
          <h1 className="font-display text-5xl text-jaen-700 font-semibold">Sobre AmigosJaén</h1>
        </div>

        <article className="bg-white border border-crema-300 rounded-3xl p-8 sm:p-12 space-y-8">
          <section>
            <p className="text-piedra-700 leading-relaxed text-lg">
              AmigosJaén es una plataforma creada para conectar personas en Jaén
              y alrededores, facilitando la organización de eventos, actividades
              y la creación de nuevas amistades. Nuestra misión es fomentar la
              comunidad y el ocio saludable en la provincia.
            </p>
          </section>

          <section className="pt-6 border-t border-crema-200">
            <h2 className="font-display text-2xl text-jaen-700 font-semibold mb-3">Contacto</h2>
            <p className="text-piedra-700 leading-relaxed">
              ¿Tienes dudas, sugerencias o quieres colaborar? Escríbeme a{' '}
              <a href="mailto:juanmazh.dev@gmail.com" className="text-jaen-600 hover:text-jaen-700 font-medium underline-offset-2 hover:underline">
                juanmazh.dev@gmail.com
              </a>.
            </p>
          </section>

          <section className="pt-6 border-t border-crema-200">
            <h2 className="font-display text-2xl text-jaen-700 font-semibold mb-3">Sobre el creador</h2>
            <p className="text-piedra-700 leading-relaxed">
              Soy Juan Manuel, desarrollador web y apasionado por la tecnología
              y la comunidad. He creado AmigosJaén como proyecto para terminar
              mis estudios de DAW en el{' '}
              <a
                href="https://www.iesvirgendelcarmen.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-jaen-600 hover:text-jaen-700 font-medium underline-offset-2 hover:underline"
              >
                IES Virgen del Carmen
              </a>{' '}
              para ayudar a las personas a conectar y disfrutar de nuevas
              experiencias en Jaén.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}

export default About;
