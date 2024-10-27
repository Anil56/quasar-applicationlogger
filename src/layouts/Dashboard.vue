<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-green text-white">
      <q-toolbar>
        <q-toolbar-title>Seagate</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-tabs
        v-model="tab"
        no-caps
        outside-arrows
        mobile-arrows
        align="justify"
        :breakpoint="0"
        class="bg-grey-3 shadow-2"
      >
        <q-route-tab name="logger" to="/" label="Application Logger" />
        <q-route-tab
          name="langConst"
          to="/language-constant"
          label="Language Constant"
        />
        <q-route-tab name="zuora" to="/zuora" label="Zuora APIs" />
      </q-tabs>
      <q-page class="flex flex-center">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      tab: "movies",
    };
  },
};
</script>

<style>
</style>