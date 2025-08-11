import { useState } from 'react';
import { useGlobalStore, useToast } from './GlobalStoreProvider';
import api from '../api.jsx';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginData, setLoginData] = useGlobalStore('loginData');
  const { addToastMessage } = useToast()

  const attemptLogin = async () => {
    try {
      const res = await api.post('/api/auth', { email, password });
      sessionStorage.setItem('loginData', JSON.stringify(res.data));
      setLoginData(res.data);
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
