class Compiler{
    constructor(vm){
        this.el = vm.$el
        this.vm = vm
        this.complie(this.el)
    }

    // 编译模版
    complie(el){
        let childNodes = el.childNodes
        Array.from(childNodes).forEach(node=>{
            if(this.isTextNode(node)){
                this.complieText(node)
            }else if(this.isElementNode(node)){
                this.complieElement(node)
            }

            // 处理深层节点
            if(node.childNodes && node.childNodes.length){
                this.complie(node)
            }
        })
    }

    // 编译元素节点，处理指令
    complieElement(node){
        // console.dir(node.attributes)
        Array.from(node.attributes).forEach(attr=>{
            let attrName =attr.name
            if(this.isDirective(attrName)){
                attrName = attrName.substr(2)
                let key = attr.value
                this.update(node,key,attrName)
            }
        })
    }

    // 调用指令处理
    update(node,key,attrName){
        if(this.isAttrDirective(attrName)){
            // v-on: v-bind:指令处理
            attrName = attrName.split(':')
            let updateFn = this[attrName[0]+'Updater']
            updateFn && updateFn.call(this,node,attrName[1],key)
        }else{
            let updateFn = this[attrName+'Updater']
            updateFn && updateFn.call(this,node,key,this.vm[key])
        }
        
    }

    // v-on处理
    onUpdater(node,event,key){
        node.addEventListener(event,()=>{
            this.vm.$options.methods[key].call(this.vm)
        })
    }

    // v-html处理
    htmlUpdater(node,key,value){
        node.innerHTML = value

        new Watcher(this.vm,key,(newVlaue)=>{
            node.innerHTML = newVlaue
        })
    }

    // v-text处理
    textUpdater(node,key,value){
        node.textContent = value

        new Watcher(this.vm,key,(newVlaue)=>{
            node.textContent = newVlaue
        })
    }

    // v-model处理
    modelUpdater(node,key,value){
        node.value = value

        new Watcher(this.vm,key,(newVlaue)=>{
            node.value = newVlaue
        })

        // 双向绑定
        node.addEventListener('input',()=>{
            this.vm[key]=node.value
        })
    }


    // 编译文本节点，处理差值表达式
    complieText(node){
        // console.dir(node)
        let reg= /\{\{(.+?)\}\}/
        let value = node.textContent
        if(reg.test(value)){
            let key = RegExp.$1.trim()
            // console.log(key)
            node.textContent = value.replace(reg,this.vm[key])

            new Watcher(this.vm,key,(newVlaue)=>{
                node.textContent = newVlaue
            })
        }
    }

    // 判断指令名称
    isDirective(attrName){
        return attrName.startsWith('v-')
    }

    // 判断v-on: v-bind:指令
    isAttrDirective(attrName){
        return attrName.search(':')>-1 
    }

    // 判断是否是文本节点
    isTextNode(node){
        return node.nodeType === 3
    }

    // 判断是非元素节点
    isElementNode(node){
        return node.nodeType === 1
    }

}