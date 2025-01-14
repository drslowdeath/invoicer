;(() => {
  var V = Math.min,
    S = Math.max,
    X = Math.round,
    U = Math.floor,
    T = t => ({ x: t, y: t }),
    Ht = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' },
    zt = { start: 'end', end: 'start' }
  function ot(t, e, n) {
    return S(t, V(e, n))
  }
  function q(t, e) {
    return typeof t == 'function' ? t(e) : t
  }
  function L(t) {
    return t.split('-')[0]
  }
  function J(t) {
    return t.split('-')[1]
  }
  function it(t) {
    return t === 'x' ? 'y' : 'x'
  }
  function st(t) {
    return t === 'y' ? 'height' : 'width'
  }
  function K(t) {
    return ['top', 'bottom'].includes(L(t)) ? 'y' : 'x'
  }
  function rt(t) {
    return it(K(t))
  }
  function pt(t, e, n) {
    n === void 0 && (n = !1)
    let o = J(t),
      i = rt(t),
      s = st(i),
      r =
        i === 'x'
          ? o === (n ? 'end' : 'start')
            ? 'right'
            : 'left'
          : o === 'start'
            ? 'bottom'
            : 'top'
    return e.reference[s] > e.floating[s] && (r = $(r)), [r, $(r)]
  }
  function xt(t) {
    let e = $(t)
    return [tt(t), e, tt(e)]
  }
  function tt(t) {
    return t.replace(/start|end/g, e => zt[e])
  }
  function It(t, e, n) {
    let o = ['left', 'right'],
      i = ['right', 'left'],
      s = ['top', 'bottom'],
      r = ['bottom', 'top']
    switch (t) {
      case 'top':
      case 'bottom':
        return n ? (e ? i : o) : e ? o : i
      case 'left':
      case 'right':
        return e ? s : r
      default:
        return []
    }
  }
  function wt(t, e, n, o) {
    let i = J(t),
      s = It(L(t), n === 'start', o)
    return (
      i && ((s = s.map(r => r + '-' + i)), e && (s = s.concat(s.map(tt)))), s
    )
  }
  function $(t) {
    return t.replace(/left|right|bottom|top/g, e => Ht[e])
  }
  function jt(t) {
    return { top: 0, right: 0, bottom: 0, left: 0, ...t }
  }
  function yt(t) {
    return typeof t != 'number'
      ? jt(t)
      : { top: t, right: t, bottom: t, left: t }
  }
  function _(t) {
    return {
      ...t,
      top: t.y,
      left: t.x,
      right: t.x + t.width,
      bottom: t.y + t.height,
    }
  }
  function vt(t, e, n) {
    let { reference: o, floating: i } = t,
      s = K(e),
      r = rt(e),
      c = st(r),
      l = L(e),
      f = s === 'y',
      m = o.x + o.width / 2 - i.width / 2,
      u = o.y + o.height / 2 - i.height / 2,
      p = o[c] / 2 - i[c] / 2,
      a
    switch (l) {
      case 'top':
        a = { x: m, y: o.y - i.height }
        break
      case 'bottom':
        a = { x: m, y: o.y + o.height }
        break
      case 'right':
        a = { x: o.x + o.width, y: u }
        break
      case 'left':
        a = { x: o.x - i.width, y: u }
        break
      default:
        a = { x: o.x, y: o.y }
    }
    switch (J(e)) {
      case 'start':
        a[r] -= p * (n && f ? -1 : 1)
        break
      case 'end':
        a[r] += p * (n && f ? -1 : 1)
        break
    }
    return a
  }
  var bt = async (t, e, n) => {
    let {
        placement: o = 'bottom',
        strategy: i = 'absolute',
        middleware: s = [],
        platform: r,
      } = n,
      c = s.filter(Boolean),
      l = await (r.isRTL == null ? void 0 : r.isRTL(e)),
      f = await r.getElementRects({ reference: t, floating: e, strategy: i }),
      { x: m, y: u } = vt(f, o, l),
      p = o,
      a = {},
      d = 0
    for (let g = 0; g < c.length; g++) {
      let { name: x, fn: h } = c[g],
        {
          x: w,
          y,
          data: O,
          reset: v,
        } = await h({
          x: m,
          y: u,
          initialPlacement: o,
          placement: p,
          strategy: i,
          middlewareData: a,
          rects: f,
          platform: r,
          elements: { reference: t, floating: e },
        })
      if (
        ((m = w ?? m),
        (u = y ?? u),
        (a = { ...a, [x]: { ...a[x], ...O } }),
        v && d <= 50)
      ) {
        d++,
          typeof v == 'object' &&
            (v.placement && (p = v.placement),
            v.rects &&
              (f =
                v.rects === !0
                  ? await r.getElementRects({
                      reference: t,
                      floating: e,
                      strategy: i,
                    })
                  : v.rects),
            ({ x: m, y: u } = vt(f, p, l))),
          (g = -1)
        continue
      }
    }
    return { x: m, y: u, placement: p, strategy: i, middlewareData: a }
  }
  async function ct(t, e) {
    var n
    e === void 0 && (e = {})
    let { x: o, y: i, platform: s, rects: r, elements: c, strategy: l } = t,
      {
        boundary: f = 'clippingAncestors',
        rootBoundary: m = 'viewport',
        elementContext: u = 'floating',
        altBoundary: p = !1,
        padding: a = 0,
      } = q(e, t),
      d = yt(a),
      x = c[p ? (u === 'floating' ? 'reference' : 'floating') : u],
      h = _(
        await s.getClippingRect({
          element:
            (n = await (s.isElement == null ? void 0 : s.isElement(x))) ==
              null || n
              ? x
              : x.contextElement ||
                (await (s.getDocumentElement == null
                  ? void 0
                  : s.getDocumentElement(c.floating))),
          boundary: f,
          rootBoundary: m,
          strategy: l,
        }),
      ),
      w = u === 'floating' ? { ...r.floating, x: o, y: i } : r.reference,
      y = await (s.getOffsetParent == null
        ? void 0
        : s.getOffsetParent(c.floating)),
      O = (await (s.isElement == null ? void 0 : s.isElement(y)))
        ? (await (s.getScale == null ? void 0 : s.getScale(y))) || {
            x: 1,
            y: 1,
          }
        : { x: 1, y: 1 },
      v = _(
        s.convertOffsetParentRelativeRectToViewportRelativeRect
          ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
              rect: w,
              offsetParent: y,
              strategy: l,
            })
          : w,
      )
    return {
      top: (h.top - v.top + d.top) / O.y,
      bottom: (v.bottom - h.bottom + d.bottom) / O.y,
      left: (h.left - v.left + d.left) / O.x,
      right: (v.right - h.right + d.right) / O.x,
    }
  }
  var lt = function (t) {
    return (
      t === void 0 && (t = {}),
      {
        name: 'flip',
        options: t,
        async fn(e) {
          var n, o
          let {
              placement: i,
              middlewareData: s,
              rects: r,
              initialPlacement: c,
              platform: l,
              elements: f,
            } = e,
            {
              mainAxis: m = !0,
              crossAxis: u = !0,
              fallbackPlacements: p,
              fallbackStrategy: a = 'bestFit',
              fallbackAxisSideDirection: d = 'none',
              flipAlignment: g = !0,
              ...x
            } = q(t, e)
          if ((n = s.arrow) != null && n.alignmentOffset) return {}
          let h = L(i),
            w = L(c) === c,
            y = await (l.isRTL == null ? void 0 : l.isRTL(f.floating)),
            O = p || (w || !g ? [$(c)] : xt(c))
          !p && d !== 'none' && O.push(...wt(c, g, d, y))
          let v = [c, ...O],
            D = await ct(e, x),
            Z = [],
            I = ((o = s.flip) == null ? void 0 : o.overflows) || []
          if ((m && Z.push(D[h]), u)) {
            let k = pt(i, r, y)
            Z.push(D[k[0]], D[k[1]])
          }
          if (
            ((I = [...I, { placement: i, overflows: Z }]),
            !Z.every(k => k <= 0))
          ) {
            var dt, mt
            let k = (((dt = s.flip) == null ? void 0 : dt.index) || 0) + 1,
              ht = v[k]
            if (ht)
              return {
                data: { index: k, overflows: I },
                reset: { placement: ht },
              }
            let j =
              (mt = I.filter(B => B.overflows[0] <= 0).sort(
                (B, F) => B.overflows[1] - F.overflows[1],
              )[0]) == null
                ? void 0
                : mt.placement
            if (!j)
              switch (a) {
                case 'bestFit': {
                  var gt
                  let B =
                    (gt = I.map(F => [
                      F.placement,
                      F.overflows
                        .filter(Y => Y > 0)
                        .reduce((Y, Wt) => Y + Wt, 0),
                    ]).sort((F, Y) => F[1] - Y[1])[0]) == null
                      ? void 0
                      : gt[0]
                  B && (j = B)
                  break
                }
                case 'initialPlacement':
                  j = c
                  break
              }
            if (i !== j) return { reset: { placement: j } }
          }
          return {}
        },
      }
    )
  }
  async function Yt(t, e) {
    let { placement: n, platform: o, elements: i } = t,
      s = await (o.isRTL == null ? void 0 : o.isRTL(i.floating)),
      r = L(n),
      c = J(n),
      l = K(n) === 'y',
      f = ['left', 'top'].includes(r) ? -1 : 1,
      m = s && l ? -1 : 1,
      u = q(e, t),
      {
        mainAxis: p,
        crossAxis: a,
        alignmentAxis: d,
      } = typeof u == 'number'
        ? { mainAxis: u, crossAxis: 0, alignmentAxis: null }
        : { mainAxis: 0, crossAxis: 0, alignmentAxis: null, ...u }
    return (
      c && typeof d == 'number' && (a = c === 'end' ? d * -1 : d),
      l ? { x: a * m, y: p * f } : { x: p * f, y: a * m }
    )
  }
  var ft = function (t) {
      return (
        t === void 0 && (t = 0),
        {
          name: 'offset',
          options: t,
          async fn(e) {
            let { x: n, y: o } = e,
              i = await Yt(e, t)
            return { x: n + i.x, y: o + i.y, data: i }
          },
        }
      )
    },
    at = function (t) {
      return (
        t === void 0 && (t = {}),
        {
          name: 'shift',
          options: t,
          async fn(e) {
            let { x: n, y: o, placement: i } = e,
              {
                mainAxis: s = !0,
                crossAxis: r = !1,
                limiter: c = {
                  fn: x => {
                    let { x: h, y: w } = x
                    return { x: h, y: w }
                  },
                },
                ...l
              } = q(t, e),
              f = { x: n, y: o },
              m = await ct(e, l),
              u = K(L(i)),
              p = it(u),
              a = f[p],
              d = f[u]
            if (s) {
              let x = p === 'y' ? 'top' : 'left',
                h = p === 'y' ? 'bottom' : 'right',
                w = a + m[x],
                y = a - m[h]
              a = ot(w, a, y)
            }
            if (r) {
              let x = u === 'y' ? 'top' : 'left',
                h = u === 'y' ? 'bottom' : 'right',
                w = d + m[x],
                y = d - m[h]
              d = ot(w, d, y)
            }
            let g = c.fn({ ...e, [p]: a, [u]: d })
            return { ...g, data: { x: g.x - n, y: g.y - o } }
          },
        }
      )
    }
  function P(t) {
    return Ot(t) ? (t.nodeName || '').toLowerCase() : '#document'
  }
  function b(t) {
    var e
    return (
      (t == null || (e = t.ownerDocument) == null ? void 0 : e.defaultView) ||
      window
    )
  }
  function C(t) {
    var e
    return (e = (Ot(t) ? t.ownerDocument : t.document) || window.document) ==
      null
      ? void 0
      : e.documentElement
  }
  function Ot(t) {
    return t instanceof Node || t instanceof b(t).Node
  }
  function E(t) {
    return t instanceof Element || t instanceof b(t).Element
  }
  function R(t) {
    return t instanceof HTMLElement || t instanceof b(t).HTMLElement
  }
  function At(t) {
    return typeof ShadowRoot > 'u'
      ? !1
      : t instanceof ShadowRoot || t instanceof b(t).ShadowRoot
  }
  function H(t) {
    let { overflow: e, overflowX: n, overflowY: o, display: i } = A(t)
    return (
      /auto|scroll|overlay|hidden|clip/.test(e + o + n) &&
      !['inline', 'contents'].includes(i)
    )
  }
  function Rt(t) {
    return ['table', 'td', 'th'].includes(P(t))
  }
  function et(t) {
    let e = nt(),
      n = A(t)
    return (
      n.transform !== 'none' ||
      n.perspective !== 'none' ||
      (n.containerType ? n.containerType !== 'normal' : !1) ||
      (!e && (n.backdropFilter ? n.backdropFilter !== 'none' : !1)) ||
      (!e && (n.filter ? n.filter !== 'none' : !1)) ||
      ['transform', 'perspective', 'filter'].some(o =>
        (n.willChange || '').includes(o),
      ) ||
      ['paint', 'layout', 'strict', 'content'].some(o =>
        (n.contain || '').includes(o),
      )
    )
  }
  function Ct(t) {
    let e = M(t)
    for (; R(e) && !G(e); ) {
      if (et(e)) return e
      e = M(e)
    }
    return null
  }
  function nt() {
    return typeof CSS > 'u' || !CSS.supports
      ? !1
      : CSS.supports('-webkit-backdrop-filter', 'none')
  }
  function G(t) {
    return ['html', 'body', '#document'].includes(P(t))
  }
  function A(t) {
    return b(t).getComputedStyle(t)
  }
  function Q(t) {
    return E(t)
      ? { scrollLeft: t.scrollLeft, scrollTop: t.scrollTop }
      : { scrollLeft: t.pageXOffset, scrollTop: t.pageYOffset }
  }
  function M(t) {
    if (P(t) === 'html') return t
    let e = t.assignedSlot || t.parentNode || (At(t) && t.host) || C(t)
    return At(e) ? e.host : e
  }
  function Et(t) {
    let e = M(t)
    return G(e)
      ? t.ownerDocument
        ? t.ownerDocument.body
        : t.body
      : R(e) && H(e)
        ? e
        : Et(e)
  }
  function W(t, e, n) {
    var o
    e === void 0 && (e = []), n === void 0 && (n = !0)
    let i = Et(t),
      s = i === ((o = t.ownerDocument) == null ? void 0 : o.body),
      r = b(i)
    return s
      ? e.concat(
          r,
          r.visualViewport || [],
          H(i) ? i : [],
          r.frameElement && n ? W(r.frameElement) : [],
        )
      : e.concat(i, W(i, [], n))
  }
  function Pt(t) {
    let e = A(t),
      n = parseFloat(e.width) || 0,
      o = parseFloat(e.height) || 0,
      i = R(t),
      s = i ? t.offsetWidth : n,
      r = i ? t.offsetHeight : o,
      c = X(n) !== s || X(o) !== r
    return c && ((n = s), (o = r)), { width: n, height: o, $: c }
  }
  function ut(t) {
    return E(t) ? t : t.contextElement
  }
  function z(t) {
    let e = ut(t)
    if (!R(e)) return T(1)
    let n = e.getBoundingClientRect(),
      { width: o, height: i, $: s } = Pt(e),
      r = (s ? X(n.width) : n.width) / o,
      c = (s ? X(n.height) : n.height) / i
    return (
      (!r || !Number.isFinite(r)) && (r = 1),
      (!c || !Number.isFinite(c)) && (c = 1),
      { x: r, y: c }
    )
  }
  var $t = T(0)
  function Lt(t) {
    let e = b(t)
    return !nt() || !e.visualViewport
      ? $t
      : { x: e.visualViewport.offsetLeft, y: e.visualViewport.offsetTop }
  }
  function Xt(t, e, n) {
    return e === void 0 && (e = !1), !n || (e && n !== b(t)) ? !1 : e
  }
  function N(t, e, n, o) {
    e === void 0 && (e = !1), n === void 0 && (n = !1)
    let i = t.getBoundingClientRect(),
      s = ut(t),
      r = T(1)
    e && (o ? E(o) && (r = z(o)) : (r = z(t)))
    let c = Xt(s, n, o) ? Lt(s) : T(0),
      l = (i.left + c.x) / r.x,
      f = (i.top + c.y) / r.y,
      m = i.width / r.x,
      u = i.height / r.y
    if (s) {
      let p = b(s),
        a = o && E(o) ? b(o) : o,
        d = p.frameElement
      for (; d && o && a !== p; ) {
        let g = z(d),
          x = d.getBoundingClientRect(),
          h = A(d),
          w = x.left + (d.clientLeft + parseFloat(h.paddingLeft)) * g.x,
          y = x.top + (d.clientTop + parseFloat(h.paddingTop)) * g.y
        ;(l *= g.x),
          (f *= g.y),
          (m *= g.x),
          (u *= g.y),
          (l += w),
          (f += y),
          (d = b(d).frameElement)
      }
    }
    return _({ width: m, height: u, x: l, y: f })
  }
  function Ut(t) {
    let { rect: e, offsetParent: n, strategy: o } = t,
      i = R(n),
      s = C(n)
    if (n === s) return e
    let r = { scrollLeft: 0, scrollTop: 0 },
      c = T(1),
      l = T(0)
    if (
      (i || (!i && o !== 'fixed')) &&
      ((P(n) !== 'body' || H(s)) && (r = Q(n)), R(n))
    ) {
      let f = N(n)
      ;(c = z(n)), (l.x = f.x + n.clientLeft), (l.y = f.y + n.clientTop)
    }
    return {
      width: e.width * c.x,
      height: e.height * c.y,
      x: e.x * c.x - r.scrollLeft * c.x + l.x,
      y: e.y * c.y - r.scrollTop * c.y + l.y,
    }
  }
  function qt(t) {
    return Array.from(t.getClientRects())
  }
  function Dt(t) {
    return N(C(t)).left + Q(t).scrollLeft
  }
  function Jt(t) {
    let e = C(t),
      n = Q(t),
      o = t.ownerDocument.body,
      i = S(e.scrollWidth, e.clientWidth, o.scrollWidth, o.clientWidth),
      s = S(e.scrollHeight, e.clientHeight, o.scrollHeight, o.clientHeight),
      r = -n.scrollLeft + Dt(t),
      c = -n.scrollTop
    return (
      A(o).direction === 'rtl' && (r += S(e.clientWidth, o.clientWidth) - i),
      { width: i, height: s, x: r, y: c }
    )
  }
  function Kt(t, e) {
    let n = b(t),
      o = C(t),
      i = n.visualViewport,
      s = o.clientWidth,
      r = o.clientHeight,
      c = 0,
      l = 0
    if (i) {
      ;(s = i.width), (r = i.height)
      let f = nt()
      ;(!f || (f && e === 'fixed')) && ((c = i.offsetLeft), (l = i.offsetTop))
    }
    return { width: s, height: r, x: c, y: l }
  }
  function Gt(t, e) {
    let n = N(t, !0, e === 'fixed'),
      o = n.top + t.clientTop,
      i = n.left + t.clientLeft,
      s = R(t) ? z(t) : T(1),
      r = t.clientWidth * s.x,
      c = t.clientHeight * s.y,
      l = i * s.x,
      f = o * s.y
    return { width: r, height: c, x: l, y: f }
  }
  function St(t, e, n) {
    let o
    if (e === 'viewport') o = Kt(t, n)
    else if (e === 'document') o = Jt(C(t))
    else if (E(e)) o = Gt(e, n)
    else {
      let i = Lt(t)
      o = { ...e, x: e.x - i.x, y: e.y - i.y }
    }
    return _(o)
  }
  function kt(t, e) {
    let n = M(t)
    return n === e || !E(n) || G(n) ? !1 : A(n).position === 'fixed' || kt(n, e)
  }
  function Qt(t, e) {
    let n = e.get(t)
    if (n) return n
    let o = W(t, [], !1).filter(c => E(c) && P(c) !== 'body'),
      i = null,
      s = A(t).position === 'fixed',
      r = s ? M(t) : t
    for (; E(r) && !G(r); ) {
      let c = A(r),
        l = et(r)
      !l && c.position === 'fixed' && (i = null),
        (
          s
            ? !l && !i
            : (!l &&
                c.position === 'static' &&
                !!i &&
                ['absolute', 'fixed'].includes(i.position)) ||
              (H(r) && !l && kt(t, r))
        )
          ? (o = o.filter(m => m !== r))
          : (i = c),
        (r = M(r))
    }
    return e.set(t, o), o
  }
  function Zt(t) {
    let { element: e, boundary: n, rootBoundary: o, strategy: i } = t,
      r = [...(n === 'clippingAncestors' ? Qt(e, this._c) : [].concat(n)), o],
      c = r[0],
      l = r.reduce(
        (f, m) => {
          let u = St(e, m, i)
          return (
            (f.top = S(u.top, f.top)),
            (f.right = V(u.right, f.right)),
            (f.bottom = V(u.bottom, f.bottom)),
            (f.left = S(u.left, f.left)),
            f
          )
        },
        St(e, c, i),
      )
    return {
      width: l.right - l.left,
      height: l.bottom - l.top,
      x: l.left,
      y: l.top,
    }
  }
  function te(t) {
    return Pt(t)
  }
  function ee(t, e, n) {
    let o = R(e),
      i = C(e),
      s = n === 'fixed',
      r = N(t, !0, s, e),
      c = { scrollLeft: 0, scrollTop: 0 },
      l = T(0)
    if (o || (!o && !s))
      if (((P(e) !== 'body' || H(i)) && (c = Q(e)), o)) {
        let f = N(e, !0, s, e)
        ;(l.x = f.x + e.clientLeft), (l.y = f.y + e.clientTop)
      } else i && (l.x = Dt(i))
    return {
      x: r.left + c.scrollLeft - l.x,
      y: r.top + c.scrollTop - l.y,
      width: r.width,
      height: r.height,
    }
  }
  function Tt(t, e) {
    return !R(t) || A(t).position === 'fixed' ? null : e ? e(t) : t.offsetParent
  }
  function _t(t, e) {
    let n = b(t)
    if (!R(t)) return n
    let o = Tt(t, e)
    for (; o && Rt(o) && A(o).position === 'static'; ) o = Tt(o, e)
    return o &&
      (P(o) === 'html' ||
        (P(o) === 'body' && A(o).position === 'static' && !et(o)))
      ? n
      : o || Ct(t) || n
  }
  var ne = async function (t) {
    let { reference: e, floating: n, strategy: o } = t,
      i = this.getOffsetParent || _t,
      s = this.getDimensions
    return {
      reference: ee(e, await i(n), o),
      floating: { x: 0, y: 0, ...(await s(n)) },
    }
  }
  function oe(t) {
    return A(t).direction === 'rtl'
  }
  var ie = {
    convertOffsetParentRelativeRectToViewportRelativeRect: Ut,
    getDocumentElement: C,
    getClippingRect: Zt,
    getOffsetParent: _t,
    getElementRects: ne,
    getClientRects: qt,
    getDimensions: te,
    getScale: z,
    isElement: E,
    isRTL: oe,
  }
  function se(t, e) {
    let n = null,
      o,
      i = C(t)
    function s() {
      clearTimeout(o), n && n.disconnect(), (n = null)
    }
    function r(c, l) {
      c === void 0 && (c = !1), l === void 0 && (l = 1), s()
      let { left: f, top: m, width: u, height: p } = t.getBoundingClientRect()
      if ((c || e(), !u || !p)) return
      let a = U(m),
        d = U(i.clientWidth - (f + u)),
        g = U(i.clientHeight - (m + p)),
        x = U(f),
        w = {
          rootMargin: -a + 'px ' + -d + 'px ' + -g + 'px ' + -x + 'px',
          threshold: S(0, V(1, l)) || 1,
        },
        y = !0
      function O(v) {
        let D = v[0].intersectionRatio
        if (D !== l) {
          if (!y) return r()
          D
            ? r(!1, D)
            : (o = setTimeout(() => {
                r(!1, 1e-7)
              }, 100))
        }
        y = !1
      }
      try {
        n = new IntersectionObserver(O, { ...w, root: i.ownerDocument })
      } catch {
        n = new IntersectionObserver(O, w)
      }
      n.observe(t)
    }
    return r(!0), s
  }
  function Mt(t, e, n, o) {
    o === void 0 && (o = {})
    let {
        ancestorScroll: i = !0,
        ancestorResize: s = !0,
        elementResize: r = typeof ResizeObserver == 'function',
        layoutShift: c = typeof IntersectionObserver == 'function',
        animationFrame: l = !1,
      } = o,
      f = ut(t),
      m = i || s ? [...(f ? W(f) : []), ...W(e)] : []
    m.forEach(h => {
      i && h.addEventListener('scroll', n, { passive: !0 }),
        s && h.addEventListener('resize', n)
    })
    let u = f && c ? se(f, n) : null,
      p = -1,
      a = null
    r &&
      ((a = new ResizeObserver(h => {
        let [w] = h
        w &&
          w.target === f &&
          a &&
          (a.unobserve(e),
          cancelAnimationFrame(p),
          (p = requestAnimationFrame(() => {
            a && a.observe(e)
          }))),
          n()
      })),
      f && !l && a.observe(f),
      a.observe(e))
    let d,
      g = l ? N(t) : null
    l && x()
    function x() {
      let h = N(t)
      g &&
        (h.x !== g.x ||
          h.y !== g.y ||
          h.width !== g.width ||
          h.height !== g.height) &&
        n(),
        (g = h),
        (d = requestAnimationFrame(x))
    }
    return (
      n(),
      () => {
        m.forEach(h => {
          i && h.removeEventListener('scroll', n),
            s && h.removeEventListener('resize', n)
        }),
          u && u(),
          a && a.disconnect(),
          (a = null),
          l && cancelAnimationFrame(d)
      }
    )
  }
  var Nt = (t, e, n) => {
    let o = new Map(),
      i = { platform: ie, ...n },
      s = { ...i.platform, _c: o }
    return bt(t, e, { ...i, platform: s })
  }
  function Vt(t) {
    t.magic('anchor', e => {
      if (!e._x_anchor)
        throw 'Alpine: No x-anchor directive found on element using $anchor...'
      return e._x_anchor
    }),
      t.interceptClone((e, n) => {
        e && e._x_anchor && !n._x_anchor && (n._x_anchor = e._x_anchor)
      }),
      t.directive(
        'anchor',
        t.skipDuringClone(
          (
            e,
            { expression: n, modifiers: o, value: i },
            { cleanup: s, evaluate: r },
          ) => {
            let { placement: c, offsetValue: l, unstyled: f } = Ft(o)
            e._x_anchor = t.reactive({ x: 0, y: 0 })
            let m = r(n)
            if (!m) throw 'Alpine: no element provided to x-anchor...'
            let u = () => {
                let a
                Nt(m, e, {
                  placement: c,
                  middleware: [lt(), at({ padding: 5 }), ft(l)],
                }).then(({ x: d, y: g }) => {
                  f || Bt(e, d, g),
                    JSON.stringify({ x: d, y: g }) !== a &&
                      ((e._x_anchor.x = d), (e._x_anchor.y = g)),
                    (a = JSON.stringify({ x: d, y: g }))
                })
              },
              p = Mt(m, e, () => u())
            s(() => p())
          },
          (
            e,
            { expression: n, modifiers: o, value: i },
            { cleanup: s, evaluate: r },
          ) => {
            let { placement: c, offsetValue: l, unstyled: f } = Ft(o)
            e._x_anchor && (f || Bt(e, e._x_anchor.x, e._x_anchor.y))
          },
        ),
      )
  }
  function Bt(t, e, n) {
    Object.assign(t.style, {
      left: e + 'px',
      top: n + 'px',
      position: 'absolute',
    })
  }
  function Ft(t) {
    let n = [
        'top',
        'top-start',
        'top-end',
        'right',
        'right-start',
        'right-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
      ].find(s => t.includes(s)),
      o = 0
    if (t.includes('offset')) {
      let s = t.findIndex(r => r === 'offset')
      o = t[s + 1] !== void 0 ? Number(t[s + 1]) : o
    }
    let i = t.includes('no-style')
    return { placement: n, offsetValue: o, unstyled: i }
  }
  document.addEventListener('alpine:init', () => {
    window.Alpine.plugin(Vt)
  })
})()
