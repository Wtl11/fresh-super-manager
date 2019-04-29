import * as intentModule from './intent'

describe('@state/modules/intent', () => {
  it('exports a valid Vuex module', () => {
    expect(intentModule).toBeAVuexModule()
  })
})
