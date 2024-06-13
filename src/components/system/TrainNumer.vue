<template>
  <div>
    <h2>车次管理</h2>
    <el-button @click="showDialog">添加 RailNode</el-button>
    <el-dialog v-model="showAddDialog" title="添加 RailNode" @close="resetDialogData"  width="1000px" >
      <div class="table-header">
        <span>车次</span>
        <span>起始时间</span>
        <span>起始车站</span>
        <span>结束时间</span>
        <span>结束车站</span>
        <span>价格</span>
      </div>
      <div v-for="(node, index) in railNodes" :key="index" class="rail-node-row">
        <el-input
            v-model="node.id"
            placeholder="输入ID"
            :disabled="index !== 0"
            :rules="[{ validator: validateId, trigger: 'blur' }]"
            class="rail-node-input rail-node-id"
        ></el-input>

        <el-date-picker v-model="node.startTime" type="datetime" placeholder="选择起始时间" class="rail-node-input"></el-date-picker>

        <el-select v-model="node.startStationId" placeholder="选择开始站点ID" class="rail-node-input">
          <el-option v-for="nodeOption in nodeOptions" :key="nodeOption.id" :label="nodeOption.name" :value="nodeOption.id"></el-option>
        </el-select>

        <el-date-picker v-model="node.endTime" type="datetime" placeholder="选择结束时间" class="rail-node-input rail-node-startTime"></el-date-picker>

        <el-select v-model="node.endStationId" placeholder="选择结束站点ID" class="rail-node-input">
          <el-option v-for="nodeOption in nodeOptions" :key="nodeOption.id" :label="nodeOption.name" :value="nodeOption.id"></el-option>
        </el-select>

        <el-input v-model="node.price" placeholder="价格" class="rail-node-input"></el-input>
        <el-button @click="removeNode(index)" class="rail-node-input">删除</el-button>
      </div>
      <el-button @click="addNode">新增 RailNode</el-button>
      <div slot="footer">
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="saveRailNodes">保存</el-button>
      </div>
    </el-dialog>
    <el-table :data="trainNumbers" style="width: 100%">
      <el-table-column type="expand">
        <template #default="props">
          <el-table :data="props.row.routes" style="width: 100%">
            <el-table-column prop="startTime" label="开始时间"></el-table-column>
            <el-table-column label="开始站点" :formatter="startStationFormatters"></el-table-column>
            <el-table-column prop="endTime" label="结束时间"></el-table-column>
            <el-table-column label="结束站点" :formatter="endStationFormatters"></el-table-column>
            <el-table-column prop="price" label="价格"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="number" label="车次ID"></el-table-column>
      <el-table-column label="起始站" :formatter="startStationFormatter"></el-table-column>
      <el-table-column label="终止站" :formatter="endStationFormatter"></el-table-column>
      <el-table-column prop="number" >
        <template #default="props">
          <el-button @click="deleteTrainNumbers(props.row.number)" size="mini" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref ,onMounted} from 'vue'
import { saveTrainNumber, getTrainNumbers, deleteTrainNumber } from '@/apis/trainNumber'
import { ElMessage,ElDialog } from 'element-plus'
import {query} from "@/apis/node";
import {province} from "@/stores/province.store";

interface RailNode {
  id: number | null;
  startTime: Date | null;
  startStationId: number | null;
  endTime: Date | null;
  endStationId: number | null;
  price: number | null;
}
interface Node {
  id: number;
  name: string;
}
interface TrainNumber {
  number: number;
  routes: RailNode[];
}
const idOptions = ref<number[]>([])
const nodeOptions = ref<Node[]>([])
const provinceStore=ref<any>(province)
const validateId = (rule, value, callback) => {
  if (idOptions.value.includes(value)) {
    return callback(new Error('ID 已经存在'));
  }
  if (railNodes.value[0] && value !== railNodes.value[0].id) {
    return callback(new Error('新加的输入栏的id必须与第一个id一致'));
  }
  callback();
};

