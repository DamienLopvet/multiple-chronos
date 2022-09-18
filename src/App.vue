<template>
  <div id="nav">
    <router-link to="/" id="counte_link"><i class="fa-solid fa-home" ></i
      ></router-link> 
    <router-link to="/MyProfile" id="profile_link" ><i class="fa-solid fa-user"></i
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
  display: flex;
  flex-flow: row;
  justify-content: end;
  gap: 0.5rem;  
  margin-right:10px;
  translate:-50px;
  a {
    padding:5px;
    font-weight: bold;
    color: #2c3e50;
    background-color:#f8f8f8;
    border-radius:5px;

    &.router-link-exact-active i{
      color: #42b983;
    }
  }
}
</style>
