import { getField, updateField } from 'vuex-map-fields'

export const state = () => ({
  reservations: [],
  reservation: null,
  form: {
    start_date: null,
    end_date: null
  }
})
export const getters = {
  reservations: state => state.reservations,
  form: state => state.form,
  reservation: state => state.reservation,
  getField
}
export const mutations = {
  SET_RESERVATIONS(state, reservations) {
    state.reservations = reservations
  },
  SET_RESERVATION(state, reservation) {
    state.reservation = reservation
  },
  PUSH_RESERVATION(state, reservation) {
    state.reservations.push(reservation)
  },
  SET_FORM(state, form) {
    console.log('>>>>', form)
    state.form = form
  },
  PUSH_UPDATED_RESERVATION(state, reservation) {
    state.reservations = state.reservations.filter(
      r => r._id != reservation._id
    )
    state.reservations.push(reservation)
  },
  UNSET_FORM(state) {
    state.form = {
      start_date: null,
      end_date: null
    }
  },
  updateField
}
export const actions = {
  index({ commit }) {
    return this.$api
      .reservation()
      .index()
      .then(reservations => {
        commit('SET_RESERVATIONS', reservations)
        return reservations
      })
      .catch(() => {})
  },
  show({ commit }, reservationId) {
    return this.$api
      .reservation()
      .show(reservationId)
      .then(reservation => {
        commit('SET_RESERVATION', reservation)
        commit('SET_FORM', {
          start_date: reservation.start_date,
          end_date: reservation.end_date
        })
        return reservation
      })
      .catch(() => {})
  },
  destroy({ dispatch }, reservationId) {
    return this.$api
      .reservation()
      .destroy(reservationId)
      .then(() => {
        dispatch('auth/unsetReservation', reservationId, { root: true })
      })
      .catch(() => {})
  },
  update({ commit, getters }, payload) {
    return this.$api
      .reservation()
      .update(payload.reservationId, payload.roomId, getters.form)
      .then(reservation => {
        commit('PUSH_UPDATED_RESERVATION', reservation)
        commit('UNSET_FORM')
        return reservation
      })
      .catch(() => {})
  },
  store({ commit, getters }, roomId) {
    return this.$api
      .reservation()
      .store(roomId, getters.form)
      .then(({ reservation }) => {
        commit('PUSH_RESERVATION', reservation)
        commit('UNSET_FORM')
        return reservation
      })
      .catch(() => {})
  }
}
