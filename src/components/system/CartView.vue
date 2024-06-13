<template>
  <div>
    <el-table :data="ticketList">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="trainId" label="车次"></el-table-column>
      <el-table-column prop="startName" label="起始站"></el-table-column>
      <el-table-column prop="endName" label="终点站"></el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
    >
    </el-pagination>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getTicketPage } from '@/apis/tickets';
import { provinceStore } from "@/stores/province.store";

interface Ticket {
  id: number;
  trainId: number;
  startId: number;
  endId: number;
  price: number;
  startName?: string;
  endName?: string;
}

const ticketList = ref<Ticket[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const fetchData = async () => {
  const res = await getTicketPage(currentPage.value, pageSize.value);
  if (res.data && res.data.data) {
    ticketList.value = res.data.data.records.map((ticket: Ticket) => {
      return {
        ...ticket,
        startName: idToProvinceName(ticket.startId),
        endName: idToProvinceName(ticket.endId)
      };
    });
    total.value = res.data.data.total;
  }
};

const idToProvinceName = (id: number) => {
  const found = provinceStore.find((item: any) => item.ProID === id);
  return found ? found.name : '未知';
};

const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize;
  fetchData();
};

const handleCurrentChange = (newPage: number) => {
  currentPage.value = newPage;
  fetchData();
};

onMounted(() => {
  fetchData();
});
</script>
