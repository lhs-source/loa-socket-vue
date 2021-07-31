<template>
    <div style="padding-bottom: 48px; display: flex; justify-content: center;">
        <div class="center" style=" max-width: 1280px;">
            <div style="margin-top: 16px;" class="font-gold">마지막 조회 시간 : {{displayTimestamp}} </div>
            <div class="grid">
                <LifeItemList 
                    title="🌿 채집" 
                    :loading="gatherLoading"
                    :lifeData="gatherData" 
                    />
                <LifeItemList 
                    title="🌳 벌목" 
                    :loading="treeLoading"
                    :lifeData="treeData" 
                    />
                <LifeItemList 
                    title="💎 채광" 
                    :loading="stoneLoading"
                    :lifeData="stoneData"
                    />
                <LifeItemList 
                    title="🐰 수렵" 
                    :loading="huntLoading"
                    :lifeData="huntData" 
                    />
                <LifeItemList 
                    title="🎣 낚시" 
                    :loading="fishLoading"
                    :lifeData="fishData" 
                    />
                <LifeItemList 
                    title="🗿 고고" 
                    :loading="geoLoading"
                    :lifeData="geoData" 
                    />
            </div>
            <div class="potion">
                <div>
                    채집 재료로 <ItemName :grade="3">정령의 회복약</ItemName> 제작 ➜ 
                    1개당<span class="font-gold">{{ displayPotion3.pricePerCount.toFixed(2) }}골드</span>
                    - {{potionOnceNumber}}개당 <span class="font-gold">{{ Number(displayPotion3.price).toFixed(2) }}골드</span>
                    (제작 시 개당 <span :class="{'font-blue' : displayPotion3.compare < 0, 'font-red' : displayPotion3.compare >= 0}">{{ displayPotion3.compare.toFixed(2) }}</span>
                    골드 <span v-if="displayPotion3.compare > 0" class='font-red'>이득</span><span v-else class="font-blue">손해</span>)
                </div>
                <div>
                    채집 재료로 <ItemName :grade="2">고급 회복약</ItemName> 제작 ➜ 1개당 
                    <span class="font-gold">{{ displayPotion2.pricePerCount.toFixed(2) }}골드</span> 
                    - ({{potionOnceNumber}}개당 <span class="font-gold">{{ Number(displayPotion2.price).toFixed(2) }}골드</span>
                    (제작 시 개당 <span :class="{'font-blue' : displayPotion2.compare < 0, 'font-red' : displayPotion2.compare >= 0}">{{ displayPotion2.compare.toFixed(2) }}</span>
                    골드 <span v-if="displayPotion2.compare >= 0" class='font-red'>이득</span><span v-else class="font-blue">손해</span>)
                </div>
            </div>
            
            <div class="oreha">
                <div>
                    채집 재료로 <ItemName :grade="3">상급 오레하 융화 재료</ItemName> 제작 (WIP)
                    <div>
                        수렵 ➜ 1개당 <span class="font-gold">{{ displayOreha3[0].pricePerCount.toFixed(2) }}골드</span> 
                        - {{orehaOnceNumber - 10}}개당 <span class="font-gold">{{ displayOreha3[0].price.toFixed(2) }}골드</span>
                        (제작 시 개당 <span :class="{'font-blue' : displayOreha3[0].compare < 0, 'font-red' : displayOreha3[0].compare >= 0}">{{ displayOreha3[0].compare.toFixed(2) }}</span>
                        골드 <span v-if="displayOreha3[0].compare > 0" class='font-red'>이득</span><span v-else class="font-blue">손해</span>)
                    </div>
                    <div>
                        낚시 ➜ 1개당 <span class="font-gold">{{ displayOreha3[1].pricePerCount.toFixed(2) }}골드</span> 
                        - {{orehaOnceNumber - 10}}개당 <span class="font-gold">{{ displayOreha3[1].price.toFixed(2) }}골드</span>
                        (제작 시 개당 <span :class="{'font-blue' : displayOreha3[1].compare < 0, 'font-red' : displayOreha3[1].compare >= 0}">{{ displayOreha3[1].compare.toFixed(2) }}</span>
                        골드 <span v-if="displayOreha3[1].compare > 0" class='font-red'>이득</span><span v-else class="font-blue">손해</span>)
                    </div>
                    <div>
                        고고 ➜ 1개당 <span class="font-gold">{{ displayOreha3[2].pricePerCount.toFixed(2) }}골드</span> 
                        - {{orehaOnceNumber - 10}}개당 <span class="font-gold">{{ displayOreha3[2].price.toFixed(2) }}골드</span>
                        (제작 시 개당 <span :class="{'font-blue' : displayOreha3[2].compare < 0, 'font-red' : displayOreha3[2].compare >= 0}">{{ displayOreha3[2].compare.toFixed(2) }}</span>
                        골드 <span v-if="displayOreha3[2].compare > 0" class='font-red'>이득</span><span v-else class="font-blue">손해</span>)
                    </div>
                </div>
                <div>
                    채집 재료로 <ItemName :grade="2">중급 오레하 융화 재료</ItemName> 제작
                    <div>
                        수렵 ➜ 1개당 <span class="font-gold">{{ displayOreha2[0].pricePerCount.toFixed(2) }}골드</span> 
                        - {{orehaOnceNumber}}개당 <span class="font-gold">{{ displayOreha2[0].price.toFixed(2) }}골드</span>
                        (제작 시 개당 <span :class="{'font-blue' : displayOreha2[0].compare < 0, 'font-red' : displayOreha2[0].compare >= 0}">{{ displayOreha2[0].compare.toFixed(2) }}</span>
                        골드 <span v-if="displayOreha2[0].compare > 0" class='font-red'>이득</span><span v-else class="font-blue">손해</span>)
                    </div>
                    <div>
                        낚시 ➜ 1개당 <span class="font-gold">{{ displayOreha2[1].pricePerCount.toFixed(2) }}골드</span> 
                        - {{orehaOnceNumber}}개당 <span class="font-gold">{{ displayOreha2[1].price.toFixed(2) }}골드</span>
                        (제작 시 개당 <span :class="{'font-blue' : displayOreha2[1].compare < 0, 'font-red' : displayOreha2[1].compare >= 0}">{{ displayOreha2[1].compare.toFixed(2) }}</span>
                        골드 <span v-if="displayOreha2[1].compare > 0" class='font-red'>이득</span><span v-else class="font-blue">손해</span>)
                    </div>
                    <div>
                        고고 ➜ 1개당 <span class="font-gold">{{ displayOreha2[2].pricePerCount.toFixed(2) }}골드</span> 
                        - {{orehaOnceNumber}}개당 <span class="font-gold">{{ displayOreha2[2].price.toFixed(2) }}골드</span>
                        (제작 시 개당 <span :class="{'font-blue' : displayOreha2[2].compare < 0, 'font-red' : displayOreha2[2].compare >= 0}">{{ displayOreha2[2].compare.toFixed(2) }}</span>
                        골드 <span v-if="displayOreha2[2].compare > 0" class='font-red'>이득</span><span v-else class="font-blue">손해</span>)
                    </div>
                </div>
                <div>
                    채집 재료로 <ItemName :grade="1">하급 오레하 융화 재료</ItemName> 제작
                    <div>
                        수렵 ➜ 1개당 <span class="font-gold">{{ displayOreha1[0].pricePerCount.toFixed(2) }}골드</span> 
                        - {{orehaOnceNumber}}개당 <span class="font-gold">{{ displayOreha1[0].price.toFixed(2) }}골드</span>
                        (제작 시 개당 <span :class="{'font-blue' : displayOreha1[0].compare < 0, 'font-red' : displayOreha1[0].compare >= 0}">{{ displayOreha1[0].compare.toFixed(2) }}</span>
                        골드 <span v-if="displayOreha1[0].compare > 0" class='font-red'>이득</span><span v-else class="font-blue">손해</span>)
                    </div>
                    <div>
                        낚시 ➜ 1개당 <span class="font-gold">{{ displayOreha1[1].pricePerCount.toFixed(2) }}골드</span> 
                        - {{orehaOnceNumber}}개당 <span class="font-gold">{{ displayOreha1[1].price.toFixed(2) }}골드</span>
                        (제작 시 개당 <span :class="{'font-blue' : displayOreha1[1].compare < 0, 'font-red' : displayOreha1[1].compare >= 0}">{{ displayOreha1[1].compare.toFixed(2) }}</span>
                        골드 <span v-if="displayOreha1[1].compare > 0" class='font-red'>이득</span><span v-else class="font-blue">손해</span>)
                    </div>
                    <div>
                        고고 ➜ 1개당 <span class="font-gold">{{ displayOreha1[2].pricePerCount.toFixed(2) }}골드</span> 
                        - {{orehaOnceNumber}}개당 <span class="font-gold">{{ displayOreha1[2].price.toFixed(2) }}골드</span>
                        (제작 시 개당 <span :class="{'font-blue' : displayOreha1[2].compare < 0, 'font-red' : displayOreha1[2].compare >= 0}">{{ displayOreha1[2].compare.toFixed(2) }}</span>
                        골드 <span v-if="displayOreha1[2].compare > 0" class='font-red'>이득</span><span v-else class="font-blue">손해</span>)
                    </div>
                </div>
            </div>
            <div class="grid">
                <EtcItemList 
                    title="❤️ ️회복약" 
                    :loading="potionLoading"
                    :lifeData="potionData" 
                    />
                <EtcItemList 
                    title="🥚 오레하" 
                    :loading="orehaLoading"
                    :lifeData="orehaData" 
                    />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mixins } from 'vue-class-component';
