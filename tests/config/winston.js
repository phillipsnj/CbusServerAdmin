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
	options: { flags: 'w' },
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

//
// Use inbuilt default logger instead of creating another logger
// then config only has to be specified once, and otehr included modules just need require 'winston/js' with no config
// and they will pickup the default logger - thus allowing different root programs to specify different configs
// i.e. different configs for run and test fo example
// default logger is essentially a blank logger, and has no transports setup, so need to add them
//

winston.add(new winston.transports.File(options.file));
winston.add(new winston.transports.Console(options.console));


winston.stream = {
  write: function(message, encoding) {
    winston.info(message);
  },
};

module.exports = winston;
