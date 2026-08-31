import Nav from './components/Nav.jsx';
import Hero from './sections/Hero.jsx';
import Duel from './sections/Duel.jsx';
import Cost from './sections/Cost.jsx';
import Delays from './sections/Delays.jsx';
import Timeline from './sections/Timeline.jsx';
import Corridors from './sections/Corridors.jsx';
import Sources from './sections/Sources.jsx';

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Duel />
        <Cost />
        <Delays />
        <Timeline />
        <Corridors />
        <Sources />
      </main>
    </>
  );
}
