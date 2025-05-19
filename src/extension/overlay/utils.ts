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
import type Coordinate from '../../common/Coordinate'
import type Bounding from '../../common/Bounding'
import { getLinearSlopeIntercept, getLinearYFromCoordinates } from '../figure/line'
import type { LineAttrs } from '../figure/line'

export function getRotateCoordinate (coordinate: Coordinate, targetCoordinate: Coordinate, angle: number): Coordinate {
  const x = (coordinate.x - targetCoordinate.x) * Math.cos(angle) - (coordinate.y - targetCoordinate.y) * Math.sin(angle) + targetCoordinate.x
  const y = (coordinate.x - targetCoordinate.x) * Math.sin(angle) + (coordinate.y - targetCoordinate.y) * Math.cos(angle) + targetCoordinate.y
  return { x, y }
}

export function getRayLine (coordinates: Coordinate[], bounding: Bounding): LineAttrs | LineAttrs[] {
  if (coordinates.length > 1) {
    // eslint-disable-next-line @typescript-eslint/init-declarations -- ignore
    let coordinate: Coordinate
    if (coordinates[0].x === coordinates[1].x && coordinates[0].y !== coordinates[1].y) {
      if (coordinates[0].y < coordinates[1].y) {
        coordinate = {
          x: coordinates[0].x,
          y: bounding.height
        }
      } else {
        coordinate = {
          x: coordinates[0].x,
          y: 0
        }
      }
    } else if (coordinates[0].x > coordinates[1].x) {
      coordinate = {
        x: 0,
        y: getLinearYFromCoordinates(coordinates[0], coordinates[1], { x: 0, y: coordinates[0].y })
      }
    } else {
      coordinate = {
        x: bounding.width,
        y: getLinearYFromCoordinates(coordinates[0], coordinates[1], { x: bounding.width, y: coordinates[0].y })
      }
    }
    return { coordinates: [coordinates[0], coordinate] }
  }
  return []
}

export function getDistance (coordinate1: Coordinate, coordinate2: Coordinate): number {
  const xDis = Math.abs(coordinate1.x - coordinate2.x)
  const yDis = Math.abs(coordinate1.y - coordinate2.y)
  return Math.sqrt(xDis * xDis + yDis * yDis)
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- ignore
export function getArrowLine (point1: Coordinate, point2: Coordinate) {
  const flag = point2.x > point1.x ? 0 : 1
  const kb = getLinearSlopeIntercept(point1, point2)
  // eslint-disable-next-line @typescript-eslint/init-declarations -- ignore
  let offsetAngle
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- ignore
  if (kb) {
    offsetAngle = Math.atan(kb[0]) + Math.PI * flag
  } else {
    if (point2.y > point1.y) {
      offsetAngle = Math.PI / 2
    } else {
      offsetAngle = Math.PI / 2 * 3
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- ignore
  const rotateCoordinate1 = getRotateCoordinate({ x: point2.x - 8, y: point2.y + 4 }, point2, offsetAngle)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- ignore
  const rotateCoordinate2 = getRotateCoordinate({ x: point2.x - 8, y: point2.y - 4 }, point2, offsetAngle)
  return [
    {
      type: 'line',
      attrs: { coordinates: [point1, point2] }
    },
    {
      type: 'line',
      ignoreEvent: true,
      attrs: { coordinates: [rotateCoordinate1, point2, rotateCoordinate2] }
    }
  ]
}
