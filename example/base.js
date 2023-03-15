import Monitor, { Browser } from '../monitor';

const monitor = new Monitor({
  appId: '',
  plugins: [new Browser()],
});
