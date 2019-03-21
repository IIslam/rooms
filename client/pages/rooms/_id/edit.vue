<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-form lazy-validation >
            <v-text-field
              v-model="location"
              append-icon="gps_fixed"
              v-validate="'required|min:3'"
              :error-messages="errors.collect('location')"
              label="location"
              data-vv-name="location"
              required
            />
            <v-text-field
              v-model="name"
              append-icon="format_color_text"
              name="name"
              :counter="32"
              v-validate="'required|max:32|min:8'"
              :error-messages="errors.collect('name')"
              label="enter the room name."
              required
            />
            <v-flex xs12>
              <v-menu
                ref="menu"
                v-model="menu1"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="start_hour"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="start_hour"
                    label="start hour"
                    append-icon="access_time"
                    readonly
                    v-on="on"
                  />
                </template>
                <v-time-picker
                  v-if="menu1"
                  v-model="start_hour"
                  full-width
                  @click:minute="$refs.menu.save(form.start_hour)"
                />
              </v-menu>
              <v-menu
                ref="menu1"
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="end_hour"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="end_hour"
                    label="end hour"
                    append-icon="access_time"
                    readonly
                    v-on="on"
                  />
                </template>
                <v-time-picker
                  v-if="menu2"
                  v-model="end_hour"
                  full-width
                  @click:minute="$refs.menu1.save(form.end_hour)"
                />
              </v-menu>
            </v-flex>
            <v-btn
              @click.prevent="update($route.params.id)"
              color="success"
              :disabled="errors.any() || !isCompleted"
            >
              Update Room
              <span style="padding-left: 3px">
                <v-icon>exposure_plus_1</v-icon>
              </span>
            </v-btn>
          </v-form>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  middleware: 'auth',
  data() {
    return {
      menu2: false,
      menu1: false
    }
  },
  async fetch({ store, params }) {
    let room = await store.dispatch('room/show', params.id)
    store.commit('room/SET_FORM', {
      location: room.location,
      name: room.name,
      start_hour: room.start_hour,
      end_hour: room.end_hour
    })
  },

  computed: {
    ...mapGetters('room', ['room']),
    ...mapFields('room', {
      end_hour: 'form.end_hour',
      start_hour: 'form.start_hour',
      location: 'form.location',
      name: 'form.name'
    }),
    isCompleted() {
      return this.start_hour && this.end_hour && this.name && this.location
    }
  },
  methods: {
    ...mapActions('room', ['update'])
  }
}
</script>
