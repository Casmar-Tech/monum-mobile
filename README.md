# Monum Docs

## Initial Setup
In your mac, put the following contets on you `~/.netrc` file:
```bash
machine api.mapbox.com
    login mapbox
    password <FROM_1PASSWORD>
```
In XCode (make sure to open the `monum.xcworkspace` file), remove all the default downloaded simulators and only leave the `iPhone 15 Pro Max`, to safe space. <br>
Go to the Firebase console and download the `GoogleService-Info.plist` from the iOS app, and put it in this project inside the `ios` folder. We have to do this because it's a secret file and it's on the gitignore. <br>
Also, sign in with your Apple Id in XCode so then we will be able to distribute new version of the app to the App Store. <br>
Then, install some of the dependencies for this project:
```bash
brew install watchman
brew tap homebrew/cask-versions
brew install --cask zulu17
```
Check that indeed the JVM is installed in this path: `/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home`
And make sure that in your `.zshrc` you have set the `JAVA_HOME` variable:
```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
```
Install Android Studio: https://developer.android.com/studio
And follow this guide: https://reactnative.dev/docs/environment-setup?guide=native&platform=android, specifically the `Android development environment` section to setup correctly Android Studio. <br><br>

From 1 password, download the `monum-upload-key.keystore` and place the file into `android/app` folder.
Then in your `~/.gradle/gradle.properties` file, add the following lines:
```properties
MYAPP_UPLOAD_STORE_FILE=monum-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=monum-key
MYAPP_UPLOAD_STORE_PASSWORD=<FROM-1PASSWORD>
MYAPP_UPLOAD_KEY_PASSWORD=<FROM-1PASSWORD>
MAPBOX_DOWNLOADS_TOKEN=<FROM-1PASSWORD>
```

Then, install the dependencies:
```bash
npm i
npx pod-install
npm start
```
In a new terminal, run:
```bash
npm run ios:debug
```
And in another terminal, run:
```bash
npm run android:debug
```

## Developing
### Install the dependencies
```bash
npm i
```
and the pods:
```bash
npx pod-install
```

### Start de dev server (metro) in a seperate terminal. Keep it open during development.
```bash
npm start
```

### Start the app in a seperate terminal (in debug mode)
For ios:
```bash
npm run ios:debug
```
For Android:
```bash
npm run android:debug
```

## Release a new version
## For Android:
Change the version code or version name in the `android/app/build.gradle` file.
```gradle
defaultConfig {
    ...
    versionCode 1 // <-- Change this
    versionName "0.1.0" // <-- Change this (if needed)
    ...
}
```
Create new AAB:
```bash
npm run android:build:release
```
The AAB will be located in `android/app/build/outputs/bundle/release/app-release.aab`.<br>
Upload the AAB to the Play Store Console.
Finish the config in the Play Store Console.

## For iOS:
Go to Xcode, and in the menu bar: `Product > Scheme > Edit Scheme...`, make sure that the `Build Configuration` is set to `Release`.<br>
Then, update the project version and build number in Xcode:<br>
+ Select the `monum` project in the left hand menu, then select the `monum` target.<br>
+ Then go to the `General` tab, and update the `Version` and `Build` fields from the `Identity` section.<br>
Then go to `Product > Destination` and make sure that `iPhone 15 Pro` is selected.<br>
Build the app: `Product > Build`.<br>
Then go to `Product > Destination` and make sure that `Any iOS Device (arm64)` is selected.<br>
Archive the app: `Product > Archive`.<br>
Then, open the `Windos > Organizer` window, select the archive and click `Distribute App`.<br>
Then select `TestFlight & App Store` and click `Distribute`.<br>
Once the process is finished, click on `Done`.
Finish the config in the App Store Connect website.
