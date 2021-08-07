<template>
<div class="acccomp-root">
  <div class="acccomp-wrapper">
    <div class="socket-list">
      <div v-for="(calcsock, index) of calcSocketList" :key="index" style="flex: 1;">
        <div>{{ calcsock.socket.name }}</div>
        <div class="font-relics">{{ calcsock.remain }}</div>
      </div>
    </div>
    <div class="conditions">
      <div class="manual-inputs">
        <div v-for="index of socketLength" :key ="index" style="flex: 1;">
          <div>
            <input v-model="need[index - 1]" />
            <input v-model="stone[index - 1]" />
            <input v-model="doc[index - 1]" />
          </div>
        </div>
      </div>
      <div class="prop-inputs">
        <div>
          <label>가격 제한</label>
          <input type="number" v-model="maxPrice" />
        </div>
        <div>
          <label>치명</label>
          <input type="number" v-model="props['[치명]']" />
        </div>
        <div>
          <label>특화</label>
          <input type="number" v-model="props['[특화]']" />
        </div>
        <div>
          <label>신속</label>
          <input type="number" v-model="props['[신속]']" />
        </div>
        <div>
          <label>유물??</label>
          <input type="checkbox" v-model="isRelics" />
        </div>
        <div>
          <label>돌 패널티</label>
          <select v-model="selectedPenalty.name" style="width: 200px;">
            <option value="[공격속도 감소]">[공격속도 감소]</option>
            <option value="[이동속도 감소]">[이동속도 감소]</option>
            <option value="[방어력 감소]">[방어력 감소]</option>
            <option value="[공격력 감소]">[공격력 감소]</option>
          </select>
          <input type="number" v-model="selectedPenalty.number" />
        </div>
      </div>
    </div>
    <div class="socket-desposition">
      <div></div>
      <div class="row" v-for="(row, rowIndex) of displayDesposition" :key="rowIndex">
        <span></span>
        <span class="able-socket" v-for="(comp, compIndex) of row" :key="compIndex + 10">
          {{comp}}
        </span>
      </div>
    </div>
    <div class="search-button" @click="getAllAccComposition">조합 케이스 계산하기</div>
    <div class="socket-cases">
      <h3>최종 각인 케이스 목록</h3>
      <div class="comp" v-for="(comp, compIndex) of allAccComposition" :key="compIndex">
        {{comp.length}};
        <!-- <div class="cases" v-for="(cases, caseIndex) of comp" :key="caseIndex">
          <h4>케이스 {{caseIndex}}번</h4>
          <div class="row" v-for="(row, accIndex) of cases.accSocketList" :key="accIndex">
            <span class="label" style="font-weight: 700; font-size: 1.25rem;">악세 {{accIndex}}.</span>
            <span class="value" v-for="value of row" :key="value">
              <span v-if="value > 0">{{value}}</span>
              <span v-else>-</span>
            </span>
            <span class="item"> 
              {{cases.accStr[accIndex]}}
            </span>
          </div> -->
          <!-- {{cases.accCompositions.length}} -->
          <!-- <div v-for="(item, itemIndex) of cases.accCompositions" :key="itemIndex"
            style="display: grid; grid-template-colums: 1fr 1fr 1fr;">
            <div>{{item[1].price}}</div>
            <div>{{item[1].penalty}}</div>
            <div>{{item[1].property}}</div>
          </div> -->
        <!-- </div> -->
      </div>
    </div>
  </div>
  <div class="final-data">
    <div class="search-button" @click="onClickCalcPrice">가격 계산하기</div>
    <div v-if="calculating">계산 중... {{progressing}}</div>
    <div v-else>계산 결과 {{testAllData.length}}개</div>
    <div v-if="testAllData.length > dataLimit">
      데이터가 너무 많아요 조건을 다시 설정해주세요
    </div>
    <div v-else>
      <ItemPropInfo v-for="(item, itemIndex) of displayFinalAllData" :key="itemIndex" :itemData="item">
      </ItemPropInfo>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { AccData } from "@/service/AccSearchService.vue";
import { Component, Vue, Prop } from "vue-property-decorator";

import { Socket } from "../constants/SocketList";
import ItemPropInfo from "../components/ItemPropInfo.vue";

interface Cases {
  accSocketList: any[],
  accList: any[],//items.map((item, index) => this.getAcc(index, item)),
  accStr: string,
  accCompositions: any[], // this.getFinalComposition(items), TODO 다른 함수에서 한번에 ㄱㄱ
}

