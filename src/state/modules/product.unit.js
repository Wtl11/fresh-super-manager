import * as goodsModule from './goods'

describe('@state/modules/goods', () => {
  it('exports a valid Vuex module', () => {
    expect(goodsModule).toBeAVuexModule()
  })
})
