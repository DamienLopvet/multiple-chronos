<template>

    <section>
        <div>
            <form action="#">
                <input type="text" v-model="mail" placeholder="mail">
                <input type="password" v-model="password">
                <button @click="login"></button>
            </form>
        </div>
    </section>

</template>
<script>
    import axios from 'axios'
    export default{
        name: "Profile",

        data(){
            return{
                mail:"",
                password:""
            
            }
        },
        methods:{
            login(){
                let payload = {
                    email : this.mail,
                    password : this.password    
                }
                axios.post("http://localhost:3000/api/auth/login", payload).then(res=>console.log(res.data.token))
            }
        }
    }
</script>

<style>

div{
    color:black
}
</style>