@Component({
  components: {
    ItemPropInfo
  }
})
export default class AccComposition extends Vue {
  @Prop({ default: () => [] }) readonly socketList!: any[];
  @Prop({ default: () => [] }) readonly nectMetricsData!: any[];
  @Prop({ default: () => [] }) readonly earringMetricsData!: any[];
  @Prop({ default: () => [] }) readonly ringMetricsData!: any[];

  allAccComposition: any[] = [];
  testAllData: any[] = [];
  // 가격
  maxPrice = 50000;
  props = {
    '[치명]': 50,
    '[특화]': 430,
    '[신속]': 1400,
  }
  calculating = false;
  need = [15, 15, 15, 5, 0];
  stone = [5, 0, 5, 0, 0];
  doc = [0, 15, 0, 0, 12];

  // 계산 중...
  progressing = 0;
  // 데이터가 일정 개수 이상 넘어가면 결과가 많으니 다시 조건을 설정하자.
  dataLimit = 2000;
  tooMuchData = false;
  // 유물인가? 
  isRelics = false;
  // 장신구 개수
  accCount = 5;
  // 패널티 선택
  selectedPenalty = {
    name: '',
    number: 0,
  };

  

  /**
   * * 각인 개수
   */
  get socketLength() {
    return this.socketList.length;
  }
  get calcSocketList() {
    interface Item {
      id: number;
      socket: Socket;
      remain: number;
    }

    let output = this.socketList.map((val: Socket, i: number) => {
      console.log("AccComposition:calcSocketList", val, i);
      let item: Item = {
        id: i,
        socket: val,
        remain: this.need[i] - this.stone[i] - this.doc[i],
      };
      return item;
    });
    return output;
  }

  /**
   * * price로 정렬 표시
   */
  get displayFinalAllData() {
    return this.testAllData.sort((a, b) => {
      return a[1].price > b[1].price ? 1 : -1;
    })
  }

  /**
   * * 합분해 실시간 계산
   */
  get displayDesposition() {
    // 필요한 각인들 [8, 8, 15, 6, 3]...
    let remainSocket: number[] = this.calcSocketList.map(val => val.remain);
    let desposition: any[] = [];
    let sumOfSocket = 0;
    remainSocket.forEach(val => sumOfSocket += val);
    let useList: number[] = [];
    if(this.isRelics){
      // 유물이면 3, 4, 5
      useList = sumOfSocket >= 40 ? [5, 3] : [5, 4, 3];
    }else {
      // 전설이면 2, 3
      useList = [2, 3];
    }

    // 합분해 구하기
    remainSocket.forEach((val) => {
      let comp = this.getDesposition(val, useList);
      desposition.push(comp);
    });

    console.log('desposition', desposition);

    let despComposition: any[] = this.getDespComposition(desposition, sumOfSocket);
    return despComposition;
  }

  async getAllAccComposition() {
    this.allAccComposition = [];
    this.displayDesposition.forEach(val => {
      this.allAccComposition.push(this.getAllCases(val, 5, 2));
    })
    // return this.allAccComposition;
  }

