<template>
    <section id="counter_section">
        <header>
            <div>
                <h1>Stopwatch</h1>
                <p class="clock-time">{{ localTime }}</p>
            </div>
            <audio controls="" name="media">
                <source
                    src="https://icecast.radiofrance.fr/fip-hifi.aac"
                    type="audio/aac"
                />
            </audio>
            <span id="log-state"
                >{{ isLogged ? "connected" : "offline" }}
            </span>
        </header>
        <p v-if="error">{{ error }}</p>
        <div v-if="loading" class="loadspinner">
            <span class="clock"></span>
        </div>
        <div class="manage-chronos">
            <span
                class="add-counter-button"
                @click="this.showCreateChrono = true"
                ><i class="fa-solid fa-plus"></i
            ></span>
            <span
                class="manage-chronos-icon"
                title="delete all"
                @click="deleteAllChronos"
                ><i class="fa-solid fa-trash"></i
            ></span>
            <span
                class="manage-chronos-icon"
                title="reset all"
                @click="resetAllChronos"
                ><i class="fa-solid fa-rotate-right"></i
            ></span>
        </div>
        <div class="chronos-container">
            <div
                class="chrono-card"
                v-for="(chrono, index) in arrayOfChronos"
                :key="index"
            >
                <!-- Title -->
                <div
                    class="chrono-title"
                    @click="
                        chrono.showEditTitle = true;
                        this.newTitle = chrono.title;
                    "
                    :style="{ 'background-color': chrono.color }"
                >
                    <p type="text">{{ chrono.title }}</p>
                    <i
                        class="fa-solid fa-pen chrono-title-edit cursor-pointer"
                        @click="chrono.showEditTitle = true"
                    ></i>
                </div>
                <!-- counter -->
                <div
                    class="chrono-counter"
                    @click="!chrono.start ? start(chrono) : stop(chrono)"
                >
                    <span v-if="chrono.start" class="clock"></span>
                    <span v-if="!chrono.chronoState">00:00</span>
                    <span v-else>{{
                        new Date(chrono.chronoState).toISOString().slice(11, -8)
                    }}</span>
                </div>
                <!-- NAV -->
                <div
                    class="chrono-nav"
                    :style="{ 'background-color': chrono.color }"
                >
                    <!-- backward -->
                    <span
                        v-if="chrono.starTime > 0"
                        class="chrono-backward cursor-pointer"
                        @mousedown="backward(chrono)"
                        @mouseup="stopBackwarding()"
                        @touchstart="backward(chrono)"
                        @touchend="stopBackwarding()"
                        ><i class="fa-solid fa-backward"></i
                    ></span>
                    <!-- reset -->
                    <span v-if="chrono.starTime > 0" @click="reset(chrono)"
                        ><i class="fa-solid fa-rotate-right cursor-pointer"></i
                    ></span>
                    <!-- play / pause -->
                    <span
                        @click="!chrono.start ? start(chrono) : stop(chrono)"
                        class="startStop cursor-pointer"
                    >
                        <i
                            v-if="!chrono.start"
                            class="fa-solid fa-play cursor-pointer"
                        ></i>
                        <i v-else class="fa-solid fa-pause cursor-pointer"></i>
                    </span>

                    <!-- trashbin -->
                    <span v-if="chrono.starTime > 0" @click="trash(chrono)"
                        ><i class="fa-solid fa-trash-can cursor-pointer"></i
                    ></span>
                    <!-- forward -->
                    <span
                        v-if="chrono.starTime > 0"
                        class="chrono-forward cursor-pointer"
                        @mousedown.left="forward(chrono)"
                        @mouseup.left="stopForwarding()"
                        @touchstart="forward(chrono)"
                        @touchend="stopForwarding()"
                        ><i class="fa-solid fa-forward"></i
                    ></span>
                </div>
                <!-- edit Title -->
                <div
                    v-if="chrono.showEditTitle"
                    class="modal"
                    @click.self="chrono.showEditTitle = false"
                >
                    <form @submit="editTitle(chrono)" class="edit-chrono-title">
                        <input
                            type="text"
                            v-model="newTitle"
                            :placeholder="`Change | ` + chrono.title + ` | ?`"
                            required
                        />
                        <input
                            type="submit"
                            class="modal-submit"
                            value="submit"
                        />
                    </form>
                </div>
            </div>
        </div>
        <!-- create chrono -->
        <div
            v-if="showCreateChrono"
            class="modal"
            @click.self="this.showCreateChrono = false"
        >
            <form @submit="createChrono" class="create-chrono">
                <input
                    type="text"
                    placeholder="add a title to your counter"
                    v-model.trim="titleToSet"
                    required
                />
                <input type="submit" value="submit" />
            </form>
        </div>
        <div>
            <span
                v-if="darkThemeIsSet"
                class="theme cursor-pointer"
                @click="toggleDarkTheme('light')"
                ><i class="fa-solid fa-sun"></i
            ></span>
            <span
                v-else
                class="theme cursor-pointer"
                @click="toggleDarkTheme('dark')"
                ><i class="fa-solid fa-moon"></i
            ></span>
        </div>
    </section>
