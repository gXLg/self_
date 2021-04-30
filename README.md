**Finally, the big `v10` Update is here!**

I will first update the README in parts, and then upload the code.
Please be patient.

To setup `config.json` and `config.ini` fill in the values,
how it is said in the files.

Start the application with `node selfbot.js`.
NodeJS 12+ is required

All the modules are at my home folder,
that's why I don't have them listed here.
List of modules will be added in `v11/12`.


**Changes**

*Language support*

The version `v10` adds language support,
which means you can translate the bot into your language.

For that create a new language file in `lang/`
and specify it in the config.

For example, if you want to translate the bot into russian:

1) Create a copy of original `en.json` and name it `ru.json`.
2) Specify in `config.json`: `"lang" : "ru"`.
3) Don't forget to specify the prediction layout.
I will talk about prediction module later.

*Commands/Modules*

All commands with language support use a reference to `functions.js`.
It returns the `lang` variable, which is the language object.
* Commands use `functions.lang.modules` for translations.
* Command names use `functions.lang.commands.category_folder`
* Category names use `functions.lang.categories`

When adding new command, don't forget about these three points
and make related entries.

I am working from mobile, and therefore can't upload folders.
That's why I have uploaded a zip file with all the commands.
Unzip the file in `commands/`.

**Prediction module**

Helps to predict typed commands, based on keyboard layout.
I have created a module `gxlg_predict`,
see description at [npm](https://www.npmjs.com/package/gxlg_predict)

**Future**

Future updates will include:
* Add russian translation
* Create app for correct adding of commands
* ...

**Disclaimer**

Don't say, you don't like my code, I have not written it for you.

Please be careful, because self-botting is against Discord's Terms of Service and can get you banned.
I am not responsible for you and your actions.
Of course, this source code can also be used for a normal bot.
(Only the status part won't work well)

License: ah, you may use it in any way, and even modify it and sell it. Only not claim it to be yours.
