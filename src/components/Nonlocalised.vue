<template>
  <div class="row q-pa-md">
    <div class="col-8 q-pa-sm">
      <q-toggle
        v-model="selectedPref"
        checked-icon="check"
        keep-color
        unchecked-icon="clear"
        indeterminate-value="indeterminate"
        label="Select All"
      />
      <q-checkbox v-model="prefixes" @input="getData" val="pl" label="Polish" />
      <q-checkbox
        v-model="prefixes"
        @input="getData"
        val="es"
        label="Spanish"
      />
      <q-checkbox
        v-model="prefixes"
        @input="getData"
        val="nl"
        label="Netherland"
      />
      <q-checkbox
        v-model="prefixes"
        @input="getData"
        val="de"
        label="Deutsch"
      />
      <q-checkbox v-model="prefixes" @input="getData" val="fr" label="French" />
      <q-checkbox
        v-model="prefixes"
        @input="getData"
        val="it"
        label="italian"
      />
    </div>
    <div class="col-3 q-pa-sm">
      <q-btn
        color="secondary"
        size="lg"
        :disabled="!prefixes.length"
        label="Download as Excel"
        @click="downloadData"
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
            <q-td
              key="value"
              :props="props"
              class="ellipsis"
              style="width: 100px"
              >{{ props.row.value }}</q-td
            >
            <q-td key="locale" :props="props">{{ props.row.locale }}</q-td>
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
      prefixes: ["pl", "nl", "it", "de", "es", "fr"],
      data: [],
      selectedPref: true,
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
      ],
    };
  },
  props: ["collectionName"],
  watch: {
    selectedPref: {
      handler: function (newObj) {
        console.log({ newObj });
        if (newObj == true)
          this.prefixes = ["pl", "nl", "it", "de", "es", "fr"];
        if (newObj == false) {
          this.prefixes = [];
        }

        this.getData();
      },
      deep: true,
    },
  },
  async mounted() {
    // await this.getData();
  },
  methods: {
    async getData() {
      var len = this.prefixes.length;

      if (len == 6) {
        this.selectedPref = true;
      }
      if (len == 0) {
        this.selectedPref = false;
        this.data = [];
        this.$q.notify({
          type: "info",
          message: `Please select a prefix to fetch records`,
        });
        return;
      }

      if (len < 6) {
        this.selectedPref = "indeterminate";
      }

      let values = this.prefixes.join("|");
      let url = `http://localhost:3005/language-constant/nonlocalised?prefixes=${values}&collection=${this.collectionName}`;
      this.$q.loading.show();
      let response = await axios.get(url);
      this.$q.loading.hide();
      if (response.data.status) {
        this.data = response.data.data;
      } else {
        this.$q.notify({
          type: response.data.message ? "positive" : "warning",
          message: response.data.message || `No records found`,
        });
        this.data = [];
      }
    },
    downloadData() {
      if (this.prefixes.length == 0) {
        this.data = [];
        this.$q.notify({
          type: "info",
          message: `Please select a prefix to fetch records`,
        });
        return;
      }
      let values = this.prefixes.join("|");
      let url = `http://localhost:3005/language-constant/nonlocalised?prefixes=${values}&d=1&collection=${this.collectionName}`;

      window.open(url, "_self");
    },
  },
};
</script>
