<template>
  <q-card class="table-card q-mt-md q-mb-md">
    <q-card-section>
      <div class="row">
        <div class="col-3 q-pa-md">
          <q-radio
            v-model="envType"
            val="dev"
            size="45px"
            @input="pageChanged"
            label="Development"
          />
          <q-radio
            v-model="envType"
            val="staging"
            size="45px"
            @input="pageChanged"
            label="Staging"
          />
          <q-radio
            v-model="envType"
            val="demo"
            size="45px"
            @input="pageChanged"
            label="Demo"
          />
        </div>
        <div class="col-3 q-pa-sm">
          <q-select
            v-model="serviceName"
            @input="pageChanged"
            :options="options"
            label="Service Type"
            filled
          />
        </div>
        <div class="col-3 q-pa-sm">
          <q-select
            v-model="level"
            @input="pageChanged"
            :options="lvlopt"
            label="Level"
            filled
          />
        </div>
        <div class="col-3 q-pa-sm">
          <q-btn
            color="secondary"
            size="lg"
            label="Download as Excel"
            @click="downloadData"
          />
        </div>
        <div class="col-3 q-pa-sm">
          <q-btn
            color="secondary"
            size="sm"
            label="Refresh"
            @click="pageChanged"
          />
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <q-table
        :data="data"
        :columns="columns"
        @request="pageChanged"
        :pagination.sync="pagination"
        :loading="loading"
        :rows-per-page-options="[5, 10, 25, 50, 100]"
        table-colspan="12"
        binary-state-sort
        row-key="name"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="_id" :props="props">{{ props.row._id }}</q-td>
            <q-td key="serviceName" :props="props">{{
              props.row.serviceName
            }}</q-td>
            <q-td key="source" :props="props">{{ props.row.source }}</q-td>
            <q-td key="message" :props="props">
              {{
                props.row.message && props.row.message.length
                  ? props.row.message.substr(0, 30) + "..."
                  : ""
              }}
              <q-popup-edit
                label-set="Copy"
                @click="copy(props.row.message)"
                v-if="props.row.message && props.row.message.length"
                v-model="props.row.message"
              >
                <q-editor
                  readonly
                  :definitions="{
                    copy: {
                      tip: 'Copy to Clipboard',
                      icon: 'fas-copy',
                      label: 'Copy',
                      handler: copy,
                    },
                  }"
                  :toolbar="[['copy']]"
                  v-model="props.row.message"
                  min-height="2rem"
                  autofocus
                  @keyup.enter.stop
                />
              </q-popup-edit>
            </q-td>
            <q-td key="createdDate" :props="props">{{
              props.row.createdDate
            }}</q-td>
            <q-td key="Level" :props="props">{{ props.row.level }}</q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  name: "PageIndex",
  data() {
    return {
      loading: false,
      pagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10,
      },
      searchBox: "",
      level: {
        label: "Any",
        value: "any",
      },
      lvlopt: [
        {
          label: "Any",
          value: "any",
        },
        {
          label: "Error",
          value: "error",
        },
        {
          label: "Info",
          value: "Info",
        },
      ],
      serviceName: {
        label: "Any",
        value: "any",
      },
      envType: "dev",
      options: [
        {
          label: "Any",
          value: "any",
        },
        {
          label: "Account Service",
          value: "account-service",
        },
        {
          label: "Billing Service",
          value: "billing-service",
        },
        {
          label: "Project Service",
          value: "project-service",
        },
        {
          label: "Support Service",
          value: "support-service",
        },
      ],
      data: [],
      columns: [
        {
          name: "_id",
          label: "ID",
          align: "left",
          field: (row) => row._id,
        },
        {
          name: "serviceName",
          label: "Service Name",
          align: "left",
          field: (row) => this.textUppercase(row.serviceName.replace("-", " ")),
        },
        {
          name: "source",
          label: "Source",
          align: "left",
          field: (row) => row.source,
        },
        {
          name: "message",
          label: "Log Message",
          align: "left",
          field: (row) => {
            return row.message && row.message.length
              ? row.message.substr(0, 30) + "..."
              : "";
          },
        },
        {
          name: "createdDate",
          label: "Date",
          align: "left",
          field: (row) => moment(row.createdDate).format("HH:mm:ss DD/MM/YY"),
        },
        {
          name: "Level",
          label: "Level",
          align: "left",
          field: (row) => row.level,
        },
      ],
    };
  },
  mounted() {
    // this.getTable(1);
  },
  methods: {
    textUppercase(text) {
      return text
        .split(" ")
        .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
        .join(" ");
    },
    downloadData() {
      let url = `http://localhost:3005/downloadCSV?serviceType=${this.serviceName.value}&level=${this.level.value}&env=${this.envType}`;

      window.open(url, "_self");
    },
    copy(text, t2) {
      console.log({ text, t2 });
      // copyToClipboard(text)
      //   .then(() => {
      //     // success!
      //     console.log('Success');
      //   })
      //   .catch(() => {
      //     // fail
      //     console.log('Fail');
      //   })
    },
    pageChanged(props) {
      if (props.pagination) {
        let { page, rowsPerPage } = props.pagination;
        this.getTable(page, rowsPerPage);
      } else {
        this.getTable(1, 10);
      }
    },
    async getTable(page = 1, len = 10) {
      // Api Call
      this.loading = true;
      this.$q.loading.show();
      let url = `http://localhost:3005/getLog?env=${this.envType}&start=${page}&length=${len}&serviceType=${this.serviceName.value}&level=${this.level.value}`;
      let response = await axios.get(url);
      this.$q.loading.hide();
      this.loading = false;
      this.pagination.rowsNumber = response.data.recordsTotal;
      this.pagination.page = page;
      this.pagination.rowsPerPage = len;
      this.data.splice(0, this.data.length, ...response.data.data);
    },
  },
};
</script>

<style>
.table-card {
  min-height: calc(100vh - 90px);
  width: 100%;
  max-width: 1200px;
}
</style>
