<template>
    <span></span>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from 'axios';
import cheerio, { CheerioAPI } from 'cheerio';


enum ACCTYPE {
    ALL = 0,
    NECK = 200010,
    EARRING = 200020,
    RING = 200030,
}


@Component({
    components: {

    }
})
export default class AccSearchService extends Vue {

    
    async getData(request: RequestAcc) {
        let param: any = {};
        let prop: number | null = 0;
        switch(request.property){
            case 0: // 치
                prop = 15;
                break;
            case 1: // 특
                prop = 16;
                break;
            case 2: // 신
                prop = 18;
                break;
            default:
                prop = null;
                break;
        }

        param['request[firstCategory]'] = 200000;
        param['request[secondCategory]'] = ACCTYPE.RING,
        param['request[classNo]'] = '';
        param['request[itemTier]'] = 3;
        param['request[itemGrade]'] = 5;
        param['request[itemLevelMin]'] = 0
        param['request[itemLevelMax]'] = 1600
        param['request[itemName]'] = ''; 
        param['request[gradeQuality]'] = 50
        param['request[skillOptionList][0][firstOption]'] = '';
        param['request[skillOptionList][0][secondOption]'] = '';
        param['request[skillOptionList][0][minValue]'] = '';
        param['request[skillOptionList][0][maxValue]'] = ''; 

        param['request[skillOptionList][1][firstOption]'] = ''; 
        param['request[skillOptionList][1][secondOption]'] = ''; 
        param['request[skillOptionList][1][minValue]'] = ''; 
        param['request[skillOptionList][1][maxValue]'] = ''; 

        param['request[skillOptionList][2][firstOption]'] = ''; 
        param['request[skillOptionList][2][secondOption]'] = ''; 
        param['request[skillOptionList][2][minValue]'] = ''; 
        param['request[skillOptionList][2][maxValue]'] = ''; 

        param['request[etcOptionList][0][firstOption]'] = 2;
        param['request[etcOptionList][0][secondOption]'] = prop;
        param['request[etcOptionList][0][minValue]'] = ''; 
        param['request[etcOptionList][0][maxValue]'] = ''; 

        param['request[etcOptionList][1][firstOption]'] = 3
        param['request[etcOptionList][1][secondOption]'] = request.socket1.id
        param['request[etcOptionList][1][minValue]'] = request.socket1.number; 
        param['request[etcOptionList][1][maxValue]'] = ''; 

        param['request[etcOptionList][2][firstOption]'] = 3; 
        param['request[etcOptionList][2][secondOption]'] = request.socket2.id; 
        param['request[etcOptionList][2][minValue]'] = request.socket2.number; 
        param['request[etcOptionList][2][maxValue]'] = ''; 

        param['request[etcOptionList][3][firstOption]'] = ''; 
        param['request[etcOptionList][3][secondOption]'] = ''; 
        param['request[etcOptionList][3][minValue]'] = ''; 
        param['request[etcOptionList][3][maxValue]'] = ''; 
        
        param['request[sortOption][Sort]'] = 'BUY_PRICE';
        param['request[sortOption][IsDesc]'] = true;
        
        param['request[pageNo]'] = 1
        param['pushKey'] = '';
        param['tooltipData'] = ''; 
        let form = new URLSearchParams(param);
        let res = await axios.post(
                'https://lhs-yeah.herokuapp.com/https://lostark.game.onstove.com/Auction/GetAuctionListV2',
                form, 
                {
                    headers: {
                        // 'Content-Type' : 'application/x-www-form-urlencoded'
                        'Origin': 'https://lostark.game.onstove.com',
                        'Referer': 'https://lostark.game.onstove.com/Auction'

                    }
                })
        let data = res.data;
        let cheer = cheerio.load(data);
        let output: any[] = [];
        cheer('tbody tr').each((i, el) => {
            let name = (cheer(el).find('span.name')[0].children[0] as any).data;
            let count = '';
            try{
                count = (cheer(el).find('span.count font')[0].children[0] as any).data.match(/\d/g).join('');
            }catch(e : any) {
                count = '';
            }
            let grade = Number(cheer(el).find('div.grade')[0].attribs['data-grade']);
            let socket = cheer(el).find('div.effect ul')[0];
            let socket1 = {
                name: (cheer(socket.children[1]).children('font')[0].children[0] as any).data,
                number: Number((cheer(socket.children[1]).children('font')[1].children[0] as any).data.match(/\d/g).join('')),
            };
            let socket2 = {
                name: (cheer(socket.children[3]).children('font')[0].children[0] as any).data,
                number: Number((cheer(socket.children[3]).children('font')[1].children[0] as any).data.match(/\d/g).join('')),
            };
            let badSocket1 = {
                name: (cheer(socket.children[5]).children('font')[0].children[0] as any).data,
                number: Number((cheer(socket.children[5]).children('font')[1].children[0] as any).data.match(/\d/g).join('')),
            };
            let prop = cheer(el).find('div.effect ul')[1];
            let property = {
                name: (cheer(prop.children[1]).children('font')[0].children[0] as any).data,
                number: Number((cheer(prop.children[1]).children('font')[1].children[0] as any).data.match(/\d/g).join('')),
            };
            let price = Number((cheer(el).find('div.price-buy em')[0].children[0] as any).data.match(/\d/g).join(''));
            let raw: AccData = {
                name: name,
                count: count,
                grade: grade,
                socket1: socket1,
                socket2: socket2,
                badSocket1: badSocket1,
                property: property,
                price: price,
            }
            console.log(raw);
            output.push(raw);
        })

        return output;
    }
}

export interface RequestAcc {
    socket1: {
        id: number;
        number: number;
    }
    socket2: {
        id: number;
        number: number;
    }
    property: number;
}
export interface AccData {
    name: string;
    count: string;
    grade: number;
    socket1: {
        name: string;
        number: number;
    }
    socket2:{
        name: string;
        number: number;
    }
    badSocket1: {
        name: string;
        number: number;
    }
    property: {
        name: string;
        number: number;
    }
    price: number;
}
</script>