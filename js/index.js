let _upload
let _result
let _uploadWrapper

$(function () {
  _upload = $('#upload')
  _result = $('#result')
  _uploadWrapper = $('.upload-wrapper')

  $(document).on('paste', async e => {
    const { items = {} } = e.originalEvent.clipboardData

    // handle clipboard data
    for (let item of items) {
      const { type } = item

      // handle image
      if (/image\//.test(type)) {
        const file = item.getAsFile()
        return parseFile(file)
      }

      // handle origin url
      if (/text\/plain/.test(type)) {
        const url = await new Promise(res => item.getAsString(url => res(url)))
        if (/^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i.test(url)) {
          return parseUrl(url)
        }
      }
    }
  })

  // convert image file to base64 when input is onChange
  _upload.on('change', e => {
    const [file] = e.currentTarget.files

    // if user cancels the opreaction of uploading, the file is undefined
    if (file) parseFile(file)
  })

  // select textarea for convenience
  _result.on('click', () => _result.select())

  new ClipboardJS('#result')
})

// convert image file to base64
function parseFile(file) {
  // Instantiate fileReader
  const reader = new FileReader()
  reader.onload = () => {
    const { result } = reader

    // modify result in textarea
    _result.val(result)
    _result.click()

    // add thumbnail of image
    if (_uploadWrapper.find('img').length) {
      _uploadWrapper.find('img').attr('src', result).attr('alt', file.name)
    } else {
      _uploadWrapper.prepend(`<img src="${result}" alt="${file.name}" />`)
    }

    // modify banner of upload
    _uploadWrapper.find('p').html(file.name)
  }
  reader.onerror = () => alert(reader.error)

  // parse file
  reader.readAsDataURL(file)
}

// parse origin url
function parseUrl(url) {
  const img = new Image()

  // set crossOrigin to Anonymous so that we could avoid CORS problems
  img.crossOrigin = 'Anonymous'
  img.onload = function () {
    // create a canvas to render image and get data uri
    const canvas = document.createElement('canvas')
    canvas.width = this.naturalWidth
    canvas.height = this.naturalHeight
    const context = canvas.getContext('2d')
    context.drawImage(img, 0, 0)
    const result = canvas.toDataURL()

    // modify result in textarea
    _result.val(result)
    _result.click()

    // add thumbnail of image
    if (_uploadWrapper.find('img').length) {
      _uploadWrapper.find('img').attr('src', result).attr('alt', 'from net')
    } else {
      _uploadWrapper.prepend(`<img src="${result}" alt="from net" />`)
    }

    // modify banner of upload
    _uploadWrapper.find('p').html('Image is from net')
  }
  img.src = url
}

/**
 * format image/data URI size with B/KB/MB.
 * @param {number} size image/data URI size.
 * @returns {string} formatted size.
 */
function sizeFormat(size) {
  if (size < 1024) {
    return `${size} B`
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`
  } else {
    return `${(size / 1024 / 1024).toFixed(2)} MB`
  }
}