import moment from 'moment';

import LifeItemList from '../components/LifeItemList.vue';
import EtcItemList from '../components/EtcItemList.vue';
import ItemName from '../components/ItemName.vue';

import LifeSearchService, {LifeItemData} from '../service/LifeSearchService.vue';
import EnforceSearchService, { OrehaItemData} from '../service/EnforceSearchService.vue';
import PotionSearchService, { PotionItemData} from '../service/PotionSearchService.vue';

@Component({
    components: {
        LifeItemList,
        ItemName,
        EtcItemList,
    },
})
export default class TradeRate extends mixins(LifeSearchService, EnforceSearchService, PotionSearchService) {
    timestamp: Date = new Date();

    gatherData: LifeItemData[] = [];
    gatherLoading = false;

    treeData: LifeItemData[] = [];
    treeLoading = false;

    stoneData: LifeItemData[] = [];
    stoneLoading = false;

    huntData: LifeItemData[] = [];
    huntLoading = false;

    fishData: LifeItemData[] = [];
    fishLoading = false;

    geoData: LifeItemData[] = [];
    geoLoading = false;

    potionData: PotionItemData[] = [];
    potionLoading = false;
    potionOnceNumber = 3;

    orehaData: OrehaItemData[] = [];
    orehaLoading = false;
    orehaOnceNumber = 30;

