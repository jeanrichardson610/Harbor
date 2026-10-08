import { useEffect, useState } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { Switch } from '@harbor/ui';
import { Banking } from './pages/Banking';
import { Weather } from './pages/Weather';
import { Anime } from './pages/Anime';

export function App() {
  const [dark, setDark] = useState(() => matchMedia('(prefers-color-scheme: dark)').matches);
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; }, [dark]);

  return (
    <div className="shell">
      <a className="skip" href="#main">Skip to content</a>
      <aside className="side">
        <div className="brand">Harbor<span>Dashboards</span></div>
        <nav aria-label="Dashboards">
          <NavLink to="/banking">Banking</NavLink>
          <NavLink to="/weather">Weather</NavLink>
          <NavLink to="/anime">Anime</NavLink>
        </nav>
        <Switch label="Dark mode" checked={dark} onChange={(e) => setDark(e.target.checked)} />
      </aside>
      <main id="main" className="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Navigate to="/banking" replace />} />
          <Route path="/banking" element={<Banking />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/anime" element={<Anime />} />
          <Route path="*" element={<Navigate to="/banking" replace />} />
        </Routes>
      </main>
    </div>
  );
}
