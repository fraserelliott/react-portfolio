import {useState} from 'react';
import {useSession} from '../contexts/SessionContext.jsx';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login} = useSession();

  return (
    <div className="panel w-m text-align-center">
      <form
        className="flex flex-column"
        onSubmit={(e) => {
          e.preventDefault();
          login(email, password);
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
