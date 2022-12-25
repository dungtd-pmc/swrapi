import { deepMerge } from "../utils";

const tests = [
  {
    obj1: 1,
    obj2: 2,
    result: 2
  },
  {
    obj1: { a: 1 },
    obj2: { b: 2 },
    result: { a: 1, b: 2 }
  },
  {
    obj1: { a: 1, b: 2 },
    obj2: { b: 3, c: 4 },
    result: { a: 1, b: 3, c: 4 }
  },
  {
    obj1: { a: { b: 1, c: 2 }, d: [] },
    obj2: { a: { c: 3, d: [] } , d: { x: 1, y: 2 }, z: 5 },
    result: { a: { b: 1, c: 3, d: [] }, d: { x: 1, y: 2 }, z: 5 }
  }
]

describe('deepMerge', () => {
  tests.forEach(({ obj1, obj2, result  }) => {
    it(`deepMerge ${JSON.stringify(obj1)} and ${JSON.stringify(obj2)}`, () => {
      expect(deepMerge(obj1, obj2)).toEqual(result)
    })
  })
})