<template>
    <div class="root-wrapper">
        <SearchList v-if="showSearchList" @close="showSearchList = false">
            <div class="search-list" v-if="selectedCase">
                <div class="select-case" v-for="cases of selectedCase.list" :key="cases.id">
                    <div>이름 {{cases.name}}</div>
                    <div>거래가능 {{cases.count}}</div>
                    <div>특성 {{cases.property.name}} {{cases.property.number}}</div>
                    <div>각인1 {{cases.socket1.name}} {{cases.socket1.number}}</div>
                    <div>각인2 {{cases.socket2.name}} {{cases.socket2.number}}</div>
                    <div>패널티 {{cases.badSocket1.name}} {{cases.badSocket1.number}}</div>
                </div>
            </div>
        </SearchList>
        <div class="socket-list">
            <div class="selected">
                <div class="socket-row" v-for="sock of selectedSocket" :key="sock.id" @click="onClickSocket(sock)">
                   {{sock.name}}<span v-if="sock.class">({{sock.class}})</span>
                </div>
            </div>
            <div class="remain-list">
                <div class="socket-row" v-for="sock of displayRemainSocket" :key="sock.id" @click="onClickRemainSocket(sock)">
                    {{sock.name}}<span v-if="sock.class">({{sock.class}})</span>
                </div>
            </div>
        </div>
        <div 
            class="grid-table">
            <div class="search"
                @click="onClickSearch">
                Search Now!
            </div>
            <div class="headers">
                <div class="dummy">
                    <div>
                        5, 3만 검색<input type="checkbox" v-model="fullMax"/>
                    </div>
                </div>
                <div class="header" v-for="sock of fixedSocket" :key="sock.id">
                    {{sock.name}}<span v-if="sock.class">({{sock.class}})</span>
                </div>
            </div>
            <div v-if="fixedSocket.length <= 0">
                각인을 선택해주세요
            </div>
            <div class="contents">
                <div class="row" v-for="(row, index) of socketMetrics" :key="row">
                    <div class="data name">{{fixedSocket[index].name}}<span v-if="fixedSocket[index].class">({{fixedSocket[index].class}})</span></div>
                    <div class="data" v-for="column of row" :key="column">
                        <template v-if="column === null">
                            <span style="grid-column: 1/4; grid-row: 1/4; align-self: center; font-size: 1.5rem;">-</span>
                        </template>
                        <template v-else>
                            <div class="cases"
                                v-for="cases of column"
                                :key="cases.id"
                                @click="onClickCase(cases)"> 
                                {{cases.socket[0].name}} {{cases.socketNumber[0]}} <br /> 
                                {{cases.socket[1].name}} {{cases.socketNumber[1]}} <br /> 
                                <span :class="{'font-relics': cases.property === 0, 'font-legend': cases.property === 1, 'font-hero': cases.property === 2, }">{{propList[cases.property]}}</span><br />
                                <span class="price font-gold">{{cases.price}}💰</span>
                            </div>
                        </template>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mixins } from 'vue-class-component';
import moment from 'moment';

import SearchList from './SearchList.vue';
import SocketList, {Socket} from '../constants/SocketList';
import AccSearchService, {RequestAcc, AccData} from '../service/AccSearchService.vue';


@Component({
    components: {
        SearchList
    },
})
export default class AccList extends mixins(AccSearchService) {
    socketList: Socket[] = SocketList;
    selectedSocket: Socket[] = [];
    fixedSocket: Socket[] = [];

    socketMetrics: any[] = [];
    propList = [
        '치명',
        '특화',
        '신속',
    ]
    fullMax = true;
    selectedCase: any = {};

    showSearchList = false;

