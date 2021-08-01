<template>
  <div class="acccomp-wrapper">
    <div class="socket-list">
      <div>
        <div>각인명</div>
        <div>필요한 각인 수치</div>
        <div>세공</div>
        <div>각인서</div>
        <div>채워야 할 각인 수치</div>
      </div>
      <div v-for="calcsock of calcSocketList" :key="calcsock.id">
        <div>{{ calcsock.socket.name }}</div>
        <div>{{ calcsock.need }}</div>
        <div>{{ calcsock.stone }}</div>
        <div>{{ calcsock.doc }}</div>
        <div class="font-relics">{{ calcsock.remain }}</div>
      </div>
    </div>
    <div class="socket-desposition">
      <div></div>
      <div class="row" v-for="row of displayDesposition" :key="row">
        <span></span>
        <span class="able-socket" v-for="comp of row" :key="comp">
          {{comp}}
        </span>
      </div>
    </div>
    <div class="socket-cases">
      <h3>최종 각인 케이스 목록</h3>
      <div class="comp" v-for="cases of allAccComposition" :key="cases">
        <div class="cases" v-for="(row, caseIndex) of cases" :key="row">
          <h4>케이스 {{caseIndex}}번</h4>
          <div class="row" v-for="(mid, accIndex) of row" :key="mid">
            <span class="label" style="font-weight: 700; font-size: 1.25rem;">악세 {{accIndex}}.</span>
            <span class="value" v-for="value of mid" :key="value">
              <span v-if="value > 0">{{value}}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import { Socket } from "../constants/SocketList";

@Component
export default class AccComposition extends Vue {
  @Prop({ default: () => [] }) readonly socketList!: any[];
  @Prop({ default: () => [] }) readonly nectMetricsData!: any[];
  @Prop({ default: () => [] }) readonly earringMetricsData!: any[];
  @Prop({ default: () => [] }) readonly ringMetricsData!: any[];

  get calcSocketList() {
    interface Item {
      id: number;
      socket: Socket;
      need: number;
      stone: number;
      doc: number;
      remain: number;
    }
    let need = [15, 15, 15, 15, 15];
    let stone = [7, 7, 0, 0, 0];
    let doc = [0, 0, 0, 9, 12];

    let output = this.socketList.map((val: Socket, i: number) => {
      console.log("AccComposition:calcSocketList", val, i);
      let item: Item = {
        id: i,
        socket: val,
        need: need[i],
        stone: stone[i],
        doc: doc[i],
        remain: need[i] - stone[i] - doc[i],
      };
      return item;
    });
    return output;
  }

  get displayDesposition() {
    // 필요한 각인들 [8, 8, 15, 6, 3]...
    let remainSocket: number[] = this.calcSocketList.map(val => val.remain);
    let desposition: any[] = [];
    let sumOfSocket = 0;
    remainSocket.forEach(val => sumOfSocket += val);
    let useList: number[] = sumOfSocket >= 40 ? [5, 3] : [5, 4, 3]; 

    // 합분해 구하기
    remainSocket.forEach((val) => {
      let comp = this.getDesposition(val, useList);
      desposition.push(comp);
    });

    let despComposition: any[] = this.getDespComposition(desposition, sumOfSocket);
    return despComposition;
  }

  get allAccComposition() {
    let output: any[] = [];
    this.displayDesposition.forEach(val => {
      output.push(this.getAllCases(val, 5, 2));
    })
    return output;
  }

  /**
   * 숫자 합분해를 찾아낸다
   * @param {number} num 합분해 대상 숫자 (15)
   * @param {number[]} list 합분해 요소 숫자 리스트 ([5, 3])
   */
  getDesposition(num: number, list: number[]): any[] {
    let arr: number[] = new Array(num);
    arr.fill(0, 0, num);

    // + 8 +
    // 5
    //   5 - 5 (x)
    //   5 - 4 (x)
    //   5 - 3 (o)
    // 4
    //   4 - 4 (o)
    //   4 - 3 (x)
    // 3
    //   3 (x)

    // [[5, 3], [4, 4]]
    let output: any[] = [];
    let recurrsive = (
      remain: number,
      useList: number[],
      makeList: number[],
      maxcount: number
    ) => {
      if (maxcount > 5) {
        return null;
      }
      // console.log(`count : ${maxcount}, remain: ${remain}, useList: ${useList}, makeList: ${makeList}`,)
      for (let use of useList) {
        // 이전 숫자보다 크면
        if (makeList && use > makeList[makeList.length - 1]) {
          continue;
        }

        let nextRemain = remain - use;
        // console.log(`${remain} - ${use} = ${nextRemain}`);

        if (nextRemain > 0) {
          // 숫자가 부족함
          recurrsive(
            nextRemain,
            useList,
            maxcount === 0 ? [use] : [...makeList, use],
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
  getDespComposition(desposition: any[], socketSum: number) {
    // 가능한 합분해 조합 구하기
    let composition: any[] = [];
    let ableComp: any[] = [];
    let recursive = (remain : number, maxcount: number, makeList: any[]) => {
      if(maxcount > 5) {
        return;
      }
      for(let i = 0; i < desposition[maxcount].length; ++i) {
        let target = desposition[maxcount][i];
        let nextRemain = remain - target.length;

        if(maxcount < 4 && nextRemain <= 0) {
          continue;
        }
        if(maxcount === 4 && nextRemain === 0) {
          let sum = 0;
          [...makeList, target].forEach((val2: number[]) => {
            let innerSum = 0;
            val2.forEach((val3 : number) => innerSum += val3);
            sum += innerSum;
          });
          // console.log(this.remainSocketSum, sum)
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
      if(maxcount === 5){
        return ;
      }
      // let removeDuplicate = sourceList.map((val: number[]) => {
      //   return [...new Set(val)];
      // })
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

        // 각인 합이 8 넘어가면 중단
        if(sumOfSocket > 8) {
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
          // TODO 8 이하여도 탈락(합이 40이어야 함)
          // if(sumOfSocket < 8) {
          //   return;
          // }
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
      
      console.log('index : ', index, ' sourceList [', sourceList.join('],['), '] targetList', targetList.join(' '));
      console.log('rowOutput : ', rowOutput.join('\n'));

      rowOutput.forEach((val: any[]) => {
        // 마지막 악세서리일 때
        if(index === 4) {
          console.log('last', index, '=>', [...targetList, val].join(' - '));
          finalOutput.push([...targetList, val]);
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
    console.log('final', finalOutput);
    return finalOutput;
  }
}
</script>

<style scoped lang="scss">
.acccomp-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  .socket-list {
    width: 80%;

    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-auto-flow: column;
    align-items: stretch;
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

          display: grid;
          grid-template-columns: 84px repeat(5, 32px);
          justify-content: center;

          .value {
            font-weight: 700;
          }
        }
      }
    }
  }
}
</style>