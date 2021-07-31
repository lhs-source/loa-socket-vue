<template>
  <div id="app">
    <div id="nav">
      <router-link to="/test">각인 최저가</router-link>
      <router-link to="/trade-rate">생활 한눈에 보기</router-link>
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
      color: #fff018;
    }
  }
}
</style>