  /**
   * * 숫자 합분해를 찾아낸다
   * @param {number} num 합분해 대상 숫자 (15)
   * @param {number[]} list 합분해 요소 숫자 리스트 ([5, 3])
   */
  getDesposition(num: number, list: number[]): any[] {
    console.log('desposition num', num);
    let output: any[] = [];
    let recurrsive = (
      remain: number,
      useList: number[],
      makeList: number[],
      maxcount: number
    ) => {
      // 장신구 개수 넘어가면 ㄴㄴ
      if (maxcount > this.accCount) {
        return null;
      }
      for (let use of useList) {
        // 이전 숫자보다 크면
        if (makeList && use > makeList[makeList.length - 1]) {
          continue;
        }
        let nextRemain = remain - use;

        if (nextRemain > 0) {
          // 숫자가 부족함
          recurrsive(
            nextRemain,
            useList,
            [...makeList, use],
            maxcount + 1
          );
        } else if (nextRemain === 0) {
          // 숫자가 딱 떨어짐
          output.push([...makeList, use]);
        } else {
          // 숫자가 넘겨버려서 -가 됨
          continue;
        }
      }
      return;
    };
    recurrsive(num, list, [], 0);
    return output;
  }
  /**
   * * 가능한 합분해 조합 구하기
   */
  getDespComposition(desposition: any[], socketSum: number) {
    
    let composition: any[] = [];
    let ableComp: any[] = [];

    if(!desposition || desposition.length <= 0) {
      return ableComp;
    }
    let recursive = (remain : number, maxcount: number, makeList: any[]) => {
      console.log(maxcount, desposition.length)
      if(maxcount >= desposition.length) {
        return;
      }
      console.log(desposition[maxcount].length)
      if(desposition[maxcount].length === 0) {
        recursive(remain, maxcount + 1, makeList);
        // return;
      }
      for(let i = 0; i < desposition[maxcount].length; ++i) {
        let target = desposition[maxcount][i];
        let nextRemain = remain - target.length;

        if(maxcount < desposition.length - 1 && nextRemain <= 0) {
          continue;
        }
        if(maxcount === desposition.length - 1 && nextRemain === 0) {
          let sum = 0;
          [...makeList, target].forEach((val2: number[]) => {
            let innerSum = 0;
            val2.forEach((val3 : number) => innerSum += val3);
            sum += innerSum;
          });
          console.log(socketSum, sum)
          // 원하는 소켓 합보다 높으면 항목에 넣기
          if(socketSum <= sum){
            ableComp.push([...makeList, target]);
          }
          continue;
        }
        recursive(nextRemain, maxcount + 1, maxcount === 0 ? [target] : [...makeList, target]);
      }
    }
    recursive(10, 0, []);
    return ableComp;
  }
  /**
   * 악세서리 조합을 찾아낸다.
   * @param {any[]} list : 숫자 조합 ([ 5, 3 ][ 5, 3 ][ 5, 5, 5 ][ 3, 3 ][ 3 ])
   * @param {number} accNumber : 악세서리 개수 (보통 5개)
   * @param {number} valuenumber : 악세서리에 부여되는 각인 개수 (보통 2개)
   */
  getAllCases(list: any[], accNumber: number, valueNumber: number) {
    let rowRecursive = (sourceList: any[], maxcount: number, makeList: number[], output: any[]) => {
      if(maxcount >= this.accCount){
        return ;
      }
      let step = [...new Set(sourceList[maxcount]), 0];
      // console.log(maxcount, step, makeList);
      step.forEach((val:any) => {
        // console.log('for', step, val)
        if(maxcount === 0) {
          rowRecursive(sourceList, maxcount + 1, [val], output)
          return;
        }
        let newMakeList =  [...makeList, val];
        let validCount = newMakeList.filter(val => val !== 0).length;
        let sumOfSocket = 0;
        newMakeList.forEach(val => {sumOfSocket += val});

        // 유물 각인 합이 8 넘어가면 중단
        if(this.isRelics === true && sumOfSocket > 8) {
          return [];
        }
        // 전설 각인 합이 8 넘어가면 중단
        else if(this.isRelics === false && sumOfSocket > 6) {
          return [];
        }
        // n개까지 고르지 않았으니 계속 진행
        if(validCount < valueNumber){
          rowRecursive(sourceList, maxcount + 1, newMakeList, output);
          return;
        }
        // 다 골라서 배열에 넣고 중단
        else if(validCount === valueNumber){
          // 3이 하나라도 없는 유물 반지는 ㄴㄴ
          let sumOfThree = newMakeList.filter(val => val === 3).length;
          if(sumOfThree === 0) {
            return [];
          }
          output.push(newMakeList);
          return;
        }
      })
    }
    let finalOutput: any[] = [];
    let createAcc = (sourceList: any[], index: number, targetList: any[], result: any[]) => {
      let rowOutput: any[] = [];
      // row 리스트 획득
      rowRecursive(sourceList, 0, [], rowOutput)
      
      // console.log('index : ', index, ' sourceList [', sourceList.join('],['), '] targetList', targetList.join(' '));
      // console.log('rowOutput : ', rowOutput.join('\n'));

      rowOutput.forEach((val: any[]) => {
        // 마지막 악세서리일 때
        if(index === 4) {
          let items = [...targetList, val];
          // console.log('last', index, '=>', items.join(' - '));
          finalOutput.push({
            accSocketList: items,
            accStr: items.map((item, index) => this.getAcc(index, item)),
            accList: this.getAcc2(items),//items.map((item, index) => this.getAcc(index, item)),
            accCompositions: [], // this.getFinalComposition(items), TODO 다른 함수에서 한번에 ㄱㄱ
          });
          return;
        }
        // 리스트에서 제거한 새로운 리스트 생성
        let newSourceList = JSON.parse(JSON.stringify(sourceList));
        for(let i = 0; i < val.length; ++i){
          if(val[i] > 0){
            // skip 이 아니면 newSourceList 에서 숫자를 하나 뺀다.
            newSourceList[i].splice(newSourceList[i].findIndex((src : number) => src === val[i]), 1)
          }
        }
        // 리스트에서 제거한 후 다음 depth 순환
        createAcc(newSourceList, index + 1, [...targetList, val], result);
      })
      return rowOutput;
    }
    createAcc(list, 0, [], finalOutput);
    // console.log('final', finalOutput);
    return finalOutput;
  }

