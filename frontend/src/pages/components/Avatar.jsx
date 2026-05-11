import React, { useEffect, useState } from 'react';

/**
 * Componente Avatar reutilizable.
 * - Si hay `url` válida, la usa.
 * - Si falla la carga o no hay url, cae a ui-avatars.com con las iniciales del nombre.
 *
 * Props:
 *   nombre: string (para iniciales y fallback)
 *   url:    string|null (avatarUrl del usuario)
 *   size:   number (px, default 40)
 *   className: clases extra
 */
function Avatar({ nombre = '', url, size = 40, className = '' }) {
  const [errored, setErrored] = useState(false);

  // Resetear el flag de error cada vez que cambie la URL, sino el cambio de avatar
  // no se reflejaría visualmente (se seguiría mostrando el fallback).
  useEffect(() => { setErrored(false); }, [url]);

  // Color de fondo basado en el nombre, paleta Jaén
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre || '?')}&size=${size * 2}&background=5B2A86&color=ffffff&bold=true&rounded=true&format=svg`;

  const src = !url || errored ? fallback : url;

  // `key` fuerza un nuevo <img> cuando cambia la url; ayuda a evitar que el browser
  // muestre la versión cacheada anterior al cambiar el src en vivo.
  return (
    <img
      key={src}
      src={src}
      onError={() => setErrored(true)}
      alt={nombre || 'Avatar'}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`rounded-full object-cover bg-jaen-100 ${className}`}
    />
  );
}

export default Avatar;