    /**
     * 마지막 조회 시간 출력
     */
    get displayTimestamp() {
        return moment(this.timestamp).format('YYYY년 MM월 DD일 HH시 mm분 ss초');
    }
    /**
     * 정령의 회복약 제작비용
     */
    get displayPotion3() {
        if(!this.gatherData || this.gatherData.length <= 0 ||
            !this.potionData || this.potionData.length <= 0) {
            return {
                price: 0,
                pricePerCount: 0,
                compare: 0,
            };
        }
        let price = (this.gatherData[0].pricePerCount * 48 
                    + this.gatherData[2].pricePerCount * 24 
                    + this.gatherData[4].pricePerCount * 6
                    + 29);   // 제작비용
        return {
            price: price,
            pricePerCount: price / this.potionOnceNumber,
            compare: this.potionData[2].price - price / this.potionOnceNumber
        };
    }
    /**
     * 고급 회복약 제작 비용
     */
    get displayPotion2() {
        if(!this.gatherData || this.gatherData.length <= 0 ||
            !this.potionData || this.potionData.length <= 0) {
            return {
                price: 0,
                pricePerCount: 0,
                compare: 0,
            };
        }
        let price = (this.gatherData[0].pricePerCount * 18 
                    + this.gatherData[2].pricePerCount * 9 
                    + 14);
        return {
            price: price,
            pricePerCount: price / this.potionOnceNumber,
            compare: this.potionData[1].price - price / this.potionOnceNumber
        };
    }
    
