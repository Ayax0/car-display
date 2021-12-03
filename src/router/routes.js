import { defineAsyncComponent } from 'vue'

export default [
    {
        path: '/',
        name: 'Home',
        component: () => lazyLoadView(import('@views/home.vue'))
    }
]

function lazyLoadView (AsyncView) {
    return Promise.resolve(
        defineAsyncComponent({
            loader: () => AsyncView,
            // A component to use while the component is loading.
            loading: require('@views/_loading.vue').default,
            // Delay before showing the loading component.
            // Default: 200 (milliseconds).
            delay: 200,
            // A fallback component in case the timeout is exceeded
            // when loading the component.
            error: require('@views/_timeout.vue').default,
            // Time before giving up trying to load the component.
            // Default: Infinity (milliseconds).
            timeout: 10000
        })
    )
}
