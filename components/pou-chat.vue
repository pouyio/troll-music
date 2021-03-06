<template>
  <pou-bordered icon="💬" active="true">
    <h2 class="absolute top-0 bg-white rounded-full px-2"></h2>
    <div class="overflow-auto h-64 pr-1" v-chat-scroll="{always: false, scrollonremoved:true}">
      <transition-group name="getin">
        <div
          v-for="(message, index) in messages"
          :key="+index"
          class="pt-1 flex flex-col leading-none"
          :class="{'text-right': message[0] === user}"
        >
          <span v-if="message[0] !== user" class="text-xs font-light text-orange-600">{{message[0]}}</span>
          <span v-html="sanitize(message[1])"></span>
        </div>
      </transition-group>
    </div>
    <div class="border-t -mx-2 px-2 pt-2 relative">
      <textarea
        class="resize-y w-full outline-none pr-6"
        type="text"
        placeholder="Send a message..."
        v-model="message"
        @keyup.enter="submit"
      ></textarea>
      <emoji-picker :search="search">
        <div
          class="absolute top-0 right-0 p-2 cursor-pointer emoji-invoker outline-none"
          slot="emoji-invoker"
          slot-scope="{ events: { click: clickEvent } }"
          @click="clickEvent()"
        >
          <button class="focus:outline-none h-6 w-6 rounded-full">😀</button>
        </div>
        <div slot="emoji-picker" slot-scope="{ emojis }">
          <div
            class="absolute z-10 border mx-2 p-3 pin-b rounded bg-white shadow t-4 h-64 overflow-y-auto mb-16"
          >
            <div class="flex">
              <input
                class="flex-1 rounded-full border py-1 px-2 outline-none text-sm"
                type="text"
                v-model="search"
                v-focus
              >
            </div>
            <div v-for="(emojiGroup, category) in emojis" :key="category">
              <h5 class="text-grey-darker uppercase text-sm cursor-default mb-2 mt-4">{{ category }}</h5>
              <div class="flex flex-wrap justify-between emojis text-lg">
                <button
                  class="p-1 cursor-pointer rounded hover:bg-gray-200 focus:outline-none flex items-center justify-center h-6 w-6"
                  v-for="(emoji, emojiName) in emojiGroup"
                  :key="emojiName"
                  @click="append(emoji)"
                  :title="emojiName"
                >{{ emoji }}</button>
              </div>
            </div>
          </div>
        </div>
      </emoji-picker>
    </div>
  </pou-bordered>
</template>

<script>
import anchorme from "anchorme";
import pouBordered from "./pou-bordered";
import EmojiPicker from "vue-emoji-picker";
import { channel } from "../ably/ably.js";

export default {
  name: "pou-chat",
  props: ["user"],
  components: {
    pouBordered,
    EmojiPicker
  },
  data() {
    return {
      message: "",
      messages: [],
      search: ""
    };
  },
  methods: {
    submit() {
      this.message = this.message.trim();
      if (!this.message) {
        return;
      }
      channel.publish("message", { user: this.user, message: this.message });
      this.message = "";
    },
    append(emoji) {
      this.message += emoji;
    },
    sanitize(text) {
      return this.$sanitize(text);
    }
  },
  created() {
    channel.subscribe("message", ({ data: { user, message } }) => {
      this.messages.push([
        user,
        anchorme(message, {
          truncate: 100,
          attributes: [
            {
              name: "target",
              value: "_blank"
            },
            {
              name: "class",
              value: "text-orange-600"
            }
          ]
        })
      ]);
      if (this.user !== user && !document.hasFocus()) {
        this.$notification.show(
          user,
          {
            body: message,
            icon: "https://f4.bcbits.com/img/0010573837_20.jpg"
          },
          { onclick: () => window.focus() }
        );
      }
    });
  },
  directives: {
    focus: {
      inserted(el) {
        el.focus();
      }
    }
  }
};
</script>

<style scoped>
.getin-enter-active {
  transition: all 0.4s;
}
.getin-enter {
  opacity: 0;
  transform: translateX(-0.75em);
}
</style>
