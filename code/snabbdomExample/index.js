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
        return h('div.row',{
            key: node.rank,
            style: {
                // opacity: '0',
                // transform: 'translate(-200px)',
                delayed: { transform: `translateY(${node.offset}px)`, opacity: '1' },
                remove: { opacity: '0', transform: `translateY(${node.offset}px) translateX(200px)` }
              },
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
    testData.push({
        rank: testData.length,
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
  let margin = 8
function update(){
    testData = testData.reduce((acc, m) => {
        var last = acc[acc.length - 1]
        m.offset = last ? last.offset + last.elmHeight + margin : margin
        return acc.concat(m)
      }, [])
      totalHeight = testData[testData.length - 1].offset + testData[testData.length - 1].elmHeight
    vnode = patch(vnode, viewList())
}

