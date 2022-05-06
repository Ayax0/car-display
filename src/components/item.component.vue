<script>
    export default {
        name: "ItemComponent",
        props: {
            value: { type: Object, required: true },
            to: { type: String, default: undefined },
            rounded: { type: Boolean, default: undefined }
        },
        methods: {
            getImage(item) {
                if(item.type == "track") return item.album.images.sort((a, b) => (a.width > b.width ? -1 : 1))[0];
                return item.images.sort((a, b) => (a.width > b.width ? -1 : 1))[0];
            },
            route() {
                if(this.to) this.$router.push(this.to);
            }
        }
    }
</script>

<template>
  <div
    class="group"
    :class="{ rounded }"
    @click="route"
  >
    <div
      class="item"
      :style="{ 'background-image': `url('${getImage(value)?.url || 'https://ui-avatars.com/api/?background=3d3d3d&name=' + value.name}')` }"
    />
    <div class="name">
      {{ value.name }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.group {
    display: block;
    width: 10rem;
    border-radius: 5px;

    .item {
        width: 10rem;
        min-width: 10rem;
        height: 10rem;
        min-height: 10rem;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        border-radius: 8px;
        margin-bottom: 0.5rem;
    }

    .name {
        padding: 0.5rem 0;
        text-align: center;
        color: white;
        font-size: 14px;
        word-wrap: break-word;
    }
}

.group.rounded {
    box-shadow: none;
    background: none;

    .item {
        border-radius: 5rem;
    }
}
</style>