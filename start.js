// require('sqreen')
require('dotenv').config({ path: '.env' })
const fs = require('fs')
const path = require('path')
const app = require('./app')
const http = require('http')
const port = normalizePort(process.env.PORT || '3000')

const videoDir = path.join(__dirname, '/routes/videos')
const thumbDir = path.join(__dirname, '/public/thumbs')

if (!fs.existsSync(videoDir)) { fs.mkdirSync(videoDir) }
if (!fs.existsSync(thumbDir)) { fs.mkdirSync(thumbDir) }

app.set('port', port)
const server = http.createServer(app)

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

function normalizePort (val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  }

  if (port >= 0) {
    return port
  }

  return false
}

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

function onListening () {
  var addr = server.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  console.log('Listening on ' + bind)
}
