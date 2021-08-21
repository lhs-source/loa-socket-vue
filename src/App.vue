<template>
  <div id="app">
    <!-- 노티 -->
    <notifications 
      group="validation" 
      :duration="3000" 
      position="top center" 
      classes="noti"
      width="480px"/>

    <div id="nav">
      <router-link to="/home">🏚 홈</router-link>
      <!-- <router-link to="/test">각인</router-link> -->
      <!-- <router-link to="/trade-rate">🍀 생활 제작 비용 비교</router-link> -->
      <!-- <router-link to="/acc-list">유물 악세서리 모아보기</router-link> -->
      <!-- <router-link to="/acc-list-legend">전설 악세서리 모아보기</router-link> -->
      <!-- <router-link to="/acc-list-remote">👓 장신구 조합 계산</router-link>
      <router-link to="/stat">🧪 통계</router-link> -->
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {

  }
})
export default class App extends Vue {


  constructor(){
    super();

    if(process.env.NODE_ENV === 'prod'){
      Vue.config.devtools = false
      // Vue.config.debug = false
      Vue.config.silent = true
    }
    
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');
#app {
  font-family: 'Noto Sans KR', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #f1f1f1;
  background-color: $color-stone10;
  height: 100vh;
  overflow-y: auto;
}

#nav {
  padding: 24px;
  background-color: $color-stone08;

  a {
    font-size: 1.25rem;
    text-decoration: none;
    color: $color-stone02;

    padding: 4px 8px;

    &:hover {
      background-color: $color-green07;
      color: $color-stone03;
    }
    &.router-link-exact-active {
      color: $color-summer06;
    }
  }
}

.noti {
  padding: 16px;
  margin: 0 5px 5px;
 
  font-size: 12px;
 
  color: $color-stone03;
  background-color: $color-stone09;
  border: 1px solid $color-stone05;
  border-top-width: 3px;
  border-color: $color-relics;
  box-shadow: 0px 2px 10px #333333aa;

  .notification-title {
    // Style for title line 
    filter: brightness(1.1);
    font-size: 1rem;
  }
 
  .notification-content {
    // Style for content 
    font-size: 14px;
  }
 
  &.warn {
    background-color: $color-stone09;
    border-color: gold;
    color: gold;
  }
  &.error {
    background-color: $color-stone09;
    border-color: $color-relics;
    color: $color-relics;
  }
  &.success {
    background-color: $color-stone09;
    border-color: $color-rare;
    color: $color-rare;
  }
}

</style>
