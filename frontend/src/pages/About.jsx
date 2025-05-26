import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 to-purple-200">
      <Header />
      <div className="flex-grow flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-purple-700 mb-4">Sobre AmigosJaén</h1>
          <p className="mb-4 text-gray-700">
            AmigosJaén es una plataforma creada para conectar personas en Jaén y alrededores, facilitando la organización de eventos, actividades y la creación de nuevas amistades. Nuestra misión es fomentar la comunidad y el ocio saludable en la provincia.
          </p>
          <h2 className="text-xl font-semibold text-purple-600 mb-2">Contacto</h2>
          <p className="mb-4 text-gray-700">
            ¿Tienes dudas, sugerencias o quieres colaborar? Puedes contactar conmigo en:
            <br />
            <span className="font-semibold">Email:</span> juanmazh.dev@gmail.com
          </p>
          <h2 className="text-xl font-semibold text-purple-600 mb-2">Sobre el creador</h2>
          <p className="text-gray-700">
            Mi nombre es Juan Manuel, desarrollador web y apasionado por la tecnología y la comunidad. He creado AmigosJaén como proyecto para terminar mis estudios de DAW en el 
            <a href="https://www.iesvirgendelcarmen.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline"> IES Virgen del Carmen </a>
            para ayudar a las personas a conectar y disfrutar de nuevas experiencias en Jaén.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default About;
