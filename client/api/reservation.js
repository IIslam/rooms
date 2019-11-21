export default class Reservation {
    constructor (ctx) {
        this.$axios = ctx.$axios
    }
    index() {
        return this.$axios.$get('reservations')
    }
    show(reservationId) {
        return this.$axios.$get(`reservations/${reservationId}`)
    }
    store(roomId, payload) {
        return this.$axios.$post(`reservations/${roomId}`, payload)
    }
    update(reservationId, roomId, payload) {
        return this.$axios.$put(`reservations/${reservationId}/rooms/${roomId}`, payload)
    }
    destroy(reservationId) {
        return this.$axios.$delete(`reservations/${reservationId}`)
    }
}
