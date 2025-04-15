# Build Tutorial

## Necessary Components

To run the app, you will need three things installed on our computer.

[Node.js](https://nodejs.org/en/download), you'll want to select yarn as your package manager

You'll want to install expo after this, but you should just run "yarn install expo -g" to get the package globally

Last but not least [Android Studio](https://developer.android.com/studio?gclsrc=aw.ds&gad_source=1&gclid=CjwKCAjwktO_BhBrEiwAV70jXhyHr_s4A6kfbGpETDt-fGnMeDwfCFBXDLJqlusgEcbCwHiAynX18RoC-VoQAvD_BwE)

## COURSE STAFF- YOU MUST USE THE "course_staff" BRANCH. 
This is because of the way GitHub works, we cannot make a public repo that anyone can commit to, and therefore need to make a separate test repo that a pre-made account has access to. if you really really cannot evaluate any other branch than main please contact me ASAP at 385-471-1457 so we can add you to the repo

## Project Dependency
The dependencies for this project are outlined in the [packages.json](https://capstone.cs.utah.edu/researchflow/researchflow/-/blob/course_staff/package.json?ref_type=heads) file in our repo. There are quite a bit of packages required, as is standard with most react-native projects

## Build Steps (Android)

We are outlining buildsteps for Android because in order to do it for iOS you need to have an Apple Developer account, (which costs 100 a year) as well as an iPhone or Mac

1. Clone the repo and run "yarn install" in the directory
2. Open an Android Emulator from Android Studio, doesn't have to be new
3. Run "npx expo run:android" in the project directory
4. The Android Emulator will most likely come to the foreground, but if it doesn't just switch over to it

#### Known Issues

Windows users seem to run into issue with the path length limit. If this is the case, you may want to move the project to the top level of the drive or edit that environment variable.

#### Mac Users

You can build the apple version of the app using the xCode simulator, if you have it installed already and run "npx expo run:ios" it will open the simulator automatically, you can't test the offline features with that though, because the simulator doesn't let you turn off the connection

If you are testing the offline features, it is okay to put the phone in airplane mode and test them at this point. Its a quirk of expo that development builds need to be run like this.

## IN ORDER TO TEST THE OFFLINE MODE, YOU NEED TO HAVE LOGGED IN WHILE ONLINE AT LEAST ONCE

## COURSE STAFF - MAKE SURE TO USE THE BELOW ACCOUNT OR THE APP WILL NOT WORK
Test Account:

Username: CS4500Staff

Password: exrahzna3z8ka3h