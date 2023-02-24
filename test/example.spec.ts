import test from "japa"

test.group('Example', () => {
  test('Assert sum', (assert) => {
    assert.equal(5+5,10)

  })
})
