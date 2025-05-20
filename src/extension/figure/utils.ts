import type { TextAttrs } from './text'
import type { TextStyle } from '../../common/Styles'
import type { RectAttrs } from './rect'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- ignore
export function getRectStartX (attrs: TextAttrs, styles: Partial<TextStyle>, textWidth?: number) {
  const { size = 12, paddingLeft = 0, paddingTop = 0, paddingRight = 0, paddingBottom = 0 } = styles
  const { x, y, text, align = 'left', baseline = 'top' } = attrs
  textWidth ??= size * text.length
  console.log(`${paddingTop + paddingBottom + y}${baseline}`)
  // eslint-disable-next-line @typescript-eslint/init-declarations -- ignore
  let startX: number
  switch (align) {
    case 'left':
    case 'start': {
      startX = x
      break
    }
    case 'right':
    case 'end': {
      startX = x - paddingRight - textWidth - paddingLeft
      break
    }
    default: {
      startX = x - textWidth / 2 - paddingLeft
      break
    }
  }
  return startX
}

export function getTextRect (attrs: TextAttrs, styles: Partial<TextStyle>, textWidth?: number,
  lineNum?: number, lineHeight?: number): RectAttrs {
  const { size = 12, paddingLeft = 0, paddingTop = 0, paddingRight = 0, paddingBottom = 0 } = styles
  const { y, text, baseline = 'top' } = attrs
  const length = text.length
  textWidth ??= size * length
  lineNum ??= 1
  lineHeight ??= 1.5
  const textHeight = size * lineNum * lineHeight - (lineHeight - 1) * size
  const startX = getRectStartX(attrs, styles, textWidth)
  // eslint-disable-next-line @typescript-eslint/init-declarations -- ignore
  let startY: number
  switch (baseline) {
    case 'top':
    case 'hanging': {
      startY = y
      break
    }
    case 'bottom':
    case 'ideographic':
    case 'alphabetic': {
      startY = y - textHeight - paddingTop - paddingBottom
      break
    }
    default: {
      startY = y - textHeight / 2 - paddingTop
      break
    }
  }
  return { x: startX, y: startY, width: paddingLeft + textWidth + paddingRight, height: paddingTop + textHeight + paddingBottom }
}
