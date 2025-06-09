import React from "react";
// /privacy
export default function Privacy() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4 bg-gradient-to-br from-pink-100 to-purple-200">
      <h1 className="text-2xl font-bold mb-4">Política de Privacidad</h1>
      <p className="mb-2">En AmigosJaen valoramos tu privacidad. Esta página describe cómo recopilamos, usamos y protegemos tu información personal.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">¿Qué datos recopilamos?</h2>
      <ul className="list-disc ml-6 mb-2">
        <li>Nombre, correo electrónico y contraseña totalmente cifrada al registrarte.</li>
        <li>Información de tus publicaciones, eventos y comentarios.</li>
        <li>Datos de uso y navegación en la plataforma.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">¿Para qué usamos tus datos?</h2>
      <ul className="list-disc ml-6 mb-2">
        <li>Para gestionar tu cuenta y autenticación.</li>
        <li>Para mostrarte contenido personalizado y relevante.</li>
        <li>Para mejorar la seguridad y la experiencia de usuario.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">¿Compartimos tus datos?</h2>
      <p>No vendemos ni compartimos tus datos personales con terceros, salvo obligación legal.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Tus derechos</h2>
      <ul className="list-disc ml-6 mb-2">
        <li>Acceder, rectificar o eliminar tus datos personales.</li>
        <li>Solicitar la portabilidad de tus datos.</li>
        <li>Oponerte al tratamiento de tus datos.</li>
      </ul>
      <p className="mt-6">Para ejercer tus derechos o resolver dudas, contacta con <a href="mailto:juanmazh.dev@gmail.com" className="text-blue-400 underline">juanmazh.dev@gmail.com</a>.</p>
    </div>
  );
}
