require('dotenv').config({ path: '.env' })
const express = require('express')
const xss = require('xss-clean')
const helmet = require('helmet')
const path = require('path')
const morgan = require('morgan')
const rfs = require('rotating-file-stream')
const moment = require('moment')
const webhook = require('discord-webhook-node')
const sanitizer = require('sanitizer')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const app = express()

app.use(xss())
app.use(helmet())
app.use(helmet.permittedCrossDomainPolicies())
app.use(helmet.referrerPolicy({
  policy: 'no-referrer'
}))
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'", 'cdn.tiktok.fail'],
    styleSrc: [
      "'self'",
      'cdn.tiktok.fail',
      'cdn.jsdelivr.net'
    ]
  }
}))
if (app.get('env') === 'development') {
  app.use(helmet.noCache())
}

const routes = require('./routes/index')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

var curDate = moment().format('YYYY.MM.DD-X')
const accessLogStream = rfs.createStream(`access-${curDate}.log`, {
  interval: '1d',
  path: path.join(__dirname, 'logs')
})
app.use(morgan('combined', { stream: accessLogStream }))
app.use(morgan('dev'))

app.use(bodyParser.json({ limit: '10kb' }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', routes)
app.use('/download', express.static(path.join(__dirname, '/routes/videos')))

app.get('/stream', function (req, res) {
  res.render('stream', {
    query: req.query
  })
})

app.get('/contact', function (req, res) {
  res.render('contact', {
    query: req.query
  })
})

app.get('/check', (req, res) => {
  res.sendStatus(200)
})

const hook = new webhook.Webhook(process.env.WEBHOOKURL)
app.use('/contact-relay', function (req, res) {
  if (req.body.reason && req.body.name && req.body.email && req.body.subject && req.body.body) {
    const cleanReason = sanitizer.sanitize(req.body.reason)
    const cleanName = sanitizer.sanitize(req.body.name)
    const cleanEmail = sanitizer.sanitize(req.body.email)
    const cleanSubject = sanitizer.sanitize(req.body.subject)
    const cleanBody = sanitizer.sanitize(req.body.body)

    const contactString = `\`[${cleanReason}]\` **__${cleanName} (${cleanEmail})__** - ${cleanSubject}: \`\`\`${cleanBody}\`\`\``
    // const contactString = `\`[${req.body.reason}]\` **__${req.body.name} (${req.body.email})__** - ${req.body.subject}: \`\`\`${req.body.body}\`\`\``
    const trimmedMessage = contactString.substring(0, 1999)

    hook.send(trimmedMessage)
    res.redirect(301, '/?contact=1')
  } else {
    res.redirect(301, '/?error=1')
  }
})

app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
