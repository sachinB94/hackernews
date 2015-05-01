path = require 'path'

Hapi = require 'hapi'
server = new Hapi.Server process.env.PORT || 3000

server.views
  engines:
    jade: require 'jade'
  path: path.join __dirname, 'templates'

server.route
  method: 'GET'
  path: '/{filename*}'
  handler:
    directory:
      path: __dirname + '/public'
      listing: false
      index: false

server.route
  method: 'GET'
  path: '/'
  handler: (req, reply) ->
    reply.view 'index'

server.route
  method: 'POST'
  path: '/sentMessage'
  handler: (req, reply) ->
    nodemailer = require 'nodemailer'
    transporter = nodemailer.createTransport()
    transporter.sendMail({
      host: "host"
      port : "25"
      domain: "smtp.sendgrid.net"
      authentication: "login"
      username: (new Buffer("sachinb94")).toString("base64")
      password: (new Buffer("sendgridPASS12345")).toString("base64")
      from: 'noreply@sachinbansal.herokuapp.com'
      to: 'sachinbansal94@gmail.com'
      subject: 'sachinbansal.herokuapp.com - FROM: ' + req.payload.name + ' (' + req.payload.email  + ' - ' + req.payload.phone + ')'
      text: req.payload.message
    }, (err, info) ->
      reply err, info
    )

server.route
  method: 'GET'
  path: '/resume'
  handler: (req, reply) ->
    reply.file(__dirname + '/public/docs/RESUME.pdf').type('application/pdf')

server.start(->
  console.log 'Server running at ' + process.env.PORT + ' or 3000'
)