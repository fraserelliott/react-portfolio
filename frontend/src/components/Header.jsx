import Navbar from './Navbar';
import OpenSourceBadge from './OpenSourceBadge';

const Header = () => {
  return (
    <>
      <header style={styles.container}>
        <h1 style={styles.heading}>Fraser Elliott's Portfolio</h1>
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
  },
  heading: {
    marginLeft: '0.5rem',
  },
};

export default Header;
