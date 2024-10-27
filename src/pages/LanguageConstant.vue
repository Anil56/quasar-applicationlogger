<template>
  <q-card class="table-card q-mt-md q-mb-md">
    <q-tabs
      v-model="tab"
      no-caps
      outside-arrows
      mobile-arrows
      align="justify"
      :breakpoint="0"
      class="bg-white shadow-2"
    >
      <q-route-tab
        name="search"
        :to="{ name: 'LanguageConstant.Search' }"
        label="Search"
      />
      <q-route-tab
        name="insert"
        :to="{ name: 'LanguageConstant.Insert' }"
        label="Insert"
      />
      <q-route-tab
        name="nonlocalised"
        :to="{ name: 'LanguageConstant.Nonlocalised' }"
        label="Nonlocalised Keys"
      />
      <q-route-tab
        name="envStatus"
        :to="{ name: 'LanguageConstant.EnvStatus' }"
        label="Environment Status"
      />
    </q-tabs>
    <q-card-section>
      <div class="row">
        <div class="col-2 offset-10">
          <q-select
            v-model="collectionName"
            :options="collectionOptions"
            label="Language Constant"
            filled
            dense
          />
        </div>
      </div>
      <router-view :collectionName="collectionName.value" />
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "LanguageConstant",
  data() {
    return {
      tab: "search",
      collectionName: {
        label: "Global",
        value: "languageConstant",
      },
      collectionOptions: [
        {
          label: "Global",
          value: "languageConstant",
        },
        {
          label: "Auth0",
          value: "auth0LanguageConstant",
        },
      ],
    };
  },
  methods: {},
};
</script>

<style>
.table-card {
  min-height: calc(100vh - 90px);
  width: 100%;
  max-width: 1200px;
}
</style>
