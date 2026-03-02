#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { program } = require('commander');
const mustache = require('mustache');
const { exec } = require('child_process');
const recast = require('recast');
const parser = require('@babel/parser');

// 获取模板目录路径
const templatesDir = path.join(__dirname, '../templates');

// 设置命令行参数
program
  .version('1.0.0')
  .description('Vue2代码生成工具')
  .argument('<name>', '模块名称')
  .parse(process.argv);

// 获取参数
const [name] = program.args;
// 读取generate.json数据
const generateJson = require('./generate.json');
// 读取完成之后删除该文件
// fs.removeSync(path.join(__dirname, './generate.json'));

// 解析 name，支持目录结构
const nameParts = name.split('/');
const moduleName = nameParts.pop(); // 最后一部分作为模块名
const moduleDir = nameParts.join('/'); // 剩余部分作为目录路径

// 准备模板数据
const colsData = generateJson.list.filter(item => {
  return (item.format === 'date-time' || item.type === 'array' || item.description);
}).map((el, index) => {
  const key = el.key.toLowerCase();
  const isDate = el.format === 'date-time' || !!key.match(/time/);
  const isBoolean = el.type === 'boolean';
  const isSelect = !isBoolean && !!key.match(/type|status|state/);
  return {
    ...el,
    isFirst: index === 0,
    isDate,
    isBoolean,
    isSelect,
    description: el.description?.replace(/\(.*?\)/g, ''),
    isNormal: !isDate && !isSelect && !isBoolean,
  };
});
console.log(colsData, 'colsData');
const nameSplit = name.split('/').filter(el => el);
nameSplit.splice(1, 0, 'web');
const apiPath = nameSplit.join('/');
const isProForm = colsData.some(el => el.type === 'array');
const data = {
  title: generateJson.title,
  name: moduleName,
  nameLowerCase: moduleName.toLowerCase(),
  nameKebabCase: moduleName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
  nameCamelCase: moduleName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()),
  apiPath: apiPath,
  isProForm: true,
  modulePath: name.split('/').filter(el => el).join('/'),
  cols: colsData,
  searchList: colsData.filter(el => el.searchable),
  top1List: colsData.slice(0, 1),
  top2SearchList: colsData.filter(el => el.searchable).slice(0, 2),
  thirdSearchList: colsData.filter(el => el.searchable).slice(2, 3),
  lastSearchList: colsData.filter(el => el.searchable).slice(3),
};

// 创建vue文件
async function createFile ({ templateName, templatePath = '', outPath = '', outName = '' }) {
  try {
    const templateFile = path.join(templatesDir, templatePath + templateName);

    // 读取模板
    const template = await fs.readFile(templateFile, 'utf8');

    // 渲染模板
    const content = mustache.render(template, data, {}, ['{{{', '}}}']);

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
  console.log(newContent);

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

  for (const item of list) {
    await createFile(item);
  }

  await insertRoute();

  console.log('\n代码生成完成！');
}

// 执行主函数
main();
