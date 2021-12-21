export const findParam = (url, param) => {
  let p1 = url.indexOf(param)
  let p2 = url.indexOf("&", p1)
  if (p1 > -1 && p2 > -1) {
    let param = url.slice(p1 + 1, p2)
    url = url.slice(0, p1) + "" + url.slice(p2 + 1)
    return {
      url,
      param
    }
  } else {
    return { url };
  }
}

export const checkForms = (value = '') => {
  const noPermitidos = ['#', '$', '%', '^', '&', '"', "'", '<', '>', ';', '{', '}', '[', ']', '*']
  const obj = {
    state: false,
    char: '',
    list: noPermitidos
  }
  noPermitidos.forEach((item, index) => {
    if (value.includes(item)) {
      return (
        obj.state = true,
        obj.char = noPermitidos[index],
        obj.list = noPermitidos
      )
    }
  })
  return obj
}