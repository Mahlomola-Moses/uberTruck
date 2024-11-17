module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        // Required for expo-router
        //'expo-router/babel',
        
        // For path aliases
        [
          'module-resolver',
          {
            root: ['./'],
            alias: {
              '@': './app', // Adjust the alias path if necessary
            },
          },
        ],
  
        // Required for react-native-reanimated
        'react-native-reanimated/plugin',
      ],
    };
  };
  