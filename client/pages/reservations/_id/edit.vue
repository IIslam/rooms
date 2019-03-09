<template>
<v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card color="cyan darken-2" class="white--text">
            <v-layout>
              <v-flex xs5>
                <v-img
                  src="https://cdn.vuetifyjs.com/images/cards/foster.jpg"
                  height="125px"
                  contain
                ></v-img>
              </v-flex>
              <v-flex xs7>
                <v-card-title primary-title>
                  <div>
                    <div class="headline">{{ room.name }}</div>
                    <div>{{ room.location }}</div>
                    <div>available from {{ room.start_hour }} to {{ room.end_hour }}</div>
                  </div>
                </v-card-title>
              </v-flex>
            </v-layout>
            <v-divider light></v-divider>
          </v-card>
          <v-spacer></v-spacer>
          <v-form lazy-validation>
            <v-layout wrap>
              <v-flex xs12>
                <v-input
                  label="Reservation start date"
                  prepend-icon="date_range"
                >
                  <Datepicker v-model="start_date" name='start_date' format="YYYY-MM-DD H:i:s" width="100%" />
                </v-input>
              </v-flex>
            </v-layout>                      
            <v-layout wrap>
              <v-flex xs12>
                <v-input
                  label="Reservation end date"
                  prepend-icon="date_range"
                >
                  <Datepicker v-model="end_date" name='end_date' format="YYYY-MM-DD H:i:s" width="100%" />
                </v-input>
              </v-flex>
            </v-layout>
            <v-btn small @click.prevent="update({ reservationId: $route.params.id, roomId: $route.query.roomId})">update reservation</v-btn>

          </v-form>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>
<script>
  import Datepicker from 'vuejs-datetimepicker'
  import { mapActions, mapGetters } from 'vuex'
  import { mapFields } from 'vuex-map-fields';

  export default {
    middleware: 'auth',
    components: {
      Datepicker
    },
    async fetch ({ store, params, query }) {
      await store.dispatch('reservation/show', params.id)
      await store.dispatch('room/show', query.roomId)
    },
    computed: {
      ...mapGetters('reservation', ['reservation']),
      ...mapGetters('room', ['room']),
      ...mapFields('reservation', {
        start_date:  'form.start_date',
        end_date:  'form.end_date',
      }),

      isCompleted() {
        return this.start_date && this.end_date
      }
    },
    methods: {
      ...mapActions('reservation', ['update']),
    }
  };
</script>
