export default class User {
    constructor (ctx) {
        this.$axios = ctx.$axios
    }
    destroy(userId) {
        return this.$axios.$delete(`user/${userId}`)
    }
    forgotPassword(payload) {
        return this.$axios.$post('user/forgot-password', payload)
    }
    resetPassword(token, payload) {
        return this.$axios.$post(`/user/reset-password?token=${token}`, payload)
    }
}
