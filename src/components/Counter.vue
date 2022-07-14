<template>
    <section>
        <header :class="{dark:darkTheme}">
            <div>
                <h1>Stopwatch</h1>
                <p class="clock-time">{{ localTime }}</p>
            </div>
        </header>
        <span class="add-counter-button" @click="this.showCreateChrono=true"><i class="fa-solid fa-plus"></i></span>
        <div class="manage-chronos">
            <span class="manage-chronos-icon" title="delete all" @click="deleteAllChronos"><i
                    class="fa-solid fa-trash"></i></span>
            <span class="manage-chronos-icon" title="reset all" @click="resetAllChronos"><i
                    class="fa-solid fa-rotate-right"></i></span>
        </div>
        <div class="chronos-container">
            <div class="chrono-card" v-for="(chrono, index) in arrayOfChronos" :key="index">
                <!-- Title -->
                <div class="chrono-title" @click="chrono.showEditTitle = true"
                    :style="{'background-color' : chrono.color}">
                    <p type="text">{{chrono.title}}</p>
                    <i class="fa-solid fa-pen chrono-title-edit cursor-pointer"
                        @click="chrono.showEditTitle = true"></i>
                </div>
                <!-- counter -->
                <div class="chrono-counter" @click="!chrono.start? start(chrono) : stop(chrono)"
                    :class="{dark:darkTheme}">
                    <span v-if="chrono.start" class="clock"></span>
                    <span v-if="!chrono.chronoState">00:00</span>
                    <span v-else>{{
                        new Date(chrono.chronoState).toISOString().slice(11, -8)
                        }}</span>
                </div>
                <!-- NAV -->
                <div class="chrono-nav" :style="{'background-color' : chrono.color}">
                    <!-- backward -->
                    <span v-if="chrono.starTime>0" class="chrono-backward cursor-pointer" @mousedown="backward(chrono)"
                        @mouseup="stopBackwarding()" @touchstart="backward(chrono)" @touchend="stopBackwarding()"><i
                            class="fa-solid fa-backward"></i></span>
                    <!-- reset -->
                    <span v-if="chrono.starTime>0" @click="reset(chrono)"><i
                            class="fa-solid fa-rotate-right cursor-pointer"></i></span>
                    <!-- play / pause -->
                    <span @click="!chrono.start? start(chrono) : stop(chrono)" class="startStop cursor-pointer">
                        <i v-if=!chrono.start class="fa-solid   fa-play cursor-pointer"></i>
                        <i v-else class="fa-solid fa-pause cursor-pointer"></i>
                    </span>

                    <!-- trashbin -->
                    <span v-if="chrono.starTime>0" @click="trash(chrono)"><i
                            class="fa-solid fa-trash-can cursor-pointer"></i></span>
                    <!-- forward -->
                    <span v-if="chrono.starTime>0" class="chrono-forward cursor-pointer"
                        @mousedown.left="forward(chrono)" @mouseup.left="stopForwarding()" @touchstart="forward(chrono)"
                        @touchend="stopForwarding()"><i class="fa-solid fa-forward"></i></span>

                </div>
                <!-- edit Title -->
                <div v-if="chrono.showEditTitle" class="modal" @click.self="chrono.showEditTitle=false">
                    <form @submit="editTitle(chrono)" class="edit-chrono-title" :class="{dark:darkTheme}">

                        <input type="text" v-model="newTitle" :placeholder="`Change | ` + chrono.title + ` | ?`"
                            required>
                        <button type="submit" class="modal-submit"><i class="fa-solid fa-plus"></i></button>
                    </form>

                </div>

            </div>

        </div>
        <!-- create chrono -->
        <div v-if="showCreateChrono" class="modal" @click.self="this.showCreateChrono=false">
            <form @submit="createChrono" class="create-chrono" :class="{dark:darkTheme}">
                <input type="text" placeholder="add a title to your counter" v-model.trim="titleToSet" required />
                <button type="submit" class="modal-submit"><i class="fa-solid fa-plus"></i></button>
            </form>
        </div>
        <div :class="{dark:darkTheme}">
            <span v-if="darkTheme" class="theme cursor-pointer"
                @click="lightTheme = !lightTheme, darkTheme = !darkTheme" :class="{dark:darkTheme}"><i
                    class="fa-solid fa-sun" :class="{dark:darkTheme}"></i></span>
            <span v-if="lightTheme" class="theme cursor-pointer"
                @click="lightTheme = !lightTheme, darkTheme = !darkTheme"><i class="fa-solid fa-moon"
                    :class="{dark:darkTheme}"></i></span>

        </div>
 </section>
</template>

