const d4 = {}

const rootStyles = getComputedStyle(document.documentElement)
const colourPrefix = '--col-'

d4.getCssColour = function(name) {
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

d3.selection.prototype.pen = function(fill, stroke, width) {
  return this
    .attr('fill', d4.getCssColour(fill))
    .attr('stroke', d4.getCssColour(stroke))
    .attr('stroke-width', width)
}

const drawFns = {}

d3.selection.prototype.draw = function(name, args) {
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

let animId = 0

function getAnimId() {
  const id = 'anim_' + animId
  animId++
  return id
}

const animFns = {}

d3.selection.prototype.animate = function(args) {
  const name = this.node().tagName.toLowerCase()
  const animFn = animFns[name]
  const anim = animFn.call(this, args)
  const id = getAnimId()
  anim.attr('id', id)
  anim.end = id + '.end'
  return anim
}

animFns.path = function () {
  const path = this
  const totalLength = path.node().getTotalLength()
  path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
  path.attr('stroke-dashoffset', totalLength)
  path.totalLength = totalLength
  const anim = path.append('animate')
  anim        
    .attr('attributeName', 'stroke-dashoffset')
    .attr('values', totalLength + ';0')
    .attr('dur', '2s')
    .attr('repeatCount', 'indefinite')
    .attr('fill', 'freeze')
  return anim
}

animFns.circle = function() {
  const circle = this
  const r = circle.attr('r')
  const anim = circle.append('animate')
  anim        
    .attr('attributeName', 'r')
    .attr('values', '0;' + r)
    .attr('dur', '2s')
    .attr('repeatCount', 'indefinite')
    .attr('fill', 'freeze')
  return anim 
}

d3.selection.prototype.keyFrames = function(keytimes, values, duration) {
  const anim = this
  anim
    .attr('keytimes', keytimes.join('; '))
    .attr('values', values.join('; '))
    .attr('dur', duration + 's')
  return anim
}

d4.newSketch = function() {
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