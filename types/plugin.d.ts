interface IPlugin {
  name: string;
  apply(instance: Monitor): void;
  abstract send: Send
}