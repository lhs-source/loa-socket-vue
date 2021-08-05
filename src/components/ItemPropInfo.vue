<template>
    <div class="iteminfo-root" v-if="itemData">
        <div class="iteminfo">
            <div class="font-gold price">{{itemData[1].price}}원</div>
            <div class="penalty">
                <div v-for="key of Object.keys(itemData[1].penalty)" :key="key">
                    <span class="label">{{key}}</span>
                    <span>{{itemData[1].penalty[key]}}</span>
                </div>
            </div>        
            <div class="property">
                <div v-for="key of Object.keys(itemData[1].property)" :key="key">
                    <span class="label">{{key}}</span>
                    <span>{{itemData[1].property[key]}}</span>
                </div>
            </div>
            <div>특성 합 {{itemData[1].propertySum}}</div>
        </div>
        <div class="itemlist">
            <div v-for="(item, itemIndex) of itemData[0]" :key="itemIndex">
                <div class="name">{{item.name}}</div>
                <div class="price font-gold">{{item.price}}원</div>
                <div class="socket"><span>{{item.socket1.name}}</span> : {{item.socket1.number}}</div>
                <div class="socket"><span>{{item.socket2.name}}</span> : {{item.socket2.number}}</div>
                <div class="socket"><span>{{item.badSocket1.name}}</span> : {{item.badSocket1.number}}</div>
                <div class="property"><span>{{item.property1.name}}</span> : {{item.property1.number}}</div>
                <div class="property" v-if="item.property2.number"><span>{{item.property2.name}}</span> : {{item.property2.number}}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

interface SumDataModel {
    price: number;
    sockets: any;
    penalty: any;
    property: any;
    propertySum: number;
}
type ItemPropData = [any[], SumDataModel];

@Component
export default class ItemPropInfo extends Vue {
    @Prop({default: () => []}) readonly itemData!: ItemPropData;
}
</script>

<style scoped lang="scss">
.iteminfo-root {
    &:nth-child(n + 1) {
        border-top: 1px solid #888;
    }
    .iteminfo {
        width: 100%;

        display: grid; 
        grid-template-columns: repeat(4, 1fr); 
        grid-auto-flow: column; font-size: 0.75rem;

        padding: 4px 0;


        .price {
            font-size: 1.25rem;
        }

        .penalty, .property {

            .label {
                display: inline-block; 
                width: 84px; 
                text-align:right; 
                margin-right: 8px;
            }
        }
    }
    .itemlist {
        width: 100%;
        display: grid; 
        grid-template-columns: repeat(5, 1fr); 
        grid-auto-flow: column; font-size: 0.75rem;
    }
}

</style>