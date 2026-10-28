<template>
  <StatusPanel
    kicker="404"
    title="This route is not in the sandbox"
    description="The path is not one of the labelled demos. Use the gallery, or open the source on GitHub."
    role="alert"
    live="assertive"
  >
    <router-link class="btn-primary" :to="{ path: '/', hash: '#demos' }">
      All demos
    </router-link>
    <a class="btn-ghost" :href="SITE.github" rel="noopener noreferrer">
      View source
    </a>
  </StatusPanel>

  <nav class="not-found-list" aria-label="Available demos">
    <ul>
      <li v-for="demo in demos" :key="demo.id">
        <router-link :to="demo.path">
          <span class="not-found-nav">{{ demo.nav }}</span>
          <span class="not-found-zh">{{ demo.titleZh }}</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import StatusPanel from "../components/StatusPanel.vue"
import { SITE, demos } from "../data/demos.js"
</script>
