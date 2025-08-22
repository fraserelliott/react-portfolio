import {createContext, useState, useContext, useCallback, useMemo} from "react";
import {v4 as uuid} from "uuid";

const ToastContext = createContext({
  toastMessages: [], addToastMessage: () => {
  }
});

export function ToastProvider({children, fadeMs = 150, defaultDelayMs = 2350}) {
  const [toastMessages, setToastMessages] = useState([]);

  const addToastMessage = useCallback(
    (message, type, delayMs = defaultDelayMs) => {
      const id = uuid();
      setToastMessages((prev) => [...prev, {id, message, type, fading: false}]);

      const fadeTimer = window.setTimeout(() => {
        setToastMessages((prev) =>
          prev.map((msg) => (msg.id === id ? {...msg, fading: true} : msg))
        );
        window.setTimeout(() => {
          setToastMessages((prev) => prev.filter((msg) => msg.id !== id));
        }, fadeMs);
      }, delayMs);

      // optional: return a cancel function if you ever need it
      return () => window.clearTimeout(fadeTimer);
    },
    [defaultDelayMs, fadeMs]
  );

  const value = useMemo(
    () => ({toastMessages, addToastMessage}),
    [toastMessages, addToastMessage]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  return useContext(ToastContext);
}