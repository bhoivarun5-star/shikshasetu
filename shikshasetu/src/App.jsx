import { useState, useEffect } from 'react';
import Home from './apps/Dashboard/Home.jsx';
import Admin from './apps/Admin/Admin.jsx';
import Login from './apps/login/login.jsx';
import { translations } from './translations.js';

function App() {
  const [route, setRoute] = useState(window.location.pathname);
  const [hash, setHash] = useState(window.location.hash);
  const [language, setLanguage] = useState(() => localStorage.getItem("shikshasetu_lang") || "en");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem("shikshasetu_lang", language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations["en"]?.[key] || key;
  };

  useEffect(() => {
    // Check if user is authenticated
    fetch("/api/user/")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Not authenticated");
      })
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(window.location.pathname);
      setHash(window.location.hash);
    };
    
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    
    const interval = setInterval(() => {
      if (window.location.pathname !== route || window.location.hash !== hash) {
        setRoute(window.location.pathname);
        setHash(window.location.hash);
      }
    }, 250);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
      clearInterval(interval);
    };
  }, [route, hash]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={setUser} />;
  }

  if (route === '/admin' || route === '/admin/' || hash === '#admin') {
    return <Admin language={language} setLanguage={setLanguage} t={t} />;
  }

  return <Home language={language} setLanguage={setLanguage} t={t} user={user} onLogout={() => setUser(null)} />;
}

export default App;
