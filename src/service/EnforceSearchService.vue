<template>
    <span></span>
</template>

<script lang="ts">
import axios from 'axios';
import cheerio, { CheerioAPI } from 'cheerio';

import { Component, Vue } from "vue-property-decorator";

@Component({
})
export default class EnforecSearchService extends Vue {
    firstCategory = 50000;

    async getOrehaPrice() {
        let param: any = {
            firstCategory: 50000,
            secondCategory: 50010,
            characterClass: '',
            tier: 0,
            grade: 99,
            itemName: '오레하',
            pageNo: 1,
            isInit: false,
            sortType: 1,
            _: new Date().getTime()
        }

        let res = await axios.get(
            'https://lhs-yeah.herokuapp.com/https://lostark.game.onstove.com/Market/List_v2', 
            {
                params: param
            });
        
        let data = res.data;
        let cheer = cheerio.load(data);
        let output: OrehaItemData[] = [];
        cheer('tbody tr').each((i, el) => {
            // console.log(cheer(el).find('div.grade')[0])
            let name = (cheer(el).find('span.name')[0].children[0] as any).data;
            let grade = Number(cheer(el).find('div.grade')[0].attribs['data-grade']);
            // let grade = 0;
            let avgLastDay = Number((cheer(el).find('div.price em')[0].children[0] as any).data);
            let lastPrice = Number((cheer(el).find('div.price em')[1].children[0] as any).data);
            let price = Number((cheer(el).find('div.price em')[2].children[0] as any).data);
            let tree: OrehaItemData = {
                name: name,
                grade: grade,
                title: '',
                description: '',
                avgLastDay: avgLastDay,
                lastPrice: lastPrice,
                price: price,
            }
            output.push(tree);
        })
        
        return output;
    }
}

export interface OrehaItemData {
    name: string;
    grade: number;
    title: string;
    description: string;
    avgLastDay: number;
    lastPrice: number;
    price: number;
}
</script>