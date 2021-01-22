module.exports = {
  title: 'I衡水管理系统',

  /**
   * 是否系统布局配置
   */
  showSettings: false,

  /**
   * 是否显示 tagsView
   */
  tagsView: true,

  /**
   * 是否固定头部
   */
  // fixedHeader: false,
  fixedHeader: true,

  /**
   * 是否显示logo
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',
  // 图片请求地址封装
  // I衡水---开发环境
  address: "http://10.92.119.10/",
  // I衡水---测试环境 
  // 外网：121.17.30.245/248   内网：10.100.5.102/105
  // address: 'http://121.17.30.245:3000/',
  // address: 'http://121.17.30.248:3000/',
  // I衡水---生成环境
  // address: 'http://218.11.12.14:3000/',
  // address: 'http://218.11.12.14:3000/images/',
}
