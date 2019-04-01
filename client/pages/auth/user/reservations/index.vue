<template>
  <div>
    <reservation-card
      v-for="reservation in active_reservations"
      active
      :key="reservation.id"
      :reservation="reservation"
    />
    <v-divider dark></v-divider>
    <p class="pa-3">In active reservations</p>
    <reservation-card
      v-for="reservation in inactive_reservations"
      :key="reservation.id"
      :reservation="reservation"
    />
  </div>
</template>
<script>
import ReservationCard from '@/components/reservations/ReservationCard'
export default {
  components: {
    ReservationCard
  },
  computed: {
    active_reservations() {
      return this.user.reservations.filter(reservation => {
        return new Date(reservation.start_date) > new Date()
      })
    },
    inactive_reservations() {
      return this.user.reservations.filter(reservation => {
        return new Date(reservation.start_date) < new Date()
      })
    }
  }
}
</script>
