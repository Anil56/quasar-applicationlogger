<template>
  <q-card class="table-card q-mt-md q-mb-md">
    <div class="q-pa-md">
      <q-list bordered class="rounded-borders">
        <q-expansion-item expand-separator expand-icon-toggle default-opened>
          <template v-slot:header>
            <q-item-section avatar>
              <q-icon name="perm_identity" />
            </q-item-section>
            <q-item-section>
              Account Registation Zuora API Calls</q-item-section
            >
            <q-item-section side>
              <div class="row items-center">
                <q-btn
                  round
                  :color="
                    !moduleStatus.includes('accountRegistration')
                      ? 'positive'
                      : 'negative'
                  "
                  :icon="
                    !moduleStatus.includes('accountRegistration')
                      ? 'play_arrow'
                      : 'stop'
                  "
                  @click.prevent="testModule('accountRegistration')"
                />
              </div>
            </q-item-section>
          </template>
          <q-card>
            <q-card-section>
              <q-expansion-item
                v-for="(api, index) in list.accountRegistration"
                :key="index"
                :header-class="{
                  'bg-grey-3': api.status == 'untouch',
                  'bg-green-3': api.status == 'success',
                  'bg-red-3': api.status == 'fail',
                  'bg-blue-3': api.status == 'pending',
                }"
                expand-icon-toggle
                :label="api.title"
                :caption="api.method"
              >
                <template v-slot:header>
                  <q-item-section> {{ api.title }}</q-item-section>
                  <q-item-section side>
                    <div class="row items-center">
                      <q-btn
                        round
                        :color="
                          api.status != 'pending' ? 'positive' : 'negative'
                        "
                        :icon="api.status != 'pending' ? 'play_arrow' : 'stop'"
                        @click.prevent="testAPI(api, index)"
                      />
                    </div>
                  </q-item-section>
                </template>
                <q-card class="my-card">
                  <q-card-section>
                    <div class="row">
                      <div class="col-12">
                        <p class="q-my-md">
                          <strong>URL:</strong> &nbsp;{{ api.url }}
                        </p>
                      </div>

                      <div class="col-6">
                        <p>
                          <strong>Description:</strong> <br />
                          <em class="text-justify">
                            {{ api.description }}
                          </em>
                        </p>
                      </div>
                      <div class="col-6 q-pl-lg">
                        <strong>Service:</strong>
                        {{ api.calledAtLocations[0].service }} <br />
                        <strong>File Name:</strong>
                        {{ api.calledAtLocations[0].fileName }} <br />
                        <strong>Function Name:</strong>
                        {{ api.calledAtLocations[0].functionName }} <br />
                        <q-btn
                          color="primary"
                          v-if="api.calledAtLocations.length > 1"
                          flat
                          label="+1"
                        />
                      </div>
                      <div class="col-12">
                        <q-btn
                          :color="
                            api.status != 'pending' ? 'positive' : 'negative'
                          "
                          :icon="
                            api.status != 'pending' ? 'play_arrow' : 'stop'
                          "
                          :label="api.status != 'pending' ? 'Start' : 'Stop'"
                          @click="testAPI(api, index)"
                        />
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>
  </q-card>
</template>

<script>
import APILIST from "../constant/zuora-api.json";
import axios from "axios";
export default {
  name: "Zuora",
  data() {
    return {
      list: {
        accountRegistration: [],
      },
      calledList: [],
      token: "ad90dea9c75646029ff090c9ec0fc7d3",
    };
  },
  mounted() {
    for (let index = 0; index < APILIST.length; index++) {
      let api = APILIST[index];
      api.status = "untouch";
      this.$nextTick(() => {
        this.list[api.type].push(api);
      });
    }
  },
  computed: {
    moduleStatus() {
      var pendingModules = [];
      for (const key of Object.keys(this.list)) {
        for (let index = 0; index < this.list[key].length; index++) {
          const item = this.list[key][index];
          if (item.status == "pending" && !pendingModules.includes(key)) {
            pendingModules.push(key);
          }
        }
      }
      return pendingModules;
    },
  },
  methods: {
    testModule(modname) {
      this.list[modname].map((api, index) => {
        this.testAPI(api, index);
      });
    },
    async testAPI(api, index) {
      let calledindex = this.calledList.indexOf(api.url);
      console.log({ list: [...this.calledList], calledindex });
      if (this.calledList.includes(api.url)) {
        this.calledList.splice(calledindex, 1);
        this.list[api.type][index].cancelRequest.cancel();
        this.list[api.type][index].status = "untouch";
        return;
      }
      this.calledList.push(api.url);

      this.$nextTick(() => {
        this.list[api.type][index].status = "pending";
      });
      let CancelToken = axios.CancelToken;
      let source = CancelToken.source();
      let options = {
        url: api.url,
        method: api.method,
        cancelToken: source.token,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      };
      if (api.method == "POST") {
        options.body = api.payload;
      }
      this.list[api.type][index].cancelRequest = source;
      try {
        let request = await axios(options);
        if (request) {
          this.$nextTick(() => {
            if (request.status >= 200 && request.status < 400) {
              this.list[api.type][index].status = "success";
            } else {
              this.list[api.type][index].status = "fail";
            }
          });
          let calledindex = this.calledList.indexOf(api.url);
          this.calledList.splice(calledindex, 1);
        }
      } catch (error) {
        if (error.isAxiosError) {
          let calledindex = this.calledList.indexOf(api.url);
          this.calledList.splice(calledindex, 1);
          this.list[api.type][index].cancelRequest.cancel();
          this.list[api.type][index].status = "fail";
        }
      }
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