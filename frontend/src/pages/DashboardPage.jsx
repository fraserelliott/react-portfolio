import Dashboard from '../components/Dashboard';
import LoginForm from '../components/LoginForm';
import {useSession} from '../contexts/SessionContext.jsx';

const DashboardPage = () => {
  const {token} = useSession();

  if (token) return <LoginForm/>;
  else return <Dashboard/>
};

export default DashboardPage;
