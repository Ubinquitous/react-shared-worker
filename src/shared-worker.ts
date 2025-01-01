// eslint-disable-next-line no-restricted-globals, @typescript-eslint/no-explicit-any
const workerSelf = self as any;
const ports: MessagePort[] = [];

workerSelf.addEventListener("connect", (event: MessageEvent) => {
  const [port] = event.ports;
  ports.push(port);

  port.addEventListener("message", (messageEvent: MessageEvent) => {
    const { data } = messageEvent;
    ports.forEach((connectedPort) => {
      connectedPort.postMessage(data);
    });
  });

  port.addEventListener("messageerror", (errorEvent) => {
    console.error(errorEvent.data);
  });

  port.start();
});

export {};
