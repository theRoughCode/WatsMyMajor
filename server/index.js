// Allow code to be transpiled by Babel
require('ignore-styles');  // ignore CSS files imported with 'import' syntax
require("regenerator-runtime/runtime");  // Allow async functions
require("isomorphic-fetch"); // Allows fetch to be used in nodejs
require('@babel/register')({
  ignore: [/(node_modules)/],
  presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-flow'],
  plugins: ['@babel/plugin-proposal-class-properties'],
});

// Prevent undefined window error
if (typeof window === 'undefined') {
    global.window = {
      location: {},
      navigator: {},
      isServer: true,
    };
}

// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

require('./server');
