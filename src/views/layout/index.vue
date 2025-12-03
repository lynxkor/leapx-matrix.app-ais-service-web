<template>
  <el-container v-if="qiankun">
    <el-header class="bread" v-show="$route.path !== '/home' && !$route.path.startsWith('/leapx/biEmbed')"><pageTitle></pageTitle></el-header>
    <el-main class="mainContent" :class="$route.meta.specilMain ? 'specil' : ''"><router-view :key="$route.fullPath"/></el-main>
  </el-container>
  <el-container v-else>
    <el-header class="header" v-if="!isNobar">
      <div class="logoImg">
        <!-- <img class="logo" src="@/assets/logo-02.svg" alt="" srcset="" /> -->
        <svg class="icon-lxppc logo" aria-hidden="true">
          <use xlink:href="#icon-lxppc-logo-02"></use>
        </svg>
      </div>
      <el-menu mode="horizontal" :unique-opened="true" class="menu-nav el-menu-demo" background-color="#FFFFFF" :default-active="topActiveNav" active-text-color="var(--themColor)">
        <!-- <el-menu-item :index="dataList[0].resourceUri">{{dataList[0].resourceName}}</el-menu-item> -->
        <template v-for="(item, index) in dataList">
          <el-menu-item class="homeSpec" :key="index" v-if="index==0 && item.resourceUri === '/home'" :index="dataList[0].resourceUri" @click="toHome(dataList[0].resourceUri)">{{item.resourceName}}</el-menu-item>
          <el-submenu :index="item.resourceUri" :key="index + 1" v-else>
            <template v-slot:title>{{item.resourceName}}</template>
            <el-menu-item v-for="(ele, idx) in item.children" :key="idx" :index="ele.resourceUri" @click="getLeftNav(ele)">{{ele.resourceName}}</el-menu-item>
          </el-submenu>
        </template>
      </el-menu>
      <div class="dropdown">
        <!-- 二维码/问题反馈 -->
      <div class="drawerBox">
        <div v-show="false">
          <form name="form1" :action="theUrl" method="post" target='_blank'>
              <input  name="UserName" :value="theUserName" type='hidden'/>
                  <input  name="Password" :value="thePassword" type='hidden' />
                    <input  name="AuthMethod" :value="theAuthMethod"  type='hidden' />
              <input type="submit" value="login">
          </form>
        </div>
        <el-row >
          <el-col :span="24" class="drawerBox-b ">
            <el-popover
              popper-class="theCenterMyAppPopover specil"
              placement="top"
              width="500"
              trigger="click">
              <div class="theCenterMyApp">
                <div class="theOutBox">
                  <iframe :src="iframeSrc" frameborder="0" width="1200" height="600"></iframe>
                </div>
              </div>
              <template v-slot:reference>
                <el-image
                  src="/img/common/onlineServer.svg"
                  alt=""
                  style="width: 6rem; height: 4rem;"

                  @click='getTrUrl'
                  >
                ></el-image>
              </template>
            </el-popover>
          </el-col>
        </el-row>
        <!-- 我的应用 -->
        <el-row>
          <el-col :span="24">
             <el-popover
              popper-class="theCenterMyAppPopover"
              placement="top"
              width="347"
              trigger="click">
              <div class="theCenterMyApp">
                <div class="theOutBox">
                  <div class="appBox" v-for="(item, index) in myClientList" :key="index">
                    <div @click="handleClick(item.clientId)">
                      <img :src="item.clientIconKey" alt="">
                      <!-- <img :src="item.clientImgSrc" alt=""> -->
                      <div class="theName">{{item.clientName}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <el-image
                :src="require('@/assets/centerMyApp/myApp.svg')"
                alt=""
                style="width: 6rem; height: 4rem;"
                slot="reference">
              ></el-image> -->
              <template v-slot:reference>
                <svg class="icon-lxppc" aria-hidden="true" style="width: 6rem; height: 4rem;" >
                  <use xlink:href="#icon-lxppc-myApp"></use>
                </svg>
              </template>
            </el-popover>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="drawerBox-t">
            <!-- <el-image
              :src="require('@/assets/drawerBox/DPIlog.svg')"
              alt=""
              style="width: 4rem; height: 4rem"
            ></el-image> -->
            <svg class="icon-lxppc" aria-hidden="true" style="width: 4rem; height: 4rem">
              <use xlink:href="#icon-lxppc-DPIlog"></use>
            </svg>
            <!-- <span style='margin-top:3px'>零小跑下载</span> -->
            <el-col :span="24" class="drawerBox-qr">
              <el-image
                src="/img/common/QrCode.png"
                alt=""
                style="width: 160px; height: 157px"
              ></el-image>
            </el-col>
          </el-col>
        </el-row>
        <!-- <el-divider></el-divider> -->
        <el-row @click.native="blankNewPage">
          <el-col :span="24" class="drawerBox-b ">
            <el-image
              src="/img/common/Feedback.svg"
              alt=""
              style="width: auto; height: 4rem;"
            ></el-image>
             <el-col :span="24" class="drawerBox-qr problemFeedback">
              <el-image
                src="/img/common/problemFeedback.png"
                alt=""
                style="width: 14.1rem; height: 6.4rem"
              ></el-image>
            </el-col>
          </el-col>
        </el-row>
      </div>
        <el-dropdown :hide-on-click='false'>
          <span class="el-dropdown-link">
            <!-- <img src="@/assets/Avatar.svg" style="border-radius: 50%" /> -->
            <svg class="icon-lxppc" aria-hidden="true">
              <use xlink:href="#icon-lxppc-Avatar"></use>
            </svg>
          </span>
          <template v-slot:dropdown>
            <el-dropdown-menu  >
              <el-dropdown-item v-if="resourceBtn.includes('B10307')"><el-switch v-model="washSeats"  active-color="#13ce66" inactive-color="#D2D8DF" style='margin-right:1.2rem;' @change='(val)=>getOnlineOperation(val,1)'/>清洗坐席{{washSeats?'上线':'下线'}}</el-dropdown-item>
              <el-dropdown-item v-if="resourceBtn.includes('B10308')"><el-switch v-model="getBackSeats"  active-color="#13ce66" inactive-color="#D2D8DF" style='margin-right:1.2rem;' @change='(val)=>getOnlineOperation(val,2)'/>回捞坐席{{getBackSeats?'上线':'下线'}}</el-dropdown-item>
              <el-dropdown-item @click.native='dialogVisible = true'>修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="signOut">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div class="person">
          <span>{{ $store.state.user.userInfo.userName }}</span>
        </div>
      </div>
    </el-header>
    <el-main style="padding: 0;">
    <water-mark class="water-mark" :markContent="markContent"></water-mark>
    <el-container>
      <template v-if="!isNobar">
        <el-aside ref="aside" v-show="show" :style="{ 'width': isCollapse ? '64px' : '242px' }">
        <el-menu ref="leftMenu" mode="vertical" class="el-menu-vertical-demo" active-text-color="#07B56A" :collapse-transition="false" :default-openeds="openMenuList" :default-active="leftActiveNav" :unique-opened="true" :collapse="isCollapse">
          <el-submenu v-for="item in leftNavList" ref="ceshi" :index="item.resourceUri" :key="item.resourceUri">
            <template v-slot:title><i class="el-icon-location"></i><span>{{item.resourceName}}</span></template>
            <el-menu-item v-for="(ele, index) in item.children" :index="ele.resourceUri" :key="index + 1" @click="navigatorTo(ele)" v-show="ele.resourceCate !== '2'">{{ele.resourceName}}</el-menu-item>
          </el-submenu>
        </el-menu>
        <span class="collapseBox" :style="{ 'width': isCollapse ? '64px' : '242px' }">
          <div @click="changeCollapse">
            <svg v-if="isCollapse" class="icon-lxppc logo" aria-hidden="true">
              <use xlink:href="#icon-lxppc-menuOut"></use>
            </svg>
            <img v-else src="/img/common/menuIn.png" alt="">
          </div>
          <!-- <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" @click="changeCollapse"></i> -->
        </span>
        </el-aside>
      </template>

      <el-container>
        <el-header class="bread" v-show="$route.path !== '/home' && !$route.path.startsWith('/leapx/biEmbed')"><pageTitle></pageTitle></el-header>
        <el-main class="mainContent" :class="$route.meta.specilMain ? 'specil' : ''"><router-view :key="$route.fullPath"/></el-main>
        <!-- <el-main class="mainContent specil"><router-view /></el-main> -->
      </el-container>
    </el-container>
  </el-main>
        <!-- 修改密码 -->
    <el-dialog
      title="修改密码"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form
        ref="change-psd-form"
        :model="changePsdForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="旧密码" prop="password">
          <el-input
            type="password"
            v-model="changePsdForm.password"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            type="password"
            v-model="changePsdForm.newPassword"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="newPassword2">
          <el-input
            type="password"
            v-model="changePsdForm.newPassword2"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span  class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
      <!-- <iframe src="https://webchat-bj.clink.cn/chat.html?accessId=3e8a8faf-4a80-400c-b1eb-2d9ff33fd755&language=zh_CN" frameborder="0"></iframe> -->
  </el-container>
</template>

<script>
import { getOutLink } from '@/api/thirdPart';
import { getOwnerTree } from '@/api/crm/page-source';
import pageTitle from '@/libs/components/AisPageTitle';
import { changeRoute } from './routeData';
import { changeUserPsd, getOnlineOperation, getServiceOnlineStatus, queryClientByUserId, getRedirectUrl, getTrUrl } from '@/api/user';
import waterMark from '@/components/watermark';
import { formatDateTime, decryptUC } from '@/utils';
export default {
  components: {
    pageTitle,
    waterMark
  },
  data () {
    const password = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('旧密码不能为空'));
      } else {
        callback();
      }
    };
    const newPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('新密码不能为空'));
      } else if (value.length < 8 || value.length > 20) {
        return callback(new Error('密码长度必须8-20位'));
      } else if (
        !/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/.test(value)
      ) {
        return callback(
          new Error(
            '密码必须包含数字、大写字母、小写字母、特殊字符的两种或两种以上'
          )
        );
      } else {
        callback();
      }
    };
    const newPassword2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入确认密码'));
      } else if (value !== this.changePsdForm.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      qiankun: window.__POWERED_BY_QIANKUN__,
      iframeSrc: '',
      onlineObj: {},
      theUrl: '',
      theUserName: '',
      thePassword: '',
      theAuthMethod: '',
      myClientList: [],
      // 我的应用 [销服，智享，权益中心，BI，帆软报表，合同管理系统，C端运营管理后台，C端服务商城，C端中台管理系统, 天润, 服务信息系统]
      // clientIdList: ['DMS', 'INTELLIGENT', 'EQUITY', 'BI', 'FANRUAN', 'CLM', 'CARMANAGE', 'YSHOPADMIN', 'CPMS', 'TIANRUN', 'ITP'],
      dialogVisible: false,
      show: false,
      dataList: [], // 全集菜单
      leftNavList: [], // 左侧菜单
      isCollapse: false,
      resourceBtn: [],
      topActiveNav: '',
      leftActiveNav: '',
      openMenuList: [], // 菜单栏打开的目录
      signId: '',
      a: [],
      markContent: '',
      washSeats: false, // 清洗坐席离线
      getBackSeats: false, // 回捞坐席离线
      changePsdForm: {
        password: '',
        newPassword: '',
        newPassword2: ''
      },
      rules: {
        password: [
          { validator: password, trigger: 'blur' }
        ],
        newPassword: [
          { validator: newPassword, trigger: 'blur' }
        ],
        newPassword2: [
          { validator: newPassword2, trigger: 'blur' }
        ]
      },
      isNobar: false
    };
  },
  created () {
    console.log('当前为newIndex');
    // this.getTrUrl();
    if (!window.__POWERED_BY_QIANKUN__) {
      this.getOwnerTree();
      this.getOwnerTree1();
      this.queryClientByUserId('lxp');
    }

    this.show = this.$route.path !== '/home' && !this.$route.path.startsWith('/leapx/biEmbed');
    this.isNobar = this.$route.query.nobar === '1';

    // 解决公告 / 常见问题 / 操作手册 / 业务手册 侧边栏问题
    let menuHiddenList = ['/operationsManagement/notice/detailByUser', '/comproblem/userDetail', '/manual/userDetail'];
    if (menuHiddenList.includes(this.$route.path)) {
      this.show = false;
    };
  },
  mounted () {
    this.markContent = this.$store.state.user.userInfo.userName + ' ' + this.$store.state.user.userInfo.mobile + ' ' + formatDateTime().slice(0, 10);
  },
  watch: {
    $route: {
      handler (val) {
        // debugger;
        console.log('🚀 ~ handler ~ val:', val);
        this.openMenuList = [];
        this.leftActiveNav = changeRoute(val.path);
        this.checkData(this.dataList, changeRoute(val.path));
        this.openMenuList.push(this.signId);
      },
      deep: true
    }
  },
  // computed: {
  //   leftActiveNav () {
  //     console.log('触发了');
  //     const route = this.$route;
  //     // this.checkData(this.dataList, route.path);
  //     // this.$refs.leftMenu.leftActiveNav = route.path;
  //     return route.path;
  //   }
  // },
  methods: {
    // 获取天润客服链接
    getTrUrl () {
      getTrUrl().then(res => {
        this.iframeSrc = res;
      }).catch(() => {});
    },
    handleClick (clientId) {
      getRedirectUrl({ clientId: clientId }).then(res => {
        if (res.startsWith('http')) { // 判断返回值，开头是不是为http，如果不是就需要通过解密获取解密之后的结果，再模拟表单登录
          window.open(res);
        } else {
          let resObj = JSON.parse(decryptUC(res));
          let form = document.createElement('form');
          form.method = 'POST'; // 设置表单提交的HTTP方法为POST
          form.target = '_blank'; // 设置表单提交之后打开新页面
          form.action = resObj.url; // 设置表单跳转的url
          delete resObj.url;
          const keys = Object.keys(resObj);
          keys.forEach(item => {
            var input = document.createElement('input');
            input.type = 'hidden';
            input.name = item;
            input.value = resObj[item];
            form.appendChild(input);
          });
          document.body.appendChild(form);
          this.$nextTick(() => {
            form.submit();// 提交表单
          });
        }
      }).catch(() => {});
      // 老的跳转登录方式 （废弃）
      // if (clientId === 'DMS') {
      //   console.log('DMS销服');
      //   getRedirectUrl({ clientId: clientId }).then(res => {
      //       console.log(res.Password);
      //       let temp = decrypt3(res.Password);
      //       console.log(temp);
      //       this.theUrl = res.url;
      //       this.theUserName = res.UserName;
      //       this.thePassword = temp;
      //       this.theAuthMethod = res.AuthMethod;
      //       console.log(document.form1);
      //       this.$nextTick(() => {
      //         document.form1.submit();
      //       });
      //   }).catch(() => {});
      // } else {
      //   getRedirectUrl({ clientId: clientId }).then(res => {
      //     console.log(res);
      //     window.open(res);
      //   }).catch(() => {});
      // }
    },
    // 获取我的应用
    queryClientByUserId (v) {
      queryClientByUserId({ workbench: v })
        .then(res => {
          let temp = [];
          res.map(item => {
          // this.clientIdList.forEach(clientId => {
            // if (item.clientId === clientId) {
            temp.push({
              clientId: item.clientId,
              clientName: item.clientName,
              // clientImgSrc: require('@/assets/centerMyApp/' + item.clientId + '.svg'), // 本地存储的图片
              clientIconKey: item.clientIconKey // oss上传的图片
            });
            // }
          // });
          });
          // console.log(temp);
          this.myClientList = temp;
        })
        .catch(() => {
          this.myClientList = [];
        });
    },
    signOut () {
      this.$store.commit('USER_CLICK_MENU');
      this.$store.commit('USER_SIGN_OUT', this.$router);
    },
    // 修改登录密码
    onSubmit () {
      this.$refs['change-psd-form'].validate((valid) => {
        if (valid) {
          changeUserPsd({
            newPassword: this.changePsdForm.newPassword,
            password: this.changePsdForm.password
            // userId: this.$store.state.user.userInfo.userId
          })
            .then((res) => {
              this.$message({
                message: '登陆密码修改成功',
                type: 'success'
              });
              this.dialogVisible = false;
              this.changePsdForm = {
                password: '',
                newPassword: '',
                newPassword2: ''
              };
            })
            .catch(() => {});
        } else {
          return false;
        }
      });
    },
    // 客服上下线操作
    getOnlineOperation (flag, type) {
      // console.log({ userId: JSON.parse(localStorage.getItem('userInfo')).userId, flag });
      // return;
      getOnlineOperation({ userId: JSON.parse(localStorage.getItem('userInfo')).userId, flag: `${flag}`, type }).catch(() => {
        switch (type) {
          case 1:
            this.washSeats = !this.washSeats;
            break;
          case 2:
            this.getBackSeats = !this.getBackSeats;
            break;
          default:
            break;
        }
      });
    },
    // 客服上下线状态
    getServiceOnlineStatus () {
      if (this.resourceBtn.includes('B10307')) {
        getServiceOnlineStatus({ userId: JSON.parse(localStorage.getItem('userInfo')).userId, type: 1 }).then(res => {
          this.washSeats = res.userServiceOnlineStatus;
        });
      }
      if (this.resourceBtn.includes('B10308')) {
        getServiceOnlineStatus({ userId: JSON.parse(localStorage.getItem('userInfo')).userId, type: 2 }).then(res => {
          this.getBackSeats = res.userServiceFailOnlineStatus;
        });
      }
    },
    toHome (url) {
      this.show = false;
      this.$router.push(url);
    },
    changeCollapse () {
      this.isCollapse = !this.isCollapse;
      // this.$refs.aside.width = this.isCollapse ? '54px' : '242px';
    },
    getLeftNav (info) {
      console.log(info);
      if (info.resourceUri.startsWith('/leapx/biEmbed') && info.redirectUrl) {
        this.show = false;
        var temp = encodeURIComponent(info.redirectUrl);
        console.log(`/leapx/biEmbed/${temp}`);
        this.$router.push(`/leapx/biEmbed/${temp}`);
      } else {
        console.log(info, info.children[0].children[0].resourceUri);
        this.leftNavList = info.children;
        this.show = true;
        this.navigatorTo(info.children[0].children[0]);
      }
    },
    checkData (data, url) {
      // debugger;
      for (let i = 0; i < data.length; i++) {
        if (data[i].resourceUri === url) {
          this.signId = data[i].signId;
          return false;
        }
        if (data[i].resourceUri !== url) {
          this.checkData(data[i].children, url);
        }
      }
    },
    getOwnerTree () {
      // console.log(1234);
      getOwnerTree({ resourceType: 'PORTAL_SIDE' }).then(res => {
        var index = null;
        // 排除掉工单详情
        index = res.findIndex(item => {
          return item.resourceTag === 'M10071';
        });
        this.dataList = res;
        if (index !== -1) {
          this.dataList.splice(index, 1);
        }
        this.dataList.forEach((ele, index) => {
          ele.resourceUri !== '/home' && (ele.resourceUri = `${index + 1}`);
          ele.children.forEach((item, idx) => {
            item.resourceUri = item.resourceUri.startsWith('/leapx/biEmbed') ? item.resourceUri : `${ele.resourceUri}-${idx + 1}`;
            item.children.forEach((k, kid) => {
              k.resourceUri = `${item.resourceUri}-${kid + 1}`;
              k.children.forEach(m => {
                m.signId = k.resourceUri;
              });
            });
          });
        });
        // console.log(this.dataList);
        this.checkData(this.dataList, changeRoute(this.$route.path));
        // this.a = [this.signId];
        this.topActiveNav = this.$route.path === '/home' ? '/home' : `${this.signId.split('-')[0]}-${this.signId.split('-')[1]}`;
        var signNumber = this.signId.split('-');
        this.leftNavList = this.dataList[Number(signNumber[0]) - 1].children[Number(signNumber[1]) - 1].children;
        // console.log('🚀 ~ getOwnerTree ~ leftNavList:', this.leftNavList);
        this.leftActiveNav = changeRoute(this.$route.path);
        if (this.leftActiveNav === '/process/all') {
          this.leftActiveNav = '';
        }
        // console.log(this.leftActiveNav);
        // this.dataList.forEach(ele => {
        //   this.$set(ele, 'scree', true);
        // });
      }).catch(() => {});
    },
    navigatorTo (info) {
      // console.log('info', info); // 判断资源跳转类型 进行不同方式的资源跳转
      if (info.redirectType === 3 || info.redirectType === 2) { // api方式
        // console.log(info.redirectApi);
        getOutLink(info.redirectApi).then(res => {
          // console.log('res', res);
          window.open(res, '_blank');
        });
      } else if (info.redirectType === 4 || info.redirectType === 5) { // url方式
        // console.log(111);
      } else { // 默认跳转方式
        // if (info.children && info.children.length === 0) {
        let path = info.resourceUri;
        // 因为router配置了base, router.push时需要去掉base
        // 只影响单独运行时菜单行为
        const appPrefix = process.env.VUE_APP_ROUTER_BASE;
        if (appPrefix && path.startsWith(appPrefix)) {
          path = path.substring(appPrefix.length);
        }
        this.$router.push(path);
        // }
      }
    },
    // 新开页面
    blankNewPage () {
      const routerUrl = this.$router.resolve({
        path: '/problem/feedback'
      });
      window.open(routerUrl.href, '_blank');
    },
    // 获取导入资源按钮
    getOwnerTree1 () {
      getOwnerTree({ resourceTag: 'M10001', resourceType: 'PORTAL_SIDE' }).then(res => {
        res.forEach(item => {
          this.resourceBtn.push(item.resourceTag);
        });
        this.getServiceOnlineStatus();
      }).catch(() => {});
    }
  }
};
</script>
<style lang="scss">
.theCenterMyAppPopover{
  width: 40rem !important;
  max-height: 40rem !important;
  border-radius: 1rem;
  overflow: auto;
  &.specil {
    width: 76rem !important;
  }
}
</style>
<style lang="scss" scoped>
.theCenterMyApp{
  padding: 2rem 0;
  .theOutBox{
    // background: skyblue;
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    .appBox{
      width: 33.3%;
      cursor: pointer;
      text-align: center;
      .theName{
        margin-top: 1.1rem;
        margin-bottom: 3.2rem;
        padding: 0 0.5rem;
      }
    }
  }
  .appBox{
    cursor: pointer;
    ::v-deep .el-col-8{
      text-align: center;
      .theName{
        margin-top: 1.1rem;
        margin-bottom: 3.2rem;
      }
    }
    img{
      width: 4.8rem;
      height: 4.8rem;
    }
  }
}
.el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    // text-align: center;
    // line-height: 60px;
  }
  .el-header.bread {
    height: 56px!important;
    background-color: #fff;
    padding-left: 16px;
    border-bottom: 1px solid #E6E6E5;
  }
  .el-aside {
    background-color: #fff;
    color: #333;
    // text-align: center;
    // line-height: 242px;
    padding-bottom: 5rem;
    width: 242px;
    // position: relative;
    box-shadow: 5px 0px 7px 0px rgba(0,0,0,0.06);
    z-index: 998;
  }
  ::v-deep .el-aside::-webkit-scrollbar {
    width: 0 !important;
  }
  .el-menu.el-menu--horizontal {
    border-bottom: none;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 242px;
    min-height: 400px;
  }
  .el-main {
    // background-color: #EEEEEE;
    // color: #333;
    // text-align: center;
    // line-height: 160px;
    padding: 13px;
    border-radius: 5px;

    &.mainContent {
      padding: 0;
      // margin: 12px;
      overflow-y: scroll;
      background-color: #FFFFFF;

      &.specil {
        margin: 0;
      }
    }
  }
  .header {
  display: flex;
  // padding: 0 3.2rem;
  background-color: #FFFFFF;
  height: 61px!important;
  border-bottom: 1px solid #E9EEF3;
}
::v-deep .el-menu--horizontal .el-submenu__title {
  padding: 0;
  margin: 0 20px;
}
::v-deep .el-menu-vertical-demo .el-submenu__title {
  font-weight: bold;
}
::v-deep .el-header {
  // height: 6rem;
  // box-shadow: 0px 5px 16px 0px rgba(18, 86, 98, 0.12);
  // border-bottom: 1px solid;
  padding: 0;
  .dropdown{
    position: relative;
  }
  .drawerBox {
    display: flex;
    z-index: 100;
    box-sizing: border-box;
    width: 15.2rem;
    // height: 137px;
    // background: #ffffff;
    // box-shadow: 0px 1px 11px 0px rgba(0, 0, 0, 0.17);
    // border-radius: 8px;
    // border: 1px solid #d8e3e5;
    position: absolute;
    left: -22rem;
    // right: 17.8rem;
    top: 3rem;
    transform: translateY(-50%);
    justify-content: space-between;
    padding: 16px 5px;
    color: #08383e;
    font-size: 11px;
    user-select: none;
    .el-divider--horizontal {
      margin: 11px 0;
    }
    .el-divider {
      background-color: #d8e3e5;
    }
    .drawerBox-t,
    .drawerBox-b {
      display: flex;
      flex-direction: column;
      text-align: center;
      align-items: center;
    }
    .drawerBox-t,.drawerBox-b {
      .drawerBox-qr {
        display: none;
        position: absolute;
        right: 5.5rem;
        top: 3.3rem;
      }
      &:hover {
        .drawerBox-qr {
          display: block;
        }
      }
    }
    .drawerBox-b {
      cursor: pointer;
      .problemFeedback{
        right: 4.2rem;
        top: 2.3rem;
      }

    }
  }
}
.menu-nav {
  flex: 1;
  // padding-left: 2.1rem;
}
.logoImg {
  width: 268px;
  height: 60px;
  .logo {
  position: relative;
  top: 16px;
  width: 105px;
  height: 31px;
  left: 38px;
  img {
    width: 100%;
    height: 100%;
    transform: scale(0.45);
  }
}
}
.el-dropdown-link {
  line-height: 6rem;
  padding: 0 10px;

  svg {
    position: relative;
    width: 36px;
    height: 36px;
    top: 10px;
  }
}
.person {
  display: inline-block;
  color: #002226;
  font-size: 1.6rem;

  span:first-child {
    padding-right: 11px;
  }
  span:nth-child(2) {
    padding-left: 11px;
  }
}
// ::v-deep .el-menu.el-menu--horizontal, ::v-deep .el-submenu.is-active .el-submenu__title  {
//   border: none;
// }
// ::v-deep .el-menu--horizontal>.el-submenu.is-active .el-submenu__title {
//   border: none;
// }
::v-deep .el-menu--horizontal>.el-submenu:hover .el-submenu__title {
  color: var(--themColor);
  background-color: #FFFFFF!important;
}
.el-menu {
  border-right: none;
}
.el-menu-item:focus, .el-menu-item.is-active {
  background-color: var(--themLightColor);
  color: var(--themColor);
}
.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  color: var(--themColor);
  background-color: var(--themLightColor)!important;
}
.el-menu--horizontal .homeSpec.el-menu-item:not(.is-disabled):hover {
  color: var(--themColor);
  background-color: #FFFFFF!important;
}
.el-menu-item.homeSpec {
  padding: 0;
  margin: 0 20px;
}
.el-menu-vertical-demo ::v-deep .el-submenu__title:hover {
  background-color: var(--themLightColor);
}
.el-menu-vertical-demo ::v-deep .el-menu-item:hover {
  color: var(--themColor);
  background-color: var(--themLightColor);
  &::after {
    content: '';
    // display: block;
    width: 4px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: #07B56A;
  }
}
.collapseBox {
  position: fixed;
  bottom: -0.5rem;
  width: 24rem;
  height: 5rem;
  line-height: 5rem;
  text-align: center;
  font-size: 2rem;
  cursor: pointer;
  background-color: rgb(255, 255, 255);
}
.drawerBox ::v-deep .el-image__inner {
  width: auto!important;
}
.el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover {
  color: var(--themColor);
  background-color: #FFFFFF;
}
::v-deep .el-menu--horizontal>.el-submenu .el-submenu__icon-arrow {
  color: #000000;
  font-weight: bold;
}
::v-deep .el-submenu__icon-arrow {
  color: #000000;
  font-weight: bold;
}
.mainContent::-webkit-scrollbar{
  width:0px;;
  /**/
}
// .mainContent::-webkit-scrollbar-track{
//   background: rgba(239, 239, 239, 0);
//   border-radius:2px;
// }
// .mainContent::-webkit-scrollbar-thumb{
//   background: #7D8690;
//   border-radius: 4px;
// }
// .mainContent::-webkit-scrollbar-thumb:hover{
//   background: #7D8690;
// }
// .mainContent::-webkit-scrollbar-corner{
//   background: #179a16;
// }
</style>
