import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import MyProfile from '../views/MyProfile.vue'
import '../assets/style.css'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/myprofile',
    name: 'Profile',
    component:MyProfile
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