</template>

<script>
    import store from "@/store";
    import { mapMutations } from "vuex";
    import axios from "axios";

    export default {
        name: "Counter",

        data() {
            return {
                error: "",
                showCreateChrono: false,
                arrayOfChronos: [],
                counter: 0,
                titleToSet: "",
                localTime: "",
                newTitle: "",
                loading: true,
                colors: [
                    "#B1EDE8",
                    "#da3e52",
                    "#E8D7FF",
                    "#96e6b3",
                    "#21A0A0",
                    "#FF8360",
                    "#5CC8FF",
                    "#1EFFBC",
                    "#FFAF87",
                    "#dd9787",
                    "#678d58",
                    "#74d3ae",
                    "#ffd25c",
                    "#FFAE03",
                    "#00798c",
                    "#d1495b",
                    "#F896D8",
                    "#e8b4bc",
                    "#fe4e00",
                ],
            };
        },

        methods: {
            ...mapMutations([
                "setUser",
                "setToken",
                "setIsLogged",
                "setDarkTheme",
            ]),
            notificationRequest() {
                Notification.requestPermission();
            },
            showLocalTime() {
                this.localTime = new Date().toLocaleTimeString([], {
                    timeStyle: "short",
                });
                setInterval(() => {
                    this.localTime = new Date().toLocaleTimeString([], {
                        timeStyle: "short",
                    });
                }, 60000);
            },

            start(chrono) {
                chrono.start = true;
                chrono.starTime = Date.now() - chrono.chronoState;
                chrono.counterInterval = setInterval(() => {
                    chrono.chronoState = Date.now() - chrono.starTime;
                    this.updateLocalStorage(chrono);
                }, 10000);
                if (this.isLogged) {
                    chrono.DBupdateInterval = setInterval(() => {
                        this.updateDataBase();
                    }, 60000);
                }
            },
            stop(chrono) {
                clearInterval(chrono.counterInterval);
                if (this.isLogged) {
                    clearInterval(chrono.DBupdateInterval);
                }
                chrono.start = false;
                this.updateLocalStorage(chrono);
                if (this.isLogged) this.updateDataBase();
            },
            reset(chrono) {
                clearInterval(chrono.counterInterval);
                if (this.isLogged) {
                    clearInterval(chrono.DBupdateInterval);
                }
                chrono.start = false;
                chrono.chronoState = 0;
                chrono.starTime = "";
                chrono.DBupdateInterval = 0;
                chrono.counterInterval = 0;
                this.updateLocalStorage(chrono);
                if (this.isLogged) this.updateDataBase();
            },
            updateLocalStorage(chrono) {
                /***CREATE A NEW ITEM TO INSERT***/
                let chronoToStore = { ...chrono };

                /***RETREIVE CHRONO MATCHING POSITION IN ARRAY AND REPLACE***/
                let indexOfChrono = this.arrayOfChronos.findIndex(
                    (e) => e.title == chrono.title
                );
                this.arrayOfChronos.splice(indexOfChrono, 1, chronoToStore);

                /***LOCALSTORAGE NEW ARRAY  ***/
                this.sendToLocalStorage();
            },

            updateDataBase() {
                let payload = { chronos: this.arrayOfChronos };
                axios
                    .put(
                        `https://multiplechronobackend.onrender.com/api/chronos`,
                        payload,
                        {
                            headers: {
                                Authorization: "Bearer " + this.tokenIsSet,
                            },
                            withCredentials: false,
                        }
                    )
                    .catch((e) => (this.error = e));
            },
            sendToLocalStorage() {
                localStorage.setItem(
                    "chronos",
                    JSON.stringify(this.arrayOfChronos)
                );
            },
            /***GET LOCAL STORAGE ITEMS**/
            getLocalStorage() {
                this.arrayOfChronos =
                    JSON.parse(localStorage.getItem("chronos")) || [];
                if (this.arrayOfChronos.length == 0) {
                    this.showCreateChrono = true;
                }else{
                    this.loading = false;
                }

                this.arrayOfChronos.forEach((element) => {
                    element.start = false;
                });
                this.sendToLocalStorage();
                if (this.isLogged) this.updateDataBase();
            },
            importDBChronos() {
                axios({
                    headers: {
                        Authorization: "Bearer " + this.tokenIsSet,
                    },
                    method: "get",
                    url: `https://multiplechronobackend.onrender.com/api/chronos`,
                    withCredentials: false,
                })
                    .then((res) => {
                        this.arrayOfChronos = res.data[0].chronos;
                        this.sendToLocalStorage();
                        this.showCreateChrono = false;
                        this.loading = false;
                    })
                    .catch((e) => (this.error = e));
            },
            titleIsNotUnique(title) {
                let titleIsNotUniq = this.arrayOfChronos.some(
                    (e) => e.title == title
                );
                if (titleIsNotUniq) {
                    alert(
                        "this Title is already assigned to a stopwatch, please choose another"
                    );
                    return true;
                }
            },
            randomColor() {
                let min = 0;
                let max = this.colors.length;
                let color =
                    this.colors[
                        Math.floor(Math.random() * (max - min + 1) + min)
                    ];
                return color;
            },
            createChrono() {
                let chronoToAdd = {
                    title: this.titleToSet,
                    chronoState: 0,
                    start: false,
                    showEditTitle: false,
                    color: this.randomColor(),
                };
                if (this.titleIsNotUnique(this.titleToSet) == true) {
                    return;
                } else {
                    this.arrayOfChronos.push(chronoToAdd);
                    this.sendToLocalStorage();
                    if (this.isLogged) this.updateDataBase();
                    this.showCreateChrono = false;
                    this.titleToSet = "";
                }
            },
            editTitle(chrono) {
                let chronoToUpdate = this.arrayOfChronos.findIndex(
                    (e) => e.title == chrono.title
                );
                if (this.titleIsNotUnique(this.newTitle) == true) {
                    return;
                } else {
                    chrono.title = this.newTitle;
                    chrono.showEditTitle = false;
                    this.arrayOfChronos.splice(chronoToUpdate, 1, {
                        ...chrono,
                    });
                    this.sendToLocalStorage();
                    if (this.isLogged) this.updateDataBase();

                    this.newTitle = "";
                }
            },
            forward(chrono) {
                clearInterval(chrono.counterInterval);
                chrono.start = false;
                this.forwarding = setInterval(() => {
                    chrono.chronoState += 60000;
                    this.updateLocalStorage(chrono);
                }, 10);

                this.sendToLocalStorage();
            },
            stopForwarding() {
                clearInterval(this.forwarding);
                if (this.isLogged) this.updateDataBase();
            },
            backward(chrono) {
                clearInterval(chrono.counterInterval);
                chrono.start = false;
                this.backwarding = setInterval(() => {
                    chrono.chronoState -= 60000;
                    this.updateLocalStorage(chrono);
                }, 10);

                this.sendToLocalStorage();
            },
            stopBackwarding() {
                clearInterval(this.backwarding);
                if (this.isLogged) this.updateDataBase();
            },
            trash(chrono) {
                this.stop(chrono);
                let indexOfChrono = this.arrayOfChronos.findIndex(
                    (e) => e.title == chrono.title
                );
                this.arrayOfChronos.splice(indexOfChrono, 1);
                /***LOCALSTORAGE NEW ARRAY  ***/
                this.sendToLocalStorage();
                if (this.isLogged) this.updateDataBase();
            },
            resetAllChronos() {
                if (confirm("Are you sure you want to reset all StopWatch?")) {
                    for (let chrono of this.arrayOfChronos) {
                        this.stop(chrono);
                        this.reset(chrono);
                    }
                    setTimeout(() => {
                        if (this.isLogged) this.updateDataBase();
                    }, 2000);
                }
            },
            deleteAllChronos() {
                if (confirm("Are you sure you want to delete all StopWatch?")) {
                    this.arrayOfChronos = [];
                    this.sendToLocalStorage();
                    if (this.isLogged) this.updateDataBase();
                    setTimeout(() => {
                        if (this.isLogged) this.showCreateChrono = true;
                    }, 2000);
                }
            },
            setTheme() {
                let theme = JSON.parse(localStorage.getItem("darkTheme"));
                if (theme) {
                    this.setDarkTheme(true);
                } else this.setDarkTheme(false);
            },
            toggleDarkTheme(val) {
                if (val === "light") {
                    this.setDarkTheme(false);
                    document.body.classList.remove("dark");
                    localStorage.setItem("darkTheme", false);
                } else if (val === "dark") {
                    this.setDarkTheme(true);
                    document.body.classList.add("dark");
                    localStorage.setItem("darkTheme", true);
                }
            },
        },
        watch: {
            darkThemeIsSet() {
                const root = document.documentElement;

                if (this.darkThemeIsSet) {
                    root.style.setProperty("--background-color", "#383333");
                    root.style.setProperty("--color", "white");
                } else {
                    root.style.setProperty("--background-color", "#f8f8f8");
                    root.style.setProperty("--color", "black");
                }
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
            darkThemeIsSet() {
                return store.state.darkTheme;
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
            if (token && user) {
                this.setUser(user);
                this.setToken(token);
                this.setIsLogged(true);
            }
        },
        mounted() {
            var self = this;
            if (this.isLogged) {
                this.importDBChronos();
            } else this.getLocalStorage();
            window.addEventListener("keydown", function (event) {
                if (event.code === "Escape") {
                    self.showCreateChrono = false;
                }
            });
            this.showLocalTime();
            this.notificationRequest();
            this.setTheme();
        },
    };
</script>
<style></style>
