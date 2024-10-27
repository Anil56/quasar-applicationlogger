<template>
  <div class="row q-pa-md">
    <div class="col-5 q-pa-sm">
      <q-input
        v-model="searchText"
        clearable
        @keyup.enter="getData('value')"
        type="text"
        label="Search Key / Value"
      />
    </div>
    <div class="col-1 q-pa-sm">
      <q-btn
        color="primary"
        class="q-mr-sm q-mt-md"
        style="width: 100%"
        size="16px"
        label="Key"
        @click="getData('key')"
      />
    </div>
    <div class="col-1 q-pa-sm">
      <q-btn
        color="secondary"
        class="q-ml-sm q-mt-md"
        style="width: 100%"
        size="16px"
        label="Value"
        @click="getData('value')"
      />
    </div>
    <div class="col-12 q-mt-lg" v-if="data.length">
      <q-table
        :data="data"
        :columns="columns"
        row-key="name"
        :rows-per-page-options="[10, 25, 50, 100]"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="key" :props="props">{{ props.row.key }}</q-td>
            <q-td
              key="value"
              :props="props"
              class="ellipsis"
              style="width: 100px"
              >{{ props.row.value }}</q-td
            >
            <q-td key="locale" :props="props">{{ props.row.locale }}</q-td>
            <q-td key="actions" :props="props">
              <q-btn
                round
                color="primary"
                icon="visibility"
                class="q-mr-sm"
                @click="viewKeyValues(props.row.key)"
              />
              <q-btn
                round
                color="primary"
                icon="edit"
                @click="editKey(props.row.key)"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      searchText: "SUCCESS",
      data: [],
      columns: [
        {
          name: "key",
          label: "KEY",
          align: "left",
          classes: "ellipsis",
          style: "width: 300px; max-width: 300px",
          field: (row) => row.key,
        },
        {
          name: "value",
          label: "VALUE",
          align: "left",
          classes: "ellipsis",
          style: "width: 700px; max-width: 700px",
          field: (row) => row.value,
        },
        {
          name: "locale",
          label: "LOCALE",
          align: "left",
          classes: "ellipsis",
          style: "width: 100px; max-width: 100px",
          field: (row) => row.locale,
        },
        {
          name: "actions",
          label: "Actions",
          align: "left",
          classes: "ellipsis",
          style: "width: 100px; max-width: 100px",
          field: (row) => row.key,
        },
      ],
    };
  },
  props: ["collectionName"],
  async mounted() {
    // await this.getData("key");
  },
  methods: {
    viewKeyValues(txt) {
      this.searchText = txt;
      this.getData("key");
    },
    editKey(param) {
      this.$router.push({
        name: "LanguageConstant.Insert",
        params: { key: param },
      });
    },
    async getData(type) {
      let url = `http://localhost:3005/language-constant/search?type=${type}&value=${this.searchText}&collection=${this.collectionName}`;
      this.$q.loading.show();
      let response = await axios.get(url);
      this.$q.loading.hide();
      if (response.data.status) {
        this.data = response.data.data;
      } else {
        this.$q.notify({
          type: "warning",
          message: `No records found for searched KEY / VALUE`,
        });
        this.data = [];
      }
    },
  },
};
</script>
