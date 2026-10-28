<template>
  <div class="home">
    <section class="hero" aria-labelledby="home-title">
      <p class="kicker">Labelled sandbox</p>
      <h1 id="home-title">{{ SITE.name }}</h1>
      <span class="hero-rule" aria-hidden="true"></span>
      <p class="hero-lead">
        Vue 3 lab for GSAP, Three.js, Lottie, and VueUse Motion. Hosted on
        GitHub Pages. This is a labelled sandbox, not a product.
      </p>
      <div class="hero-actions">
        <a class="btn-primary" href="#demos">Browse demos</a>
        <a class="btn-ghost" :href="SITE.github" rel="noopener noreferrer">
          View source
        </a>
      </div>
    </section>

    <section class="home-points" aria-label="What this repo contains">
      <article>
        <h2>Motion demos</h2>
        <p>
          Open a page, use the controls, then jump to the source file for that
          demo.
        </p>
      </article>
      <article>
        <h2>Vue 3 lab</h2>
        <p>
          Composition API, component communication, composables, and Pinia —
          a labelled learning surface, not an app.
        </p>
      </article>
      <article>
        <h2>Mock recipes</h2>
        <p>
          Static JSON gallery. Not a shop, CMS, or dishes API.
        </p>
      </article>
    </section>

    <section id="demos" class="demo-index" aria-labelledby="demos-heading">
      <header class="section-head">
        <p class="kicker">Gallery</p>
        <h2 id="demos-heading">Demos</h2>
        <p>
          Every card is a real route. Each demo page links back here and to
          its source file.
        </p>
      </header>

      <ul class="demo-grid">
        <li v-for="(demo, index) in demos" :key="demo.id">
          <router-link class="demo-card" :to="demo.path">
            <span class="demo-card-meta">
              <span class="demo-index">{{ String(index + 1).padStart(2, "0") }}</span>
              <span class="demo-kind">{{ kindLabel(demo.kind) }}</span>
            </span>
            <h3>{{ demo.title }}</h3>
            <p class="demo-zh">{{ demo.titleZh }}</p>
            <p class="demo-blurb">{{ demo.blurb }}</p>
            <p class="demo-tech">{{ demo.tech.join(" · ") }}</p>
          </router-link>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { SITE, demos } from "../data/demos.js"

defineOptions({ name: "HomePage" })

const kindLabel = kind => {
  if (kind === "lab") return "Lab"
  if (kind === "mock") return "Mock"
  return "Effect"
}
</script>
