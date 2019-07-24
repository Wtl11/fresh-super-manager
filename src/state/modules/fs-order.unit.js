import * as tradeModule from './fs-order'

describe('@state/modules/fsOrder', () => {
  it('exports a valid Vuex module', () => {
    expect(tradeModule).toBeAVuexModule()
  })
})
