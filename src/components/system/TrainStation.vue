<template>
  <div class="c">
    <div id="myechart" style="width: 600px;height:600px;" ref="demoh">
    </div>

    <div class="p" style="width: 400px;height: 600px; border: whitesmoke solid 2px">
      <div style="display: flex;justify-content: space-around;width: 380px">
        <el-select v-model="pname" value-key="ProID" class="m-2" placeholder="请选择">
          <el-option
              v-for="item in province"
              :label="item.name"
              :key="item.ProID"
              :value="item"
          />
        </el-select>
        <el-button round @click="add">添加</el-button>
      </div>
      <el-card>
        <div class="l">
          已有站点城市:
          <span v-for="item in data" key="item.id" style="display: flex; justify-content: space-around;width: 200px">
            {{ item.name }}<el-button round @click="deleteItem(item.id)" >删除</el-button>
          </span>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script setup lang="ts">
import * as echarts from "echarts"
import {mapData} from "@/assets/mapData"
import {computed, onMounted, ref, watch} from "vue";
import {province} from "@/stores/province.store";
import {addNode, deleteId, query} from "@/apis/node";
import {ElMessage} from "element-plus";

interface Province {
  ProID: number,
  name: string,
  ProSort: number,
  ProRemark: string
}

interface Node {
  id: number,
  name: string
}
const deleteItem=async (id:number)=>{
  const rq=await deleteId({id})
  ElMessage.success(rq.data.data)
  getNode()
}
const ret=computed(()=>{

  return data;
})
const pname = ref<Province>()
const demoh = ref(null)
const data = ref<Node[]>([])
const getNode = async () => {
  const res = await query()
  data.value = res.data.data
}
const add = async () => {
  let result = {
    id: pname.value?.ProID,
    name: pname.value?.name
  }
  const rq=await addNode(result)
  ElMessage.success(rq.data.data)
  getNode()
}

onMounted(() => {
  console.log(demoh.value)
  console.log(province)
  let myChart = echarts.init(demoh.value)
  echarts.registerMap('chinaMap', mapData)
  getNode().then(() => {
    let scatterData = data.value.map(item => {
      let provinceInfo = province.find(p => p.ProID === item.id);
      if (provinceInfo) {
        return {
          name: provinceInfo.name,
          value: [...provinceInfo.value]
        };
      }
      return null;
    }).filter(item => item !== null);

    let option = {
    geo: {
      type: "map",
      map: "chinaMap",
      roam: true,
      // label:{
      //   show:true,
      // }
    },
    series: [{
      name: 'scatter',
      type: 'scatter',
      coordinateSystem: 'geo',
      symbol:'pin',
      symbolSize: 20,
      data: scatterData
    }]
  }
  myChart.setOption(option)
  getNode()
  })
})

</script>
<style>
#myechart {
  border: whitesmoke 2px solid;
}

.c {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.p {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
}
.l{
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  flex-wrap: wrap;
}
</style>

