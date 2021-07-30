<template>
  <div class="getdata-wrapper">
    Hello
    <div class="socket-template">
      <div class="socket" v-for="sock of socket" :key="sock">
        {{sock}}
        <div class="socket-in" v-for="item of sock" :key="item">
          <label class="label">각인</label><span class="value">{{item.socketName}}({{item.socketCode}})</span>
          <label class="label">수치</label><span class="value">{{item.value}}</span>
        </div>
      </div>
    </div>
    <label>데이터 가져오기<button @click="getData">데이터 가져오기</button></label>

    <div class="socket-detail">
      <h3>타겟 설정</h3>
      <div class="grid">
        <span class="label">유물</span>
        <span class="target-socket" v-for="sock of targetSocket" :key="sock">{{sock}}</span>
      </div>
      <div>
        <span class="label">돌</span>
        <span class="stone-socket" v-for="sock of stoneSocket" :key="sock">{{sock}}</span>
      </div>
      <div>
        <span class="label">각인서</span>
        <span class="doc-socket" v-for="sock of docSocket" :key="sock">{{sock}}</span>
      </div>
      <div>
        <span class="label">남은 필요 수치</span>
        <span class="remain-socket" v-for="sock of remainSocket" :key="sock">{{sock}}</span>
      </div>
      <div class="socket-composition">
        <h3>합분해 구하기</h3>
        <div>
          <button @click="onClickComposition">합분해 계산</button>
          <span class="able-socket" v-for="comp of composition" :key="comp">
            {{comp}}
          </span>
        </div>
        <div style="margin-top: 48px">
          <h3>합분해 숫자 조합 구하기</h3>
          <div v-for="row of ableComposition" :key="row">
            <span class="label" style="font-weight: 700; font-size: 1.25rem;">=></span>
            <span class="able-socket" v-for="comp of row" :key="comp">
              {{comp}}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="socket-cases">
      <h3>최종 각인 케이스 목록</h3>
      <div class="comp" v-for="cases of lastComposition" :key="cases">
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
import { Component, Vue } from "vue-property-decorator";

import axios from 'axios';

@Component({
  components: {
  },
})
export default class GetData extends Vue {
    socket: any[] = mockSocket;
    data: any = {};

    grade = 5;
    targetSocket: number[] = [15, 15, 15, 15, 15];
    stoneSocket: number[] = [7, 7, 0, 0, 0];
    docSocket: number[] = [0, 0, 0, 9, 12];

    // 가능한 모든 숫자 조합
    composition: any[] = [];
    // 수치 조합 경우의 수
    ableComposition: any[] = [];
    // 악세사리 필요
    lastComposition: any[] = [];

    accCount = 5;
    accSocketNumber = 2;


    get remainSocket() {
      let output: number[] = [];
      for(let i = 0; i < this.targetSocket.length; ++i){
        output[i] = this.targetSocket[i] - this.stoneSocket[i] - this.docSocket[i];
      }
      return output;
    }
    get remainSocketSum() {
      let sum = 0;
      this.remainSocket.forEach(val => sum += val);
      return sum;
    }
    // created() {

    // }

