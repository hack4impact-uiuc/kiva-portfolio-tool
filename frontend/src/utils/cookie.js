import cookie from 'js-cookie'

export const getCookieFromBrowser = key => {
  return cookie.get(key)
}

const getCookieFromServer = (key, req) => {
  if (!req.headers.cookie) {
    return undefined
  }
  const rawCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith(`${key}=`))
  if (!rawCookie) {
    return undefined
  }
  return rawCookie.split('=')[1]
}

export const setCookie = (key, value) => {
  console.log(1)
  cookie.set(key, value, {
    expires: 1,
    path: '/'
  })
  if (process.browser) {
    console.log(1)
    cookie.set(key, value, {
      expires: 1,
      path: '/'
    })
  }
}

export const removeCookie = key => {
  if (process.browser) {
    cookie.remove(key, {
      expires: 1
    })
  }
}

export const getCookie = (key, req) => {
  return process.browser ? getCookieFromBrowser(key) : getCookieFromServer(key, req)
}