    get displayRemainSocket() {
        return this.socketList.filter(val => {
            let index = this.selectedSocket.findIndex(elem => {
                return elem.id === val.id
            });
            return index < 0;
        })
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
    onClickRemainSocket(sock: Socket){
        this.selectedSocket.push(sock);
    }
    /**
     * * 각인 제거
     */
    onClickSocket(sock: Socket){
        let index = this.selectedSocket.findIndex(val => val.id === sock.id);
        this.selectedSocket.splice(index, 1);
    }
    /**
     * * 조회 시작
     */
    onClickSearch(){
        this.fixedSocket = [...this.selectedSocket];
        this.socketMetrics = this.createSocketMetrics();
    }
    onClickCase(cases: any) {
        this.selectedCase = cases;
        this.showSearchList = true;
    }
    /**
     * *  n x n 배열부터 만든다.
     */
    createSocketMetrics(){
        let output: any[] = [];
        let size = this.selectedSocket.length;

        for(let i = 0; i < size; ++i){
            let row: any[] = [];
            for(let j = 0; j < size; ++j){
                row.push(this.createCaseMetrics([this.selectedSocket[i], this.selectedSocket[j]]));
            }
            output.push(row);
            for(let data of row){
                this.createResult(data);
            }
        }
        console.log('metrics', output);
        return output;
    }
    /**
     * * 그 안에서 케이스별로 나눠 
     */
    createCaseMetrics(socket: Socket[]) {
        if(socket[0].id === socket[1].id){
            return null;
        }
        let output: any[] = [];
        const propCount = 3;
        const socketMax = this.fullMax === true ? [5] : [5, 4];

        for(let i = 0; i < socketMax.length; ++i){
            let row: any[] = [];

            for(let j = 0; j < propCount; ++j){
                let sock1:Socket = socket[0];
                let sock2:Socket = socket[1];

                let item = {
                    id: i * propCount + j,
                    socket: [sock1, sock2],
                    socketNumber: [socketMax[i], 3],
                    property: j,
                    price: 0,//Math.ceil(Math.random() * 10000),
                    list: [],
                }
                output.push(item);
            }
        }
        return output;
    }
    async createResult(conditions: any) {
        // console.log('createResult conditions', conditions)
        if(conditions === null){
            return;
        }
        for(let item of conditions){
            // console.log('item', item);
            let param: RequestAcc = {
                socket1: {
                    id: item.socket[0].id,
                    number: item.socketNumber[0]
                },
                socket2: {
                    id: item.socket[1].id,
                    number: item.socketNumber[1]
                },
                property: item.property
            }
            // console.log(param);
            this.getAccData(param).then((res: AccData[]) => {

                // console.log('result', res);
                item.list = res;
                if(res.length > 0){
                    item.price = res[0].price;
                }else {
                    item.price = -1;
                }
            });
        }
    }

    async getAccData(request: RequestAcc) {
        let res = await this.getData(request);
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
    display: flex;
    flex-wrap: nowrap;

    .search-list {
        padding: 24px;
        .select-case {
            padding: 8px;
            &:nth-child(n + 2){
                border-top: 1px solid #aaa;
            }
        }
    }
    .socket-list {
        overflow: auto;
        
        position: fixed;
        top: 0;
        width: 240px;
        height: calc(100vh);
        background-color: #333;


        .selected{
            background-color: rgb(33, 92, 126);
            .socket-row {
                user-select: none;
                cursor: pointer;
            }
        }
        .remain-list{
            .socket-row {
                user-select: none;
                cursor: pointer;
            }
        }
    }
    .grid-table{
        overflow: auto;
        margin-left: 240px;
        .search{
            padding: 24px;
            font-size: 1.5rem;
            font-weight: 700;
            background-color: rgb(255, 187, 0);
            color:rgb(81, 85, 88);
            user-select: none;
            cursor: pointer;
        }
        .headers {
            display: grid;
            grid-auto-flow: column;
            align-content: start;
            .dummy, 
            .header {
                font-size: 1.25rem;
                width: $data-width;
                height: 48px;
                padding: $data-padding;
                border: 1px solid #ddd;
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
}
</style>
