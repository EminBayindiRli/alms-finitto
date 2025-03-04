<template>
  <Bar
    :chart-options="chartOptions"
    :chart-data="chartData"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
)

const props = defineProps<{
  data: Array<{ name: string; value: number }>
}>()

const chartData = computed(() => ({
  labels: props.data.map(item => item.name),
  datasets: [
    {
      label: 'Performans',
      data: props.data.map(item => item.value),
      backgroundColor: '#10B981',
      borderColor: '#059669',
      borderWidth: 1
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function(context: any) {
          return `Performans: ${context.raw}%`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: function(value: any) {
          return value + '%'
        }
      }
    }
  }
}</script>