    /**
     * 상급 오레하 제작비용
     */
    get displayOreha3() {
        if(!this.huntData || this.huntData.length <= 0 ||
            !this.fishData || this.fishData.length <= 0 || 
            !this.geoData || this.geoData.length <= 0|| 
            !this.orehaData || this.orehaData.length <= 0) {
            return [{
                price: 0,
                pricePerCount: 0,
                compare: 0,
            }, {
                price: 0,
                pricePerCount: 0,
                compare: 0,
            }, {
                price: 0,
                pricePerCount: 0,
                compare: 0,
            }];
        }
        let number1 = 20; // 수렵, 낚시
        let number2 = 16; // 고고
        let grade = 2;      // 상급
        let makeCost = 240;

        let huntPrice = {
            price:  (this.huntData[0].pricePerCount * number1 * 8 
                    + this.huntData[2].pricePerCount * 36
                    + this.huntData[4].pricePerCount * number1
                    + makeCost), // 제작비용
            pricePerCount: 0,
            compare: 0,
        }
        huntPrice.pricePerCount = huntPrice.price / (this.orehaOnceNumber - 10); // 20개씩 만들어짐
        huntPrice.compare = this.orehaData[grade].price - huntPrice.pricePerCount;
        let fishPrice = {
            price:  (this.fishData[0].pricePerCount * number1 * 8 
                    + this.fishData[2].pricePerCount * 36
                    + this.fishData[4].pricePerCount * number1
                    + makeCost), // 제작비용
            pricePerCount: 0,
            compare: 0,
        }
        fishPrice.pricePerCount = fishPrice.price / (this.orehaOnceNumber - 10); // 20개씩 만들어짐
        fishPrice.compare = this.orehaData[grade].price - fishPrice.pricePerCount;
        let geoPrice = {
            price:  (this.geoData[0].pricePerCount * number2 * 8
                    + this.geoData[1].pricePerCount * 29
                    + this.geoData[3].pricePerCount * number2
                    + makeCost), // 제작비용
            pricePerCount: 0,
            compare: 0,
        }
        geoPrice.pricePerCount = geoPrice.price / (this.orehaOnceNumber - 10); // 20개씩 만들어짐
        geoPrice.compare = this.orehaData[grade].price - geoPrice.pricePerCount;
        return [huntPrice,fishPrice,geoPrice];
    }
    /**
     * 중급 오레하 비용
     */
    get displayOreha2() {
        if(!this.huntData || this.huntData.length <= 0 ||
            !this.fishData || this.fishData.length <= 0 || 
            !this.geoData || this.geoData.length <= 0 || 
            !this.orehaData || this.orehaData.length <= 0) {
            return [{
                price: 0,
                pricePerCount: 0,
                compare: 0,
            }, {
                price: 0,
                pricePerCount: 0,
                compare: 0,
            }, {
                price: 0,
                pricePerCount: 0,
                compare: 0,
            }];
        }
        let number1 = 10; // 수렵, 낚시
        let number2 = 8; // 고고
        let grade = 1;      // 중급
        let makeCost = 200;

        let huntPrice = {
            price:  (this.huntData[0].pricePerCount * number1 * 8 
                    + this.huntData[2].pricePerCount * number1 * 4 
                    + this.huntData[4].pricePerCount * number1
                    + makeCost), // 제작비용
            pricePerCount: 0,
            compare: 0,
        }
        huntPrice.pricePerCount = huntPrice.price / this.orehaOnceNumber;
        huntPrice.compare = this.orehaData[grade].price - huntPrice.pricePerCount;
        let fishPrice = {
            price:  (this.fishData[0].pricePerCount * number1 * 8 
                    + this.fishData[2].pricePerCount * number1 * 4 
                    + this.fishData[4].pricePerCount * number1
                    + makeCost), // 제작비용
            pricePerCount: 0,
            compare: 0,
        }
        fishPrice.pricePerCount = fishPrice.price / this.orehaOnceNumber;
        fishPrice.compare = this.orehaData[grade].price - fishPrice.pricePerCount;
        let geoPrice = {
            price:  (this.geoData[0].pricePerCount * number2 * 4
                    + this.geoData[1].pricePerCount * number2 * 4
                    + this.geoData[3].pricePerCount * number2 * 4
                    + makeCost), // 제작비용
            pricePerCount: 0,
            compare: 0,
        }
        geoPrice.pricePerCount = geoPrice.price / this.orehaOnceNumber;
        geoPrice.compare = this.orehaData[grade].price - geoPrice.pricePerCount;
        console.log([huntPrice,fishPrice,geoPrice])
        return [huntPrice,fishPrice,geoPrice]; // 제작비용
    }
    /**
     * 하급 오레하 비용
     */
    get displayOreha1() {
        if(!this.huntData || this.huntData.length <= 0 ||
            !this.fishData || this.fishData.length <= 0 || 
            !this.geoData || this.geoData.length <= 0 || 
            !this.orehaData || this.orehaData.length <= 0) {
            return [{
                price: 0,
                pricePerCount: 0,
                compare: 0,
            }, {
                price: 0,
                pricePerCount: 0,
                compare: 0,
            }, {
                price: 0,
                pricePerCount: 0,
                compare: 0,
            }];
        }
        let number1 = 9; // 수렵, 낚시
        let number2 = 7; // 고고
        let grade = 0;      // 하급
        let makeCost = 198;
        
        let huntPrice = {
            price:  (this.huntData[0].pricePerCount * number1 * 8 
                    + this.huntData[2].pricePerCount * number1 * 4 
                    + this.huntData[4].pricePerCount * number1
                    + makeCost), // 제작비용
            pricePerCount: 0,
            compare: 0,
        }
        huntPrice.pricePerCount = huntPrice.price / this.orehaOnceNumber;
        huntPrice.compare = this.orehaData[grade].price - huntPrice.pricePerCount;
        let fishPrice = {
            price:  (this.fishData[0].pricePerCount * number1 * 8 
                    + this.fishData[2].pricePerCount * number1 * 4 
                    + this.fishData[4].pricePerCount * number1
                    + makeCost), // 제작비용
            pricePerCount: 0,
            compare: 0,
        }
        fishPrice.pricePerCount = fishPrice.price / this.orehaOnceNumber;
        fishPrice.compare = this.orehaData[grade].price - fishPrice.pricePerCount;
        let geoPrice = {
            price:  (this.geoData[0].pricePerCount * number2 * 4
                    + this.geoData[1].pricePerCount * number2 * 4
                    + this.geoData[3].pricePerCount * number2 * 4
                    + makeCost), // 제작비용
            pricePerCount: 0,
            compare: 0,
        }
        geoPrice.pricePerCount = geoPrice.price / this.orehaOnceNumber;
        geoPrice.compare = this.orehaData[grade].price - geoPrice.pricePerCount;
        return [huntPrice,fishPrice,geoPrice];
    }

