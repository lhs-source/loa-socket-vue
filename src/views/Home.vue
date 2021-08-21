<template>
  <div class="home">
    <div>
      주말 한정 오픈 및 테스트 중...<br/>
      <b style="font-size: 1.25rem;">(8월 21일 ~ 8월 22일 자정 오픈예정)</b><br/>
    </div>
    <!-- <div style="margin-top: 64px;">
      안녕하세요 아직도 찾아주시는 분들이 계실지 몰라 페이지 띄웁니다.<br/>
      <b style="font-size: 1.25rem;">현재 공홈에서 경매장 연속 검색을 막는 바람에 오픈이 무기한 연기되었습니다.</b><br/>
      지금 당장으로는 서비스가 불가능하지만, 방법을 찾으면 다시 돌아오겠습니다.<br/>
      죄송하고 감사드립니다 ㅠ<br/> -->
    <!-- <div>
      본인이 필요해 쓰려고 만든 페이지<br/>
      원하시는 기능이나 버그는 메일이나 인겜으로 문의주세요(문의기능 없음)<br/>
      반응이 좋으면 고도화하고 아니면 말구요<br/>
    </div>
    <div class="font-rare">
      <b>생활 제작 비용 비교</b> - 생활 제작 아이템의 효율을 비교합니다.
    </div> -->
    <div class="font-hero">
      <b>장신구 조합 계산</b> - 장신구 조합을 계산해서 최저가를 계산합니다.
    </div>
    <div class="font-advanced">
      <b>통계</b> - 유저분들의 검색 데이터 히스토리를 보여줍니다.
    </div>
    <div class="font-legend">
      <b>제작자</b> - 까마귀주먹(카제로스, iddms5446@gmail.com)
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
  },
})
export default class Home extends Vue {}
</script>
