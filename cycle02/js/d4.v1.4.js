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

d4.NewDrawing = function () {
  const drawing = {}

  drawing.drawSteps = []

  drawing.draw = function () {
    drawing.drawSteps.forEach(step => step())
  }

  drawing.addStep = function (fn) {
    drawing.drawSteps.push(fn)
    drawing.draw()
  }

  drawing.modifyLastStep = function (fn) {
    drawing.drawSteps[drawing.drawSteps.length - 1] = fn
    drawing.draw()
  }

  return drawing
}


const addFns = {}

d3.selection.prototype.add = function(name, ...args) {
  const addFn = addFns[name]
  return addFn.call(this, ...args)
}

addFns.svg = function (width = 200, height = 200, viewBox = '0 0 100 100') {
  return this.append('svg')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', viewBox)
}

addFns.pen = function (fill, stroke, width) {
  return this.append('g')
    .attr('fill', d4.getCssColour(fill))
    .attr('stroke', d4.getCssColour(stroke))
    .attr('stroke-width', width)
}

addFns.rect = function(topLeft, width, height) {
  return this.append('rect')
    .attr('x', topLeft[0])
    .attr('y', topLeft[1])
    .attr('width', width)
    .attr('height', height)
}

addFns.circle = function(center, radius) {
  return this.append('circle')
    .attr('cx', center[0])
    .attr('cy', center[1])
    .attr('r', radius)
}

const pointsToBumpY = d3.line().x(d => d[0]).y(d => d[1]).curve(d3.curveBumpY)

addFns.path = function(points) {
  return this.append('path')
    .attr('d', pointsToBumpY(points))
}

addFns.tree = function(tree) {
  const g = this.append('g')
  tree.flowers.forEach(flower => {
    g.add('path', [tree.root, flower.c])
    g.add('circle', flower.c, flower.r)
  })
  return g
}

addFns.text = function(text, pos) {
  return this.append('text')
    .attr('x', pos[0])
    .attr('y', pos[1])
    .attr('font-size', 1.5)
    .attr('text-anchor', 'middle')
    .attr('font-family', 'sans-serif')
    .attr('stroke-width', 0.1)
    .text(text)
}





Object.assign(window, d4)
