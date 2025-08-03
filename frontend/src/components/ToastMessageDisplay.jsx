import { useGlobalStore } from './GlobalStoreProvider';

const ToastMessageDisplay = () => {
  const [toastMessages, setToastMessages] = useGlobalStore('toastMessages');

  const calculateStyle = (toast) => {
    const style =
      toast.type === 'success'
        ? styles.success
        : toast.type === 'error'
        ? styles.error
        : styles.toast;

    return toast.fading ? { ...style, ...styles.hide } : styles.toast;
  };

  return (
    <div style={styles.container}>
      {toastMessages.map((toast) => {
        return (
          <p key={toast.id} style={calculateStyle(toast)}>
            {toast.message}
          </p>
        );
      })}
    </div>
  );
};

const toastStyle = {
  opacity: '0.8',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  padding: '1rem',
  borderRadius: '0.4rem',
  zIndex: '1100',
  margin: '1rem',
  transition: 'opacity 0.15s ease-out',
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  toast: toastStyle,
  success: {
    ...toastStyle,
    backgroundColor: '#6fcf97',
    color: 'black',
  },
  error: {
    ...toastStyle,
    backgroundColor: '#f44336',
    color: 'white',
  },
  hide: {
    opacity: '0',
  },
};

export default ToastMessageDisplay;
