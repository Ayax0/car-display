<script>
    export default {
        name: "KeyboardComponent",
        props: {
            value: { type: Boolean, required: true }
        },
        emits:["update:value", "key", "delete", "submit"],
        data() {
            return {
                status: false,
                layout: [
                    ["1","2","3","4","5","6","7","8","9","0"],
                    ["q","w","e","r","t","z","u","i","o","p","ü"],
                    ["a","s","d","f","g","h","j","k","l","ö","ä"],
                    ["y","x","c","v","b","n","m",",","."]
                ]
            }
        },
        watch: {
            value: {
                immediate: true,
                handler(value) {
                    this.status = value;
                }
            },
        }
    }
</script>

<template>
  <div
    class="keyboard"
    :class="{ show: status }"
  >
    <div
      v-for="(row, index) in layout"
      :key="index"
      class="key-row"
    >
      <div
        v-for="key in row"
        :key="key"
        v-ripple
        class="key"
        @click="$emit('key', key)"
      >
        {{ key }}
      </div>
      <div
        v-if="index == 3"
        class="key delete"
        @click="$emit('delete')"
      >
        <Icon
          v-ripple
          icon="mdi-backspace"
          height="1.5rem"
        />
      </div>
    </div>
    <div class="key-row">
      <div
        v-ripple
        class="key"
        @click="$emit('update:value', false)"
      >
        <Icon
          icon="mdi-keyboard-close"
          height="1.5rem"
        />
      </div>
      <div
        v-ripple
        class="key space"
        @click="$emit('key', ' ')"
      >
        <Icon
          icon="mdi-keyboard-space"
          height="1.5rem"
        />
      </div>
      <div
        v-ripple
        class="key"
        @click="$emit('submit'); $emit('update:value', false)"
      >
        <Icon
          icon="mdi-keyboard-return"
          height="1.5rem"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.keyboard {
    position: absolute;
    display: flex;
    flex-direction: column;
    bottom: 0;
    left: 0;
    height: 0vh;
    width: 100vw;
    background: rgba(20, 20, 20, 0.98);
    transition: height 0.2s ease-in-out;
    overflow: hidden;

    .key-row {
        flex: 1;
        display: flex;

        .key {
            position: relative;
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid rgba(40,40,40,0.9);
            color: white;
        }

        .key.delete {
            flex: 2.02;
        }

        .key.space {
            flex: 3;
        }
    }
}

.keyboard.show {
    height: 60vh;
}
</style>