/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 此文件从rectText修改而来。
 * rectText不支持多行文本，此组件改动为支持多行文本框
 */

import { getTextRect, getRectStartX } from './utils'
import { drawRect } from './rect'
import type { TextStyle } from '../../common/Styles'
import type { TextAttrs } from './text'
import { calcTextWidth, createFont } from '../../common/utils/canvas'
import type Coordinate from '../../common/Coordinate'
import type { FigureTemplate } from '../../component/Figure'

/*
以下函数复制自KlineCharts，因其不再导出，所以复制过来：
createFont
isString
isTransparent
drawRect

*/

// function createFont (size?: number, weight?: string | number, family?: string): string {
//   return `${weight ?? 'normal'} ${size ?? 12}px ${family ?? 'Helvetica Neue'}`
// }

// function isString (value: unknown): value is string {
//   return typeof value === 'string'
// }
//
// function isTransparent (color: string): boolean {
//   return color === 'transparent' ||
//     color === 'none' ||
//     /^[rR][gG][Bb][Aa]\(([\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)[\s]*,){3}[\s]*0[\s]*\)$/.test(color) ||
//     /^[hH][Ss][Ll][Aa]\(([\s]*(360｜3[0-5][0-9]|[012]?[0-9][0-9]?)[\s]*,)([\s]*((100|[0-9][0-9]?)%|0)[\s]*,){2}([\s]*0[\s]*)\)$/.test(color)
// }

/*
复制自KlineCharts的rect.ts，因其不再导出，所以复制过来
*/
// function drawRect (ctx: CanvasRenderingContext2D, attrs: RectAttrs | RectAttrs[], styles: Partial<RectStyle>): void {
//   let rects: RectAttrs[] = []
//   rects = rects.concat(attrs)
//   const {
//     style = 'fill',
//     color = 'transparent',
//     borderSize = 1,
//     borderColor = 'transparent',
//     borderStyle = 'solid',
//     borderRadius: r = 0,
//     borderDashedValue = [2, 2]
//   } = styles
//   // eslint-disable-next-line @typescript-eslint/unbound-method, @typescript-eslint/no-unnecessary-condition -- ignore
//   const draw = ctx.roundRect ?? ctx.rect
//   const solid = (style === 'fill' || styles.style === 'stroke_fill') && (!isString(color) || !isTransparent(color))
//   if (solid) {
//     ctx.fillStyle = color
//     rects.forEach(({ x, y, width: w, height: h }) => {
//       ctx.beginPath()
//       draw.call(ctx, x, y, w, h, r)
//       ctx.closePath()
//       ctx.fill()
//     })
//   }
//   if ((style === 'stroke' || styles.style === 'stroke_fill') && borderSize > 0 && !isTransparent(borderColor)) {
//     ctx.strokeStyle = borderColor
//     ctx.fillStyle = borderColor
//     ctx.lineWidth = borderSize
//     if (borderStyle === 'dashed') {
//       ctx.setLineDash(borderDashedValue)
//     } else {
//       ctx.setLineDash([])
//     }
//     const correction = borderSize % 2 === 1 ? 0.5 : 0
//     const doubleCorrection = Math.round(correction * 2)
//     rects.forEach(({ x, y, width: w, height: h }) => {
//       if (w > borderSize * 2 && h > borderSize * 2) {
//         ctx.beginPath()
//         draw.call(ctx, x + correction, y + correction, w - doubleCorrection, h - doubleCorrection, r)
//         ctx.closePath()
//         ctx.stroke()
//       } else {
//         if (!solid) {
//           ctx.fillRect(x, y, w, h)
//         }
//       }
//     })
//   }
// }

export function drawRectText (ctx: CanvasRenderingContext2D, attrs: TextAttrs, styles: Partial<TextStyle>): void {
  const { text } = attrs
  const {
    size = 12,
    family,
    weight,
    paddingLeft = 0,
    paddingTop = 0,
    paddingRight = 0
  } = styles
  const lines = text.split('\n')

  const lineWidths = lines.map(lineText => calcTextWidth(lineText, size, weight, family))
  const heightRatio = 1.5
  const lineHeight = size * heightRatio
  const maxWidth = Math.max(...lineWidths)

  const rect = getTextRect(attrs, styles, maxWidth, lines.length, heightRatio)

  drawRect(ctx, rect, { ...styles, color: styles.backgroundColor })

  let curY = rect.y + paddingTop
  lines.forEach((lineText, index) => {
    const startX = getRectStartX(attrs, styles, lineWidths[index]) + paddingLeft
    // 使用单行文本绘制，避免重复的背景
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.font = createFont(size, weight, family)
    ctx.fillStyle = styles.color ?? 'currentColor'

    ctx.fillText(lineText, startX, curY, rect.width - paddingLeft - paddingRight)
    curY += lineHeight
  })
}

function checkCoordinateOnText (coordinate: Coordinate, attrs: TextAttrs, styles: Partial<TextStyle>): boolean {
  const {
    size = 12,
    family,
    weight
  } = styles
  const lines = attrs.text.split('\n')
  const lineWidths = lines.map(lineText => calcTextWidth(lineText, size, weight, family))
  const heightRatio = 1.5
  const maxWidth = Math.max(...lineWidths)

  const { x, y, width, height } = getTextRect(attrs, styles, maxWidth, lines.length, heightRatio)
  return (
    coordinate.x >= x &&
    coordinate.x <= x + width &&
    coordinate.y >= y &&
    coordinate.y <= y + height
  )
}

const textBox: FigureTemplate<TextAttrs, Partial<TextStyle>> = {
  name: 'textBox',
  checkEventOn: (coordinate: Coordinate, attrs: TextAttrs, styles: Partial<TextStyle>) => checkCoordinateOnText(coordinate, attrs, styles),
  draw: (ctx: CanvasRenderingContext2D, attrs: TextAttrs, styles: Partial<TextStyle>) => {
    drawRectText(ctx, attrs, styles)
  }
}

export default textBox
