import Navbar from './Navbar';
import OpenSourceBadge from './OpenSourceBadge';
import { useGlobalStore } from './GlobalStoreProvider';

const Header = () => {
  const [currentPage, setCurrentPage] = useGlobalStore('currentPage');

  return (
    <>
      <header style={styles.container}>
        <h1 style={styles.heading} onClick={() => setCurrentPage('home')}>
          Fraser Elliott's Portfolio
        </h1>
        <Navbar />
      </header>
      <OpenSourceBadge />
    </>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'var(--bg-secondary)',
    alignItems: 'center',
    cursor: 'pointer',
  },
  heading: {
    marginLeft: '0.5rem',
  },
};

export default Header;
