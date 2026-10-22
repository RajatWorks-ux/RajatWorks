import "./DesktopViewportGate.css";

const DesktopViewportGate = () => (
  <main className="desktop-viewport-gate" aria-labelledby="viewport-gate-title">
    <header className="viewport-gate-header">
      <a className="viewport-gate-wordmark" href="/" aria-label="RajatWorks home">RW<span>.</span></a>
      <span className="viewport-gate-index">PORTFOLIO / DESKTOP EDITION</span>
    </header>

    <section className="viewport-gate-content">
      <p className="viewport-gate-eyebrow">A FULL-SCALE EXPERIENCE</p>
      <h1 id="viewport-gate-title">Please use<br /><span>full screen.</span></h1>
      <p className="viewport-gate-copy">
        Maximize this browser window to explore the portfolio as it was designed.
        The interactive 3D experience is built for a wider view.
      </p>
      <div className="viewport-gate-rule" />
      <div className="viewport-gate-footer">
        <span>RAJAT KUMAR DUA</span>
        <span>FULL-STACK DEVELOPER · UI/UX DESIGNER</span>
      </div>
    </section>

    <div className="viewport-gate-corner" aria-hidden="true">RW / 01</div>
  </main>
);

export default DesktopViewportGate;
