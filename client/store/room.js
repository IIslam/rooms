import {
    getField,
    updateField
} from 'vuex-map-fields';

export const state = () => ({
    rooms: [],
    room: null,
    searchedRooms: [],
    form: {
      start_hour: null,
      end_hour: null,
      name: null,
      location: null     
    }

})
export const getters = {
    rooms: state => state.rooms,
    room: state => state.room,
    form: state => state.form,
    searchedRooms: state => state.searchedRooms,
    getField,

}
export const mutations = {
    SET_ROOMS(state, rooms) {
        state.rooms = rooms
    },
    PUSH_ROOM(state, room) {
        state.rooms.push(room)
    },
    SET_ROOM(state,room) {
        state.room = room
    },
    SET_FORM(state, form) {
        state.form = form
    },
    SET_SEARCHED_ROOMS(state, rooms) {
        state.searchedRooms = rooms
    },
    UNSET_FORM(state) {
        state.form = {
          start_hour: null,
          end_hour: null,
          name: null,
          location: null     
      }
    },
    PUSH_UPDATED_ROOM(state, room) {
        state.rooms = state.rooms.filter(r => r._id != room._id)
        state.rooms.push(room)
    },
    UNSET_FROM_ROOMS(state, roomId) {
        state.rooms = state.rooms.filter(room => room._id != roomId)
    },
    updateField,

}
export const actions = {
    index({commit}) {
        return this.$api.room().index().then((rooms) => {
            commit('SET_ROOMS', rooms)
            return rooms
        }).catch(() => {})
    },
    show({commit}, roomId) {
        return this.$api.room().show(roomId).then((room) => {
            commit('SET_ROOM', room)
            return room
        }).catch(() => {})
    },
    store({commit, getters}) {
        return this.$api.room().store(getters.form).then(({ room }) => {
            commit('PUSH_ROOM', room)
            commit('UNSET_FORM')
            return room
        }).catch(() => {})
    },
    search({commit, getters}) {
        return this.$api.room().search({
            start_hour: getters.form.start_hour,
            end_hour: getters.form.end_hour
        }).then(({ rooms }) => {
            commit('SET_SEARCHED_ROOMS', rooms)
            commit('UNSET_FORM')
            return rooms
        }).catch(() => {})

    },
    update({commit, getters}, roomId) {
        return this.$api.room().update(roomId, getters.form).then(({ room }) => {
            commit('PUSH_UPDATED_ROOM', room)
            commit('UNSET_FORM')
            return room
        }).catch(() => {})
    },
    destroy({commit, getters}, roomId) {
        return this.$api.room().destroy(roomId).then(() => {
            commit('UNSET_FROM_ROOMS', roomId)
        }).catch(() => {})
    }
}
