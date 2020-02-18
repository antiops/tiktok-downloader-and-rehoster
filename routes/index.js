const express = require('express')
const router = express.Router()
const request = require('request')
const path = require('path')
const crypto = require('crypto')
const fs = require('fs')

router.get('/', function (req, res, next) {
  res.render('index', {
    query: req.query
  })
})

router.post('/video', function (req, res, next) {
  const url = req.body.url
  pattern = /^((?:https?:)?\/\/)?((?:m|vm|vt|www)\.)??((?:tiktok\.com))\/((?:[\w\-]{6}(?:\/|))|[@](\S+))/
  const cleanurl = url.split('?')[0]
  const hash = crypto.createHash('md5').update(cleanurl).digest('hex')

  request.get(url, function (err, resp, body) {
    if (pattern.test(cleanurl)) {
      if (fs.existsSync(path.join(__dirname, '/videos/' + hash + '.mp4'))) {
        res.redirect(301, '/stream?v=' + hash)
      } else {
        console.log(`Downloading [${hash}] ${cleanurl}`)
        /*
         *  Download logic (removed because its messy and probably vulnerable)
         */
        res.redirect(301, '/stream?v=' + hash)
      }
    } else {
   // res.json({ status: "invalid url, try again using the format listed on our homepage" })
      res.render('stream', {
        error: 'The link you provided is not a valid url'
      })
    }
  })
})

module.exports = router
