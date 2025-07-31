import Navbar from './Navbar';

const Header = () => {
  return (
    <div style={styles.container}>
      <h1>Fraser Elliott's Portfolio</h1>
      <Navbar />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'var(--bg-secondary)',
  },
};

export default Header;
