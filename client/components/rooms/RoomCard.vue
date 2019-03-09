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
                            <div class="headline">{{ room.name }}</div>
                            <div>{{ room.location }}</div>
                            <div>(2014)</div>
                          </div>
                        </v-card-title>
                      </v-flex>
                    </v-layout>
                    <v-divider light></v-divider>
                    <v-card-actions class="pa-3">
                      <nuxt-link style="text-decoration: none; color:white" :to="{ name:'rooms-id', params: { id: room._id }}"> Reserve this room </nuxt-link>
                      <v-spacer></v-spacer>

                      <nuxt-link style="text-decoration: none; color:white;" :to="{ name:'rooms-id-edit', params: { id: room._id }}"> Edit this room </nuxt-link>
                        <v-spacer></v-spacer>
                      <v-btn flat style="text-decoration: none; color:white;" @click.prevent="destroy(room._id)">Delete this room</v-btn>
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
            room: {
                required: true,
                type: Object
            }
        },
        methods: {
            ...mapActions('room', ['destroy'])
        }
    }

</script>