    created() {

        this.refresh();
        setInterval(() => {
            this.refresh();
            this.timestamp = new Date();
        }, 30000,);
    }

    refresh() {
        this.gatherLoading = true;
        this.treeLoading = true;
        this.stoneLoading = true;
        this.huntLoading = true;
        this.fishLoading = true;
        this.geoLoading = true;
        this.potionLoading = true;
        this.orehaLoading = true;

        this.getGatherPrice().then(res => {
            this.gatherData = res;
            this.gatherLoading = false;
        })
        this.getTreePrice().then(res => {
            this.treeData = res;
            this.treeLoading = false;
        })
        this.getStonePrice().then(res => {
            this.stoneData = res;
            this.stoneLoading = false;
        })
        this.getHuntPrice().then(res => {
            this.huntData = res;
            this.huntLoading = false;
        })
        this.getFishPrice().then(res => {
            this.fishData = res;
            this.fishLoading = false;
        })
        this.getGeoPrice().then(res => {
            this.geoData = res;
            this.geoLoading = false;
        })
        // 포션
        this.getPotionPrice().then(res => {
            this.potionData = res;
            this.potionLoading = false;
        })
        // 오레하
        this.getOrehaPrice().then(res => {
            this.orehaData = res;
            this.orehaLoading = false;
        })
    }
}

</script>

<style lang="scss">
.grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-flow: row;
    padding: 0 16px;
    column-gap: 16px;
    row-gap: 16px;
}

.potion {
    padding: 24px;
    margin-top: 24px;
    background-color: #333;
}
.oreha {
    padding: 8px;
    margin-top: 24px;
    background-color: #333;

    & > div {
        margin: 8px 0;
    }
}
</style>
