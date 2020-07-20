let _Vue = null
export default class VueRouter {
  /*
// 1. 添加全局方法或属性
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }

  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })

  // 3. 注入组件
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })

  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
  */

  // 静态方法 安装vue-router
  static install (Vue) {
    // 1. 判断当前插件是否被安装
    if (VueRouter.install.installed) {
      return
    }
    VueRouter.install.installed = true
    // 2. 把Vue构造函数记录到全局变量
    _Vue = Vue
    // 3. 把创建Vue实例时候传入的router对象注入到Vue实例上
    // _Vue.prototype.$router = this.$options.router
    // 混入
    _Vue.mixin({
      beforeCreate () {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
          this.$options.router.init()
        }
      }
    })
  }

  // 构造方法
  constructor (options) {
    this.options = options
    this.routerMap = {}
    // _Vue.observable vue用来创建响应式的对象,data数据变了会出发界面渲染
    const temp = this.options.mode || 'hash'
    this.mode = temp === 'hash' ? '/#' : ''
    // console.log(this.mode)
    const self = this
    this.data = _Vue.observable({
      current: self.mode + '/'
    })
  }

  // 将this.options中的router转化为键值对象，并存储到routerMap
  createRouterMap () {
    this.options.routes.forEach(route => {
      this.routerMap[this.mode + route.path] = route.component
    })
  }

  initComponents (Vue) {
    const self = this
    Vue.component('router-link', {
      props: {
        to: String
      },
      render (h) {
        return h('a', {
          attrs: {
            href: this.to
          },
          on: {
            click: this.clickHandler
          }
        }, [this.$slots.default])
      },
      methods: {
        // click事件是为了解决“a标签的页面刷新跳转的行为”和“'router-view'内容变化”
        clickHandler (e) {
        //   history.pushState({}, '', self.mode + this.to)
          this.$router.data.current = self.mode + this.to
          // 阻止事件的默认动作,这里的默认行为就是a标签的页面刷新跳转的行为
          e.preventDefault()
        }
      }
      //   template: '<a :href="to"><slot></slot></a>'
    })

    // const self = this
    Vue.component('router-view', {
      render (h) {
        const compontent = self.routerMap[self.data.current]
        history.pushState({}, '', self.data.current)
        // console.log(compontent)
        return h(compontent)
      }
    })
  }

  init () {
    this.createRouterMap()
    this.initComponents(_Vue)
    this.initEvent()
  }

  // 解决浏览器前进后退时，url变了，但router-view里的内容不变
  initEvent () {
    window.addEventListener('popstate', () => {
      this.data.current = this.mode === '/#' ? window.location.href.split('#')[1] : window.location.pathname
    })
  }
}
