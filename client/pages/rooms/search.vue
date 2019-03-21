<template>
  <v-content>
    <v-container fluid>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-form lazy-validation >
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
                  @click:minute="$refs.menu.save(start_hour)"
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
                  @click:minute="$refs.menu1.save(end_hour)"
                />
              </v-menu>
            </v-flex>
            <v-btn
              @click.prevent="search"
              color="success"
              :disabled="errors.any() || !isCompleted"
            >
              Search Room
              <span style="padding-left: 3px">
                <v-icon>search</v-icon>
              </span>
            </v-btn>
          </v-form>
        </v-flex>
      </v-layout>
            <room-card v-if="searchedRooms" v-for="room in searchedRooms" :key="room.id" :room="room" />
    </v-container>
  </v-content>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import RoomCard from '@/components/rooms/RoomCard'
export default {
  middleware: 'auth',
  components: {
    RoomCard
  },
  data() {
    return {
      menu2: false,
      menu1: false
    }
  },
  computed: {
    ...mapGetters('room', ['searchedRooms']),
    ...mapFields('room', {
      end_hour: 'form.end_hour',
      start_hour: 'form.start_hour'
    }),
    isCompleted() {
      return this.start_hour && this.end_hour
    }
  },
  methods: {
    ...mapActions('room', ['search'])
  }
}
</script>
