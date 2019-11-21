export default class Room {
    constructor (ctx) {
        this.$axios = ctx.$axios
    }
    index() {
        return this.$axios.$get('rooms')
    }
    show(roomId) {
        return this.$axios.$get(`rooms/${roomId}`)
    }
    store(payload) {
        return this.$axios.$post('/rooms', payload)
    }
    update(roomId, payload) {
        return this.$axios.$put(`rooms/${roomId}`, payload)
    }
    destroy(roomId) {
        return this.$axios.$delete(`rooms/${roomId}`)
    }
    search(payload) {
        return this.$axios.$post('/rooms/search', payload)
    }

}
