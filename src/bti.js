import $ from 'jquery'

let _result
let _placeholder
let _img

$(function () {
  _result = $('#result')
  _placeholder = $('.upload-wrapper p')
  _img = $('#img')

  // convert image file to base64 when input is onChange
  _result.on('change', e => {
    const { value } = e.currentTarget
    if (value) {
      _img.prop('src', value).show()
      _placeholder.hide()
    } else {
      _img.hide()
      _placeholder.show()
    }
  })
})
