const isDev = process.env.NODE_ENV === 'development';
const noop = () => {};

export const logger = {
  log: isDev ? console.log.bind(console) : noop,
  error: isDev ? console.error.bind(console) : noop,
  warn: isDev ? console.warn.bind(console) : noop,
  info: isDev ? console.info.bind(console) : noop,
  debug: isDev ? console.debug.bind(console) : noop,
};

export default logger;
