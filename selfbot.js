require ( "cache-require-paths" )


const config = require ( "./config.json" )
const functions = require ( "./functions.js" )
console.log ( "\x1b[34m"
  + require ( "figlet" )
  .textSync ( config.name, { font : config.font }))

function require_ ( module ) {
  delete require.cache [ require.resolve ( module ) ]
  return require ( module )
}


const fs = require ( "fs" )
const glob = require ( "glob" )
function get_commands ( ) {
  var dirs = fs.readdirSync ( "./commands", { withFileTypes : true })
    .filter ( dirent => dirent.isDirectory ( ))
    .map ( dirent => dirent.name )
  var commands = { }
  dirs.forEach ( dir => {
    commands [ dir ] = glob.sync ( "commands/" + dir + "/" + "*.js" )
      .map ( name => name.slice ( 0, -3 ).split ( "/" ) [ 2 ])
  })
  return commands
}
var commands = get_commands ( )


const ds = require ( config.lib )
const bot = new ds.Client ( )
const ini = require ( "iniparser" )
const auth = ini.parseSync ( "./config.ini" )


bot.on ( "ready", ( ) => {
  functions.log ( ":3 logged in as " + bot.user.tag )
  bot.users.fetch ( config.sub ).then ( ch => {
    ch.send ( "subscribed" )
    functions.log ( "Subscribed to private chat" )
  })
})


bot.on ( "invalidated", ( ) => {
  functions.log ( "Invalidated" )
  destroy ( )
})


global.color = "role"
bot.on ( "message", async message => {
  if ( message.author.tag != bot.user.tag ) return
  if ( message.content.slice ( 0, config.prefix.length ) != config.prefix ) return
  var cmd = message.content.split ( " " ) [ 0 ].slice ( config.prefix.length ).toLowerCase ( )
  var txt = message.content.trim ( ).split ( " " ).slice ( 1 ).join ( " " )
  var args = txt.split ( " " )
  var name = message.channel.name ?
    ( message.channel.guild.name + ", " + message.channel.name ) :
    ( message.channel.recipient.username )
  var cmds = [ ]
  var fixed = true
  for ( var c in commands ) cmds = cmds.concat ( commands [ c ])
  if ( ! cmds.includes ( cmd )) {
    functions.log ( "got wrong command " + cmd )
    fixed = false
    var predict = require_ ( "gxlg_predict" )
    var p = predict ( cmds, cmd )
    if ( p ) {
      fixed = true
      cmd = p
      functions.log ( "=> fixed" )
    } else functions.log ( "=> could not fix" )
  }
  var executed = false
  if ( ! fixed ) return
  for ( var i in commands ) {
    if ( commands [ i ].includes ( cmd )) {
      var c = require_ ( "./commands/" + i + "/" + cmd )
      var parameter = c.dependencies.map ( d => eval ( d ))
      c ( ... parameter )
      executed = true
      break
    }
  }
  if ( executed ) functions.log ( "[ " + name  + " / " + cmd + " ] " )
})


bot.login ( auth.user.token )
