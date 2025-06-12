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
 */

import type { OverlayTemplate } from '../../component/Overlay'
import { getArrowLine } from './utils'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- ignore
function getIntervalText (interval: number) {
  const minSecs = 60
  const hourSecs = 3600
  const daySecs = 24 * 3600
  const result: string[] = []
  if (interval > daySecs) {
    const days = Math.floor(interval / daySecs)
    result.push(days.toString(), 'days') // m.days()
    interval = interval % daySecs
  }
  if (interval > hourSecs) {
    const hours = Math.floor(interval / hourSecs)
    result.push(hours.toString(), 'hours') // m.hours()
    interval = interval % hourSecs
  }
  if (interval > minSecs) {
    const mins = Math.floor(interval / minSecs)
    result.push(mins.toString(), 'mins') // m.mins()
    interval = interval % minSecs
  }
  if (interval > 0) {
    result.push('1', 'mins') // m.mins()
  }
  return result.join('')
}

const ruler: OverlayTemplate = {
  name: 'ruler',
  totalStep: 3,
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  styles: {
    polygon: {
      color: 'rgba(22, 119, 255, 0.15)'
    }
  },
  onDeselected: (event) => {
    // 失去焦点时移除该overlay
    event.chart.removeOverlay({
      id: event.overlay.id
    })
    return true
  },
  createPointFigures: ({ chart, coordinates, overlay }) => {
    const precision = chart.getSymbol()?.pricePrecision ?? 2
    // const precision = getPrecision(chart, overlay, yAxis)
    if (coordinates.length > 1) {
      const pt1 = coordinates[0]
      const pt2 = coordinates[1]
      const midX = (pt1.x + pt2.x) / 2
      const midY = (pt1.y + pt2.y) / 2
      const vertArrow = getArrowLine({ x: midX, y: pt1.y }, { x: midX, y: pt2.y })
      const horzArrow = getArrowLine({ x: pt1.x, y: midY }, { x: pt2.x, y: midY })

      const bgColor = pt1.y > pt2.y ? '#F7525F' : '#2962FF'
      const textStyles = {
        color: '#ffffff',
        backgroundColor: bgColor,
        borderColor: bgColor,
        paddingLeft: 6,
        paddingTop: 6,
        paddingRight: 6,
        paddingBottom: 6
      }

      const points = overlay.points
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- ignore
      // @ts-expect-error
      const valueDif = points[0].value - points[1].value

      const priceChg = valueDif.toFixed(precision)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- ignore
      // @ts-expect-error
      const pctChg = ((valueDif / points[0].value) * 100).toFixed(2)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- ignore
      // @ts-expect-error
      const barNum = points[1].dataIndex - points[0].dataIndex

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- ignore
      // @ts-expect-error
      const distSec = ((points[1].timestamp - points[0].timestamp) / 1000)
      const text = `${priceChg} (${pctChg}%)\n${barNum}bars, ${getIntervalText(distSec)}` // bars → ${m.num_bar()}
      let textY = pt2.y + 10
      let boxBaseLine = 'top'
      if (pt1.y > pt2.y) {
        textY = pt2.y - 10
        boxBaseLine = 'bottom'
      }
      return [
        {
          type: 'polygon',
          attrs: {
            coordinates: [
              pt1, { x: pt2.x, y: pt1.y },
              pt2, { x: pt1.x, y: pt2.y }
            ]
          },
          styles: { style: 'stroke_fill' }
        },
        {
          type: 'textBox',
          attrs: { x: midX, y: textY, text, align: 'center', baseline: boxBaseLine },
          ignoreEvent: true,
          styles: textStyles
        },
        ...vertArrow,
        ...horzArrow
      ]
    }
    return []
  }
}

export default ruler
