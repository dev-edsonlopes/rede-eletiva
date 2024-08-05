<template>
  <header class="header">
    <img src="../assets/logo-pernambuco.svg" alt="logo_pernambuco" />
    <router-link to="/painel/" class="btn">Voltar</router-link>
  </header>
  <div class="red"></div>
  <div class="yellow"></div>
  <div class="green"></div>
  <main>
    <slot />
  </main>
</template>


<style scoped> 
.header {
  position: relative;
  background: #374c9b;
  height: 17vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header img {
  width: 300px;
}
.red {
  background: #ff0000;
  width: 100vw;
  height: 15px;
}
.yellow {
  background: #fff500;
  width: 100vw;
  height: 15px;
}

.green {
  background: #24ff00;
  width: 100vw;
  height: 15px;
}

.btn {
  position: absolute;
  top: 30px;
  right: 30px;
  background: #2B6CB0;
  color: #f3f3f3;
  border: 1px solid #0000008b;
  height: 28px;
  width: 100px;
  font-weight: 600;
  text-decoration: none;
  font-size: 10pt;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>