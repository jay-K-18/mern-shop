// Shared two-panel layout for Login and Register.
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth">
      <aside className="auth-side">
        <span className="brand brand-light">haat</span>
        <div>
          <h2>Everyday things, picked with care.</h2>
          <p>Log in to save your cart and check out faster.</p>
        </div>
      </aside>
      <main className="auth-main">
        <div className="auth-box">
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
          {children}
          <p className="muted small auth-footer">{footer}</p>
        </div>
      </main>
    </div>
  );
}
