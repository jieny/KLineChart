<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setLocale-extension"
    chartId="setLocale-extension-chart"
    :code="data.js"/>
</template>