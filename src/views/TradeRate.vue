<template>
    <div>
        <div>마지막 조회 시간 : {{displayTimestamp}} </div>
        <div class="grid">
            <LifeItemList 
                title="채집" 
                :loading="gatherLoading"
                :lifeData="gatherData" 
                />
            <LifeItemList 
                title="벌목" 
                :loading="treeLoading"
                :lifeData="treeData" 
                />
            <LifeItemList 
                title="채광" 
                :loading="stoneLoading"
                :lifeData="stoneData"
                />
            <LifeItemList 
                title="수렵" 
                :loading="huntLoading"
                :lifeData="huntData" 
                />
            <LifeItemList 
                title="낚시" 
                :loading="fishLoading"
                :lifeData="fishData" 
                />
            <LifeItemList 
                title="고고" 
                :loading="geoLoading"
                :lifeData="geoData" 
                />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mixins } from 'vue-class-component';
import moment from 'moment';

import LifeItemList from '../components/LifeItemList.vue';

import LifeSearchService, {LifeItemData} from '../service/LifeSearchService.vue';

@Component({
    components: {
        LifeItemList,
    },
})
export default class TradeRate extends mixins(LifeSearchService) {
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

    get displayTimestamp() {
        return moment(this.timestamp).format('YYYY년 MM월 DD일 HH시 mm분 ss초');
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
    }
}

</script>

<style lang="scss">

</style>
