<template>
  <div class="root-wrapper">
    <!-- 각인 선택 사이드바 -->
    <div class="socket-list" style="grid-column: 1/ 2; grid-row: 1 / 3">
      <div class="selected">
        <div
          class="socket-row"
          v-for="(sock, sockIndex) of selectedSocket"
          :key="sockIndex"
          @click="onClickSocket(sock)"
        >
          {{ sock.name }}<span v-if="sock.class">({{ sock.class }})</span>
        </div>
      </div>
      <div class="remain-list">
        <div
          class="socket-row"
          v-for="(sock, sockIndex) of displayRemainSocket"
          :key="sockIndex"
          @click="onClickRemainSocket(sock)"
        >
          {{ sock.name }}<span v-if="sock.class">({{ sock.class }})</span>
        </div>
      </div>
    </div>
    <div class="body-side" style="grid-column: 2 / 3; grid-row: 1 / 2">
      <div class="selected-socket-list">
        <div class="item-box">
          <div v-for="socket of selectedSocket" :key="socket.id">
            <div>{{socket.id}}</div>
            <div style="font-size: 1.5rem;">{{socket.name}}</div>
          </div>
        </div>
        <div class="search-button" style="min-width: 360px;" @click="onClickPutRequest">
          크롤링 요청하기<span v-if="gettingCrawling === true">(요청중~)</span>
        </div>
      </div>
      <div class="acc-list">
        <div class="search-button" style="min-width: 360px;" @click="onClickGetComposition">
          조합 계산하기<span v-if="gettingComposition === true">(요청중~)</span>
        </div>
        <div class="acc-length">
          결과 {{compositions.length}} 개
        </div>
        <!-- <div v-for="(comp, index) of compositions" :key="index">
          {{comp}}
        </div> -->
        
        <ItemPropInfo v-for="(item, itemIndex) of compositions" :key="itemIndex" :itemData="item">
        </ItemPropInfo>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import moment from "moment";

import SearchList from "./SearchList.vue";
import ItemPropInfo from '../components/ItemPropInfo.vue';

import SocketList, { Socket } from "../constants/SocketList";
import ServerService, {
  RequestAccessaryFromTrader, RequestComposition,
} from "../service/ServerService.vue";

@Component({
  components: {
    SearchList,
    ItemPropInfo,
  },
})
export default class AccList extends mixins(ServerService) {
  socketList: Socket[] = SocketList;
  // 선택한 각인 목록
  selectedSocket: Socket[] = [];

  // 가져온 조합
  compositions: any[] = [];

  // 데이터 크롤링 요청 완료?
  gettingCrawling = false;
  // 조합 계산 기다리는 중?
  gettingComposition = false;

  /**
   * * 남겨진 각인 목록
   */
  get displayRemainSocket() {
    return this.socketList.filter((val) => {
      let index = this.selectedSocket.findIndex((elem) => {
        return elem.id === val.id;
      });
      return index < 0;
    });
  }
  

  /**
   * * 각인 추가
   */
  onClickRemainSocket(sock: Socket) {
    this.selectedSocket.push(sock);
  }
  /**
   * * 각인 제거
   */
  onClickSocket(sock: Socket) {
    let index = this.selectedSocket.findIndex((val) => val.id === sock.id);
    this.selectedSocket.splice(index, 1);
  }
  /**
   * * 서버에 데이터 크롤링을 요청한다.
   */
  onClickPutRequest() {
    if(this.gettingCrawling === true) {
      return;
    }
    this.gettingCrawling = true;
    let param : RequestAccessaryFromTrader = {
      grade: 5,
      socket: this.selectedSocket,
    }
    this.putAccessaryFromTrader(param).then((res : any) => {
      console.log(res);
      this.gettingCrawling = false;
    })
  }
  /**
   * * 조합을 가져오자! ㅜㅜ
   */
  onClickGetComposition() {
    if(this.gettingComposition === true) {
      return;
    }
    this.gettingComposition = true;
    let param : RequestComposition = {
      socketList: this.selectedSocket,
      needNumber: [8, 8, 6, 15, 3],
      grade: 5,
      maxPrice: 60000,
      props:  {
        '[치명]' : 50,
        '[특화]' : 430,
        '[신속]' : 1400,
      },
      penalty: {
        name: '[공격력 감소]',
        number: 4,
      }
    }
    this.postAccessaryFromTrader(param).then((res: any) => {
      console.log(res);
      this.gettingComposition = false;
      this.compositions = res.data;
    })
  }
}
</script>

<style lang="scss" scoped>
$data-width: 212px;
$data-height: 156px;
$data-padding: 4px;

.root-wrapper {
  display: grid;
  grid-template-columns: 272px 1fr;
  grid-template-rows: auto auto;
  flex-wrap: nowrap;

  .search-list {
    padding: 24px;
    .select-case {
      padding: 8px;
      &:nth-child(n + 2) {
        border-top: 1px solid #aaa;
      }
    }
  }
  // 소켓 선택 사이드바
  .socket-list {
    overflow: auto;

    width: 240px;
    height: calc(100vh - 77px - 32px);
    background-color: #21233A;
    border: 1px solid #B0AFC6;
    border-radius: 8px;
    margin: 16px;
    
    color: #B0AFC6;
    font-size: 1rem;

    .selected {
      background-color: #887C74;
      color: white;
      .socket-row {
        user-select: none;
        cursor: pointer;
      }
    }
    .remain-list {
      .socket-row {
        user-select: none;
        cursor: pointer;
      }
    }
  }
  .body-side {
    overflow-y: auto;
    // 선택한 각인 목록
    .selected-socket-list {
      background-color: #21233A;
      border-radius: 8px;
      border: 1px solid #B0AFC6;
      margin-top: 16px;
      margin-right: 16px;
      padding: 24px;
      height: 196px;

      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

      .item-box {
        display: flex;
        justify-content: center;
        & > div {
          width: 200px;
        }
      }
    }

    .acc-list {
      background-color: #21233A;
      border-radius: 8px;
      border: 1px solid #B0AFC6;
      margin-top: 16px;
      margin-right: 16px;
      padding: 24px;
    }
  }
  
  .search-button {
    padding: 16px;
    background-color: #CCB28C;

    color: #262525;
    font-size: 1.25rem;
    font-weight: 700;

    user-select: none;
    cursor: pointer;

    &:hover {
      filter: brightness(1.1);
    }
  }
}
</style>
