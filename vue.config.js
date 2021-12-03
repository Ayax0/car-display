const path = require('path')

module.exports = {
    transpileDependencies: ['vuetify'],
    configureWebpack: {
        resolve: {
            alias: {
                '@src': path.resolve(__dirname, 'src'),
                '@router': path.resolve(__dirname, 'src/router'),
                '@layouts': path.resolve(__dirname, 'src/router/layouts'),
                '@views': path.resolve(__dirname, 'src/router/views'),
                '@components': path.resolve(__dirname, 'src/components'),
                '@assets': path.resolve(__dirname, 'src/assets')
            }
        }
    },
    css: {
        loaderOptions: {
            sass: {
                data: `
					@import "@src/scss/variables.scss";
				`
            }
        }
    }
}
