<template>
  <div>
    <div v-if="!user" class="m-1">
      <input
        class="outline-none appearance-none w-full py-2 rounded text-grey-darkest leading-tight text-center"
        type="text"
        :style="{fontSize, marginTop}"
        style="transition: all .3s; background: rgba(255,255,255,.3)"
        placeholder="set your username..."
        autofocus
        v-model="name"
        v-on:keyup.enter="setUser(name)"
      >
    </div>
    <div v-if="user">
      <nav
        class="flex bg-white h-16 items-center border-b-2 border-orange-300 shadow w-full fixed z-50"
      >
        <div class="w-full max-w-5xl relative mx-auto md:px-6">
          <div class="flex items-center justify-around">
            <figure class="md:w-1/4 xl:w-1/5 md:px-6 pr-8">
              <img @click="toggleBackground" class="cursor-pointer h-16 w-auto" src="/lol.gif">
            </figure>
            <div
              class="cursor-pointer bg-orange-200 p-1 rounded flex items-center px-2 hover:shadow-md transition"
              @click="fix"
            >
              <h2>🐛</h2>
              <span class="text-sm">Fix</span>
            </div>
            <pou-search class="md:w-3/4 xl:w-4/5 md:px-6 xl:px-12" :user="user"></pou-search>
            <div class="md:w-1/4 xl:w-1/5 md:px-6 pl-8 break-words">
              <p>👤{{ user }}</p>
            </div>
          </div>
        </div>
      </nav>
      <main class="pt-20 max-w-5xl mx-auto">
        <section
          class="flex flex-wrap md:flex-no-wrap rounded-lg bg-white overflow-hidden shadow mx-2 xl:mx-0"
        >
          <div class="w-full md:w-2/3">
            <pou-youtube></pou-youtube>
          </div>
          <div class="flex flex-col px-4 pb-4 md:pt-2 w-full md:w-1/3 justify-between">
            <pou-users class="py-2 flex-1" :user="user"></pou-users>
            <pou-chat class="pt-2" :user="user"></pou-chat>
          </div>
        </section>
        <section class="rounded-lg bg-white shadow mx-2 my-4 xl:mx-0">
          <pou-list :user="user"></pou-list>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import pouSearch from "./components/pou-search.vue";
import pouYoutube from "./components/pou-youtube.vue";
import pouList from "./components/pou-list.vue";
import pouChat from "./components/pou-chat.vue";
import pouUsers from "./components/pou-users.vue";
import { db } from "./firebase.js";
import { setCliendId } from "./ably/ably.js";

export default {
  name: "App",
  components: {
    pouSearch,
    pouYoutube,
    pouList,
    pouChat,
    pouUsers
  },
  data() {
    return {
      user: "",
      backgroundImage: "bg-1",
      name: ""
    };
  },
  computed: {
    video() {
      return db.collection("video").doc("current");
    },
    fontSize() {
      if (!this.name.length) {
        return '9vw';
      }
      return 100 / (this.name.length + 3)  + 'vw';
    },
    marginTop() {
      return `calc(40vh - ${this.fontSize} / 2)`;
    }
  },
  methods: {
    setUser(name) {
      this.user = name;
      setCliendId(this.user);
    },
    toggleBackground() {
      const body = document.querySelector("body");
      const classToAdd = body.classList.contains("bg-1") ? "bg-2" : "bg-1";
      const classToRemove = classToAdd === "bg-1" ? "bg-2" : "bg-1";
      body.classList.remove(classToRemove);
      body.classList.add(classToAdd);
    },
    fix() {
      this.video.set({});
      this.video.set({
        video: "tPEE9ZwTmy0",
        title: "Shortest Video on Youtube",
        user: this.user,
        playing: true,
        seconds: 0
      });
    }
  }
};
</script>


