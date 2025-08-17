import { useNavigate} from "react-router-dom";

const links = [
  { name: 'GitHub', url: 'https://github.com/fraserelliott' },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/fraser-elliott-77100974/',
  },
];

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer style={styles.footer}>
      &copy; Fraser Elliott 2025 |{' '}
      {links.map((link) => (
        <span key={link.name}>
          <a href={link.url} target="_blank">
            {link.name}
          </a>
          {' | '}
        </span>
      ))}
      <span
        role="link"
        onClick={() => navigate('/dashboard')}
        style={{ cursor: 'pointer' }}
      >
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
