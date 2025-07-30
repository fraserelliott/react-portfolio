const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>
        &copy; Fraser Elliott 2025 |{' '}
        <a href="https://github.com/fraserelliott" target="_blank">
          GitHub
        </a>{' '}
        |{' '}
        <a
          href="https://www.linkedin.com/in/fraser-elliott-77100974/"
          target="_blank"
        >
          LinkedIn
        </a>
      </p>
    </footer>
  );
};

// Inline styles for simplicity
// TODO: CSS variables
const styles = {
  footer: {
    backgroundColor: '#333',
    color: '#fff',
    textAlign: 'center',
    padding: '10px',
  },
};

export default Footer;
