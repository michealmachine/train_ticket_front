<template>
  <div>
    <h2>车次座位管理</h2>
    <el-button @click="toggleAddDialog">添加 TrainNumberMeta</el-button>

    <!-- 添加 TrainNumberMeta 的弹窗 -->
    <el-dialog v-model="showAddDialog" title="添加 TrainNumberMeta">
      <el-form :model="trainNumberMetaToAdd">
        <!-- 选择TrainNumber的ID的下拉框 -->
        <el-form-item label="TrainNumber ID">
          <el-select v-model="trainNumberMetaToAdd.id" placeholder="选择TrainNumber的ID">
            <el-option v-for="option in idOptions" :key="option" :label="option" :value="option"></el-option>
          </el-select>
        </el-form-item>

        <!-- 输入票数的输入框 -->
        <el-form-item label="票数">
          <el-input v-model="trainNumberMetaToAdd.availableSeats" placeholder="输入票数"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="saveMeta">保存</el-button>
      </div>
    </el-dialog>

    <!-- 显示 TrainNumberMeta 的表格 -->
    <el-table :data="trainNumberMetas" style="width: 100%">
      <el-table-column prop="id" label="车次ID"></el-table-column>
      <el-table-column prop="availableSeats" label="可用座位"></el-table-column>
      <el-table-column label="起始站" :formatter="getStartStation"></el-table-column>
      <el-table-column label="终止站" :formatter="getEndStation"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="mini" @click="deleteMeta(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getTrainNumbers } from '@/apis/trainNumber';
import { getTrainNumberMetas, saveTrainNumberMeta, deleteTrainNumberMeta } from '@/apis/trainNumberMeta';
import {province} from "@/stores/province.store";
const provinceStore=ref<any>(province)

interface TrainNumber {
  number: number;
  routes: RailNode[];
}

interface TrainNumberMeta {
  id: number;
  availableSeats: number;
}

interface RailNode {
  id: number;
  startTime: Date;
  startStationId: number;
  endTime: Date;
  endStationId: number;
  price: number;
}

interface TrainNumberMetaToAdd {
  id: number
  availableSeats: number
}
const trainNumberMetas = ref<TrainNumberMeta[]>([]);
const trainNumbers = ref<TrainNumber[]>([]);
const showAddDialog = ref(false);
const trainNumberMetaToAdd = ref<TrainNumberMetaToAdd>({
  id: null,
  availableSeats: null
});

const toggleAddDialog = () => {
  showAddDialog.value = !showAddDialog.value;
}

onMounted(async () => {
  try {
    const trainNumbersResponse = await getTrainNumbers(1, 100);
    trainNumbers.value = trainNumbersResponse.data.data.records;
    const metasResponse = await getTrainNumberMetas(1, 100);
    trainNumberMetas.value = metasResponse.data.data.records;
  } catch (error) {
    ElMessage.error("数据加载失败");
  }
});

const getStartStation = (row: TrainNumberMeta) => {
  const trainNumber = trainNumbers.value.find(train => train.number === row.id);
  const startStationId = trainNumber?.routes[0].startStationId;

  // 省份或站点数据查找，假设是一个数组 provinceStore
  const found = provinceStore.value.find(province => province.ProID === startStationId);

  return found ? found.name : '-';
}

const getEndStation = (row: TrainNumberMeta) => {
  const trainNumber = trainNumbers.value.find(train => train.number === row.id);
  const endStationId = trainNumber?.routes[trainNumber.routes.length - 1].endStationId;

  const found = provinceStore.value.find(province => province.ProID === endStationId);
  return found ? found.name : '-';
}

const saveMeta = async () => {
  try {
    await saveTrainNumberMeta(trainNumberMetaToAdd.value);
    ElMessage.success("保存成功");
    showAddDialog.value = false;
    loadData();  // 刷新数据
  } catch (error) {
    ElMessage.error("保存失败");
  }
}

const deleteMeta = async (id: number) => {
  try {
    await deleteTrainNumberMeta(id);
    ElMessage.success("删除成功");
    trainNumberMetas.value = trainNumberMetas.value.filter(meta => meta.id !== id);
  } catch (error) {
    ElMessage.error("删除失败");
  }
}

const idOptions = ref<number[]>([]);

onMounted(async () => {
  const trainNumbersResponse = await getTrainNumbers(1, 100);
  idOptions.value = trainNumbersResponse.data.data.records.map(record => record.number);
  loadData()
});

const loadData = async () => {
  try {
    const trainNumbersResponse = await getTrainNumbers(1, 100);
    trainNumbers.value = trainNumbersResponse.data.data.records;
    const metasResponse = await getTrainNumberMetas(1, 100);
    trainNumberMetas.value = metasResponse.data.data.records;
  } catch (error) {
    ElMessage.error("数据加载失败");
  }
};
</script>

<style scoped>
/* 这里可以添加你的样式 */
</style>