  getAcc(accindex: number, sock: number[]) {
    let sock1 = -1;
    let sock2 = -1;
    let output: any = [];

    for(let i = 0; i < sock.length; ++i) {
      if(sock[i] !== 0){
        if(sock1 === -1){
          sock1 = i;
        } else {
          sock2 = i;
        }
      }
    }
    // console.log(sock, sock1, sock2);
    let item: any = {};
    let socket: Socket[] = [];
    let socketNumber: number[] = [];
    switch(accindex){
      case 0:
        // neckless
        item = this.nectMetricsData[sock1][sock2][0];
        socket = item.socket;
        socketNumber = item.socketNumber;
        output = `목걸이📿  ${socket[0].name}.${socketNumber[0]}, ${socket[1].name}.${socketNumber[1]} - ${item.price}💰(${item.list.length})`;
        break;
      case 1:
      case 2:
        // earring
        item = this.earringMetricsData[sock1][sock2][0];
        socket = item.socket;
        socketNumber = item.socketNumber;
        socketNumber = this.earringMetricsData[sock1][sock2][0].socketNumber;
        output = `귀걸이💄  ${socket[0].name}.${socketNumber[0]}, ${socket[1].name}.${socketNumber[1]} - ${item.price}💰(${item.list.length})`;
        break;
      case 3:
      case 4:
        // ring
        item = this.ringMetricsData[sock1][sock2][0];
        socket = item.socket;
        socketNumber = item.socketNumber;
        socketNumber = this.ringMetricsData[sock1][sock2][0].socketNumber;
        output = `반지💍  ${socket[0].name}.${socketNumber[0]}, ${socket[1].name}.${socketNumber[1]} - ${item.price}💰(${item.list.length})`;
        break;
    }
    return output;
  }

  getAcc2(sockets: any[]) {
    let itemList = sockets.map((sock: number[], sockIndex: number) => {
      // 악세별로 돌아가면서 
      let sock1 = -1;
      let sock2 = -1;
      let sockLarge = true; // a > b
      let output: any = [];

      for(let i = 0; i < sock.length; ++i) {
        if(sock[i] !== 0){
          if(sock1 === -1){
            sock1 = i;
          } else {
            sock2 = i;
          }
        }
      }
      if(sock[sock1] > sock[sock2]) {
        sockLarge = true;
      } else {
        sockLarge = false;
      }
      console.log(sock, sock1, sock2);

      let item: any = {};
      let socket: Socket[] = [];
      let socketNumber: number[] = [];
      switch(sockIndex){
        case 0:
          // neckless
          item = sockLarge === true ? this.nectMetricsData[sock1][sock2] : this.nectMetricsData[sock2][sock1];
          break;
        case 1:
        case 2:
          // earring
          item = sockLarge === true ? this.earringMetricsData[sock1][sock2] : this.earringMetricsData[sock2][sock1];
          break;
        case 3:
        case 4:
          // ring
          item = sockLarge === true ? this.ringMetricsData[sock1][sock2] : this.ringMetricsData[sock2][sock1];
          break;
      }
      return item;
    });
    return itemList;
  }

