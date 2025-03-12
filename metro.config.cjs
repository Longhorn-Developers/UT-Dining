// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
// eslint-disable-next-line no-undef
const config = getDefaultConfig(__dirname);

config.transformer.minifierConfig = {
  compress: {
    // The option below removes all console logs statements in production.
    drop_console: true,
  },
};

config.resolver.sourceExts.push('sql');

module.exports = withNativeWind(config, { input: './global.css' });
