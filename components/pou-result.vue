<template>
  <div
    class="text-sm w-32 md:w-48 md:m-2 m-1 rounded md:flex-initial flex-grow relative overflow-hidden bg-orange-lightest flex flex-col"
  >
    <figure class>
      <img class="w-full" :src="img" alt="video image">
    </figure>
    <div class="p-2 flex-grow">
      <p v-html="title"></p>
    </div>
    <div class="border-t border-orange-300 flex">
      <div class="inline-block border-r border-orange-600 py-2 w-1/2 text-center">
        <button class="font-light focus:outline-none" @click="addVideo">Play now ▶️</button>
      </div>
      <div class="inline-block py-2 w-1/2 text-center">
        <button class="font-light focus:outline-none" @click="queueVideo">Add to list ➕</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "pou-result",
  props: ["title", "img", "id", "user"],
  methods: {
    addVideo() {
      this.$emit("add", this.id, this.title, this.user);
    },
    queueVideo() {
      this.$emit("queue", this.id, this.title, this.user);
    }
  }
};
</script>