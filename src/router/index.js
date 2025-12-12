import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './../store';

const routerPush = VueRouter.prototype.push;
// 修改原型对象中的push方法
VueRouter.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error);
};
if (!window.VueRouter) Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: {
      isNew: true
    },
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/404',
    name: '404',
    meta: {
      name: '404',
      requiresAuth: true,
      noResourceUrl: true
    },
    component: () => import('@/views/404.vue')
  },
  {
    path: '/',
    name: 'index',
    // component: Layout,
    component: () => import('@/views/layout/index.vue'),
    meta: {
      requiresAuth: true
    },
    children: [{
      path: '/home',
      name: 'home',
      meta: {
        name: '首页'
      },
      component: () => import('@/views/home.vue')
    }, {
      path: '/',
      redirect: '/home',
      name: 'index',
      component: () => import('@/views/home.vue')
    }, {
      path: '/maintain/basic/dealerWorkTeam',
      name: 'dealerWorkTeam',
      component: () => import('@/views/maintain/basic/dealerWorkTeam/index.vue'),

      meta: {
        name: '厅店班组信息管理',
        keepAlive: true
      }
    }, {
      path: '/maintain/basic/dealerWorkTeam/detail',
      name: 'dealerWorkTeamDetail',
      component: () => import('@/views/maintain/basic/dealerWorkTeam/detail.vue'),

      meta: {
        name: '厅店班组信息管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/dealerWorkTeam/edit',
      name: 'dealerWorkTeamEdit',
      component: () => import('@/views/maintain/basic/dealerWorkTeam/edit.vue'),

      meta: {
        name: '厅店班组信息管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/dealerStation',
      name: 'dealerStation',
      component: () => import('@/views/maintain/basic/dealerStation/index.vue'),

      meta: {
        name: '厅店工位信息管理',
        keepAlive: true
      }
    }, {
      path: '/maintain/basic/dealerStation/detail',
      name: 'dealerStationDetail',
      component: () => import('@/views/maintain/basic/dealerStation/detail.vue'),

      meta: {
        name: '厅店工位信息管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/dealerStation/edit',
      name: 'dealerStationEdit',
      component: () => import('@/views/maintain/basic/dealerStation/edit.vue'),

      meta: {
        name: '厅店工位信息管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/dealerWorkhourPriceSetting',
      name: 'dealerWorkhourPriceSetting',
      component: () => import('@/views/maintain/basic/dealerWorkhourPriceSetting/index.vue'),

      meta: {
        name: '工时价格设置管理',
        keepAlive: true
      }
    }, {
      path: '/maintain/basic/dealerWorkhourPriceSetting/detail',
      name: 'dealerWorkhourPriceSettingDetail',
      component: () => import('@/views/maintain/basic/dealerWorkhourPriceSetting/detail.vue'),

      meta: {
        name: '工时价格设置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/dealerWorkhourPriceSetting/edit',
      name: 'dealerWorkhourPriceSettingEdit',
      component: () => import('@/views/maintain/basic/dealerWorkhourPriceSetting/edit.vue'),

      meta: {
        name: '工时价格设置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/checkoutType',
      name: 'checkoutType',
      component: () => import('@/views/maintain/basic/checkoutType/index.vue'),

      meta: {
        name: '结算类型管理',
        keepAlive: true
      }
    }, {
      path: '/maintain/basic/checkoutType/detail',
      name: 'checkoutTypeDetail',
      component: () => import('@/views/maintain/basic/checkoutType/detail.vue'),

      meta: {
        name: '结算类型管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/checkoutType/edit',
      name: 'checkoutTypeEdit',
      component: () => import('@/views/maintain/basic/checkoutType/edit.vue'),

      meta: {
        name: '结算类型管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/dealerDiscount',
      name: 'dealerDiscount',
      component: () => import('@/views/maintain/basic/dealerDiscount/index.vue'),

      meta: {
        name: '门店优惠模式管理',
        keepAlive: true
      }
    }, {
      path: '/maintain/basic/dealerDiscount/detail',
      name: 'dealerDiscountDetail',
      component: () => import('@/views/maintain/basic/dealerDiscount/detail.vue'),

      meta: {
        name: '门店优惠模式管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/dealerDiscount/edit',
      name: 'dealerDiscountEdit',
      component: () => import('@/views/maintain/basic/dealerDiscount/edit.vue'),

      meta: {
        name: '门店优惠模式管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/repairItemType',
      name: 'repairItemType',
      component: () => import('@/views/maintain/basic/repairItemType/index.vue'),

      meta: {
        name: '维修类型管理',
        keepAlive: true
      }
    }, {
      path: '/maintain/basic/repairItemType/detail',
      name: 'repairItemTypeDetail',
      component: () => import('@/views/maintain/basic/repairItemType/detail.vue'),

      meta: {
        name: '维修类型管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/repairItemType/edit',
      name: 'repairItemTypeEdit',
      component: () => import('@/views/maintain/basic/repairItemType/edit.vue'),

      meta: {
        name: '维修类型管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/batteryUnit',
      name: 'batteryUnit',
      component: () => import('@/views/maintain/basic/batteryUnit/index.vue'),

      meta: {
        name: '电池去向单位管理',
        keepAlive: true
      }
    }, {
      path: '/maintain/basic/batteryUnit/detail',
      name: 'batteryUnitDetail',
      component: () => import('@/views/maintain/basic/batteryUnit/detail.vue'),

      meta: {
        name: '电池去向单位管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/batteryUnit/edit',
      name: 'batteryUnitEdit',
      component: () => import('@/views/maintain/basic/batteryUnit/edit.vue'),

      meta: {
        name: '电池去向单位管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/vehicleTag',
      name: 'vehicleTag',
      component: () => import('@/views/maintain/basic/vehicleTag/index.vue'),

      meta: {
        name: '车辆标识管理',
        keepAlive: true
      }
    }, {
      path: '/maintain/basic/vehicleTag/detail',
      name: 'vehicleTagDetail',
      component: () => import('@/views/maintain/basic/vehicleTag/detail.vue'),

      meta: {
        name: '车辆标识管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/vehicleTag/edit',
      name: 'vehicleTagEdit',
      component: () => import('@/views/maintain/basic/vehicleTag/edit.vue'),

      meta: {
        name: '车辆标识管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/dealerPermission',
      name: 'dealerPermission',
      component: () => import('@/views/maintain/basic/dealerPermission/index.vue'),

      meta: {
        name: '门店施工单权限管理',
        keepAlive: true
      }
    }, {
      path: '/maintain/basic/dealerPermission/detail',
      name: 'dealerPermissionDetail',
      component: () => import('@/views/maintain/basic/dealerPermission/detail.vue'),

      meta: {
        name: '门店施工单权限管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/dealerPermission/edit',
      name: 'dealerPermissionEdit',
      component: () => import('@/views/maintain/basic/dealerPermission/edit.vue'),

      meta: {
        name: '门店施工单权限管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/spreadsSetting',
      name: 'spreadsSetting',
      component: () => import('@/views/maintain/basic/spreadsSetting/index.vue'),

      meta: {
        name: '保养套餐差价设置管理',
        keepAlive: true
      }
    }, {
      path: '/maintain/basic/spreadsSetting/detail',
      name: 'spreadsSettingDetail',
      component: () => import('@/views/maintain/basic/spreadsSetting/detail.vue'),

      meta: {
        name: '保养套餐差价设置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/spreadsSetting/edit',
      name: 'spreadsSettingEdit',
      component: () => import('@/views/maintain/basic/spreadsSetting/edit.vue'),

      meta: {
        name: '保养套餐差价设置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/repairitem',
      name: 'repairItem',
      component: () => import('@/views/maintain/basic/repairItem/index.vue'),

      meta: {
        name: '维修项目管理',
        keepAlive: true
      }
    }, {
      path: '/maintain/basic/repairitem/detail',
      name: 'repairItemDetail',
      component: () => import('@/views/maintain/basic/repairItem/detail.vue'),

      meta: {
        name: '维修项目管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/repairitem/edit',
      name: 'repairItemEdit',
      component: () => import('@/views/maintain/basic/repairItem/edit.vue'),

      meta: {
        name: '维修项目管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/excelManagement/commonDataProcessExcelModelMap',
      name: 'commonDataProcessExcelModelMap',
      component: () => import('@/views/excelManagement/commonDataProcessExcelModelMap/index.vue'),

      meta: {
        name: 'Excel模型管理',
        keepAlive: true
      }
    }, {
      path: '/excelManagement/commonDataProcessExcelModelMap/detail',
      name: 'commonDataProcessExcelModelMapDetail',
      component: () => import('@/views/excelManagement/commonDataProcessExcelModelMap/detail.vue'),

      meta: {
        name: 'Excel模型管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/excelManagement/commonDataProcessExcelModelMap/edit',
      name: 'commonDataProcessExcelModelMapEdit',
      component: () => import('@/views/excelManagement/commonDataProcessExcelModelMap/edit.vue'),

      meta: {
        name: 'Excel模型管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/excelManagement/commonDataProcessExcelTask',
      name: 'commonDataProcessExcelTask',
      component: () => import('@/views/excelManagement/commonDataProcessExcelTask/index.vue'),

      meta: {
        name: '新页面',
        keepAlive: true
      }
    }, {
      path: '/excelmanagement/commondataprocessexceltask/detail',
      name: 'commonDataProcessExcelTaskDetail',
      component: () => import('@/views/excelManagement/commonDataProcessExcelTask/detail.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/excelmanagement/commondataprocessexceltask/edit',
      name: 'commonDataProcessExcelTaskEdit',
      component: () => import('@/views/excelManagement/commonDataProcessExcelTask/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/sparePartVehicleModel',
      name: 'sparePartVehicleModel',
      component: () => import('@/views/sparepart/basic/sparePartVehicleModel/index.vue'),

      meta: {
        name: '新页面',
        keepAlive: true
      }
    }, {
      path: '/sparepart/basic/sparepartvehiclemodel/detail',
      name: 'sparePartVehicleModelDetail',
      component: () => import('@/views/sparepart/basic/sparePartVehicleModel/detail.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/sparepartvehiclemodel/edit',
      name: 'sparePartVehicleModelEdit',
      component: () => import('@/views/sparepart/basic/sparePartVehicleModel/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/spareSalesCategory',
      name: 'spareSalesCategory',
      component: () => import('@/views/sparepart/basic/spareSalesCategory/index.vue'),

      meta: {
        name: '新页面',
        keepAlive: true
      }
    }, {
      path: '/sparepart/basic/sparesalescategory/detail',
      name: 'spareSalesCategoryDetail',
      component: () => import('@/views/sparepart/basic/spareSalesCategory/detail.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/sparesalescategory/edit',
      name: 'spareSalesCategoryEdit',
      component: () => import('@/views/sparepart/basic/spareSalesCategory/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/spareSupplyCategory',
      name: 'spareSupplyCategory',
      component: () => import('@/views/sparepart/basic/spareSupplyCategory/index.vue'),

      meta: {
        name: '新页面',
        keepAlive: true
      }
    }, {
      path: '/sparepart/basic/sparesupplycategory/detail',
      name: 'spareSupplyCategoryDetail',
      component: () => import('@/views/sparepart/basic/spareSupplyCategory/detail.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/sparesupplycategory/edit',
      name: 'spareSupplyCategoryEdit',
      component: () => import('@/views/sparepart/basic/spareSupplyCategory/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/spareEngineeringCategory',
      name: 'spareEngineeringCategory',
      component: () => import('@/views/sparepart/basic/spareEngineeringCategory/index.vue'),

      meta: {
        name: '新页面',
        keepAlive: true
      }
    }, {
      path: '/sparepart/basic/spareengineeringcategory/detail',
      name: 'spareEngineeringCategoryDetail',
      component: () => import('@/views/sparepart/basic/spareEngineeringCategory/detail.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/spareengineeringcategory/edit',
      name: 'spareEngineeringCategoryEdit',
      component: () => import('@/views/sparepart/basic/spareEngineeringCategory/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/basic/vrt',
      name: 'vrt',
      component: () => import('@/views/claimreturn/basic/vrt/index.vue'),

      meta: {
        name: 'VRT',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/basic/vrt/detail',
      name: 'vrtDetail',
      component: () => import('@/views/claimreturn/basic/vrt/detail.vue'),

      meta: {
        name: 'VRT详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/basic/vrt/edit',
      name: 'vrtEdit',
      component: () => import('@/views/claimreturn/basic/vrt/edit.vue'),

      meta: {
        name: '编辑VRT',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/basic/vfg',
      name: 'vfg',
      component: () => import('@/views/claimreturn/basic/vfg/index.vue'),

      meta: {
        name: '新页面',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/basic/vfg/detail',
      name: 'vfgDetail',
      component: () => import('@/views/claimreturn/basic/vfg/detail.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/basic/vfg/edit',
      name: 'vfgEdit',
      component: () => import('@/views/claimreturn/basic/vfg/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/basic/ccc',
      name: 'ccc',
      component: () => import('@/views/claimreturn/basic/ccc/index.vue'),

      meta: {
        name: 'CCC管理',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/basic/ccc/detail',
      name: 'cccDetail',
      component: () => import('@/views/claimreturn/basic/ccc/detail.vue'),

      meta: {
        name: 'CCC详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/basic/ccc/edit',
      name: 'cccEdit',
      component: () => import('@/views/claimreturn/basic/ccc/edit.vue'),

      meta: {
        name: 'CCC编辑',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/basic/vehicleSpecialPartWarrantyPolicy',
      name: 'vehicleSpecialPartWarrantyPolicy',
      component: () => import('@/views/claimreturn/basic/vehicleSpecialPartWarrantyPolicy/index.vue'),

      meta: {
        name: '整车特殊零件保修政策设置管理',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/basic/vehiclespecialpartwarrantypolicy/detail',
      name: 'vehicleSpecialPartWarrantyPolicyDetail',
      component: () => import('@/views/claimreturn/basic/vehicleSpecialPartWarrantyPolicy/detail.vue'),

      meta: {
        name: '整车特殊零件保修政策设置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/basic/vehiclespecialpartwarrantypolicy/edit',
      name: 'vehicleSpecialPartWarrantyPolicyEdit',
      component: () => import('@/views/claimreturn/basic/vehicleSpecialPartWarrantyPolicy/edit.vue'),

      meta: {
        name: '整车特殊零件保修政策设置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/basic/vehicleWarrantyPolicy',
      name: 'vehicleWarrantyPolicy',
      component: () => import('@/views/claimreturn/basic/vehicleWarrantyPolicy/index.vue'),

      meta: {
        name: '整车保修政策设置管理',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/basic/vehiclewarrantypolicy/detail',
      name: 'vehicleWarrantyPolicyDetail',
      component: () => import('@/views/claimreturn/basic/vehicleWarrantyPolicy/detail.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/basic/vehiclewarrantypolicy/edit',
      name: 'vehicleWarrantyPolicyEdit',
      component: () => import('@/views/claimreturn/basic/vehicleWarrantyPolicy/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/basic/partWarrantyPolicy',
      name: 'partWarrantyPolicy',
      component: () => import('@/views/claimreturn/basic/partWarrantyPolicy/index.vue'),

      meta: {
        name: '零件保修政策管理',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/basic/partwarrantypolicy/detail',
      name: 'partWarrantyPolicyDetail',
      component: () => import('@/views/claimreturn/basic/partWarrantyPolicy/detail.vue'),

      meta: {
        name: '零件保修政策详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/basic/partwarrantypolicy/edit',
      name: 'partWarrantyPolicyEdit',
      component: () => import('@/views/claimreturn/basic/partWarrantyPolicy/edit.vue'),

      meta: {
        name: '零件保修政策编辑',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/basic/partSpecialPartWarrantyPolicy',
      name: 'partSpecialPartWarrantyPolicy',
      component: () => import('@/views/claimreturn/basic/partSpecialPartWarrantyPolicy/index.vue'),

      meta: {
        name: '零件特殊零件保修政策管理',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/basic/partspecialpartwarrantypolicy/detail',
      name: 'partSpecialPartWarrantyPolicyDetail',
      component: () => import('@/views/claimreturn/basic/partSpecialPartWarrantyPolicy/detail.vue'),

      meta: {
        name: '零件特殊零件保修政策详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/basic/partspecialpartwarrantypolicy/edit',
      name: 'partSpecialPartWarrantyPolicyEdit',
      component: () => import('@/views/claimreturn/basic/partSpecialPartWarrantyPolicy/edit.vue'),

      meta: {
        name: '零件特殊零件保修编辑',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/supplierInfo',
      name: 'supplierInfo',
      component: () => import('@/views/sparepart/basic/supplierInfo/index.vue'),

      meta: {
        name: '新页面',
        keepAlive: true
      }
    }, {
      path: '/sparepart/basic/supplierinfo/detail',
      name: 'supplierInfoDetail',
      component: () => import('@/views/sparepart/basic/supplierInfo/detail.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/supplierinfo/edit',
      name: 'supplierInfoEdit',
      component: () => import('@/views/sparepart/basic/supplierInfo/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/sparePartSupplier',
      name: 'sparePartSupplier',
      component: () => import('@/views/sparepart/basic/sparePartSupplier/index.vue'),

      meta: {
        name: '新页面',
        keepAlive: true
      }
    }, {
      path: '/sparepart/basic/sparepartsupplier/detail',
      name: 'sparePartSupplierDetail',
      component: () => import('@/views/sparepart/basic/sparePartSupplier/detail.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/sparepartsupplier/edit',
      name: 'sparePartSupplierEdit',
      component: () => import('@/views/sparepart/basic/sparePartSupplier/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/sparePartReplacer',
      name: 'sparePartReplacer',
      component: () => import('@/views/sparepart/basic/sparePartReplacer/index.vue'),

      meta: {
        name: '新页面',
        keepAlive: true
      }
    }, {
      path: '/sparepart/basic/sparepartreplacer/detail',
      name: 'sparePartReplacerDetail',
      component: () => import('@/views/sparepart/basic/sparePartReplacer/detail.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/sparepartreplacer/edit',
      name: 'sparePartReplacerEdit',
      component: () => import('@/views/sparepart/basic/sparePartReplacer/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/sparePartPurchasePrice',
      name: 'sparePartPurchasePrice',
      component: () => import('@/views/sparepart/basic/sparePartPurchasePrice/index.vue'),

      meta: {
        name: '新页面'
      }
    }, {
      path: '/sparepart/basic/sparepartpurchaseprice/detail',
      name: 'sparePartPurchasePriceDetail',
      component: () => import('@/views/sparepart/basic/sparePartPurchasePrice/detail.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/sparepartpurchaseprice/edit',
      name: 'sparePartPurchasePriceEdit',
      component: () => import('@/views/sparepart/basic/sparePartPurchasePrice/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/sparePartSalesPrice',
      name: 'sparePartSalesPrice',
      component: () => import('@/views/sparepart/basic/sparePartSalesPrice/index.vue'),

      meta: {
        name: '新页面'
      }
    }, {
      path: '/sparepart/basic/sparepartsalesprice/detail',
      name: 'sparePartSalesPriceDetail',
      component: () => import('@/views/sparepart/basic/sparePartSalesPrice/detail.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/sparepartsalesprice/edit',
      name: 'sparePartSalesPriceEdit',
      component: () => import('@/views/sparepart/basic/sparePartSalesPrice/edit.vue'),
      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/basic/serviceActivityVehicle',
      name: 'serviceActivityVehicle',
      component: () => import('@/views/claimreturn/basic/serviceActivityVehicle/index.vue'),

      meta: {
        name: '新页面',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/basic/serviceactivityvehicle/detail',
      name: 'serviceActivityVehicleDetail',
      component: () => import('@/views/claimreturn/basic/serviceActivityVehicle/detail.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/basic/serviceactivityvehicle/edit',
      name: 'serviceActivityVehicleEdit',
      component: () => import('@/views/claimreturn/basic/serviceActivityVehicle/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/basic/serviceActivity',
      name: 'serviceActivity',
      component: () => import('@/views/claimreturn/web/basic/serviceActivity/index.vue'),

      meta: {
        name: '新页面',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/basic/serviceactivity/detail',
      name: 'serviceActivityDetail',
      component: () => import('@/views/claimreturn/web/basic/serviceActivity/detail.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/basic/serviceactivity/edit',
      name: 'serviceActivityEdit',
      component: () => import('@/views/claimreturn/web/basic/serviceActivity/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/basic/freeMaintenancePolicy',
      name: 'freeMaintenancePolicy',
      component: () => import('@/views/claimreturn/basic/freeMaintenancePolicy/index.vue'),

      meta: {
        name: '新页面',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/basic/freemaintenancepolicy/detail',
      name: 'freeMaintenancePolicyDetail',
      component: () => import('@/views/claimreturn/basic/freeMaintenancePolicy/detail.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/basic/freemaintenancepolicy/edit',
      name: 'freeMaintenancePolicyEdit',
      component: () => import('@/views/claimreturn/basic/freeMaintenancePolicy/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/basic/freeMaintenancePolicy',
      name: 'freeMaintenancePolicy',
      component: () => import('@/views/claimreturn/basic/freeMaintenancePolicy/index.vue'),

      meta: {
        name: '新页面',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/basic/freemaintenancepolicy/detail',
      name: 'freeMaintenancePolicyDetail',
      component: () => import('@/views/claimreturn/basic/freeMaintenancePolicy/detail.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/basic/freemaintenancepolicy/edit',
      name: 'freeMaintenancePolicyEdit',
      component: () => import('@/views/claimreturn/basic/freeMaintenancePolicy/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }]
  }
];

// 作为子应用时，重定向会导致路由出错
if (!window.__POWERED_BY_QIANKUN__) {
  routes.push({
    path: '*',
    redirect: '/404',
    hidden: true,
    meta: {
      backSwitch: 'both',
      noResourceUrl: true
    }
  });
}

function toLoginPage (to, next) {
  if (window.__POWERED_BY_QIANKUN__) {
    window.location.href = '/login?redirect=' + to.fullPath;
  } else {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  }
}
export function getRouter () {
  const appPrefix = process.env.VUE_APP_ROUTER_BASE;
  const router = new VueRouter({
    base: `${appPrefix}/`,
    mode: 'history',
    routes
  });
  router.beforeEach((to, from, next) => {
    if (to.matched?.some(record => record.meta.requiresAuth)) {
      // 需要登录
      if (!store.state.user.token || store.state.user.token === '') {
        toLoginPage(to, next);
        return;
      }
      // 开发阶段先跳过权限验证
      if (localStorage.getItem('sourceUrl').includes(to.path) || to.meta.noResourceUrl) {
      // if (true) {
        next();
      } else {
        window.alert('你没有访问该页面的权限');
        if (store.state.user.token) {
          next({
            path: '/home'
          });
        } else {
          toLoginPage(to, next);
        }
      }
    }
    next();
  });
  return router;
}
