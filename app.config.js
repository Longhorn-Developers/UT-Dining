const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
  expo: {
    name: IS_DEV ? 'UT Dining (Dev)' : 'UT Dining',
    slug: 'ut-dining',
    version: '1.1.0',
    scheme: 'ut-dining',
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/icons/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
      [
        'expo-sqlite',
        {
          enableFTS: true,
          useSQLCipher: true,
          android: {
            enableFTS: false,
            useSQLCipher: false,
          },
          ios: {
            customBuildFlags: ['-DSQLITE_ENABLE_DBSTAT_VTAB=1 -DSQLITE_ENABLE_SNAPSHOT=1'],
          },
        },
      ],
      'expo-font',
    ],
    experiments: {
      typedRoutes: true,
      tsconfigPaths: true,
    },
    orientation: 'portrait',
    icon: './assets/icons/ios-light.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/icons/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      icon: {
        dark: './assets/icons/ios-dark.png',
        light: './assets/icons/ios-light.png',
        tinted: './assets/icons/ios-tinted.png',
      },
      bundleIdentifier: IS_DEV ? 'com.ethanl06.ut-dining.dev' : 'com.ethanl06.ut-dining',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/icons/adaptive-icon.png',
        backgroundColor: '#BF5700',
      },
      bundleIdentifier: IS_DEV ? 'com.ethanl06.ut-dining.dev' : 'com.ethanl06.ut-dining',
      package: 'com.ethanl06.utdining',
    },
    newArchEnabled: true,
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: '005ee5ea-5ec3-4d96-af00-5d6203694b74',
      },
    },
    owner: 'ethanl06',
    runtimeVersion: {
      policy: 'appVersion',
    },
    updates: {
      url: 'https://u.expo.dev/005ee5ea-5ec3-4d96-af00-5d6203694b74',
    },
  },
};
