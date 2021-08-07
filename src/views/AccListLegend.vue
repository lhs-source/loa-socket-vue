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
    <!-- 악세 각인 목록 -->
    <div class="grid-table" style="grid-column: 2/ 3; grid-row: 1/2">
      <!-- 악세 클릭 시 모든 항목 보여주는 팝업 -->
      <SearchList v-if="showSearchList" @close="showSearchList = false">
        <div class="search-list" v-if="selectedCase">
          <div
            class="select-case"
            v-for="(cases, caseIndex) of selectedCase.list"
            :key="caseIndex"
            @click="selectedAccList.push(cases)"
          >
            <div>{{ cases.name }}</div>
            <div>거래가능 {{ cases.count }}</div>
            <div>
              특성1 {{ cases.property1.name }} {{ cases.property1.number }}
            </div>
            <div v-if="cases.property2.number">
              특성2 {{ cases.property2.name }} {{ cases.property2.number }}
            </div>
            <div>각인1 {{ cases.socket1.name }} {{ cases.socket1.number }}</div>
            <div>각인2 {{ cases.socket2.name }} {{ cases.socket2.number }}</div>
            <div>
              패널티 {{ cases.badSocket1.name }} {{ cases.badSocket1.number }}
            </div>
            <div>가격 {{ cases.price }}</div>
          </div>
        </div>
      </SearchList>

      <div class="search" @click="onClickSearch">데이터 가져오기</div>
      <div
        style="display: flex; align-items: flex-start; flex-direction: column"
      >
        <div class="headers">
          <div class="conditions">
            <div style="grid-column: 1/3">
              3, 3만 검색<input type="checkbox" v-model="fullMax" />
            </div>
            <div class="acctype">
              <div
                v-for="type of accTypeList"
                :key="type.value"
                class="item"
                :class="{
                  select: selectedAccType === type.value ? true : false,
                }"
                @click="onClickAcctype(type)"
              >
                {{ type.label }}
              </div>
            </div>
          </div>
          <div class="header" v-for="sock of fixedSocket" :key="sock.id">
            {{ sock.name }}<span v-if="sock.class">({{ sock.class }})</span>
          </div>
        </div>
        <div v-if="fixedSocket.length <= 0">각인을 선택해주세요</div>
        <div class="contents">
          <div
            class="row"
            v-for="(row, index) of dislaySocketMetrics"
            :key="index"
          >
            <div class="data name">
              {{ fixedSocket[index].name
              }}<span v-if="fixedSocket[index].class"
                >({{ fixedSocket[index].class }})</span
              >
            </div>
            <div class="data" v-for="(column, colIndex) of row" :key="colIndex">
              <template v-if="column === null">
                <span
                  style="
                    grid-column: 1/4;
                    grid-row: 1/4;
                    align-self: center;
                    font-size: 1.5rem;
                  "
                  >🎃</span
                >
              </template>
              <template v-else>
                <div
                  class="cases"
                  v-for="cases of column"
                  :key="cases.id"
                  @click="onClickCase(cases)"
                >
                  {{ cases.socket[0].name }} {{ cases.socketNumber[0] }} <br />
                  {{ cases.socket[1].name }} {{ cases.socketNumber[1] }} <br />
                  <span
                    :class="{
                      'font-relics': cases.property1 === 0,
                      'font-legend': cases.property1 === 1,
                      'font-hero': cases.property1 === 2,
                    }"
                    >{{ propList[cases.property1] }}</span
                  >
                  <span
                    v-if="cases.acctype === 200010"
                    style="margin-left: 4px"
                    :class="{
                      'font-relics': cases.property2 === 0,
                      'font-legend': cases.property2 === 1,
                      'font-hero': cases.property2 === 2,
                    }"
                    >{{ propList[cases.property2] }}</span
                  >({{ cases.list.length }})<br />
                  <span class="price font-gold">{{ cases.price }}💰</span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="compositions">
      <AccComposition
        style="margin-top: 48px"
        :socketList="fixedSocket"
        :nectMetricsData="socketMetrics"
        :earringMetricsData="socketMetrics2"
        :ringMetricsData="socketMetrics3"

      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import moment from "moment";

import SearchList from "./SearchList.vue";
import AccComposition from "./AccCompositionLegend.vue";

import SocketList, { Socket } from "../constants/SocketList";
import AccSearchService, {
  RequestAcc,
  AccData,
} from "../service/AccSearchService.vue";

@Component({
  components: {
    SearchList,
    AccComposition,
  },
})
export default class AccList extends mixins(AccSearchService) {
  socketList: Socket[] = SocketList;
  // 선택한 각인 목록
  selectedSocket: Socket[] = [];
  // 검색한 각인 목록
  fixedSocket: Socket[] = [];

