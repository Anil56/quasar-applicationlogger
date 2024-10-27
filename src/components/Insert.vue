<template>
  <div class="row q-pa-md">
    <div class="col-5 q-pa-sm">
      <q-input
        filled
        stack-label
        outlined
        clearable
        ref="key"
        v-model="keyName"
        :rules="[checkKeyExists]"
        type="text"
        :error-message="keyNameErrorMsg"
        :error="keyNameError"
        @input="keyNameError = false"
        label="KEY NAME"
      />
    </div>
    <div class="col-1 q-pa-sm">
      <q-checkbox
        v-model="updateKeyValues"
        @input="checkKeyExists(keyName, true)"
        size="50px"
        label="Update"
      />
    </div>
    <div class="col-2 offset-1 q-pa-md">
      <q-input v-model="pbi" outlined dense type="text" label="PBI" />
    </div>
    <div class="col-2 q-pa-md">
      <q-input v-model="version" outlined dense type="text" label="VERSION" />
    </div>
    <div class="col-12"></div>
    <div class="row col-6 q-pa-sm" v-for="(lang, i) in languages" :key="i">
      <div class="col-10">
        <q-input
          stack-label
          outlined
          :clearable="!isUpdating"
          v-model="lang.value"
          @input="lang.error = false"
          :prefix="lang.prefix ? lang.pValue : ''"
          :readonly="lang.prefix"
          :error-message="'Please fill value.'"
          :error="lang.error && !lang.prefix"
          type="text"
          :label="lang.label"
        />
      </div>
      <div class="col-2 q-pa-sm" v-if="lang.changePrefix && !isUpdating">
        <q-checkbox
          v-model="lang.prefix"
          @input="changeForm(null, true)"
          label="Prefix"
        />
      </div>
    </div>
    <div class="col-4 q-pl-md offset-4 q-mt-md">
      <q-btn
        color="secondary"
        size="lg"
        class="full-width"
        icon="save"
        label="Submit"
        @click="save"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      isUpdating: false,
      keyName: "",
      keyNameError: false,
      pbi: "",
      version: "",
      updateKeyValues: false,
      keyNameErrorMsg: "",
      languages: {
        english: {
          // English - en-us
          label: "US English",
          value: "",
          error: false,
          prefix: false,
          changePrefix: false,
        },
        englishUK: {
          // English - en-gb
          label: "UK English",
          value: "",
          prefix: false,
          error: false,
          changePrefix: false,
        },
        polish: {
          // Polish - pl-pl
          label: "Polish",
          name: "polish",
          value: "",
          pValue: "pl-",
          prefix: true,
          error: false,
          changePrefix: true,
        },
        spanish: {
          // Spanish - es-es
          label: "Spanish",
          value: "",
          prefix: true,
          pValue: "es-",
          error: false,
          changePrefix: true,
        },
        deutsch: {
          // German - de-de
          label: "Deutsch",
          value: "",
          prefix: true,
          pValue: "de-",
          error: false,
          changePrefix: true,
        },
        french: {
          // French - fr-fr
          label: "French",
          value: "",
          prefix: true,
          pValue: "fr-",
          error: false,
          changePrefix: true,
        },
        italian: {
          // Italian - it-it
          label: "Italian",
          value: "",
          prefix: true,
          pValue: "it-",
          error: false,
          changePrefix: true,
        },
        netherland: {
          // Netherland - nl-nl
          label: "Netherland",
          value: "",
          prefix: true,
          pValue: "nl-",
          error: false,
          changePrefix: true,
        },
      },
      existingKey: {
        key: "",
        values: [],
      },
    };
  },
  mounted() {
    if (this.$route.params.key) {
      this.keyName = this.$route.params.key;
      this.updateKeyValues = true;
    }
  },
  props: ["collectionName"],
  watch: {
    "languages.english": {
      handler: function (newObj) {
        this.changeForm(newObj);
      },
      deep: true,
    },
  },
  methods: {
    async checkKeyExists(val, reset = false) {
      if (!val) return "";
      let url = `http://localhost:3005/language-constant/search?type=key&value=${val}&collection=${this.collectionName}`;
      let response = await axios.get(url);
      if (this.updateKeyValues && response.data.status == true) {
        this.existingKey.key = response.data.data[0].key;
        this.existingKey.values = response.data.data;
        await this.fillForm(response.data.data);
      } else {
        await this.resetForm();
      }
      if (reset) {
        this.$refs.key.resetValidation();
      }
      this.keyNameErrorMsg =
        !this.updateKeyValues && response.data.status
          ? "Key already exists!"
          : !val
          ? "Please fill value"
          : !/^[a-zA-Z_0-9]*$/.test(val)
          ? "Invalid format"
          : "";
      return !this.keyNameErrorMsg;
    },
    resetForm() {
      this.languages = {
        english: {
          // English - en-us
          label: "US English",
          value: "",
          error: false,
          prefix: false,
          changePrefix: false,
        },
        englishUK: {
          // English - en-gb
          label: "UK English",
          value: "",
          prefix: false,
          error: false,
          changePrefix: false,
        },
        polish: {
          // Polish - pl-pl
          label: "Polish",
          name: "polish",
          value: "",
          pValue: "pl-",
          prefix: true,
          error: false,
          changePrefix: true,
        },
        spanish: {
          // Spanish - es-es
          label: "Spanish",
          value: "",
          prefix: true,
          pValue: "es-",
          error: false,
          changePrefix: true,
        },
        deutsch: {
          // German - de-de
          label: "Deutsch",
          value: "",
          prefix: true,
          pValue: "de-",
          error: false,
          changePrefix: true,
        },
        french: {
          // French - fr-fr
          label: "French",
          value: "",
          prefix: true,
          pValue: "fr-",
          error: false,
          changePrefix: true,
        },
        italian: {
          // Italian - it-it
          label: "Italian",
          value: "",
          prefix: true,
          pValue: "it-",
          error: false,
          changePrefix: true,
        },
        netherland: {
          // Netherland - nl-nl
          label: "Netherland",
          value: "",
          prefix: true,
          pValue: "nl-",
          error: false,
          changePrefix: true,
        },
      };
    },
    async fillForm(data, prefix = true) {
      this.pbi = data[0].pbi;
      this.version = data[0].version;
      for (const key of Object.keys(this.languages)) {
        var obj = this.languages[key];
        data.forEach((knos) => {
          if (knos.locale == "en-us" || knos.locale == "en-gb") {
            if (obj.changePrefix === false) {
              obj.value = knos.value;
            }
            if (knos.pbi) {
              this.pbi = knos.pbi;
            }
            return;
          } else if (obj.pValue && knos.locale.match(obj.pValue)) {
            obj.value = knos.value;
            return;
          }
        });
        if (prefix) {
          obj.prefix = false;
        }
      }
    },
    changeForm(newObj = null, force = false) {
      if (this.updateKeyValues && !force) {
        return;
      }
      var usvalue = newObj ? newObj.value : this.languages.english.value;
      for (var key of Object.keys(this.languages)) {
        const obj = this.languages[key];
        if (force && this.updateKeyValues && !obj.changePrefix) {
          this.fillForm(this.existingKey.values, null);
        } else if (obj.changePrefix && obj.prefix) {
          this.languages[key] = obj;
          this.languages[key].value = usvalue;
          this.languages[key].error = false;
        }
      }
    },
    validateForm() {
      let success = true;
      if (!this.keyName || this.keyNameErrorMsg != "") {
        this.keyNameError = true;
        success = false;
      }
      for (var key of Object.keys(this.languages)) {
        const obj = this.languages[key];
        if (!obj.value) {
          this.languages[key].error = true;
          success = false;
        }
      }
      return success;
    },
    save: async function () {
      let validated = await this.validateForm();
      if (validated) {
        let payload = await this.makePayload();
        let url = `http://localhost:3005/language-constant/insert`;
        this.$q.loading.show();
        let response = await axios.post(url, payload);
        if (response.data.status == false) {
          this.$q.notify({
            type: "negative",
            message: response.data.message,
          });
        } else {
          this.$q.notify({
            type: "positive",
            message: response.data.message,
          });
        }
        this.$q.loading.hide();
      }
    },
    makePayload: function () {
      let payload = {
        keyName: this.keyName,
        pbi: this.pbi,
        version: this.version,
        prefixLanguages: [],
        collection: this.collectionName,
        values: {},
        update: this.updateKeyValues,
      };
      for (var key of Object.keys(this.languages)) {
        const obj = this.languages[key];
        payload.values[key] = obj.value;
        if (obj.prefix) {
          payload.prefixLanguages.push(key);
        }
      }
      return payload;
    },
  },
};
</script>
