/**
 * 暂停操作 ms 毫秒 
 */
function millisecond(ms){
    ms = ms && (ms > 0) ? ms : 0
    return new Promise(resolved => setTimeout(resolved, ms))
}

module.exports = {
    millisecond: millisecond
}