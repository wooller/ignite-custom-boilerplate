# React Native Boilerplate

This repository holds a boilerplate to be used with the Ignite CLI by Infinite Red. The purpose of this boilerplate is to give WeClick Media React Native developers a quick and easy set up with some core libaries/integrations.

## Installation
1) First make sure you are [set up for React Native](https://facebook.github.io/react-native/docs/getting-started.html#content)

2) Ensure you have Node 7.6+

3) Install Yarn for your [system](https://yarnpkg.com/lang/en/docs/install/)

4) Install the Ignite CLI `npm install -g ignite-cli`

## Usage
1) Clone this repository locally

2) Then create your new react native application by executing the following (substitute the path for the path of where you cloned this repo)

```ignite new exampleApp --boilerplate=/Users/admin/Templates/react-native-wcm-boilerplate```

## Currently Supported

  - Integration with [Crashlyrics](https://try.crashlytics.com/) (Android Only)
  - Semantic versioning via NPM [read more about semantic versioning](http://semver.org/)
  - Core Packages
    - [react-native-navigation](https://github.com/wix/react-native-navigation)
    - [react-native-config](https://github.com/luggit/react-native-config)
    - [react-redux](https://github.com/reactjs/react-redux)
    - [redux-thunk](https://github.com/gaearon/redux-thunk)
    - [apisauce](https://github.com/infinitered/apisauce)
    - [lodash](https://github.com/lodash/lodash)
  - Optional Packages
    - [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons)
    - [react-native-i18n](https://github.com/AlexanderZaytsev/react-native-i18n)
    - [react-native-animatable](https://github.com/oblador/react-native-animatable)

### Todos

 - crashlytics iOS
 - fastlane