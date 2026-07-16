import { NavLink, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="layout">
      <header className="layout__header">
        <div className="layout__brand">
          <NavLink to="/" className="layout__title">
            Support Tickets
          </NavLink>
        </div>
        <nav className="layout__nav" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `layout__nav-link${isActive ? ' layout__nav-link--active' : ''}`
            }
          >
            Ticket List
          </NavLink>
          <NavLink
            to="/tickets/new"
            className={({ isActive }) =>
              `layout__nav-link${isActive ? ' layout__nav-link--active' : ''}`
            }
          >
            Create Ticket
          </NavLink>
        </nav>
      </header>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
}
