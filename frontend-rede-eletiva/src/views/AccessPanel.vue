<template>
    <TemplateADM>
        <div class="content">
            <section class="section-Eletiva">
                    <router-link to="/painel/eletiva" class="content-inner">
                        <div class="panel"></div>
                        <div class="red"></div>
                        <div class="yellow"></div>
                        <div class="green"></div>
                        <div class="box-title">
                            <h2 class="title">Eletivas</h2>
                        </div>
                    </router-link>
                </section>
                <section class="section-student">
                    <router-link to="/painel/aluno"  class="content-inner">
                        <div class="panel"></div>
                        <div class="red"></div>
                        <div class="yellow"></div>
                        <div class="green"></div>
                        <div class="box-title">
                            <h2 class="title">Alunos</h2>
                        </div>
                    </router-link>
            </section>
        </div>
    </TemplateADM>
</template>
<script>
import TemplateADM from '@/components/TemplateADM'
export default {
    components: {
        TemplateADM
    }
}
</script>
<style scoped>
.content {
    display: flex;
    height: 75vh;
    width: 100%;
}

section {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

section .content-inner {
    box-shadow: 3px 3px 3px  #00000080;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #374C9B;
    height: 420px;
    width: 480px;
    cursor: pointer;
    transition: 0.6s;
    text-decoration: none;
}

section .content-inner:hover {
    height: 450px;
    width: 500px;
}   

.content-inner .panel {
    width: 100%;
    height: 75%;
}

.red {
  background: #FF0000;
  width: 100%;
  height: 8px;
}
.yellow {
  background: #FFF500;
  width: 100%;
  height: 8px;
}

.green {
  background: #24FF00;
  width: 100%;
  height: 8px;
}

.content-inner .box-title{
    display: flex;
    justify-content: center;
    align-items: center;
    color: #f3f3f3;
    width: 100%;
    height: 19%;
}
</style>