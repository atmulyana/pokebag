/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const { getDefaultConfig } = require('metro-config');

const {resolver: {sourceExts, assetExts}} = getDefaultConfig.getDefaultValues();

module.exports = {
    resolver: {
        assetExts: assetExts.filter(ext => ext !== "svg"),
        sourceExts: [...sourceExts, "svg"],
    },
    transformer: {
        babelTransformerPath: require.resolve("react-native-svg-transformer"),
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
            },
        }),
    },
};
