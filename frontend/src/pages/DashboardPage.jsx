import { useGlobalStore } from '../components/GlobalStoreProvider';
import Dashboard from '../components/Dashboard';
import LoginForm from '../components/LoginForm';

const DashboardPage = () => {
  const [loginData, setLoginData] = useGlobalStore('loginData');

  return (
    <>
      {!loginData && <LoginForm />}
      {loginData && <Dashboard />}
    </>
  );
};

export default DashboardPage;
