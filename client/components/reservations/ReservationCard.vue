<template>
    <v-card>
        <v-container
          fluid
          grid-list-lg
        >
          <v-layout row wrap>
            <v-flex xs12>
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
                        <div class="headline">{{ reservation.room.name }} </div>
                        <div>{{ reservation.room.location }}</div>
                        <div>{{ new Date(reservation.start_date) }} to {{ new Date(reservation.end_date) }}</div>
                      </div>
                    </v-card-title>
                  </v-flex>
                </v-layout>
                <v-divider light></v-divider>
                <v-card-actions class="pa-3" v-if="active">
                    <nuxt-link style="text-decoration: none; color:white;" :to="{ name:'reservations-id-edit', params: { id: reservation._id}, query: { roomId: reservation.room._id }}"> Edit your reservation </nuxt-link>
                    <v-spacer></v-spacer>
                    <v-btn flat style="text-decoration: none; color:white;" @click.prevent="destroy(reservation._id)">Cancel reservation</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
    </v-card>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  props: {
    active: {
      required: false,
      default: false,
      type: Boolean
    },
    reservation: {
      required: true,
      type: Object
    }
  },
  methods: {
    ...mapActions('reservation', ['destroy'])
  }
}
</script>
