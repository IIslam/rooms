export default function({
    $axios,
    store,
    app,
    redirect
}) {
    $axios.onRequest((config) => {
        // if (!store.state.auth.isLogged) {
        //     $axios.setToken(false)

        // }
    })
    $axios.onResponseError((err) => {
        if (err.response && err.response.status == 500) {
            app.$toast.error('God ! , what did you do.. ')
        }
        if (err.response.status == 401) {
            redirect('/auth/login')
        }
        if (err.response.status == 422 && err.response.data.messages) {
            err.response.data.messages.forEach((message) => {
                app.$toast.error(message)
            })
        }
        if (err.response.data.message) {
            app.$toast.error(err.response.data.message)
        }
    })
    $axios.onResponse((response) => {
        if (response.data.message) {
            app.$toast.info(response.data.message)
        }
    })
}
