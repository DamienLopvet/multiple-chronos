<template>
    <Counter />
</template>

<script>
// @ is an alias to /src
import Counter from '@/components/Counter.vue'
import '../assets/style.css'
export default {
  name: 'Home',
  components: {
    Counter
  }
}
</script>
