import path from "path";
import dotenv from 'dotenv';
import * as webpack from 'webpack';
import JavaScriptObfuscator from 'webpack-obfuscator';
import 'webpack-dev-server';
import getPathEnv from './src/server/helpers/validate-environment';

const srcPath = path.resolve(__dirname, "src/app");
const distPath = path.resolve(__dirname, "src/server/public");

const config: webpack.Configuration = {
  entry: [srcPath + '/index.tsx'],
  output: {
    filename: 'bundle.js',
    path: distPath,
    // clean: true, // esta opcion elimina todo dentro de la carpeta
    publicPath: '/',
  },
  module: {
    rules: [
      {  
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          configFile: "./tsconfig.json",
        },
      }
    ]
  },
  devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map',
  resolve: {
    extensions: [ '.js', '.css','.json', '.ts','.tsx' ],
    plugins: [],
  },
  plugins: [],
  devServer: {
    liveReload: true,
    static: distPath,
    port: 5001,
    host: 'localhost'
  }
};

const configExtends = (envp: any, argv: any) => {
  const _pathEnv = getPathEnv(argv);

  const env = dotenv.config({ path: _pathEnv }).parsed;

  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  if (argv.mode === 'production') {
    config.plugins.push(new JavaScriptObfuscator());
  }

  config.plugins.push(new webpack.DefinePlugin(envKeys));

  return config;
};
  
export default configExtends;
