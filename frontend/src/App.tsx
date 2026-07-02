import { useEffect, useState } from 'react';
import { fetchHealth } from './services/api';
import './App.css';

function App() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'ok' | 'error'>('checking');

  useEffect(() => {
    fetchHealth()
      .then((data) => setApiStatus(data.status === 'ok' ? 'ok' : 'error'))
      .catch(() => setApiStatus('error'));
  }, []);

  return (
    <main className="app">
      <h1>Support Ticket Management System</h1>
      <p className="api-status" data-status={apiStatus}>
        API status:{' '}
        {apiStatus === 'checking' && 'Checking...'}
        {apiStatus === 'ok' && 'Connected'}
        {apiStatus === 'error' && 'Unable to reach backend'}
      </p>
    </main>
  );
}

export default App;
