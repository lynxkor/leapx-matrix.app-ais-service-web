<template>
  <div class="contains">
    <!-- 背景 -->
    <div class="login-bg"></div>
    <!-- 登陆面板 -->
    <div class="box-card">
      <!-- <img class="theIcon" src="@/assets/loginIcon.svg" alt="" /> -->
      <svg class="icon-lxppc theIcon" aria-hidden="true">
        <use xlink:href="#icon-lxppc-loginIcon"></use>
      </svg>
      <div class="header text-center" >
        <span class="title">欢迎登录零小跑</span>
      </div>
      <!-- 登录 -->
      <div class="main">
        <el-form ref="form" :model="form" class="form" label-width="8rem">
          <div class="item">
            <el-input v-model="form.account" placeholder='请输入账号' maxlength="11" size='small' clearable></el-input>
          </div>
          <div class="item">
              <el-input type='password' v-model="form.password" placeholder='请输入密码' size='small' clearable></el-input>
          </div>
          <div class="item">
            <el-button type="primary" class="login" @click.native="login">登录</el-button>
          </div>
        </el-form>
      </div>
    </div>
    <!-- <el-dialog
      title="不允许初始密码登陆，请修改密码"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form ref="change-psd-form" :model="changePsdForm" :rules="rules" label-width="80px">
        <el-form-item label="新密码" prop='password'>
        <el-input type='password' v-model="changePsdForm.password" clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop='password2'>
        <el-input type='password' v-model="changePsdForm.password2" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>
<script>
import {
  login
  // loginUserCenter
  // getMiddlePlatformMapping
} from '@/api/user';
import {
  encrypt
  // encryptUC
} from '@/utils';

export default {
  data () {
    return {
      iskey: true,
      form: {
        account: '',
        password: '',
        radio: '1'
      }
    };
  },
  created () {
    if (this.iskey) {
      this.keyupSubmit();
    }
  },
  methods: {
    keyupSubmit () {
      document.onkeydown = event => {
        var _key = event.key;
        if (_key === 13) {
          if (this.iskey) {
            this.login();
          }
        }
      };
    },
    login () {
      this.form.account = this.form.account.trim();
      if (!this.form.account) {
        this.$message({
          message: '用户名不允许为空',
          type: 'error',
          customClass: 'isLoginNone'
        });
        return false;
      };
      if (!this.form.password) {
        this.$message({
          message: '密码不允许为空',
          type: 'error',
          customClass: 'isLoginNone'
        });
        return false;
      };
      // 登陆验证
      login(encrypt(this.form)).then(res => {
        // let params = {
        //   username: this.form.account,
        //   password: encryptUC(this.form.password),
        //   client_id: 'LXP'
        // };
        // console.log(params);
        this.iskey = false;
        this.$store.commit('SET_LOGIN_INFO', res);
        this.$store.commit('SET_PAGE_RESOURCE', res.resources);

        if (!!this.$route.query.id && !!this.$route.query.url) {
          this.$store.commit('SET_ACTIVE_MENU', this.$route.query.url);
          this.$router.push('/' + this.$route.query.url + '?id=' + this.$route.query.id);
        } else {
          this.$router.push(this.$route.query.redirect || '/home');
        }

        // 用户中心登录
        // loginUserCenter(params)
        //   .then(() => {
        //     // 市场数字化权限判断？
        //     // this.getMiddlePlatformMapping();
        //   }).catch((err) => {
        //     console.log('🚀 ~ loginUserCenter ~ err:', err);
        //   });
      }).catch((err) => {
        console.log('🚀 ~ login ~ err:', err);
        this.iskey = true;
      });
    }
    // 获取当前用户部门、岗位、中台映射关系
    // getMiddlePlatformMapping () {
    //   getMiddlePlatformMapping().then(res => {
    //     console.log('🚀 ~ getMiddlePlatformMapping ~ res:', res);
    //     this.$store.commit('SET_MIDDLE_PLATFORM_MAP', res);
    //   }).catch((err) => {
    //     console.log('🚀 ~ getMiddlePlatformMapping ~ err:', err);
    //   });
    // }
  },
  // 清除别的页面回车登录事件
  beforeUnmount () {
    this.iskey = false;
  },
  // 销毁回车登录事件
  unmounted () {
  // window.removeEventListener('keydown', this.keyupSubmit, false);
    document.onkeydown = null;
  }

};
</script>
<style lang="scss" scoped>
.contains {
  width: 100%;
  height: 100%;
  position: relative;
  .login-bg {
    height: 100%;
    background-image: url(/img/login/bg.jpg); // Fallback
    background-image: image-set(
      url(/img/login/bg.jpg) 1x,
      url(/img/login/bg@2x.png) 2x
    );
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }
  .box-card {
    box-sizing: border-box;
    position: absolute;
    left: 50%;
    top: 50%;
    width: 60rem;
    transform: translateY(-50%) translateX(-50%);
    z-index: 20;
    background: rgba(255, 255, 255, 0.77);
    border-radius: 3.2rem;
    border: 0.1rem solid #e2e2e2;
    backdrop-filter: blur(0.4rem);
    text-align: center;
    padding: 5.5rem 10rem 3.3rem 10rem;
    .theIcon{
      width: 24rem;
      height: 6rem;
      margin-bottom: 6.605%; // 2rem
    }
    .header {
      text-align: center;
      font-size: 2.4rem;
      font-family: MicrosoftYaHei;
      color: #000000;
      letter-spacing: 0.1249rem;
      margin-bottom: 13.862%; // 4.2rem
      .title{
        font-family: pingfang scpingfang;
      }
    }
    .main {
      .form {
        .item {
          ::v-deep .el-input__inner {
            height: 4.2rem;
            border-radius: 1.3rem;
            border-color:  rgba(0, 0, 0, 0.26);
          }
          ::v-deep .el-input__inner:focus {
            border-color: var(--themColor);
          }
          ::v-deep .el-button{
            border: none !important;
          }
          .loginGrey {
            font-size: 1.8rem;
            border-radius: 1.3rem;
            padding: 5.12% 43.895%;
            font-weight: bold;
            color: #ffffff;
            background: rgba(0, 0, 0, 0.2);
            width: 100%;
            padding: 1.55rem 0;
            margin-top: 6.605%; // 2rem
            margin-bottom: 6.605%; // 2rem
            font-family: pingfang scpingfang;
          }
          .loginGreen {
            border-radius: 1.3rem;
            font-weight: bold;
            color: #ffffff;
            background: var(--themColor);
            font-size: 1.8rem;
            width: 100%;
            padding: 1.55rem 0;
            margin-top: 6.605%; // 2rem
            margin-bottom: 6.605%; // 2rem
            font-family: pingfang scpingfang;
          }
          .login {
              margin-top: 2.8rem;
              width: 30.4rem;
              height: 4.9rem;
              font-size: 1.8rem;
              padding:0px;
              font-weight: bold;
              margin-bottom: 14px;
              border-radius: 1.3rem;
          }
        }
        .item:first-child{
          margin-bottom: 1%;
        }
      }
    }
    .forgetAndTease {
      display: flex;
      justify-content: center;
      font-family: MicrosoftYaHei;
      color: var(--themColor);
      font-size: 1.4rem;
      margin-bottom: 8.625%;
      span {
        cursor: pointer;
      }
      span:first-child{
        margin-right: 3.5%;
      }
      span:nth-child(2){
        margin-right: 3.5%;
      }
      span:last-child{
        margin-left: 3.5%;
      }
    }
  }
}
::v-deep .el-input {
  width: 30.4rem;
}
::v-deep .el-input__inner:focus {
  border-color: red;
}
</style>
