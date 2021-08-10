<template>
  <div id="app">
    <div id="nav">
      <router-link to="/test">각인</router-link>
      <router-link to="/trade-rate">제작 비용 비교</router-link>
      <router-link to="/acc-list">유물 악세서리 모아보기</router-link>
      <router-link to="/acc-list-legend">전설 악세서리 모아보기</router-link>
      <router-link to="/acc-list-remote">악세서리 가져오기</router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');
#app {
  font-family: 'Noto Sans KR', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #f1f1f1;
  background-color: #262525;
  height: 100vh;
  overflow-y: auto;
}

#nav {
  padding: 24px;
  background-color: #8484A2;

  a {
    font-size: 1.25rem;
    text-decoration: none;
    color: #B0AFC6;
    font-weight: 500;

    padding: 4px 8px;

    &:hover {
      background-color: #262525;
      color: #CCB28C;
    }
    &.router-link-exact-active {
      color: #fdd393;
    }
  }
}

$color-normal : #b8b8b8;
$color-advanced : #6fc300;
$color-rare : #00b5ff;
$color-hero : #bf00fe;
$color-legend : #f39303;
$color-relics : #ff6000;
$color-mythology : #eee;

// common
.font-gold { color: gold;}

.font-normal { color: $color-normal; }
.font-advanced { color: $color-advanced; }
.font-rare { color: $color-rare; }
.font-hero { color: $color-hero; }
.font-legend { color: $color-legend; }
.font-relics { color: $color-relics; }
.font-mythology { color: $color-mythology; }

.font-red { color: #ff2600;}
.font-blue { color: #008cff;}

// layout
.flex-center {
  display: flex;
  align-items: center;
}

</style>
