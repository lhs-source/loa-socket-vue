<template>
  <div class="root-wrapper">
    <!-- 각인 선택 사이드바 -->
    <div class="socket-list box">
      <div class="title">
        각인 선택
      </div>
      <div class="contents">
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
    </div>
    <div class="condition-list box">
      <div class="title">
        원하는 조합 조건
      </div>
      <div class="contents">
        <div class="row">
          <label>유물이면 체크, 아니면 해제</label>
          <input type="checkbox" v-model="isRelics" />
        </div>
        <div class="row">
          <label>가격 제한</label>
          <input type="number" v-model="maxPrice" />
        </div>
        <div class="description">
          전설은 1000~5000, 유물은 30000~150000원 선에서 조절하여 넣어주세요. <br/>결과가 3000개 이상이면 데이터를 받아오지 않습니다.
        </div>
        <div class="row">
          <label>치명</label>
          <input type="number" v-model="props['치명']" />
        </div>
        <div class="row">
          <label>특화</label>
          <input type="number" v-model="props['특화']" />
        </div>
        <div class="row">
          <label>신속</label>
          <input type="number" v-model="props['신속']" />
        </div>
        <div class="description">
          전설은 치특신 합 1550~1750, 유물은 치특신 합 1800~1950 선으로 잡아주시면 됩니다. 현재 {{sumProp}}
        </div>
        <div class="row">
          <label>돌 패널티</label>
          <select v-model="selectedPenalty.name" style="width: 200px;">
            <option value="공격속도 감소">공격속도 감소</option>
            <option value="이동속도 감소">이동속도 감소</option>
            <option value="방어력 감소">방어력 감소</option>
            <option value="공격력 감소">공격력 감소</option>
          </select>
          <input type="number" v-model="selectedPenalty.number" />
        </div>
        <div class="description">
          돌 패널티는 0부터 4까지 입력 가능합니다.(무조건 패널티 없는 세팅만 취급)
        </div>
      </div>
    </div>
    <div class="body-side">
      <div class="selected-socket-list box">
        <div class="title">
          선택한 각인 목록          
          <div class="font-advanced" style="margin-left: 8px;">
            순서대로, 1. 필요한 각인 수치 2. 세공 수치 3. 각인서 수치 4. 장신구에서 충당할 수치 입니다.
          </div>
        </div>
        <div class="contents">
          <div class="item-box">
            <div v-for="(socket, index) of selectedSocket" :key="socket.id">
              <!-- <div>{{socket.id}}</div> -->
              <div style="font-size: 1.5rem;">{{socket.name}}</div>
              <input class="need" type="number" v-model="need[index]"/>
              <input class="stone" type="number" v-model="stone[index]"/>
              <input class="doc" type="number" v-model="doc[index]"/>
              <div class="font-relics" style="font-size: 1.5rem;">{{remainSocket[index]}}</div>
            </div>
          </div>
          <!-- <div class="search-button" style="min-width: 360px;" @click="onClickPutRequest">
            크롤링 요청하기<span v-if="gettingCrawling === true">(요청중~)</span>
          </div> -->
        </div>
      </div>
      <div class="acc-list box">
        <div class="title">
          장신구 조합 결과<br />
          약 30초 ~ 1분 가량 소요
        </div>
        <div class="contents">
          <div class="search-button flex-center" style="min-width: 360px; justify-content: center;" @click="onClickLambda">
            조합 계산하기
            <span v-if="gettingComposition === true" class="flex-center"> - 조합 계산하는 중..<EmbeddedLoading /></span>
            <span v-else-if="gettingCrawling === true" class="flex-center"> - 데이터 찾는 중..<EmbeddedLoading /></span>
          </div>
          <template v-if="dataTooMuch !== 0">
            <div class="font-relics" style="">
              데이터 개수({{Math.abs(dataTooMuch)}}개 이상)가 너무 많습니다! 조건을 조정해주세요.
            </div>
          </template>
          <template v-else>
            <div class="acc-length">
              결과 {{compositions.length}} 개
            </div>
            <ItemPropInfo v-for="(item, itemIndex) of compositions" :key="itemIndex" :itemData="item">
            </ItemPropInfo>
          </template>
        </div>
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
import EmbeddedLoading from '../components/EmbeddedLoading.vue';