  // 각인 행렬 데이터
  // 목걸이
  socketMetrics: any[] = [];
  // 귀걸이
  socketMetrics2: any[] = [];
  // 반지
  socketMetrics3: any[] = [];

  propList = ["치명", "특화", "신속"];
  // 선택한 검색 결과
  selectedCase: any = {};
  // 검색 결과를 클릭해 결과를 모두 보여주는 팝업 노출
  showSearchList = false;

  // 3, 3만 보여줄 것인가
  fullMax = false;
  // 장신구 타입 목록
  accTypeList = [
    // {
    //     label: '전체',
    //     value: 0,
    // },
    {
      label: "목걸이",
      value: 200010,
    },
    {
      label: "귀걸이",
      value: 200020,
    },
    {
      label: "반지",
      value: 200030,
    },
  ];
  selectedAccType = 200020;
  // 치특신
  propTypeList = [
    {
      label: "치명",
      value: 0,
    },
    {
      label: "특화",
      value: 1,
    },
    {
      label: "신속",
      value: 2,
    },
  ];
  selectedPropType = 0;

  // 고른 악세서리 목록
  selectedAccList: AccData[] = [];

  // 조합 목록 확인하기
  showAccComposition = false;

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
   * * 타입에 따라 보여주는 행렬이 다르다.
   */
  get dislaySocketMetrics() {
    switch (this.selectedAccType) {
      case 200010:
        return this.socketMetrics;
      case 200020:
        return this.socketMetrics2;
      case 200030:
        return this.socketMetrics3;
      default:
        return [];
    }
  }
  get displaySumOfSelection() {
    let output: any = {
      price: 0,
      socketList: {},
      badSocketList: {},
      propertyList: {},
    };

    this.selectedAccList.forEach((val) => {
      output.price += val.price;
      if (output.socketList[val.socket1.name]) {
        output.socketList[val.socket1.name] += val.socket1.number;
      } else {
        output.socketList[val.socket1.name] = val.socket1.number;
      }

      if (output.socketList[val.socket2.name]) {
        output.socketList[val.socket2.name] += val.socket2.number;
      } else {
        output.socketList[val.socket2.name] = val.socket2.number;
      }

      if (output.badSocketList[val.badSocket1.name]) {
        output.badSocketList[val.badSocket1.name] += val.badSocket1.number;
      } else {
        output.badSocketList[val.badSocket1.name] = val.badSocket1.number;
      }

      if (output.propertyList[val.property1.name]) {
        output.propertyList[val.property1.name] += val.property1.number;
      } else {
        output.propertyList[val.property1.name] = val.property1.number;
      }
      if (val.property2.number) {
        if (output.propertyList[val.property2.name]) {
          output.propertyList[val.property2.name] += val.property2.number;
        } else {
          output.propertyList[val.property2.name] = val.property2.number;
        }
      }
    });

    return output;
  }

