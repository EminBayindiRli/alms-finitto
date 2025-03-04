<template>
  <Line
    :chart-options="chartOptions"
    :chart-data="chartData"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
} from 'chart.js'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale
)

const props = defineProps<{
  data: Array<{
    date: Date;
    performance: number;
    efficiency: number;
    satisfaction: number;
  }>;
  metric: string;
}>()

const chartData = computed(() => ({
  labels: props.data.map(item => 
    format(new Date(item.date), 'MMM', { locale: tr })
  ),
  datasets: [
    {
      label: getMetricLabel(props.metric),
      data: props.data.map(item => item[props.metric as keyof typeof item]),
      borderColor: getMetricColor(props.metric),
      backgroundColor: getMetricColor(props.metric),
      tension: 0.4
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
          return `${context.dataset.label}: ${context.raw}%`
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
}

function getMetricLabel(metric: string) {
  const labels = {
    performance: 'Performans',
    efficiency: 'Verimlilik',
    satisfaction: 'Memnuniyet'
  }
  return labels[metric as keyof typeof labels]
}

function getMetricColor(metric: string) {
  const colors = {
    performance: '#3B82F6',
    efficiency: '#10B981',
    satisfaction: '#F59E0B'
  }
  return colors[metric as keyof typeof colors]
}</script>
