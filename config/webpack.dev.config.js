const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry:{
        example:'../examples/index.js'
    },
    devserver:{
        port:'8080',
        overlay:true,
        //设置为false则会在页面中显示当前webpack的状态
        inline:true,
        historyApiFallBack:true,
        //设置代理
        proxy:{

        },
        hot:true,
        //强制页面不通过刷新页面跟新文件
        //hotOnly:true
    },
    plugins:[
        //分析插件
        new BundleAnalyzerPlugin(),
        //模块热更新
        new webpack.HotModuleReplacementPlugin(),
        //使用HMR时显示模块的相对路径
        new webpack.NamedModulesPlugin()
    ]
}