import React, { useState } from "react";
import { SharedWorkerProvider, useSharedWorkerContext } from "./SharedWorker";

const App = () => {
  return (
    <SharedWorkerProvider>
      <Component />
    </SharedWorkerProvider>
  );
};

const Component = () => {
  const { result, postMessage } = useSharedWorkerContext();
  const [message, setMessage] = useState("");

  const handleSendSharedWorkerMessage = () => {
    postMessage(message);
    setMessage("");
  };

  return (
    <div>
      <h1>shared text : {result}</h1>
      <input
        onChange={({ target: { value } }) => setMessage(value)}
        value={message}
      />
      <button onClick={handleSendSharedWorkerMessage}>send</button>
    </div>
  );
};

export default App;
