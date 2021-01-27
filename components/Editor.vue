<template>
  <div class="columns is-multiline">
    <div class="column is-12">
      <b-switch v-model="isRightEditorEditable">
        Editable in the right editor
      </b-switch>
      <b-notification v-if="error"
                      type="is-danger"
                      aria-close-label="Close notification"
                      role="alert" :closable="false">
        Error in the right Editor
        <p> {{ error }}</p>
      </b-notification>

    </div>
    <div class="column is-6">
      <v-jsoneditor
        v-model="code"
        :plus="false"

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
        :readonly="!isRightEditorEditable"
        :tab-size="4"
      ></prism-editor>
    </div>
  </div>
</template>
<script>
import VJsoneditor from "v-jsoneditor";
import {PrismEditor} from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css"; // import the styles
import {highlight, languages} from "prismjs/components/prism-core";
import "prismjs/components/prism-json";
import "prismjs/themes/prism-tomorrow.css";
import {showToast} from "@/services/utils"; // import syntax highlighti

const MODE = null
export default {
  layout: "nav",
  components: {
    VJsoneditor,
    PrismEditor,
  },
  props: {
    propCode: [Object, Array]
  },
  watch: {
    code(newVal) {
      this.jsonString = JSON.stringify({...newVal}, null, "\t");
      this.$emit('on-change-code', newVal);
    },
    jsonString(newVal) {
      try {
        this.code = JSON.parse(newVal)
        this.error = null;
      } catch (err) {
        this.error = err.toString()
      }
    },
    isRightEditorEditable(newVal) {
      if (newVal) {
        showToast('Right Editor is editable', 'is-primary', 'is-bottom')
      } else {
        showToast('Right Editor is read only', 'is-primary', 'is-bottom')
      }
    },
  },
  data() {
    return {
      error: null,
      jsonString: null,
      isRightEditorEditable: false,
      lang: "json",
      code: {
        hello: "vue",
      },
      options: {
        mode: MODE,
        onEditable: function (node) {
          // console.log("node")
          return true;
        },
        theme: "ace/theme/tomorrow_night_bright",
      },
      mode: MODE,
    };
  },
  methods: {
    onError(err) {
      console.log("error with editor")
      console.log(err);
    },
    highlighter(code) {
      return highlight(code, languages.json); // languages.<insert language> to return html with markup
    },
  },
  created() {
    this.code = {...this.propCode};
    this.jsonString = JSON.stringify(this.code, null, "\t");
  },

};
</script>

<style lang="scss" scoped>
$editorHeight: 400px;
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

.jsoneditor-container.min-box {
  height: $editorHeight;
}

div.prism-editor-wrapper {
  height: $editorHeight;
  overflow-y: auto;

  div.prism-editor__container {
    .prism-editor__editor {
      .number {
        background-color: red !important;
      }
    }
  }

}


</style>

<style lang="scss">
div.prism-editor-wrapper {
  div.prism-editor__container {
    .prism-editor__editor {
      .number {
        background-color: transparent;
        padding: 0px;
        font-size: inherit;
        height: 0;
        vertical-align: inherit;
        justify-content: inherit;
        margin-right: 0;
        min-width: 0;
        text-align: left;

      }
    }
  }
}
</style>
