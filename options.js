/**
 * The questions to ask during the install process.
 */
const questions = [
  {
    name: 'vector-icons',
    message: 'What vector icon library will you use?',
    type: 'list',
    choices: ['none', 'react-native-vector-icons']
  },
  {
    name: 'i18n',
    message: 'What internationalization library will you use?',
    type: 'list',
    choices: ['none', 'react-native-i18n']
  },
  {
    name: 'animatable',
    message: 'What animation library will you use?',
    type: 'list',
    choices: ['none', 'react-native-animatable']
  },
  {
    name: 'crashlytics',
    message: 'Do you want to integrate crashlytics?',
    type: 'list',
      choices: ['yes', 'no']
  },
  {
    name: 'fastlane',
    message: 'Do you want to integrate fastlane?',
    type: 'list',
      choices: ['yes', 'no']
  }
]

/**
 * The max preset.
 */
const max = {
  'vector-icons': 'react-native-vector-icons',
  i18n: 'react-native-i18n',
  animatable: 'react-native-animatable',
  crashlytics: 'yes',
  fastlane: 'yes'

}

/**
 * The min preset.
 */
const min = {
  'vector-icons': 'none',
  i18n: 'none',
  animatable: 'none',
  crashlytics: 'no',
  fastlane: 'no'
}

module.exports = {
  questions,
  answers: { min, max }
}
