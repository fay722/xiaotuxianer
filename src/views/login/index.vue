<template>
  <div class="page-login">
    <!-- 头部 -->
    <loginHeader>欢迎登陆 </loginHeader>
    <!-- 主体 -->
    <section class="login-section">
      <div class="wrapper">
        <nav>
          <a
            href="javascript:;"
            :class="{ active: activeName === 'accountLogin' }"
            @click="activeName = 'accountLogin'"
            >账户登录</a
          >
          <a
            href="javascript:;"
            :class="{ active: activeName === 'scanCodeLogin' }"
            @click="activeName = 'scanCodeLogin'"
            >扫码登录</a
          >
        </nav>
        <!-- 表单 -->
        <div v-if="activeName === 'accountLogin'" class="account-box">
          <loginForm />
        </div>
        <!-- 二维码 -->
        <div v-if="activeName === 'scanCodeLogin'" class="qrcode-box">
          <img src="@/assets/images/qrcode.jpg" alt="" />
          <p>打开 <a href="javascript:;">小兔鲜App</a> 扫码登录</p>
        </div>
      </div>
    </section>
    <!-- 底部 -->
    <loginFooter />
  </div>
</template>
<script>
import { ref } from 'vue'
import loginFooter from './component/login-footer.vue'
import loginHeader from './component/login-header.vue'
import loginForm from './component/login-form.vue'
export default {
  name: 'PageLogin',
  components: {
    loginFooter, loginHeader, loginForm
  },
  setup() {
    const activeName = ref('accountLogin')
    return { activeName }
  }
}
</script>
<style scoped lang='less'>
.login-section {
  background: url(../../assets/images/login-bg.png) no-repeat center / cover;
  height: 488px;
  position: relative;
  .wrapper {
    width: 380px;
    background: #fff;
    min-height: 400px;
    position: absolute;
    left: 50%;
    top: 54px;
    transform: translate3d(100px, 0, 0);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
    nav {
      height: 55px;
      border-bottom: 1px solid #f5f5f5;
      display: flex;
      padding: 0 40px;
      text-align: right;
      align-items: center;
      a {
        flex: 1;
        line-height: 1;
        display: inline-block;
        font-size: 18px;
        position: relative;
        &:first-child {
          border-right: 1px solid #f5f5f5;
          text-align: left;
        }
        &.active {
          color: @xtxColor;
          font-weight: bold;
        }
      }
    }
  }
  // 二维码容器
  .qrcode-box {
    text-align: center;
    padding-top: 40px;
    p {
      margin-top: 20px;
      a {
        color: @xtxColor;
        font-size: 16px;
      }
    }
  }
}
</style>
