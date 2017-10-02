const options = require('./options')
const { merge, pipe, assoc, omit, __, replace } = require('ramda')
const { getReactNativeVersion } = require('./lib/react-native-version')

/**
 * Is Android installed?
 *
 * $ANDROID_HOME/tools folder has to exist.
 *
 * @param {*} context - The gluegun context.
 * @returns {boolean}
 */
const isAndroidInstalled = function (context) {
  const androidHome = process.env['ANDROID_HOME']
  const hasAndroidEnv = !context.strings.isBlank(androidHome)
  const hasAndroid = hasAndroidEnv && context.filesystem.exists(`${androidHome}/tools`) === 'dir'

  return Boolean(hasAndroid)
}

/**
 * Let's install.
 *
 * @param {any} context - The gluegun context.
 */
async function install (context) {
  const {
    filesystem,
    parameters,
    ignite,
    reactNative,
    print,
    system,
    prompt,
    template,
    patching
  } = context
  const { colors } = print
  const { green, yellow, bold, gray, blue, red } = colors

  const perfStart = (new Date()).getTime()

  const name = parameters.third
  const spinner = print
    .spin(`using the ${green('WeClick Media')} boilerplate`)
    .succeed()

  // attempt to install React Native or die trying
  const rnInstall = await reactNative.install({
    name,
    version: getReactNativeVersion(context)
  })
  if (rnInstall.exitCode > 0) process.exit(rnInstall.exitCode)

  // remove the __tests__ directory that come with React Native
  filesystem.remove('__tests__')

  // copy our App directory
  spinner.text = '▸ copying files'
  spinner.start()
  filesystem.copy(`${__dirname}/boilerplate/app`, `${process.cwd()}/app`, {
    overwrite: true,
    matching: '!*.ejs'
  })
  // filesystem.copy(`${__dirname}/boilerplate/Tests`, `${process.cwd()}/Tests`, {
  //   overwrite: true,
  //   matching: '!*.ejs'
  // })
  spinner.stop()

  // --max, --min, interactive
  let answers
  let crashlyticsKeyAnswers
  if (parameters.options.max) {
    answers = options.answers.max
  } else if (parameters.options.min) {
    answers = options.answers.min
  } else {
    answers = await prompt.ask(options.questions)
  }

  if (answers['crashlytics'] === 'yes') {
    const crashlyticsKey = { type: 'input', name: 'crashlyticsKey', message: 'Enter your crashlytics API Key' }
    crashlyticsKeyAnswers = await prompt.ask(crashlyticsKey)
  }

  // generate some templates
  spinner.text = '▸ generating files'
  const templates = [
    { template: 'index.js.ejs', target: 'index.ios.js' },
    { template: 'index.js.ejs', target: 'index.android.js' },
    //{ template: 'README.md', target: 'README.md' },
    { template: 'ignite.json.ejs', target: 'ignite/ignite.json' },
    { template: '.editorconfig', target: '.editorconfig' },
    { template: '.babelrc', target: '.babelrc' },
    { template: '../.env.example', target: '../.env.example' }
  ]
  const templateProps = {
    name,
    igniteVersion: ignite.version,
    reactNativeVersion: rnInstall.version,
    vectorIcons: answers['vector-icons'],
    animatable: answers['animatable'],
    i18n: answers['i18n']
  }
  await ignite.copyBatch(context, templates, templateProps, {
    quiet: true,
    directory: `${ignite.ignitePluginPath()}/boilerplate`
  })

  /**
   * Append to files
   */
  // https://github.com/facebook/react-native/issues/12724
  filesystem.appendAsync('.gitattributes', '*.bat text eol=crlf')
  filesystem.append('.gitignore', '\n# Misc\n#')
  filesystem.append('.gitignore', '\n.env.example\n')
  filesystem.append('.gitignore', '.env\n')

  /**
   * Merge the package.json from our template into the one provided from react-native init.
   */
  async function mergePackageJsons () {
    // transform our package.json in case we need to replace variables
    const rawJson = await template.generate({
      directory: `${ignite.ignitePluginPath()}/boilerplate`,
      template: 'package.json.ejs',
      props: templateProps
    })
    const newPackageJson = JSON.parse(rawJson)

    // read in the react-native created package.json
    const currentPackage = filesystem.read('package.json', 'json')

    // deep merge, lol
    const newPackage = pipe(
      assoc(
        'dependencies',
        merge(currentPackage.dependencies, newPackageJson.dependencies)
      ),
      assoc(
        'devDependencies',
        merge(currentPackage.devDependencies, newPackageJson.devDependencies)
      ),
      assoc('scripts', merge(currentPackage.scripts, newPackageJson.scripts)),
      merge(
        __,
        omit(['dependencies', 'devDependencies', 'scripts'], newPackageJson)
      )
    )(currentPackage)

    // write this out
    filesystem.write('package.json', newPackage, { jsonIndent: 2 })
  }
  await mergePackageJsons()

  spinner.stop()

  // pass long the debug flag if we're running in that mode
  const debugFlag = parameters.options.debug ? '--debug' : ''

  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // NOTE(steve): I'm re-adding this here because boilerplates now hold permanent files
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  try {
    // boilerplate adds itself to get plugin.js/generators etc
    // Could be directory, npm@version, or just npm name.  Default to passed in values
    const boilerplate = parameters.options.b || parameters.options.boilerplate || 'ignite-ir-boilerplate'

    //await system.spawn(`ignite add ${boilerplate} ${debugFlag}`, { stdio: 'inherit' })

    // now run install of Ignite Plugins

    if (answers['vector-icons'] === 'react-native-vector-icons') {
      await system.spawn(`ignite add vector-icons@"~>1.0.0" ${debugFlag}`, {
        stdio: 'inherit'
      })
    }

    if (answers['i18n'] === 'react-native-i18n') {
      await system.spawn(`ignite add i18n@"~>1.0.0" ${debugFlag}`, { stdio: 'inherit' })
    }

    if (answers['animatable'] === 'react-native-animatable') {
      await system.spawn(`ignite add animatable@"~>1.0.0" ${debugFlag}`, {
        stdio: 'inherit'
      })
    }

    if (parameters.options.lint !== 'false') {
      await system.spawn(`ignite add standard@"~>1.0.0" ${debugFlag}`, {
        stdio: 'inherit'
      })
    }
  } catch (e) {
    ignite.log(e)
    throw e
  }

  //manually link react-native-navigation
  // -------------
  // ANDROID
  const MainActivityPath = `android/app/src/main/java/com/${name.toLowerCase()}/MainActivity.java`
  const MainApplicationPath = `android/app/src/main/java/com/${name.toLowerCase()}/MainApplication.java`
  const buildGradlePath = `android/app/build.gradle`
  const rootBuildGradlePath = `android/build.gradle`
  const androidManifestPath = `android/app/src/main/AndroidManifest.xml`
  //const MainActivityPath = `android/app/src/main/java/com/testproject/MainActivity.java`

  spinner.text = `▸ manually linking react-native-navigation on Android`
  spinner.start()

  const WixNavigationTemplatesAndroid = [
    { template: 'MainActivity.java.ejs', target: MainActivityPath },
    { template: 'MainApplication.java.ejs', target: MainApplicationPath }
  ]
  const WixNavigationTemplatePropsAndroid = {
    name,
    packageName: `com.${name.toLowerCase()}`
  }
  await ignite.copyBatch(context, WixNavigationTemplatesAndroid, WixNavigationTemplatePropsAndroid, {
    quiet: true,
    directory: `${ignite.ignitePluginPath()}/boilerplate`
  })
  await ignite.patchInFile(buildGradlePath, {
     replace: 'compileSdkVersion 23',
     insert: 'compileSdkVersion 25'
  })
  await ignite.patchInFile(buildGradlePath, {
     replace: 'buildToolsVersion "23.0.1"',
     insert: 'buildToolsVersion "25.0.1"'
  })

  spinner.stop()
  spinner.succeed(`manually linked navigation on Android`)

  spinner.text = `▸ manually linking react-native-navigation on iOS`
  spinner.start()
  // -------------
  // ios
  //
  //
  //
  const appDelegatePath = `ios/${name}/AppDelegate.m`

  const WixNavigationTemplatesIOS = [
    { template: 'AppDelegate.m.ejs', target: appDelegatePath }
  ]
  const WixNavigationTemplatePropsIOS = {
    name,
    packageName: `com.${name.toLowerCase()}`
  }
  await ignite.copyBatch(context, WixNavigationTemplatesIOS, WixNavigationTemplatePropsIOS, {
    quiet: true,
    directory: `${ignite.ignitePluginPath()}/boilerplate`
  })
  spinner.stop()
  spinner.succeed(`manually linked navigation on iOS`)

  spinner.text = `▸ Adding Semantic Versioning`
  spinner.start()

  //ANDROID
  await ignite.patchInFile(rootBuildGradlePath, {
     after: '// Top-level build file where you can add configuration options common to all sub-projects/modules.',
     insert: '\nimport groovy.json.JsonSlurper\n'
  })

  const rootBuildGradleVersioningData = filesystem.read(`${ignite.ignitePluginPath()}/boilerplate/rootBuildGradleVersioning.ejs`)

  filesystem.append(rootBuildGradlePath, rootBuildGradleVersioningData);

  await ignite.patchInFile(buildGradlePath, {
     replace: 'versionCode 1',
     insert: 'versionCode versionMajor * 10000 + versionMinor * 100 + versionPatch'
  })

  await ignite.patchInFile(buildGradlePath, {
     replace: 'versionName "1.0"',
     insert: 'versionName "${versionMajor}.${versionMinor}.${versionPatch}"'
  })

  //iOS

  const versioningTemplates = [
    { template: 'version-ios.sh.ejs', target: '/npm-version/version-ios.sh' }
  ]
  const versioningTemplateProps = {
    name,
    packageName: `com.${name.toLowerCase()}`
  }
  await ignite.copyBatch(context, versioningTemplates, versioningTemplateProps, {
    quiet: true,
    directory: `${ignite.ignitePluginPath()}/boilerplate/`
  })

  spinner.stop()
  spinner.succeed(`Added Semantic Versioning`)

  // react native link -- must use spawn & stdio: ignore or it hangs!! :(
  spinner.text = `▸ linking native libraries`
  spinner.start()
  await system.spawn('react-native link', { stdio: 'ignore' })
  spinner.stop()

  if (answers['crashlytics'] === 'yes') {
    spinner.text = `▸ Adding Crashlytics`
    spinner.start()

    const compileCrashlyticsData = filesystem.read(`${ignite.ignitePluginPath()}/boilerplate/compileCrashlytics.ejs`)
    await ignite.patchInFile(buildGradlePath, {
       after: 'dependencies {',
       insert: compileCrashlyticsData
    })

    const buildScriptCrashlyticsData= filesystem.read(`${ignite.ignitePluginPath()}/boilerplate/buildScriptCrashlytics.ejs`)
    await ignite.patchInFile(buildGradlePath, {
       before: 'apply plugin: "com.android.application"',
       insert: buildScriptCrashlyticsData
    })

    const applyPluginCrashlyticsData= filesystem.read(`${ignite.ignitePluginPath()}/boilerplate/applyPluginCrashlytics.ejs`)
    await ignite.patchInFile(buildGradlePath, {
       after: 'apply plugin: "com.android.application"',
       insert: applyPluginCrashlyticsData
    })

    const apiKeyManifestData= filesystem.read(`${ignite.ignitePluginPath()}/boilerplate/crashlyticsAPIKey.ejs`)
    await ignite.patchInFile(androidManifestPath, {
       before: '</application>',
       insert: apiKeyManifestData
    })

    if (crashlyticsKeyAnswers['crashlyticsKey'] != null){
      await ignite.patchInFile(androidManifestPath, {
         replace: 'INSERT_API_KEY',
         insert: crashlyticsKeyAnswers['crashlyticsKey']
      })
    }

    await ignite.patchInFile(MainApplicationPath, {
       after: 'import java.util.List;',
       insert: 'import com.crashlytics.android.Crashlytics; \nimport io.fabric.sdk.android.Fabric;'
    })

    const onCreateCrashlyticsData= filesystem.read(`${ignite.ignitePluginPath()}/boilerplate/onCreateCrashlytics.ejs`)
    await ignite.patchInFile(MainApplicationPath, {
       after: 'public class MainApplication extends NavigationApplication {',
       insert: onCreateCrashlyticsData
    })

    //iOS
    // const directoryOutput = system.run(`ls -l`, { trim: true })
    // ignite.log(directoryOutput)
    //

    //system.run(`cd ios . pod init`)

    spinner.stop()
    spinner.succeed(`Added Crashlytics for Android`)
  }

  // git configuration
  const gitExists = await filesystem.exists('./.git')
  if (!gitExists && !parameters.options['skip-git'] && system.which('git')) {
    // initial git
    const spinner = print.spin('configuring git')

    // TODO: Make husky hooks optional
    const huskyCmd = '' // `&& node node_modules/husky/bin/install .`
    system.run(`git init . && git add . && git commit -m "Initial commit." ${huskyCmd}`)

    spinner.succeed(`configured git`)
  }

  const perfDuration = parseInt(((new Date()).getTime() - perfStart) / 10) / 100
  spinner.succeed(`ignited ${yellow(name)} in ${perfDuration}s`)

  const androidInfo = isAndroidInstalled(context) ? ''
    : `\n\nTo run in Android, make sure you've followed the latest react-native setup instructions at https://facebook.github.io/react-native/docs/getting-started.html before using ignite.\nYou won't be able to run ${bold('react-native run-android')} successfully until you have.`

  const successMessage = `
    ${red('Ignite CLI')} ignited ${yellow(name)} in ${gray(`${perfDuration}s`)}

    To get started:

      cd ${name}
      react-native run-ios
      react-native run-android${androidInfo}
      ignite --help

    ${gray('Read the walkthrough at https://github.com/infinitered/ignite-ir-boilerplate/blob/master/readme.md#boilerplate-walkthrough')}

    ${blue('Need additional help? Join our Slack community at http://community.infinite.red.')}

    ${bold('Now get cooking! 🍽')}
  `

  print.info(successMessage)
}

module.exports = {
  install
}