const initOptions = async () => {
  try {
    const trainNumbersResponse = await getTrainNumbers(1, 100) // Adjust the page size as needed
    idOptions.value = trainNumbersResponse.data.data.records.map(record => record.number)

    const nodesResponse = await query()
    nodeOptions.value = nodesResponse.data.data

  } catch (error) {
    ElMessage.error("加载选项失败")
  }
}
const railNodes = ref<RailNode[]>([{
  id: null,
  startTime: null,
  startStationId: null,
  endTime: null,
  endStationId: null,
  price: null
}])
const showAddDialog = ref(false)
const resetDialogData = () => {
  railNodes.value = [{
    id: null,
    startTime: null,
    startStationId: null,
    endTime: null,
    endStationId: null,
    price: null
  }];
}
const deleteTrainNumbers = async (number: number) => {
  try {
    await deleteTrainNumber(number);
    ElMessage.success("车次删除成功");
    fetchData();
  } catch (error) {
    ElMessage.error("车次删除失败");
  }
}
const trainNumbers = ref<TrainNumber[]>([])

const addNode = () => {
  railNodes.value.push({
    id: null||railNodes.value[0]?.id,
    startTime: null,
    startStationId: null,
    endTime: null,
    endStationId: null,
    price: null
  })
}

const removeNode = (index: number) => {
  railNodes.value.splice(index, 1)
}

const saveRailNodes = async () => {
  try {
    await saveTrainNumber(railNodes.value);
    ElMessage.success("保存成功");
    fetchData();
    showAddDialog.value = false;
  } catch (error) {
    ElMessage.error("保存失败");
  }
}
/*const save = async () => {
  try {
    await saveTrainNumber(railNodes.value)
    ElMessage.success("保存成功")
    fetchData()
    showAddDialog.value = false
  } catch (error) {
    ElMessage.error("保存失败")
  }
}*/

const fetchData = async () => {
  try {
    const response = await getTrainNumbers(1, 10) // 示例参数
    trainNumbers.value = response.data.data.records
  } catch (error) {
    ElMessage.error("数据加载失败")
  }
}
const startStationFormatter = (row: TrainNumber) => {
  if (row.routes && row.routes.length > 0) {
    const province = provinceStore.value.find(p => p.ProID === row.routes[0]?.startStationId);
    return province ? province.name : "-";
  }
  return "-"
}
const startStationFormatters = (row: { startStationId: number }) => {
  const found = provinceStore.value.find(province => province.ProID === row.startStationId);
  return found ? found.name : '-';
}

const endStationFormatters = (row: { endStationId: number }) => {
  const found = provinceStore.value.find(province => province.ProID === row.endStationId);
  return found ? found.name : '-';
}
const endStationFormatter = (row: TrainNumber) => {
  if (row.routes && row.routes.length > 0) {
    const province = provinceStore.value.find(p => p.ProID === row.routes[row.routes.length - 1]?.endStationId);
    return province ? province.name : "-";
  }
  return "-"
}
const showDialog = () => {
  console.log("showAddDialog before:", showAddDialog.value);
  showAddDialog.value = true;
  console.log("showAddDialog after:", showAddDialog.value);
};
onMounted(() => {
  fetchData();
  initOptions();
});

// 初始化数据
</script>
<style>
.el-dialog__wrapper {
  z-index: 2000;
}
.el-dialog {
  max-height: 80vh;
  overflow-y: auto;
}

/* Rail node row and header */
.rail-node-row, .table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 8px 0;
}

/* Input styles */
.rail-node-input {
  margin-right: 8px;
}

/* Table header */
.table-header {
  background-color: #ebebeb;
  border-bottom: 1px solid #ccc;
}

/* Table header spans */
.table-header span {
  flex: 1;
  text-align: center;
  font-weight: bold;
}

/* ID input */
.rail-node-id {
  flex: 1;
  width: 10%;
}

/* Start and end time input */
.rail-node-startTime,
.rail-node-endTime {
  flex: 2;
  width: 20%;
}

/* Select input */
.rail-node-input.el-select {
  flex: 2.5;
  width: 20%;
}

/* Price input */
.rail-node-input.el-input {
  flex: 1;
  width: 10%;
}

/* Row background */
.rail-node-row:nth-child(odd) {
  background-color: #f7f7f7;
}
.rail-node-row{
  margin: 0;
}
</style>
