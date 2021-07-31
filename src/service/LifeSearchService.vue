<template>
    <span></span>
</template>

<script lang="ts">
import axios from 'axios';
import cheerio, { CheerioAPI } from 'cheerio';

import { Component, Vue } from "vue-property-decorator";

enum LIFE_CODE {
    GATHER  = 90200,
    TREE  = 90300,
    STONE = 90400, 
    HUNT  = 90500,
    FISH  = 90600,
    GEO   = 90700,
}

@Component({
})
export default class LifeSearchService extends Vue {
    async getGatherPrice() {
        return await this.getLifePrice(LIFE_CODE.GATHER);
    }
    async getTreePrice() {
        return await this.getLifePrice(LIFE_CODE.TREE);
    }
    async getStonePrice() {
        return await this.getLifePrice(LIFE_CODE.STONE);
    }
    async getHuntPrice() {
        return await this.getLifePrice(LIFE_CODE.HUNT);
    }
    async getFishPrice() {
        return await this.getLifePrice(LIFE_CODE.FISH);
    }
    async getGeoPrice() {
        return await this.getLifePrice(LIFE_CODE.GEO);
    }

    async getLifePrice(code: number) {
        let param: any = {
            firstCategory: 90000,
            secondCategory: code,
            characterClass: '',
            tier: 0,
            grade: 99,
            itemName: '',
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
        let output: LifeItemData[] = [];
        cheer('tbody tr').each((i, el) => {
            // console.log(cheer(el).find('div.grade')[0])
            let name = (cheer(el).find('span.name')[0].children[0] as any).data;
            let count = Number((cheer(el).find('span.count em')[0].children[0] as any).data.match(/\d/g).join(''));
            let grade = Number(cheer(el).find('div.grade')[0].attribs['data-grade']);
            // let grade = 0;
            let avgLastDay = Number((cheer(el).find('div.price em')[0].children[0] as any).data);
            let lastPrice = Number((cheer(el).find('div.price em')[1].children[0] as any).data);
            let price = Number((cheer(el).find('div.price em')[2].children[0] as any).data);
            let tree: LifeItemData = {
                name: name,
                grade: grade,
                title: '',
                description: '',
                avgLastDay: avgLastDay,
                lastPrice: lastPrice,
                price: price,
                count: count,
                pricePerCount: price / count,
            }
            output.push(tree);
        })
        
        return output;
    }
}

export interface LifeItemData {
    name: string;
    grade: number;
    title: string;
    description: string;
    avgLastDay: number;
    lastPrice: number;
    price: number;
    count: number;
    pricePerCount: number;
}
</script>