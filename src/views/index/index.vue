<template>
  <div class="index">
  </div>
</template>

<script>
  import { defineComponent, ref, onMounted } from 'vue'

  export default defineComponent({
    name: 'Home',
    setup () {
      const todoList = ref([
        {title:'修复bug'},
        {title:'修复bug'},
        {title:'修复bug'},
        {title:'增加新功能'},
      ])
      return {
        todoList
      }
    },
  })
</script>

<style scoped lang="scss">
  .index {
    .counts {
      display: flex;
      justify-content: space-between;

      .item {
        width: 32.5%;

        .num {
          font-size: 28px;
          display: flex;
          justify-content: space-around;
          align-items: center;

          .before, .after {
            font-size: 18px;

            .exp {
              font-size: 12px;
              margin-right: 10px;
            }

            .red {
              color: red;
            }

            .green {
              color: green;
            }
          }

          .middle {
            .exp {
              font-size: 20px;
              margin-right: 10px;
            }

            span + span {
              font-weight: bold;
            }
          }
        }
      }

    }
    .lans, .todo{
      height: 250px
    }
  }
</style>
