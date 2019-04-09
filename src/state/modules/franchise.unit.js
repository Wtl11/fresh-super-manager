import * as franchiseModule from './franchise'

describe('@state/modules/franchise', () => {
  it('exports a valid Vuex module', () => {
    expect(franchiseModule).toBeAVuexModule()
  })
})
