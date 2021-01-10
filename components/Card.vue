<template>
  <div class="column">
    <div class="card" style="min-height:200px">
      <header class="card-header">
        <p class="card-header-title has-text-grey">
          {{ title }}
        </p>
        <div href="#" class="card-header-icon">
      <span class="icon">
        <i class="github"></i>
      </span>
        </div>
      </header>
      <div class="card-content">
        <div class="content">
          <slot name="card-content"></slot>

        </div>
      </div>
      <footer class="card-footer">
        <slot name="card-footer-content"/>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    }
    // icon: {
    //   type: String,
    //   required: true
    // }
  }
}
</script>
