.<template>
  <router-view></router-view>
</template>

<script setup>
const jkl = "100px";

</script>

<style lang="scss">
.box {
  width: v-bind(jkl);
  height: 100px;
  background-color: pink;
}
</style>