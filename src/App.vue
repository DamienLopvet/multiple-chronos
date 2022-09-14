<template>
  <div id="nav">
    <router-link to="/"><i class="fa-solid fa-home" :class="{ dark: darkTheme }"></i
      ></router-link> 
    <router-link to="/MyProfile" ><i class="fa-solid fa-user" :class="{ dark: darkTheme }"></i
      ></router-link>
  </div>
  <router-view/>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  position: relative;
  
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active i{
      color: #42b983;
    }
  }
}
</style>
