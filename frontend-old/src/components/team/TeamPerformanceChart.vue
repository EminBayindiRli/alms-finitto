<template>
  <div class="bg-white p-4 rounded-lg shadow">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Takım Performansı</h3>
    <div class="h-64">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps<{
  data?: Array<{date: string, performance: number}>
}>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

const createChart = () => {
  if (!chartCanvas.value) return

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  // Prop'tan gelen veriyi kullan veya veri yoksa rastgele veri üret
  const chartData = props.data && props.data.length > 0 
    ? props.data.map(item => item.performance) 
    : Array.from({ length: 12 }, () => Math.floor(Math.random() * 100))
    
  const labels = props.data && props.data.length > 0
    ? props.data.map(item => {
        // date string formatı "YYYY-MM-DD" veya benzeri bir format olabilir
        // gerekirse uygun formata dönüştürün
        return item.date
      })
    : ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Performans',
          data: chartData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 25
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  })
}

const updateChart = () => {
  if (chart) {
    chart.destroy()
  }
  createChart()
}

watch(() => props.data, () => {
  updateChart()
}, { deep: true })

onMounted(() => {
  createChart()
})
</script>
