<template>
  <div id="app">
    <div id="nav">
      <router-link to="/test">각인</router-link>
      <router-link to="/trade-rate">제작 비용 비교</router-link>
      <router-link to="/acc-list">악세서리 모아보기</router-link>
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
  background-color: #161616;
  height: 100vh;
  overflow-y: auto;
}

#nav {
  padding: 24px;
  background-color: rgb(0, 168, 0);

  a {
    font-size: 1.25rem;
    text-decoration: none;
    color: #f7f7f7;
    font-weight: 500;

    padding: 4px 8px;

    &:hover {
      background-color: rgb(0, 41, 0);
      color: #ffffff;
    }
    &.router-link-exact-active {
      color: gold;
    }
  }
}

// common
.font-gold { color: gold;}

.font-normal { color: #b8b8b8; }
.font-advanced { color: #6fc300; }
.font-rare { color: #00b5ff; }
.font-hero { color: #bf00fe; }
.font-legend { color: #f39303; }
.font-relics { color: #ff6000; }
.font-mythology { color: #eee; }

.font-red { color: #ff2600;}
.font-blue { color: #008cff;}

// layout
.flex-center {
  display: flex;
  align-items: center;
}

</style>
