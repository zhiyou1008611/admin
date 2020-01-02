<template>
  <admin-super v-if="show"></admin-super>
  <admin v-else></admin>
</template>
<script>
import admin from "./admin.vue";
import adminSuper from "./adminSuper.vue";
export default {
  components: { admin, adminSuper },
  data() {
    return {
      show: true
    };
  },
  mounted() {},
  methods: {}
};
</script>
