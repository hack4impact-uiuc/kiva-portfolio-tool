import { Component } from 'react'

class SmtpService extends Component {
  constructor(props) {
    super(props)

    this.send = this.send.bind(this)
    this.ajaxPost = this.ajaxPost.bind(this)
    this.ajax = this.ajax.bind(this)
    this.createCORSRequest = this.createCORSRequest.bind(this)
  }

  /* https://smtpjs.com/ */

  /* SmtpJS.com - v3.0.0 */
  send = a => {
    return new Promise(function(n, e) {
      a.nocache = Math.floor(1e6 * Math.random() + 1)
      a.Action = 'Send'
      var t = JSON.stringify(a)
      this.ajaxPost('https://smtpjs.com/v3/smtpjs.aspx?', t, function(e) {
        n(e)
      })
    })
  }

  ajaxPost = (e, n, t) => {
    var a = this.createCORSRequest('POST', e)
    a.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    a.onload = function() {
      var e = a.responseText
      null != t && t(e)
    }
    a.send(n)
  }

  ajax = (e, n) => {
    var t = this.createCORSRequest('GET', e)
    t.onload = function() {
      var e = t.responseText
      null != n && n(e)
    }
    t.send()
  }

  createCORSRequest = (e, n) => {
    var t = new XMLHttpRequest()
    return (
      'withCredentials' in t
        ? t.open(e, n, !0)
        : 'undefined' != typeof XDomainRequest
        ? t.open(e, n)
        : (t = null),
      t
    )
  }
}

export default SmtpService
