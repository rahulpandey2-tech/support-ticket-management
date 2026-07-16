import { NavLink, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <NavLink to="/" className="app-brand">
            <span className="app-brand__icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.75" />
                <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </span>
            <span className="app-brand__text">
              <span className="app-brand__title">Support Desk</span>
              <span className="app-brand__tagline">Ticket Management</span>
            </span>
          </NavLink>
          <nav className="app-nav" aria-label="Main navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `app-nav__link${isActive ? ' app-nav__link--active' : ''}`
              }
            >
              Tickets
            </NavLink>
            <NavLink
              to="/tickets/new"
              className={({ isActive }) =>
                `app-nav__link app-nav__link--cta${isActive ? ' app-nav__link--active' : ''}`
              }
            >
              + New Ticket
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <span>Support Ticket Management System</span>
        <span className="app-footer__sep">·</span>
        <span>Core Exercise</span>
      </footer>
    </div>
  );
}
