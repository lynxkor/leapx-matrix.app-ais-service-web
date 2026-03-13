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
      requiresAuth: false,
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
        name: '备件适用车型',
        keepAlive: true
      }
    }, {
      path: '/sparepart/basic/sparepartvehiclemodel/detail',
      name: 'sparePartVehicleModelDetail',
      component: () => import('@/views/sparepart/basic/sparePartVehicleModel/detail.vue'),

      meta: {
        name: '备件适用车型详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/sparepartvehiclemodel/edit',
      name: 'sparePartVehicleModelEdit',
      component: () => import('@/views/sparepart/basic/sparePartVehicleModel/edit.vue'),

      meta: {
        name: '备件适用车型详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/spareSalesCategory',
      name: 'spareSalesCategory',
      component: () => import('@/views/sparepart/basic/spareSalesCategory/index.vue'),

      meta: {
        name: '备件营销分类',
        keepAlive: true
      }
    }, {
      path: '/sparepart/basic/sparesalescategory/detail',
      name: 'spareSalesCategoryDetail',
      component: () => import('@/views/sparepart/basic/spareSalesCategory/detail.vue'),

      meta: {
        name: '备件营销分类详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/sparesalescategory/edit',
      name: 'spareSalesCategoryEdit',
      component: () => import('@/views/sparepart/basic/spareSalesCategory/edit.vue'),

      meta: {
        name: '备件营销分类详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/spareSupplyCategory',
      name: 'spareSupplyCategory',
      component: () => import('@/views/sparepart/basic/spareSupplyCategory/index.vue'),

      meta: {
        name: '备件供应分类',
        keepAlive: true
      }
    }, {
      path: '/sparepart/basic/sparesupplycategory/detail',
      name: 'spareSupplyCategoryDetail',
      component: () => import('@/views/sparepart/basic/spareSupplyCategory/detail.vue'),

      meta: {
        name: '备件供应分类详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/sparesupplycategory/edit',
      name: 'spareSupplyCategoryEdit',
      component: () => import('@/views/sparepart/basic/spareSupplyCategory/edit.vue'),

      meta: {
        name: '备件供应分类详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/spareEngineeringCategory',
      name: 'spareEngineeringCategory',
      component: () => import('@/views/sparepart/basic/spareEngineeringCategory/index.vue'),

      meta: {
        name: '备件工程分类',
        keepAlive: true
      }
    }, {
      path: '/sparepart/basic/spareengineeringcategory/detail',
      name: 'spareEngineeringCategoryDetail',
      component: () => import('@/views/sparepart/basic/spareEngineeringCategory/detail.vue'),

      meta: {
        name: '备件工程分类详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/spareengineeringcategory/edit',
      name: 'spareEngineeringCategoryEdit',
      component: () => import('@/views/sparepart/basic/spareEngineeringCategory/edit.vue'),

      meta: {
        name: '备件工程分类详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/claim/basic/vrt',
      name: 'vrt',
      component: () => import('@/views/claimreturn/claim/basic/vrt/index.vue'),

      meta: {
        name: 'VRT',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/claim/basic/vrt/edit',
      name: 'vrtEdit',
      component: () => import('@/views/claimreturn/claim/basic/vrt/edit.vue'),

      meta: {
        name: '编辑VRT',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/claim/basic/vfg',
      name: 'vfg',
      component: () => import('@/views/claimreturn/claim/basic/vfg/index.vue'),

      meta: {
        name: '新页面',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/claim/basic/vfg/edit',
      name: 'vfgEdit',
      component: () => import('@/views/claimreturn/claim/basic/vfg/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/claim/basic/ccc',
      name: 'ccc',
      component: () => import('@/views/claimreturn/claim/basic/ccc/index.vue'),

      meta: {
        name: 'CCC管理',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/claim/basic/ccc/edit',
      name: 'cccEdit',
      component: () => import('@/views/claimreturn/claim/basic/ccc/edit.vue'),

      meta: {
        name: 'CCC编辑',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/claim/basic/vehicleSpecialPartWarrantyPolicy',
      name: 'vehicleSpecialPartWarrantyPolicy',
      component: () => import('@/views/claimreturn/claim/basic/vehicleSpecialPartWarrantyPolicy/index.vue'),

      meta: {
        name: '整车特殊零件保修政策设置管理',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/claim/basic/vehiclespecialpartwarrantypolicy/detail',
      name: 'vehicleSpecialPartWarrantyPolicyDetail',
      component: () => import('@/views/claimreturn/claim/basic/vehicleSpecialPartWarrantyPolicy/detail.vue'),

      meta: {
        name: '整车特殊零件保修政策设置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/claim/basic/vehiclespecialpartwarrantypolicy/edit',
      name: 'vehicleSpecialPartWarrantyPolicyEdit',
      component: () => import('@/views/claimreturn/claim/basic/vehicleSpecialPartWarrantyPolicy/edit.vue'),

      meta: {
        name: '整车特殊零件保修政策设置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/claim/basic/vehicleWarrantyPolicy',
      name: 'vehicleWarrantyPolicy',
      component: () => import('@/views/claimreturn/claim/basic/vehicleWarrantyPolicy/index.vue'),

      meta: {
        name: '整车保修政策设置管理',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/claim/basic/vehiclewarrantypolicy/edit',
      name: 'vehicleWarrantyPolicyEdit',
      component: () => import('@/views/claimreturn/claim/basic/vehicleWarrantyPolicy/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/claim/basic/partWarrantyPolicy',
      name: 'partWarrantyPolicy',
      component: () => import('@/views/claimreturn/claim/basic/partWarrantyPolicy/index.vue'),

      meta: {
        name: '零件保修政策管理',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/claim/basic/partwarrantypolicy/detail',
      name: 'partWarrantyPolicyDetail',
      component: () => import('@/views/claimreturn/claim/basic/partWarrantyPolicy/detail.vue'),

      meta: {
        name: '零件保修政策详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/claim/basic/partwarrantypolicy/edit',
      name: 'partWarrantyPolicyEdit',
      component: () => import('@/views/claimreturn/claim/basic/partWarrantyPolicy/edit.vue'),

      meta: {
        name: '零件保修政策编辑',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/claim/basic/partSpecialPartWarrantyPolicy',
      name: 'partSpecialPartWarrantyPolicy',
      component: () => import('@/views/claimreturn/claim/basic/partSpecialPartWarrantyPolicy/index.vue'),

      meta: {
        name: '零件特殊零件保修政策管理',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/claim/basic/partspecialpartwarrantypolicy/detail',
      name: 'partSpecialPartWarrantyPolicyDetail',
      component: () => import('@/views/claimreturn/claim/basic/partSpecialPartWarrantyPolicy/detail.vue'),

      meta: {
        name: '零件特殊零件保修政策详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/claim/basic/partspecialpartwarrantypolicy/edit',
      name: 'partSpecialPartWarrantyPolicyEdit',
      component: () => import('@/views/claimreturn/claim/basic/partSpecialPartWarrantyPolicy/edit.vue'),

      meta: {
        name: '零件特殊零件保修编辑',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/supplierInfo',
      name: 'supplierInfo',
      component: () => import('@/views/sparepart/basic/supplierInfo/index.vue'),

      meta: {
        name: '供应商主数据',
        keepAlive: true
      }
    }, {
      path: '/sparepart/basic/supplierinfo/detail',
      name: 'supplierInfoDetail',
      component: () => import('@/views/sparepart/basic/supplierInfo/detail.vue'),

      meta: {
        name: '供应商主数据详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/supplierinfo/edit',
      name: 'supplierInfoEdit',
      component: () => import('@/views/sparepart/basic/supplierInfo/edit.vue'),

      meta: {
        name: '供应商主数据详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/sparePartSupplier',
      name: 'sparePartSupplier',
      component: () => import('@/views/sparepart/basic/sparePartSupplier/index.vue'),

      meta: {
        name: '供应商备件关系',
        keepAlive: true
      }
    }, {
      path: '/sparepart/basic/sparepartsupplier/detail',
      name: 'sparePartSupplierDetail',
      component: () => import('@/views/sparepart/basic/sparePartSupplier/detail.vue'),

      meta: {
        name: '供应商备件关系详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/sparepartsupplier/edit',
      name: 'sparePartSupplierEdit',
      component: () => import('@/views/sparepart/basic/sparePartSupplier/edit.vue'),

      meta: {
        name: '供应商备件关系详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/sparePartReplacer',
      name: 'sparePartReplacer',
      component: () => import('@/views/sparepart/basic/sparePartReplacer/index.vue'),

      meta: {
        name: '备件替换件关系',
        keepAlive: true
      }
    }, {
      path: '/sparepart/basic/sparepartreplacer/detail',
      name: 'sparePartReplacerDetail',
      component: () => import('@/views/sparepart/basic/sparePartReplacer/detail.vue'),

      meta: {
        name: '备件替换件关系详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/sparepartreplacer/edit',
      name: 'sparePartReplacerEdit',
      component: () => import('@/views/sparepart/basic/sparePartReplacer/edit.vue'),

      meta: {
        name: '备件替换件关系详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/sparePartPurchasePrice',
      name: 'sparePartPurchasePrice',
      component: () => import('@/views/sparepart/basic/sparePartPurchasePrice/index.vue'),

      meta: {
        name: '备件采购价格'
      }
    }, {
      path: '/sparepart/basic/sparepartpurchaseprice/detail',
      name: 'sparePartPurchasePriceDetail',
      component: () => import('@/views/sparepart/basic/sparePartPurchasePrice/detail.vue'),

      meta: {
        name: '备件采购价格详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/sparepartpurchaseprice/edit',
      name: 'sparePartPurchasePriceEdit',
      component: () => import('@/views/sparepart/basic/sparePartPurchasePrice/edit.vue'),

      meta: {
        name: '备件采购价格详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/sparePartSalesPrice',
      name: 'sparePartSalesPrice',
      component: () => import('@/views/sparepart/basic/sparePartSalesPrice/index.vue'),

      meta: {
        name: '备件销售价格'
      }
    }, {
      path: '/sparepart/basic/sparepartsalesprice/detail',
      name: 'sparePartSalesPriceDetail',
      component: () => import('@/views/sparepart/basic/sparePartSalesPrice/detail.vue'),

      meta: {
        name: '备件销售价格详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/sparepartsalesprice/edit',
      name: 'sparePartSalesPriceEdit',
      component: () => import('@/views/sparepart/basic/sparePartSalesPrice/edit.vue'),
      meta: {
        name: '备件销售价格详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/sparePart',
      name: 'sparePart',
      component: () => import('@/views/sparepart/basic/sparePart/index.vue'),

      meta: {
        name: '备件主数据',
        keepAlive: true
      }
    }, {
      path: '/sparepart/basic/sparepart/detail',
      name: 'sparePartDetail',
      component: () => import('@/views/sparepart/basic/sparePart/detail.vue'),

      meta: {
        name: '备件主数据详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/sparepart/edit',
      name: 'sparePartEdit',
      component: () => import('@/views/sparepart/basic/sparePart/edit.vue'),

      meta: {
        name: '备件主数据详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/dealerSparePart',
      name: 'dealerSparePart',
      component: () => import('@/views/sparepart/basic/dealerSparePart/index.vue'),

      meta: {
        name: '外购件主数据',
        keepAlive: true
      }
    }, {
      path: '/sparepart/basic/dealerSparePart/edit',
      name: 'dealerSparePartEdit',
      component: () => import('@/views/sparepart/basic/dealerSparePart/edit.vue'),

      meta: {
        name: '外购件主数据详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/claim/basic/serviceActivityVehicle',
      name: 'serviceActivityVehicle',
      component: () => import('@/views/claimreturn/claim/basic/serviceActivityVehicle/index.vue'),

      meta: {
        keepAlive: true,
        name: '服务活动车辆',
        isServiceCareActivity: false,
        moduleKey: 'serviceActivityVehicle',
      }
    }, {
      path: '/claimreturn/claim/basic/serviceactivityvehicle/edit',
      name: 'serviceActivityVehicleEdit',
      component: () => import('@/views/claimreturn/claim/basic/serviceActivityVehicle/edit.vue'),

      meta: {
        noResourceUrl: 'true',
        name: '服务活动车辆',
        isServiceCareActivity: false,
        moduleKey: 'serviceActivityVehicle',
      }
    }, {
      path: '/claimreturn/claim/basic/serviceCareActivityVehicle',
      name: 'serviceActivityVehicle',
      component: () => import('@/views/claimreturn/claim/basic/serviceActivityVehicle/index.vue'),

      meta: {
        keepAlive: true,
        name: '服务关爱活动车辆',
        isServiceCareActivity: true,
        moduleKey: 'serviceCareActivityVehicle',
      }
    }, {
      path: '/claimreturn/claim/basic/serviceCareActivityVehicle/edit',
      name: 'serviceActivityVehicleEdit',
      component: () => import('@/views/claimreturn/claim/basic/serviceActivityVehicle/edit.vue'),

      meta: {
        noResourceUrl: 'true',
        name: '服务关爱活动车辆',
        isServiceCareActivity: true,
        moduleKey: 'serviceCareActivityVehicle',
      }
    }, {
      path: '/claimreturn/claim/basic/techServiceActivity',
      name: 'serviceActivity',
      component: () => import('@/views/claimreturn/claim/basic/techServiceActivity/index.vue'),

      meta: {
        name: '技术服务活动',
        keepAlive: true,
        isServiceCareActivity: false,
        moduleKey: 'techServiceActivity',
      }
    }, {
      path: '/claimreturn/claim/basic/techServiceActivity/edit',
      name: 'serviceActivityEdit',
      component: () => import('@/views/claimreturn/claim/basic/techServiceActivity/edit.vue'),

      meta: {
        name: '技术服务活动',
        noResourceUrl: 'true',
        isServiceCareActivity: false,
        moduleKey: 'techServiceActivity',
      }
    }, {
      path: '/claimreturn/claim/basic/serviceCareActivity',
      name: 'serviceActivity',
      component: () => import('@/views/claimreturn/claim/basic/techServiceActivity/index.vue'),
      meta: {
        keepAlive: true,
        name: '服务关爱活动',
        isServiceCareActivity: true,
        moduleKey: 'serviceCareActivity',
      }
    }, {
      path: '/claimreturn/claim/basic/serviceCareActivity/edit',
      name: 'serviceActivityEdit',
      component: () => import('@/views/claimreturn/claim/basic/techServiceActivity/edit.vue'),
      meta: {
        noResourceUrl: 'true',
        name: '服务关爱活动',
        isServiceCareActivity: true,
        moduleKey: 'serviceCareActivity',
      }
    }, {
      path: '/claimreturn/claim/basic/freeMaintenancePolicy',
      name: 'freeMaintenancePolicy',
      component: () => import('@/views/claimreturn/claim/basic/freeMaintenancePolicy/index.vue'),

      meta: {
        name: '新页面',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/claim/basic/freemaintenancepolicy/detail',
      name: 'freeMaintenancePolicyDetail',
      component: () => import('@/views/claimreturn/claim/basic/freeMaintenancePolicy/detail.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/claim/basic/freemaintenancepolicy/edit',
      name: 'freeMaintenancePolicyEdit',
      component: () => import('@/views/claimreturn/claim/basic/freeMaintenancePolicy/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/claim/basic/freeMaintenancePolicy',
      name: 'freeMaintenancePolicy',
      component: () => import('@/views/claimreturn/claim/basic/freeMaintenancePolicy/index.vue'),

      meta: {
        name: '新页面',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/claim/basic/freemaintenancepolicy/detail',
      name: 'freeMaintenancePolicyDetail',
      component: () => import('@/views/claimreturn/claim/basic/freeMaintenancePolicy/detail.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/claim/basic/freemaintenancepolicy/edit',
      name: 'freeMaintenancePolicyEdit',
      component: () => import('@/views/claimreturn/claim/basic/freeMaintenancePolicy/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/claim/basic/threeGuaranteesRule',
      name: 'threeGuaranteesRule',
      component: () => import('@/views/claimreturn/claim/basic/threeGuaranteesRule/index.vue'),

      meta: {
        name: '新页面',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/claim/basic/threeguaranteesrule/edit',
      name: 'threeGuaranteesRuleEdit',
      component: () => import('@/views/claimreturn/claim/basic/threeGuaranteesRule/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/purchaseMinAmount',
      name: 'purchaseMinAmount',
      component: () => import('@/views/sparepart/basic/purchaseMinAmount/index.vue'),

      meta: {
        name: '备件起订金额设置',
        keepAlive: true
      }
    }, {
      path: '/sparepart/basic/purchaseminamount/detail',
      name: 'purchaseMinAmountDetail',
      component: () => import('@/views/sparepart/basic/purchaseMinAmount/detail.vue'),

      meta: {
        name: '备件起订金额设置详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/purchaseminamount/edit',
      name: 'purchaseMinAmountEdit',
      component: () => import('@/views/sparepart/basic/purchaseMinAmount/edit.vue'),

      meta: {
        name: '备件起订金额设置详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/oldpart/basic/oldPartOemWarehouse',
      name: 'page',
      component: () => import('@/views/claimreturn/oldpart/basic/oldPartOemWarehouse/index.vue'),

      meta: {
        name: '新页面',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/oldpart/basic/oldpartoemwarehouse/edit',
      name: 'pageEdit',
      component: () => import('@/views/claimreturn/oldpart/basic/oldPartOemWarehouse/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/oldpart/basic/oldPartUnqualifiedConfig',
      name: 'oldPartUnqualifiedConfig',
      component: () => import('@/views/claimreturn/oldpart/basic/oldPartUnqualifiedConfig/index.vue'),

      meta: {
        name: '新页面',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/oldpart/basic/oldpartunqualifiedconfig/edit',
      name: 'oldPartUnqualifiedConfigEdit',
      component: () => import('@/views/claimreturn/oldpart/basic/oldPartUnqualifiedConfig/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/purchaseReminder',
      name: 'purchaseReminder',
      component: () => import('@/views/sparepart/basic/purchaseReminder/index.vue'),

      meta: {
        name: '备件采购提醒设置',
        keepAlive: true
      }
    }, {
      path: '/sparepart/basic/purchasereminder/detail',
      name: 'purchaseReminderDetail',
      component: () => import('@/views/sparepart/basic/purchaseReminder/detail.vue'),

      meta: {
        name: '备件采购提醒设置',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/purchasereminder/edit',
      name: 'purchaseReminderEdit',
      component: () => import('@/views/sparepart/basic/purchaseReminder/edit.vue'),

      meta: {
        name: '备件采购提醒设置详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/oldpart/inventory/dealer',
      name: 'page',
      component: () => import('@/views/claimreturn/oldpart/inventory/oem/index.vue'),

      meta: {
        name: '门店旧件库存',
        keepAlive: true,
        moduleKey: 'AISCR-oldPartDealerInventoryDetail',
        isDealerPage: true,
      }
    }, {
      path: '/claimreturn/oldpart/inventory/dealer/edit',
      name: 'pageEdit',
      component: () => import('@/views/claimreturn/oldpart/inventory/oem/edit.vue'),
      meta: {
        name: '门店旧件库存',
        noResourceUrl: 'true',
        moduleKey: 'AISCR-oldPartDealerInventoryDetail',
        isDealerPage: true,
      }
    }, {
      path: '/claimreturn/oldpart/inventory/oem',
      name: 'oemInventory',
      component: () => import('@/views/claimreturn/oldpart/inventory/oem/index.vue'),
      meta: {
        name: '主机厂旧件库存',
        keepAlive: true,
        moduleKey: 'AISCR-oldPartOemInventoryDetail',
        isDealerPage: false,
      }
    }, {
      path: '/claimreturn/oldpart/inventory/oem/edit',
      name: 'oemInventoryEdit',
      component: () => import('@/views/claimreturn/oldpart/inventory/oem/edit.vue'),
      meta: {
        name: '主机厂旧件库存',
        noResourceUrl: 'true',
        moduleKey: 'AISCR-oldPartOemInventoryDetail',
        isDealerPage: false,
      }
    }, {
      path: '/sparepart/warehouse/warehouse',
      name: 'warehouse',
      component: () => import('@/views/sparepart/warehouse/warehouse/index.vue'),

      meta: {
        name: '门店仓库',
        keepAlive: true
      }
    }, {
      path: '/sparepart/warehouse/warehouse/edit',
      name: 'warehouseEdit',
      component: () => import('@/views/sparepart/warehouse/warehouse/edit.vue'),

      meta: {
        name: '门店仓库详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/outbound/maintenanceOutboundOrder',
      name: 'maintenanceOutboundOrder',
      component: () => import('@/views/sparepart/outbound/maintenanceOutboundOrder/index.vue'),

      meta: {
        name: '维修出库',
        keepAlive: true
      }
    }, {
      path: '/sparepart/outbound/maintenanceoutboundorder/edit',
      name: 'maintenanceOutboundOrderEdit',
      component: () => import('@/views/sparepart/outbound/maintenanceOutboundOrder/edit.vue'),

      meta: {
        name: '维修出库详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/inbound/maintenanceReturnInbound',
      name: 'maintenanceReturnInbound',
      component: () => import('@/views/sparepart/inbound/maintenanceReturnInbound/index.vue'),

      meta: {
        name: '维修退料入库',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/inbound/maintenanceReturnInbound/edit',
      name: 'maintenanceReturnInboundEdit',
      component: () => import('@/views/sparepart/inbound/maintenanceReturnInbound/edit.vue'),

      meta: {
        name: '维修退料入库详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/oldpart/returnorder',
      name: 'oldpart-returnorder',
      component: () => import('@/views/claimreturn/oldpart/returnorder/index.vue'),
      meta: {
        name: '门店旧件回运单',
        returnType: '30',
        moduleKey: 'oldPartReturnOrder',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/oldpart/returnorder/edit',
      name: 'oldpart-returnorderEdit',
      component: () => import('@/views/claimreturn/oldpart/returnorder/edit.vue'),
      meta: {
        name: '门店旧件回运单',
        returnType: '30',
        moduleKey: 'oldPartReturnOrder',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/oldpart/returnorder/fast',
      name: 'fastReturnOrder',
      component: () => import('@/views/claimreturn/oldpart/returnorder/index.vue'),
      meta: {
        name: '旧件快返回运单',
        returnType: '40',
        moduleKey: 'oldPartReturnOrderFast',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/oldpart/returnorder/fast/edit',
      name: 'fastReturnOrderEdit',
      component: () => import('@/views/claimreturn/oldpart/returnorder/edit.vue'),
      meta: {
        name: '旧件快返回运单',
        returnType: '40',
        moduleKey: 'oldPartReturnOrderFast',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/oldpart/dealerReturnorder/fast',
      name: 'dealerReturnorder',
      component: () => import('@/views/claimreturn/oldpart/returnorder/index.vue'),
      meta: {
        name: '门店旧件快返回运单',
        returnType: '40',
        moduleKey: 'OldPartDealerReturnOrderFast',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/oldpart/dealerReturnorder/fast/edit',
      name: 'dealerReturnorderEdit',
      component: () => import('@/views/claimreturn/oldpart/returnorder/edit.vue'),
      meta: {
        name: '门店旧件快返回运单',
        returnType: '40',
        moduleKey: 'OldPartDealerReturnOrderFast',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/sp/serviceProxy',
      name: 'serviceProxy',
      component: () => import('@/views/maintain/sp/serviceProxy/index.vue'),

      meta: {
        name: '接车施工单管理',
        keepAlive: true
      }
    }, {
      path: '/maintain/sp/serviceproxy/edit',
      name: 'serviceProxyEdit',
      component: () => import('@/views/maintain/sp/serviceProxy/edit.vue'),

      meta: {
        name: '接车施工单管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/sp/preAuthRule',
      name: 'preAuthRule',
      component: () => import('@/views/maintain/sp/preAuthRule/index.vue'),

      meta: {
        name: '预授权申请',
        keepAlive: true
      }
    }, {
      path: '/maintain/sp/preAuthRule/edit',
      name: 'preAuthRuleEdit',
      component: () => import('@/views/maintain/sp/preAuthRule/edit.vue'),

      meta: {
        name: '预授权申请详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/fund/account',
      name: 'account',
      component: () => import('@/views/sparepart/fund/account/index.vue'),

      meta: {
        name: '备件现金账户',
        keepAlive: true,
        query: {
          type: 'FUND',
          name: '备件现金账户'
        }
      }
    }, {
      path: '/sparepart/fund/account/edit',
      name: 'accountEdit',
      component: () => import('@/views/sparepart/fund/account/edit.vue'),

      meta: {
        name: '备件现金账户详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/fund/accountRebate',
      name: 'accountRebate',
      component: () => import('@/views/sparepart/fund/account/index.vue'),

      meta: {
        name: '备件返利账户',
        keepAlive: true,
        query: {
          type: 'REBATE',
          name: '备件返利账户'
        }
      }
    }, {
      path: '/sparepart/fund/accountRebate/edit',
      name: 'accountRebateEdit',
      component: () => import('@/views/sparepart/fund/account/edit.vue'),

      meta: {
        name: '备件返利账户详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/warehouse/inventory',
      name: 'inventory',
      component: () => import('@/views/sparepart/warehouse/inventory/index.vue'),

      meta: {
        name: '厅店备件库存',
        keepAlive: true
      }
    }, {
      path: '/sparepart/warehouse/inventory/edit',
      name: 'inventoryEdit',
      component: () => import('@/views/sparepart/warehouse/inventory/edit.vue'),

      meta: {
        name: '厅店备件库存详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/purchasePrice',
      name: 'purchasePrice',
      component: () => import('@/views/sparepart/basic/purchasePrice/index.vue'),

      meta: {
        name: '备件采购价格',
        keepAlive: true
      }
    }, // 主机厂
    {
      path: '/sparepart/basic/purchaseprice/edit',
      name: 'purchasePriceEdit',
      component: () => import('@/views/sparepart/basic/purchasePrice/edit.vue'),

      meta: {
        name: '备件采购价格详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/warehouse/oemWarehouse',
      name: 'oemWarehouse',
      component: () => import('@/views/sparepart/warehouse/oemWarehouse/index.vue'),

      meta: {
        name: '主机厂仓库设置',
        keepAlive: true
      }
    }, // 主机厂
    {
      path: '/sparepart/warehouse/oemwarehouse/edit',
      name: 'oemWarehouseEdit',
      component: () => import('@/views/sparepart/warehouse/oemWarehouse/edit.vue'),

      meta: {
        name: '主机厂仓库设置详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/purchasePriceCoupon',
      name: 'purchasePriceCoupon',
      component: () => import('@/views/sparepart/basic/purchasePriceCoupon/index.vue'),

      meta: {
        name: '门店备件优惠券',
        keepAlive: true
      }
    }, // 门店销毁
    {
      path: '/sparepart/basic/purchasepricecoupon/edit',
      name: 'purchasePriceCouponEdit',
      component: () => import('@/views/sparepart/basic/purchasePriceCoupon/edit.vue'),

      meta: {
        name: '门店备件优惠券详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/sp/serviceStatement',
      name: 'serviceStatement',
      component: () => import('@/views/maintain/sp/serviceStatement/index.vue'),

      meta: {
        name: '结算单表管理',
        keepAlive: true
      }
    }, {
      path: '/maintain/sp/servicestatement/edit',
      name: 'serviceStatementEdit',
      component: () => import('@/views/maintain/sp/serviceStatement/edit.vue'),

      meta: {
        name: '结算单表管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/vehicle/vehicleProfile',
      name: 'vehicleProfile',
      component: () => import('@/views/datacenter/vehicle/vehicleProfile/index.vue'),

      meta: {
        name: '车辆档案管理',
        keepAlive: true
      }
    }, {
      path: '/datacenter/vehicle/vehicleprofile/edit',
      name: 'vehicleProfileEdit',
      component: () => import('@/views/datacenter/vehicle/vehicleProfile/edit.vue'),

      meta: {
        name: '车辆档案管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/vehicle/serviceProxyHis',
      name: 'serviceProxyHis',
      component: () => import('@/views/datacenter/vehicle/serviceProxyHis/index.vue'),

      meta: {
        name: '接车施工单-维修履历信息管理',
        keepAlive: true
      }
    }, {
      path: '/datacenter/vehicle/serviceProxyHis/edit',
      name: 'serviceProxyHisEdit',
      component: () => import('@/views/datacenter/vehicle/serviceProxyHis/edit.vue'),

      meta: {
        name: '接车施工单-维修履历信息管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/purchasePartSaleable',
      name: 'purchasePartSaleable',
      component: () => import('@/views/sparepart/basic/purchasePartSaleable/index.vue'),

      meta: {
        name: '订单类型采购备件设置',
        keepAlive: true
      }
    }, {
      path: '/sparepart/basic/purchasepartsaleable/edit',
      name: 'purchasePartSaleableEdit',
      component: () => import('@/views/sparepart/basic/purchasePartSaleable/edit.vue'),

      meta: {
        name: '订单类型采购备件设置详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/oldpart/outbound',
      name: 'outbound',
      component: () => import('@/views/claimreturn/oldpart/outbound/index.vue'),

      meta: {
        name: '新页面',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/oldpart/outbound/edit',
      name: 'outboundEdit',
      component: () => import('@/views/claimreturn/oldpart/outbound/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/oldpart/destroy/oldPartDestroyOrder',
      name: 'oldPartDestroyOrder',
      component: () => import('@/views/claimreturn/oldpart/destroy/oldPartDestroyOrder/index.vue'),

      meta: {
        name: '旧件销毁单',
        moduleKey: 'oldPartDestroyOrder',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/oldpart/destroy/oldpartdestroyorder/edit',
      name: 'oldPartDestroyOrderEdit',
      component: () => import('@/views/claimreturn/oldpart/destroy/oldPartDestroyOrder/edit.vue'),

      meta: {
        name: '旧件销毁单',
        moduleKey: 'oldPartDestroyOrder',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/oldpart/destroy/dealerOldPartDestroyOrder',
      name: 'oldPartDestroyOrder',
      component: () => import('@/views/claimreturn/oldpart/destroy/oldPartDestroyOrder/index.vue'),

      meta: {
        name: '门店旧件销毁单',
        moduleKey: 'dealerOldPartDestroyOrder',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/oldpart/destroy/dealerOldPartDestroyOrder/edit',
      name: 'oldPartDestroyOrderEdit',
      component: () => import('@/views/claimreturn/oldpart/destroy/oldPartDestroyOrder/edit.vue'),

      meta: {
        name: '门店旧件销毁单',
        moduleKey: 'dealerOldPartDestroyOrder',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/oldpart/basic/oldPartDestroyConfig',
      name: 'oldPartDestroyConfig',
      component: () => import('@/views/claimreturn/oldpart/basic/oldPartDestroyConfig/index.vue'),
      meta: {
        name: '旧件销毁设置',
      }
    }, {
      path: '/sparepart/basic/purchaseTimesLimit',
      name: 'purchaseTimesLimit',
      component: () => import('@/views/sparepart/basic/purchaseTimesLimit/index.vue'),

      meta: {
        name: '订单类型采购次数设置',
        keepAlive: true
      }
    }, {
      path: '/sparepart/basic/purchasetimeslimit/edit',
      name: 'purchaseTimesLimitEdit',
      component: () => import('@/views/sparepart/basic/purchaseTimesLimit/edit.vue'),

      meta: {
        name: '订单类型采购次数设置详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/sp/repairWorkRecord',
      name: 'spRepairWorkRecord',
      component: () => import('@/views/maintain/sp/repairWorkRecord/index.vue'),

      meta: {
        name: '质检记录',
        keepAlive: true
      }
    }, {
      path: '/maintain/basic/maintenancePartData',
      name: 'maintenancePartData',
      component: () => import('@/views/maintain/basic/maintenancePartData/index.vue'),

      meta: {
        name: '保养零件提醒表管理',
        keepAlive: true
      }
    }, {
      path: '/maintain/basic/maintenancepartdata/edit',
      name: 'maintenancePartDataEdit',
      component: () => import('@/views/maintain/basic/maintenancePartData/edit.vue'),

      meta: {
        name: '保养零件提醒表管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/claim/sparePartClaim',
      name: 'sparePartClaim',
      component: () => import('@/views/sparepart/claim/sparePartClaim/index.vue'),

      meta: {
        name: '备件索赔',
        keepAlive: true
      }
    }, {
      path: '/sparepart/claim/sparepartclaim/edit',
      name: 'sparePartClaimEdit',
      component: () => import('@/views/sparepart/claim/sparePartClaim/edit.vue'),

      meta: {
        name: '备件索赔详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/purchase/purchaseApply',
      name: 'purchaseApply',
      component: () => import('@/views/sparepart/purchase/purchaseApply/index.vue'),

      meta: {
        name: '备件采购申请',
        keepAlive: true
      }
    }, {
      path: '/sparepart/purchase/purchaseapply/edit',
      name: 'purchaseApplyEdit',
      component: () => import('@/views/sparepart/purchase/purchaseApply/edit.vue'),

      meta: {
        name: '备件采购申请详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/purchase/purchaseOrder',
      name: 'purchaseOrder',
      component: () => import('@/views/sparepart/purchase/purchaseOrder/index.vue'),

      meta: {
        name: '备件采购订单',
        keepAlive: true
      }
    }, {
      path: '/sparepart/purchase/purchaseorder/edit',
      name: 'purchaseOrderEdit',
      component: () => import('@/views/sparepart/purchase/purchaseOrder/edit.vue'),

      meta: {
        name: '备件采购订单详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/sp/repairRecord',
      name: 'repairRecord',
      component: () => import('@/views/maintain/sp/repairRecord/index.vue'),

      meta: {
        name: '返修记录',
        keepAlive: true
      }

    }, {
      path: '/sparepart/purchase/backOrder',
      name: 'backOrder',
      component: () => import('@/views/sparepart/purchase/backOrder/index.vue'),

      meta: {
        name: '备件缺货订单',
        keepAlive: true
      }
    }, {
      path: '/sparepart/purchase/backorder/edit',
      name: 'backOrderEdit',
      component: () => import('@/views/sparepart/purchase/backOrder/edit.vue'),

      meta: {
        name: '备件缺货订单详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/purchase/backorder/outOfStock/edit',
      name: 'backOrderOutOfStockEdit',
      component: () => import('@/views/sparepart/purchase/backOrder/outOfStock/edit.vue'),

      meta: {
        name: '备件缺货明细看板详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/warehouse/oemOutboundOrder',
      name: 'oemOutboundOrder',
      component: () => import('@/views/sparepart/warehouse/oemOutboundOrder/index.vue'),

      meta: {
        name: 'OEM出库单',
        keepAlive: true
      }
    }, {
      path: '/sparepart/warehouse/oemoutboundorder/edit',
      name: 'oemOutboundOrderEdit',
      component: () => import('@/views/sparepart/warehouse/oemOutboundOrder/edit.vue'),

      meta: {
        name: 'OEM出库单详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/return/returnOrder',
      name: 'returnOrder',
      component: () => import('@/views/sparepart/return/returnOrder/index.vue'),

      meta: {
        name: '备件退货单',
        keepAlive: true
      }
    }, {
      path: '/sparepart/return/returnorder/edit',
      name: 'returnOrderEdit',
      component: () => import('@/views/sparepart/return/returnOrder/edit.vue'),

      meta: {
        name: '备件退货单详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/return/returnExceptionalOrder',
      name: 'returnOrder',
      component: () => import('@/views/sparepart/return/returnException/index.vue'),

      meta: {
        name: '备件退货异常订单',
        keepAlive: true
      }
    }, {
      path: '/sparepart/inbound/inboundOrder',
      name: 'inboundOrder',
      component: () => import('@/views/sparepart/inbound/inboundOrder/index.vue'),

      meta: {
        name: '备件入库单',
        keepAlive: true
      }
    }, {
      path: '/sparepart/inbound/inboundorder/edit',
      name: 'inboundOrderEdit',
      component: () => import('@/views/sparepart/inbound/inboundOrder/edit.vue'),

      meta: {
        name: '备件入库单详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/warehouse/oemOutboundCallbackSetting',
      name: 'oemOutboundCallbackSetting',
      component: () => import('@/views/sparepart/warehouse/oemOutboundCallbackSetting/index.vue'),

      meta: {
        name: 'OEM出库单回传SAP开关',
        keepAlive: true
      }
    }, {
      path: '/sparepart/warehouse/oemoutboundcallbacksetting/edit',
      name: 'oemOutboundCallbackSettingEdit',
      component: () => import('@/views/sparepart/warehouse/oemOutboundCallbackSetting/edit.vue'),

      meta: {
        name: 'OEM出库单回传SAP开关详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/sys/consistencyIn',
      name: 'consistencyIn',
      component: () => import('@/views/sparepart/sys/consistencyIn/index.vue'),

      meta: {
        name: '外部回传接口信息',
        keepAlive: true
      }
    }, {
      path: '/sparepart/sys/consistencyin/edit',
      name: 'consistencyInEdit',
      component: () => import('@/views/sparepart/sys/consistencyIn/edit.vue'),

      meta: {
        name: '外部回传接口信息详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/sys/consistencyOut',
      name: 'consistencyOut',
      component: () => import('@/views/sparepart/sys/consistencyOut/index.vue'),

      meta: {
        name: '同步外部接口信息',
        keepAlive: true
      }
    }, {
      path: '/sparepart/fund/accountOperateApply',
      name: 'accountOperateApply',
      component: () => import('@/views/sparepart/fund/accountOperateApply/index.vue'),

      meta: {
        name: '备件返利充值管理',
        keepAlive: true,
        query: {
          type: 'RECHARGE',
          name: '备件返利充值管理'
        }
      }
    }, {
      path: '/sparepart/fund/accountoperateapply/edit',
      name: 'accountOperateApplyEdit',
      component: () => import('@/views/sparepart/fund/accountOperateApply/edit.vue'),

      meta: {
        name: '备件返利充值管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/fund/accountOperateDeductionApply',
      name: 'accountOperateApply',
      component: () => import('@/views/sparepart/fund/accountOperateApply/index.vue'),

      meta: {
        name: '备件返利扣款管理',
        keepAlive: true,
        query: {
          type: 'DEDUCTION',
          name: '备件返利扣款管理'
        }
      }
    }, {
      path: '/sparepart/fund/accountoperatedeductionapply/edit',
      name: 'accountOperateApplyEdit',
      component: () => import('@/views/sparepart/fund/accountOperateApply/edit.vue'),

      meta: {
        name: '备件返利扣款管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/purchase/backOrderReport',
      name: 'backOrderReport',
      component: () => import('@/views/sparepart/purchase/backOrderReport/index.vue'),

      meta: {
        name: '备件缺货看板',
        keepAlive: true
      }
    }, {
      path: '/maintain/basic/repairPackages',
      name: 'repairPackages',
      component: () => import('@/views/maintain/basic/repairPackages/index.vue'),

      meta: {
        name: '维修套餐管理',
        keepAlive: true
      }
    }, {
      path: '/maintain/basic/repairpackages/edit',
      name: 'repairPackagesEdit',
      component: () => import('@/views/maintain/basic/repairPackages/edit.vue'),

      meta: {
        name: '维修套餐详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/basic/dealerSupplierInfo',
      name: 'dealerSupplierInfo',
      component: () => import('@/views/sparepart/basic/dealerSupplierInfo/index.vue'),

      meta: {
        name: '外购件供应商主数据',
        keepAlive: true
      }
    }, {
      path: '/sparepart/basic/dealersupplierinfo/edit',
      name: 'dealerSupplierInfoEdit',
      component: () => import('@/views/sparepart/basic/dealerSupplierInfo/edit.vue'),

      meta: {
        name: '外购件供应商主数据详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/warehouse/oemInventory',
      name: 'oemInventory',
      component: () => import('@/views/sparepart/warehouse/oemInventory/index.vue'),

      meta: {
        name: '主机厂备件库存查询',
        keepAlive: true
      }
    }, {
      path: '/sparepart/warehouse/oeminventory/edit',
      name: 'oemInventoryEdit',
      component: () => import('@/views/sparepart/warehouse/oemInventory/edit.vue'),

      meta: {
        name: '主机厂备件库存查询详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/sp/qualityOrderReport',
      name: 'qualityOrderReport',
      component: () => import('@/views/maintain/sp/qualityOrderReport/index.vue'),

      meta: {
        name: '质量反馈报告表管理',
        keepAlive: true
      }
    }, {
      path: '/maintain/sp/qualityorderreport/edit',
      name: 'qualityOrderReportEdit',
      component: () => import('@/views/maintain/sp/qualityOrderReport/edit.vue'),

      meta: {
        name: '质量反馈报告表管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/claim/basic/warrantyHourSetting',
      name: 'warrantyHourSetting',
      component: () => import('@/views/claimreturn/claim/basic/warrantyHourSetting/index.vue'),

      meta: {
        name: '新页面',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/claim/basic/warrantyHourSetting/edit',
      name: 'warrantyHourSettingEdit',
      component: () => import('@/views/claimreturn/claim/basic/warrantyHourSetting/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/claim/basic/warrantyHourSetting',
      name: 'warrantyHourSetting',
      component: () => import('@/views/claimreturn/claim/basic/warrantyHourSetting/index.vue'),

      meta: {
        name: '新页面',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/claim/basic/warrantyhoursetting/edit',
      name: 'warrantyHourSettingEdit',
      component: () => import('@/views/claimreturn/claim/basic/warrantyHourSetting/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/inbound/dealerInboundOrder',
      name: 'dealerInboundOrder',
      component: () => import('@/views/sparepart/inbound/dealerInboundOrder/index.vue'),

      meta: {
        name: '外购件入库单',
        keepAlive: true
      }
    }, {
      path: '/sparepart/inbound/dealerinboundorder/edit',
      name: 'dealerInboundOrderEdit',
      component: () => import('@/views/sparepart/inbound/dealerInboundOrder/edit.vue'),

      meta: {
        name: '外购件入库单详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/outbound/dealerReturnOrder',
      name: 'dealerReturnOrder',
      component: () => import('@/views/sparepart/outbound/dealerReturnOrder/index.vue'),

      meta: {
        name: '外购件退货单',
        keepAlive: true
      }
    }, {
      path: '/sparepart/outbound/dealerreturnorder/edit',
      name: 'dealerReturnOrderEdit',
      component: () => import('@/views/sparepart/outbound/dealerReturnOrder/edit.vue'),

      meta: {
        name: '外购件退货单详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/sp/interestsGoods',
      name: 'interestsGoods',
      component: () => import('@/views/maintain/sp/interestsGoods/index.vue'),

      meta: {
        name: '权益商品',
        keepAlive: true
      }
    }, {
      path: '/maintain/sp/interestsgoods/edit',
      name: 'interestsGoodsEdit',
      component: () => import('@/views/maintain/sp/interestsGoods/edit.vue'),

      meta: {
        name: '权益商品详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/outbound/dealerOutboundOrder',
      name: 'dealerOutboundOrder',
      component: () => import('@/views/sparepart/outbound/dealerOutboundOrder/index.vue'),

      meta: {
        name: '内部领料申请',
        keepAlive: true
      }
    }, {
      path: '/sparepart/outbound/dealeroutboundorder/edit',
      name: 'dealerOutboundOrderEdit',
      component: () => import('@/views/sparepart/outbound/dealerOutboundOrder/edit.vue'),

      meta: {
        name: '内部领料申请详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/notify/notificationGroup',
      name: 'notificationGroup',
      component: () => import('@/views/sparepart/notify/notificationGroup/index.vue'),

      meta: {
        name: '通知组配置',
        keepAlive: true
      }
    }, {
      path: '/sparepart/notify/notificationgroup/edit',
      name: 'notificationGroupEdit',
      component: () => import('@/views/sparepart/notify/notificationGroup/edit.vue'),

      meta: {
        name: '通知组配置详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/warehouse/stockTaking',
      name: 'stockTaking',
      component: () => import('@/views/sparepart/warehouse/stockTaking/index.vue'),

      meta: {
        name: '库存盘点',
        keepAlive: true
      }
    }, {
      path: '/sparepart/warehouse/stocktaking/edit',
      name: 'stockTakingEdit',
      component: () => import('@/views/sparepart/warehouse/stockTaking/edit.vue'),

      meta: {
        name: '库存盘点详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/warehouse/stockTakingDifferences',
      name: 'stockTakingDifferences',
      component: () => import('@/views/sparepart/warehouse/stockTakingDifferences/index.vue'),

      meta: {
        name: '盘点差异单',
        keepAlive: true
      }
    }, {
      path: '/sparepart/warehouse/stocktakingdifferences/edit',
      name: 'stockTakingDifferencesEdit',
      component: () => import('@/views/sparepart/warehouse/stockTakingDifferences/edit.vue'),

      meta: {
        name: '盘点差异单详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/warehouse/sharedInventory',
      name: 'sharedInventory',
      component: () => import('@/views/sparepart/warehouse/sharedInventory/index.vue'),

      meta: {
        name: '共享呆滞件库存',
        keepAlive: true
      }
    }, {
      path: '/sparepart/warehouse/sharedinventory/edit',
      name: 'sharedInventoryEdit',
      component: () => import('@/views/sparepart/warehouse/sharedInventory/edit.vue'),

      meta: {
        name: '共享呆滞件库存详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/transfer/transferOutbound',
      name: 'transferOutbound',
      component: () => import('@/views/sparepart/transfer/transferOutbound/index.vue'),

      meta: {
        name: '备件调拨出库',
        keepAlive: true
      }
    }, {
      path: '/sparepart/transfer/transferoutbound/edit',
      name: 'transferOutboundEdit',
      component: () => import('@/views/sparepart/transfer/transferOutbound/edit.vue'),

      meta: {
        name: '备件调拨出库详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/transfer/transferInbound',
      name: 'transferInbound',
      component: () => import('@/views/sparepart/transfer/transferInbound/index.vue'),

      meta: {
        name: '备件调拨入库',
        keepAlive: true
      }
    }, {
      path: '/sparepart/transfer/transferinbound/edit',
      name: 'transferInboundEdit',
      component: () => import('@/views/sparepart/transfer/transferInbound/edit.vue'),

      meta: {
        name: '备件调拨入库详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/transfer/sharedTransferOutbound',
      name: 'sharedTransferOutbound',
      component: () => import('@/views/sparepart/transfer/sharedTransferOutbound/index.vue'),

      meta: {
        name: '共享备件调拨出库',
        keepAlive: true
      }
    }, {
      path: '/sparepart/transfer/sharedtransferoutbound/edit',
      name: 'sharedTransferOutboundEdit',
      component: () => import('@/views/sparepart/transfer/sharedTransferOutbound/edit.vue'),

      meta: {
        name: '共享备件调拨出库详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/transfer/sharedTransferInbound',
      name: 'sharedTransferInbound',
      component: () => import('@/views/sparepart/transfer/sharedTransferInbound/index.vue'),

      meta: {
        name: 'sharedTransferInbound',
        keepAlive: true
      }
    }, {
      path: '/sparepart/transfer/sharedtransferinbound/edit',
      name: 'sharedTransferInboundEdit',
      component: () => import('@/views/sparepart/transfer/sharedTransferInbound/edit.vue'),

      meta: {
        name: 'sharedTransferInbound详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/purchase/boToShareTransfer',
      name: 'boToShareTransfer',
      component: () => import('@/views/sparepart/purchase/boToShareTransfer/index.vue'),

      meta: {
        name: 'BO转共享调拨',
        keepAlive: true
      }
    }, {
      path: '/sparepart/purchase/botosharetransfer/edit',
      name: 'boToShareTransferEdit',
      component: () => import('@/views/sparepart/purchase/boToShareTransfer/edit.vue'),

      meta: {
        name: 'BO转共享调拨详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/sale/retailOrder',
      name: 'retailOrder',
      component: () => import('@/views/sparepart/sale/retailOrder/index.vue'),

      meta: {
        name: '备附件销售',
        keepAlive: true
      }
    }, {
      path: '/sparepart/sale/retailOrder/edit',
      name: 'retailOrderEdit',
      component: () => import('@/views/sparepart/sale/retailOrder/edit.vue'),

      meta: {
        name: '备附件销售详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/sparepart/purchase/shippingOrder',
      name: 'shippingOrder',
      component: () => import('@/views/sparepart/purchase/shippingOrder/index.vue'),

      meta: {
        name: '备件发运单',
        keepAlive: true
      }
    }, {
      path: '/sparepart/purchase/shippingorder/edit',
      name: 'shippingOrderEdit',
      component: () => import('@/views/sparepart/purchase/shippingOrder/edit.vue'),

      meta: {
        name: '备件发运单详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/claim/basic/warrantyPartManagementRateSetting',
      name: 'warrantyPartManagementRateSetting',

      component: () => import(
        '@/views/claimreturn/claim/basic/warrantyPartManagementRateSetting/index.vue'
      ),

      meta: {
        name: '新页面',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/claim/basic/warrantypartmanagementratesetting/edit',
      name: 'warrantyPartManagementRateSettingEdit',

      component: () => import(
        '@/views/claimreturn/claim/basic/warrantyPartManagementRateSetting/edit.vue'
      ),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/sp/ownersEquityOrder',
      name: 'ownersEquityOrder',
      component: () => import('@/views/maintain/sp/ownersEquityOrder/index.vue'),

      meta: {
        name: '商城订单管理',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/claim/basic/warrantyParameterConfig',
      name: 'warrantyParameterConfig',
      component: () => import('@/views/claimreturn/claim/basic/warrantyParameterConfig/edit.vue'),

      meta: {
        name: '保修参数设置',
        keepAlive: true
      }
    }, {
      path: '/maintain/sp/ownersequityorder/edit',
      name: 'ownersEquityOrderEdit',
      component: () => import('@/views/maintain/sp/ownersEquityOrder/edit.vue'),

      meta: {
        name: '商城订单详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/sp/vehRetention',
      name: 'vehRetention',
      component: () => import('@/views/maintain/sp/vehRetention/index.vue'),

      meta: {
        name: '留车项配置',
        keepAlive: true
      }
    }, {
      path: '/maintain/sp/vehretention/edit',
      name: 'vehRetentionEdit',
      component: () => import('@/views/maintain/sp/vehRetention/edit.vue'),

      meta: {
        name: '留车项配置详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/claim/basic/approvalRejectSetting',
      name: 'approvalRejectSetting',
      component: () => import('@/views/claimreturn/claim/basic/approvalRejectSetting/index.vue'),

      meta: {
        name: '审批驳回配置',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/claim/basic/approvalrejectsetting/edit',
      name: 'approvalRejectSettingEdit',
      component: () => import('@/views/claimreturn/claim/basic/approvalRejectSetting/edit.vue'),

      meta: {
        name: '审批驳回配置详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/claim/basic/warrantySettlementCalendar',
      name: 'warrantySettlementCalendar',
      component: () => import('@/views/claimreturn/claim/basic/warrantySettlementCalendar/index.vue'),

      meta: {
        name: '保修结算日历',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/claim/basic/warrantysettlementcalendar/edit',
      name: 'warrantySettlementCalendarEdit',
      component: () => import('@/views/claimreturn/claim/basic/warrantySettlementCalendar/edit.vue'),

      meta: {
        name: '保修结算日历详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/claimreturn/claim/basic/warrantyAttachmentSetting',
      name: 'warrantyAttachmentSetting',
      component: () => import('@/views/claimreturn/claim/basic/warrantyAttachmentSetting/index.vue'),

      meta: {
        name: '保修附件设置',
        keepAlive: true
      }
    }, {
      path: '/claimreturn/claim/basic/warrantyattachmentsetting/edit',
      name: 'warrantyAttachmentSettingEdit',
      component: () => import('@/views/claimreturn/claim/basic/warrantyAttachmentSetting/edit.vue'),

      meta: {
        name: '保修附件设置详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/file/attachmentConfig',
      name: 'attachmentConfig',
      component: () => import('@/views/file/attachmentConfig/index.vue'),
      meta: {
        name: '附件配置管理',
        keepAlive: true
      }
    }, {
      path: '/file/attachmentConfig/edit',
      name: 'attachmentConfigEdit',
      component: () => import('@/views/file/attachmentConfig/edit.vue'),
      meta: {
        name: '附件配置详情',
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

const appPrefix = process.env.VUE_APP_ROUTER_BASE;

export function getRouter () {
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
            path: '/404'
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
