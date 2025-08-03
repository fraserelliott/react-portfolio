const ConfirmPopup = ({
  text,
  onConfirm,
  onCancel,
  confirmClass,
  cancelClass,
}) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <p style={styles.text}>{text}</p>
        <div style={styles.buttonRow}>
          <button
            onClick={() => onCancel()}
            className={cancelClass ? cancelClass : ''}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm()}
            className={confirmClass ? confirmClass : ''}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
  },
  container: {
    background: 'var(--bg-secondary)',
    padding: '1rem',
    borderRadius: '0.25rem',
    display: 'flex',
    flexDirection: 'column',
    border: 'var(--glass-border)',
    boxShadow:
      'inset 0 0 8px rgba(255, 255, 255, 0.1),  0 0 10px rgba(0, 0, 0, 0.5)',
  },
  text: {
    marginTop: '2rem',
    marginBottom: '2rem',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-around',
  },
};

export default ConfirmPopup;
