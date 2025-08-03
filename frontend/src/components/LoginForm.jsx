import { useState } from 'react';
import { useGlobalStore } from './GlobalStoreProvider';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginData, setLoginData] = useGlobalStore('loginData');

  const attemptLogin = async () => {
    try {
      const res = await fetch('http://127.0.0.1:3001/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorMsg = await res.text();
        addToastMessage(errorMsg, 'error');
        throw new Error('Login request failed');
      }

      const data = await res.json();
      sessionStorage.setItem('loginData', JSON.stringify(data));
      setLoginData(data);
    } catch (err) {
      addToastMessage(err.message || 'Error logging in.', 'error');
    }
  };

  return (
    <div className="panel w-m text-align-center">
      <form
        className="flex flex-column"
        onSubmit={(e) => {
          e.preventDefault();
          attemptLogin();
        }}
      >
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
