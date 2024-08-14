const d4 = {}

const rootStyles = getComputedStyle(document.documentElement)
const colourPrefix = '--col-'

d4.getCssColour = function (name) {
  if (!name.startsWith(colourPrefix)) {
    return name
  }

  const hexColour = rootStyles.getPropertyValue(name)
  if (hexColour == '') {
    console.log(`getCssColour: no such colour '${name}'`)
    return undefined
  }

  return hexColour
}

d4.col = {}
d4.col.pal_spectrum_ix = [
  '--col-juicy-jackfruit',
  '--col-kiwi-green',
  '--col-snow-pea',
  '--col-tempo',
  '--col-splish-splash',
  '--col-indigo-light',
  '--col-scampi',
  '--col-viola-grey',
  '--col-lovebirds',
  '--col-coral-commander',
  '--col-atomic-orange',
  '--col-cakepop-sorbet'
]

d3.selection.prototype.pen = function (fill, stroke, width) {
  return this
    .attr('fill', d4.getCssColour(fill))
    .attr('stroke', d4.getCssColour(stroke))
    .attr('stroke-width', width)
}

const drawFns = {}

d3.selection.prototype.draw = function (name, args) {
  const drawFn = drawFns[name]
  return drawFn.call(this, args)
}

const lineGen = d3.line().x(d => d[0]).y(d => d[1]).curve(d3.curveBumpY)

drawFns.path = function (points) {
  const path = this.append('path')
    .attr('d', lineGen(points))
    .pen('none', 'black', 1)
  return path
}

drawFns.circle = function ({ r, c }) {
  const circle = this.append('circle')
    .attr('r', r)
    .attr('cx', c[0])
    .attr('cy', c[1])
    .pen('white', 'black', 1)
  return circle
}

drawFns.rect = function ([x, y, width, height]) {
  const rect = this.append('rect')
    .attr('x', x)
    .attr('y', y)
    .attr('width', width)
    .attr('height', height)
    .pen('white', 'black', 1)
  return rect
}

let animId = 0

function getAnimId() {
  const id = 'anim_' + animId
  animId++
  return id
}

const animAttrFns = {}

animAttrFns.path = function () {
  const path = this
  const totalLength = path.node().getTotalLength()
  // make a dashed line that has the whole length stroked and then the whole length unstroked
  path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
  // set the initial offset to the part that is not stroked so whole path is hidden
  path.attr('stroke-dashoffset', totalLength)
  const attrName = 'stroke-dashoffset'
  const scale = d3.scaleLinear([0, 1], [totalLength, 0]).clamp(true)
  return { attrName, scale }
}

d3.selection.prototype.animate = function (attr, values, keytimes, duration) {
  const sel = this
  const attrFn = animAttrFns[attr]
  const { attrName, scale } = attrFn ? attrFn.call(this) : {
    attrName: attr,
    scale: d3.scaleLinear([0, 1], [0, sel.attr(attr)]).clamp(true)
  }
  const mappedValues = values.map(v => scale(v))

  if (keytimes[0] > 0) {
    keytimes.unshift(0)
    mappedValues.unshift(mappedValues[0])
  }
  if (keytimes[keytimes.length - 1] < 1) {
    keytimes.push(1)
    mappedValues.push(mappedValues[mappedValues.length - 1])
  }

  const anim = sel.append('animate')
  const id = getAnimId()
  anim
    .attr('id', id)
    .attr('attributeName', attrName)
    .attr('values', mappedValues.join('; '))
    .attr('keyTimes', keytimes.join('; '))
    .attr('dur', duration + 's')
    .attr('repeatCount', 'indefinite')
    .attr('fill', 'freeze')
  return anim
}

d4.newSketch = function () {
  const svg = d3.select(document.body).append('svg')
    .attr('width', 200)
    .attr('height', 200)
    .attr('viewBox', '0 0 100 100')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
  const rect = svg.append('rect')
    .pen('white', 'black', 1)
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 100)
    .attr('height', 100)
  svg.bg = rect
  return svg
}



Object.assign(window, d4)