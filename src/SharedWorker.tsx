import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface SharedWorkerProps {
  result: string | null;
  postMessage: (message: string) => void;
}

const worker = new SharedWorker(new URL("shared-worker", import.meta.url), {
  type: "module",
});

type Nullable<T> = T | undefined;

const SharedWorkerContext =
  createContext<Nullable<SharedWorkerProps>>(undefined);

export const SharedWorkerProvider = ({ children }: { children: ReactNode }) => {
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    worker.port.start();

    worker.port.onmessage = (e: MessageEvent<string>) => {
      setResult(e.data);
    };

    worker.port.onmessageerror = (e) => {
      console.error(e);
    };

    return () => {
      worker.port.close();
    };
  }, []);

  const postMessage = useCallback((message: string) => {
    worker.port.postMessage(message);
  }, []);

  return (
    <SharedWorkerContext.Provider value={{ result, postMessage }}>
      {children}
    </SharedWorkerContext.Provider>
  );
};

export const useSharedWorkerContext = () => {
  const context = useContext(SharedWorkerContext);
  if (!context) {
    throw new Error(
      "useSharedWorkerContext should be used within SharedWorkerContextProvider."
    );
  }
  return context;
};
