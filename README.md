# minecraft.proxy.bot.gui

If you have 2 or more account minecraft and you are tired to switch between them constantly to restart the client, this app is for you. 

The application is a proxy server for minecraft. It uses the development group of enthusiasts: ![https://github.com/PrismarineJS/node-minecraft-protocol](https://github.com/PrismarineJS/node-minecraft-protocol)

The application also incorporates bot ![https://github.com/rom1504/rbot](https://github.com/rom1504/rbot)

Launch of bot is optional. If the bot starts running enabled every time when you will go out from the proxy, instead you will have to enter the bot.


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

![screenshot](https://img-fotki.yandex.ru/get/68946/196117532.1/0_13090b_c4fc4dbf_orig.png)


## connection. 

1 Run the application. 
2 Configure it (specify the server on which I play, the account under which the application will run). 
3 Add in your client minecraft new server: localhost:proxy_port (for example: localhost:25568). 
4 Connect to this server. 

You will be redirected to the server specified in the application settings under the account specified in the application settings.

## technical dependencies

The app is a Packed site, and contains a web server (port 8080) and websocket server (port 8081). Also, the application opens the ports specified in the settings (proxy port and port radar if enabled).

## it is important

To see the app interface is also possible via a web interface at the address YOU_IP:8080. If your ports 8080 and 8081 are available from the Internet, anyone can go to the interface of the bot at the address YOU_INTERNET_IP:8080. This can lead to theft of credentials for your minecraft account.

Also attackers with some effort can get full access to your file system. 

## !!! To avoid this i strongly recommend to close the access from the Internet (and local network) to ports 8080 and 8081