    async getData() {
        // let param: any = {};
        // param['request[firstCategory]'] = 200000;
        // param['request[secondCategory]'] = 200010
        // param['request[classNo]'] = '';
        // param['request[itemTier]'] = 3;
        // param['request[itemGrade]'] = 5;
        // param['request[itemLevelMin]'] = 0
        // param['request[itemLevelMax]'] = 1600
        // param['request[itemName]'] = ''; 
        // param['request[gradeQuality]'] = 50
        // param['request[skillOptionList][0][firstOption]'] = '';
        // param['request[skillOptionList][0][secondOption]'] = '';
        // param['request[skillOptionList][0][minValue]'] = '';
        // param['request[skillOptionList][0][maxValue]'] = ''; 
        // param['request[skillOptionList][1][firstOption]'] = ''; 
        // param['request[skillOptionList][1][secondOption]'] = ''; 
        // param['request[skillOptionList][1][minValue]'] = ''; 
        // param['request[skillOptionList][1][maxValue]'] = ''; 
        // param['request[skillOptionList][2][firstOption]'] = ''; 
        // param['request[skillOptionList][2][secondOption]'] = ''; 
        // param['request[skillOptionList][2][minValue]'] = ''; 
        // param['request[skillOptionList][2][maxValue]'] = ''; 
        // param['request[etcOptionList][0][firstOption]'] = 2;
        // param['request[etcOptionList][0][secondOption]'] = 16
        // param['request[etcOptionList][0][minValue]'] = ''; 
        // param['request[etcOptionList][0][maxValue]'] = ''; 
        // param['request[etcOptionList][1][firstOption]'] = 3
        // param['request[etcOptionList][1][secondOption]'] = 292
        // param['request[etcOptionList][1][minValue]'] = ''; 
        // param['request[etcOptionList][1][maxValue]'] = ''; 
        // param['request[etcOptionList][2][firstOption]'] = ''; 
        // param['request[etcOptionList][2][secondOption]'] = ''; 
        // param['request[etcOptionList][2][minValue]'] = ''; 
        // param['request[etcOptionList][2][maxValue]'] = ''; 
        // param['request[etcOptionList][3][firstOption]'] = ''; 
        // param['request[etcOptionList][3][secondOption]'] = ''; 
        // param['request[etcOptionList][3][minValue]'] = ''; 
        // param['request[etcOptionList][3][maxValue]'] = ''; 
        // param['request[pageNo]'] = 1
        // param['pushKey'] = '';
        // param['tooltipData'] = ''; 
        let form = new URLSearchParams()
        form.append('request[firstCategory]', `200000`);
        form.append('request[secondCategory]', `200010`);
        form.append('request[classNo]', '');
        form.append('request[itemTier]', `3`);
        form.append('request[itemGrade]', '5');
        form.append('request[itemLevelMin]', '0');
        form.append('request[itemLevelMax]', '1600');
        form.append('request[itemName]', ''); 
        form.append('request[gradeQuality]', '50');
        form.append('request[skillOptionList][0][firstOption]', '');
        form.append('request[skillOptionList][0][secondOption]', '');
        form.append('request[skillOptionList][0][minValue]', '');
        form.append('request[skillOptionList][0][maxValue]', ''); 
        form.append('request[skillOptionList][1][firstOption]', ''); 
        form.append('request[skillOptionList][1][secondOption]', ''); 
        form.append('request[skillOptionList][1][minValue]', ''); 
        form.append('request[skillOptionList][1][maxValue]', ''); 
        form.append('request[skillOptionList][2][firstOption]', ''); 
        form.append('request[skillOptionList][2][secondOption]', ''); 
        form.append('request[skillOptionList][2][minValue]', ''); 
        form.append('request[skillOptionList][2][maxValue]', ''); 
        form.append('request[etcOptionList][0][firstOption]', "2");
        form.append('request[etcOptionList][0][secondOption]', '16');
        form.append('request[etcOptionList][0][minValue]', ''); 
        form.append('request[etcOptionList][0][maxValue]', ''); 
        form.append('request[etcOptionList][1][firstOption]', '3');
        form.append('request[etcOptionList][1][secondOption]', '292');
        form.append('request[etcOptionList][1][minValue]', ''); 
        form.append('request[etcOptionList][1][maxValue]', ''); 
        form.append('request[etcOptionList][2][firstOption]', ''); 
        form.append('request[etcOptionList][2][secondOption]', ''); 
        form.append('request[etcOptionList][2][minValue]', ''); 
        form.append('request[etcOptionList][2][maxValue]', ''); 
        form.append('request[etcOptionList][3][firstOption]', ''); 
        form.append('request[etcOptionList][3][secondOption]', ''); 
        form.append('request[etcOptionList][3][minValue]', ''); 
        form.append('request[etcOptionList][3][maxValue]', ''); 
        form.append('request[pageNo]', '1');
        form.append('pushKey', '');
        form.append('tooltipData', ''); 
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
            .then( response => { console.log('response : ', JSON.stringify(response, null, 2)) })
            .catch( error => { console.log('failed', error) })

    }

