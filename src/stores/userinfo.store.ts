import { httpInstance } from "@/apis";
import router from "@/router";
import { defineStore } from "pinia";
export const useInfoStore = defineStore("userinfo-store",()=>{
  let username: string | null = null;
  let minister: boolean = localStorage.getItem('minister') === 'true';
  const setAuth=(token:string)=>{
    httpInstance.defaults.headers.common.Authorization=token;
    localStorage.setItem('token',token)
  }
  const authFromLocal=()=>{
    const token=localStorage.getItem('token')
    if(token){
      setAuth(token)
      return true
    }
    return false
  }
  const removeAuth=()=>{
    delete httpInstance.defaults.headers.common.Authorization
    localStorage.removeItem('token')
    router.push('/')
  }
  const setMinister = (newMinister: boolean) => {
    minister = newMinister;
    console.log(minister);
    localStorage.setItem("minister", String(newMinister));
  };

  const getMinister=()=>{
    return minister
  }
  const setUsername = (newUsername: string) => {
    username = newUsername;
    localStorage.setItem('username', newUsername);
  };
  const usernameFromLocal = () => {
    const localUsername = localStorage.getItem('username');
    if (localUsername) {
      username = localUsername;
      return true;
    }
    return false;
  };

  const getUsername = () => {
    return username;
  };
  return{
    setAuth,
    authFromLocal,
    removeAuth,
    setUsername,
    getUsername,
    usernameFromLocal,
    setMinister,
    getMinister
  }
})