import SocketList, { Socket } from "../constants/SocketList";
import ServerService, {
  RequestAccessaryFromTrader, RequestComposition,
} from "../service/ServerService.vue";
import StatService from "../service/StatService.vue";

const MaxSearchCount = 3000;

@Component({
  components: {
    SearchList,
    ItemPropInfo,
    EmbeddedLoading,
  },
})
export default class AccList extends mixins(ServerService, StatService) {
  socketList: Socket[] = SocketList;
  // 선택한 각인 목록
  selectedSocket: Socket[] = [];

  // 가져온 조합
  compositions: any[] = [];

  // 데이터 크롤링 요청 완료?
  gettingCrawling = false;
  // 조합 계산 기다리는 중?
  gettingComposition = false;

  // 입력값
  need = [15, 15, 15, 15, 15];
  stone = [0, 0, 7, 7, 0];
  doc = [0, 9, 0, 0, 12];

  isRelics = true;
  props = {
    '치명' : 50,
    '특화' : 430,
    '신속' : 1400,
  };
  maxPrice = 50000;
  selectedPenalty = {
    name: '공격력 감소',
    number: 4,
  }

  // 데이터 너무 많이 받았다는 응답;
  dataTooMuch = 0;

  totalCount = 0;
  calcCount = 0;
  


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
  
  get remainSocket() {
    return this.need.map((val, index) => {
      return val - this.stone[index] - this.doc[index];
    })
  }

