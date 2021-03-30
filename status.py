# code partially by kairusds

from discord.ext import commands
import discord
import uuid
import configparser
import signal, asyncio

config = configparser.ConfigParser ( )
config.read ( "config.ini" )

bot = commands.Bot ( command_prefix = None, self_bot = True )

async def destroy ( ) :
  await bot.change_presence ( activity = None )
  await bot.logout ( )
  await bot.close ( )
  asyncio.get_event_loop ( ).stop ( )

@bot.event
async def on_ready ( ):
  assets = dict (
    large_image = config [ "assets" ] [ "largeimage" ],
    large_text = config [ "assets" ] [ "largetext" ],
  )

  activity_args = dict (
    application_id = config.getint ( "activity", "appid" ),
    name = config [ "activity" ] [ "name" ],
    state = config [ "activity" ] [ "state" ],
    details = config [ "activity" ] [ "details" ],
    assets = assets,
    type = config.getint ( "activity", "type" )
  )

  activity = discord.Activity ( **activity_args )
  await bot.change_presence(activity=activity, status=config["activity"]["status"])
  loop = asyncio.get_event_loop ( )
  loop.add_signal_handler ( signal.SIGTERM, lambda: asyncio.create_task ( destroy ( )))

bot.run ( config [ "user" ] [ "token" ], bot = False )
