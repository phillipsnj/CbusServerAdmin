var winston = require('winston');

/*
for rerference only, default npm logging levels used
lower number being higher priority
const levels = { 
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};
*/

// custom format to put timestamp first
var timeStampFirst = winston.format.combine(
  winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
  winston.format.printf((info) => {
    return JSON.stringify({timestamp: info.timestamp, 
                           level: info.level, 
                           message: info.message});
}));


var options = {
  file: {
    level: 'info',
    filename: `./tests/logs/tests.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
	format: timeStampFirst
  },
  console: {
    level: 'warn',
    handleExceptions: true,
    json: false,
    colorize: true,
	format: timeStampFirst
  },
};

var logger = new winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
});


logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  },
};


module.exports = logger;
