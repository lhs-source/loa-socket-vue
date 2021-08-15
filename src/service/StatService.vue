<template>
    <span></span>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from 'axios';
import cheerio, { CheerioAPI } from 'cheerio';
import { Socket } from "@/constants/SocketList";

@Component({
})
export default class StatService extends Vue {

    /**
     * * 조회 횟수 집계
     */
    getAllLogSockets() {
        return axios.get('/api/stat').then((res: any) => {
            return res;
        })
    }
    /**
     * * 가격 집계
     */
    getAllLogPrices() {
        return axios.get('/api/stat/price').then((res: any) => {
            return res;
        })
    }
}

</script>