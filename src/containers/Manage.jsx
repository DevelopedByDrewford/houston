import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/containers/manage.css';

export default function Manage() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch {
      setLoginError('Invalid email or password.');
    } finally {
      setLoginLoading(false);
    }
  }

  if (authLoading) {
    return <p className="manage__loading">Loading...</p>;
  }

  if (!user) {
    return (
      <div className="manage">
        <div className="manage__header">
          <h1>Manage Dashboard</h1>
          <p>Sign in to access admin tools.</p>
        </div>
        <form className="manage__login" onSubmit={handleLogin}>
          <label className="manage__label">
            Email
            <input
              className="manage__input"
              type="email"
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
              required
              autoFocus
            />
          </label>
          <label className="manage__label">
            Password
            <input
              className="manage__input"
              type="password"
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
              required
            />
          </label>
          {loginError && <p className="manage__error">{loginError}</p>}
          <button className="manage__submit-btn" type="submit" disabled={loginLoading}>
            {loginLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="manage">
      <div className="manage__header">
        <h1>Manage Dashboard</h1>
        <p>
          Signed in as {user.email}&nbsp;·&nbsp;
          <button className="manage__signout-btn" onClick={() => signOut(auth)}>Sign out</button>
        </p>
      </div>

      <div className="manage__body">
        <section className="manage__section">
          <h2 className="manage__section-title">Locations</h2>
          <div className="manage__grid">
            <Link to="/manage/locations/add" className="manage__card">
              <span className="manage__card-title">Add Location</span>
              <span className="manage__card-desc">Submit a new spot to the guide.</span>
            </Link>
            <Link to="/manage/locations" className="manage__card">
              <span className="manage__card-title">Manage Locations</span>
              <span className="manage__card-desc">Edit or delete existing locations.</span>
            </Link>
          </div>
        </section>

        <section className="manage__section">
          <h2 className="manage__section-title">Neighborhoods</h2>
          <div className="manage__grid">
            <Link to="/manage/neighborhoods/add" className="manage__card">
              <span className="manage__card-title">Add Neighborhood</span>
              <span className="manage__card-desc">Add a new neighborhood to the atlas.</span>
            </Link>
            <Link to="/manage/neighborhoods" className="manage__card">
              <span className="manage__card-title">Manage Neighborhoods</span>
              <span className="manage__card-desc">Edit or delete existing neighborhoods.</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
