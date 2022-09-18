<template>
    <section id="profile_section">
        <h1>My profile</h1>
        <div class="user-login" v-if="!isLogged && showLogin">
            <form>
                <input type="email" v-model="mail" placeholder="email" />
                <input type="password" v-model="password" />
                <label for="stay-connected"><input type="checkbox" id="stay-connected" v-model="wantCookies">Remain connected</label>
                <input type="submit" @click.prevent="login" value="submit" />
            </form>
            <!-- <a href="#">I don't remember my pasword?</a> -->
            <a href="" @click.prevent="handleSignup">Create an account</a>
        </div>
        <div class="user-logout" v-if="isLogged">
            <p>you are connected</p>
            <a href="#" @click="logout">logout</a>
        </div>
        <div class="error" v-if="error">{{ this.error }}</div>
        <div class="user-signup" v-if="willSignup">
            <h2>please fill the form to create an account</H2>
            <form>
                <input type="email" v-model="mail" placeholder="mail" />
                <input type="password" v-model="password" />
                <label for="stay-connected"><input type="checkbox" id="stay-connected" v-model="wantCookies">Stay connected</label>
                <input type="submit" @click.prevent="signup"  value="submit"/>
            </form>
            <a href="" @click.prevent="handleLogin">Oh, never mind, I have an account ! </a>

        </div>
    </section>
</template>
<script>
    import store from "@/store";
    import { mapMutations } from "vuex";
    import axios from "axios";
    export default {
        name: "Profile",

        data() {
            return {
                mail: "",
                password: "",
                error: "",
                willSignup: false,
                showLogin: true,
                wantCookies:false,
            };
        },
        methods: {
            ...mapMutations(["setUser", "setToken", "setIsLogged"]),
            handleLogin(){
                this.willSignup = false;
                this.showLogin = true;
            },
            login() {
               if (confirm('The stopwatches you created offline will be overwrited by the ones stored in database')){
                let payload = {
                    email: this.mail,
                    password: this.password,
                };
                axios
                    .post("https://multiple-chronos.herokuapp.com/api/auth/login", payload)
                    .then((res) => {
                        let user = res.data.userId;
                        let token = res.data.token;
                        this.setUser(user);
                        this.setToken(token);
                        this.setIsLogged("true");
                        if(this.wantCookies)this.setCookies();
                        this.setIsLogged("true");
                        this.$router.push("/");
                        this.showLogin = false;                        
                    })
                    .catch((e) => {
                        console.log(e);
                        this.error = e.response?.data?.message || e.message;
                        setTimeout(() => (this.error = ""), "5000");
                    });
                }
            },
            setCookies() {
                let d = new Date();
                d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
                let expires = "expires=" + d.toUTCString();
                document.cookie =
                    "TOKEN=" + this.tokenIsSet + ";" + expires + ";path=/";
                document.cookie =
                    "USER=" + this.userIsSet + ";" + expires + ";path=/";
            },
            deleteCookies() {
                let d = new Date();
                d.setTime(d.getTime() - 365 * 24 * 60 * 60 * 1000);
                let expires = "expires=" + d.toUTCString();
                document.cookie =
                    "TOKEN=" + this.tokenIsSet + ";" + expires + ";path=/";
                document.cookie =
                    "USER=" + this.userIsSet + ";" + expires + ";path=/";
            },
            logout() {
                this.setUser(undefined);
                this.setToken(undefined);
                this.setIsLogged(false);
                this.deleteCookies();
            },
            handleSignup() {
                this.showLogin = false;
                this.willSignup = true;
            },
            signup() {
                let payload = {
                    email: this.mail,
                    password: this.password,
                };
                axios
                    .post("https://multiple-chronos.herokuapp.com/api/auth/signup", payload)
                    .then((res) => {
                        let user = res.data.userId;
                        let token = res.data.token;
                        this.setUser(user);
                        this.setToken(token);
                        this.setIsLogged("true");
                        if(this.wantCookies)this.setCookies();
                        this.showLogin = false;
                    }).then(() => {
                        this.createUserDataBase();
                    }).catch((e) => {
                        console.log(e);
                        this.error = e.response?.data?.message || e.message;
                        setTimeout(() => (this.error = ""), "5000");
                    });
            },
            createUserDataBase() {
                let payload ={ 'chronos': [] }
                axios
                    .post(`https://multiple-chronos.herokuapp.com/api/chronos`,payload,{
                        headers: {
                            Authorization: "Bearer " + this.tokenIsSet,
                        },
                        
                        withCredentials: false,
                    })
                    .then((res) => {console.log(res);
                        this.$router.push("/");
                    })
                    .catch((e) => (this.error = e));
            },
        },
        computed: {
            isLogged() {
                return store.state.isLogged;
            },
            userIsSet() {
                return store.state.user;
            },
            tokenIsSet() {
                return store.state.token;
            },
        },
        created() {
            const token = ("; " + document.cookie)
                .split(`; TOKEN=`)
                .pop()
                .split(";")[0];
            const user = ("; " + document.cookie)
                .split(`; USER=`)
                .pop()
                .split(";")[0];

            if (user.length === 0 || token.length === 0) {
                new Notification("You're offline", {
                    body: "please connect or register to access all your stopwatches ",
                    icon: "../assets/logo.png",
                    tag: "connect notif",
                });
            } else {
                this.setUser(user);
                this.setToken(token);
                this.setIsLogged(true);
            }
        },
    };
</script>

