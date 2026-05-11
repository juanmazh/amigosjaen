import React, { useState } from 'react';

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

  // Color de fondo basado en el nombre, paleta Jaén
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre || '?')}&size=${size * 2}&background=5B2A86&color=ffffff&bold=true&rounded=true&format=svg`;

  const src = !url || errored ? fallback : url;

  return (
    <img
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