<script>

    export default {
        name: "Counter",



        data() {
            return {

                lightTheme: true,
                darkTheme: false,
                showCreateChrono: false,
                arrayOfChronos: [],
                counter: 0,
                titleToSet: "",
                localTime: "",
                colors: [
                '#B1EDE8','#da3e52','#E8D7FF', '#96e6b3', '#21A0A0','#FF8360','#5CC8FF','#1EFFBC', '#FFAF87', '#dd9787', '#678d58', '#74d3ae', '#ffd25c', '#FFAE03', '#00798c', '#d1495b', '#F896D8', '#e8b4bc', '#fe4e00'
                ]

            };
        },

        methods: {


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
                    this.updateLocalStorage(chrono)

                }, 10000);

            },
            stop(chrono) {
                clearInterval(chrono.counterInterval);
                chrono.start = false;
                this.updateLocalStorage(chrono)
            },
            reset(chrono) {
                clearInterval(chrono.counterInterval)
                chrono.start = false
                chrono.chronoState = 0;
                chrono.starTime = '';
                this.updateLocalStorage(chrono)

            },
            updateLocalStorage(chrono) {
                /***CREATE A NEW ITEM TO INSERT***/
                let chronoToStore = { ...chrono };

                /***RETREIVE CHRONO MATCHING POSITION IN ARRAY AND REPLACE***/
                let indexOfChrono = this.arrayOfChronos.findIndex(e => e.title == chrono.title
                );
                this.arrayOfChronos.splice(indexOfChrono, 1, chronoToStore);

                /***LOCALSTORAGE NEW ARRAY  ***/
                this.sendToLocalStorage()

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
                if (this.arrayOfChronos.length == 0) { this.showCreateChrono = true }

                this.arrayOfChronos.forEach(element => { element.start = false });
                this.sendToLocalStorage()
            },
            titleIsNotUnique(title) {
                let titleIsNotUniq = this.arrayOfChronos.some(e => e.title == title)
                if (titleIsNotUniq) {
                    alert("this Title is already assigned to a stopwatch, please choose another");
                    return true
                }
            },
            randomColor() {

                let min = 0;
                let max = this.colors.length;
                let color = this.colors[Math.floor(Math.random() * (max - min + 1) + min)];
                return color
            },
            createChrono() {
                let chronoToAdd = {
                    title: this.titleToSet,
                    chronoState: 0,
                    start: false,
                    showEditTitle: false,
                    color: this.randomColor()
                }
                if (this.titleIsNotUnique(this.titleToSet) == true) {
                    return
                } else {
                    this.arrayOfChronos.push(chronoToAdd);
                    this.sendToLocalStorage()

                }
            },
            editTitle(chrono) {
                let chronoToUpdate = this.arrayOfChronos.findIndex(e => e.title == chrono.title)
                if (this.titleIsNotUnique(this.newTitle) == true) { return }
                else {
                    chrono.title = this.newTitle
                    chrono.showEditTitle = false
                    this.arrayOfChronos.splice(chronoToUpdate, 1, { ...chrono })
                    this.sendToLocalStorage()
                    this.newTitle = ''
                }


            },
            forward(chrono) {
                clearInterval(chrono.counterInterval)
                chrono.start = false
                this.forwarding = setInterval(() => {
                    chrono.chronoState += 60000
                    this.updateLocalStorage(chrono)

                }, 10);

                this.sendToLocalStorage()



            },
            stopForwarding() {
                clearInterval(this.forwarding)

            },
            backward(chrono) {
                clearInterval(chrono.counterInterval)
                chrono.start = false
                this.backwarding = setInterval(() => {
                    chrono.chronoState -= 60000
                    this.updateLocalStorage(chrono)

                }, 10);

                this.sendToLocalStorage()
            },
            stopBackwarding() {
                clearInterval(this.backwarding)

            },
            trash(chrono) {
                this.stop(chrono)
                let indexOfChrono = this.arrayOfChronos.findIndex(e => e.title == chrono.title
                );
                this.arrayOfChronos.splice(indexOfChrono, 1);
                /***LOCALSTORAGE NEW ARRAY  ***/
                localStorage.setItem(
                    "chronos",
                    JSON.stringify(this.arrayOfChronos)
                );
            },
            resetAllChronos() {
                if (confirm("Are you sure you want to reset all StopWatch?")) {

                    for (let chrono of this.arrayOfChronos) {
                        this.stop(chrono)
                        this.reset(chrono)
                    }
                }
            },
            deleteAllChronos() {
                if (confirm("Are you sure you want to delete all StopWatch?")) {

                    this.arrayOfChronos = [];
                    this.sendToLocalStorage();
                    this.showCreateChrono = true
                }

            },
        },
        watch: {
            darkTheme() {
                if (this.darkTheme) {
                    document.body.classList.add("dark");
                } else {
                    document.body.classList.remove("dark");

                }
            }
        },


        mounted() {
            var self = this
            this.getLocalStorage();
            window.addEventListener('keyup', function (event) {
                if (event.keyCode === 107) {
                    self.showCreateChrono = true
                }
                else if (event.keyCode === 27) {
                    self.showCreateChrono = false
                }
            });
            this.showLocalTime();



        },
    };
</script>