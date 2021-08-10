<template>
    <span></span>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from 'axios';
import cheerio, { CheerioAPI } from 'cheerio';
import { Socket } from "@/constants/SocketList";

enum ACCTYPE {
    ALL = 0,
    NECK = 200010,
    EARRING = 200020,
    RING = 200030,
}

@Component({
})
export default class ServerService extends Vue {

    putAccessaryFromTrader(request: RequestAccessaryFromTrader) {
        return axios.put('http://localhost:5000/acc', request).then((res: any) => {
            console.log(res);
        })
    }
}

export interface RequestAccessaryFromTrader {
    grade: 4 | 5;
    socket: Socket[];
}

</script>