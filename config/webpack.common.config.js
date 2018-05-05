const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FrienlyErrorsPlugin = require('friendly-errors-webpack-plugin');

//这是开放发环境
const DevConfig = require('./webpack.dev.config');
//这是生产环境
const ProConfig = require('./webpack.prod.config');
//这是第三方库的文件
const dlls = require('./webpack.dll.config');
//设置的别名
//const alias = require('./webpack.alias');


const genarteConfig = env=>{
    //样式loader
    let cssLoader=[{
        loader:'css-loader',
        options:{
            sourceMap:true,
            //让css能够某块化引入 import
            moudle:true
        }
    },{
        //给css添加前缀的
        loader:'postc-loader',
        options:{
            ident:'potcss',
            plugins:[
                require('autoprefixer')()
            ],
            sourceMap:true
        }
    },{
        loader:'less-loader',
        options:{
            sourceMap:true
        }
    }];
    //配置编译css和less的loader 
    //如果不是生产环境就不需要讲css单独打包
    let styleLoader =[{
        test:/\.(css|less)$/,
        use: env==='prod' ? ExtractTextPlugin({
            fallback:'style-loader',
            use:cssLoader
        }) : [{
            loader:'style-loader',
            options:{
                sourceMap:true
            }
        }].concat(cssLoader)
    }];
    //这是编译js的loader
    let jsloader =[{
        test:/\.jsx?$/,
        exclude:/node_modules/,
        use:[{
            loader:'balel=loader'
        }].concat(env === 'dev' ?[{
            loader:'eslint-loader'
        }] : [])
    }];
    //处理文件用的loader
   let fileLoaderOptions = {
       useRelativePath:false,
       name:'[name]-[hash:5].[ext]'
   }
   //如果是生产环境的话 就将图片小于10000的进行转码
   if(ene === 'prod'){
       fileLoaderOptions.limit = 10000;
   }
   //解析css中的图片
   let fileLoader = [{
       loader:/\.(jpg|png|jpeg|icon)$/,
       use:[{
           loader: env ==='dev' ? 'file-loader' : 'url-loader',
           options:env ==='dev' ? fileLoaderOptions : Object.assign({},fileLoaderOptions,{
               //这是输出的路径
               outputPath:'../dist/imgs'
           })
       }]
   },{
       //解析字体文件
       test:/\.(eot|svg|ttf|woff2?)$/,
       loader:env === 'dev' ? 'file-loader' : 'url-loader',
       options:env === 'dev' ? fileLoaderOptions : Object.assign({},fileLoaderOptions,{
           outputPath:'../dist/fonts'
       })

   },{
       //解析页面上的图片
       test:/\.html$/,
       exclude:/node_modules/,
       use:{
           loader:'html-loader',
           options:{
               attrs:['img:src','img:data-src'],
               minimize:true
           }
       }
   }];
   //webpack 插件
   let plugins=[];

   //组织第三方插件
   for(let key in dlls.entry){
       let dllPlugin = new webpack.DllReferencePlugin({
           manifest:require('../dll/manifest' + key + '.manifest.json')
       });
       plugins.push(dllPlugin);
   }
   //加载js
   plugins.push(new AddAssetHtmlPlugin({
       filepath:path.join(__dirname,'../dll/*.js'),
       hash:true,
       includeSourcemap:false,
       publicPath:'./dll/',
       outputPath:'../dist/dll/'
   }));
   
   //入口html插件
   plugins.push(new HtmlWebpackPlugin({
       template:path.join(__dirname,'../src/index.html'),
       filename:'index.html',
       inject:true,
       chunks:['vender','example']
   }));

   //拷贝文件
   plugins.push(new CopyWebpackPlugin([{
       from:'./dll/fonts',
       to:'../dist/fonts'
   }]));
   //友好提示插件
   plugins.push(new FrienlyErrorsPlugin());

   let config = {
       devtool : 'source-map',
       output:{
           path:path.join(__dirname,'../dist/'),
           filename:env === 'dev' ? '[name]-[hash:5].bundle.js' : '[name]-[chunkhash:5].bundle.js'
       },
       //模块
       moudle:{
           rules:[].concat(styleLoader).concat(jsloader).concat(fileLoader)
       },
       //插件
       plugins:plugins,
       //设置别名
       resolve:{
        //   alias:alias
       }
   }

   return config;
};

module.exports = env =>{
    let config = env ==='dev' ? DevConfig : ProConfig;
    let result = webpackMerge(genarteConfig(env),config);
    return result; 
}