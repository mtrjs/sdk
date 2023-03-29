class Logger {
  _log(level: Console, ...rest: any) {}
  log(...rest: Parameters<Console['log']>) {
    logger.log(...rest);
  }
  info(...rest: Parameters<Console['info']>) {
    console.info(...rest);
  }
}

const logger = new Logger();

export default logger;
