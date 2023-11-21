const { createLogger, transports, format } = require('winston')
const fs = require('fs')
const path = require('path')

 

const appLogger = createLogger({
  transports: [
    new transports.File({
      filename: 'errors.log',
      dirname: './logs',
      level: 'error',
      colorize: true,
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
})

module.exports = { appLogger }
