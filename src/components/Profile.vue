<template>
    <section id="profile_section">
        <h1>My profile</h1>
        <div class="user-login" v-if="!isLogged && showLogin">
            <h2>Login</h2>
            <form @submit.prevent="login">
                <input type="email" v-model="mail" placeholder="Email" required />
                <input type="password" v-model="password" placeholder="Password" required />
                <label class="toggle stay-connected-label" for="Stay_connected_login">
                    <input
                        type="checkbox"
                        class="toggle__input"
                        id="Stay_connected_login"
                        v-model="wantCookies"
                    />
                    <span class="toggle-track">
                        <span class="toggle-indicator">
                            <!-- 	This check mark is optional	 -->
                            <span class="checkMark">
                                <svg
                                    viewBox="0 0 24 24"
                                    id="ghq-svg-check"
                                    role="presentation"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M9.86 18a1 1 0 01-.73-.32l-4.86-5.17a1.001 1.001 0 011.46-1.37l4.12 4.39 8.41-9.2a1 1 0 111.48 1.34l-9.14 10a1 1 0 01-.73.33h-.01z"
                                    ></path>
                                </svg>
                            </span>
                        </span>
                    </span>
                    Stay connected
                </label>

                <input type="submit"  value="submit" >
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
            <h2>Fill the form to create an account</h2>
            <form @submit.prevent="signup" >
                <input type="email" v-model="mail" placeholder="enter your email" required />
                <input type="password" v-model="password" placeholder="Enter you password" minlength="8" required/>
                <input type="password" v-model="passwordVerif" :pattern="password" placeholder="Verify you password" title="Passwords are not equals" required/>

                <label class="toggle stay-connected-label" for="Stay_connected_signup">
                    <input
                        type="checkbox"
                        class="toggle__input"
                        id="Stay_connected_signup"
                        v-model="wantCookies"
                    />
                    <span class="toggle-track">
                        <span class="toggle-indicator">
                            <!-- 	This check mark is optional	 -->
                            <span class="checkMark">
                                <svg
                                    viewBox="0 0 24 24"
                                    id="ghq-svg-check"
                                    role="presentation"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M9.86 18a1 1 0 01-.73-.32l-4.86-5.17a1.001 1.001 0 011.46-1.37l4.12 4.39 8.41-9.2a1 1 0 111.48 1.34l-9.14 10a1 1 0 01-.73.33h-.01z"
                                    ></path>
                                </svg>
                            </span>
                        </span>
                    </span>
                    Stay connected
                </label>
                <input type="submit" value="submit" />
            </form>
            <a href="" @click.prevent="handleLogin"
                >Oh, never mind, I have an account !
            </a>
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
                mail: null,
                password: "",
                passwordVerif:"",
                error: "",
                willSignup: false,
                showLogin: true,
                wantCookies: false,
            };
        },
        methods: {
            ...mapMutations(["setUser", "setToken", "setIsLogged"]),
            handleLogin() {
                this.willSignup = false;
                this.showLogin = true;
            },
            login() {
                let payload = {
                    email: this.mail,
                    password: this.password,
                };
                axios
                    .post(
                        "https://multiple-chronos.herokuapp.com/api/auth/login",
                        payload
                    )
                    .then((res) => {
                        let user = res.data.userId;
                        let token = res.data.token;
                        this.setUser(user);
                        this.setToken(token);
                        this.setIsLogged("true");
                        if (this.wantCookies) this.setCookies();
                        this.setIsLogged("true");
                        this.$router.push("/");
                        this.showLogin = false;
                    })
                    .catch((e) => {
                        console.log(e);
                        this.error = e.response?.data?.message || e.message;
                        setTimeout(() => (this.error = ""), "5000");
                    });
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
                    .post(
                        "https://multiple-chronos.herokuapp.com/api/auth/signup",
                        payload
                    )
                    .then((res) => {
                        let user = res.data.userId;
                        let token = res.data.token;
                        this.setUser(user);
                        this.setToken(token);
                        this.setIsLogged("true");
                        if (this.wantCookies) this.setCookies();
                        this.showLogin = false;
                    })
                    .then(() => {
                        this.createUserDataBase();
                    })
                    .catch((e) => {
                        console.log(e);
                        this.error = e.response?.data?.message || e.message;
                        setTimeout(() => (this.error = ""), "5000");
                    });
            },
            createUserDataBase() {
                let payload = { chronos: [] };
                axios
                    .post(
                        `https://multiple-chronos.herokuapp.com/api/chronos`,
                        payload,
                        {
                            headers: {
                                Authorization: "Bearer " + this.tokenIsSet,
                            },

                            withCredentials: false,
                        }
                    )
                    .then((res) => {
                        console.log(res);
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

<style lang="scss">
    $toggle-indicator-size: 20px; // changing this number will resize the whole toggle
    $track-height: $toggle-indicator-size + 4;
    $track-width: $toggle-indicator-size * 2.5;
    $highContrastModeSupport: solid 2px transparent;
    /* 

The following vars come from my theme. 
You'll need to replace with your own color values. 

- "$light"
- "$mid"
- "$dark"

*/
    $dark: rgb(51, 48, 48);
    $track-background: #ffd25c;
    $focus-ring: 0px 0px 0px 2px;
    $speed: 300ms;

    // Toggle specific styles
    .toggle {
        align-items: center;
        border-radius: 100px;
        display: flex;
        margin-bottom: 16px;
    }
    .stay-connected-label {
        margin: auto;
    }
    .toggle__input {
        clip: rect(0 0 0 0);
        clip-path: inset(50%);
        height: 1px;
        overflow: hidden;
        position: absolute;
        white-space: nowrap;
        width: 1px;

        &:disabled + .toggle-track {
            cursor: not-allowed;
            opacity: 0.7;
        }
    }

    .toggle-track {
        background: $track-background;
        border-radius: 100px;
        border: 3px solid white;
        cursor: pointer;
        display: flex;
        height: $track-height;
        margin-right: 12px;
        position: relative;
        width: $track-width;
        box-shadow: 5px 5px 10px -10px #0000004a;
    }
   
    .toggle-indicator {
        align-items: center;
        background: white;
        border-radius: $toggle-indicator-size;
        bottom: 2px;
        display: flex;
        height: $toggle-indicator-size;
        justify-content: center;
        left: 2px;
        outline: $highContrastModeSupport;
        position: absolute;
        transition: $speed;
        width: $toggle-indicator-size;
    }

    // The check mark is optional
    .checkMark {
        fill: #ffd25c;
        height: $toggle-indicator-size - 4;
        width: $toggle-indicator-size - 4;
        opacity: 0;
        transition: opacity $speed ease-in-out;
    }

    .toggle__input:checked + .toggle-track .toggle-indicator {
        background: $dark;
        transform: translateX($track-width - $track-height);

        .checkMark {
            opacity: 1;
            transition: opacity $speed ease-in-out;
        }
    }

    @media screen and (-ms-high-contrast: active) {
        .toggle-track {
            border-radius: 0;
        }
    }
    input:invalid{
        outline-color:rgba(255, 0, 0, 0.527);
        transition:outline-color 300ms
    }
    input:valid{
        outline-color:rgba(0, 255, 64, 0.527);
        transition:outline-color 300ms

    }
</style>
