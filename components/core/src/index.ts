import {State} from 'fp-ts/State'
import * as S from 'fp-ts/State'

type StateType = 'A' | 'B' | 'C'
type CounterState = State<StateType, number>

const main = () => {
  console.log('Hello World!');

  const current: CounterState = (state: StateType) => {
    switch (state) {
      case 'A':
        return [0, 'A'];
      case 'B':
        return [1, 'B'];
      case 'C':
        return [2, 'C'];
    }
  }

  const next: CounterState = (state: StateType) => {
    switch (state) {
      case 'A':
        console.log(`To state B counter 1`)
        return [1, 'B'];
      case 'B':
        console.log(`To state C counter 2`)
        return [2, 'C'];
      case 'C':
        console.log(`To state A counter 0`)
        return [0, 'A'];
    }
  }

  const actions = [next, next, next, next, next]
  console.log(`Sequence\nFrom state B counter 1`)
  S.sequenceArray(actions)('B')


  const nextWStep = (number: number): CounterState => (state: StateType) => {
    let temp = current(state)
    console.log(`Leap ${number} steps`)
    for (let i = 0; i < number; i++) {
      temp = next(temp[1])
    }
    return temp
  }

  console.log(`Traversal\nFrom state B counter 1`)
  S.traverseArray((v: number) => nextWStep(v))([1,3,5,2,1,4])('B')
};

main();
