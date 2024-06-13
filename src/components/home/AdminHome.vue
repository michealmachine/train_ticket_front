<template>
  <div>
    <!-- 柱状图位置 -->
    <div ref="barChartRef" style="width: 600px; height: 400px; margin-top: 30px;"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { getAllTickets } from '@/apis/tickets';
import 'echarts/lib/component/grid';
import { GridComponent } from 'echarts/components';
echarts.use([GridComponent]);
echarts.use([BarChart, CanvasRenderer]);

const barChartRef = ref<HTMLElement | null>(null);

// 初始化柱状图数据
onMounted(async () => {
  const res = await getAllTickets(1, 100);  // 根据你的分页接口获取前100个票
  const tickets = res.data.data.records;

  // 对票按照 TrainId 进行统计
  const countMap: { [key: number]: number } = {};
  tickets.forEach(ticket => {
    if (countMap[ticket.trainId]) {
      countMap[ticket.trainId] += 1;
    } else {
      countMap[ticket.trainId] = 1;
    }
  });

  const trainIds = Object.keys(countMap).map(Number);
  const counts = Object.values(countMap);

  await nextTick();

  const barChartInstance = echarts.init(barChartRef.value);
  barChartInstance.setOption({
    title: {
      text: '热门火车路线'
    },
    xAxis: {
      type: 'category',
      data: trainIds,
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: counts,
      type: 'bar',
    }]
  });
});
</script>

<style scoped>
/* 你的样式 */
</style>
