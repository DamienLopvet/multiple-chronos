<template>
<Counter />


</template>

<script>
  
    import Counter from "./components/Counter.vue";
    import './assets/style.css'

    export default {
        name: "App",
        components: { Counter}
    };
</script>