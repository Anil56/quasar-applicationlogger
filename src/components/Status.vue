<template>
  <div class="row q-pa-md">
    <div class="col-3 q-pa-sm">
      <q-input
        v-model="searchText"
        clearable
        @keyup.enter="getData"
        type="text"
        label="Key / Value / PBI / Version"
      />
    </div>
    <div class="col-3 q-pt-lg q-pl-sm">
      <q-btn color="primary" icon="search" label="Search" @click="getData" />
    </div>
    <div class="col-6 q-pt-lg text-right">
      <q-btn
        color="positive"
        class="no-pointer-events q-mr-lg"
        icon="check"
        label="Exist and Localised"
        readonly
        flat
      />
      <q-btn
        color="negative"
        class="no-pointer-events q-mr-lg"
        icon="check"
        label="Exist"
        readonly
        flat
      />
      <q-btn
        color="negative"
        class="no-pointer-events q-mr-lg"
        icon="close"
        label="Doesn't Exist"
        readonly
        flat
      />
    </div>
    <div class="col-12 q-mt-lg">
      <q-table
        :data="data"
        :columns="columns"
        row-key="name"
        :rows-per-page-options="[10, 25, 50, 100]"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="key" :props="props">{{ props.row.key }}</q-td>
            <q-td key="value" :props="props">{{ props.row.value }}</q-td>
            <q-td key="pbi" :props="props">{{ props.row.pbi }}</q-td>
            <q-td key="version" :props="props">{{ props.row.version }}</q-td>
            <q-td key="dev" :props="props">
              <q-btn
                :color="props.row.dev.localised ? 'positive' : 'negative'"
                :icon="props.row.dev.exist ? 'check' : 'close'"
                @click="viewDetails(props.row)"
                class="no-pointer-events"
                round
                flat
              />
            </q-td>
            <q-td key="staging" :props="props">
              <q-btn
                :color="props.row.staging.localised ? 'positive' : 'negative'"
                :icon="props.row.staging.exist ? 'check' : 'close'"
                @click="viewDetails(props.row)"
                class="no-pointer-events"
                round
                flat
              />
            </q-td>
            <q-td key="demo" :props="props">
              <q-btn
                :color="props.row.demo.localised ? 'positive' : 'negative'"
                :icon="props.row.demo.exist ? 'check' : 'close'"
                @click="viewDetails(props.row)"
                class="no-pointer-events"
                round
                flat
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
      searchText: "",
      data: [],
      columns: [
        {
          name: "key",
          label: "KEY",
          align: "left",
          classes: "ellipsis",
          style: "width: 200px; max-width: 200px",
          field: (row) => row.key,
        },
        {
          name: "value",
          label: "VALUE",
          align: "left",
          classes: "ellipsis",
          style: "width: 250px; max-width: 250px",
          field: (row) => row.value,
        },
        {
          name: "pbi",
          label: "PBI",
          align: "left",
          classes: "ellipsis",
          style: "width: 30px; max-width: 30px",
          field: (row) => row.pbi,
        },
        {
          name: "version",
          label: "VERSION",
          align: "left",
          classes: "ellipsis",
          style: "width: 30px; max-width: 30px",
          field: (row) => row.version,
        },
        {
          name: "dev",
          label: "DEV",
          align: "left",
          classes: "ellipsis",
          style: "width: 50px; max-width: 50px",
          field: (row) => row.dev,
        },
        {
          name: "staging",
          label: "STAGING",
          align: "left",
          classes: "ellipsis",
          style: "width: 50px; max-width: 50px",
          field: (row) => row.staging,
        },
        {
          name: "demo",
          label: "DEMO",
          align: "left",
          classes: "ellipsis",
          style: "width: 50px; max-width: 50px",
          field: (row) => row.demo,
        },
      ],
    };
  },
  props: ["collectionName"],
  mounted() {
    // this.getData();
  },
  methods: {
    viewDetails(data) {},
    async getData() {
      let url = `http://localhost:3005/language-constant/status?value=${this.searchText}&collection=${this.collectionName}`;
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
