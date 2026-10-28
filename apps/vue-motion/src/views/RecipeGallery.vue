<template>
  <div class="space-y-10">
    <header class="page-intro">
      <p class="kicker">Mock JSON · labelled demo</p>
      <h1>食譜／原物料 Gallery</h1>
      <p>
        Static mock catalog in this Vue lab. Not a dishes REST API, not an
        event site, and not Module Federation.
      </p>
    </header>

    <section aria-labelledby="recipes-heading">
      <h2 id="recipes-heading" class="section-head-title">Recipes</h2>

      <StatusPanel
        v-if="!recipes.length"
        heading="h3"
        title="No recipes in the mock catalog"
        description="The labelled JSON file has no recipe entries to show."
      />

      <div v-else class="recipe-grid">
        <article v-for="recipe in recipes" :key="recipe.id" class="card">
          <h3 class="recipe-title">{{ recipe.titleZh }}</h3>
          <p class="recipe-en">{{ recipe.title }}</p>
          <p class="recipe-copy">{{ recipe.summaryZh }}</p>
          <p class="recipe-meta">~{{ recipe.timeMinutes }} min</p>
          <p v-if="!materialsFor(recipe).length" class="empty-state">
            No materials linked on this recipe.
          </p>
          <div v-else class="chip-row">
            <span v-for="mat in materialsFor(recipe)" :key="mat.id" class="chip">
              {{ mat.nameZh }}
            </span>
          </div>
        </article>
      </div>
    </section>

    <section aria-labelledby="materials-heading">
      <h2 id="materials-heading" class="section-head-title">Materials</h2>
      <p v-if="!materials.length" class="empty-state">
        No materials in the mock catalog.
      </p>
      <div v-else class="material-grid">
        <div v-for="mat in materials" :key="mat.id" class="card material-card">
          <p class="font-semibold">{{ mat.nameZh }}</p>
          <p class="recipe-en">{{ mat.name }}</p>
          <p class="material-kind">{{ mat.kind }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { computed } from "vue"

import StatusPanel from "../components/StatusPanel.vue"
import catalog from "../data/recipes.json"

export default {
  name: "RecipeGallery",
  components: { StatusPanel },
  setup() {
    const recipes = computed(() => catalog.recipes || [])
    const materials = computed(() => catalog.materials || [])
    const byId = computed(() =>
      Object.fromEntries(materials.value.map(m => [m.id, m]))
    )

    const materialsFor = recipe =>
      (recipe.materialIds || []).map(id => byId.value[id]).filter(Boolean)

    return {
      recipes,
      materials,
      materialsFor,
    }
  },
}
</script>

<style scoped>
.section-head-title {
  margin: 0 0 1rem;
  font-size: 1.25rem;
  font-weight: 650;
  letter-spacing: -0.02em;
}

.recipe-grid {
  display: grid;
  gap: 0.85rem;
}

.recipe-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 650;
}

.recipe-en,
.recipe-meta,
.material-kind {
  margin: 0.2rem 0 0;
  color: var(--muted);
  font-size: 0.875rem;
}

.recipe-copy {
  margin: 0.75rem 0;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.chip {
  padding: 0.2rem 0.65rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  font-size: 0.8125rem;
}

.material-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.material-card {
  padding: 1rem;
}

.material-kind {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.7rem;
  font-weight: 650;
}

@media (min-width: 768px) {
  .recipe-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .material-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