  /**
   * * 치특신 합
   */
  get sumProp() {
    let sumProp = Object.values(this.props).reduce((sum: number, current: number) => {sum += Number(current); return sum;}, 0);
    return sumProp;
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
  onClickGetComposition() {
    // GA tagging
    this.$gtag.event('search', {
        'event_category': 'searchSocket',
        'event_label': 'searchSocket',
        'value': 0
      })

    // validations
    // 지금 조회 중...
    if(this.gettingComposition === true ||
      this.gettingCrawling === true) {
      this.$notify({
        type: 'error',
        group: 'validation',
        title: '요청 불가',
        text: '지금 데이터를 받아오고 있으니 조금만 기다려주세요.',
      });
      this.$gtag.event('search', {
        'event_category': 'searchSocket',
        'event_label': 'searchSocket',
        'value': -1
      })
      return;
    }
    // 선택한 각인이 1개 이하
    if(this.selectedSocket.length <= 1) {
      this.$notify({
        type: 'error',
        group: 'validation',
        title: '요청 불가',
        text: '각인은 2개 이상 선택해주세요.',
      });
      this.$gtag.event('search', {
        'event_category': 'searchSocket',
        'event_label': 'searchSocket',
        'value': -2
      })
      return;
    }
    // 특성 합을 체크한다
    // console.log(sumProp);
    if(this.isRelics === false && (this.sumProp < 1550 || this.sumProp > 1750) ||
      this.isRelics === true && (this.sumProp < 1800 || this.sumProp > 1950)) {
      this.$notify({
        type: 'error',
        group: 'validation',
        title: '요청 불가',
        text: `전설은 특성합이 1550 이상, 1750 이하, 유물은 합이 1800 이상 1950 이하여야 합니다. 현재 ${this.sumProp}.`,
      });
      
      this.$gtag.event('search', {
        'event_category': 'searchSocket',
        'event_label': 'searchSocket',
        'value': -3
      })
      return;
    }
    if(this.selectedPenalty.number < 0 || this.selectedPenalty.number > 4) {
      this.$notify({
        type: 'error',
        group: 'validation',
        title: '요청 불가',
        text: `돌 패널티 수치를 확인해주세요. 0이상 4이하.`,
      });
      
      this.$gtag.event('search', {
        'event_category': 'searchSocket',
        'event_label': 'searchSocket',
        'value': -4
      })
      return;
    }
    // console.log('유효 숫자', this.remainSocket.filter((val: number) => { console.log(val); return val < 0 || val > 15;} ))
    if(this.remainSocket.filter((val: number) => val < 0 || val > 15).length > 0) {
      this.$notify({
        type: 'error',
        group: 'validation',
        title: '요청 불가',
        text: '필요한 각인 수치는 0에서 15로 맞춰주세요',
      });
      this.$gtag.event('search', {
        'event_category': 'searchSocket',
        'event_label': 'searchSocket',
        'value': -5
      })
      return;
    }
    
    this.$gtag.event('search', {
        'event_category': 'searchSocket',
        'event_label': 'searchSocket',
        'value': 0
      })

    // 진행 개수 초기화
    this.totalCount = 0;
    this.calcCount = 0;
    // 요청 스타트
    this.requestCrawling().then((res : any) => {
      return this.requestComposition().then((res: any) => {
        this.$notify({
          type: 'success',
          group: 'validation',
          title: '결과',
          text: '데이터를 받아왔습니다. 확인해주세요',
        });
      }).catch((err: any) => {
        this.$notify({
          type: 'error',
          group: 'validation',
          title: '결과',
          text: '에러가 발생했습니다. 다시 시도해주세요.',
        });
      });
    }).catch((err: any) => {
      this.$notify({
        type: 'error',
        group: 'validation',
        title: '결과',
        text: '에러가 발생했습니다. 다시 시도해주세요.',
      });
    })
  }
  async requestCrawling() {
    if(this.gettingCrawling === true) {
      return 0;
    }
    this.gettingCrawling = true;
    let param : RequestAccessaryFromTrader = {
      grade: this.isRelics === true ? 5 : 4,
      socket: this.selectedSocket,
      needNumber: this.remainSocket,
    }
    return this.putAccessaryFromTrader(param).then((res : any) => {
      // console.log(res);
      this.gettingCrawling = false;
      return res;
    })
  }
  /**
   * * 조합을 가져오자! ㅜㅜ
   */
  async requestComposition() {
  
    this.gettingComposition = true;
    let param : RequestComposition = {
      socketList: this.selectedSocket,
      needNumber: this.remainSocket,
      grade: this.isRelics === true ? 5 : 4,
      maxPrice: this.maxPrice,
      props:  this.props,
      penalty: this.selectedPenalty,
    }
    return this.postAccessaryFromTrader(param).then((res: any) => {
      // worker
      if (window.Worker) {
        // let actions = [
        //   { message: 'calculate', func: () => {let result = this.calculateFinal(res);}}
        // ]
        // let worker = SWorker.create(actions);
        // console.log('worker', worker)
        // worker.postMessage('calculate')
        //   .then((result: any) => {
        //   if(typeof result === 'number') {
        //     // 개수 초과
        //     this.dataTooMuch = -result;
        //     this.compositions = [];
        //     this.gettingComposition = false;
        //   }
        //   else {
        //     this.compositions =  result;
        //     this.gettingComposition = false;
        //   }
        // })
        // return res;
        // console.log('워커 ㄴㄴ');
        let result = this.calculateFinal(res.data);
        if(typeof result === 'number') {
          // 개수 초과
          this.dataTooMuch = -result;
          this.compositions = [];
          this.gettingComposition = false;
          return res;
        }
        else {
          this.compositions =  result;
          this.gettingComposition = false;
          
          // 조합 결과 로그 남기기
          let scheme: any = {
              grade: param.grade,
              socket: param.socketList,
              property: [],
              price: result[0][1].price,
          }
          if(param.props['치명']){
              let prop: any = {
                  id: 0,
                  name: '치명',
                  number: this.props['치명'],
              }
              scheme.property.push(prop);
          }
          if(param.props['특화']){
              let prop: any = {
                  id: 1,
                  name: '특화',
                  number: param.props['특화'],
              }
              scheme.property.push(prop);
          }
          if(param.props['[신속]']){
              let prop: any = {
                  id: 2,
                  name: '신속',
                  number: param.props['[신속]'],
              }
              scheme.property.push(prop);
          }
          this.putLogPrice(scheme);

          return res;
        }
      }
      else {
        // console.log('워커 ㄴㄴ');
        let result = this.calculateFinal(res.data);
        if(typeof result === 'number') {
          // 개수 초과
          this.dataTooMuch = -result;
          this.compositions = [];
          this.gettingComposition = false;
        return res;
        }
        else {
          // 결과 잘 받아옴!
          this.compositions =  result;
          this.gettingComposition = false;

          if(result[0]){
            // 조합 결과 로그 남기기
            let scheme: any = {
                grade: param.grade,
                socket: param.socketList,
                property: [],
                price: result[0][1].price,
            }
            if(param.props['치명']){
                let prop: any = {
                    id: 0,
                    name: '치명',
                    number: this.props['치명'],
                }
                scheme.property.push(prop);
            }
            if(param.props['특화']){
                let prop: any = {
                    id: 1,
                    name: '특화',
                    number: param.props['특화'],
                }
                scheme.property.push(prop);
            }
            if(param.props['[신속]']){
                let prop: any = {
                    id: 2,
                    name: '신속',
                    number: param.props['신속'],
                }
                scheme.property.push(prop);
            }
            this.putLogPrice(scheme);
          }
        return res;
        }
      }

    }).catch((err: any) => {
      this.gettingComposition = false;
      return err;
    })
  }

  calculateFinal(res: any[]) {
    let finalResult: any[] = [];
    let maxPrice = Number(this.maxPrice);
    let props = this.props;
    let penalty = this.selectedPenalty;
    let stop = false;

    // console.log('all cases', res);

    res.forEach((cases: any[], caseCount: number) => {
      // console.log('all cases ', caseCount, cases.length);
      // 총 개수 누적
      this.totalCount += res.length;
      if(stop === true) {
        return;
      }
      cases.forEach((oneCase: any, oneCaseCount: number) => {
        if(stop === true) {
          return;
        }
        // console.log('accList', oneCase.accSocketList);
        // console.log('accList', oneCase.accList);
        // console.log('calculateFinal', oneCaseCount, maxPrice, props, penalty, oneCase.accList)
        let result = this.getFinalComposition(maxPrice, props, penalty, oneCase.accList);
        // console.log('typeof(result)', typeof(result));
        // 진행 개수 업데이트
        ++this.calcCount;
        if(typeof(result) === 'number') {
          // console.log('getFinalComposition stop', `${caseCount}-${oneCaseCount}`, result);
          stop = true;
        }else {
          // console.log('getFinalComposition', `${caseCount}-${oneCaseCount}`, result.length);
          finalResult.push(...result);
          if(finalResult.length > MaxSearchCount) {
            // 멈춤!
            stop = true;
            // console.log('멈춰!');
          }
        }
      })
    })
    // console.log('finalResult', finalResult.length);

    if(finalResult.length > MaxSearchCount) {
      return -finalResult.length;
    }
    else {
      // 가격순으로 정렬
      finalResult.sort((a: any, b:any) => {
          return a[1].price > b[1].price ? 1 : -1;
      })
      finalResult = finalResult.slice(0, 300);
      
      return finalResult;
    }

  }

  getFinalComposition( maxPrice: number, props: any, penalty: any, itemList: any[]) {
    // 장신구 목록
    interface SumDataModel {
      price: number;
      sockets: any;
      penalty: any;
      property: any;
      propertySum: number;
    }
    let tooMuchData = false;
    let dataLimit = 3000;

    // console.log('getFinalComposition', itemList.length);
    // console.log('getFinalComposition', itemList[0]);
    
    // console.log(allItemList);
    let allOfFinal: any[] = [];   
    let propSum = Number(props['치명']) + Number(props['특화']) + Number(props['[신속]']); 
    let recursive = (sourceList: any[], depth: number, makeList: AccData[], sumData: SumDataModel) => {
      let listUp: any = sourceList[depth];
      // console.log(sourceList, depth, listUp.list);
      if(tooMuchData === true) {
        return;
      }
      listUp.forEach((item : AccData) => {
        if(tooMuchData === true) {
          return;
        }
        // 아이템 이름이 같으면 안된다 ㅠ
        if(makeList.length > 0 && makeList[makeList.length - 1].name === item.name) {
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
        if(!perSumData.price || perSumData.price > maxPrice) {
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
          && perSumData.property['[신속]'] > Number(props['[신속]']) + 100) {
          return;
        }
        if(perSumData.property['치명'] 
          && perSumData.property['치명'] > Number(props['치명']) + 100) {
          return;
        }
        if(perSumData.property['특화'] 
          && perSumData.property['특화'] > Number(props['특화']) + 100) {
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
          if(perSumData.price > maxPrice) {
            // 가격이 넘으면 안되고
            return;
          }
          let itemPropSum = perSumData.property['[신속]'] ? perSumData.property['[신속]'] : 0
                          + perSumData.property['특화'] ? perSumData.property['특화'] : 0
                          + perSumData.property['치명'] ? perSumData.property['치명'] : 0;
          if(propSum > itemPropSum){
            // 특성 합이 부족하면 탈락
            // return;
          }

          // 개별 특성 합이 너무 부족해도 탈락 
          if(perSumData.property['[신속]'] 
            && perSumData.property['[신속]'] < Number(props['[신속]'])) {
            return;
          }
          if(perSumData.property['치명'] 
            && perSumData.property['치명'] < Number(props['치명'])) {
            return;
          }
          if(perSumData.property['특화'] 
            && perSumData.property['특화'] < Number(props['특화'])) {
            return;
          }
          perSumData.propertySum = ((perSumData.property['특화'] ? perSumData.property['특화'] : 0)
                                  + (perSumData.property['[신속]'] ? perSumData.property['[신속]'] : 0)
                                  + (perSumData.property['치명'] ? perSumData.property['치명'] : 0));

          allOfFinal.push([newMakeList, perSumData]);
          if(allOfFinal.length > dataLimit + 2) {
            // console.log('data too much more');
            tooMuchData = true;
          }
          // this.testAllData.push([newMakeList, perSumData]);
          return;
        } 

        recursive(sourceList, depth + 1, newMakeList, perSumData);
      });
    }
    let prePenalty: any = {};
    prePenalty[penalty.name] = Number(penalty.number);
    recursive(itemList, 0, [], {price: 0, sockets: {}, penalty: prePenalty, property: {}, propertySum: 0,});
    // console.log('end of getFinalComposition');
    if(allOfFinal.length > dataLimit) {
      return -allOfFinal.length;
    }
    return allOfFinal;
  }


  onClickLambda() {

    // GA tagging
    this.$gtag.event('search', {
        'event_category': 'searchSocket',
        'event_label': 'searchSocket',
        'value': 0
      })

    // validations
    // 지금 조회 중...
    if(this.gettingComposition === true ||
      this.gettingCrawling === true) {
      this.$notify({
        type: 'error',
        group: 'validation',
        title: '요청 불가',
        text: '지금 데이터를 받아오고 있으니 조금만 기다려주세요.',
      });
      this.$gtag.event('search', {
        'event_category': 'searchSocket',
        'event_label': 'searchSocket',
        'value': -1
      })
      return;
    }
    // 선택한 각인이 1개 이하
    if(this.selectedSocket.length <= 1) {
      this.$notify({
        type: 'error',
        group: 'validation',
        title: '요청 불가',
        text: '각인은 2개 이상 선택해주세요.',
      });
      this.$gtag.event('search', {
        'event_category': 'searchSocket',
        'event_label': 'searchSocket',
        'value': -2
      })
      return;
    }
    // 특성 합을 체크한다
    // console.log(sumProp);
    if(this.isRelics === false && (this.sumProp < 1550 || this.sumProp > 1750) ||
      this.isRelics === true && (this.sumProp < 1800 || this.sumProp > 1950)) {
      this.$notify({
        type: 'error',
        group: 'validation',
        title: '요청 불가',
        text: `전설은 특성합이 1550 이상, 1750 이하, 유물은 합이 1800 이상 1950 이하여야 합니다. 현재 ${this.sumProp}.`,
      });
      
      this.$gtag.event('search', {
        'event_category': 'searchSocket',
        'event_label': 'searchSocket',
        'value': -3
      })
      return;
    }
    if(this.selectedPenalty.number < 0 || this.selectedPenalty.number > 4) {
      this.$notify({
        type: 'error',
        group: 'validation',
        title: '요청 불가',
        text: `돌 패널티 수치를 확인해주세요. 0이상 4이하.`,
      });
      
      this.$gtag.event('search', {
        'event_category': 'searchSocket',
        'event_label': 'searchSocket',
        'value': -4
      })
      return;
    }
    // console.log('유효 숫자', this.remainSocket.filter((val: number) => { console.log(val); return val < 0 || val > 15;} ))
    if(this.remainSocket.filter((val: number) => val < 0 || val > 15).length > 0) {
      this.$notify({
        type: 'error',
        group: 'validation',
        title: '요청 불가',
        text: '필요한 각인 수치는 0에서 15로 맞춰주세요',
      });
      this.$gtag.event('search', {
        'event_category': 'searchSocket',
        'event_label': 'searchSocket',
        'value': -5
      })
      return;
    }
    
    this.$gtag.event('search', {
        'event_category': 'searchSocket',
        'event_label': 'searchSocket',
        'value': 0
      })

    let param : RequestComposition = {
      socketList: this.selectedSocket,
      needNumber: this.remainSocket,
      grade: this.isRelics === true ? 5 : 4,
      maxPrice: this.maxPrice,
      props:  this.props,
      penalty: this.selectedPenalty,
    }
    this.gettingComposition = true;
    this.postLambda(param)
    .then((lambdaRes: any) => {
      console.log(lambdaRes);
      this.compositions = lambdaRes.data;
      this.gettingComposition = false;
    })
    .catch((err: any) => {
      console.log(err);
      this.gettingComposition = false;
    })
  }
}

interface AccData {
    name: string;
    count: string;
    grade: number;
    acctype: number;
    socket1: {
        name: string;
        number: number;
    }
    socket2:{
        name: string;
        number: number;
    }
    badSocket1: {
        name: string;
        number: number;
    }
    property1: {
        name: string;
        number: number;
    }
    property2: {
        name: string;
        number: number;
    }
    price: number;
    timestamp: Date;
}

</script>

<style lang="scss" scoped>
$data-width: 212px;
$data-height: 156px;
$data-padding: 4px;

.root-wrapper {
  display: grid;
  grid-template-columns: auto auto 1fr;
  grid-template-rows: auto;
  flex-wrap: nowrap;

  input, select { 
    background-color: transparent;
    border: none;
    border-bottom: 2px solid $color-stone05;
    color: $color-stone05;
    padding-bottom: 4px;

    &.need, &.doc, &.stone {
      width: 112px;
      font-size: 1.25rem;
      margin-top: 8px;
    }
    &:focus {
      outline: none;
      border-bottom: 2px solid $color-summer07;
    }
  }

  .box {
    position: relative;
    margin: 16px;
    background-color: $color-stone09;
    border: 1px solid $color-stone07;
    border-radius: 4px;

    .title {
      // position: absolute;
      // width: 100%;
      // top:0;
      // left: 0px;
      
      padding: 8px;
      margin-bottom: 8px;

      display: flex;
      flex-direction: column;
      align-items: center;

      background-color: $color-stone07;
      color: $color-stone02;
    }
    .contents {

    }
  }

  // 소켓 선택 사이드바
  .socket-list {
    overflow: auto;
    grid-column: 1/ 2; grid-row: 1 / 2;

    width: 240px;
    height: calc(100vh - 77px - 32px);
    
    color: $color-stone05;
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
  // 조건 설정 사이드
  .condition-list {
    overflow: auto;
    grid-column: 2/ 3; grid-row: 1 / 2;

    width: 240px;
    height: calc(100vh - 77px - 32px);
    margin-left: 0;
    // padding: 16px;

    .row {
      margin: 16px 0;

      input, select {
        width: 120px;
        margin-left: 8px;
        font-size: 1.25rem;
      }
      label {
        color: $color-stone03;
        font-weight: 500;
      }
    }
    .description {
      font-size: .75rem;
      color: $color-advanced;
      text-align: left;

      word-wrap: break-word;
      
      margin: 0 8px;
    }
  }
  // 본판
  .body-side {
    overflow-y: auto;
    grid-column: 3/ 4; grid-row: 1/ 2;
    // 선택한 각인 목록
    .selected-socket-list {
      margin-top: 16px;
      margin-right: 16px;
      margin-left: 0;

      .contents{
      
        height: 256px;

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
    }

    .acc-list {
      margin-top: 16px;
      margin-right: 16px;
      margin-left: 0;
    }
  }
  
  .search-button {
    padding: 16px;
    background-color: #D6AD60;

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

.loading-water{
  display: inline-block;
  width: 16px;
  height: 16px;
  background-color: skyblue;
  border-radius: 50%;
  position: relative;
  box-shadow: inset 0 0 8px 0 rgba(0,0,0,.5), 0 2px 4px 0 rgba(0,0,0,.5);
  overflow: hidden;
  &:before, &:after{
      content:'';
      position: absolute;
      width:20px;
      height: 24px;
      left: -2px;
      top:-10px;
      background-color: #fff;
  }
  &:before{
      border-radius: 46%;
      height: 22px;
      background:rgba(255,255,255,.7);
      animation:wave 5s linear infinite;
  }
  &:after{
      border-radius: 37%;
      background:rgba(255,255,255,.3);
      animation:wave 5s linear infinite;
  }
  @keyframes wave{
      0%{
          transform: rotate(0);
      }
      100%{
          transform: rotate(360deg);
      }
  }
}


</style>
