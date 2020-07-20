class Watcher{
    constructor(vm,key,cd){
        this.vm = vm
        // data的属性名
        this.key = key
        // 回调函数负责更新视图
        this.cb = cd
        Dep.target = this
        this.oladValue = vm[key]
        Dep.target = null
    }

    update(){
        let newValue = this.vm[this.key]
        if(this.oladValue === newValue){
            return
        }
        this.cb(newValue)
    }
}