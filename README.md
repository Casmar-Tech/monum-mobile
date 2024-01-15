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
    versionName "1.0" // <-- Change this (if needed)
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
+ Select the `monum`project in the left hand menu, then select the `monum` target.<br>
+ Then go to the `General` tab, and update the `Version` and `Build` fields from the `Identity` section.<br>
Then go to `Product > Destination` and make sure that `iPhone 15 Pro` is selected.<br>
Build the app: `Product > Build`.<br>
Then go to `Product > Destination` and make sure that `Any iOS Device (arm64)` is selected.<br>
Archive the app: `Product > Archive`.<br>
Then, open the `Windos > Organizer` window, select the archive and click `Distribute App`.<br>
Then select `TestFlight & App Store` and click `Distribute`.<br>
Once the process is finished, click on `Done`.
Finish the config in the App Store Connect website.

# React's Native official Readme

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
