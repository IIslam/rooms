import Reservation from './reservation.js'
import User from './user.js'
import Room from './room.js'
export default class ApiService {
    constructor ($axios) {
        this.$axios = $axios
    }
    user() {
        return new User(this.$axios)
    }
    reservation() {
        return new Reservation(this.$axios)
    }
    room() {
        return new Room(this.$axios)
    }
}
