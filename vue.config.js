module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/Memory-Management/'
        : '/',
    // configureWebpack: {
    //     performance: {
    //         hints:'warning',
    //         maxEntrypointSize: 50000000,
    //         maxAssetSize: 30000000,
    //         assetFilter: function(assetFilename) {
    //             return assetFilename.endsWith('.js') || assetFilename.endsWith('.css');
    //         }
    //     }
    // }
}