<template>
    <section>
        <header :style="{'background-color': dynamiColor}">
            <div>
                <h1>Stopwatch</h1>
                <p class="clock-time">{{ localTime }}</p>
            </div>
        </header>
        <span class="add-counter-button" @click="this.showCreateChrono=true"
            :style="{'background-color': dynamiColor}"><i class="fa-solid fa-plus"></i></span>
        <div class="chronos-container" :style="{'border-color': dynamiColor}">
                <div class="chrono-card" v-for="(chrono, index) in arrayOfChronos" :key="index">
                    <!-- Title -->
                    <div class="chrono-title" :style="{'background-color': dynamiColor}">
                        <p type="text">{{chrono.title}}</p>
                        <i class="fa-solid fa-pen chrono-title-edit cursor-pointer"
                            @click="chrono.showEditTitle = true"></i>
                    </div>
                    <!-- counter -->
                    <div class="chrono-counter" @click="!chrono.start? start(chrono) : stop(chrono)">
                        <span v-if="chrono.start" class="clock"></span>
                        <span v-if="!chrono.start" class="mask" ></span>
                        <span v-if="!chrono.chronoState">00:00</span>
                        <span v-else>{{
                            new Date(chrono.chronoState).toISOString().slice(11, -8)
                            }}</span>
                    </div>
                    <!-- NAV -->
                    <div class="chrono-nav" :style="{'background-color': dynamiColor}">
                        <!-- backward -->
                        <span v-if="chrono.starTime>0" class="chrono-backward cursor-pointer"
                            @mousedown="backward(chrono)" @mouseup="stopBackwarding()" @touchstart="backward(chrono)" @touchend="stopBackwarding()"><i
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
                            @mousedown.left="forward(chrono)" @mouseup.left="stopForwarding()" @touchstart="forward(chrono)" @touchend="stopForwarding()"><i
                                class="fa-solid fa-forward"></i></span>

                    </div>
                    <!-- edit Title -->
                    <div v-if="chrono.showEditTitle" class="modal" @click.self="chrono.showEditTitle=false">
                        <form @submit="editTitle(chrono)" class="edit-chrono-title"
                            :style="{'border-color': dynamiColor}">
                            {{chrono.title}}
                            <input type="text" v-model="newTitle" :style="{'background-color':dynamiColor }"
                                placeholder="Enter a new title" required>
                            <button type="submit" class="modal-submit" :style="{'background-color': dynamiColor}"><i
                                    class="fa-solid fa-plus"></i></button>
                        </form>

                    </div>

                </div>

        </div>
        <div v-if="showCreateChrono" class="modal" @click.self="this.showCreateChrono=false">
            <form @submit="createChrono" class=" create-chrono" :style="{'border-color': dynamiColor}">
                <input type="text" placeholder="add a title to your counter" v-model.trim="titleToSet" required
                    :style="{'background-color': dynamiColor}" />
                <button type="submit" class="modal-submit" :style="{'background-color': dynamiColor}"><i
                        class="fa-solid fa-plus"></i></button>
            </form>
        </div>
        <span class="color-palette cursor-pointer" @click="showChangePrimaryColor=true"
            :style="{'background-color':dynamiColor}"><i class="fa-solid fa-palette"></i></span>
        <div v-if="showChangePrimaryColor" class="modal" @click.self="this.showChangePrimaryColor=false">

            <form @submit="addPersonalColor" class="create-color" :style="{'border-color': dynamiColor}">
                <p>Enter a color</p>
                <input type="text" class="color-picker" v-model="dynamiColor"
                    :style="{'background-color':dynamiColor }">
            </form>

        </div>

    </section>
</template>

<script>

    export default {
        name: "Counter",



        data() {
            return {
                showChangePrimaryColor: false,
                showCreateChrono: false,
                arrayOfChronos: [],
                counter: 0,
                titleToSet: "",
                dynamiColor: '#1465',
                localTime: "",
            };
        },

        methods: {
            addPersonalColor() {
                this.showChangePrimaryColor = false
                localStorage.setItem(
                    "primaryColor",
                    JSON.stringify(this.dynamiColor)
                );

            },
            setPrimaryColor() {
                let color = localStorage.getItem("primaryColor")
                if (color) {
                    this.dynamiColor = JSON.parse(localStorage.getItem("primaryColor") || '#1465'
                    );
                }
                else { return }
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
                    alert("this Title is already assigned to a stop watch, please choose another");
                    return true
                }
            },
            createChrono() {
                let chronoToAdd = {
                    title: this.titleToSet,
                    chronoState: 0,
                    start: false,
                    showEditTitle: false,
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
                console.log(this.arrayOfChronos);
                /***LOCALSTORAGE NEW ARRAY  ***/
                localStorage.setItem(
                    "chronos",
                    JSON.stringify(this.arrayOfChronos)
                );
            },
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
                    self.showChangePrimaryColor = false
                }
            });
            this.showLocalTime();
            this.setPrimaryColor()



        },
    };
</script>