<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" @click="changeTest">
    <template v-for="item in $power.nm">
      {{item}}
    </template>
    <Test />

    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  methods: {
    changeTest () {
      this.$model.$power.nm.push('ccc')
      this.$model.$power.nm[3] += 'ss'
    }
  }
}
</script>
