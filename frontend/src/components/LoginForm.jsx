import { useState } from 'react';
import { useGlobalStore } from './GlobalStoreProvider';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginData, setLoginData] = useGlobalStore('loginData');

  const attemptLogin = () => {
    fetch('http://127.0.0.1:3001/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (!res.ok) {
          // TODO: error message
          return Promise.reject();
        }
        return res.json();
      })
      .then((data) => {
        sessionStorage.setItem('loginData', JSON.stringify(data));
        setLoginData(data);
      })
      .catch((error) => {
        // TODO: error message
        console.error(err);
      });
  };

  return (
    <main className="panel w-m text-align-center">
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
    </main>
  );
};

export default LoginForm;
