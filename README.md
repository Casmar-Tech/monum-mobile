# Monum Docs

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
