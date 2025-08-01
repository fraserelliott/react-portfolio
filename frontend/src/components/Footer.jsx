import { useGlobalStore } from './GlobalStoreProvider';

const links = [
  { name: 'GitHub', url: 'https://github.com/fraserelliott' },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/fraser-elliott-77100974/',
  },
];

const Footer = () => {
  const [currentPage, setCurrentPage] = useGlobalStore('currentPage');

  return (
    <footer style={styles.footer}>
      &copy; Fraser Elliott 2025 |{' '}
      {links.map((link) => (
        <span key={link.name}>
          <a href={link.url}>{link.name}</a>
          {' | '}
        </span>
      ))}
      <span role="link" onClick={() => setCurrentPage('dashboard')}>
        🔧
      </span>
    </footer>
  );
};

// Inline styles for simplicity
const styles = {
  footer: {
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    textAlign: 'center',
    padding: '10px',
  },
};

export default Footer;
