import { useGlobalStore } from '../components/GlobalStoreProvider';
import Dashboard from '../components/Dashboard';
import LoginForm from '../components/LoginForm';

const DashboardPage = () => {
  const [authorised, setAuthorised] = useGlobalStore('authorised');

  return (
    <>
      {!authorised && <LoginForm />}
      {authorised && <Dashboard />}
    </>
  );
};

export default DashboardPage;
