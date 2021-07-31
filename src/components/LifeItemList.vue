<template>
    <div class="life-box">
        <h3>{{title}} 시세<span v-if="loading" class="loading">가져오는 중..</span></h3>
        <div class="content">
            <div class="content-row header">
                <div>이름</div>
                <div>전일 평균</div>
                <div>마지막 거래</div>
                <div>최저가</div>
                <div>단위</div>
                <div>개당 단가</div>
            </div>
            <div class="content-row" v-for="item of lifeData" :key="item.name">
                <div class="name">{{item.name}}</div>
                <div class="avgLastDay">{{item.avgLastDay}}💰</div>
                <div class="lastPrice">{{item.lastPrice}}💰</div>
                <div class="price">{{item.price}}💰</div>
                <div class="count">{{item.count}}개</div>
                <div class="pricePerCount">개당 {{item.pricePerCount}}💰</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { mixins } from 'vue-class-component';

import {LifeItemData} from '../service/LifeSearchService.vue';

@Component({
  components: {
  },
})
export default class LifeItemList extends Vue {
    @Prop({default: ''}) readonly title!: string;
    @Prop({default: () => []}) readonly lifeData!: LifeItemData[];
    @Prop({default: true}) readonly loading!: boolean;

}

</script>

<style lang="scss">
.life-box {
    // background-color:rgb(255, 255, 255);
    // padding: 24px;

    display: flex;
    flex-direction: column;
    align-items: center;

    h3 {
        margin: 0;
        padding: 4px;

        .loading {
            margin-left: 8px;
            font-size: 0.75rem;
            color: #eee;
        }
    }
    .content{
        .content-row {
            display: grid;
            grid-template-columns: 156px repeat(5, 128px);
            align-items: center;
            padding: 0 24px;

            &:nth-child(n + 2){
                border-bottom: 1px solid #aaa;
            }
            &.header{
                font-weight: 600;
                background-color:rgb(30, 83, 52);
                color: rgb(228, 214, 214);
            }
            & > div {
                text-align: right;
            }

            .name { 
                font-weight: 700;
            }
            // .price, .pricePerCount {
            //     font-size: 1.25rem;
            // }
        }
    }
}
</style>