  created() {
    // let param: RequestAcc = {
    //     socket1: {
    //         id: 118,
    //         number: 4,
    //     },
    //     socket2: {
    //         id: 292,
    //         number: 3,
    //     },
    //     property: 0,
    // }
    // this.getAccData(param);
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
   * * 조회 시작
   */
  onClickSearch() {
    this.fixedSocket = [...this.selectedSocket];
    this.createSocketMetrics(this.accTypeList[0].value).then((res) => {
      this.socketMetrics = res;
    }); // 목걸이
    this.createSocketMetrics(this.accTypeList[1].value).then((res) => {
      this.socketMetrics2 = res;
    }); // 귀걸이
    this.createSocketMetrics(this.accTypeList[2].value).then((res) => {
      this.socketMetrics3 = res;
    }); // 반지
  }
  onClickCase(cases: any) {
    this.selectedCase = cases;
    this.showSearchList = true;
  }
  onClickAcctype(type: any) {
    this.selectedAccType = type.value;
  }
  /**
   * *
   * index : 선택한 인덱스
   */
  onClickSelItem(item: number) {
    this.selectedAccList.splice(item, 1);
  }
  /**
   * *  n x n 배열부터 만든다.
   */
  async createSocketMetrics(acctype: number) {
    let output: any[] = [];
    let size = this.selectedSocket.length;

    for (let i = 0; i < size; ++i) {
      let row: any[] = [];
      for (let j = 0; j < size; ++j) {
        row.push(
          this.createCaseMetrics(
            [this.selectedSocket[i], this.selectedSocket[j]],
            acctype
          )
        );
      }
      output.push(row);
      for (let data of row) {
        this.createResult(data, acctype);
      }
    }
    console.log("metrics", output);
    return output;
  }
  /**
   * * 그 안에서 케이스별로 나눠
   */
  createCaseMetrics(socket: Socket[], acctype: number) {
    if (socket[0].id === socket[1].id) {
      return null;
    }
    let output: any[] = [];
    const propCount = 3;
    const socketMax = this.fullMax === true ? [3] : [3, 2];

    for (let i = 0; i < socketMax.length; ++i) {
      let row: any[] = [];

      if (acctype === 200010) {
        let cases = [
          [0, 1],
          [0, 2],
          [1, 2],
        ];
        for (let j = 0; j < propCount; ++j) {
          let sock1: Socket = socket[0];
          let sock2: Socket = socket[1];

          let item = {
            id: i * propCount + j,
            acctype: acctype,
            socket: [sock1, sock2],
            socketNumber: [socketMax[i], 3],
            property1: cases[j][0],
            property2: cases[j][1],
            price: 0, //Math.ceil(Math.random() * 10000),
            list: [],
          };
          output.push(item);
        }
      } else {
        for (let j = 0; j < propCount; ++j) {
          let sock1: Socket = socket[0];
          let sock2: Socket = socket[1];

          let item = {
            id: i * propCount + j,
            acctype: acctype,
            socket: [sock1, sock2],
            socketNumber: [socketMax[i], 3],
            property1: j,
            property2: -1,
            price: 0, //Math.ceil(Math.random() * 10000),
            list: [],
          };
          output.push(item);
        }
      }
    }
    return output;
  }
  async createResult(conditions: any, acctype: number) {
    // console.log('createResult conditions', conditions)
    if (conditions === null) {
      return;
    }
    for (let item of conditions) {
      // console.log('item', item);
      let param: RequestAcc = {
        acctype: acctype,
        socket1: {
          id: item.socket[0].id,
          number: item.socketNumber[0],
        },
        socket2: {
          id: item.socket[1].id,
          number: item.socketNumber[1],
        },
        property1: item.property1,
        property2: 0,
      };
      if (acctype === 200010) {
        // 목걸이의 경우에는
        param.property2 = item.property2;
      }
      // console.log(param);
      // 데이터 가져오는 거 끄려면 임시 주석
      this.getAccData(param).then((res: AccData[]) => {
        // console.log('result', res);
        item.list = res;
        if (res.length > 0) {
          for (let price of res) {
            if (price.price !== 0) {
              item.price = price.price;
              break;
            }
          }
        } else {
          item.price = -1;
        }
      });
    }
  }

  async getAccData(request: RequestAcc) {
    let res = await this.getDataLegend(request);
    // console.log(res);
    return res;
  }
}
</script>

<style lang="scss" scoped>
$data-width: 212px;
$data-height: 156px;
$data-padding: 4px;

.root-wrapper {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto auto;
  flex-wrap: nowrap;
  // padding-bottom: 48px;

  .search-list {
    padding: 24px;
    .select-case {
      padding: 8px;
      &:nth-child(n + 2) {
        border-top: 1px solid #aaa;
      }
    }
  }
  .socket-list {
    overflow: auto;

    width: 240px;
    height: calc(100vh - 77px);
    background-color: #333;

    .selected {
      background-color: rgb(33, 92, 126);
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
  .grid-table {
    overflow: auto;
    .search {
      padding: 24px;
      font-size: 1.5rem;
      font-weight: 700;
      background-color: rgb(255, 187, 0);
      color: rgb(81, 85, 88);
      user-select: none;
      cursor: pointer;
    }
    .headers {
      display: grid;
      grid-auto-flow: column;
      align-content: start;
      .conditions,
      .header {
        font-size: 1.25rem;
        width: $data-width;
        height: 96px;
        padding: $data-padding;
        border: 1px solid #ddd;
      }
      .conditions {
        font-size: 0.75rem;

        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 1fr);

        .acctype {
          .item {
            user-select: none;
            cursor: pointer;
            &:hover {
              font-weight: 700;
              color: rgb(0, 174, 255);
            }
            &.select {
              background-color: #888;
            }
          }
        }
      }
    }
    .contents {
      .row {
        display: grid;
        grid-auto-flow: column;
        align-content: start;
      }
      .dummy,
      .data {
        font-size: 0.5rem;
        width: $data-width;
        height: $data-height;
        padding: $data-padding;
        border: 1px solid #ddd;

        display: grid;
        grid-template-columns: repeat(3, 1fr);
        // grid-template-rows: repeat(3, 1fr);

        &.name {
          display: block;
          font-size: 1.25rem;
        }
        .cases {
          .price {
            font-size: 14px;
          }
        }
      }
    }
  }
  .search-button {
    padding: 24px;
    background-color: rgb(255, 187, 0);
    color: #333;
    font-size: 1.25rem;
    font-weight: 700;

  }
  .compositions {
    .temp-list {
      font-size: 0.75rem;

      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-auto-flow: column;
    }
    .sum {
      // font-size: 14px;
    }
  }
}
</style>
