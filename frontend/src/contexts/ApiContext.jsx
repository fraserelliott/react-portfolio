import {createContext, useContext, useCallback, useMemo} from "react";
import {useToast} from "./ToastContext.jsx";

export const ApiContext = createContext({runApi: async () => null});

export function ApiProvider({children}) {
  const {addToastMessage} = useToast();

  const handleApiError = useCallback((err, fallbackMsg) => {
    addToastMessage(
      err?.response?.data?.error || err?.message || fallbackMsg,
      "error"
    );
  }, [addToastMessage]);

  /**
   * Executes an API request with standardized error handling and optional success/error logic.
   * @template T
   * @param {Promise<import("axios").AxiosResponse<T>>} promise
   * @param {(data: T) => void} [onSuccess]
   * @param {string} [fallbackMsg]
   * @param {(err: any) => void} [onError]
   * @returns {Promise<T|null>}
   */
  const runApi = useCallback(async (promise, onSuccess, fallbackMsg, onError) => {
    try {
      const {data} = await promise;
      if (onSuccess) onSuccess(data);
      return data;
    } catch (err) {
      if (onError) onError(err);
      else handleApiError(err, fallbackMsg);
      return null;
    }
  }, [handleApiError]);

  const value = useMemo(() => ({runApi}), [runApi]);

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}

export const useApi = () => useContext(ApiContext);