    onClickComposition() {
      let sumOfSocket = 0;
      this.remainSocket.forEach(val => sumOfSocket += val);
      let useList = sumOfSocket >= 40 ? [5, 3] : [5, 4, 3]; 

      let lengthList: any[] = [];

      // 합분해 구하기
      this.remainSocket.forEach(val => {
        let comp = this.getDesposition(val, useList);
        this.composition.push(comp)
      })

      // 가능한 합분해 조합 구하기

      let ableComp: any[] = [];
      let recursive = (remain : number, maxcount: number, makeList: any[]) => {
        if(maxcount > 5) {
          return;
        }
        for(let i = 0; i < this.composition[maxcount].length; ++i) {
          let target = this.composition[maxcount][i];
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
            if(this.remainSocketSum <= sum){
              ableComp.push([...makeList, target]);
            }
            continue;
          }
          recursive(nextRemain, maxcount + 1, maxcount === 0 ? [target] : [...makeList, target]);
        }
      }
      recursive(10, 0, []);
      this.ableComposition = ableComp;

      ableComp.forEach(val => {
        this.lastComposition.push(this.getAllCases(val, 5, 2));
      })
    }

    /**
     * 숫자 합분해를 찾아낸다
     * @param {number} num 합분해 대상 숫자 (15)
     * @param {number[]} list 합분해 요소 숫자 리스트 ([5, 3])
     */
    getDesposition(num : number, list: number[]) : any[] {
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
      let recurrsive = (remain : number, useList: number[], makeList: number[], maxcount: number) => {
        if(maxcount > 5){
          return null;
        }
        // console.log(`count : ${maxcount}, remain: ${remain}, useList: ${useList}, makeList: ${makeList}`,)
        for(let use of useList){
          // 이전 숫자보다 크면
          if(makeList && use > makeList[makeList.length - 1]){
            continue;
          }

          let nextRemain = remain - use;
          // console.log(`${remain} - ${use} = ${nextRemain}`);

          if(nextRemain > 0) {
            // 숫자가 부족함
            recurrsive(nextRemain, useList, maxcount === 0 ? [use] : [...makeList, use], maxcount + 1);
          }
          else if(nextRemain === 0) {
            // 숫자가 딱 떨어짐
            output.push([...makeList, use]);
          }
          else {
            // 숫자가 넘겨버려서 -가 됨
            continue;
          }
        }
        return;
      }
      recurrsive(num, list, [], 0);
      return output;
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

const mockSocket = [
    [
        {
            socketName: '오의난무',
            socketCode: 292,
            value: 3,
        },
        {
            socketName: '예리한 둔기',
            socketCode: 141,
            value: 5,
        },
    ]
]
</script>

<style lang="scss" scoped>
.getdata-wrapper {

  .socket-template{

    .socket{
      .socket-in {

        .label{
            margin-right: 16px;
            color: #333;
            font-weight: 600;
        }
        .value {
            margin-right: 32px;
            color: #333;
            font-weight: 400;
        }
      }
    }
  }
  .socket-detail {
    .grid{

    }
    .label{
      margin: 4px 0;
      display: inline-block;
      width: 128px;
    }
    .target-socket, .stone-socket, .doc-socket, .remain-socket, .able-socket {
      margin: 4px 0;
      display: inline-block;
      width: 128px;
      // margin: 0 8px;

      font-weight: 700;
      font-size: 1.25rem;
    }
    .remain-socket {
      color: red;
      margin: 16px 0;
    }
    .able-socket {
      font-size: 1rem;
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
          background-color: #eee;

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
