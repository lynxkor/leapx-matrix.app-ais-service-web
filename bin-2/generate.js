#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { program } = require('commander');
// const mustache = require('mustache');
const Handlebars = require('handlebars'); //
const helpers = require('handlebars-helpers');
const { exec } = require('child_process');
const recast = require('recast');
const parser = require('@babel/parser');

// 注册所有 helpers
helpers({ handlebars: Handlebars });

Handlebars.registerHelper('yesNoFormat', function (value) {
  return value ? '是' : '否'; // 或其他映射
});
Handlebars.registerHelper('or', function (...args) {
  const options = args.pop();
  // 检查是否有任何一个条件为真
  return args.some(arg => arg);
});
// 注册返回布尔值的 helper
Handlebars.registerHelper('has', function (array, value) {
  return Array.isArray(array) && array.includes(value);
});
Handlebars.registerHelper('unless', function (condition, options) {
  if (!condition) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('fromIndex', function (array, startIndex) {
  if (!Array.isArray(array)) return [];
  return array.slice(startIndex); // 直接返回数组，不处理 options.fn
});

Handlebars.registerHelper('calc-width', function (list, options) {
  const count = list ? list.length : 0;
  if (count < 8) {
    return '';
  }
  return 160;
});

// 获取模板目录路径
const templatesDir = path.join(__dirname, '../templates-2');

// // 设置命令行参数
// program
//   .version('1.0.0')
//   .description('Vue2代码生成工具')
//   .argument('<name>', '模块名称')
//   .parse(process.argv);

// // 获取参数
// const [name] = program.args;

// 读取generate.json数据
const generateJson = require('./generate.json');
// 读取完成之后删除该文件
// fs.removeSync(path.join(__dirname, './generate.json'));

// 解析 name，支持目录结构
const nameParts = generateJson.path.split('/');
const moduleName = nameParts.pop(); // 最后一部分作为模块名

function handleList (list) {
  if (!list) {
    return [];
  }
  return list.map((el, index) => {
    const isDateRange = el.componentType === 'dateRange';
    const isDate = el.componentType === 'date';
    const isSearch = el.componentType === 'search';
    const isEnum = el.componentType === 'enum';
    const isInput = el.componentType === 'input';
    const isTextarea = el.componentType === 'textarea';
    const isBoolean = el.componentType === 'yesno';
    return {
      ...el,
      isFirst: index === 0,
      isDateRange,
      isDate,
      isSearch,
      isEnum,
      isInput,
      isTextarea,
      isBoolean,
      // isSelect,
      description: el.description?.replace(/\(.*?\)/g, ''),
      // isNormal: !isDate && !isSelect && !isBoolean,
    };
  });
}
const listPage = generateJson.listPage;
const searchList = handleList(listPage.searchList);
const tableList = handleList(listPage.tableList);
const detailList = handleList(listPage.detailList);

const detailPage = generateJson.detailPage || {};
const detailTable = handleList(detailPage.tableList);

// 弹窗
const dialogSearchList = handleList(detailPage.dialogSearchList);
const dialogTableList = handleList(detailPage.dialogTableList);
const pathPrefix = generateJson.pathPrefix;

const apiPath = pathPrefix + generateJson.path;
const modulePath = apiPath.split('/').filter((val) => val !== 'web').join('/');

const data = {
  title: generateJson.title,
  name: moduleName,
  nameLowerCase: moduleName.toLowerCase(),
  nameKebabCase: moduleName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
  nameCamelCase: moduleName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()),
  apiPath: apiPath,
  isProForm: true,
  modulePath: modulePath,
  pathPrefix,
  searchList,
  top2SearchList: searchList.slice(0, 2),
  thirdSearchList: searchList.slice(2, 3),
  lastSearchList: searchList.slice(3),
  tableList,
  detailList,
  // 列表页tabs接口
  tabsPath: listPage.tabsPath ? pathPrefix + listPage.tabsPath : '',
  //
  detailTable,
  isModalAddTable: detailTable.length > 0 && detailPage.tableType === 'modal-add',
  isReadonlyTable: detailTable.length > 0 && detailPage.tableType === 'readonly',
  isSearchAddTable: detailTable.length > 0 && detailPage.tableType === 'search-add',
  //
  detailApiPath: detailPage.detailApiPath ? pathPrefix + detailPage.detailApiPath : '',
  detailAddPath: detailPage.addPath ? pathPrefix + detailPage.addPath : '',
  detailSearchPath: detailPage.searchPath ? pathPrefix + detailPage.searchPath : '', // search-add下
  detailRemovePath: detailPage.removePath ? pathPrefix + detailPage.removePath : '',
  checkedList: generateJson.checkedList || [],
  //
  dialogSearchList,
  dialogTableList,
  dialogApiPath: detailPage.dialogApiPath ? pathPrefix + detailPage.dialogApiPath : '',
  // 附件
  fileConfig: generateJson.fileConfig,
};

// 创建vue文件
async function createFile ({ templateName, templatePath = '', outPath = '', outName = '' }) {
  try {
    const templateFile = path.join(templatesDir, templatePath + templateName);

    // 读取模板
    // const template = await fs.readFile(templateFile, 'utf8');

    // // 渲染模板
    // const content = mustache.render(template, data, {}, ['{{{', '}}}']);

    const templateContent = await fs.readFile(templateFile, 'utf8');
    const template = Handlebars.compile(templateContent, {
      noEscape: true, // 与 mustache 的 {{{ }}} 类似，不转义 HTML
    });
    const content = template(data);

    // 确定输出路径
    const baseOutputDir = `src/views/${data.modulePath}${templatePath}`;
    const outputDir = outPath || baseOutputDir;
    if (!(await fs.pathExists(outputDir))) {
      await fs.mkdir(outputDir, { recursive: true });
    }

    // 写入文件
    const outputFile = path.join(outputDir, outName || templateName);
    await fs.writeFile(outputFile, content);

    console.log(`✓ 成功生成文件: ${outputFile}`);
  } catch (error) {
    console.error('生成代码时出错:', error.message);
    process.exit(1);
  }
}

// 插入路由到 index.js 的 children 数组
async function insertRoute () {
  const routerFilePath = path.resolve(__dirname, '../src/router/index.js');
  let content = await fs.readFile(routerFilePath, 'utf8');

  // 解析 AST
  const ast = recast.parse(content, {
    parser: {
      parse: (code) => parser.parse(code, {
        sourceType: 'module', // 支持 import/export
        plugins: [
          'jsx', // 可选：支持 JSX 语法
          'classProperties', // 支持类属性
          'objectRestSpread', // 支持对象展开
          'optionalChaining' // 支持可选链
        ]
      })
    }
  });

  // 遍历 AST，找到 name 为 'index' 的路由对象
  recast.visit(ast, {
    visitVariableDeclarator (path) {
      if (path.value.id.name === 'routes') {
        const routesArray = path.value.init;

        // 遍历 routes 数组
        routesArray.elements.forEach(route => {
          if (route.properties) {
            const nameProp = route.properties.find(p => p.key.name === 'name');
            if (nameProp && nameProp.value.value === 'index') {
              // 找到 children 数组
              const childrenProp = route.properties.find(p => p.key.name === 'children');
              if (childrenProp) {
                // 构建列表页
                const indexRoute = recast.types.builders.objectExpression([
                  recast.types.builders.property(
                    'init',
                    recast.types.builders.identifier('path'),
                    recast.types.builders.stringLiteral(`/${data.modulePath}`)
                  ),
                  recast.types.builders.property(
                    'init',
                    recast.types.builders.identifier('name'),
                    recast.types.builders.stringLiteral(data.name)
                  ),
                  recast.types.builders.property(
                    'init',
                    recast.types.builders.identifier('component'),
                    recast.types.builders.arrowFunctionExpression(
                      [],
                      recast.types.builders.callExpression(
                        recast.types.builders.identifier('import'),
                        [recast.types.builders.stringLiteral(`@/views/${data.modulePath}/index.vue`)]
                      )
                    )
                  ),
                  recast.types.builders.property(
                    'init',
                    recast.types.builders.identifier('meta'),
                    recast.types.builders.objectExpression([
                      recast.types.builders.property(
                        'init',
                        recast.types.builders.identifier('name'),
                        recast.types.builders.stringLiteral(data.title)
                      ),
                      recast.types.builders.property(
                        'init',
                        recast.types.builders.identifier('keepAlive'),
                        recast.types.builders.booleanLiteral(true)
                      )
                    ])
                  )
                ]);

                // 插入新路由到 children 数组
                childrenProp.value.elements.push(indexRoute);

                // 构建详情页
                // const detailRoute = recast.types.builders.objectExpression([
                //   recast.types.builders.property(
                //     'init',
                //     recast.types.builders.identifier('path'),
                //     recast.types.builders.stringLiteral(`/${data.modulePath.toLowerCase()}/detail`)
                //   ),
                //   recast.types.builders.property(
                //     'init',
                //     recast.types.builders.identifier('name'),
                //     recast.types.builders.stringLiteral(data.name + 'Detail')
                //   ),
                //   recast.types.builders.property(
                //     'init',
                //     recast.types.builders.identifier('component'),
                //     recast.types.builders.arrowFunctionExpression(
                //       [],
                //       recast.types.builders.callExpression(
                //         recast.types.builders.identifier('import'),
                //         [recast.types.builders.stringLiteral(`@/views/${data.modulePath}/detail.vue`)]
                //       )
                //     )
                //   ),
                //   recast.types.builders.property(
                //     'init',
                //     recast.types.builders.identifier('meta'),
                //     recast.types.builders.objectExpression([
                //       recast.types.builders.property(
                //         'init',
                //         recast.types.builders.identifier('name'),
                //         recast.types.builders.stringLiteral(data.title + '详情')
                //       ),
                //       recast.types.builders.property(
                //         'init',
                //         recast.types.builders.identifier('noResourceUrl'),
                //         recast.types.builders.stringLiteral('true')
                //       )
                //     ])
                //   )
                // ]);

                // // 插入新路由到 children 数组
                // childrenProp.value.elements.push(detailRoute);

                // 构建编辑页
                const editRoute = recast.types.builders.objectExpression([
                  recast.types.builders.property(
                    'init',
                    recast.types.builders.identifier('path'),
                    recast.types.builders.stringLiteral(`/${data.modulePath.toLowerCase()}/edit`)
                  ),
                  recast.types.builders.property(
                    'init',
                    recast.types.builders.identifier('name'),
                    recast.types.builders.stringLiteral(data.name + 'Edit')
                  ),
                  recast.types.builders.property(
                    'init',
                    recast.types.builders.identifier('component'),
                    recast.types.builders.arrowFunctionExpression(
                      [],
                      recast.types.builders.callExpression(
                        recast.types.builders.identifier('import'),
                        [recast.types.builders.stringLiteral(`@/views/${data.modulePath}/edit.vue`)]
                      )
                    )
                  ),
                  recast.types.builders.property(
                    'init',
                    recast.types.builders.identifier('meta'),
                    recast.types.builders.objectExpression([
                      recast.types.builders.property(
                        'init',
                        recast.types.builders.identifier('name'),
                        recast.types.builders.stringLiteral(data.title + '详情')
                      ),
                      recast.types.builders.property(
                        'init',
                        recast.types.builders.identifier('noResourceUrl'),
                        recast.types.builders.stringLiteral('true')
                      )
                    ])
                  )
                ]);

                // 插入新路由到 children 数组
                childrenProp.value.elements.push(editRoute);
              }
            }
          }
        });
      }
      this.traverse(path);
    }
  });

  // 生成新代码
  const newContent = recast.print(ast).code;

  await fs.writeFile(routerFilePath, newContent);
  console.log('✓ 路由已插入到 src/router/index.js');

  // 执行 ESLint 格式化
  const cmd = 'npx eslint --ext .js src/router --fix';
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`ESLint 格式化失败: ${error.message}`);
      return;
    }
    if (stderr) {
      console.warn(`ESLint 警告: ${stderr}`);
      return;
    }
    console.log(`✓ ESLint 格式化完成: ${stdout}`);
  });
}

// 主函数
async function main () {
  const list = [
    { templateName: 'index.vue' },
    { templateName: 'edit.vue' },
    // { templateName: 'detail.vue' },
    // { templateName: 'editDialog.vue', templatePath: '/components/' },
    { templateName: 'api.js', outPath: `src/api/${data.modulePath}`, outName: 'index.js' }
  ];
  if (data.isModalAddTable) {
    list.push({
      templatePath: '/components/',
      templateName: 'ModalAddTable.vue',
    }, {
      templatePath: '/components/',
      templateName: 'AddDataDialog.vue',
    });
  } else if (data.isReadonlyTable) {
    list.push({
      templatePath: '/components/',
      templateName: 'ModalAddTable.vue',
    });
  } else if (data.isSearchAddTable) {
    list.push({
      templatePath: '/components/',
      templateName: 'SearchAddTable.vue',
    });
  }

  for (const item of list) {
    await createFile(item);
  }

  await insertRoute();

  console.log('\n代码生成完成！');
}

// 执行主函数
main();
