import {useState} from 'react';
import {useSession} from '../contexts/SessionContext.jsx';
import {useNavigate} from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {token, loginAsync} = useSession();
  const navigate = useNavigate();

  if (token)
    navigate('/dashboard');

  return (
    <div className="panel w-m text-align-center">
      <form
        className="flex flex-column"
        onSubmit={(e) => {
          e.preventDefault();
          loginAsync(email, password);
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

export default LoginPage;
