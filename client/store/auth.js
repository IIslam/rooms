export const getters = {
  authenticated: state => state.loggedIn,
  user: state => state.user
}

export const mutations = {
  UNSET_USER(state) {
    state.user = null
    state.loggedIn = false
  },
  UNSET_RESERVATION(state, reservationId) {
    state.user.reservations = state.user.reservations.filter(
      reservation => reservation._id != reservationId
    )
  }
}
export const actions = {
  logout({ commit }) {
    return new Promise((resolve, error) => {
      commit('UNSET_USER')
    })
  },
  forgotPassword({}, payload) {
    return this.$api.user().forgotPassword(payload)
  },
  resetPassword({}, payload) {
    return this.$api.user().resetPassword(payload.token, payload.form)
  },
  unsetReservation({ commit }, reservationId) {
    commit('UNSET_RESERVATION', reservationId)
  },
  deleteUser({}, payload) {}
}
