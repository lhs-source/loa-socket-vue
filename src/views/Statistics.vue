<template>
  <div>
    <!-- 조회 횟수 목록 -->
    <div class="stat-count">
      <div class="title">
        인기 있는 각인 조합
      </div>
      <div class="count-box" v-for="(item, index) of logSocket" :key="index">
        <div class="count-socket">
          <div v-for="(sock, sockIndex) of item.socket" :key="sockIndex">
            {{sock.name}}
          </div>
        </div>
        <div class="grade" >
          <span v-if="item.grade === 4" class="font-legend">전설</span>
          <span v-else-if="item.grade === 5" class="font-relics">유물</span>
        </div>
        <div 
          class="count" 
          :class="{'font-legend': item.grade === 4, 'font-relics': item.grade === 5}" 
          style="font-size: 1.25rem;">
          {{item.count}}회
        </div>
      </div>

    </div>
    <div class="stat-price">
      <div class="title">
        최저가 로그
      </div>
      <div class="price-box" v-for="(item, index) of logPrice" :key="index">
        <div class="price-socket">
          <div v-for="(sock, sockIndex) of item.socket" :key="sockIndex">
            {{sock.name}}
          </div>
        </div>
        <div class="grade" >
          <span v-if="item.grade === 4" class="font-legend">전설</span>
          <span v-else-if="item.grade === 5" class="font-relics">유물</span>
        </div>
        <div class="property">
          <div v-for="prop of item.property" :key="prop.id" class="prop">
            <span>{{prop.name}}</span>
            <span>{{prop.number}}</span>
          </div>
        </div>
        <div class="price font-gold">
          {{item.price}}원
        </div>
        <div class="timestamp">
          {{item.timestamp}}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Vue } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';

import StatService from '../service/StatService.vue';

@Component
export default class Statistics extends mixins(StatService) {
  
  logSocket: any[] = [];
  logPrice: any[] = [];

  created() {
    this.getLogStat();
    this.getLogPrice();
  }

  async getLogStat() {
    this.$gtag.event('statistics', {
      'event_category': 'count',
      'event_label': 'count',
      'value': 0
    })
    this.getAllLogSockets().then((res: any) => {
      this.logSocket = res.data;
    })
  }

  async getLogPrice() {
    this.$gtag.event('search', {
      'event_category': 'price',
      'event_label': 'price',
      'value': 0
    })
    this.getAllLogPrices().then((res: any) => {
      this.logPrice = res.data.map((val: any) => {
        return {...val, timestamp: moment(val.createdAt).format('M월 D일 - HH시 mm분 ss초')}
      });
    })
  }

}
</script>

<style scoped lang="scss">

.stat-count{
  .title {
    display: flex; 
    justify-content: center;

    padding: 16px;
    background-color: $color-stone09;

    color: $color-summer05;
    font-size: 1.25rem;
    font-weight: 700;
  }
  .count-box {
    background-color: $color-stone08;
    padding: 8px 16px;
    color: $color-stone03;

    display: grid;
    grid-template-columns: 3fr 128px 2fr;
    justify-content: center;

    .count-socket {
      display: flex;
      justify-content: flex-start;
      justify-self: end;
      & > div {
        width: 96px;
      }
    }
    &:nth-child(n + 3) {
      border-top: 1px solid $color-stone07;
    }
    .count {
      text-align: left;
    }
  }
}
.stat-price {
  .title {
    display: flex; 
    justify-content: center;

    padding: 16px;
    background-color: $color-stone09;

    color: $color-summer05;
    font-size: 1.25rem;
    font-weight: 700;
  }
  .price-box {
    background-color: $color-stone08;
    padding: 8px 16px;
    color: $color-stone03;

    display: grid;
    grid-template-columns: 3fr 128px auto auto 2fr;

    .price-socket {
      display: flex;
      justify-content: flex-start;
      justify-self: end;
      & > div {
        width: 96px;
      }
    }
    &:nth-child(n + 3) {
      border-top: 1px solid $color-stone07;
    }
    .grade{

    }
    .property{
      display: flex;

      .prop{
        width: 120px;

        span:first-child {
          margin-right: 4px;
        }
        span:last-child {
          color: $color-advanced;
        }
      }
    }
    .price {
      margin-left: 32px;
      font-size: 1.25rem;
      text-align: left;
    }
  }
}
</style>