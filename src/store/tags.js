import { defineStore, acceptHMRUpdate } from 'pinia'

export const useTagsStore = defineStore({
  id: 'tags',
  state: () => ({
    tags: [],
    cached: [],
  }),
  actions: {
    initTags () {
      this.tags.push(
        {
          name: 'Home',
          path: '/Home',
          title: '首页',
          active: false,
          closeable: false,
          keepAlive: false,
        })
    },
    addTag (route) {
      const tags = this.tags
      if (tags.find(t => t.name === route.name)) {
        tags.forEach(t => t.active = false)
        tags.find(t => t.name === route.name).active = true
      } else {
        tags.forEach(t => t.active = false)
        if (route.meta?.keepAlive) {
          this.addCachedTag(route.name)
        }
        tags.push({
          name: route.name,
          path: route.fullPath,
          title: route.meta?.title || route.name,
          active: true,
          closeable: true,
          keepAlive: route.meta?.keepAlive,
        })

      }
      this.$patch({ tags })
    },
    removeTag (tag) {
      let tags = this.tags
      if (tags.find(t => t.name === tag.name)) {
        const index = tags.findIndex(t => t.name === tag.name)
        if (index > -1) {
          if (tags[index].keepAlive) {
            this.removeCachedTag(tags[index].name)
          }
          tags.splice(index, 1)
        }
      }
      this.$patch({ tags })
    },
    addCachedTag (name) {
      if (!this.cached.includes(name)) {
        this.cached.push(name)
      }
    },
    removeCachedTag (name) {
      if (this.cached.includes(name)) {
        this.cached.splice(this.cached.indexOf(name), 1)
      }

    },

  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTagsStore, import.meta.hot))
}
