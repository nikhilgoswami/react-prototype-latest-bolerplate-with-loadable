import path from 'path'

import { Configuration, DefinePlugin } from 'webpack'
import nodeExternals from 'webpack-node-externals'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import dotenv from 'dotenv'

const env = dotenv.config().parsed || {}
const envKeys = Object.keys(env).reduce((prev:any, next:string) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next])
  return prev
}, {})

import {
  ALIAS,
  DIST_DIR,
  IS_DEV,
  SERVER_BUNDLE_NAME,
  SERVER_SRC_DIR
} from './constants'
import * as Loaders from './loaders'

const serverConfig: Configuration = {
  name: 'server',
  target: 'node',
  node: { __dirname: false },
  entry: path.join(SERVER_SRC_DIR, '/server'),
  plugins: [
    new ForkTsCheckerWebpackPlugin(), 
    new MiniCssExtractPlugin(),
    new DefinePlugin({
      ...envKeys,
    })
  ],
  module: {
    rules: Object.values(Loaders).map((el) => el.server)
  },
  output: {
    filename: `${SERVER_BUNDLE_NAME}.js`,
    path: DIST_DIR,
    publicPath: '/'
  },
  devtool: IS_DEV ? 'source-map' : false,
  resolve: {
    alias: ALIAS,
    extensions: ['.ts', '.tsx', '.js']
  },
  externals: [nodeExternals()]
}

export { serverConfig }
