<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="isScrollEnabled"
    chartId="isScrollEnabled-chart"
    :code="data.js"/>
</template>