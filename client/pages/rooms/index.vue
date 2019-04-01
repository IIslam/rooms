<template>
  <div>
    <room-card v-for="room in rooms" :key="room.id" :room="room" />
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import RoomCard from '@/components/rooms/RoomCard'
export default {
  components: {
    RoomCard
  },
  async fetch({ store }) {
    await store.dispatch('room/index')
  },
  computed: {
    ...mapGetters('room', ['rooms'])
  },
  methods: {
    ...mapActions('room', ['destroy'])
  }
}
</script>
