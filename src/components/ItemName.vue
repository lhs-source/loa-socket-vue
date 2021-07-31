<template>
<span :class="colorClasses">
    <slot />
</span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import GradeColor from '../constants/GradeColor';

@Component
export default class ItemName extends Vue {
    @Prop({default: 0}) readonly grade!: number;
    colorList: string[] = GradeColor.map(val => val.fontCss);

    get colorClasses() {
        let css: any = {};
        css[this.colorList[this.grade]] = true;
        return css;
    }
}
</script>

<style scoped>

</style>