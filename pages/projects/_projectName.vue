<template>
  <div class="columns">
    <div class="column is-6">
      <v-jsoneditor
        v-model="code"
        :plus="false"
        height="400px"
        @error="onError"
        :options="options"
      />
    </div>

    <div class="column is-6">
      <prism-editor
        class="my-editor"
        v-model="jsonString"
        :highlight="highlighter"
        line-numbers
        readonly
        :tabsize="4"
      ></prism-editor>
    </div>
  </div>
</template>
<script>
import VJsoneditor from "v-jsoneditor";
import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css"; // import the styles 

import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-json";
import "prismjs/themes/prism-tomorrow.css"; // import syntax highlighti

const MODE = null
export default {
  layout: "nav",
  components: {
    VJsoneditor,
    PrismEditor,

  },
  watch: {
    code(val) {
      this.jsonString = JSON.stringify({...this.code},null, "\t");
    },
  },
  data() {
    return {
      jsonString: null,
      lang: "json",
      code: {
        hello: "vue",
      },
       options: {
        mode: MODE,
        onEditable: function (node) {
          console.log("node", node);
          return true;
        },
        theme: "ace/theme/tomorrow_night_bright",
      },
      mode: MODE,
    };
  },
  methods: {
    onError() {
      console.log("error");
    },
    highlighter(code) {
      return highlight(code, languages.json); // languages.<insert language> to return html with markup
    },
  },
  created() {
    this.jsonString = JSON.stringify(this.code,null, "\t");
  },

};
</script>

<style lang="scss" scoped>
.my-editor {
  /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
  background: #2d2d2d;
  color: #ccc;

  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

/* optional class for removing the outline */
.prism-editor__textarea:focus {
  outline: none;
}
</style>
