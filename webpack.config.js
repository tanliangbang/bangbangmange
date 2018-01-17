'use strict'

module.exports = function( env ) {
    // 生成环境下webpack使用-p参数开启代码压缩
    // webpack[-dev-server]使用--env dev参数指定编译环境
    var isDev = env == 'dev';
    var path = require( 'path' );
    var webpack = require( 'webpack' );
    var CleanWebpackPlugin = require( 'clean-webpack-plugin' );
    var CopyWebpackPlugin = require( 'copy-webpack-plugin' );
    var HtmlWebpackPlugin = require( 'html-webpack-plugin' );
    var BundleAnalyzerPlugin = require( 'webpack-bundle-analyzer' ).BundleAnalyzerPlugin;
    var ExtractTextPlugin = require("extract-text-webpack-plugin");

    var sourcedir = path.resolve( __dirname, 'dev' );// 源码和资源文件的放置位置
    var outputdir = path.resolve( __dirname, 'bangbangmanage' );// 编译结果的放置位置
    var webContextRoot = '/';// 应用的实际访问路径，默认是'/'
    // antd的图标字体文件的实际访问路径，利用less-load的变量替换功能

    var hasValue = function( item ) { return item != null; };
    return {
        //context: path.resolve( __dirname ),
        //devtool: 'source-map',
        devServer: {
            host: '0.0.0.0',
            historyApiFallback: true,
            proxy: {
                '/api': {
                    target: 'http://118.89.161.150',
                    secure: false
                }
            }
        },
        resolve: {
            // 让less-loader等插件能找到以~相对定位的资源
            modules: [sourcedir, 'node_modules']
        },
        entry: {
            main: [
                // 编译新版本js的新api(如Promise)，主要是让IE11能够执行编译后的代码
                path.resolve( sourcedir, 'index.jsx'),
            ].filter( hasValue ),
            // 第三方库汇总输出
            vendor: ['react', 'react-dom', 'react-router', 'redux', 'react-redux', 'react-router-redux'],
            antd:[
                "antd/lib/table","antd/lib/table/style",
                "antd/lib/form","antd/lib/form/style",
                "antd/lib/divider","antd/lib/divider/style",
                "antd/lib/icon","antd/lib/icon/style",
                "antd/lib/button","antd/lib/button/style",
                "antd/lib/checkbox","antd/lib/checkbox/style",
                "antd/lib/switch","antd/lib/switch/style",
                "antd/lib/select","antd/lib/select/style",
                "antd/lib/message","antd/lib/message/style",
                "antd/lib/modal","antd/lib/modal/style",
                "antd/lib/upload","antd/lib/upload/style",
            ]
        },
        output: {
            path: outputdir,
            filename: isDev ? 'js/[name].js' : 'js/[name]_[chunkhash:8].js',
            // 使用require.ensure造成的延迟加载的代码文件
            chunkFilename: isDev ? 'js/chunk_[id]_[name].js'
                : 'js/chunk_[name]_[chunkhash:8].js',
            publicPath: webContextRoot
        },
        module: {
            rules: [{
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: [{
                    // 编译新版本js语法为低版本js语法
                    loader: 'babel-loader',

                }]
            }, {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    //resolve-url-loader may be chained before sass-loader if necessary
                    use: ['css-loader','postcss-loader']
                })
            }, {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    //resolve-url-loader may be chained before sass-loader if necessary
                    use: ['css-loader', 'postcss-loader',
                        {
                            loader: 'less-loader',
                            options: {
                                modules: false,
                                modifyVars: {
                                    "primary-color": "#1bbc9b"

                                }
                            }}]
                })
            }, {
                test: /\.scss/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    //resolve-url-loader may be chained before sass-loader if necessary
                    use: [ 'css-loader','sass-loader', 'postcss-loader']
                })
            }, {
                test: /\.(jpg|png|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        // 编码为dataUrl的最大尺寸
                        limit: 10000,
                        // 输出路径，相对于publicPath
                        outputPath: 'assets/',
                        name: isDev ? '[name].[ext]' : '[name]_[hash:8].[ext]'
                    }
                }

            }, {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: 'application/font-woff',
                        outputPath: 'assets/',
                        name: isDev ? '[name].[ext]' : '[name]_[hash:8].[ext]'
                    }
                }
            }, {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: 'application/octet-stream',
                        outputPath: 'assets/',
                        name: isDev ? '[name].[ext]' : '[name]_[hash:8].[ext]'
                    }
                }
            }, {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: 'application/vnd.ms-fontobject',
                        outputPath: 'assets/',
                        name: isDev ? '[name].[ext]' : '[name]_[hash:8].[ext]'
                    }
                }
            }, {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: 'application/svg+xml',
                        outputPath: 'assets/',
                        name: isDev ? '[name].[ext]' : '[name]_[hash:8].[ext]'
                    }
                }
            }]
        },
        plugins: [
            // momentjs包含大量本地化代码，需筛选
            new webpack.ContextReplacementPlugin( /moment[\/\\]locale$/, /en-ca|zh-cn/ ),
            new webpack.optimize.OccurrenceOrderPlugin( true ),
            // 复制无需编译的文件至输出目录
            new CopyWebpackPlugin( [{
                from: path.resolve( sourcedir, 'assets' ),
                to: 'assets'
            }] ),
            // 修复webpack的chunkhash不以chunk文件实际内容为准的问题
            new webpack.HashedModuleIdsPlugin(),
            // 单独打包输出第三方组件，和webpack生成的运行时代码
            new webpack.optimize.CommonsChunkPlugin( {
                name: ['vendor','antd','manifest'],
            }),
            // 自动填充js、css引用进首页
            new HtmlWebpackPlugin( {
                title: 'wzp react',
                template: path.resolve( sourcedir, 'index.html' ),
                inject: 'body' // Inject all scripts into the body
            }),
            new ExtractTextPlugin("css/[hash:8].styles.css"),
            // 设置环境变量
            new webpack.DefinePlugin( {
                process: {
                    env: {
                        // process.env.NODE_ENV==="production"
                        // 应用代码里，可凭此判断是否运行在生产环境
                        NODE_ENV: isDev ? JSON.stringify( 'development' )
                            : JSON.stringify( 'production' )
                    }
                }
            }),
            // print more readable module names on HMR updates
            isDev ? new webpack.NamedModulesPlugin() : null,
            // 先清理输出目录
            isDev ? null : new CleanWebpackPlugin( [outputdir] ),
            // 排除特定库
            isDev ? null : new webpack.IgnorePlugin( /.*/, /react-hot-loader$/ ),
            // 输出报告，查看第三方库的大小
            isDev ? null : new BundleAnalyzerPlugin(
                {
                    analyzerMode: 'static',
                    reportFilename: 'report.html',
                    openAnalyzer: true,
                    generateStatsFile: false
                })
        ].filter( hasValue )
    }
};