  getFinalComposition(cases: any) {
    let itemList = cases.accList;
    let socketNumbers = cases.accSocketList;  // [ [3,2], [3,2], [2,3], [2,0,3], [0,3,2] ]
    // 장신구 목록
    interface SumDataModel {
      price: number;
      sockets: any;
      penalty: any;
      property: any;
      propertySum: number;
    }
    
    // 치특신 모두 합한 거
    let allItemList: any[] = [];
    for(let i = 0; i < itemList.length; ++i){
      let sum = [];
      let number = socketNumbers[i];
    
      let sock1 = -1;
      let sock2 = -1;
      let output: any = [];

      for(let i = 0; i < number.length; ++i) {
        if(number[i] !== 0){
          if(sock1 === -1){
            sock1 = i;
          } else {
            sock2 = i;
          }
        }
      }
      if(number[sock1] > number[sock2]) {
        sum.push(...itemList[i][0].list);
        sum.push(...itemList[i][1].list);
        sum.push(...itemList[i][2].list);
      } else {
        sum.push(...itemList[i][3].list);
        sum.push(...itemList[i][4].list);
        sum.push(...itemList[i][5].list);
      }
      allItemList.push(sum);
    }
    // console.log(allItemList);
    let allOfFinal: any[] = [];   
    let propSum = Number(this.props['[치명]']) + Number(this.props['[특화]']) + Number(this.props['[신속]']); 
    let recursive = (sourceList: any[], depth: number, makeList: AccData[], sumData: SumDataModel) => {
      let listUp: any = sourceList[depth];
      // console.log(sourceList, depth, listUp.list);
      if(this.tooMuchData === true) {
        return;
      }
      listUp.forEach((item : AccData) => {
        if(this.tooMuchData === true) {
          return;
        }
        // 악세 종류 하나의 list 중 아이템 하나임!
        // 특성을 모두 합쳐서 sum 에 담기
        if(!item.price || item.price < 0) {
          return;
        }
        let perSumData: SumDataModel = {
          price: sumData.price + item.price,
          sockets: {...sumData.sockets},
          penalty: {...sumData.penalty}, 
          property: {...sumData.property},
          propertySum: sumData.propertySum,
        }
        if(!perSumData.price || perSumData.price > this.maxPrice) {
          return;
        }
        // 소켓
        let socket1 = perSumData.sockets[item.socket1.name];
        if(socket1){
          perSumData.sockets[item.socket1.name] += item.socket1.number;
        }else {
          perSumData.sockets[item.socket1.name] = item.socket1.number;
        }
        
        let socket2 = perSumData.sockets[item.socket2.name];
        if(socket2){
          perSumData.sockets[item.socket2.name] += item.socket2.number;
        }else {
          perSumData.sockets[item.socket2.name] = item.socket2.number;
        }
        // console.log(perSumData.sockets, perSumData.sockets[item.socket1.name], item.socket1.number, perSumData.sockets[item.socket2.name], item.socket2.number)

        // 패널티
        let penalty = perSumData.penalty[item.badSocket1.name];
        if(penalty){
          perSumData.penalty[item.badSocket1.name] += item.badSocket1.number;
        }else {
          perSumData.penalty[item.badSocket1.name] = item.badSocket1.number;
        }
        
        // console.log(perSumData.penalty)
        let stop = false;
        for(let key of Object.keys(perSumData.penalty)){
          if(perSumData.penalty[key] > 4) {
            stop = true;
            break;
          }
        }
        if(stop === true) {
          return;
        }
        
        // 특성
        let prop1 = perSumData.property[item.property1.name];
        if(prop1){
          perSumData.property[item.property1.name] += item.property1.number;
        }else {
          perSumData.property[item.property1.name] = item.property1.number;
        }
        
        let prop2 = perSumData.property[item.property2.name];
        if(prop2){
          perSumData.property[item.property2.name] += item.property2.number;
        }else {
          perSumData.property[item.property2.name] = item.property2.number;
        }

        if(perSumData.property['[신속]'] 
          && perSumData.property['[신속]'] > Number(this.props['[신속]']) + 100) {
          return;
        }
        if(perSumData.property['[치명]'] 
          && perSumData.property['[치명]'] > Number(this.props['[치명]']) + 100) {
          return;
        }
        if(perSumData.property['[특화]'] 
          && perSumData.property['[특화]'] > Number(this.props['[특화]']) + 100) {
          return;
        }
        
        // stop = false;
        // for(let key of Object.keys(perSumData.property)){
        //   if(perSumData.property[key] > 1200) {
        //     stop = true;
        //     break;
        //   }
        // }
        // if(stop === true) {
        //   return;
        // }

        let newMakeList = [...makeList, item];
        if(depth + 1 >= 5) {
          // console.log(newMakeList, perSumData);
          if(perSumData.price > this.maxPrice) {
            // 가격이 넘으면 안되고
            return;
          }
          let itemPropSum = perSumData.property['[신속]'] ? perSumData.property['[신속]'] : 0
                           + perSumData.property['[특화]'] ? perSumData.property['[특화]'] : 0
                           + perSumData.property['[치명]'] ? perSumData.property['[치명]'] : 0;
          if(propSum > itemPropSum){
            // 특성 합이 부족하면 탈락
            // return;
          }

          // 개별 특성 합이 너무 부족해도 탈락 
          if(perSumData.property['[신속]'] 
            && perSumData.property['[신속]'] < Number(this.props['[신속]'])) {
            return;
          }
          if(perSumData.property['[치명]'] 
            && perSumData.property['[치명]'] < Number(this.props['[치명]'])) {
            return;
          }
          if(perSumData.property['[특화]'] 
            && perSumData.property['[특화]'] < Number(this.props['[특화]'])) {
            return;
          }
          perSumData.propertySum = ((perSumData.property['[특화]'] ? perSumData.property['[특화]'] : 0)
                                  + (perSumData.property['[신속]'] ? perSumData.property['[신속]'] : 0)
                                  + (perSumData.property['[치명]'] ? perSumData.property['[치명]'] : 0));

          allOfFinal.push([newMakeList, perSumData]);
          if(allOfFinal.length > this.dataLimit + 2) {
            this.tooMuchData = true;
          }
          // this.testAllData.push([newMakeList, perSumData]);
          return;
        } 

        recursive(sourceList, depth + 1, newMakeList, perSumData);
      });
    }
    let prePenalty: any = {};
    prePenalty[this.selectedPenalty.name] = Number(this.selectedPenalty.number);
    recursive(allItemList, 0, [], {price: 0, sockets: {}, penalty: prePenalty, property: {}, propertySum: 0,});
    // console.log('end of getFinalComposition');
    this.testAllData.push(...allOfFinal);
    return allOfFinal;
  }

