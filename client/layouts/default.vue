<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-tile
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ item.title }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar :clipped-left="clipped" fixed app>
      <v-toolbar-side-icon @click="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>{{ `chevron_${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer></v-spacer>
      <template v-if="authenticated">
        {{ user.name }}
      </template>

      <v-menu bottom left>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>apps</v-icon>
          </v-btn>
        </template>

        <v-list v-if="authenticated">
          <v-list-tile v-for="(item, i) in auth" :key="i">
            <v-list-tile-title>
              <nuxt-link :to="item.to">
                <v-icon>{{ item.icon }}</v-icon>
                {{ item.title }}
              </nuxt-link>
            </v-list-tile-title>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-title @click.prevent="$auth.logout">
              <a href="#"><v-icon>forward</v-icon>Logout</a>
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
        <v-list v-else>
          <v-list-tile v-for="(item, i) in guest" :key="i">
            <v-list-tile-title>
              <nuxt-link :to="item.to"> {{ item.title }}</nuxt-link>
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>

    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>Vodafone Rooms &copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      auth: [
        {
          icon: 'add',
          title: 'Reserve a room',
          to: '/rooms'
        },
        {
          icon: 'add',
          title: 'Create a room',
          to: '/rooms/create'
        },
        {
          icon: 'add',
          title: 'Your Reservations',
          to: '/auth/user/reservations'
        }
      ],
      guest: [
        {
          icon: 'person_add',
          title: 'Register',
          to: '/auth/register'
        },
        {
          icon: 'keyboard_arrow_right',
          title: 'Login',
          to: '/auth/login'
        }
      ],
      items: [
        {
          icon: 'apps',
          title: 'Home',
          to: '/'
        }
      ],
      miniVariant: false,
      title: 'Vodafone Rooms'
    }
  }
}
</script>
<style>
a {
  text-decoration: none;
}
</style>
