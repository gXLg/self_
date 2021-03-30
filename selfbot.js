require ( "cache-require-paths" )

const config = require ( "./config.json" )

console.log ( "\x1b[34m"
  + require ( "figlet" )
  .textSync ( config.name, { font : config.font }))


const ds = require ( config.lib )
const { version: ds_version } = require ( config.lib )
const bot = new ds.Client ( )
const auth = require ( "./auth.json" )
const fetch = require ( "node-fetch" )
const joker = require ( "one-liner-joke" )
const yt = require ( "youtube-random-video" )
const decode = require ( "html-entities" ).decode
const { spawn } = require ( "child_process" )
const kill = require ( "tree-kill" )
const ms = require ( "pretty-ms" )

function getTime ( ) {
  var today = new Date ( )
  var h = today.getHours ( )
  var m = today.getMinutes ( )
  var s = today.getSeconds ( )
  if ( h < 10 ) h = "0" + h
  if ( m < 10 ) m = "0" + m
  if ( s < 10 ) s = "0" + s
  var time = h + ":" + m + ":" + s
  return time
}

function log ( text ) {
  console.log ( "\x1b[34m" + getTime ( ) + "\x1b[m" +
                " | " +  "\x1b[32m" + text + "\x1b[m" )
}

function check_color ( col, message ) {
  if ( col == "role" ) {
    if ( message.member ) {
      var role = message.member.roles.color
      if ( ! role ) col = "#ffffff"
      else col = role.hexColor
    } else col = "#ffffff"
  }
  return col
}

function destroy ( ) {
  log ( "Destroying" )
  kill ( hackPy.pid )
  bot.destroy ( )
}

var hackPy
bot.on ( "ready", ( ) => {
  log ( ":3 logged in as " + bot.user.tag )
  hackPy = spawn ( "python", [ "status.py" ])
  log ( "Spawned status setter" )
  bot.users.fetch ( config.sub ).then ( ch => {
    ch.send ( "subscribed" )
    log ( "Subscribed to private chat" )
  })
})

bot.on ( "invalidated", ( ) => {
  destroy ( )
})

var color = "role"

bot.on ( "message", async message => {
  if ( message.author.tag != bot.user.tag ) return
  if ( message.content.slice ( 0, config.prefix.length ) != config.prefix ) return
  var cmd = message.content.split ( " " ) [ 0 ].slice ( config.prefix.length ).toLowerCase ( )
  var txt = message.content.trim ( ).split ( " " ).slice ( 1 ).join ( " " )
  var name = message.channel.name ?
    ( message.channel.guild.name + ", " + message.channel.name ) :
    ( message.channel.recipient.username )
  log ( "[ " + name  + " ] " + cmd )

  //message.delete ( )

  switch ( cmd ) {
  case "e" :
    message.delete ( )
    var e = new ds.MessageEmbed ( )
      .setColor ( check_color ( color, message ))
      .setDescription ( txt )
    message.channel.send ( e )
    break
  case "info" :
    message.mentions.users.forEach ( men => {
      var t = men.createdAt
      var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
      var timeStr = ( t.getDate < 10 ? "0" : "" ) + t.getDate ( ) + " " +
                    months [ t.getMonth ( )] + " " + t.getFullYear ( )
      var e = new ds.MessageEmbed ( )
        .setColor ( check_color ( color, message ))
        .addField ( "User", men.tag )
        .addField ( "Joined", timeStr )
      message.channel.send ( e )
    })
    break
  case "sub" :
    bot.users.fetch ( txt )
      .then ( ch => ch.send ( "." )
      .then ( msg => {
        msg.delete ( )
        log ( "Subscribed to " + ch.tag )
      }))
    break
  case "col" :
    color = txt == "std" ? config.color : txt
    break
  case "ev" :
    eval ( txt )
    break
  case "hug" :
    var url = "https://some-random-api.ml/animu/hug"
    var settings = { method : "Get" }
    fetch ( url, settings )
      .then ( res => res.json ( ))
      .then ( ( json ) => {
        var member = message.guild ? message.guild.member ( message.author ) : undefined
        var author = ( member && member.nickname ) ? member.nickname : message.author.username
        var hugged
        if ( message.mentions.users.first ( )) {
          member = message.guild ? message.guild.member ( message.mentions.users.first ( )) :  undefined
          hugged = ( member && member.nickname ) ? member.nickname : message.mentions.users.first ( ).username
        } else hugged = ""
        var e = new ds.MessageEmbed ( )
          .setColor ( check_color ( color, message ))
          .setImage ( json.link )
          .setFooter ( author + " hugs " + hugged )
        message.channel.send ( e )
      })
    break
  case "wink" :
    var url = "https://some-random-api.ml/animu/wink"
    var settings = { method : "Get" }
    fetch ( url, settings )
      .then ( res => res.json ( ))
      .then ( ( json ) => {
        var member = message.guild ? message.guild.member ( message.author ) : undefined
        var author = ( member && member.nickname ) ? member.nickname : message.author.username
        var e = new ds.MessageEmbed ( )
          .setColor ( check_color ( color, message ))
          .setImage ( json.link )
          .setFooter ( author + " winks" )
        message.channel.send ( e )
      })
    break
  case "joke" :
    var joke = joker.getRandomJoke ( )
    message.channel.send ( joke.body )
    break
  case "yt" :
    yt.getRandomVid ( auth.ytapi, ( err, data ) => {
      var e = new ds.MessageEmbed ( )
        .setColor ( check_color ( color, message ))
        .setTitle ( decode ( data.snippet.title ))
        .setURL ( "https://youtu.be/" + data.id.videoId )
        .setDescription ( decode ( data.snippet.description ))
        .setFooter ( decode ( data.snippet.channelTitle ))
      message.channel.send ( e )
    })
    break
  case "me" :
    var e = new ds.MessageEmbed ( )
      .setColor ( check_color ( color, message ))
      .setThumbnail ( bot.user.displayAvatarURL ( { dynamic: true }))
      .addField ( "Uptime", `${ ms ( bot.uptime )}`, true )
      .addField ( "Load", `${( process.memoryUsage ( ).rss / 1024 / 1024).toFixed ( 2 )} MB RSS\n ${ ( process.memoryUsage ( ).heapUsed / 1024 / 1024 ).toFixed ( 2 )} MB Heap`, true )
      .addField ( "Ping", `${ bot.ws.ping } ms`, true )
      .addField ( "Guilds", `${ bot.guilds.cache.size }`, true )
      .addField ( "DMs", `${ bot.users.cache.size }`, true )
      .addField ( "NodeJS", `${ process.version } on ${ process.platform } ${ process.arch }`, true )
      .addField ( "discord.js", `${ ds_version }`, true )
    message.channel.send ( e )
    break
  case "x" :
    destroy ( )
    break
  }
})

bot.login ( auth.token )
