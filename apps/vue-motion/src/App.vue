<template>
  <Layout />
</template>

<script>
import Layout from "./components/Layout.vue"

export default {
  name: "App",
  components: {
    Layout,
  },
}
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
}

#app {
  min-height: 100vh;
}

img {
  max-width: 100%;
  height: auto;
}

button,
input,
select,
textarea {
  font: inherit;
}

input[type="range"] {
  accent-color: var(--accent);
}
</style>
