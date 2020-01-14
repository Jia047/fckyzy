const log4js = require('log4js')

const DEFAULT_LOG_PATH = '../log'

function getLogger(config) {
    log4js.configure({
        appenders: {
            console: { 'type': 'console' },
            dateFile: {
                type: 'dateFile',
                filename: `${DEFAULT_LOG_PATH}/${config.filename}`,
                pattern: '.yyyy-MM-dd.log',
                // 回滚旧的日志文件时，保证以 .log 结尾 （只有在 alwaysIncludePattern 为 false 生效）
                keepFileExt: true,
                // 输出的日志文件名是都始终包含 pattern 日期结尾
                alwaysIncludePattern: true
            }
        },
        categories: {
            default: { appenders: ['console', 'dateFile'], level: "debug" },
        }
    })

    return log4js.getLogger()
}

module.exports = {
    getLogger: getLogger
}

