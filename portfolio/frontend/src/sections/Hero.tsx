import "./Hero.css";

// 👇 REMPLACE cette ligne par ton image : import myPhoto from '../assets/ma-photo.jpg'
// import myPhoto from '../assets/ma-photo.jpg'

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-bg">
        <div className="hero-grid" />
        <div className="hero-glow" />
      </div>

      <div className="container hero-inner">
        <div className="hero-content">
          <p className="hero-greeting">
            I am <span className="hero-name-inline">Vanshika</span>
          </p>

          <h1 className="hero-title">
            Front-End
            <br />
            <span className="hero-title-outline">Developer</span>
            <span className="hero-title-amp"> &</span>
            <br />
            Designer
          </h1>

          <p className="hero-desc">
            Blending thoughtful UI design with clean, responsive development to
            create websites that look great and perform flawlessly.
          </p>

          <div className="hero-actions">
            <a href="/cv.pdf" download className="btn-primary">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Download CV
            </a>
          </div>

          <div className="hero-socials">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="social-link"
              aria-label="LinkedIn"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="social-link"
              aria-label="GitHub"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
              </svg>
            </a>
          </div>
        </div>

        <div className="hero-photo-wrap">
          <div className="hero-photo-frame">
            {/* 
              POUR AJOUTER TA PHOTO :
              1. Copie ton image dans src/assets/ (ex: ma-photo.jpg)
              2. Importe-la en haut du fichier : import myPhoto from '../assets/ma-photo.jpg'
              3. Remplace la div.photo-placeholder par : <img src={myPhoto} alt="Photo" className="hero-photo" />
            */}
            <div className="photo-placeholder">
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.3"
              >
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Ajoute ta photo ici</span>
            </div>
          </div>
          <div className="hero-photo-accent" />
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <div className="scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
