const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ZipPlugin = require('zip-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');

const path = require('path');

module.exports={
    entry:{
        example:'./examples/index.js'
    },
    plugins:[
        //模块分析页面
        //new BundleAnalyzerPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            names:['vender'],
            minChunks:2
        }),
        //混淆代码
        new  UglifyJsPlugin({
            sourceMap:true,
            //多线程处理
            parallel:true,
            //使用缓存
            cache:true
        }),
        new ExtractTextPlugin({
            filename:'[name]-[hash:5]:css'
        }),
        new CleanWebpackPlugin(['dist','package'],{
            root:path.join(__dirname,'../')
        }),
        new webpack.NamedChunksPlugin(),
        new webpack.NamedModulesPlugin(),
        //版本信息
        new webpack.BannerPlugin({
            banner:'Name',
            raw:false,
            entryOnly:true,
            include:/\.js/g
        }),
        //分析结果
        new StatsPlugin('../stats.json',{
            chunkModules:true,
            exclude:[/node_modules/]
        }),
        //打包生成包的页面
        new HtmlWebpackPlugin({
            template:path.join(__dirname,'../src/index.html'),
            filename:'../index.html',
            inject:true
        }),
        //压缩文件
        new ZipPlugin({
            filename:'gt-ui.zip',
            path:'../package/',
            pathPrefix:'dist'
        }),
    ],
    profile:true
};