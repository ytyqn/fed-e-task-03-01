import { init } from 'snabbdom/build/package/init.js'
import { classModule } from 'snabbdom/build/package/modules/class.js'
import { propsModule } from 'snabbdom/build/package/modules/props.js'
import { styleModule } from 'snabbdom/build/package/modules/style.js'
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners.js'
import { h } from 'snabbdom/build/package/h.js' 

let testData =[
    { rank: 1, title: 'The Shawshank Redemption'},
    { rank: 2, title: 'The Godfather' },
    { rank: 3, title: 'The Godfather: Part II' },
    { rank: 4, title: 'The Dark Knight' },
    { rank: 5, title: 'Pulp Fiction' },
    { rank: 6, title: 'Schindler\'s List' },
    { rank: 7, title: '12 Angry Men' },
    { rank: 8, title: 'The Good, the Bad and the Ugly' },
    { rank: 9, title: 'The Lord of the Rings: The Return of the King' },
    { rank: 10, title: 'Fight Club'  },
  ]

let patch = init([
    classModule,
    propsModule,
    styleModule,
    eventListenersModule,
])

let vnode
let sortBy = 'rank'
let totalHeight = 0

window.addEventListener('DOMContentLoaded',()=>{
    console.log('aaaa')
    let container = document.getElementById('container')
    vnode = patch(container, viewList())
    changeSort()
})

function viewList(){
    const temp = testData.map(node=>{
        totalHeight += 56
        console.log(totalHeight)
        return h('div.row',{
            key: node.rank
        },[
            h('div', { style: { fontWeight: 'bold' } }, node.rank),
            h('div', node.title),
            h('div.btn.rm-btn', { on: { click: [removeNode, node] } }, 'x'),
          ])
    })
     

      return h('div',[
        h('h1', 'Top 10 movies'),
        h('div', [
            h('a.btn.add', { on: { click: addNode } }, 'Add'),
            'Sort by: ',
            h('span.btn-group', [
                h('a.btn.rank', { 
                    class: { active: sortBy === 'rank' }, 
                    on: { click: [changeSort, 'rank'] } 
                }, 'Rank'),
                h('a.btn.title', { 
                    class: { active: sortBy === 'title' }, 
                    on: { click: [changeSort, 'title'] } 
                }, 'Title')
            ]),
        ]),h('div.list',{ style: { height: totalHeight + 'px' } },temp)
    ])
}

function removeNode(node){
    testData.splice(node.rank-1,1)
    update()
}

function addNode(){
    testData.unshift({
        rank: testData.length+1,
        title: 'Fight Club'
    })
    update()
}

function changeSort (prop = 'rank') {
    sortBy = prop
    testData.sort((a, b) => {
      if (a[prop] > b[prop]) {
        return 1
      }
      if (a[prop] < b[prop]) {
        return -1
      }
      return 0
    })
    update()
  }
function update(){
    vnode = patch(vnode, viewList())
}

