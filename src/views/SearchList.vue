<template>
    <div class="modal-wrapper">
        <div class="modal-background" @click.stop="close($event, false)">
        </div>
        <div class="modal-frame" @click.stop>
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';

@Component
export default class SearchList extends Vue {
    
    @Emit('close')
    close(event: Event, update: boolean) {
        return update;
    }
}
</script>

<style lang="scss" scoped>
.modal-wrapper {
    z-index: 10;
    .modal-background {
        position: fixed;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;
        background-color: #33333388;
    }
    .modal-frame {
        overflow-y: auto;
        position: absolute;
        right: 0;
        top: 0;

        background-color: white;
        height: 100%;
        width: 30vw;
        max-width: 960px;

        color: #333;
    }
}
</style>