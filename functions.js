const { spawn } = require ( "child_process" )

function get_time ( ) {
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
  console.log ( "\x1b[34m" + get_time ( ) + "\x1b[m" +
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

const kill = require ( "tree-kill" )

function destroy ( bot ) {
  log ( "Destroying" )
  status_off ( )
  bot.destroy ( )
}

function status_on ( ) {
  if ( global.status ) return
  global.status = true
  global.hack_py = spawn ( "python", [ "status.py" ])
}

function status_off ( ) {
  if ( ! global.status ) return
  global.status = false
  kill ( hack_py.pid )
}

module.exports = { "log" : log,
                   "check_color" : check_color,
                   "destroy" : destroy,
                   "status_on" : status_on,
                   "status_off" : status_off }
