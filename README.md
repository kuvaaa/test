# minecraft.proxy.bot.gui



## install

git clone git@github.com:lastuniverse/minecraft.proxy.bot.gui.git

cd ./minecraft.proxy.bot.gui

npm install

cd ./node_modules/minecraft-protocol

npm install

cd ../../



## install electron_prebuilt

Download and install the latest build of electron for your OS and add it to your projects package.json as a devDependency:

npm install electron-prebuilt --save-dev

This is the preferred way to use electron, as it doesn't require users to install electron globally.

You can also use the -g flag (global) to symlink it into your PATH:

npm install -g electron-prebuilt

If that command fails with an EACCESS error you may have to run it again with sudo:

sudo npm install -g electron-prebuilt

sudo npm install -g electron


## start App

elecron .



## technical dependencies

The app is a Packed site, and contains a web server (port 8080) and websocket server (port 8081). Also, the application opens the ports specified in the settings (proxy port and port radar if enabled).

## it is important

To see the app interface is also possible via a web interface at the address YOU_IP:8080. If your ports 8080 and 8081 are available from the Internet, anyone can go to the interface of the bot at the address YOU_INTERNET_IP:8080. This can lead to theft of credentials for your minecraft account.

!!! I recommend to close the access from the Internet (and local network) to ports 8080 and 8081
