<template>
  <div>
    <el-table :data="cartList">
      <el-table-column prop="trainId" label="车次"></el-table-column>
      <el-table-column label="起始站" prop="startName"></el-table-column>
      <el-table-column label="终点站" prop="endName"></el-table-column>
      <el-table-column label="价格" prop="price"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="remove(scope.row.id)">移除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="购买">
        <template #default="scope">
          <el-button @click="buyTicket(scope.row)">购买</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { getCart, removeFromCart } from "@/apis/cart";
import { provinceStore } from "@/stores/province.store";
import { buyTicket as apiBuyTicket } from "@/apis/tickets";

interface Ticket {
  id: number;
  trainId: number;
  startId: number;
  endId: number;
  price: number;
  startName?: string;  // 新字段
  endName?: string;    // 新字段
}

const cartList = ref<Ticket[]>([]);

const buyTicket = async (row: Ticket) => {
  const res = await apiBuyTicket(row.trainId, row.startId, row.endId);  // 使用原始 id
  remove(row.id);
  ElMessage({
    message: res.data.data,
    type: 'success'
  });
};

const initCartList = async () => {
  const res = await getCart();
  const rawCartList = res.data.data || [];

  cartList.value = rawCartList.map((ticket: Ticket) => {
    return {
      ...ticket,
      startName: idToProvinceName(ticket.startId),  // 使用转换后的名称
      endName: idToProvinceName(ticket.endId)      // 使用转换后的名称
    };
  });
};

const idToProvinceName = (id: number) => {
  const found = provinceStore.find((item: any) => item.ProID === id);
  return found ? found.name : '未知';
};

const remove = async (id: number) => {
  const res = await removeFromCart(id);
  ElMessage({
    message: res.data.data,
    type: 'success'
  });
  initCartList();
};

initCartList();
</script>