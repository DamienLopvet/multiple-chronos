<template>

    <section>
        <div>
            <form>
                <input type="text" v-model="mail" placeholder="mail">
                <input type="password" v-model="password">
                <input type="submit" @click.self="login">
            </form>
            <div class="error" v-if="error"> {{ this.error }}</div>
        </div>
    </section>

</template>
<script>
    import {mapMutations} from 'vuex';
    import axios from 'axios';
    export default{
        name: "Profile",

        data(){
            return{
                mail:"",
                password:"",
                error:""
            
            }
        },
        methods:{
            ...mapMutations(["setUser", "setToken","setIsLogged"]),
          login(){
                let payload = {
                    email : this.mail,
                    password : this.password    
                }
                axios.post("http://localhost:3000/api/auth/login", payload).then(res=>{
                const  user = res.data.userId;
                const token = res.data.token;
                 this.setUser(user);
                 this.setToken(token);
                 this.setIsLogged('true');
                 let d = new Date();
                 d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
                 let expires = "expires=" + d.toUTCString();
                 document.cookie =
                 "TOKEN=" + token + ";" + expires + ";path=/";
                 document.cookie = 
                 "USER=" + user +";" + expires + ";path=/";
                 this.$router.push("/")
                }).catch(e=>{
                    console.log(e);
                this.error = e.response?.data?.message || e.message
                setTimeout(()=>this.error ="", "5000" )
        
                })
                
            }
        }
    }
</script>

<style>

</style>