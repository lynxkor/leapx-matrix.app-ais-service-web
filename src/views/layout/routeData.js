// 详情转换路由
export function changeRoute (routePath) {
  var strRoute = '';
  console.log('routePath:', routePath);
  switch (routePath) {
    // 用户详情页面
    case '/user/list/detail':
      strRoute = '/user/list';
      break;
    // 用户编辑页面
    case '/user/list/edit':
      strRoute = '/user/list';
      break;
    // 岗位编辑页面
    case '/user/post/edit':
      strRoute = '/user/post/list';
      break;
    // 业务分类基础管理
    case '/page-source/businessWork':
      strRoute = '/page-source/addBusiness';
      break;
    // 字段名称配置
    case '/page-source/newsNameWork':
      strRoute = '/page-source/newsName';
      break;
    // 规则字段配置
    case '/page-source/newsRuleWork':
      strRoute = '/page-source/newsRule';
      break;
    // 消息变量
    case '/page-source/VariateWork':
      strRoute = '/page-source/newsVariate';
      break;
    // 模板管理
    case '/process-message/newsModelWork':
      strRoute = '/process-message/newsModel';
      break;
    // 触发器管理
    case '/process-message/newsPushWork':
      strRoute = '/process-message/newsPush';
      break;
    // 原始线索详情
    case '/marketManage/oriclueDetail':
      strRoute = '/marketManage/originClues';
      break;
    // 接入渠道线索
    case '/channel/add':
      strRoute = '/channel/list';
      break;
    case '/channel/edit':
      strRoute = '/channel/list';
      break;
    // 留资二维码配置
    case '/marketManage/capitalConfiguration/detail':
      strRoute = '/marketManage/capitalConfiguration/list';
      break;
    // 活动结果
    case '/marketActive/actionResult':
      strRoute = '/marketActive/activeList';
      break;
    // 申请活动详情
    case '/marketActive/activeDetail':
      strRoute = '/marketActive/applyList';
      break;
    // 活动变更详情
    case '/marketActive/activeChangeDetail':
      strRoute = '/marketActive/activeChangeList';
      break;
    // 活动核销详情
    case '/marketActive/checkDetail':
      strRoute = '/marketActive/activeCancelAfterVerificationList';
      break;
    // 活动申请核销
    case '/marketActive/checkApply':
      strRoute = '/marketActive/activeList';
      break;
    // 广告投放
    case '/marketActive/eventDetails':
      strRoute = '/marketActive/advertisingList';
      break;
    // DCC线索清洗任务详情
    case '/marketManage/cultiveDetail3':
      strRoute = '/marketManage/cultiveList';
      break;
    // DCC潜客回捞列表详情
    case '/marketManage/callbackDetailNew':
      strRoute = '/marketManage/retrieveTheTaskList';
      break;
    // 暂败潜客回访详情
    case '/marketManage/callbackDetail':
      strRoute = '/marketManage/potentialCustomersCallbackList';
      break;
    // DCC潜客跟进详情
    case '/marketManage/cleanLatentGuestListDetail':
      strRoute = '/marketManage/cleanLatentGuestList';
      break;
    // AI外呼配置详情
    case '/marketManage/AiConfigurationDetail':
      strRoute = '/marketManage/AiConfiguration';
      break;
    // 城市线索抢占详情
    case '/marketManage/cityRobclueDetail':
      strRoute = '/marketManage/cityRobclues';
      break;
    // 跟进详情
    case '/saleManage/saleFollowDetail':
      strRoute = '/saleManage/saleFollow';
      break;
    // 预约详情
    case '/saleManage/appointDetail':
      strRoute = '/saleManage/appointList';
      break;
    // 门店报备详情
    case '/saleManage/storeFilingRecordDetails':
      strRoute = '/saleManage/storeFilingRecord';
      break;
    // 外出服务任务详情
    case '/serviceManagement/carOwnerService/outServiceTaskDetail':
      strRoute = '/serviceManagement/carOwnerService/outServiceTaskManagement';
      break;
    // 救援订单详情
    case '/rescue/detail':
      strRoute = '/rescue/collect';
      break;
    // 技术支持报告流程
    case '/diseases/technical/TechnicalReportProcess':
      strRoute = '/diseases/technical/list';
      break;
    // 网宣素材详情
    case '/market/interDetail':
      strRoute = '/market/interList';
      break;
    // 物料素材详情
    case '/market/materialDownload':
      strRoute = '/market/materialList';
      break;
    // 物料素材编辑
    case '/market/materialEdit':
      strRoute = '/market/materialList';
      break;
    // 公告详情
    case '/operationsManagement/notice/detail':
      strRoute = '/operationsManagement/notice/list';
      break;
    // 公告编辑
    case '/operationsManagement/notice/edit':
      strRoute = '/operationsManagement/notice/list';
      break;
    // 常见问题详情
    case '/comproblem/detail':
      strRoute = '/comproblem/list';
      break;
    // 常见问题编辑
    case '/comproblem/edit':
      strRoute = '/comproblem/list';
      break;
    // 操作手册编辑
    case '/manual/edit':
      strRoute = '/manual/list';
      break;
    // 反馈列表详情
    case '/problem/feedDetail':
      strRoute = '/problem/feedList';
      break;
    // 故障处置详情
    case '/report/serverRate/feedbackReportDetail':
      strRoute = '/report/serverRate/feedbackReport';
      break;
    // 版本编辑
    case '/system/app/version/detail':
      strRoute = '/system/app/version/list';
      break;
    // 广告页编辑
    case '/system/app/ad/detail':
      strRoute = '/system/app/ad/list';
      break;
    // 资源位
    case '/resource/edit':
      strRoute = '/resource/list';
      break;
    // 安装详情
    case '/uuevc/InstallOrderManageDetails':
      strRoute = '/uuevc/InstallOrderManage';
      break;
    // 维修详情
    case '/uuevc/repairOrderDetailsManage':
      strRoute = '/uuevc/repairOrderManage';
      break;
    // 工单详情
    case '/process/detail':
      strRoute = '/process/all';
      break;
    // 工单修改
    case '/process/record':
      strRoute = '/process/all';
      break;
    // 销售机会查询详情
    case '/saleManage/chanceDetail':
      strRoute = '/saleManage/chanceList';
      break;

    // 零跑潜客详情
    case '/saleManage/potenDetail':
      strRoute = '/saleManage/potenList';
      break;

    // 门店潜客查询详情
    case '/saleManage/storePotentialCustomDetail':
      strRoute = '/saleManage/storePotentialCustomList';
      break;

    // 试驾记录查询详情
    case '/saleManage/testDriveDetail':
      strRoute = '/saleManage/testDriveList';
      break;

    // 质检申诉查询详情
    case '/saleManage/QCappealInfo':
      strRoute = '/saleManage/QCappealList';
      break;

    // 质检申诉查询详情
    case '/system/app/consultative/detail':
      strRoute = '/system/app/consultative/list';
      break;
    // 新增PDI检查
    case '/zcwms/addPdi':
      strRoute = '/zcwms/pdiCheck';
      break;
    // 新增商品车日常维护
    case '/zcwms/addDailyInspection':
      strRoute = '/zcwms/dailyInspection';
      break;
    // 商品车电量管理
    case '/zcwms/electricityInspectionDetail':
      strRoute = '/zcwms/electricityInspection';
      break;

    // 体验工程师外呼质检得分详情
    case '/report/salesQuality/tyGcsOutboundScoreDetail':
      strRoute = '/report/salesQuality/tyGcsOutboundScore';
      break;

    // 门店外呼质检得分详情
    case '/report/salesQuality/shopOutboundScoreDetail':
      strRoute = '/report/salesQuality/shopOutboundScore';
      break;

    // 体验工程师试乘试驾质检得分详情
    case '/report/salesQuality/tyGcsTestDriveScoreDetail':
      strRoute = '/report/salesQuality/tyGcsTestDriveScore';
      break;

    // 门店试乘试驾得分详情
    case '/report/salesQuality/shopTestDriveScoreDetail':
      strRoute = '/report/salesQuality/shopTestDriveScore';
      break;

    // 查看记录
    case '/user/taskDesigningDel':
      strRoute = '/user/taskDesigning';
      break;
    // 异常账号管理
    case '/user/abnormalAccountDel':
      strRoute = '/user/abnormalAccount';
      break;
    // 网发投资人详情
    case '/channelManagement/investorDetails':
      strRoute = '/channelManagement/investor';
      break;
    // 网发仓库详情
    case '/channelManagement/warehouseDetails':
      strRoute = '/channelManagement/warehouseList';
      break;

    // 网发母公司详情
    case '/channelManagement/parentCompanyDetails':
      strRoute = '/channelManagement/parentCompany';
      break;

    // 网发门店详情
    case '/channelManagement/shopBasicsMessageDetails':
      strRoute = '/channelManagement/shopBasicsMessage';
      break;

    // 网发日志
    case '/channelManagement/logStore':
      strRoute = '/channelManagement/shopBasicsMessage';
      break;

    // 网发日志
    case '/channelManagement/logParentCompany':
      strRoute = '/channelManagement/parentCompany';
      break;

    // 验收信息
    case '/channelManagement/checkAcceptDetail':
      strRoute = '/channelManagement/checkAccept';
      break;

    // 网发入网审核管理——经销商入网申请详情
    case '/channelManagement/networkAuditDetail':
      strRoute = '/channelManagement/networkAuditManagement';
      break;

    // 网发入网申请列表——经销商入网申请详情
    case '/channelManagement/applyDetail':
      strRoute = '/channelManagement/applyList';
      break;

    // 网发网点新增申请列表——经销商网点新增详情
    case '/channelManagement/dealerNetworkAddDetail':
      strRoute = '/channelManagement/networkAddApply';
      break;

    // 网发网点新增申请列表——经销商网点新增'/zcwms/pdiCheck'
    case '/channelManagement/dealerNetworkAddApply':
      strRoute = '/channelManagement/networkAddApply';
      break;

    // 网发网点新增管理列表——经销商网点新增详情
    case '/channelManagement/networkAddManagementDetail':
      strRoute = '/channelManagement/networkAddManagement';
      break;

    // 网发网点升级管理列表——经销商网点升级详情
    case '/channelManagement/StoreUpgradeManagementDetail':
      strRoute = '/channelManagement/StoreUpgradeManagement';
      break;

    // 网发退网申请管理——退网详情
    case '/channelManagement/exitNetworkManageDetail':
      strRoute = '/channelManagement/exitNetworkManageList';
      break;

    // 网发退网申请管理——退网详情
    case '/channelManagement/exitNetworkManageDetailNew':
      strRoute = '/channelManagement/exitNetworkManageList';
      break;

    // 网发网商变更申请列表——网商重大变更管理新增
    case '/channelManagement/outletChangeApply':
      strRoute = '/channelManagement/outletChangeApplyList';
      break;

    // 网发网商变更申请列表——网商重大变更申请详情
    case '/channelManagement/outletChangeDetail':
      strRoute = '/channelManagement/outletChangeApplyList';
      break;

    // 网发网商变更申请列表——网商重大变更管理详情
    case '/channelManagement/outletChangeManageDetail':
      strRoute = '/channelManagement/outletChangeManageList';
      break;

    // 网发网商变更申请列表——硬件变更管理新增
    case '/channelManagement/hardwareChangeApply':
      strRoute = '/channelManagement/hardwareChangeApply/list';
      break;

    // 网发网商变更申请列表——硬件变更申请详情
    case '/channelManagement/hardwareChangeDetail':
      strRoute = '/channelManagement/hardwareChangeApply/list';
      break;

    // 网发网商变更申请列表——硬件变更管理详情
    case '/channelManagement/hardwareChangeManageDetail':
      strRoute = '/channelManagement/hardwareChangeManageList';
      break;

    // 网发网商变更申请列表——一般变更新增
    case '/channelManagement/ordinaryChangeApply':
      strRoute = '/channelManagement/ordinaryChangeApply/list';
      break;

    // 网发网商变更申请列表——一般变更申请详情
    case '/channelManagement/ordinaryChangeDetail':
      strRoute = '/channelManagement/ordinaryChangeApply/list';
      break;

    // 网发网商变更申请列表——一般变更管理详情
    case '/channelManagement/ordinaryChangeManageDetail':
      strRoute = '/channelManagement/ordinaryChangeManageList';
      break;

    // 网发网商变更申请列表——网商变更详情
    case '/thread/passengerFlowReceptionInfo':
      strRoute = '/thread/passengerFlowReceptionList';
      break;

    // 试驾车库详情
    case '/saleManage/testDriveCarDetail':
      strRoute = '/dataBase/testDrive';
      break;

    // 展车详情
    case '/saleManage/showCarDetail':
      strRoute = '/saleManage/showCarList';
      break;
    // 售后预约单详情
    case '/report/serverRate/storeAppointment/detail':
      strRoute = '/report/serverRate/storeAppointment';
      break;

    // 明星直播视频看板详情
    case '/marketActive/starLiveVideoKanbanInfo':
      strRoute = '/marketActive/starLiveVideoKanban';
      break;

    // 服务产品工单详情
    case '/serviceManagement/servingProductWorkOrder/detail':
      strRoute = '/serviceManagement/servingProductWorkOrder/list';
      break;
    // checklist填写（媒介）
    case '/schedulingManagement/checkListFillInDel/medium':
      strRoute = '/schedulingManagement/checkoutListFormedium';
      break;
    // checklist填写（内容）
    case '/schedulingManagement/checkListFillInDel/content':
      strRoute = '/schedulingManagement/checkoutListForContent';
      break;
    // checklist填写（媒体关系）
    case '/schedulingManagement/checkListFillInDel/mediaRelations':
      strRoute = '/schedulingManagement/checkoutListFormediaRelations';
      break;
    // 年度预算
    case '/projectManagement/creatAnnual':
      strRoute = '/projectManagement/annualBud';
      break;
    case '/projectManagement/detailAnnual':
      strRoute = '/projectManagement/annualBud';
      break;
    // 车型营销
    case '/projectManagement/vehicleDetail':
      strRoute = '/projectManagement/vehicleMaster';
      break;
    // 合作平台预算
    case '/projectManagement/cooperationPlatform':
      strRoute = '/projectManagement/addVehic';
      break;
    case '/projectManagement/cooperationDetail':
      strRoute = '/projectManagement/vehicleMaster';
      break;
    // 子项目预算
    case '/projectManagement/subItemBudget':
      strRoute = '/projectManagement/addVehic';
      break;
    case '/projectManagement/subItemBudDetail':
      strRoute = '/projectManagement/vehicleMaster';
      break;
    // 排期管理通用
    case '/schedulingManagement/addSchedulinGeneric':
      strRoute = '/schedulingManagement/SchedulinGeneric';
      break;

    // 晨夕会审核详情
    case '/morningEveningManagement/auditDetails':
      strRoute = '/morningEveningManagement/auditList';
      break;

    // 检核库详情
    case '/auditManagement/checkCreationDetails':
      strRoute = '/auditManagement/checkList';
      break;

    // 日常运营点检详情
    case '/saleManage/dailyCheckDetail':
      strRoute = '/saleManage/dailyCheck';
      break;

    // 专项运营检核详情
    case '/saleManage/specialProjectCheckDetail':
      strRoute = '/saleManage/specialProjectCheck';
      break;

    // 总部走访点检详情
    case '/saleManage/headOfficeVisitCheckDetail':
      strRoute = '/saleManage/headOfficeVisitCheck';
      break;

    // 总部运营活动详情
    case '/marketActive/headActivityDetail':
      strRoute = '/marketActive/headActiveList';
      break;

    // 总部运营活动结果
    case '/marketActive/headActivityActionResult':
      strRoute = '/marketActive/headActiveList';
      break;

    // 验收管理-编辑、新增、详情
    case '/schedulingManagement/acceptanceManagementdel':
      strRoute = '/schedulingManagement/acceptanceManagement';
      break;

    // 排期管理媒体关系
    case '/schedulingManagement/addSchedulinLarbry':
      strRoute = '/schedulingManagement/SchedulinLarbry';
      break;
    // 排期管理媒介
    case '/schedulingManagement/addSchedulinMedium':
      strRoute = '/schedulingManagement/SchedulinMedium';
      break;
    // 排期管理内容
    case '/schedulingManagement/addSchedulinContent':
      strRoute = '/schedulingManagement/SchedulinContent';
      break;
    // 排期管理内容
    case '/schedulingManagement/pushFilling':
      strRoute = '/schedulingManagement/PushFlowManagement';
      break;
    // 费用管控表
    case '/projectManagement/costTable':
      strRoute = '/projectManagement/vehicleMaster';
      break;
    // 项目管控表
    case '/projectManagement/projectTable':
      strRoute = '/projectManagement/vehicleMaster';
      break;
    // 实时报告生成详情
    case '/serviceManagement/intelligentDiagnosis/diagnosisReport/realTimeReportDetail':
      strRoute = '/serviceManagement/intelligentDiagnosis/diagnosisReport/realTimeReport';
      break;
    // 处置单详情
    case '/serviceManagement/intelligentDiagnosis/faultEarlyWarnDisposal/listToBeDealtDetail':
      strRoute = localStorage.getItem('listToBeDealtDetailFromPath');
      break;
    // 网发管理 -- 线索管理 -跟进任务管理 详情
    case '/channelManagement/clueManagement/followUpOnTaskDetail':
      strRoute = '/channelManagement/clueManagement/followUpOnTask';
      break;
    // 网发管理 -- 线索管理 -跟进任务管理 详情
    case '/channelManagement/clueManagement/followUpOnTaskApply':
      strRoute = '/channelManagement/clueManagement/followUpOnTask';
      break;
    // 网发管理 -- 线索管理 -跟进任务管理 跟进
    case '/channelManagement/clueManagement/followUpOnTaskFollowup':
      strRoute = '/channelManagement/clueManagement/followUpOnTask';
      break;
    default:
      strRoute = routePath;
  }
  // 菜单里配置的系统为/datacenter/xxx,这边补全菜单
  // 只影响单独运行时菜单行为
  const appPrefix = window.APP_AIS_WEB_CONFIG.VUE_APP_ROUTER_BASE;
  if (appPrefix && !strRoute.startsWith(appPrefix)) {
    return `${appPrefix}${strRoute}`;
  }
  return strRoute;
}
