const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>&copy; 2025 My App. All rights reserved.</p>
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
