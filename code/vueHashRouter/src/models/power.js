const _times = Symbol('times')
const _total = Symbol('total')
const _left = Symbol('left')
const _right = Symbol('right')

function dataMerge (obj = {}) {
  return Object.assign({
    num: 0,
    power: 0,
    price: 50
  }, obj)
}

export default class Power {
  constructor (
    total = 0,
    left = dataMerge(),
    right = dataMerge(),
    times = 7
  ) {
    this[_times] = times
    this[_total] = total
    this[_left] = left
    this[_right] = right
    this.test = 'test'
    this.mmm = {
      obj: 'dddd'
    }
    this.nm = [1, { b: 'a' }, null, 'mmm']
  }

  // 初始化
  //   create (
  //     total = 0,
  //     left = dataMerge(),
  //     right = dataMerge(),
  //     times = 7
  //   ) {
  //     this[_times] = times
  //     this[_total] = total
  //     this[_left] = left
  //     this[_right] = right
  //     this.test = 'test'
  //   }

  // total
  getTotal () {
    return this[_total]
  }

  // times
  getTimes () {
    return this[_times]
  }

  // left
  getLeftPower () {
    return this[_left].power
  }

  getLeftNum () {
    return this[_left].num
  }

  getLeftPrice () {
    return this[_left].price
  }

  // right
  getRightPower () {
    return this[_right].power
  }

  getRightNum () {
    return this[_right].num
  }

  getRightPrice () {
    return this[_right].price
  }

  // 判断次数是否满
  isRightOver () {
    return this[_right].num < this[_times]
  }

  isLeftOver () {
    return this[_left].num < this[_times]
  }

  // buy
  buyRight (power) {
    if (this[_total] < this[_right].price) { return false }
    if (this.isRightOver()) {
      this[_total] -= this[_right].price
      this[_right].num++
      this[_right].power += power
      return true
    } else {
      return false
    }
  }

  buyLeft (power) {
    // console.log(this[_left].power)
    if (this[_total] < this[_right].price) { return false }
    if (this.isLeftOver()) {
      this[_total] -= this[_left].price
      this[_left].num++
      this[_left].power += power
    } else {
      return false
    }
  }
}
