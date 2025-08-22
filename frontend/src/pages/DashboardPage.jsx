import Dashboard from '../components/Dashboard';
import {useSession} from '../contexts/SessionContext.jsx';

const DashboardPage = () => {
  const {token} = useSession();

  if (!token) return null;
  else return <Dashboard/>
};

export default DashboardPage;
