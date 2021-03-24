# code by eidolonrp

from discord.ext import commands
import discord
import uuid
import configparser

config = configparser.ConfigParser()
config.read("config.ini")

bot = commands.Bot(command_prefix="℅", self_bot=True)

@bot.event
async def on_ready():

        assets = dict(
                large_image=config["assets"]["largeimage"],
                large_text=config["assets"]["largetext"],
        )

        activity_args = dict(
                application_id=config.getint("activity", "appid"),
                name=config["activity"]["name"],
                state=config["activity"]["state"],
                details=config["activity"]["details"],
                assets=assets,
                type=config.getint("activity", "type")
        )

        activity = discord.Activity(**activity_args)
        await bot.change_presence(activity=activity, status=config["activity"]["status"])
        print("Changed rich presence.")

bot.run(config["user"]["token"], bot=False)
