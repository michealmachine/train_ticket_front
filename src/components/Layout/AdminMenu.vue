<template>
  <div id="menu">
    <el-menu active-text-color="#fff" background-color="#2b2c44" class="el-menu-vertical-demo"
      :default-active="defaultActive" text-color="#c1c1c1" router>
      <component :is="item.children ? ElSubMenu : ElMenuItem" v-for="item in filteredMenuList" :key="item.id" :index="item.index">
        <template v-if="item.children" #title>
          <item.icon v-if="item.icon" class="icon">
            <component :is="item.icon"></component>
          </item.icon>
          <span>{{ item.name }}</span>
        </template>
        <span v-if="!item.children" class="item-content">
          <item.icon v-if="item.icon">
            <component :is="item.icon" class="icon"></component>
          </item.icon>
          <span class="text">{{ item.name }}</span>
        </span>
        <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="subItem.index">
          {{ subItem.name }}
        </el-menu-item>
      </component>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import {  watchEffect, ref, reactive, type Component } from 'vue';
import { House, User, Goods,Search,Place,Guide,ShoppingCart ,WalletFilled} from '@element-plus/icons-vue'
import { ElSubMenu, ElMenuItem } from 'element-plus';
import router from '@/router';
import { useInfoStore } from '@/stores/userinfo.store';
const userInfoStore = useInfoStore();
const defaultActive = ref<string>(router.currentRoute.value.path);
const minister = ref(userInfoStore.getMinister());

interface MenuItem {
  id: number;
  name: string;
  index: string;
  icon?: Component;
  children?: MenuItem[];
}

const menulist: MenuItem[] = [
  {
    id: 1,
    name: "首页",
    index: "/home/admin-home",
    icon: House,
  },
  {
    id: 2,
    name: "用户管理",
    index: "/home/user",
    icon: User,
  },
  {
    id: 101,
    name: "车票系统",
    index: defaultActive.value,
    icon: Goods,
    children: [
      {
        id: 4,
        name: "车站管理",
        index: "/home/station",
        icon:Place
      },
      {
        id: 5,
        name: "车次管理",
        index: "/home/trainNumber",
        icon:Guide
      },
      {
        id: 6,
        name: "车票管理",
        index: "/home/tickManage",
      
      },
    ],
  },
  {
    id:7,
    name:"查询,购买车票",
    index:"/home/buyTicket",
    icon:Search
  },
  {
    id:8,
    name:"购物车",
    index:"/home/cart",
    icon:ShoppingCart
  },
  {
    id:9,
    name:"订单",
    index:"/home/cartView",
    icon:WalletFilled
  }
];

const filteredMenuList = reactive<MenuItem[]>([]);

const filterMenus = (list: MenuItem[]): MenuItem[] => {
  return list.flatMap(item => {
    if (item.children) {
      item.children = filterMenus(item.children);
      if (item.children.length === 0 && (minister.value ? item.id > 6 : item.id < 7)) {
        return [];
      }
    } else if (minister.value ? item.id > 6 : item.id < 7) {
      return [];
    }
    return item;
  });
};

watchEffect(() => {
  filteredMenuList.splice(0);
  filteredMenuList.push(...filterMenus(menulist));
});
</script>

<style>
.item-content {
  display: flex;
  align-items: center;
}

.icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text {
  margin-left: 5px;
}
</style>
