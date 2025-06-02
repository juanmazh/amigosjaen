import React from "react";

export default function Terms() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4 bg-gradient-to-br from-pink-100 to-purple-200">
      <h1 className="text-2xl font-bold mb-4">Términos de Servicio</h1>
      <p className="mb-2">Bienvenido a AmigosJaen. Al usar nuestra plataforma, aceptas los siguientes términos y condiciones:</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Uso de la plataforma</h2>
      <ul className="list-disc ml-6 mb-2">
        <li>Debes ser mayor de edad o contar con permiso de tus tutores legales.</li>
        <li>No está permitido publicar contenido ofensivo, ilegal o que infrinja derechos de terceros.</li>
        <li>Nos reservamos el derecho de suspender cuentas que incumplan las normas.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">Propiedad intelectual</h2>
      <p>El contenido generado por los usuarios es propiedad de sus autores, pero concedes a AmigosJaen una licencia para mostrarlo en la plataforma.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Limitación de responsabilidad</h2>
      <p>No nos hacemos responsables de los contenidos publicados por los usuarios ni de daños derivados del uso de la plataforma.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Modificaciones</h2>
      <p>Podemos modificar estos términos en cualquier momento. Te notificaremos los cambios relevantes.</p>
      <p className="mt-6">Si tienes dudas, contacta con <a href="mailto:juanmazh.dev@gmail.com" className="text-blue-400 underline">juanmazh.dev@gmail.com</a>.</p>
    </div>
  );
}
