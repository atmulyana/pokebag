# Pokebag

Simple React Native app that mimics https://pokebag.vercel.app/
Just for tutorial purpose.

## Brief guide how to run this project

You should have set up the React Native development environment as described [here](https://reactnative.dev/docs/environment-setup).
Follow "React Native CLI Quickstart".
Next step, download/clone this project. After that, open Terminal/Command console then make the project directory is the active directory of the console

        cd <path_to_project_directory>

Then execute

        npm install

For iOS, the above command must be followed by

        cd ios && pod install && cd ..

Then run Metro server by command

        npx react-native start

Open another Terminal/Command console and go to the project directory too as the before one. At new console, type
the following command

        npx react-native run-ios

or   

        npx react-native run-android

Both command above will launch the ios simulator or android emulator respectively and run the application.
     
NOTE for Android: if the app shows message `Cannot get data from server` then close the existing emulator and try
to run emulator from console by providing a DNS server IP. To do that, open new Terminal/Command console, type the following
commands

        cd <your_android_sdk_directory>/emulator
        emulator -avd <your_avd_name> -dns-server <your_dns_server_ip>

After new android emulator has launched, run again the `run-android` command.  
