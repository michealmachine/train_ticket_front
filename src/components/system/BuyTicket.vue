<template>
  <div>
    <el-select v-model="startNode" placeholder="请选择起始站">
      <el-option
          v-for="item in nodeList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
      ></el-option>
    </el-select>
    <el-select v-model="endNode" placeholder="请选择终点站">
      <el-option
          v-for="item in nodeList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
      ></el-option>
    </el-select>
    <el-button @click="findTrains">查找</el-button>
    <el-table :data="trainList">
      <el-table-column prop="number" label="车次"></el-table-column>
      <el-table-column prop="totalPrice" label="总价"></el-table-column>
      <el-table-column type="expand">
        <template #default="props">
          <el-table :data="props.row.routes" style="width: 100%">
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column label="起始站">
              <template #default="scope">
                {{ idToName(scope.row.startStationId) }}
              </template>
            </el-table-column>
            <el-table-column label="终点站">
              <template #default="scope">
                {{ idToName(scope.row.endStationId) }}
              </template>
            </el-table-column>
            <el-table-column prop="startTime" label="开始时间"></el-table-column>
            <el-table-column prop="endTime" label="结束时间"></el-table-column>
            <el-table-column prop="price" label="价格"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="buy(scope.row)">购买</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="addToCart(scope.row)">加入购物车</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { query } from "@/apis/node";
import { findTrainsBetweenStations } from "@/apis/trainNumber";
import { buyTicket as apiBuyTicket } from '@/apis/tickets';
import { ElMessage } from 'element-plus';
import { provinceStore } from "@/stores/province.store"
import { apiAddToCart } from "@/apis/cart";

interface Node {
  id: number;
  name: string;
}

const nodeList = ref<Node[]>([]);
const trainList = ref<any[]>([]);
const startNode = ref<number | null>(null);
const endNode = ref<number | null>(null);

const initNodeList = async () => {
  const res = await query();
  nodeList.value = res.data.data || [];
};

const findTrains = async () => {
    if (startNode.value === null || endNode.value === null) {
      ElMessage({
        message: '请先选择起始站和终点站',
        type: 'warning'
      });
      return;
    }
    const res = await findTrainsBetweenStations(startNode.value, endNode.value);
    const trains = res.data.data || [];
    trains.forEach(train => {
      train.totalPrice = train.routes.reduce((acc, route) => acc + route.price, 0);
    });
    trainList.value = trains;
  };

const idToName = (id: number) => {
  const found = provinceStore.find((item: any) => item.ProID === id);
  return found ? found.name : '未知';
};

const buy = async (row: any) => {
  if (startNode.value === null || endNode.value === null) {
    ElMessage({
      message: '请先选择起始站和终点站',
      type: 'warning'
    });
    return;
  }
  const res = await apiBuyTicket(row.number, startNode.value, endNode.value);
  
  ElMessage({
    message: res.data.data,
    type: 'success'
  });
};
const addToCart = async (row: TrainNumber) => {
  if (startNode.value === null || endNode.value === null) {
    ElMessage({
      message: '请先选择起始站和终点站',
      type: 'warning'
    });
    return;
  }
  const currentTime = new Date().getTime(); // 当前时间戳（毫秒）
  const randomNum = Math.floor(Math.random() * 1000); // 0-999的随机数
  const combined = currentTime % 1000000 * 1000 + randomNum; // 这样做是为了让这个数字尽量唯一，但还是有冲突的可能性

  const uniqueTicketId = combined % 2147483647; // 保证不超过Integer最大值
  const ticket = {
    id:uniqueTicketId,
    trainId: row.number,
    startId: startNode.value,
    endId: endNode.value,
    price: row.totalPrice // 请根据你的逻辑调整这个字段
  };
  const res = await apiAddToCart(ticket);
  ElMessage({
    message: res.data.data,
    type: "success"
  });
};

initNodeList();
</script>