import React from 'react';
//footer de la web
function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          <a href="https://amigosjaen.netlify.app/">AmigosJaen</a>
          © 2025 by <a href="https://github.com/juanmazh">Juan Manuel Zafra Hernández </a>
          is licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>
          <img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" className="inline align-text-bottom ml-1" style={{maxWidth: '1em', maxHeight: '1em'}} alt="CC" />
          <img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" className="inline align-text-bottom ml-1" style={{maxWidth: '1em', maxHeight: '1em'}} alt="BY" />
          <img src="https://mirrors.creativecommons.org/presskit/icons/sa.svg" className="inline align-text-bottom ml-1" style={{maxWidth: '1em', maxHeight: '1em'}} alt="SA" />
        </p>
        <p className="text-sm mt-2">
          <a href="/privacy" className="text-gray-400 hover:text-white transition">Política de Privacidad</a>  |  
          <a href="/terms" className="text-gray-400 hover:text-white transition"> Términos de Servicio</a>
        </p>
        <p className="text-sm mt-2">Síguenos en:
          <a href="https://www.linkedin.com/in/juan-manuel-zafra-hern%C3%A1ndez-5b2bb7339/" className="ml-2 text-gray-400 hover:text-white transition" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.867-3.063-1.868 0-2.155 1.46-2.155 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.757 1.379-1.555 2.841-1.555 3.038 0 3.6 2.001 3.6 4.604v5.584z" />
            </svg>
          </a>
          <a href="https://instagram.com/lil_capitolio" className="ml-2 text-pink-500 hover:text-white transition" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.281.058-2.563.334-3.637 1.408-1.074 1.074-1.35 2.356-1.408 3.637-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.058 1.281.334 2.563 1.408 3.637 1.074 1.074 2.356 1.35 3.637 1.408 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.281-.058 2.563-.334 3.637-1.408 1.074-1.074 1.35-2.356 1.408-3.637.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.058-1.281-.334-2.563-1.408-3.637-1.074-1.074-2.356-1.35-3.637-1.408-1.28-.058-1.688-.072-4.947-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.324c-2.296 0-4.162-1.866-4.162-4.162s1.866-4.162 4.162-4.162 4.162 1.866 4.162 4.162-1.866 4.162-4.162 4.162zm6.406-11.845c-.796 0-1.441.645-1.441 1.441s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.441-1.441-1.441z" />
            </svg>
          </a>
          <a href="https://github.com/juanmazh/amigosjaen" className="ml-2 text-gray-400 hover:text-white transition" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.113.793-.26.793-.577v-2.165c-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.744.083-.729.083-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.835 2.807 1.305 3.492.997.108-.774.42-1.305.763-1.605-2.665-.3-5.467-1.333-5.467-5.93 0-1.31.468-2.382 1.236-3.222-.123-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 013.003-.404c1.02.005 2.045.138 3.003.404 2.292-1.552 3.3-1.23 3.3-1.23.653 1.653.24 2.873.117 3.176.768.84 1.236 1.912 1.236 3.222 0 4.61-2.807 5.625-5.478 5.92.432.372.816 1.102.816 2.222v3.293c0 .32.192.694.8.576C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
