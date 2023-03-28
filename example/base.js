import Reporter, { Browser } from '../monitor';

const monitor = new Reporter({
  appId: '',
  dsn: '',
  plugins: [new Browser()],
});