  onClickCalcPrice() {
    this.progressing = 0;
    this.calculating = true;
    this.tooMuchData = false;

    this.props['[치명]'] = Number(this.props['[치명]']);
    this.props['[특화]'] = Number(this.props['[특화]']);
    this.props['[신속]'] = Number(this.props['[신속]']);

    setTimeout(() => {
      this.testAllData = [];
      console.log(this.calculating)
      this.oneDepth();
      console.log('end')
      this.calculating = false;
    }, 1000);
  }
  async oneDepth(){
    this.allAccComposition.forEach((rootComposition : any[]) => {
      // 각인 숫자 조합 경우의 수
      for(let cases of rootComposition){
        // console.log('cases', this.progressing);
        cases.accCompositions = [];
        let res = this.getFinalComposition(cases)
        cases.accCompositions.push(res);
        // console.log('function end', index);
        // console.log('cases end', this.progressing);
        
        ++this.progressing;
        // if(this.progressing > 500) {
        //   return
        // }
      }
    })
  }
}
</script>

<style lang="scss">
input {
  padding: 4px;
  margin: 2px;
  background-color: #ddd;
  border: 1px solid cadetblue;
}
</style>

<style scoped lang="scss">
.acccomp-root {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-auto-flow: column;
}
.acccomp-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  .socket-list {
    width: 100%;

    display: flex;

    .socket {
      flex: 1;
    }
    // display: grid;
    // grid-template-columns: repeat(6, 1fr);
    // grid-auto-flow: column;
    // align-items: stretch;
  }
  .manual-inputs{
    width: 100%;

    display: flex;
    // display: grid;
    // grid-template-columns: repeat(6, 1fr);
    // grid-auto-flow: column;

    input {
      width: 90%;
    }
  }
  .socket-desposition {
    width: 80%;

    .row {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      grid-auto-flow: column;
      align-items: stretch;
    }
  }
  .socket-cases{
    width: 80%;
    .comp {
      border-top: 8px solid blue;

      .cases {
        border: 1px solid #ddd;
        margin: 8px 0;
        h4{
          margin: 8px 0;
        }
        .row{
          // background-color: #eee;
          position: relative;

          display: grid;
          grid-template-columns: 84px repeat(5, 32px);
          justify-content: start;

          .value {
            font-weight: 700;
            min-width: 64px;
          }
          .item {
            width: 360px;
            text-align: right;

            position:absolute;
            right: 12px;
          }
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

    user-select: none;
    cursor: pointer;

    &:hover {
      background-color: gold;
    }
  }
</style>