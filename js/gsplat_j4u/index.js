class A {
  constructor(A = 0, Q = 0, F = 0) {
    ;(this.x = A), (this.y = Q), (this.z = F)
  }
  equals(A) {
    return this.x === A.x && this.y === A.y && this.z === A.z
  }
  add(Q) {
    return 'number' == typeof Q
      ? new A(this.x + Q, this.y + Q, this.z + Q)
      : new A(this.x + Q.x, this.y + Q.y, this.z + Q.z)
  }
  subtract(Q) {
    return 'number' == typeof Q
      ? new A(this.x - Q, this.y - Q, this.z - Q)
      : new A(this.x - Q.x, this.y - Q.y, this.z - Q.z)
  }
  multiply(Q) {
    return 'number' == typeof Q
      ? new A(this.x * Q, this.y * Q, this.z * Q)
      : Q instanceof A
      ? new A(this.x * Q.x, this.y * Q.y, this.z * Q.z)
      : new A(
          this.x * Q.buffer[0] +
            this.y * Q.buffer[4] +
            this.z * Q.buffer[8] +
            Q.buffer[12],
          this.x * Q.buffer[1] +
            this.y * Q.buffer[5] +
            this.z * Q.buffer[9] +
            Q.buffer[13],
          this.x * Q.buffer[2] +
            this.y * Q.buffer[6] +
            this.z * Q.buffer[10] +
            Q.buffer[14],
        )
  }
  cross(Q) {
    const F = this.y * Q.z - this.z * Q.y,
      U = this.z * Q.x - this.x * Q.z,
      l = this.x * Q.y - this.y * Q.x
    return new A(F, U, l)
  }
  dot(A) {
    return this.x * A.x + this.y * A.y + this.z * A.z
  }
  lerp(Q, F) {
    return new A(
      this.x + (Q.x - this.x) * F,
      this.y + (Q.y - this.y) * F,
      this.z + (Q.z - this.z) * F,
    )
  }
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  }
  distanceTo(A) {
    return Math.sqrt(
      (this.x - A.x) ** 2 + (this.y - A.y) ** 2 + (this.z - A.z) ** 2,
    )
  }
  normalize() {
    const Q = this.magnitude()
    return new A(this.x / Q, this.y / Q, this.z / Q)
  }
  flat() {
    return [this.x, this.y, this.z]
  }
  clone() {
    return new A(this.x, this.y, this.z)
  }
  toString() {
    return `[${this.flat().join(', ')}]`
  }
  static One(Q = 1) {
    return new A(Q, Q, Q)
  }
}
class Q {
  constructor(A = 0, Q = 0, F = 0, U = 1) {
    ;(this.x = A), (this.y = Q), (this.z = F), (this.w = U)
  }
  equals(A) {
    return this.x === A.x && this.y === A.y && this.z === A.z && this.w === A.w
  }
  normalize() {
    const A = Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w,
    )
    return new Q(this.x / A, this.y / A, this.z / A, this.w / A)
  }
  multiply(A) {
    const F = this.w,
      U = this.x,
      l = this.y,
      B = this.z,
      t = A.w,
      d = A.x,
      n = A.y,
      e = A.z
    return new Q(
      F * d + U * t + l * e - B * n,
      F * n - U * e + l * t + B * d,
      F * e + U * n - l * d + B * t,
      F * t - U * d - l * n - B * e,
    )
  }
  inverse() {
    const A =
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    return new Q(-this.x / A, -this.y / A, -this.z / A, this.w / A)
  }
  apply(F) {
    const U = new Q(F.x, F.y, F.z, 0),
      l = new Q(-this.x, -this.y, -this.z, this.w),
      B = this.multiply(U).multiply(l)
    return new A(B.x, B.y, B.z)
  }
  flat() {
    return [this.x, this.y, this.z, this.w]
  }
  clone() {
    return new Q(this.x, this.y, this.z, this.w)
  }
  static FromEuler(A) {
    const F = A.x / 2,
      U = A.y / 2,
      l = A.z / 2,
      B = Math.cos(U),
      t = Math.sin(U),
      d = Math.cos(F),
      n = Math.sin(F),
      e = Math.cos(l),
      Z = Math.sin(l)
    return new Q(
      B * n * e + t * d * Z,
      t * d * e - B * n * Z,
      B * d * Z - t * n * e,
      B * d * e + t * n * Z,
    )
  }
  toEuler() {
    const Q = 2 * (this.w * this.x + this.y * this.z),
      F = 1 - 2 * (this.x * this.x + this.y * this.y),
      U = Math.atan2(Q, F)
    let l
    const B = 2 * (this.w * this.y - this.z * this.x)
    l = Math.abs(B) >= 1 ? (Math.sign(B) * Math.PI) / 2 : Math.asin(B)
    const t = 2 * (this.w * this.z + this.x * this.y),
      d = 1 - 2 * (this.y * this.y + this.z * this.z),
      n = Math.atan2(t, d)
    return new A(U, l, n)
  }
  static FromMatrix3(A) {
    const F = A.buffer,
      U = F[0] + F[4] + F[8]
    let l, B, t, d
    if (U > 0) {
      const A = 0.5 / Math.sqrt(U + 1)
      ;(d = 0.25 / A),
        (l = (F[7] - F[5]) * A),
        (B = (F[2] - F[6]) * A),
        (t = (F[3] - F[1]) * A)
    } else if (F[0] > F[4] && F[0] > F[8]) {
      const A = 2 * Math.sqrt(1 + F[0] - F[4] - F[8])
      ;(d = (F[7] - F[5]) / A),
        (l = 0.25 * A),
        (B = (F[1] + F[3]) / A),
        (t = (F[2] + F[6]) / A)
    } else if (F[4] > F[8]) {
      const A = 2 * Math.sqrt(1 + F[4] - F[0] - F[8])
      ;(d = (F[2] - F[6]) / A),
        (l = (F[1] + F[3]) / A),
        (B = 0.25 * A),
        (t = (F[5] + F[7]) / A)
    } else {
      const A = 2 * Math.sqrt(1 + F[8] - F[0] - F[4])
      ;(d = (F[3] - F[1]) / A),
        (l = (F[2] + F[6]) / A),
        (B = (F[5] + F[7]) / A),
        (t = 0.25 * A)
    }
    return new Q(l, B, t, d)
  }
  static FromAxisAngle(A, F) {
    const U = F / 2,
      l = Math.sin(U),
      B = Math.cos(U)
    return new Q(A.x * l, A.y * l, A.z * l, B)
  }
  toString() {
    return `[${this.flat().join(', ')}]`
  }
}
class F {
  constructor() {
    const A = new Map()
    ;(this.addEventListener = (Q, F) => {
      A.has(Q) || A.set(Q, new Set()), A.get(Q).add(F)
    }),
      (this.removeEventListener = (Q, F) => {
        A.has(Q) && A.get(Q).delete(F)
      }),
      (this.hasEventListener = (Q, F) => !!A.has(Q) && A.get(Q).has(F)),
      (this.dispatchEvent = (Q) => {
        if (A.has(Q.type)) for (const F of A.get(Q.type)) F(Q)
      })
  }
}
class U {
  constructor(
    A = 1,
    Q = 0,
    F = 0,
    U = 0,
    l = 0,
    B = 1,
    t = 0,
    d = 0,
    n = 0,
    e = 0,
    Z = 1,
    V = 0,
    I = 0,
    R = 0,
    a = 0,
    i = 1,
  ) {
    this.buffer = [A, Q, F, U, l, B, t, d, n, e, Z, V, I, R, a, i]
  }
  equals(A) {
    if (this.buffer.length !== A.buffer.length) return !1
    if (this.buffer === A.buffer) return !0
    for (let Q = 0; Q < this.buffer.length; Q++)
      if (this.buffer[Q] !== A.buffer[Q]) return !1
    return !0
  }
  multiply(A) {
    const Q = this.buffer,
      F = A.buffer
    return new U(
      F[0] * Q[0] + F[1] * Q[4] + F[2] * Q[8] + F[3] * Q[12],
      F[0] * Q[1] + F[1] * Q[5] + F[2] * Q[9] + F[3] * Q[13],
      F[0] * Q[2] + F[1] * Q[6] + F[2] * Q[10] + F[3] * Q[14],
      F[0] * Q[3] + F[1] * Q[7] + F[2] * Q[11] + F[3] * Q[15],
      F[4] * Q[0] + F[5] * Q[4] + F[6] * Q[8] + F[7] * Q[12],
      F[4] * Q[1] + F[5] * Q[5] + F[6] * Q[9] + F[7] * Q[13],
      F[4] * Q[2] + F[5] * Q[6] + F[6] * Q[10] + F[7] * Q[14],
      F[4] * Q[3] + F[5] * Q[7] + F[6] * Q[11] + F[7] * Q[15],
      F[8] * Q[0] + F[9] * Q[4] + F[10] * Q[8] + F[11] * Q[12],
      F[8] * Q[1] + F[9] * Q[5] + F[10] * Q[9] + F[11] * Q[13],
      F[8] * Q[2] + F[9] * Q[6] + F[10] * Q[10] + F[11] * Q[14],
      F[8] * Q[3] + F[9] * Q[7] + F[10] * Q[11] + F[11] * Q[15],
      F[12] * Q[0] + F[13] * Q[4] + F[14] * Q[8] + F[15] * Q[12],
      F[12] * Q[1] + F[13] * Q[5] + F[14] * Q[9] + F[15] * Q[13],
      F[12] * Q[2] + F[13] * Q[6] + F[14] * Q[10] + F[15] * Q[14],
      F[12] * Q[3] + F[13] * Q[7] + F[14] * Q[11] + F[15] * Q[15],
    )
  }
  clone() {
    const A = this.buffer
    return new U(
      A[0],
      A[1],
      A[2],
      A[3],
      A[4],
      A[5],
      A[6],
      A[7],
      A[8],
      A[9],
      A[10],
      A[11],
      A[12],
      A[13],
      A[14],
      A[15],
    )
  }
  determinant() {
    const A = this.buffer
    return (
      A[12] * A[9] * A[6] * A[3] -
      A[8] * A[13] * A[6] * A[3] -
      A[12] * A[5] * A[10] * A[3] +
      A[4] * A[13] * A[10] * A[3] +
      A[8] * A[5] * A[14] * A[3] -
      A[4] * A[9] * A[14] * A[3] -
      A[12] * A[9] * A[2] * A[7] +
      A[8] * A[13] * A[2] * A[7] +
      A[12] * A[1] * A[10] * A[7] -
      A[0] * A[13] * A[10] * A[7] -
      A[8] * A[1] * A[14] * A[7] +
      A[0] * A[9] * A[14] * A[7] +
      A[12] * A[5] * A[2] * A[11] -
      A[4] * A[13] * A[2] * A[11] -
      A[12] * A[1] * A[6] * A[11] +
      A[0] * A[13] * A[6] * A[11] +
      A[4] * A[1] * A[14] * A[11] -
      A[0] * A[5] * A[14] * A[11] -
      A[8] * A[5] * A[2] * A[15] +
      A[4] * A[9] * A[2] * A[15] +
      A[8] * A[1] * A[6] * A[15] -
      A[0] * A[9] * A[6] * A[15] -
      A[4] * A[1] * A[10] * A[15] +
      A[0] * A[5] * A[10] * A[15]
    )
  }
  invert() {
    const A = this.buffer,
      Q = this.determinant()
    if (0 === Q) throw new Error('Matrix is not invertible.')
    const F = 1 / Q
    return new U(
      F *
        (A[5] * A[10] * A[15] -
          A[5] * A[11] * A[14] -
          A[9] * A[6] * A[15] +
          A[9] * A[7] * A[14] +
          A[13] * A[6] * A[11] -
          A[13] * A[7] * A[10]),
      F *
        (-A[1] * A[10] * A[15] +
          A[1] * A[11] * A[14] +
          A[9] * A[2] * A[15] -
          A[9] * A[3] * A[14] -
          A[13] * A[2] * A[11] +
          A[13] * A[3] * A[10]),
      F *
        (A[1] * A[6] * A[15] -
          A[1] * A[7] * A[14] -
          A[5] * A[2] * A[15] +
          A[5] * A[3] * A[14] +
          A[13] * A[2] * A[7] -
          A[13] * A[3] * A[6]),
      F *
        (-A[1] * A[6] * A[11] +
          A[1] * A[7] * A[10] +
          A[5] * A[2] * A[11] -
          A[5] * A[3] * A[10] -
          A[9] * A[2] * A[7] +
          A[9] * A[3] * A[6]),
      F *
        (-A[4] * A[10] * A[15] +
          A[4] * A[11] * A[14] +
          A[8] * A[6] * A[15] -
          A[8] * A[7] * A[14] -
          A[12] * A[6] * A[11] +
          A[12] * A[7] * A[10]),
      F *
        (A[0] * A[10] * A[15] -
          A[0] * A[11] * A[14] -
          A[8] * A[2] * A[15] +
          A[8] * A[3] * A[14] +
          A[12] * A[2] * A[11] -
          A[12] * A[3] * A[10]),
      F *
        (-A[0] * A[6] * A[15] +
          A[0] * A[7] * A[14] +
          A[4] * A[2] * A[15] -
          A[4] * A[3] * A[14] -
          A[12] * A[2] * A[7] +
          A[12] * A[3] * A[6]),
      F *
        (A[0] * A[6] * A[11] -
          A[0] * A[7] * A[10] -
          A[4] * A[2] * A[11] +
          A[4] * A[3] * A[10] +
          A[8] * A[2] * A[7] -
          A[8] * A[3] * A[6]),
      F *
        (A[4] * A[9] * A[15] -
          A[4] * A[11] * A[13] -
          A[8] * A[5] * A[15] +
          A[8] * A[7] * A[13] +
          A[12] * A[5] * A[11] -
          A[12] * A[7] * A[9]),
      F *
        (-A[0] * A[9] * A[15] +
          A[0] * A[11] * A[13] +
          A[8] * A[1] * A[15] -
          A[8] * A[3] * A[13] -
          A[12] * A[1] * A[11] +
          A[12] * A[3] * A[9]),
      F *
        (A[0] * A[5] * A[15] -
          A[0] * A[7] * A[13] -
          A[4] * A[1] * A[15] +
          A[4] * A[3] * A[13] +
          A[12] * A[1] * A[7] -
          A[12] * A[3] * A[5]),
      F *
        (-A[0] * A[5] * A[11] +
          A[0] * A[7] * A[9] +
          A[4] * A[1] * A[11] -
          A[4] * A[3] * A[9] -
          A[8] * A[1] * A[7] +
          A[8] * A[3] * A[5]),
      F *
        (-A[4] * A[9] * A[14] +
          A[4] * A[10] * A[13] +
          A[8] * A[5] * A[14] -
          A[8] * A[6] * A[13] -
          A[12] * A[5] * A[10] +
          A[12] * A[6] * A[9]),
      F *
        (A[0] * A[9] * A[14] -
          A[0] * A[10] * A[13] -
          A[8] * A[1] * A[14] +
          A[8] * A[2] * A[13] +
          A[12] * A[1] * A[10] -
          A[12] * A[2] * A[9]),
      F *
        (-A[0] * A[5] * A[14] +
          A[0] * A[6] * A[13] +
          A[4] * A[1] * A[14] -
          A[4] * A[2] * A[13] -
          A[12] * A[1] * A[6] +
          A[12] * A[2] * A[5]),
      F *
        (A[0] * A[5] * A[10] -
          A[0] * A[6] * A[9] -
          A[4] * A[1] * A[10] +
          A[4] * A[2] * A[9] +
          A[8] * A[1] * A[6] -
          A[8] * A[2] * A[5]),
    )
  }
  static Compose(A, Q, F) {
    const l = Q.x,
      B = Q.y,
      t = Q.z,
      d = Q.w,
      n = l + l,
      e = B + B,
      Z = t + t,
      V = l * n,
      I = l * e,
      R = l * Z,
      a = B * e,
      i = B * Z,
      g = t * Z,
      C = d * n,
      c = d * e,
      W = d * Z,
      h = F.x,
      s = F.y,
      o = F.z
    return new U(
      (1 - (a + g)) * h,
      (I + W) * h,
      (R - c) * h,
      0,
      (I - W) * s,
      (1 - (V + g)) * s,
      (i + C) * s,
      0,
      (R + c) * o,
      (i - C) * o,
      (1 - (V + a)) * o,
      0,
      A.x,
      A.y,
      A.z,
      1,
    )
  }
  toString() {
    return `[${this.buffer.join(', ')}]`
  }
}
class l extends Event {
  constructor(A) {
    super('objectAdded'), (this.object = A)
  }
}
class B extends Event {
  constructor(A) {
    super('objectRemoved'), (this.object = A)
  }
}
class t extends Event {
  constructor(A) {
    super('objectChanged'), (this.object = A)
  }
}
class d extends F {
  constructor() {
    super(),
      (this.positionChanged = !1),
      (this.rotationChanged = !1),
      (this.scaleChanged = !1),
      (this._position = new A()),
      (this._rotation = new Q()),
      (this._scale = new A(1, 1, 1)),
      (this._transform = new U()),
      (this._changeEvent = new t(this)),
      (this.update = () => {}),
      (this.applyPosition = () => {
        this.position = new A()
      }),
      (this.applyRotation = () => {
        this.rotation = new Q()
      }),
      (this.applyScale = () => {
        this.scale = new A(1, 1, 1)
      })
  }
  _updateMatrix() {
    this._transform = U.Compose(this._position, this._rotation, this._scale)
  }
  get position() {
    return this._position
  }
  set position(A) {
    this._position.equals(A) ||
      ((this._position = A),
      (this.positionChanged = !0),
      this._updateMatrix(),
      this.dispatchEvent(this._changeEvent))
  }
  get rotation() {
    return this._rotation
  }
  set rotation(A) {
    this._rotation.equals(A) ||
      ((this._rotation = A),
      (this.rotationChanged = !0),
      this._updateMatrix(),
      this.dispatchEvent(this._changeEvent))
  }
  get scale() {
    return this._scale
  }
  set scale(A) {
    this._scale.equals(A) ||
      ((this._scale = A),
      (this.scaleChanged = !0),
      this._updateMatrix(),
      this.dispatchEvent(this._changeEvent))
  }
  get forward() {
    let Q = new A(0, 0, 1)
    return (Q = this.rotation.apply(Q)), Q
  }
  get transform() {
    return this._transform
  }
}
class n {
  constructor(A = 1, Q = 0, F = 0, U = 0, l = 1, B = 0, t = 0, d = 0, n = 1) {
    this.buffer = [A, Q, F, U, l, B, t, d, n]
  }
  equals(A) {
    if (this.buffer.length !== A.buffer.length) return !1
    if (this.buffer === A.buffer) return !0
    for (let Q = 0; Q < this.buffer.length; Q++)
      if (this.buffer[Q] !== A.buffer[Q]) return !1
    return !0
  }
  multiply(A) {
    const Q = this.buffer,
      F = A.buffer
    return new n(
      F[0] * Q[0] + F[3] * Q[1] + F[6] * Q[2],
      F[1] * Q[0] + F[4] * Q[1] + F[7] * Q[2],
      F[2] * Q[0] + F[5] * Q[1] + F[8] * Q[2],
      F[0] * Q[3] + F[3] * Q[4] + F[6] * Q[5],
      F[1] * Q[3] + F[4] * Q[4] + F[7] * Q[5],
      F[2] * Q[3] + F[5] * Q[4] + F[8] * Q[5],
      F[0] * Q[6] + F[3] * Q[7] + F[6] * Q[8],
      F[1] * Q[6] + F[4] * Q[7] + F[7] * Q[8],
      F[2] * Q[6] + F[5] * Q[7] + F[8] * Q[8],
    )
  }
  clone() {
    const A = this.buffer
    return new n(A[0], A[1], A[2], A[3], A[4], A[5], A[6], A[7], A[8])
  }
  static Eye(A = 1) {
    return new n(A, 0, 0, 0, A, 0, 0, 0, A)
  }
  static Diagonal(A) {
    return new n(A.x, 0, 0, 0, A.y, 0, 0, 0, A.z)
  }
  static RotationFromQuaternion(A) {
    return new n(
      1 - 2 * A.y * A.y - 2 * A.z * A.z,
      2 * A.x * A.y - 2 * A.z * A.w,
      2 * A.x * A.z + 2 * A.y * A.w,
      2 * A.x * A.y + 2 * A.z * A.w,
      1 - 2 * A.x * A.x - 2 * A.z * A.z,
      2 * A.y * A.z - 2 * A.x * A.w,
      2 * A.x * A.z - 2 * A.y * A.w,
      2 * A.y * A.z + 2 * A.x * A.w,
      1 - 2 * A.x * A.x - 2 * A.y * A.y,
    )
  }
  static RotationFromEuler(A) {
    const Q = Math.cos(A.x),
      F = Math.sin(A.x),
      U = Math.cos(A.y),
      l = Math.sin(A.y),
      B = Math.cos(A.z),
      t = Math.sin(A.z)
    return new n(
      ...[
        U * B + l * F * t,
        -U * t + l * F * B,
        l * Q,
        Q * t,
        Q * B,
        -F,
        -l * B + U * F * t,
        l * t + U * F * B,
        U * Q,
      ],
    )
  }
  toString() {
    return `[${this.buffer.join(', ')}]`
  }
}
class e {
  constructor(A = 0, F = null, U = null, l = null, B = null) {
    ;(this.changed = !1),
      (this.detached = !1),
      (this._vertexCount = A),
      (this._positions = F || new Float32Array(0)),
      (this._rotations = U || new Float32Array(0)),
      (this._scales = l || new Float32Array(0)),
      (this._colors = B || new Uint8Array(0)),
      (this._selection = new Uint8Array(this.vertexCount)),
      (this.translate = (A) => {
        for (let Q = 0; Q < this.vertexCount; Q++)
          (this.positions[3 * Q + 0] += A.x),
            (this.positions[3 * Q + 1] += A.y),
            (this.positions[3 * Q + 2] += A.z)
        this.changed = !0
      }),
      (this.rotate = (A) => {
        const F = n.RotationFromQuaternion(A).buffer
        for (let U = 0; U < this.vertexCount; U++) {
          const l = this.positions[3 * U + 0],
            B = this.positions[3 * U + 1],
            t = this.positions[3 * U + 2]
          ;(this.positions[3 * U + 0] = F[0] * l + F[1] * B + F[2] * t),
            (this.positions[3 * U + 1] = F[3] * l + F[4] * B + F[5] * t),
            (this.positions[3 * U + 2] = F[6] * l + F[7] * B + F[8] * t)
          const d = new Q(
              this.rotations[4 * U + 1],
              this.rotations[4 * U + 2],
              this.rotations[4 * U + 3],
              this.rotations[4 * U + 0],
            ),
            n = A.multiply(d)
          ;(this.rotations[4 * U + 1] = n.x),
            (this.rotations[4 * U + 2] = n.y),
            (this.rotations[4 * U + 3] = n.z),
            (this.rotations[4 * U + 0] = n.w)
        }
        this.changed = !0
      }),
      (this.scale = (A) => {
        for (let Q = 0; Q < this.vertexCount; Q++)
          (this.positions[3 * Q + 0] *= A.x),
            (this.positions[3 * Q + 1] *= A.y),
            (this.positions[3 * Q + 2] *= A.z),
            (this.scales[3 * Q + 0] *= A.x),
            (this.scales[3 * Q + 1] *= A.y),
            (this.scales[3 * Q + 2] *= A.z)
        this.changed = !0
      }),
      (this.serialize = () => {
        const A = new Uint8Array(this.vertexCount * e.RowLength),
          Q = new Float32Array(A.buffer),
          F = new Uint8Array(A.buffer)
        for (let A = 0; A < this.vertexCount; A++)
          (Q[8 * A + 0] = this.positions[3 * A + 0]),
            (Q[8 * A + 1] = this.positions[3 * A + 1]),
            (Q[8 * A + 2] = this.positions[3 * A + 2]),
            (F[32 * A + 24 + 0] = this.colors[4 * A + 0]),
            (F[32 * A + 24 + 1] = this.colors[4 * A + 1]),
            (F[32 * A + 24 + 2] = this.colors[4 * A + 2]),
            (F[32 * A + 24 + 3] = this.colors[4 * A + 3]),
            (Q[8 * A + 3 + 0] = this.scales[3 * A + 0]),
            (Q[8 * A + 3 + 1] = this.scales[3 * A + 1]),
            (Q[8 * A + 3 + 2] = this.scales[3 * A + 2]),
            (F[32 * A + 28 + 0] =
              (128 * this.rotations[4 * A + 0] + 128) & 255),
            (F[32 * A + 28 + 1] =
              (128 * this.rotations[4 * A + 1] + 128) & 255),
            (F[32 * A + 28 + 2] =
              (128 * this.rotations[4 * A + 2] + 128) & 255),
            (F[32 * A + 28 + 3] = (128 * this.rotations[4 * A + 3] + 128) & 255)
        return A
      }),
      (this.reattach = (A, Q, F, U, l) => {
        console.assert(
          A.byteLength === 3 * this.vertexCount * 4,
          `Expected ${3 * this.vertexCount * 4} bytes, got ${
            A.byteLength
          } bytes`,
        ),
          (this._positions = new Float32Array(A)),
          (this._rotations = new Float32Array(Q)),
          (this._scales = new Float32Array(F)),
          (this._colors = new Uint8Array(U)),
          (this._selection = new Uint8Array(l)),
          (this.detached = !1)
      })
  }
  static Deserialize(A) {
    const Q = A.length / e.RowLength,
      F = new Float32Array(3 * Q),
      U = new Float32Array(4 * Q),
      l = new Float32Array(3 * Q),
      B = new Uint8Array(4 * Q),
      t = new Float32Array(A.buffer),
      d = new Uint8Array(A.buffer)
    for (let A = 0; A < Q; A++)
      (F[3 * A + 0] = t[8 * A + 0]),
        (F[3 * A + 1] = t[8 * A + 1]),
        (F[3 * A + 2] = t[8 * A + 2]),
        (U[4 * A + 0] = (d[32 * A + 28 + 0] - 128) / 128),
        (U[4 * A + 1] = (d[32 * A + 28 + 1] - 128) / 128),
        (U[4 * A + 2] = (d[32 * A + 28 + 2] - 128) / 128),
        (U[4 * A + 3] = (d[32 * A + 28 + 3] - 128) / 128),
        (l[3 * A + 0] = t[8 * A + 3 + 0]),
        (l[3 * A + 1] = t[8 * A + 3 + 1]),
        (l[3 * A + 2] = t[8 * A + 3 + 2]),
        (B[4 * A + 0] = d[32 * A + 24 + 0]),
        (B[4 * A + 1] = d[32 * A + 24 + 1]),
        (B[4 * A + 2] = d[32 * A + 24 + 2]),
        (B[4 * A + 3] = d[32 * A + 24 + 3])
    return new e(Q, F, U, l, B)
  }
  get vertexCount() {
    return this._vertexCount
  }
  get positions() {
    return this._positions
  }
  get rotations() {
    return this._rotations
  }
  get scales() {
    return this._scales
  }
  get colors() {
    return this._colors
  }
  get selection() {
    return this._selection
  }
}
e.RowLength = 32
class Z {
  static SplatToPLY(A, F) {
    let U = 'ply\nformat binary_little_endian 1.0\n'
    U += `element vertex ${F}\n`
    const l = ['x', 'y', 'z', 'nx', 'ny', 'nz', 'f_dc_0', 'f_dc_1', 'f_dc_2']
    for (let A = 0; A < 45; A++) l.push(`f_rest_${A}`)
    l.push('opacity'),
      l.push('scale_0'),
      l.push('scale_1'),
      l.push('scale_2'),
      l.push('rot_0'),
      l.push('rot_1'),
      l.push('rot_2'),
      l.push('rot_3')
    for (const A of l) U += `property float ${A}\n`
    U += 'end_header\n'
    const B = new TextEncoder().encode(U),
      t = 248,
      d = F * t,
      n = new DataView(new ArrayBuffer(B.length + d))
    new Uint8Array(n.buffer).set(B, 0)
    const e = new Float32Array(A),
      Z = new Uint8Array(A),
      V = B.length,
      I = 220,
      R = 232
    for (let A = 0; A < F; A++) {
      const F = e[8 * A + 0],
        U = e[8 * A + 1],
        l = e[8 * A + 2],
        B = (Z[32 * A + 24 + 0] / 255 - 0.5) / this.SH_C0,
        d = (Z[32 * A + 24 + 1] / 255 - 0.5) / this.SH_C0,
        a = (Z[32 * A + 24 + 2] / 255 - 0.5) / this.SH_C0,
        i = Z[32 * A + 24 + 3] / 255,
        g = Math.log(i / (1 - i)),
        C = Math.log(e[8 * A + 3 + 0]),
        c = Math.log(e[8 * A + 3 + 1]),
        W = Math.log(e[8 * A + 3 + 2])
      let h = new Q(
        (Z[32 * A + 28 + 1] - 128) / 128,
        (Z[32 * A + 28 + 2] - 128) / 128,
        (Z[32 * A + 28 + 3] - 128) / 128,
        (Z[32 * A + 28 + 0] - 128) / 128,
      )
      h = h.normalize()
      const s = h.w,
        o = h.x,
        J = h.y,
        b = h.z
      n.setFloat32(V + t * A + 0, F, !0),
        n.setFloat32(V + t * A + 4, U, !0),
        n.setFloat32(V + t * A + 8, l, !0),
        n.setFloat32(V + t * A + 24 + 0, B, !0),
        n.setFloat32(V + t * A + 24 + 4, d, !0),
        n.setFloat32(V + t * A + 24 + 8, a, !0),
        n.setFloat32(V + t * A + 216, g, !0),
        n.setFloat32(V + t * A + I + 0, C, !0),
        n.setFloat32(V + t * A + I + 4, c, !0),
        n.setFloat32(V + t * A + I + 8, W, !0),
        n.setFloat32(V + t * A + R + 0, s, !0),
        n.setFloat32(V + t * A + R + 4, o, !0),
        n.setFloat32(V + t * A + R + 8, J, !0),
        n.setFloat32(V + t * A + R + 12, b, !0)
    }
    return n.buffer
  }
}
Z.SH_C0 = 0.28209479177387814
class V extends d {
  constructor(F = void 0) {
    super(),
      (this.selectedChanged = !1),
      (this._selected = !1),
      (this._data = F || new e()),
      (this.applyPosition = () => {
        this.data.translate(this.position), (this.position = new A())
      }),
      (this.applyRotation = () => {
        this.data.rotate(this.rotation), (this.rotation = new Q())
      }),
      (this.applyScale = () => {
        this.data.scale(this.scale), (this.scale = new A(1, 1, 1))
      })
  }
  saveToFile(A = null, Q = null) {
    if (!document) return
    if (Q) {
      if ('splat' !== Q && 'ply' !== Q)
        throw new Error("Invalid format. Must be 'splat' or 'ply'")
    } else Q = 'splat'
    if (!A) {
      const F = new Date()
      A = `splat-${F.getFullYear()}-${F.getMonth() + 1}-${F.getDate()}.${Q}`
    }
    this.applyRotation(), this.applyScale(), this.applyPosition()
    const F = this.data.serialize()
    let U
    if ('ply' === Q) {
      const A = Z.SplatToPLY(F.buffer, this.data.vertexCount)
      U = new Blob([A], { type: 'application/octet-stream' })
    } else U = new Blob([F.buffer], { type: 'application/octet-stream' })
    const l = document.createElement('a')
    ;(l.download = A), (l.href = URL.createObjectURL(U)), l.click()
  }
  get data() {
    return this._data
  }
  get selected() {
    return this._selected
  }
  set selected(A) {
    this._selected !== A &&
      ((this._selected = A),
      (this.selectedChanged = !0),
      this.dispatchEvent(this._changeEvent))
  }
}
class I {
  constructor() {
    ;(this._fx = 1132),
      (this._fy = 1132),
      (this._near = 0.1),
      (this._far = 100),
      (this._width = 512),
      (this._height = 512),
      (this._projectionMatrix = new U()),
      (this._viewMatrix = new U()),
      (this._viewProj = new U()),
      (this._updateProjectionMatrix = () => {
        ;(this._projectionMatrix = new U(
          (2 * this.fx) / this.width,
          0,
          0,
          0,
          0,
          (-2 * this.fy) / this.height,
          0,
          0,
          0,
          0,
          this.far / (this.far - this.near),
          1,
          0,
          0,
          (-this.far * this.near) / (this.far - this.near),
          0,
        )),
          (this._viewProj = this.projectionMatrix.multiply(this.viewMatrix))
      }),
      (this.update = (A, Q) => {
        const F = n.RotationFromQuaternion(Q).buffer,
          l = A.flat()
        ;(this._viewMatrix = new U(
          F[0],
          F[1],
          F[2],
          0,
          F[3],
          F[4],
          F[5],
          0,
          F[6],
          F[7],
          F[8],
          0,
          -l[0] * F[0] - l[1] * F[3] - l[2] * F[6],
          -l[0] * F[1] - l[1] * F[4] - l[2] * F[7],
          -l[0] * F[2] - l[1] * F[5] - l[2] * F[8],
          1,
        )),
          (this._viewProj = this.projectionMatrix.multiply(this.viewMatrix))
      }),
      (this.setSize = (A, Q) => {
        ;(this._width = A), (this._height = Q), this._updateProjectionMatrix()
      })
  }
  get fx() {
    return this._fx
  }
  set fx(A) {
    this._fx !== A && ((this._fx = A), this._updateProjectionMatrix())
  }
  get fy() {
    return this._fy
  }
  set fy(A) {
    this._fy !== A && ((this._fy = A), this._updateProjectionMatrix())
  }
  get near() {
    return this._near
  }
  set near(A) {
    this._near !== A && ((this._near = A), this._updateProjectionMatrix())
  }
  get far() {
    return this._far
  }
  set far(A) {
    this._far !== A && ((this._far = A), this._updateProjectionMatrix())
  }
  get width() {
    return this._width
  }
  get height() {
    return this._height
  }
  get projectionMatrix() {
    return this._projectionMatrix
  }
  get viewMatrix() {
    return this._viewMatrix
  }
  get viewProj() {
    return this._viewProj
  }
}
class R {
  constructor(A = 0, Q = 0, F = 0, U = 0) {
    ;(this.x = A), (this.y = Q), (this.z = F), (this.w = U)
  }
  equals(A) {
    return this.x === A.x && this.y === A.y && this.z === A.z && this.w === A.w
  }
  add(A) {
    return 'number' == typeof A
      ? new R(this.x + A, this.y + A, this.z + A, this.w + A)
      : new R(this.x + A.x, this.y + A.y, this.z + A.z, this.w + A.w)
  }
  subtract(A) {
    return 'number' == typeof A
      ? new R(this.x - A, this.y - A, this.z - A, this.w - A)
      : new R(this.x - A.x, this.y - A.y, this.z - A.z, this.w - A.w)
  }
  multiply(A) {
    return 'number' == typeof A
      ? new R(this.x * A, this.y * A, this.z * A, this.w * A)
      : A instanceof R
      ? new R(this.x * A.x, this.y * A.y, this.z * A.z, this.w * A.w)
      : new R(
          this.x * A.buffer[0] +
            this.y * A.buffer[4] +
            this.z * A.buffer[8] +
            this.w * A.buffer[12],
          this.x * A.buffer[1] +
            this.y * A.buffer[5] +
            this.z * A.buffer[9] +
            this.w * A.buffer[13],
          this.x * A.buffer[2] +
            this.y * A.buffer[6] +
            this.z * A.buffer[10] +
            this.w * A.buffer[14],
          this.x * A.buffer[3] +
            this.y * A.buffer[7] +
            this.z * A.buffer[11] +
            this.w * A.buffer[15],
        )
  }
  dot(A) {
    return this.x * A.x + this.y * A.y + this.z * A.z + this.w * A.w
  }
  lerp(A, Q) {
    return new R(
      this.x + (A.x - this.x) * Q,
      this.y + (A.y - this.y) * Q,
      this.z + (A.z - this.z) * Q,
      this.w + (A.w - this.w) * Q,
    )
  }
  magnitude() {
    return Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w,
    )
  }
  distanceTo(A) {
    return Math.sqrt(
      (this.x - A.x) ** 2 +
        (this.y - A.y) ** 2 +
        (this.z - A.z) ** 2 +
        (this.w - A.w) ** 2,
    )
  }
  normalize() {
    const A = this.magnitude()
    return new R(this.x / A, this.y / A, this.z / A, this.w / A)
  }
  flat() {
    return [this.x, this.y, this.z, this.w]
  }
  clone() {
    return new R(this.x, this.y, this.z, this.w)
  }
  toString() {
    return `[${this.flat().join(', ')}]`
  }
}
class a extends d {
  constructor(Q = void 0) {
    super(),
      (this._data = Q || new I()),
      (this._position = new A(0, 0, -5)),
      (this.update = () => {
        this.data.update(this.position, this.rotation)
      }),
      (this.screenPointToRay = (Q, F) => {
        const U = new R(Q, F, -1, 1),
          l = this._data.projectionMatrix.invert(),
          B = U.multiply(l),
          t = this._data.viewMatrix.invert(),
          d = B.multiply(t)
        return new A(d.x / d.w, d.y / d.w, d.z / d.w)
          .subtract(this.position)
          .normalize()
      })
  }
  get data() {
    return this._data
  }
}
class i extends F {
  constructor() {
    super(),
      (this._objects = []),
      (this.addObject = (A) => {
        this.objects.push(A), this.dispatchEvent(new l(A))
      }),
      (this.removeObject = (A) => {
        const Q = this.objects.indexOf(A)
        if (Q < 0) throw new Error('Object not found in scene')
        this.objects.splice(Q, 1), this.dispatchEvent(new B(A))
      }),
      (this.findObject = (A) => {
        for (const Q of this.objects) if (A(Q)) return Q
      }),
      (this.findObjectOfType = (A) => {
        for (const Q of this.objects) if (Q instanceof A) return Q
      }),
      (this.reset = () => {
        const A = this.objects.slice()
        for (const Q of A) this.removeObject(Q)
      }),
      this.reset()
  }
  saveToFile(A = null, Q = null) {
    if (!document) return
    if (Q) {
      if ('splat' !== Q && 'ply' !== Q)
        throw new Error("Invalid format. Must be 'splat' or 'ply'")
    } else Q = 'splat'
    if (!A) {
      const F = new Date()
      A = `scene-${F.getFullYear()}-${F.getMonth() + 1}-${F.getDate()}.${Q}`
    }
    const F = []
    let U = 0
    for (const A of this.objects)
      if (
        (A.applyRotation(), A.applyScale(), A.applyPosition(), A instanceof V)
      ) {
        const Q = A.data.serialize()
        F.push(Q), (U += A.data.vertexCount)
      }
    const l = new Uint8Array(U * e.RowLength)
    let B,
      t = 0
    for (const A of F) l.set(A, t), (t += A.length)
    if ('ply' === Q) {
      const A = Z.SplatToPLY(l.buffer, U)
      B = new Blob([A], { type: 'application/octet-stream' })
    } else B = new Blob([l.buffer], { type: 'application/octet-stream' })
    const d = document.createElement('a')
    ;(d.download = A), (d.href = URL.createObjectURL(B)), d.click()
  }
  get objects() {
    return this._objects
  }
}
class g {
  static async LoadAsync(A, Q, F, U = !1) {
    const l = await fetch(A, {
      mode: 'cors',
      credentials: 'omit',
      cache: U ? 'force-cache' : 'default',
    })
    if (200 != l.status) throw new Error(l.status + ' Unable to load ' + l.url)
    const B = l.body.getReader(),
      t = parseInt(l.headers.get('content-length')),
      d = new Uint8Array(t)
    let n = 0
    for (;;) {
      const { done: A, value: Q } = await B.read()
      if (A) break
      d.set(Q, n), (n += Q.length), null == F || F(n / t)
    }
    const Z = e.Deserialize(d),
      I = new V(Z)
    return Q.addObject(I), I
  }
  static async LoadFromFileAsync(A, Q, F) {
    const U = new FileReader()
    let l = new V()
    return (
      (U.onload = (A) => {
        const F = new Uint8Array(A.target.result),
          U = e.Deserialize(F)
        ;(l = new V(U)), Q.addObject(l)
      }),
      (U.onprogress = (A) => {
        null == F || F(A.loaded / A.total)
      }),
      U.readAsArrayBuffer(A),
      await new Promise((A) => {
        U.onloadend = () => {
          A()
        }
      }),
      l
    )
  }
}
class C {
  static async LoadAsync(A, Q, F, U = '', l = !1) {
    const B = await fetch(A, {
      mode: 'cors',
      credentials: 'omit',
      cache: l ? 'force-cache' : 'default',
    })
    if (200 != B.status) throw new Error(B.status + ' Unable to load ' + B.url)
    const t = B.body.getReader(),
      d = parseInt(B.headers.get('content-length')),
      n = new Uint8Array(d)
    let Z = 0
    for (;;) {
      const { done: A, value: Q } = await t.read()
      if (A) break
      n.set(Q, Z), (Z += Q.length), null == F || F(Z / d)
    }
    if (112 !== n[0] || 108 !== n[1] || 121 !== n[2] || 10 !== n[3])
      throw new Error('Invalid PLY file')
    const I = new Uint8Array(this._ParsePLYBuffer(n.buffer, U)),
      R = e.Deserialize(I),
      a = new V(R)
    return Q.addObject(a), a
  }
  static async LoadFromFileAsync(A, Q, F, U = '') {
    const l = new FileReader()
    let B = new V()
    return (
      (l.onload = (A) => {
        const F = new Uint8Array(this._ParsePLYBuffer(A.target.result, U)),
          l = e.Deserialize(F)
        ;(B = new V(l)), Q.addObject(B)
      }),
      (l.onprogress = (A) => {
        null == F || F(A.loaded / A.total)
      }),
      l.readAsArrayBuffer(A),
      await new Promise((A) => {
        l.onloadend = () => {
          A()
        }
      }),
      B
    )
  }
  static _ParsePLYBuffer(F, U) {
    const l = new Uint8Array(F),
      B = new TextDecoder().decode(l.slice(0, 10240)),
      t = 'end_header\n',
      d = B.indexOf(t)
    if (d < 0) throw new Error('Unable to read .ply file header')
    const n = parseInt(/element vertex (\d+)\n/.exec(B)[1])
    let V = 0
    const I = {
        double: 8,
        int: 4,
        uint: 4,
        float: 4,
        short: 2,
        ushort: 2,
        uchar: 1,
      },
      R = []
    for (const A of B.slice(0, d)
      .split('\n')
      .filter((A) => A.startsWith('property '))) {
      const [Q, F, U] = A.split(' ')
      if ((R.push({ name: U, type: F, offset: V }), !I[F]))
        throw new Error(`Unsupported property type: ${F}`)
      V += I[F]
    }
    const a = new DataView(F, d + 11),
      i = new ArrayBuffer(e.RowLength * n),
      g = Q.FromEuler(new A(Math.PI / 2, 0, 0))
    for (let A = 0; A < n; A++) {
      const F = new Float32Array(i, A * e.RowLength, 3),
        l = new Float32Array(i, A * e.RowLength + 12, 3),
        B = new Uint8ClampedArray(i, A * e.RowLength + 24, 4),
        t = new Uint8ClampedArray(i, A * e.RowLength + 28, 4)
      let d = 255,
        n = 0,
        I = 0,
        C = 0
      R.forEach((Q) => {
        let U
        switch (Q.type) {
          case 'float':
            U = a.getFloat32(Q.offset + A * V, !0)
            break
          case 'int':
            U = a.getInt32(Q.offset + A * V, !0)
            break
          default:
            throw new Error(`Unsupported property type: ${Q.type}`)
        }
        switch (Q.name) {
          case 'x':
            F[0] = U
            break
          case 'y':
            F[1] = U
            break
          case 'z':
            F[2] = U
            break
          case 'scale_0':
            l[0] = Math.exp(U)
            break
          case 'scale_1':
            l[1] = Math.exp(U)
            break
          case 'scale_2':
            l[2] = Math.exp(U)
            break
          case 'red':
            B[0] = U
            break
          case 'green':
            B[1] = U
            break
          case 'blue':
            B[2] = U
            break
          case 'f_dc_0':
            B[0] = 255 * (0.5 + Z.SH_C0 * U)
            break
          case 'f_dc_1':
            B[1] = 255 * (0.5 + Z.SH_C0 * U)
            break
          case 'f_dc_2':
            B[2] = 255 * (0.5 + Z.SH_C0 * U)
            break
          case 'f_dc_3':
            B[3] = 255 * (0.5 + Z.SH_C0 * U)
            break
          case 'opacity':
            B[3] = (1 / (1 + Math.exp(-U))) * 255
            break
          case 'rot_0':
            d = U
            break
          case 'rot_1':
            n = U
            break
          case 'rot_2':
            I = U
            break
          case 'rot_3':
            C = U
        }
      })
      let c = new Q(n, I, C, d)
      switch (U) {
        case 'polycam': {
          const A = F[1]
          ;(F[1] = -F[2]), (F[2] = A), (c = g.multiply(c))
          break
        }
        case '':
          break
        default:
          throw new Error(`Unsupported format: ${U}`)
      }
      ;(c = c.normalize()),
        (t[0] = 128 * c.w + 128),
        (t[1] = 128 * c.x + 128),
        (t[2] = 128 * c.y + 128),
        (t[3] = 128 * c.z + 128)
    }
    return i
  }
}
function c(A, Q, F) {
  var U = void 0 === Q ? null : Q,
    l = (function (A, Q) {
      var F = atob(A)
      if (Q) {
        for (var U = new Uint8Array(F.length), l = 0, B = F.length; l < B; ++l)
          U[l] = F.charCodeAt(l)
        return String.fromCharCode.apply(null, new Uint16Array(U.buffer))
      }
      return F
    })(A, void 0 !== F && F),
    B = l.indexOf('\n', 10) + 1,
    t = l.substring(B) + (U ? '//# sourceMappingURL=' + U : ''),
    d = new Blob([t], { type: 'application/javascript' })
  return URL.createObjectURL(d)
}
function W(A, Q, F) {
  var U
  return function (l) {
    return (U = U || c(A, Q, F)), new Worker(U, l)
  }
}
var h = W(
  'Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwooZnVuY3Rpb24gKCkgewogICd1c2Ugc3RyaWN0JzsKCiAgdmFyIGxvYWRXYXNtID0gKCgpID0+IHsKICAgIAogICAgcmV0dXJuICgKICBmdW5jdGlvbihtb2R1bGVBcmcgPSB7fSkgewoKICB2YXIgTW9kdWxlPW1vZHVsZUFyZzt2YXIgcmVhZHlQcm9taXNlUmVzb2x2ZSxyZWFkeVByb21pc2VSZWplY3Q7TW9kdWxlWyJyZWFkeSJdPW5ldyBQcm9taXNlKChyZXNvbHZlLHJlamVjdCk9PntyZWFkeVByb21pc2VSZXNvbHZlPXJlc29sdmU7cmVhZHlQcm9taXNlUmVqZWN0PXJlamVjdDt9KTt2YXIgbW9kdWxlT3ZlcnJpZGVzPU9iamVjdC5hc3NpZ24oe30sTW9kdWxlKTt2YXIgc2NyaXB0RGlyZWN0b3J5PSIiO2Z1bmN0aW9uIGxvY2F0ZUZpbGUocGF0aCl7aWYoTW9kdWxlWyJsb2NhdGVGaWxlIl0pe3JldHVybiBNb2R1bGVbImxvY2F0ZUZpbGUiXShwYXRoLHNjcmlwdERpcmVjdG9yeSl9cmV0dXJuIHNjcmlwdERpcmVjdG9yeStwYXRofXZhciByZWFkQmluYXJ5O3t7c2NyaXB0RGlyZWN0b3J5PXNlbGYubG9jYXRpb24uaHJlZjt9aWYoc2NyaXB0RGlyZWN0b3J5LmluZGV4T2YoImJsb2I6IikhPT0wKXtzY3JpcHREaXJlY3Rvcnk9c2NyaXB0RGlyZWN0b3J5LnN1YnN0cigwLHNjcmlwdERpcmVjdG9yeS5yZXBsYWNlKC9bPyNdLiovLCIiKS5sYXN0SW5kZXhPZigiLyIpKzEpO31lbHNlIHtzY3JpcHREaXJlY3Rvcnk9IiI7fXt7cmVhZEJpbmFyeT11cmw9Pnt2YXIgeGhyPW5ldyBYTUxIdHRwUmVxdWVzdDt4aHIub3BlbigiR0VUIix1cmwsZmFsc2UpO3hoci5yZXNwb25zZVR5cGU9ImFycmF5YnVmZmVyIjt4aHIuc2VuZChudWxsKTtyZXR1cm4gbmV3IFVpbnQ4QXJyYXkoeGhyLnJlc3BvbnNlKX07fX19TW9kdWxlWyJwcmludCJdfHxjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpO3ZhciBlcnI9TW9kdWxlWyJwcmludEVyciJdfHxjb25zb2xlLmVycm9yLmJpbmQoY29uc29sZSk7T2JqZWN0LmFzc2lnbihNb2R1bGUsbW9kdWxlT3ZlcnJpZGVzKTttb2R1bGVPdmVycmlkZXM9bnVsbDtpZihNb2R1bGVbImFyZ3VtZW50cyJdKU1vZHVsZVsiYXJndW1lbnRzIl07aWYoTW9kdWxlWyJ0aGlzUHJvZ3JhbSJdKU1vZHVsZVsidGhpc1Byb2dyYW0iXTtpZihNb2R1bGVbInF1aXQiXSlNb2R1bGVbInF1aXQiXTt2YXIgd2FzbUJpbmFyeTtpZihNb2R1bGVbIndhc21CaW5hcnkiXSl3YXNtQmluYXJ5PU1vZHVsZVsid2FzbUJpbmFyeSJdO2lmKHR5cGVvZiBXZWJBc3NlbWJseSE9Im9iamVjdCIpe2Fib3J0KCJubyBuYXRpdmUgd2FzbSBzdXBwb3J0IGRldGVjdGVkIik7fWZ1bmN0aW9uIGludEFycmF5RnJvbUJhc2U2NChzKXt2YXIgZGVjb2RlZD1hdG9iKHMpO3ZhciBieXRlcz1uZXcgVWludDhBcnJheShkZWNvZGVkLmxlbmd0aCk7Zm9yKHZhciBpPTA7aTxkZWNvZGVkLmxlbmd0aDsrK2kpe2J5dGVzW2ldPWRlY29kZWQuY2hhckNvZGVBdChpKTt9cmV0dXJuIGJ5dGVzfWZ1bmN0aW9uIHRyeVBhcnNlQXNEYXRhVVJJKGZpbGVuYW1lKXtpZighaXNEYXRhVVJJKGZpbGVuYW1lKSl7cmV0dXJufXJldHVybiBpbnRBcnJheUZyb21CYXNlNjQoZmlsZW5hbWUuc2xpY2UoZGF0YVVSSVByZWZpeC5sZW5ndGgpKX12YXIgd2FzbU1lbW9yeTt2YXIgQUJPUlQ9ZmFsc2U7dmFyIEhFQVA4LEhFQVBVOCxIRUFQMTYsSEVBUFUxNixIRUFQMzIsSEVBUFUzMixIRUFQRjMyLEhFQVBGNjQ7ZnVuY3Rpb24gdXBkYXRlTWVtb3J5Vmlld3MoKXt2YXIgYj13YXNtTWVtb3J5LmJ1ZmZlcjtNb2R1bGVbIkhFQVA4Il09SEVBUDg9bmV3IEludDhBcnJheShiKTtNb2R1bGVbIkhFQVAxNiJdPUhFQVAxNj1uZXcgSW50MTZBcnJheShiKTtNb2R1bGVbIkhFQVBVOCJdPUhFQVBVOD1uZXcgVWludDhBcnJheShiKTtNb2R1bGVbIkhFQVBVMTYiXT1IRUFQVTE2PW5ldyBVaW50MTZBcnJheShiKTtNb2R1bGVbIkhFQVAzMiJdPUhFQVAzMj1uZXcgSW50MzJBcnJheShiKTtNb2R1bGVbIkhFQVBVMzIiXT1IRUFQVTMyPW5ldyBVaW50MzJBcnJheShiKTtNb2R1bGVbIkhFQVBGMzIiXT1IRUFQRjMyPW5ldyBGbG9hdDMyQXJyYXkoYik7TW9kdWxlWyJIRUFQRjY0Il09SEVBUEY2ND1uZXcgRmxvYXQ2NEFycmF5KGIpO312YXIgX19BVFBSRVJVTl9fPVtdO3ZhciBfX0FUSU5JVF9fPVtdO3ZhciBfX0FUUE9TVFJVTl9fPVtdO2Z1bmN0aW9uIHByZVJ1bigpe2lmKE1vZHVsZVsicHJlUnVuIl0pe2lmKHR5cGVvZiBNb2R1bGVbInByZVJ1biJdPT0iZnVuY3Rpb24iKU1vZHVsZVsicHJlUnVuIl09W01vZHVsZVsicHJlUnVuIl1dO3doaWxlKE1vZHVsZVsicHJlUnVuIl0ubGVuZ3RoKXthZGRPblByZVJ1bihNb2R1bGVbInByZVJ1biJdLnNoaWZ0KCkpO319Y2FsbFJ1bnRpbWVDYWxsYmFja3MoX19BVFBSRVJVTl9fKTt9ZnVuY3Rpb24gaW5pdFJ1bnRpbWUoKXtjYWxsUnVudGltZUNhbGxiYWNrcyhfX0FUSU5JVF9fKTt9ZnVuY3Rpb24gcG9zdFJ1bigpe2lmKE1vZHVsZVsicG9zdFJ1biJdKXtpZih0eXBlb2YgTW9kdWxlWyJwb3N0UnVuIl09PSJmdW5jdGlvbiIpTW9kdWxlWyJwb3N0UnVuIl09W01vZHVsZVsicG9zdFJ1biJdXTt3aGlsZShNb2R1bGVbInBvc3RSdW4iXS5sZW5ndGgpe2FkZE9uUG9zdFJ1bihNb2R1bGVbInBvc3RSdW4iXS5zaGlmdCgpKTt9fWNhbGxSdW50aW1lQ2FsbGJhY2tzKF9fQVRQT1NUUlVOX18pO31mdW5jdGlvbiBhZGRPblByZVJ1bihjYil7X19BVFBSRVJVTl9fLnVuc2hpZnQoY2IpO31mdW5jdGlvbiBhZGRPbkluaXQoY2Ipe19fQVRJTklUX18udW5zaGlmdChjYik7fWZ1bmN0aW9uIGFkZE9uUG9zdFJ1bihjYil7X19BVFBPU1RSVU5fXy51bnNoaWZ0KGNiKTt9dmFyIHJ1bkRlcGVuZGVuY2llcz0wO3ZhciBkZXBlbmRlbmNpZXNGdWxmaWxsZWQ9bnVsbDtmdW5jdGlvbiBhZGRSdW5EZXBlbmRlbmN5KGlkKXtydW5EZXBlbmRlbmNpZXMrKztNb2R1bGVbIm1vbml0b3JSdW5EZXBlbmRlbmNpZXMiXT8uKHJ1bkRlcGVuZGVuY2llcyk7fWZ1bmN0aW9uIHJlbW92ZVJ1bkRlcGVuZGVuY3koaWQpe3J1bkRlcGVuZGVuY2llcy0tO01vZHVsZVsibW9uaXRvclJ1bkRlcGVuZGVuY2llcyJdPy4ocnVuRGVwZW5kZW5jaWVzKTtpZihydW5EZXBlbmRlbmNpZXM9PTApe2lmKGRlcGVuZGVuY2llc0Z1bGZpbGxlZCl7dmFyIGNhbGxiYWNrPWRlcGVuZGVuY2llc0Z1bGZpbGxlZDtkZXBlbmRlbmNpZXNGdWxmaWxsZWQ9bnVsbDtjYWxsYmFjaygpO319fWZ1bmN0aW9uIGFib3J0KHdoYXQpe01vZHVsZVsib25BYm9ydCJdPy4od2hhdCk7d2hhdD0iQWJvcnRlZCgiK3doYXQrIikiO2Vycih3aGF0KTtBQk9SVD10cnVlO3doYXQrPSIuIEJ1aWxkIHdpdGggLXNBU1NFUlRJT05TIGZvciBtb3JlIGluZm8uIjt2YXIgZT1uZXcgV2ViQXNzZW1ibHkuUnVudGltZUVycm9yKHdoYXQpO3JlYWR5UHJvbWlzZVJlamVjdChlKTt0aHJvdyBlfXZhciBkYXRhVVJJUHJlZml4PSJkYXRhOmFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbTtiYXNlNjQsIjt2YXIgaXNEYXRhVVJJPWZpbGVuYW1lPT5maWxlbmFtZS5zdGFydHNXaXRoKGRhdGFVUklQcmVmaXgpO3ZhciB3YXNtQmluYXJ5RmlsZTt3YXNtQmluYXJ5RmlsZT0iZGF0YTphcHBsaWNhdGlvbi9vY3RldC1zdHJlYW07YmFzZTY0LEFHRnpiUUVBQUFBQld3MWdCSDkvZjM4QVlBTi9mMzhBWUFWL2YzOS9md0JnQm45L2YzOS9md0JnQVg4QmYyQUJmd0JnQTM5L2Z3Ri9ZQUovZndCZ0FBQmdBbjkvQVg5Z0IzOS9mMzkvZjM4QVlBUi9mMzUrQUdBS2YzOS9mMzkvZjM5L2Z3QUNQUW9CWVFGaEFBRUJZUUZpQUFJQllRRmpBQUVCWVFGa0FBY0JZUUZsQUFFQllRRm1BQW9CWVFGbkFBUUJZUUZvQUFVQllRRnBBQUFCWVFGcUFBY0RHUmdHQkFVSUJRVUpDd2dCQUFFRUJBTURBZ0lBQUFrR0Jnd0VCUUZ3QVJBUUJRY0JBWUFDZ0lBQ0JnZ0Jmd0ZCc0o0RUN3Y1pCZ0ZyQWdBQmJBQU5BVzBBSVFGdUFRQUJid0FYQVhBQUR3a1ZBUUJCQVFzUEVoWU1EZzRnREI4WUdoME1HUnNjQ3FwT0dIRUJBWDhnQWtVRVFDQUFLQUlFSUFFb0FnUkdEd3NnQUNBQlJnUkFRUUVQQ3dKQUlBQW9BZ1FpQWkwQUFDSUFSU0FBSUFFb0FnUWlBUzBBQUNJRFIzSU5BQU5BSUFFdEFBRWhBeUFDTFFBQklnQkZEUUVnQVVFQmFpRUJJQUpCQVdvaEFpQUFJQU5HRFFBTEN5QUFJQU5HQzA4QkFuOUJxQm9vQWdBaUFTQUFRUWRxUVhoeElnSnFJUUFDUUNBQ1FRQWdBQ0FCVFJ0RkJFQWdBRDhBUVJCMFRRMEJJQUFRQmcwQkMwRzRHa0V3TmdJQVFYOFBDMEdvR2lBQU5nSUFJQUVMQmdBZ0FCQVBDeWtBUWJBYVFRRTJBZ0JCdEJwQkFEWUNBQkFTUWJRYVFhd2FLQUlBTmdJQVFhd2FRYkFhTmdJQUN3SUFDOUlMQVFkL0FrQWdBRVVOQUNBQVFRaHJJZ0lnQUVFRWF5Z0NBQ0lCUVhoeElnQnFJUVVDUUNBQlFRRnhEUUFnQVVFQ2NVVU5BU0FDSUFJb0FnQWlBV3NpQWtITUdpZ0NBRWtOQVNBQUlBRnFJUUFDUUFKQVFkQWFLQUlBSUFKSEJFQWdBVUgvQVUwRVFDQUJRUU4ySVFRZ0FpZ0NEQ0lCSUFJb0FnZ2lBMFlFUUVHOEdrRzhHaWdDQUVGK0lBUjNjVFlDQUF3RkN5QURJQUUyQWd3Z0FTQUROZ0lJREFRTElBSW9BaGdoQmlBQ0lBSW9BZ3dpQVVjRVFDQUNLQUlJSWdNZ0FUWUNEQ0FCSUFNMkFnZ01Bd3NnQWtFVWFpSUVLQUlBSWdORkJFQWdBaWdDRUNJRFJRMENJQUpCRUdvaEJBc0RRQ0FFSVFjZ0F5SUJRUlJxSWdRb0FnQWlBdzBBSUFGQkVHb2hCQ0FCS0FJUUlnTU5BQXNnQjBFQU5nSUFEQUlMSUFVb0FnUWlBVUVEY1VFRFJ3MENRY1FhSUFBMkFnQWdCU0FCUVg1eE5nSUVJQUlnQUVFQmNqWUNCQ0FGSUFBMkFnQVBDMEVBSVFFTElBWkZEUUFDUUNBQ0tBSWNJZ05CQW5SQjdCeHFJZ1FvQWdBZ0FrWUVRQ0FFSUFFMkFnQWdBUTBCUWNBYVFjQWFLQUlBUVg0Z0EzZHhOZ0lBREFJTElBWkJFRUVVSUFZb0FoQWdBa1liYWlBQk5nSUFJQUZGRFFFTElBRWdCallDR0NBQ0tBSVFJZ01FUUNBQklBTTJBaEFnQXlBQk5nSVlDeUFDS0FJVUlnTkZEUUFnQVNBRE5nSVVJQU1nQVRZQ0dBc2dBaUFGVHcwQUlBVW9BZ1FpQVVFQmNVVU5BQUpBQWtBQ1FBSkFJQUZCQW5GRkJFQkIxQm9vQWdBZ0JVWUVRRUhVR2lBQ05nSUFRY2dhUWNnYUtBSUFJQUJxSWdBMkFnQWdBaUFBUVFGeU5nSUVJQUpCMEJvb0FnQkhEUVpCeEJwQkFEWUNBRUhRR2tFQU5nSUFEd3RCMEJvb0FnQWdCVVlFUUVIUUdpQUNOZ0lBUWNRYVFjUWFLQUlBSUFCcUlnQTJBZ0FnQWlBQVFRRnlOZ0lFSUFBZ0Ftb2dBRFlDQUE4TElBRkJlSEVnQUdvaEFDQUJRZjhCVFFSQUlBRkJBM1loQkNBRktBSU1JZ0VnQlNnQ0NDSURSZ1JBUWJ3YVFid2FLQUlBUVg0Z0JIZHhOZ0lBREFVTElBTWdBVFlDRENBQklBTTJBZ2dNQkFzZ0JTZ0NHQ0VHSUFVZ0JTZ0NEQ0lCUndSQVFjd2FLQUlBR2lBRktBSUlJZ01nQVRZQ0RDQUJJQU0yQWdnTUF3c2dCVUVVYWlJRUtBSUFJZ05GQkVBZ0JTZ0NFQ0lEUlEwQ0lBVkJFR29oQkFzRFFDQUVJUWNnQXlJQlFSUnFJZ1FvQWdBaUF3MEFJQUZCRUdvaEJDQUJLQUlRSWdNTkFBc2dCMEVBTmdJQURBSUxJQVVnQVVGK2NUWUNCQ0FDSUFCQkFYSTJBZ1FnQUNBQ2FpQUFOZ0lBREFNTFFRQWhBUXNnQmtVTkFBSkFJQVVvQWh3aUEwRUNkRUhzSEdvaUJDZ0NBQ0FGUmdSQUlBUWdBVFlDQUNBQkRRRkJ3QnBCd0Jvb0FnQkJmaUFEZDNFMkFnQU1BZ3NnQmtFUVFSUWdCaWdDRUNBRlJodHFJQUUyQWdBZ0FVVU5BUXNnQVNBR05nSVlJQVVvQWhBaUF3UkFJQUVnQXpZQ0VDQURJQUUyQWhnTElBVW9BaFFpQTBVTkFDQUJJQU0yQWhRZ0F5QUJOZ0lZQ3lBQ0lBQkJBWEkyQWdRZ0FDQUNhaUFBTmdJQUlBSkIwQm9vQWdCSERRQkJ4Qm9nQURZQ0FBOExJQUJCL3dGTkJFQWdBRUY0Y1VIa0dtb2hBUUovUWJ3YUtBSUFJZ05CQVNBQVFRTjJkQ0lBY1VVRVFFRzhHaUFBSUFOeU5nSUFJQUVNQVFzZ0FTZ0NDQXNoQUNBQklBSTJBZ2dnQUNBQ05nSU1JQUlnQVRZQ0RDQUNJQUEyQWdnUEMwRWZJUU1nQUVILy8vOEhUUVJBSUFCQkppQUFRUWgyWnlJQmEzWkJBWEVnQVVFQmRHdEJQbW9oQXdzZ0FpQUROZ0ljSUFKQ0FEY0NFQ0FEUVFKMFFld2NhaUVCQWtBQ1FBSkFRY0FhS0FJQUlnUkJBU0FEZENJSGNVVUVRRUhBR2lBRUlBZHlOZ0lBSUFFZ0FqWUNBQ0FDSUFFMkFoZ01BUXNnQUVFWklBTkJBWFpyUVFBZ0EwRWZSeHQwSVFNZ0FTZ0NBQ0VCQTBBZ0FTSUVLQUlFUVhoeElBQkdEUUlnQTBFZGRpRUJJQU5CQVhRaEF5QUVJQUZCQkhGcUlnZEJFR29vQWdBaUFRMEFDeUFISUFJMkFoQWdBaUFFTmdJWUN5QUNJQUkyQWd3Z0FpQUNOZ0lJREFFTElBUW9BZ2dpQUNBQ05nSU1JQVFnQWpZQ0NDQUNRUUEyQWhnZ0FpQUVOZ0lNSUFJZ0FEWUNDQXRCM0JwQjNCb29BZ0JCQVdzaUFFRi9JQUFiTmdJQUN3c3BBUUYvSUFFRVFDQUFJUUlEUUNBQ1FRQTZBQUFnQWtFQmFpRUNJQUZCQVdzaUFRMEFDd3NnQUFzY0FDQUFJQUZCQ0NBQ3B5QUNRaUNJcHlBRHB5QURRaUNJcHhBRkM5NERBRUhjRjBHS0NSQUpRZWdYUWJrSVFRRkJBQkFJUWZRWFFiUUlRUUZCZ0g5Qi93QVFBVUdNR0VHdENFRUJRWUIvUWY4QUVBRkJnQmhCcXdoQkFVRUFRZjhCRUFGQm1CaEJpUWhCQWtHQWdINUIvLzhCRUFGQnBCaEJnQWhCQWtFQVFmLy9BeEFCUWJBWVFaZ0lRUVJCZ0lDQWdIaEIvLy8vL3djUUFVRzhHRUdQQ0VFRVFRQkJmeEFCUWNnWVFjY0lRUVJCZ0lDQWdIaEIvLy8vL3djUUFVSFVHRUcrQ0VFRVFRQkJmeEFCUWVBWVFhTUlRb0NBZ0lDQWdJQ0FnSDlDLy8vLy8vLy8vLy8vQUJBUlFld1lRYUlJUWdCQ2Z4QVJRZmdZUVp3SVFRUVFCRUdFR1VHRENVRUlFQVJCOUE1QjJRZ1FBMEc4RDBHSERSQURRWVFRUVFSQnpBZ1FBa0hRRUVFQ1FlVUlFQUpCbkJGQkJFSDBDQkFDUWJnUkVBZEI0QkZCQUVIQ0RCQUFRWWdTUVFCQnFBMFFBRUd3RWtFQlFlQU1FQUJCMkJKQkFrR1BDUkFBUVlBVFFRTkJyZ2tRQUVHb0UwRUVRZFlKRUFCQjBCTkJCVUh6Q1JBQVFmZ1RRUVJCelEwUUFFR2dGRUVGUWVzTkVBQkJpQkpCQUVIWkNoQUFRYkFTUVFGQnVBb1FBRUhZRWtFQ1Fac0xFQUJCZ0JOQkEwSDVDaEFBUWFnVFFRUkJvUXdRQUVIUUUwRUZRZjhMRUFCQnlCUkJDRUhlQ3hBQVFmQVVRUWxCdkFzUUFFR1lGVUVHUVprS0VBQkJ3QlZCQjBHU0RoQUFDeUFBQWtBZ0FDZ0NCQ0FCUncwQUlBQW9BaHhCQVVZTkFDQUFJQUkyQWh3TEM1b0JBQ0FBUVFFNkFEVUNRQ0FBS0FJRUlBSkhEUUFnQUVFQk9nQTBBa0FnQUNnQ0VDSUNSUVJBSUFCQkFUWUNKQ0FBSUFNMkFoZ2dBQ0FCTmdJUUlBTkJBVWNOQWlBQUtBSXdRUUZHRFFFTUFnc2dBU0FDUmdSQUlBQW9BaGdpQWtFQ1JnUkFJQUFnQXpZQ0dDQURJUUlMSUFBb0FqQkJBVWNOQWlBQ1FRRkdEUUVNQWdzZ0FDQUFLQUlrUVFGcU5nSWtDeUFBUVFFNkFEWUxDMTBCQVg4Z0FDZ0NFQ0lEUlFSQUlBQkJBVFlDSkNBQUlBSTJBaGdnQUNBQk5nSVFEd3NDUUNBQklBTkdCRUFnQUNnQ0dFRUNSdzBCSUFBZ0FqWUNHQThMSUFCQkFUb0FOaUFBUVFJMkFoZ2dBQ0FBS0FJa1FRRnFOZ0lrQ3dzRUFDQUFDOFluQVF4L0l3QkJFR3NpQ2lRQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUlBQkI5QUZOQkVCQnZCb29BZ0FpQmtFUUlBQkJDMnBCK0FOeElBQkJDMGtiSWdWQkEzWWlBSFlpQVVFRGNRUkFBa0FnQVVGL2MwRUJjU0FBYWlJQ1FRTjBJZ0ZCNUJwcUlnQWdBVUhzR21vb0FnQWlBU2dDQ0NJRFJnUkFRYndhSUFaQmZpQUNkM0UyQWdBTUFRc2dBeUFBTmdJTUlBQWdBellDQ0FzZ0FVRUlhaUVBSUFFZ0FrRURkQ0lDUVFOeU5nSUVJQUVnQW1vaUFTQUJLQUlFUVFGeU5nSUVEQW9MSUFWQnhCb29BZ0FpQjAwTkFTQUJCRUFDUUVFQ0lBQjBJZ0pCQUNBQ2EzSWdBU0FBZEhGb0lnRkJBM1FpQUVIa0dtb2lBaUFBUWV3YWFpZ0NBQ0lBS0FJSUlnTkdCRUJCdkJvZ0JrRitJQUYzY1NJR05nSUFEQUVMSUFNZ0FqWUNEQ0FDSUFNMkFnZ0xJQUFnQlVFRGNqWUNCQ0FBSUFWcUlnUWdBVUVEZENJQklBVnJJZ05CQVhJMkFnUWdBQ0FCYWlBRE5nSUFJQWNFUUNBSFFYaHhRZVFhYWlFQlFkQWFLQUlBSVFJQ2Z5QUdRUUVnQjBFRGRuUWlCWEZGQkVCQnZCb2dCU0FHY2pZQ0FDQUJEQUVMSUFFb0FnZ0xJUVVnQVNBQ05nSUlJQVVnQWpZQ0RDQUNJQUUyQWd3Z0FpQUZOZ0lJQ3lBQVFRaHFJUUJCMEJvZ0JEWUNBRUhFR2lBRE5nSUFEQW9MUWNBYUtBSUFJZ3RGRFFFZ0MyaEJBblJCN0J4cUtBSUFJZ0lvQWdSQmVIRWdCV3NoQkNBQ0lRRURRQUpBSUFFb0FoQWlBRVVFUUNBQktBSVVJZ0JGRFFFTElBQW9BZ1JCZUhFZ0JXc2lBU0FFSUFFZ0JFa2lBUnNoQkNBQUlBSWdBUnNoQWlBQUlRRU1BUXNMSUFJb0FoZ2hDU0FDSUFJb0Fnd2lBMGNFUUVITUdpZ0NBQm9nQWlnQ0NDSUFJQU0yQWd3Z0F5QUFOZ0lJREFrTElBSkJGR29pQVNnQ0FDSUFSUVJBSUFJb0FoQWlBRVVOQXlBQ1FSQnFJUUVMQTBBZ0FTRUlJQUFpQTBFVWFpSUJLQUlBSWdBTkFDQURRUkJxSVFFZ0F5Z0NFQ0lBRFFBTElBaEJBRFlDQUF3SUMwRi9JUVVnQUVHL2Ywc05BQ0FBUVF0cUlnQkJlSEVoQlVIQUdpZ0NBQ0lJUlEwQVFRQWdCV3NoQkFKQUFrQUNRQUovUVFBZ0JVR0FBa2tOQUJwQkh5QUZRZi8vL3dkTERRQWFJQVZCSmlBQVFRaDJaeUlBYTNaQkFYRWdBRUVCZEd0QlBtb0xJZ2RCQW5SQjdCeHFLQUlBSWdGRkJFQkJBQ0VBREFFTFFRQWhBQ0FGUVJrZ0IwRUJkbXRCQUNBSFFSOUhHM1FoQWdOQUFrQWdBU2dDQkVGNGNTQUZheUlHSUFSUERRQWdBU0VESUFZaUJBMEFRUUFoQkNBQklRQU1Bd3NnQUNBQktBSVVJZ1lnQmlBQklBSkJIWFpCQkhGcUtBSVFJZ0ZHR3lBQUlBWWJJUUFnQWtFQmRDRUNJQUVOQUFzTElBQWdBM0pGQkVCQkFDRURRUUlnQjNRaUFFRUFJQUJyY2lBSWNTSUFSUTBESUFCb1FRSjBRZXdjYWlnQ0FDRUFDeUFBUlEwQkN3TkFJQUFvQWdSQmVIRWdCV3NpQWlBRVNTRUJJQUlnQkNBQkd5RUVJQUFnQXlBQkd5RURJQUFvQWhBaUFRUi9JQUVGSUFBb0FoUUxJZ0FOQUFzTElBTkZEUUFnQkVIRUdpZ0NBQ0FGYTA4TkFDQURLQUlZSVFjZ0F5QURLQUlNSWdKSEJFQkJ6Qm9vQWdBYUlBTW9BZ2dpQUNBQ05nSU1JQUlnQURZQ0NBd0hDeUFEUVJScUlnRW9BZ0FpQUVVRVFDQURLQUlRSWdCRkRRTWdBMEVRYWlFQkN3TkFJQUVoQmlBQUlnSkJGR29pQVNnQ0FDSUFEUUFnQWtFUWFpRUJJQUlvQWhBaUFBMEFDeUFHUVFBMkFnQU1CZ3NnQlVIRUdpZ0NBQ0lEVFFSQVFkQWFLQUlBSVFBQ1FDQURJQVZySWdGQkVFOEVRQ0FBSUFWcUlnSWdBVUVCY2pZQ0JDQUFJQU5xSUFFMkFnQWdBQ0FGUVFOeU5nSUVEQUVMSUFBZ0EwRURjallDQkNBQUlBTnFJZ0VnQVNnQ0JFRUJjallDQkVFQUlRSkJBQ0VCQzBIRUdpQUJOZ0lBUWRBYUlBSTJBZ0FnQUVFSWFpRUFEQWdMSUFWQnlCb29BZ0FpQWtrRVFFSElHaUFDSUFWcklnRTJBZ0JCMUJwQjFCb29BZ0FpQUNBRmFpSUNOZ0lBSUFJZ0FVRUJjallDQkNBQUlBVkJBM0kyQWdRZ0FFRUlhaUVBREFnTFFRQWhBQ0FGUVM5cUlnUUNmMEdVSGlnQ0FBUkFRWndlS0FJQURBRUxRYUFlUW44M0FnQkJtQjVDZ0tDQWdJQ0FCRGNDQUVHVUhpQUtRUXhxUVhCeFFkaXExYW9GY3pZQ0FFR29Ia0VBTmdJQVFmZ2RRUUEyQWdCQmdDQUxJZ0ZxSWdaQkFDQUJheUlJY1NJQklBVk5EUWRCOUIwb0FnQWlBd1JBUWV3ZEtBSUFJZ2NnQVdvaUNTQUhUU0FESUFsSmNnMElDd0pBUWZnZExRQUFRUVJ4UlFSQUFrQUNRQUpBQWtCQjFCb29BZ0FpQXdSQVFmd2RJUUFEUUNBRElBQW9BZ0FpQjA4RVFDQUhJQUFvQWdScUlBTkxEUU1MSUFBb0FnZ2lBQTBBQ3d0QkFCQUxJZ0pCZjBZTkF5QUJJUVpCbUI0b0FnQWlBRUVCYXlJRElBSnhCRUFnQVNBQ2F5QUNJQU5xUVFBZ0FHdHhhaUVHQ3lBRklBWlBEUU5COUIwb0FnQWlBQVJBUWV3ZEtBSUFJZ01nQm1vaUNDQURUU0FBSUFoSmNnMEVDeUFHRUFzaUFDQUNSdzBCREFVTElBWWdBbXNnQ0hFaUJoQUxJZ0lnQUNnQ0FDQUFLQUlFYWtZTkFTQUNJUUFMSUFCQmYwWU5BU0FGUVRCcUlBWk5CRUFnQUNFQ0RBUUxRWndlS0FJQUlnSWdCQ0FHYTJwQkFDQUNhM0VpQWhBTFFYOUdEUUVnQWlBR2FpRUdJQUFoQWd3REN5QUNRWDlIRFFJTFFmZ2RRZmdkS0FJQVFRUnlOZ0lBQ3lBQkVBc2lBa0YvUmtFQUVBc2lBRUYvUm5JZ0FDQUNUWElOQlNBQUlBSnJJZ1lnQlVFb2FrME5CUXRCN0IxQjdCMG9BZ0FnQm1vaUFEWUNBRUh3SFNnQ0FDQUFTUVJBUWZBZElBQTJBZ0FMQWtCQjFCb29BZ0FpQkFSQVFmd2RJUUFEUUNBQ0lBQW9BZ0FpQVNBQUtBSUVJZ05xUmcwQ0lBQW9BZ2dpQUEwQUN3d0VDMEhNR2lnQ0FDSUFRUUFnQUNBQ1RSdEZCRUJCekJvZ0FqWUNBQXRCQUNFQVFZQWVJQVkyQWdCQi9CMGdBallDQUVIY0drRi9OZ0lBUWVBYVFaUWVLQUlBTmdJQVFZZ2VRUUEyQWdBRFFDQUFRUU4wSWdGQjdCcHFJQUZCNUJwcUlnTTJBZ0FnQVVId0dtb2dBellDQUNBQVFRRnFJZ0JCSUVjTkFBdEJ5Qm9nQmtFb2F5SUFRWGdnQW10QkIzRWlBV3NpQXpZQ0FFSFVHaUFCSUFKcUlnRTJBZ0FnQVNBRFFRRnlOZ0lFSUFBZ0FtcEJLRFlDQkVIWUdrR2tIaWdDQURZQ0FBd0VDeUFDSUFSTklBRWdCRXR5RFFJZ0FDZ0NERUVJY1EwQ0lBQWdBeUFHYWpZQ0JFSFVHaUFFUVhnZ0JHdEJCM0VpQUdvaUFUWUNBRUhJR2tISUdpZ0NBQ0FHYWlJQ0lBQnJJZ0EyQWdBZ0FTQUFRUUZ5TmdJRUlBSWdCR3BCS0RZQ0JFSFlHa0drSGlnQ0FEWUNBQXdEQzBFQUlRTU1CUXRCQUNFQ0RBTUxRY3dhS0FJQUlBSkxCRUJCekJvZ0FqWUNBQXNnQWlBR2FpRUJRZndkSVFBQ1FBSkFBa0FEUUNBQklBQW9BZ0JIQkVBZ0FDZ0NDQ0lBRFFFTUFnc0xJQUF0QUF4QkNIRkZEUUVMUWZ3ZElRQURRQUpBSUFRZ0FDZ0NBQ0lCVHdSQUlBRWdBQ2dDQkdvaUF5QUVTdzBCQ3lBQUtBSUlJUUFNQVFzTFFjZ2FJQVpCS0dzaUFFRjRJQUpyUVFkeElnRnJJZ2cyQWdCQjFCb2dBU0FDYWlJQk5nSUFJQUVnQ0VFQmNqWUNCQ0FBSUFKcVFTZzJBZ1JCMkJwQnBCNG9BZ0EyQWdBZ0JDQURRU2NnQTJ0QkIzRnFRUzlySWdBZ0FDQUVRUkJxU1JzaUFVRWJOZ0lFSUFGQmhCNHBBZ0EzQWhBZ0FVSDhIU2tDQURjQ0NFR0VIaUFCUVFocU5nSUFRWUFlSUFZMkFnQkIvQjBnQWpZQ0FFR0lIa0VBTmdJQUlBRkJHR29oQUFOQUlBQkJCellDQkNBQVFRaHFJUXdnQUVFRWFpRUFJQXdnQTBrTkFBc2dBU0FFUmcwQ0lBRWdBU2dDQkVGK2NUWUNCQ0FFSUFFZ0JHc2lBa0VCY2pZQ0JDQUJJQUkyQWdBZ0FrSC9BVTBFUUNBQ1FYaHhRZVFhYWlFQUFuOUJ2Qm9vQWdBaUFVRUJJQUpCQTNaMElnSnhSUVJBUWJ3YUlBRWdBbkkyQWdBZ0FBd0JDeUFBS0FJSUN5RUJJQUFnQkRZQ0NDQUJJQVEyQWd3Z0JDQUFOZ0lNSUFRZ0FUWUNDQXdEQzBFZklRQWdBa0gvLy84SFRRUkFJQUpCSmlBQ1FRaDJaeUlBYTNaQkFYRWdBRUVCZEd0QlBtb2hBQXNnQkNBQU5nSWNJQVJDQURjQ0VDQUFRUUowUWV3Y2FpRUJBa0JCd0Jvb0FnQWlBMEVCSUFCMElnWnhSUVJBUWNBYUlBTWdCbkkyQWdBZ0FTQUVOZ0lBREFFTElBSkJHU0FBUVFGMmEwRUFJQUJCSDBjYmRDRUFJQUVvQWdBaEF3TkFJQU1pQVNnQ0JFRjRjU0FDUmcwRElBQkJIWFloQXlBQVFRRjBJUUFnQVNBRFFRUnhhaUlHS0FJUUlnTU5BQXNnQmlBRU5nSVFDeUFFSUFFMkFoZ2dCQ0FFTmdJTUlBUWdCRFlDQ0F3Q0N5QUFJQUkyQWdBZ0FDQUFLQUlFSUFacU5nSUVJQUpCZUNBQ2EwRUhjV29pQnlBRlFRTnlOZ0lFSUFGQmVDQUJhMEVIY1dvaUJDQUZJQWRxSWdWcklRWUNRRUhVR2lnQ0FDQUVSZ1JBUWRRYUlBVTJBZ0JCeUJwQnlCb29BZ0FnQm1vaUFEWUNBQ0FGSUFCQkFYSTJBZ1FNQVF0QjBCb29BZ0FnQkVZRVFFSFFHaUFGTmdJQVFjUWFRY1FhS0FJQUlBWnFJZ0EyQWdBZ0JTQUFRUUZ5TmdJRUlBQWdCV29nQURZQ0FBd0JDeUFFS0FJRUlnSkJBM0ZCQVVZRVFDQUNRWGh4SVFrQ1FDQUNRZjhCVFFSQUlBUW9BZ3dpQUNBRUtBSUlJZ0ZHQkVCQnZCcEJ2Qm9vQWdCQmZpQUNRUU4yZDNFMkFnQU1BZ3NnQVNBQU5nSU1JQUFnQVRZQ0NBd0JDeUFFS0FJWUlRZ0NRQ0FFSUFRb0Fnd2lBRWNFUUVITUdpZ0NBQm9nQkNnQ0NDSUJJQUEyQWd3Z0FDQUJOZ0lJREFFTEFrQWdCRUVVYWlJQktBSUFJZ0pGQkVBZ0JDZ0NFQ0lDUlEwQklBUkJFR29oQVFzRFFDQUJJUU1nQWlJQVFSUnFJZ0VvQWdBaUFnMEFJQUJCRUdvaEFTQUFLQUlRSWdJTkFBc2dBMEVBTmdJQURBRUxRUUFoQUFzZ0NFVU5BQUpBSUFRb0Fod2lBVUVDZEVIc0hHb2lBaWdDQUNBRVJnUkFJQUlnQURZQ0FDQUFEUUZCd0JwQndCb29BZ0JCZmlBQmQzRTJBZ0FNQWdzZ0NFRVFRUlFnQ0NnQ0VDQUVSaHRxSUFBMkFnQWdBRVVOQVFzZ0FDQUlOZ0lZSUFRb0FoQWlBUVJBSUFBZ0FUWUNFQ0FCSUFBMkFoZ0xJQVFvQWhRaUFVVU5BQ0FBSUFFMkFoUWdBU0FBTmdJWUN5QUdJQWxxSVFZZ0JDQUphaUlFS0FJRUlRSUxJQVFnQWtGK2NUWUNCQ0FGSUFaQkFYSTJBZ1FnQlNBR2FpQUdOZ0lBSUFaQi93Rk5CRUFnQmtGNGNVSGtHbW9oQUFKL1Fid2FLQUlBSWdGQkFTQUdRUU4yZENJQ2NVVUVRRUc4R2lBQklBSnlOZ0lBSUFBTUFRc2dBQ2dDQ0FzaEFTQUFJQVUyQWdnZ0FTQUZOZ0lNSUFVZ0FEWUNEQ0FGSUFFMkFnZ01BUXRCSHlFQ0lBWkIvLy8vQjAwRVFDQUdRU1lnQmtFSWRtY2lBR3QyUVFGeElBQkJBWFJyUVQ1cUlRSUxJQVVnQWpZQ0hDQUZRZ0EzQWhBZ0FrRUNkRUhzSEdvaEFRSkFBa0JCd0Jvb0FnQWlBRUVCSUFKMElnTnhSUVJBUWNBYUlBQWdBM0kyQWdBZ0FTQUZOZ0lBREFFTElBWkJHU0FDUVFGMmEwRUFJQUpCSDBjYmRDRUNJQUVvQWdBaEFBTkFJQUFpQVNnQ0JFRjRjU0FHUmcwQ0lBSkJIWFloQUNBQ1FRRjBJUUlnQVNBQVFRUnhhaUlES0FJUUlnQU5BQXNnQXlBRk5nSVFDeUFGSUFFMkFoZ2dCU0FGTmdJTUlBVWdCVFlDQ0F3QkN5QUJLQUlJSWdBZ0JUWUNEQ0FCSUFVMkFnZ2dCVUVBTmdJWUlBVWdBVFlDRENBRklBQTJBZ2dMSUFkQkNHb2hBQXdGQ3lBQktBSUlJZ0FnQkRZQ0RDQUJJQVEyQWdnZ0JFRUFOZ0lZSUFRZ0FUWUNEQ0FFSUFBMkFnZ0xRY2dhS0FJQUlnQWdCVTBOQUVISUdpQUFJQVZySWdFMkFnQkIxQnBCMUJvb0FnQWlBQ0FGYWlJQ05nSUFJQUlnQVVFQmNqWUNCQ0FBSUFWQkEzSTJBZ1FnQUVFSWFpRUFEQU1MUWJnYVFUQTJBZ0JCQUNFQURBSUxBa0FnQjBVTkFBSkFJQU1vQWh3aUFFRUNkRUhzSEdvaUFTZ0NBQ0FEUmdSQUlBRWdBallDQUNBQ0RRRkJ3Qm9nQ0VGK0lBQjNjU0lJTmdJQURBSUxJQWRCRUVFVUlBY29BaEFnQTBZYmFpQUNOZ0lBSUFKRkRRRUxJQUlnQnpZQ0dDQURLQUlRSWdBRVFDQUNJQUEyQWhBZ0FDQUNOZ0lZQ3lBREtBSVVJZ0JGRFFBZ0FpQUFOZ0lVSUFBZ0FqWUNHQXNDUUNBRVFROU5CRUFnQXlBRUlBVnFJZ0JCQTNJMkFnUWdBQ0FEYWlJQUlBQW9BZ1JCQVhJMkFnUU1BUXNnQXlBRlFRTnlOZ0lFSUFNZ0JXb2lBaUFFUVFGeU5nSUVJQUlnQkdvZ0JEWUNBQ0FFUWY4QlRRUkFJQVJCZUhGQjVCcHFJUUFDZjBHOEdpZ0NBQ0lCUVFFZ0JFRURkblFpQlhGRkJFQkJ2Qm9nQVNBRmNqWUNBQ0FBREFFTElBQW9BZ2dMSVFFZ0FDQUNOZ0lJSUFFZ0FqWUNEQ0FDSUFBMkFnd2dBaUFCTmdJSURBRUxRUjhoQUNBRVFmLy8vd2ROQkVBZ0JFRW1JQVJCQ0habklnQnJka0VCY1NBQVFRRjBhMEUrYWlFQUN5QUNJQUEyQWh3Z0FrSUFOd0lRSUFCQkFuUkI3QnhxSVFFQ1FBSkFJQWhCQVNBQWRDSUZjVVVFUUVIQUdpQUZJQWh5TmdJQUlBRWdBallDQUF3QkN5QUVRUmtnQUVFQmRtdEJBQ0FBUVI5SEczUWhBQ0FCS0FJQUlRVURRQ0FGSWdFb0FnUkJlSEVnQkVZTkFpQUFRUjEySVFVZ0FFRUJkQ0VBSUFFZ0JVRUVjV29pQmlnQ0VDSUZEUUFMSUFZZ0FqWUNFQXNnQWlBQk5nSVlJQUlnQWpZQ0RDQUNJQUkyQWdnTUFRc2dBU2dDQ0NJQUlBSTJBZ3dnQVNBQ05nSUlJQUpCQURZQ0dDQUNJQUUyQWd3Z0FpQUFOZ0lJQ3lBRFFRaHFJUUFNQVFzQ1FDQUpSUTBBQWtBZ0FpZ0NIQ0lBUVFKMFFld2NhaUlCS0FJQUlBSkdCRUFnQVNBRE5nSUFJQU1OQVVIQUdpQUxRWDRnQUhkeE5nSUFEQUlMSUFsQkVFRVVJQWtvQWhBZ0FrWWJhaUFETmdJQUlBTkZEUUVMSUFNZ0NUWUNHQ0FDS0FJUUlnQUVRQ0FESUFBMkFoQWdBQ0FETmdJWUN5QUNLQUlVSWdCRkRRQWdBeUFBTmdJVUlBQWdBellDR0FzQ1FDQUVRUTlOQkVBZ0FpQUVJQVZxSWdCQkEzSTJBZ1FnQUNBQ2FpSUFJQUFvQWdSQkFYSTJBZ1FNQVFzZ0FpQUZRUU55TmdJRUlBSWdCV29pQXlBRVFRRnlOZ0lFSUFNZ0JHb2dCRFlDQUNBSEJFQWdCMEY0Y1VIa0dtb2hBRUhRR2lnQ0FDRUJBbjlCQVNBSFFRTjJkQ0lGSUFaeFJRUkFRYndhSUFVZ0JuSTJBZ0FnQUF3QkN5QUFLQUlJQ3lFRklBQWdBVFlDQ0NBRklBRTJBZ3dnQVNBQU5nSU1JQUVnQlRZQ0NBdEIwQm9nQXpZQ0FFSEVHaUFFTmdJQUN5QUNRUWhxSVFBTElBcEJFR29rQUNBQUN4b0FJQUFnQVNnQ0NDQUZFQW9FUUNBQklBSWdBeUFFRUJRTEN6Y0FJQUFnQVNnQ0NDQUZFQW9FUUNBQklBSWdBeUFFRUJRUEN5QUFLQUlJSWdBZ0FTQUNJQU1nQkNBRklBQW9BZ0FvQWhRUkF3QUxrUUVBSUFBZ0FTZ0NDQ0FFRUFvRVFDQUJJQUlnQXhBVER3c0NRQ0FBSUFFb0FnQWdCQkFLUlEwQUFrQWdBaUFCS0FJUVJ3UkFJQUVvQWhRZ0FrY05BUXNnQTBFQlJ3MEJJQUZCQVRZQ0lBOExJQUVnQWpZQ0ZDQUJJQU0yQWlBZ0FTQUJLQUlvUVFGcU5nSW9Ba0FnQVNnQ0pFRUJSdzBBSUFFb0FoaEJBa2NOQUNBQlFRRTZBRFlMSUFGQkJEWUNMQXNMOGdFQUlBQWdBU2dDQ0NBRUVBb0VRQ0FCSUFJZ0F4QVREd3NDUUNBQUlBRW9BZ0FnQkJBS0JFQUNRQ0FDSUFFb0FoQkhCRUFnQVNnQ0ZDQUNSdzBCQ3lBRFFRRkhEUUlnQVVFQk5nSWdEd3NnQVNBRE5nSWdBa0FnQVNnQ0xFRUVSZzBBSUFGQkFEc0JOQ0FBS0FJSUlnQWdBU0FDSUFKQkFTQUVJQUFvQWdBb0FoUVJBd0FnQVMwQU5RUkFJQUZCQXpZQ0xDQUJMUUEwUlEwQkRBTUxJQUZCQkRZQ0xBc2dBU0FDTmdJVUlBRWdBU2dDS0VFQmFqWUNLQ0FCS0FJa1FRRkhEUUVnQVNnQ0dFRUNSdzBCSUFGQkFUb0FOZzhMSUFBb0FnZ2lBQ0FCSUFJZ0F5QUVJQUFvQWdBb0FoZ1JBZ0FMQ3pFQUlBQWdBU2dDQ0VFQUVBb0VRQ0FCSUFJZ0F4QVZEd3NnQUNnQ0NDSUFJQUVnQWlBRElBQW9BZ0FvQWh3UkFBQUxHQUFnQUNBQktBSUlRUUFRQ2dSQUlBRWdBaUFERUJVTEM0QURBUVIvSXdCQjhBQnJJZ0lrQUNBQUtBSUFJZ05CQkdzb0FnQWhCQ0FEUVFocktBSUFJUVVnQWtJQU53SlFJQUpDQURjQ1dDQUNRZ0EzQW1BZ0FrSUFOd0JuSUFKQ0FEY0NTQ0FDUVFBMkFrUWdBa0hzRlRZQ1FDQUNJQUEyQWp3Z0FpQUJOZ0k0SUFBZ0JXb2hBd0pBSUFRZ0FVRUFFQW9FUUVFQUlBTWdCUnNoQUF3QkN5QUFJQU5PQkVBZ0FrSUFOd0F2SUFKQ0FEY0NHQ0FDUWdBM0FpQWdBa0lBTndJb0lBSkNBRGNDRUNBQ1FRQTJBZ3dnQWlBQk5nSUlJQUlnQURZQ0JDQUNJQVEyQWdBZ0FrRUJOZ0l3SUFRZ0FpQURJQU5CQVVFQUlBUW9BZ0FvQWhRUkF3QWdBaWdDR0EwQkMwRUFJUUFnQkNBQ1FUaHFJQU5CQVVFQUlBUW9BZ0FvQWhnUkFnQUNRQUpBSUFJb0Fsd09BZ0FCQWdzZ0FpZ0NURUVBSUFJb0FsaEJBVVliUVFBZ0FpZ0NWRUVCUmh0QkFDQUNLQUpnUVFGR0d5RUFEQUVMSUFJb0FsQkJBVWNFUUNBQ0tBSmdEUUVnQWlnQ1ZFRUJSdzBCSUFJb0FsaEJBVWNOQVFzZ0FpZ0NTQ0VBQ3lBQ1FmQUFhaVFBSUFBTG1nRUJBbjhqQUVGQWFpSURKQUFDZjBFQklBQWdBVUVBRUFvTkFCcEJBQ0FCUlEwQUdrRUFJQUZCbkJZUUhpSUJSUTBBR2lBRFFReHFRVFFRRUJvZ0EwRUJOZ0k0SUFOQmZ6WUNGQ0FESUFBMkFoQWdBeUFCTmdJSUlBRWdBMEVJYWlBQ0tBSUFRUUVnQVNnQ0FDZ0NIQkVBQUNBREtBSWdJZ0JCQVVZRVFDQUNJQU1vQWhnMkFnQUxJQUJCQVVZTElRUWdBMEZBYXlRQUlBUUxDZ0FnQUNBQlFRQVFDZ3VBQ2dJSWZ5SjlRZi8vLy84SElRNUJnSUNBZ0hnaEQwRi9JUW9EUUNBRElBeEdCRUJCQUNFQUlBbEJnSUFRRUJBaEFVTUFBSUJISUE4Z0RtdXlsU0VkQTBBZ0FDQURSZ1JBUVFBaEFDQUlRUUEyQWdBZ0FVRUVheUVCUVFBaERFRUJJUXNEUUNBTFFZQ0FCRVpGQkVBZ0NDQUxRUUowSWdKcUlBRWdBbW9vQWdBZ0RHb2lERFlDQUNBTFFRRnFJUXNNQVFzTEEwQWdBQ0FEUmtVRVFDQUlJQVlnQUVFQ2RHb29BZ0JCQW5ScUlnRWdBU2dDQUNJQlFRRnFOZ0lBSUFjZ0FVRUNkR29nQURZQ0FDQUFRUUZxSVFBTUFRc0xCUUovSUIwZ0JpQUFRUUowYWlJQ0tBSUFJQTVyczVRaUVrTUFBSUJQWFNBU1F3QUFBQUJnY1FSQUlCS3BEQUVMUVFBTElRc2dBaUFMTmdJQUlBRWdDMEVDZEdvaUFpQUNLQUlBUVFGcU5nSUFJQUJCQVdvaEFBd0JDd3NGSUFRZ0RFRU1iR29pQ3lvQ0FDRVNJQXNxQWdnaEhTQUxLZ0lFSVNFZ0NpQUNJQXhCQW5RaURXb29BZ0FpQzBjRVFDQUJJQXRCMEFCc2FpSUtLZ0k4SWhRZ0FDb0NQQ0lWbENBS0tnSTRJaFlnQUNvQ0xDSVlsQ0FLS2dJd0loa2dBQ29DRENJYWxDQUFLZ0ljSWg0Z0Npb0NOQ0lUbEpLU2tpRXBJQlFnQUNvQ09DSWZsQ0FXSUFBcUFpZ2lJSlFnR1NBQUtnSUlJaUtVSUFBcUFoZ2lJeUFUbEpLU2tpRXFJQlFnQUNvQ05DSWtsQ0FXSUFBcUFpUWlKWlFnR1NBQUtnSUVJaWFVSUFBcUFoUWlKeUFUbEpLU2tpRXJJQlFnQUNvQ01DSVVsQ0FXSUFBcUFpQWlGcFFnR1NBQUtnSUFJaG1VSUFBcUFoQWlLQ0FUbEpLU2tpRXNJQW9xQWl3aUV5QVZsQ0FLS2dJb0loY2dHSlFnQ2lvQ0lDSWJJQnFVSUI0Z0Npb0NKQ0ljbEpLU2tpRXRJQk1nSDVRZ0Z5QWdsQ0FiSUNLVUlDTWdISlNTa3BJaExpQVRJQ1NVSUJjZ0paUWdHeUFtbENBbklCeVVrcEtTSVM4Z0V5QVVsQ0FYSUJhVUlCc2dHWlFnS0NBY2xKS1NraUV3SUFvcUFod2lFeUFWbENBS0tnSVlJaGNnR0pRZ0Npb0NFQ0liSUJxVUlCNGdDaW9DRkNJY2xKS1NraUV4SUJNZ0g1UWdGeUFnbENBYklDS1VJQ01nSEpTU2twSWhNaUFUSUNTVUlCY2dKWlFnR3lBbWxDQW5JQnlVa3BLU0lUTWdFeUFVbENBWElCYVVJQnNnR1pRZ0tDQWNsSktTa2lFWElBb3FBZ3dpRXlBVmxDQUtLZ0lJSWhVZ0dKUWdDaW9DQUNJWUlCcVVJQW9xQWdRaUdpQWVsSktTa2lFZUlCTWdINVFnRlNBZ2xDQVlJQ0tVSUJvZ0k1U1NrcEloSHlBVElDU1VJQlVnSlpRZ0dDQW1sQ0FhSUNlVWtwS1NJU0FnRXlBVWxDQVZJQmFVSUJnZ0daUWdHaUFvbEpLU2tpRVdJQXNoQ2dzZ0JpQU5hZ0ovSUM0Z0haUWdIeUFTbENBaElES1VrcElnS3BKREFBQ0FSWlFpRkl0REFBQUFUMTBFUUNBVXFBd0JDMEdBZ0lDQWVBc2lDellDQUNBTElBNUtJUkFnQ3lBUFNDRVJRZjhCSVEwQ1FDQXRJQjJVSUI0Z0VwUWdJU0F4bEpLU0lDbVNJaFJEQUFBQUFGc05BQ0F3SUIyVUlCWWdFcFFnSVNBWGxKS1NJQ3lTSUJTVlF3QUFnRCtTUXdBQUFEK1VJaFZEQUFBQUFHQkZJQlZEQUFDQVAxMUZjZzBBSUM4Z0haUWdJQ0FTbENBaElET1VrcElnSzVJZ0ZKVkRBQUNBUDVKREFBQUFQNVFpRWtNQUFBQUFZRVVnRWtNQUFJQS9YVVZ5RFFBQ2Z5QVNRd0FBY0VHVUloSkRBQUNBVDEwZ0VrTUFBQUFBWUhFRVFDQVNxUXdCQzBFQUMwRVBiQ0VOQW44Z0ZVTUFBSEJCbENJU1F3QUFnRTlkSUJKREFBQUFBR0J4QkVBZ0Vxa01BUXRCQUFzZ0RXb2hEUXNnRGlBTElCQWJJUTRnRHlBTElCRWJJUThnQlNBTWFpQU5PZ0FBSUF4QkFXb2hEQXdCQ3dzTEM3Y1NBZ0JCZ0FnTHBoSjFibk5wWjI1bFpDQnphRzl5ZEFCMWJuTnBaMjVsWkNCcGJuUUFabXh2WVhRQWRXbHVkRFkwWDNRQWRXNXphV2R1WldRZ1kyaGhjZ0JpYjI5c0FIVnVjMmxuYm1Wa0lHeHZibWNBYzNSa09qcDNjM1J5YVc1bkFITjBaRG82YzNSeWFXNW5BSE4wWkRvNmRURTJjM1J5YVc1bkFITjBaRG82ZFRNeWMzUnlhVzVuQUdSdmRXSnNaUUIyYjJsa0FHVnRjMk55YVhCMFpXNDZPbTFsYlc5eWVWOTJhV1YzUEhOb2IzSjBQZ0JsYlhOamNtbHdkR1Z1T2pwdFpXMXZjbmxmZG1sbGR6eDFibk5wWjI1bFpDQnphRzl5ZEQ0QVpXMXpZM0pwY0hSbGJqbzZiV1Z0YjNKNVgzWnBaWGM4YVc1MFBnQmxiWE5qY21sd2RHVnVPanB0WlcxdmNubGZkbWxsZHp4MWJuTnBaMjVsWkNCcGJuUStBR1Z0YzJOeWFYQjBaVzQ2T20xbGJXOXllVjkyYVdWM1BHWnNiMkYwUGdCbGJYTmpjbWx3ZEdWdU9qcHRaVzF2Y25sZmRtbGxkengxYVc1ME9GOTBQZ0JsYlhOamNtbHdkR1Z1T2pwdFpXMXZjbmxmZG1sbGR6eHBiblE0WDNRK0FHVnRjMk55YVhCMFpXNDZPbTFsYlc5eWVWOTJhV1YzUEhWcGJuUXhObDkwUGdCbGJYTmpjbWx3ZEdWdU9qcHRaVzF2Y25sZmRtbGxkenhwYm5ReE5sOTBQZ0JsYlhOamNtbHdkR1Z1T2pwdFpXMXZjbmxmZG1sbGR6eDFhVzUwTmpSZmRENEFaVzF6WTNKcGNIUmxiam82YldWdGIzSjVYM1pwWlhjOGFXNTBOalJmZEQ0QVpXMXpZM0pwY0hSbGJqbzZiV1Z0YjNKNVgzWnBaWGM4ZFdsdWRETXlYM1ErQUdWdGMyTnlhWEIwWlc0Nk9tMWxiVzl5ZVY5MmFXVjNQR2x1ZERNeVgzUStBR1Z0YzJOeWFYQjBaVzQ2T20xbGJXOXllVjkyYVdWM1BHTm9ZWEkrQUdWdGMyTnlhWEIwWlc0Nk9tMWxiVzl5ZVY5MmFXVjNQSFZ1YzJsbmJtVmtJR05vWVhJK0FITjBaRG82WW1GemFXTmZjM1J5YVc1blBIVnVjMmxuYm1Wa0lHTm9ZWEkrQUdWdGMyTnlhWEIwWlc0Nk9tMWxiVzl5ZVY5MmFXVjNQSE5wWjI1bFpDQmphR0Z5UGdCbGJYTmpjbWx3ZEdWdU9qcHRaVzF2Y25sZmRtbGxkenhzYjI1blBnQmxiWE5qY21sd2RHVnVPanB0WlcxdmNubGZkbWxsZHp4MWJuTnBaMjVsWkNCc2IyNW5QZ0JsYlhOamNtbHdkR1Z1T2pwdFpXMXZjbmxmZG1sbGR6eGtiM1ZpYkdVK0FFNVRkRE5mWHpJeE1tSmhjMmxqWDNOMGNtbHVaMGxqVGxOZk1URmphR0Z5WDNSeVlXbDBjMGxqUlVWT1UxODVZV3hzYjJOaGRHOXlTV05GUlVWRkFBQUFBSlFNQUFBeUJ3QUFUbE4wTTE5Zk1qRXlZbUZ6YVdOZmMzUnlhVzVuU1doT1UxOHhNV05vWVhKZmRISmhhWFJ6U1doRlJVNVRYemxoYkd4dlkyRjBiM0pKYUVWRlJVVUFBSlFNQUFCOEJ3QUFUbE4wTTE5Zk1qRXlZbUZ6YVdOZmMzUnlhVzVuU1hkT1UxOHhNV05vWVhKZmRISmhhWFJ6U1hkRlJVNVRYemxoYkd4dlkyRjBiM0pKZDBWRlJVVUFBSlFNQUFERUJ3QUFUbE4wTTE5Zk1qRXlZbUZ6YVdOZmMzUnlhVzVuU1VSelRsTmZNVEZqYUdGeVgzUnlZV2wwYzBsRWMwVkZUbE5mT1dGc2JHOWpZWFJ2Y2tsRWMwVkZSVVVBQUFDVURBQUFEQWdBQUU1VGRETmZYekl4TW1KaGMybGpYM04wY21sdVowbEVhVTVUWHpFeFkyaGhjbDkwY21GcGRITkpSR2xGUlU1VFh6bGhiR3h2WTJGMGIzSkpSR2xGUlVWRkFBQUFsQXdBQUZnSUFBQk9NVEJsYlhOamNtbHdkR1Z1TTNaaGJFVUFBSlFNQUFDa0NBQUFUakV3WlcxelkzSnBjSFJsYmpFeGJXVnRiM0o1WDNacFpYZEpZMFZGQUFDVURBQUF3QWdBQUU0eE1HVnRjMk55YVhCMFpXNHhNVzFsYlc5eWVWOTJhV1YzU1dGRlJRQUFsQXdBQU9nSUFBQk9NVEJsYlhOamNtbHdkR1Z1TVRGdFpXMXZjbmxmZG1sbGQwbG9SVVVBQUpRTUFBQVFDUUFBVGpFd1pXMXpZM0pwY0hSbGJqRXhiV1Z0YjNKNVgzWnBaWGRKYzBWRkFBQ1VEQUFBT0FrQUFFNHhNR1Z0YzJOeWFYQjBaVzR4TVcxbGJXOXllVjkyYVdWM1NYUkZSUUFBbEF3QUFHQUpBQUJPTVRCbGJYTmpjbWx3ZEdWdU1URnRaVzF2Y25sZmRtbGxkMGxwUlVVQUFKUU1BQUNJQ1FBQVRqRXdaVzF6WTNKcGNIUmxiakV4YldWdGIzSjVYM1pwWlhkSmFrVkZBQUNVREFBQXNBa0FBRTR4TUdWdGMyTnlhWEIwWlc0eE1XMWxiVzl5ZVY5MmFXVjNTV3hGUlFBQWxBd0FBTmdKQUFCT01UQmxiWE5qY21sd2RHVnVNVEZ0WlcxdmNubGZkbWxsZDBsdFJVVUFBSlFNQUFBQUNnQUFUakV3WlcxelkzSnBjSFJsYmpFeGJXVnRiM0o1WDNacFpYZEplRVZGQUFDVURBQUFLQW9BQUU0eE1HVnRjMk55YVhCMFpXNHhNVzFsYlc5eWVWOTJhV1YzU1hsRlJRQUFsQXdBQUZBS0FBQk9NVEJsYlhOamNtbHdkR1Z1TVRGdFpXMXZjbmxmZG1sbGQwbG1SVVVBQUpRTUFBQjRDZ0FBVGpFd1pXMXpZM0pwY0hSbGJqRXhiV1Z0YjNKNVgzWnBaWGRKWkVWRkFBQ1VEQUFBb0FvQUFFNHhNRjlmWTNoNFlXSnBkakV4Tmw5ZmMyaHBiVjkwZVhCbFgybHVabTlGQUFBQUFMd01BQURJQ2dBQUlBMEFBRTR4TUY5ZlkzaDRZV0pwZGpFeE4xOWZZMnhoYzNOZmRIbHdaVjlwYm1adlJRQUFBTHdNQUFENENnQUE3QW9BQUU0eE1GOWZZM2g0WVdKcGRqRXhOMTlmY0dKaGMyVmZkSGx3WlY5cGJtWnZSUUFBQUx3TUFBQW9Dd0FBN0FvQUFFNHhNRjlmWTNoNFlXSnBkakV4T1Y5ZmNHOXBiblJsY2w5MGVYQmxYMmx1Wm05RkFMd01BQUJZQ3dBQVRBc0FBQUFBQUFETUN3QUFBZ0FBQUFNQUFBQUVBQUFBQlFBQUFBWUFBQUJPTVRCZlgyTjRlR0ZpYVhZeE1qTmZYMloxYm1SaGJXVnVkR0ZzWDNSNWNHVmZhVzVtYjBVQXZBd0FBS1FMQUFEc0NnQUFkZ0FBQUpBTEFBRFlDd0FBWWdBQUFKQUxBQURrQ3dBQVl3QUFBSkFMQUFEd0N3QUFhQUFBQUpBTEFBRDhDd0FBWVFBQUFKQUxBQUFJREFBQWN3QUFBSkFMQUFBVURBQUFkQUFBQUpBTEFBQWdEQUFBYVFBQUFKQUxBQUFzREFBQWFnQUFBSkFMQUFBNERBQUFiQUFBQUpBTEFBQkVEQUFBYlFBQUFKQUxBQUJRREFBQWVBQUFBSkFMQUFCY0RBQUFlUUFBQUpBTEFBQm9EQUFBWmdBQUFKQUxBQUIwREFBQVpBQUFBSkFMQUFDQURBQUFBQUFBQUJ3TEFBQUNBQUFBQndBQUFBUUFBQUFGQUFBQUNBQUFBQWtBQUFBS0FBQUFDd0FBQUFBQUFBQUVEUUFBQWdBQUFBd0FBQUFFQUFBQUJRQUFBQWdBQUFBTkFBQUFEZ0FBQUE4QUFBQk9NVEJmWDJONGVHRmlhWFl4TWpCZlgzTnBYMk5zWVhOelgzUjVjR1ZmYVc1bWIwVUFBQUFBdkF3QUFOd01BQUFjQ3dBQVUzUTVkSGx3WlY5cGJtWnZBQUFBQUpRTUFBQVFEUUJCcUJvTEF6QVBBUT09IjtpZighaXNEYXRhVVJJKHdhc21CaW5hcnlGaWxlKSl7d2FzbUJpbmFyeUZpbGU9bG9jYXRlRmlsZSh3YXNtQmluYXJ5RmlsZSk7fWZ1bmN0aW9uIGdldEJpbmFyeVN5bmMoZmlsZSl7aWYoZmlsZT09d2FzbUJpbmFyeUZpbGUmJndhc21CaW5hcnkpe3JldHVybiBuZXcgVWludDhBcnJheSh3YXNtQmluYXJ5KX12YXIgYmluYXJ5PXRyeVBhcnNlQXNEYXRhVVJJKGZpbGUpO2lmKGJpbmFyeSl7cmV0dXJuIGJpbmFyeX1pZihyZWFkQmluYXJ5KXtyZXR1cm4gcmVhZEJpbmFyeShmaWxlKX10aHJvdyAiYm90aCBhc3luYyBhbmQgc3luYyBmZXRjaGluZyBvZiB0aGUgd2FzbSBmYWlsZWQifWZ1bmN0aW9uIGdldEJpbmFyeVByb21pc2UoYmluYXJ5RmlsZSl7cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCk9PmdldEJpbmFyeVN5bmMoYmluYXJ5RmlsZSkpfWZ1bmN0aW9uIGluc3RhbnRpYXRlQXJyYXlCdWZmZXIoYmluYXJ5RmlsZSxpbXBvcnRzLHJlY2VpdmVyKXtyZXR1cm4gZ2V0QmluYXJ5UHJvbWlzZShiaW5hcnlGaWxlKS50aGVuKGJpbmFyeT0+V2ViQXNzZW1ibHkuaW5zdGFudGlhdGUoYmluYXJ5LGltcG9ydHMpKS50aGVuKGluc3RhbmNlPT5pbnN0YW5jZSkudGhlbihyZWNlaXZlcixyZWFzb249PntlcnIoYGZhaWxlZCB0byBhc3luY2hyb25vdXNseSBwcmVwYXJlIHdhc206ICR7cmVhc29ufWApO2Fib3J0KHJlYXNvbik7fSl9ZnVuY3Rpb24gaW5zdGFudGlhdGVBc3luYyhiaW5hcnksYmluYXJ5RmlsZSxpbXBvcnRzLGNhbGxiYWNrKXtyZXR1cm4gaW5zdGFudGlhdGVBcnJheUJ1ZmZlcihiaW5hcnlGaWxlLGltcG9ydHMsY2FsbGJhY2spfWZ1bmN0aW9uIGNyZWF0ZVdhc20oKXt2YXIgaW5mbz17ImEiOndhc21JbXBvcnRzfTtmdW5jdGlvbiByZWNlaXZlSW5zdGFuY2UoaW5zdGFuY2UsbW9kdWxlKXt3YXNtRXhwb3J0cz1pbnN0YW5jZS5leHBvcnRzO3dhc21NZW1vcnk9d2FzbUV4cG9ydHNbImsiXTt1cGRhdGVNZW1vcnlWaWV3cygpO2FkZE9uSW5pdCh3YXNtRXhwb3J0c1sibCJdKTtyZW1vdmVSdW5EZXBlbmRlbmN5KCk7cmV0dXJuIHdhc21FeHBvcnRzfWFkZFJ1bkRlcGVuZGVuY3koKTtmdW5jdGlvbiByZWNlaXZlSW5zdGFudGlhdGlvblJlc3VsdChyZXN1bHQpe3JlY2VpdmVJbnN0YW5jZShyZXN1bHRbImluc3RhbmNlIl0pO31pZihNb2R1bGVbImluc3RhbnRpYXRlV2FzbSJdKXt0cnl7cmV0dXJuIE1vZHVsZVsiaW5zdGFudGlhdGVXYXNtIl0oaW5mbyxyZWNlaXZlSW5zdGFuY2UpfWNhdGNoKGUpe2VycihgTW9kdWxlLmluc3RhbnRpYXRlV2FzbSBjYWxsYmFjayBmYWlsZWQgd2l0aCBlcnJvcjogJHtlfWApO3JlYWR5UHJvbWlzZVJlamVjdChlKTt9fWluc3RhbnRpYXRlQXN5bmMod2FzbUJpbmFyeSx3YXNtQmluYXJ5RmlsZSxpbmZvLHJlY2VpdmVJbnN0YW50aWF0aW9uUmVzdWx0KS5jYXRjaChyZWFkeVByb21pc2VSZWplY3QpO3JldHVybiB7fX12YXIgY2FsbFJ1bnRpbWVDYWxsYmFja3M9Y2FsbGJhY2tzPT57d2hpbGUoY2FsbGJhY2tzLmxlbmd0aD4wKXtjYWxsYmFja3Muc2hpZnQoKShNb2R1bGUpO319O01vZHVsZVsibm9FeGl0UnVudGltZSJdfHx0cnVlO3ZhciBfX2VtYmluZF9yZWdpc3Rlcl9iaWdpbnQ9KHByaW1pdGl2ZVR5cGUsbmFtZSxzaXplLG1pblJhbmdlLG1heFJhbmdlKT0+e307dmFyIGVtYmluZF9pbml0X2NoYXJDb2Rlcz0oKT0+e3ZhciBjb2Rlcz1uZXcgQXJyYXkoMjU2KTtmb3IodmFyIGk9MDtpPDI1NjsrK2kpe2NvZGVzW2ldPVN0cmluZy5mcm9tQ2hhckNvZGUoaSk7fWVtYmluZF9jaGFyQ29kZXM9Y29kZXM7fTt2YXIgZW1iaW5kX2NoYXJDb2Rlczt2YXIgcmVhZExhdGluMVN0cmluZz1wdHI9Pnt2YXIgcmV0PSIiO3ZhciBjPXB0cjt3aGlsZShIRUFQVThbY10pe3JldCs9ZW1iaW5kX2NoYXJDb2Rlc1tIRUFQVThbYysrXV07fXJldHVybiByZXR9O3ZhciBhd2FpdGluZ0RlcGVuZGVuY2llcz17fTt2YXIgcmVnaXN0ZXJlZFR5cGVzPXt9O3ZhciBCaW5kaW5nRXJyb3I7dmFyIHRocm93QmluZGluZ0Vycm9yPW1lc3NhZ2U9Pnt0aHJvdyBuZXcgQmluZGluZ0Vycm9yKG1lc3NhZ2UpfTtmdW5jdGlvbiBzaGFyZWRSZWdpc3RlclR5cGUocmF3VHlwZSxyZWdpc3RlcmVkSW5zdGFuY2Usb3B0aW9ucz17fSl7dmFyIG5hbWU9cmVnaXN0ZXJlZEluc3RhbmNlLm5hbWU7aWYoIXJhd1R5cGUpe3Rocm93QmluZGluZ0Vycm9yKGB0eXBlICIke25hbWV9IiBtdXN0IGhhdmUgYSBwb3NpdGl2ZSBpbnRlZ2VyIHR5cGVpZCBwb2ludGVyYCk7fWlmKHJlZ2lzdGVyZWRUeXBlcy5oYXNPd25Qcm9wZXJ0eShyYXdUeXBlKSl7aWYob3B0aW9ucy5pZ25vcmVEdXBsaWNhdGVSZWdpc3RyYXRpb25zKXtyZXR1cm59ZWxzZSB7dGhyb3dCaW5kaW5nRXJyb3IoYENhbm5vdCByZWdpc3RlciB0eXBlICcke25hbWV9JyB0d2ljZWApO319cmVnaXN0ZXJlZFR5cGVzW3Jhd1R5cGVdPXJlZ2lzdGVyZWRJbnN0YW5jZTtpZihhd2FpdGluZ0RlcGVuZGVuY2llcy5oYXNPd25Qcm9wZXJ0eShyYXdUeXBlKSl7dmFyIGNhbGxiYWNrcz1hd2FpdGluZ0RlcGVuZGVuY2llc1tyYXdUeXBlXTtkZWxldGUgYXdhaXRpbmdEZXBlbmRlbmNpZXNbcmF3VHlwZV07Y2FsbGJhY2tzLmZvckVhY2goY2I9PmNiKCkpO319ZnVuY3Rpb24gcmVnaXN0ZXJUeXBlKHJhd1R5cGUscmVnaXN0ZXJlZEluc3RhbmNlLG9wdGlvbnM9e30pe2lmKCEoImFyZ1BhY2tBZHZhbmNlImluIHJlZ2lzdGVyZWRJbnN0YW5jZSkpe3Rocm93IG5ldyBUeXBlRXJyb3IoInJlZ2lzdGVyVHlwZSByZWdpc3RlcmVkSW5zdGFuY2UgcmVxdWlyZXMgYXJnUGFja0FkdmFuY2UiKX1yZXR1cm4gc2hhcmVkUmVnaXN0ZXJUeXBlKHJhd1R5cGUscmVnaXN0ZXJlZEluc3RhbmNlLG9wdGlvbnMpfXZhciBHZW5lcmljV2lyZVR5cGVTaXplPTg7dmFyIF9fZW1iaW5kX3JlZ2lzdGVyX2Jvb2w9KHJhd1R5cGUsbmFtZSx0cnVlVmFsdWUsZmFsc2VWYWx1ZSk9PntuYW1lPXJlYWRMYXRpbjFTdHJpbmcobmFtZSk7cmVnaXN0ZXJUeXBlKHJhd1R5cGUse25hbWU6bmFtZSwiZnJvbVdpcmVUeXBlIjpmdW5jdGlvbih3dCl7cmV0dXJuICEhd3R9LCJ0b1dpcmVUeXBlIjpmdW5jdGlvbihkZXN0cnVjdG9ycyxvKXtyZXR1cm4gbz90cnVlVmFsdWU6ZmFsc2VWYWx1ZX0sImFyZ1BhY2tBZHZhbmNlIjpHZW5lcmljV2lyZVR5cGVTaXplLCJyZWFkVmFsdWVGcm9tUG9pbnRlciI6ZnVuY3Rpb24ocG9pbnRlcil7cmV0dXJuIHRoaXNbImZyb21XaXJlVHlwZSJdKEhFQVBVOFtwb2ludGVyXSl9LGRlc3RydWN0b3JGdW5jdGlvbjpudWxsfSk7fTtjbGFzcyBIYW5kbGVBbGxvY2F0b3J7Y29uc3RydWN0b3IoKXt0aGlzLmFsbG9jYXRlZD1bdW5kZWZpbmVkXTt0aGlzLmZyZWVsaXN0PVtdO31nZXQoaWQpe3JldHVybiB0aGlzLmFsbG9jYXRlZFtpZF19aGFzKGlkKXtyZXR1cm4gdGhpcy5hbGxvY2F0ZWRbaWRdIT09dW5kZWZpbmVkfWFsbG9jYXRlKGhhbmRsZSl7dmFyIGlkPXRoaXMuZnJlZWxpc3QucG9wKCl8fHRoaXMuYWxsb2NhdGVkLmxlbmd0aDt0aGlzLmFsbG9jYXRlZFtpZF09aGFuZGxlO3JldHVybiBpZH1mcmVlKGlkKXt0aGlzLmFsbG9jYXRlZFtpZF09dW5kZWZpbmVkO3RoaXMuZnJlZWxpc3QucHVzaChpZCk7fX12YXIgZW12YWxfaGFuZGxlcz1uZXcgSGFuZGxlQWxsb2NhdG9yO3ZhciBfX2VtdmFsX2RlY3JlZj1oYW5kbGU9PntpZihoYW5kbGU+PWVtdmFsX2hhbmRsZXMucmVzZXJ2ZWQmJjA9PT0tLWVtdmFsX2hhbmRsZXMuZ2V0KGhhbmRsZSkucmVmY291bnQpe2VtdmFsX2hhbmRsZXMuZnJlZShoYW5kbGUpO319O3ZhciBjb3VudF9lbXZhbF9oYW5kbGVzPSgpPT57dmFyIGNvdW50PTA7Zm9yKHZhciBpPWVtdmFsX2hhbmRsZXMucmVzZXJ2ZWQ7aTxlbXZhbF9oYW5kbGVzLmFsbG9jYXRlZC5sZW5ndGg7KytpKXtpZihlbXZhbF9oYW5kbGVzLmFsbG9jYXRlZFtpXSE9PXVuZGVmaW5lZCl7Kytjb3VudDt9fXJldHVybiBjb3VudH07dmFyIGluaXRfZW12YWw9KCk9PntlbXZhbF9oYW5kbGVzLmFsbG9jYXRlZC5wdXNoKHt2YWx1ZTp1bmRlZmluZWR9LHt2YWx1ZTpudWxsfSx7dmFsdWU6dHJ1ZX0se3ZhbHVlOmZhbHNlfSk7T2JqZWN0LmFzc2lnbihlbXZhbF9oYW5kbGVzLHtyZXNlcnZlZDplbXZhbF9oYW5kbGVzLmFsbG9jYXRlZC5sZW5ndGh9KSxNb2R1bGVbImNvdW50X2VtdmFsX2hhbmRsZXMiXT1jb3VudF9lbXZhbF9oYW5kbGVzO307dmFyIEVtdmFsPXt0b1ZhbHVlOmhhbmRsZT0+e2lmKCFoYW5kbGUpe3Rocm93QmluZGluZ0Vycm9yKCJDYW5ub3QgdXNlIGRlbGV0ZWQgdmFsLiBoYW5kbGUgPSAiK2hhbmRsZSk7fXJldHVybiBlbXZhbF9oYW5kbGVzLmdldChoYW5kbGUpLnZhbHVlfSx0b0hhbmRsZTp2YWx1ZT0+e3N3aXRjaCh2YWx1ZSl7Y2FzZSB1bmRlZmluZWQ6cmV0dXJuIDE7Y2FzZSBudWxsOnJldHVybiAyO2Nhc2UgdHJ1ZTpyZXR1cm4gMztjYXNlIGZhbHNlOnJldHVybiA0O2RlZmF1bHQ6e3JldHVybiBlbXZhbF9oYW5kbGVzLmFsbG9jYXRlKHtyZWZjb3VudDoxLHZhbHVlOnZhbHVlfSl9fX19O2Z1bmN0aW9uIHNpbXBsZVJlYWRWYWx1ZUZyb21Qb2ludGVyKHBvaW50ZXIpe3JldHVybiB0aGlzWyJmcm9tV2lyZVR5cGUiXShIRUFQMzJbcG9pbnRlcj4+Ml0pfXZhciBFbVZhbFR5cGU9e25hbWU6ImVtc2NyaXB0ZW46OnZhbCIsImZyb21XaXJlVHlwZSI6aGFuZGxlPT57dmFyIHJ2PUVtdmFsLnRvVmFsdWUoaGFuZGxlKTtfX2VtdmFsX2RlY3JlZihoYW5kbGUpO3JldHVybiBydn0sInRvV2lyZVR5cGUiOihkZXN0cnVjdG9ycyx2YWx1ZSk9PkVtdmFsLnRvSGFuZGxlKHZhbHVlKSwiYXJnUGFja0FkdmFuY2UiOkdlbmVyaWNXaXJlVHlwZVNpemUsInJlYWRWYWx1ZUZyb21Qb2ludGVyIjpzaW1wbGVSZWFkVmFsdWVGcm9tUG9pbnRlcixkZXN0cnVjdG9yRnVuY3Rpb246bnVsbH07dmFyIF9fZW1iaW5kX3JlZ2lzdGVyX2VtdmFsPXJhd1R5cGU9PnJlZ2lzdGVyVHlwZShyYXdUeXBlLEVtVmFsVHlwZSk7dmFyIGZsb2F0UmVhZFZhbHVlRnJvbVBvaW50ZXI9KG5hbWUsd2lkdGgpPT57c3dpdGNoKHdpZHRoKXtjYXNlIDQ6cmV0dXJuIGZ1bmN0aW9uKHBvaW50ZXIpe3JldHVybiB0aGlzWyJmcm9tV2lyZVR5cGUiXShIRUFQRjMyW3BvaW50ZXI+PjJdKX07Y2FzZSA4OnJldHVybiBmdW5jdGlvbihwb2ludGVyKXtyZXR1cm4gdGhpc1siZnJvbVdpcmVUeXBlIl0oSEVBUEY2NFtwb2ludGVyPj4zXSl9O2RlZmF1bHQ6dGhyb3cgbmV3IFR5cGVFcnJvcihgaW52YWxpZCBmbG9hdCB3aWR0aCAoJHt3aWR0aH0pOiAke25hbWV9YCl9fTt2YXIgX19lbWJpbmRfcmVnaXN0ZXJfZmxvYXQ9KHJhd1R5cGUsbmFtZSxzaXplKT0+e25hbWU9cmVhZExhdGluMVN0cmluZyhuYW1lKTtyZWdpc3RlclR5cGUocmF3VHlwZSx7bmFtZTpuYW1lLCJmcm9tV2lyZVR5cGUiOnZhbHVlPT52YWx1ZSwidG9XaXJlVHlwZSI6KGRlc3RydWN0b3JzLHZhbHVlKT0+dmFsdWUsImFyZ1BhY2tBZHZhbmNlIjpHZW5lcmljV2lyZVR5cGVTaXplLCJyZWFkVmFsdWVGcm9tUG9pbnRlciI6ZmxvYXRSZWFkVmFsdWVGcm9tUG9pbnRlcihuYW1lLHNpemUpLGRlc3RydWN0b3JGdW5jdGlvbjpudWxsfSk7fTt2YXIgaW50ZWdlclJlYWRWYWx1ZUZyb21Qb2ludGVyPShuYW1lLHdpZHRoLHNpZ25lZCk9Pntzd2l0Y2god2lkdGgpe2Nhc2UgMTpyZXR1cm4gc2lnbmVkP3BvaW50ZXI9PkhFQVA4W3BvaW50ZXI+PjBdOnBvaW50ZXI9PkhFQVBVOFtwb2ludGVyPj4wXTtjYXNlIDI6cmV0dXJuIHNpZ25lZD9wb2ludGVyPT5IRUFQMTZbcG9pbnRlcj4+MV06cG9pbnRlcj0+SEVBUFUxNltwb2ludGVyPj4xXTtjYXNlIDQ6cmV0dXJuIHNpZ25lZD9wb2ludGVyPT5IRUFQMzJbcG9pbnRlcj4+Ml06cG9pbnRlcj0+SEVBUFUzMltwb2ludGVyPj4yXTtkZWZhdWx0OnRocm93IG5ldyBUeXBlRXJyb3IoYGludmFsaWQgaW50ZWdlciB3aWR0aCAoJHt3aWR0aH0pOiAke25hbWV9YCl9fTt2YXIgX19lbWJpbmRfcmVnaXN0ZXJfaW50ZWdlcj0ocHJpbWl0aXZlVHlwZSxuYW1lLHNpemUsbWluUmFuZ2UsbWF4UmFuZ2UpPT57bmFtZT1yZWFkTGF0aW4xU3RyaW5nKG5hbWUpO3ZhciBmcm9tV2lyZVR5cGU9dmFsdWU9PnZhbHVlO2lmKG1pblJhbmdlPT09MCl7dmFyIGJpdHNoaWZ0PTMyLTgqc2l6ZTtmcm9tV2lyZVR5cGU9dmFsdWU9PnZhbHVlPDxiaXRzaGlmdD4+PmJpdHNoaWZ0O312YXIgaXNVbnNpZ25lZFR5cGU9bmFtZS5pbmNsdWRlcygidW5zaWduZWQiKTt2YXIgY2hlY2tBc3NlcnRpb25zPSh2YWx1ZSx0b1R5cGVOYW1lKT0+e307dmFyIHRvV2lyZVR5cGU7aWYoaXNVbnNpZ25lZFR5cGUpe3RvV2lyZVR5cGU9ZnVuY3Rpb24oZGVzdHJ1Y3RvcnMsdmFsdWUpe2NoZWNrQXNzZXJ0aW9ucyh2YWx1ZSx0aGlzLm5hbWUpO3JldHVybiB2YWx1ZT4+PjB9O31lbHNlIHt0b1dpcmVUeXBlPWZ1bmN0aW9uKGRlc3RydWN0b3JzLHZhbHVlKXtjaGVja0Fzc2VydGlvbnModmFsdWUsdGhpcy5uYW1lKTtyZXR1cm4gdmFsdWV9O31yZWdpc3RlclR5cGUocHJpbWl0aXZlVHlwZSx7bmFtZTpuYW1lLCJmcm9tV2lyZVR5cGUiOmZyb21XaXJlVHlwZSwidG9XaXJlVHlwZSI6dG9XaXJlVHlwZSwiYXJnUGFja0FkdmFuY2UiOkdlbmVyaWNXaXJlVHlwZVNpemUsInJlYWRWYWx1ZUZyb21Qb2ludGVyIjppbnRlZ2VyUmVhZFZhbHVlRnJvbVBvaW50ZXIobmFtZSxzaXplLG1pblJhbmdlIT09MCksZGVzdHJ1Y3RvckZ1bmN0aW9uOm51bGx9KTt9O3ZhciBfX2VtYmluZF9yZWdpc3Rlcl9tZW1vcnlfdmlldz0ocmF3VHlwZSxkYXRhVHlwZUluZGV4LG5hbWUpPT57dmFyIHR5cGVNYXBwaW5nPVtJbnQ4QXJyYXksVWludDhBcnJheSxJbnQxNkFycmF5LFVpbnQxNkFycmF5LEludDMyQXJyYXksVWludDMyQXJyYXksRmxvYXQzMkFycmF5LEZsb2F0NjRBcnJheV07dmFyIFRBPXR5cGVNYXBwaW5nW2RhdGFUeXBlSW5kZXhdO2Z1bmN0aW9uIGRlY29kZU1lbW9yeVZpZXcoaGFuZGxlKXt2YXIgc2l6ZT1IRUFQVTMyW2hhbmRsZT4+Ml07dmFyIGRhdGE9SEVBUFUzMltoYW5kbGUrND4+Ml07cmV0dXJuIG5ldyBUQShIRUFQOC5idWZmZXIsZGF0YSxzaXplKX1uYW1lPXJlYWRMYXRpbjFTdHJpbmcobmFtZSk7cmVnaXN0ZXJUeXBlKHJhd1R5cGUse25hbWU6bmFtZSwiZnJvbVdpcmVUeXBlIjpkZWNvZGVNZW1vcnlWaWV3LCJhcmdQYWNrQWR2YW5jZSI6R2VuZXJpY1dpcmVUeXBlU2l6ZSwicmVhZFZhbHVlRnJvbVBvaW50ZXIiOmRlY29kZU1lbW9yeVZpZXd9LHtpZ25vcmVEdXBsaWNhdGVSZWdpc3RyYXRpb25zOnRydWV9KTt9O2Z1bmN0aW9uIHJlYWRQb2ludGVyKHBvaW50ZXIpe3JldHVybiB0aGlzWyJmcm9tV2lyZVR5cGUiXShIRUFQVTMyW3BvaW50ZXI+PjJdKX12YXIgc3RyaW5nVG9VVEY4QXJyYXk9KHN0cixoZWFwLG91dElkeCxtYXhCeXRlc1RvV3JpdGUpPT57aWYoIShtYXhCeXRlc1RvV3JpdGU+MCkpcmV0dXJuIDA7dmFyIHN0YXJ0SWR4PW91dElkeDt2YXIgZW5kSWR4PW91dElkeCttYXhCeXRlc1RvV3JpdGUtMTtmb3IodmFyIGk9MDtpPHN0ci5sZW5ndGg7KytpKXt2YXIgdT1zdHIuY2hhckNvZGVBdChpKTtpZih1Pj01NTI5NiYmdTw9NTczNDMpe3ZhciB1MT1zdHIuY2hhckNvZGVBdCgrK2kpO3U9NjU1MzYrKCh1JjEwMjMpPDwxMCl8dTEmMTAyMzt9aWYodTw9MTI3KXtpZihvdXRJZHg+PWVuZElkeClicmVhaztoZWFwW291dElkeCsrXT11O31lbHNlIGlmKHU8PTIwNDcpe2lmKG91dElkeCsxPj1lbmRJZHgpYnJlYWs7aGVhcFtvdXRJZHgrK109MTkyfHU+PjY7aGVhcFtvdXRJZHgrK109MTI4fHUmNjM7fWVsc2UgaWYodTw9NjU1MzUpe2lmKG91dElkeCsyPj1lbmRJZHgpYnJlYWs7aGVhcFtvdXRJZHgrK109MjI0fHU+PjEyO2hlYXBbb3V0SWR4KytdPTEyOHx1Pj42JjYzO2hlYXBbb3V0SWR4KytdPTEyOHx1JjYzO31lbHNlIHtpZihvdXRJZHgrMz49ZW5kSWR4KWJyZWFrO2hlYXBbb3V0SWR4KytdPTI0MHx1Pj4xODtoZWFwW291dElkeCsrXT0xMjh8dT4+MTImNjM7aGVhcFtvdXRJZHgrK109MTI4fHU+PjYmNjM7aGVhcFtvdXRJZHgrK109MTI4fHUmNjM7fX1oZWFwW291dElkeF09MDtyZXR1cm4gb3V0SWR4LXN0YXJ0SWR4fTt2YXIgc3RyaW5nVG9VVEY4PShzdHIsb3V0UHRyLG1heEJ5dGVzVG9Xcml0ZSk9PnN0cmluZ1RvVVRGOEFycmF5KHN0cixIRUFQVTgsb3V0UHRyLG1heEJ5dGVzVG9Xcml0ZSk7dmFyIGxlbmd0aEJ5dGVzVVRGOD1zdHI9Pnt2YXIgbGVuPTA7Zm9yKHZhciBpPTA7aTxzdHIubGVuZ3RoOysraSl7dmFyIGM9c3RyLmNoYXJDb2RlQXQoaSk7aWYoYzw9MTI3KXtsZW4rKzt9ZWxzZSBpZihjPD0yMDQ3KXtsZW4rPTI7fWVsc2UgaWYoYz49NTUyOTYmJmM8PTU3MzQzKXtsZW4rPTQ7KytpO31lbHNlIHtsZW4rPTM7fX1yZXR1cm4gbGVufTt2YXIgVVRGOERlY29kZXI9dHlwZW9mIFRleHREZWNvZGVyIT0idW5kZWZpbmVkIj9uZXcgVGV4dERlY29kZXIoInV0ZjgiKTp1bmRlZmluZWQ7dmFyIFVURjhBcnJheVRvU3RyaW5nPShoZWFwT3JBcnJheSxpZHgsbWF4Qnl0ZXNUb1JlYWQpPT57dmFyIGVuZElkeD1pZHgrbWF4Qnl0ZXNUb1JlYWQ7dmFyIGVuZFB0cj1pZHg7d2hpbGUoaGVhcE9yQXJyYXlbZW5kUHRyXSYmIShlbmRQdHI+PWVuZElkeCkpKytlbmRQdHI7aWYoZW5kUHRyLWlkeD4xNiYmaGVhcE9yQXJyYXkuYnVmZmVyJiZVVEY4RGVjb2Rlcil7cmV0dXJuIFVURjhEZWNvZGVyLmRlY29kZShoZWFwT3JBcnJheS5zdWJhcnJheShpZHgsZW5kUHRyKSl9dmFyIHN0cj0iIjt3aGlsZShpZHg8ZW5kUHRyKXt2YXIgdTA9aGVhcE9yQXJyYXlbaWR4KytdO2lmKCEodTAmMTI4KSl7c3RyKz1TdHJpbmcuZnJvbUNoYXJDb2RlKHUwKTtjb250aW51ZX12YXIgdTE9aGVhcE9yQXJyYXlbaWR4KytdJjYzO2lmKCh1MCYyMjQpPT0xOTIpe3N0cis9U3RyaW5nLmZyb21DaGFyQ29kZSgodTAmMzEpPDw2fHUxKTtjb250aW51ZX12YXIgdTI9aGVhcE9yQXJyYXlbaWR4KytdJjYzO2lmKCh1MCYyNDApPT0yMjQpe3UwPSh1MCYxNSk8PDEyfHUxPDw2fHUyO31lbHNlIHt1MD0odTAmNyk8PDE4fHUxPDwxMnx1Mjw8NnxoZWFwT3JBcnJheVtpZHgrK10mNjM7fWlmKHUwPDY1NTM2KXtzdHIrPVN0cmluZy5mcm9tQ2hhckNvZGUodTApO31lbHNlIHt2YXIgY2g9dTAtNjU1MzY7c3RyKz1TdHJpbmcuZnJvbUNoYXJDb2RlKDU1Mjk2fGNoPj4xMCw1NjMyMHxjaCYxMDIzKTt9fXJldHVybiBzdHJ9O3ZhciBVVEY4VG9TdHJpbmc9KHB0cixtYXhCeXRlc1RvUmVhZCk9PnB0cj9VVEY4QXJyYXlUb1N0cmluZyhIRUFQVTgscHRyLG1heEJ5dGVzVG9SZWFkKToiIjt2YXIgX19lbWJpbmRfcmVnaXN0ZXJfc3RkX3N0cmluZz0ocmF3VHlwZSxuYW1lKT0+e25hbWU9cmVhZExhdGluMVN0cmluZyhuYW1lKTt2YXIgc3RkU3RyaW5nSXNVVEY4PW5hbWU9PT0ic3RkOjpzdHJpbmciO3JlZ2lzdGVyVHlwZShyYXdUeXBlLHtuYW1lOm5hbWUsImZyb21XaXJlVHlwZSIodmFsdWUpe3ZhciBsZW5ndGg9SEVBUFUzMlt2YWx1ZT4+Ml07dmFyIHBheWxvYWQ9dmFsdWUrNDt2YXIgc3RyO2lmKHN0ZFN0cmluZ0lzVVRGOCl7dmFyIGRlY29kZVN0YXJ0UHRyPXBheWxvYWQ7Zm9yKHZhciBpPTA7aTw9bGVuZ3RoOysraSl7dmFyIGN1cnJlbnRCeXRlUHRyPXBheWxvYWQraTtpZihpPT1sZW5ndGh8fEhFQVBVOFtjdXJyZW50Qnl0ZVB0cl09PTApe3ZhciBtYXhSZWFkPWN1cnJlbnRCeXRlUHRyLWRlY29kZVN0YXJ0UHRyO3ZhciBzdHJpbmdTZWdtZW50PVVURjhUb1N0cmluZyhkZWNvZGVTdGFydFB0cixtYXhSZWFkKTtpZihzdHI9PT11bmRlZmluZWQpe3N0cj1zdHJpbmdTZWdtZW50O31lbHNlIHtzdHIrPVN0cmluZy5mcm9tQ2hhckNvZGUoMCk7c3RyKz1zdHJpbmdTZWdtZW50O31kZWNvZGVTdGFydFB0cj1jdXJyZW50Qnl0ZVB0cisxO319fWVsc2Uge3ZhciBhPW5ldyBBcnJheShsZW5ndGgpO2Zvcih2YXIgaT0wO2k8bGVuZ3RoOysraSl7YVtpXT1TdHJpbmcuZnJvbUNoYXJDb2RlKEhFQVBVOFtwYXlsb2FkK2ldKTt9c3RyPWEuam9pbigiIik7fV9mcmVlKHZhbHVlKTtyZXR1cm4gc3RyfSwidG9XaXJlVHlwZSIoZGVzdHJ1Y3RvcnMsdmFsdWUpe2lmKHZhbHVlIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpe3ZhbHVlPW5ldyBVaW50OEFycmF5KHZhbHVlKTt9dmFyIGxlbmd0aDt2YXIgdmFsdWVJc09mVHlwZVN0cmluZz10eXBlb2YgdmFsdWU9PSJzdHJpbmciO2lmKCEodmFsdWVJc09mVHlwZVN0cmluZ3x8dmFsdWUgaW5zdGFuY2VvZiBVaW50OEFycmF5fHx2YWx1ZSBpbnN0YW5jZW9mIFVpbnQ4Q2xhbXBlZEFycmF5fHx2YWx1ZSBpbnN0YW5jZW9mIEludDhBcnJheSkpe3Rocm93QmluZGluZ0Vycm9yKCJDYW5ub3QgcGFzcyBub24tc3RyaW5nIHRvIHN0ZDo6c3RyaW5nIik7fWlmKHN0ZFN0cmluZ0lzVVRGOCYmdmFsdWVJc09mVHlwZVN0cmluZyl7bGVuZ3RoPWxlbmd0aEJ5dGVzVVRGOCh2YWx1ZSk7fWVsc2Uge2xlbmd0aD12YWx1ZS5sZW5ndGg7fXZhciBiYXNlPV9tYWxsb2MoNCtsZW5ndGgrMSk7dmFyIHB0cj1iYXNlKzQ7SEVBUFUzMltiYXNlPj4yXT1sZW5ndGg7aWYoc3RkU3RyaW5nSXNVVEY4JiZ2YWx1ZUlzT2ZUeXBlU3RyaW5nKXtzdHJpbmdUb1VURjgodmFsdWUscHRyLGxlbmd0aCsxKTt9ZWxzZSB7aWYodmFsdWVJc09mVHlwZVN0cmluZyl7Zm9yKHZhciBpPTA7aTxsZW5ndGg7KytpKXt2YXIgY2hhckNvZGU9dmFsdWUuY2hhckNvZGVBdChpKTtpZihjaGFyQ29kZT4yNTUpe19mcmVlKHB0cik7dGhyb3dCaW5kaW5nRXJyb3IoIlN0cmluZyBoYXMgVVRGLTE2IGNvZGUgdW5pdHMgdGhhdCBkbyBub3QgZml0IGluIDggYml0cyIpO31IRUFQVThbcHRyK2ldPWNoYXJDb2RlO319ZWxzZSB7Zm9yKHZhciBpPTA7aTxsZW5ndGg7KytpKXtIRUFQVThbcHRyK2ldPXZhbHVlW2ldO319fWlmKGRlc3RydWN0b3JzIT09bnVsbCl7ZGVzdHJ1Y3RvcnMucHVzaChfZnJlZSxiYXNlKTt9cmV0dXJuIGJhc2V9LCJhcmdQYWNrQWR2YW5jZSI6R2VuZXJpY1dpcmVUeXBlU2l6ZSwicmVhZFZhbHVlRnJvbVBvaW50ZXIiOnJlYWRQb2ludGVyLGRlc3RydWN0b3JGdW5jdGlvbihwdHIpe19mcmVlKHB0cik7fX0pO307dmFyIFVURjE2RGVjb2Rlcj10eXBlb2YgVGV4dERlY29kZXIhPSJ1bmRlZmluZWQiP25ldyBUZXh0RGVjb2RlcigidXRmLTE2bGUiKTp1bmRlZmluZWQ7dmFyIFVURjE2VG9TdHJpbmc9KHB0cixtYXhCeXRlc1RvUmVhZCk9Pnt2YXIgZW5kUHRyPXB0cjt2YXIgaWR4PWVuZFB0cj4+MTt2YXIgbWF4SWR4PWlkeCttYXhCeXRlc1RvUmVhZC8yO3doaWxlKCEoaWR4Pj1tYXhJZHgpJiZIRUFQVTE2W2lkeF0pKytpZHg7ZW5kUHRyPWlkeDw8MTtpZihlbmRQdHItcHRyPjMyJiZVVEYxNkRlY29kZXIpcmV0dXJuIFVURjE2RGVjb2Rlci5kZWNvZGUoSEVBUFU4LnN1YmFycmF5KHB0cixlbmRQdHIpKTt2YXIgc3RyPSIiO2Zvcih2YXIgaT0wOyEoaT49bWF4Qnl0ZXNUb1JlYWQvMik7KytpKXt2YXIgY29kZVVuaXQ9SEVBUDE2W3B0citpKjI+PjFdO2lmKGNvZGVVbml0PT0wKWJyZWFrO3N0cis9U3RyaW5nLmZyb21DaGFyQ29kZShjb2RlVW5pdCk7fXJldHVybiBzdHJ9O3ZhciBzdHJpbmdUb1VURjE2PShzdHIsb3V0UHRyLG1heEJ5dGVzVG9Xcml0ZSk9PnttYXhCeXRlc1RvV3JpdGU/Pz0yMTQ3NDgzNjQ3O2lmKG1heEJ5dGVzVG9Xcml0ZTwyKXJldHVybiAwO21heEJ5dGVzVG9Xcml0ZS09Mjt2YXIgc3RhcnRQdHI9b3V0UHRyO3ZhciBudW1DaGFyc1RvV3JpdGU9bWF4Qnl0ZXNUb1dyaXRlPHN0ci5sZW5ndGgqMj9tYXhCeXRlc1RvV3JpdGUvMjpzdHIubGVuZ3RoO2Zvcih2YXIgaT0wO2k8bnVtQ2hhcnNUb1dyaXRlOysraSl7dmFyIGNvZGVVbml0PXN0ci5jaGFyQ29kZUF0KGkpO0hFQVAxNltvdXRQdHI+PjFdPWNvZGVVbml0O291dFB0cis9Mjt9SEVBUDE2W291dFB0cj4+MV09MDtyZXR1cm4gb3V0UHRyLXN0YXJ0UHRyfTt2YXIgbGVuZ3RoQnl0ZXNVVEYxNj1zdHI9PnN0ci5sZW5ndGgqMjt2YXIgVVRGMzJUb1N0cmluZz0ocHRyLG1heEJ5dGVzVG9SZWFkKT0+e3ZhciBpPTA7dmFyIHN0cj0iIjt3aGlsZSghKGk+PW1heEJ5dGVzVG9SZWFkLzQpKXt2YXIgdXRmMzI9SEVBUDMyW3B0citpKjQ+PjJdO2lmKHV0ZjMyPT0wKWJyZWFrOysraTtpZih1dGYzMj49NjU1MzYpe3ZhciBjaD11dGYzMi02NTUzNjtzdHIrPVN0cmluZy5mcm9tQ2hhckNvZGUoNTUyOTZ8Y2g+PjEwLDU2MzIwfGNoJjEwMjMpO31lbHNlIHtzdHIrPVN0cmluZy5mcm9tQ2hhckNvZGUodXRmMzIpO319cmV0dXJuIHN0cn07dmFyIHN0cmluZ1RvVVRGMzI9KHN0cixvdXRQdHIsbWF4Qnl0ZXNUb1dyaXRlKT0+e21heEJ5dGVzVG9Xcml0ZT8/PTIxNDc0ODM2NDc7aWYobWF4Qnl0ZXNUb1dyaXRlPDQpcmV0dXJuIDA7dmFyIHN0YXJ0UHRyPW91dFB0cjt2YXIgZW5kUHRyPXN0YXJ0UHRyK21heEJ5dGVzVG9Xcml0ZS00O2Zvcih2YXIgaT0wO2k8c3RyLmxlbmd0aDsrK2kpe3ZhciBjb2RlVW5pdD1zdHIuY2hhckNvZGVBdChpKTtpZihjb2RlVW5pdD49NTUyOTYmJmNvZGVVbml0PD01NzM0Myl7dmFyIHRyYWlsU3Vycm9nYXRlPXN0ci5jaGFyQ29kZUF0KCsraSk7Y29kZVVuaXQ9NjU1MzYrKChjb2RlVW5pdCYxMDIzKTw8MTApfHRyYWlsU3Vycm9nYXRlJjEwMjM7fUhFQVAzMltvdXRQdHI+PjJdPWNvZGVVbml0O291dFB0cis9NDtpZihvdXRQdHIrND5lbmRQdHIpYnJlYWt9SEVBUDMyW291dFB0cj4+Ml09MDtyZXR1cm4gb3V0UHRyLXN0YXJ0UHRyfTt2YXIgbGVuZ3RoQnl0ZXNVVEYzMj1zdHI9Pnt2YXIgbGVuPTA7Zm9yKHZhciBpPTA7aTxzdHIubGVuZ3RoOysraSl7dmFyIGNvZGVVbml0PXN0ci5jaGFyQ29kZUF0KGkpO2lmKGNvZGVVbml0Pj01NTI5NiYmY29kZVVuaXQ8PTU3MzQzKSsraTtsZW4rPTQ7fXJldHVybiBsZW59O3ZhciBfX2VtYmluZF9yZWdpc3Rlcl9zdGRfd3N0cmluZz0ocmF3VHlwZSxjaGFyU2l6ZSxuYW1lKT0+e25hbWU9cmVhZExhdGluMVN0cmluZyhuYW1lKTt2YXIgZGVjb2RlU3RyaW5nLGVuY29kZVN0cmluZyxnZXRIZWFwLGxlbmd0aEJ5dGVzVVRGLHNoaWZ0O2lmKGNoYXJTaXplPT09Mil7ZGVjb2RlU3RyaW5nPVVURjE2VG9TdHJpbmc7ZW5jb2RlU3RyaW5nPXN0cmluZ1RvVVRGMTY7bGVuZ3RoQnl0ZXNVVEY9bGVuZ3RoQnl0ZXNVVEYxNjtnZXRIZWFwPSgpPT5IRUFQVTE2O3NoaWZ0PTE7fWVsc2UgaWYoY2hhclNpemU9PT00KXtkZWNvZGVTdHJpbmc9VVRGMzJUb1N0cmluZztlbmNvZGVTdHJpbmc9c3RyaW5nVG9VVEYzMjtsZW5ndGhCeXRlc1VURj1sZW5ndGhCeXRlc1VURjMyO2dldEhlYXA9KCk9PkhFQVBVMzI7c2hpZnQ9Mjt9cmVnaXN0ZXJUeXBlKHJhd1R5cGUse25hbWU6bmFtZSwiZnJvbVdpcmVUeXBlIjp2YWx1ZT0+e3ZhciBsZW5ndGg9SEVBUFUzMlt2YWx1ZT4+Ml07dmFyIEhFQVA9Z2V0SGVhcCgpO3ZhciBzdHI7dmFyIGRlY29kZVN0YXJ0UHRyPXZhbHVlKzQ7Zm9yKHZhciBpPTA7aTw9bGVuZ3RoOysraSl7dmFyIGN1cnJlbnRCeXRlUHRyPXZhbHVlKzQraSpjaGFyU2l6ZTtpZihpPT1sZW5ndGh8fEhFQVBbY3VycmVudEJ5dGVQdHI+PnNoaWZ0XT09MCl7dmFyIG1heFJlYWRCeXRlcz1jdXJyZW50Qnl0ZVB0ci1kZWNvZGVTdGFydFB0cjt2YXIgc3RyaW5nU2VnbWVudD1kZWNvZGVTdHJpbmcoZGVjb2RlU3RhcnRQdHIsbWF4UmVhZEJ5dGVzKTtpZihzdHI9PT11bmRlZmluZWQpe3N0cj1zdHJpbmdTZWdtZW50O31lbHNlIHtzdHIrPVN0cmluZy5mcm9tQ2hhckNvZGUoMCk7c3RyKz1zdHJpbmdTZWdtZW50O31kZWNvZGVTdGFydFB0cj1jdXJyZW50Qnl0ZVB0citjaGFyU2l6ZTt9fV9mcmVlKHZhbHVlKTtyZXR1cm4gc3RyfSwidG9XaXJlVHlwZSI6KGRlc3RydWN0b3JzLHZhbHVlKT0+e2lmKCEodHlwZW9mIHZhbHVlPT0ic3RyaW5nIikpe3Rocm93QmluZGluZ0Vycm9yKGBDYW5ub3QgcGFzcyBub24tc3RyaW5nIHRvIEMrKyBzdHJpbmcgdHlwZSAke25hbWV9YCk7fXZhciBsZW5ndGg9bGVuZ3RoQnl0ZXNVVEYodmFsdWUpO3ZhciBwdHI9X21hbGxvYyg0K2xlbmd0aCtjaGFyU2l6ZSk7SEVBUFUzMltwdHI+PjJdPWxlbmd0aD4+c2hpZnQ7ZW5jb2RlU3RyaW5nKHZhbHVlLHB0cis0LGxlbmd0aCtjaGFyU2l6ZSk7aWYoZGVzdHJ1Y3RvcnMhPT1udWxsKXtkZXN0cnVjdG9ycy5wdXNoKF9mcmVlLHB0cik7fXJldHVybiBwdHJ9LCJhcmdQYWNrQWR2YW5jZSI6R2VuZXJpY1dpcmVUeXBlU2l6ZSwicmVhZFZhbHVlRnJvbVBvaW50ZXIiOnNpbXBsZVJlYWRWYWx1ZUZyb21Qb2ludGVyLGRlc3RydWN0b3JGdW5jdGlvbihwdHIpe19mcmVlKHB0cik7fX0pO307dmFyIF9fZW1iaW5kX3JlZ2lzdGVyX3ZvaWQ9KHJhd1R5cGUsbmFtZSk9PntuYW1lPXJlYWRMYXRpbjFTdHJpbmcobmFtZSk7cmVnaXN0ZXJUeXBlKHJhd1R5cGUse2lzVm9pZDp0cnVlLG5hbWU6bmFtZSwiYXJnUGFja0FkdmFuY2UiOjAsImZyb21XaXJlVHlwZSI6KCk9PnVuZGVmaW5lZCwidG9XaXJlVHlwZSI6KGRlc3RydWN0b3JzLG8pPT51bmRlZmluZWR9KTt9O3ZhciBnZXRIZWFwTWF4PSgpPT4yMTQ3NDgzNjQ4O3ZhciBncm93TWVtb3J5PXNpemU9Pnt2YXIgYj13YXNtTWVtb3J5LmJ1ZmZlcjt2YXIgcGFnZXM9KHNpemUtYi5ieXRlTGVuZ3RoKzY1NTM1KS82NTUzNjt0cnl7d2FzbU1lbW9yeS5ncm93KHBhZ2VzKTt1cGRhdGVNZW1vcnlWaWV3cygpO3JldHVybiAxfWNhdGNoKGUpe319O3ZhciBfZW1zY3JpcHRlbl9yZXNpemVfaGVhcD1yZXF1ZXN0ZWRTaXplPT57dmFyIG9sZFNpemU9SEVBUFU4Lmxlbmd0aDtyZXF1ZXN0ZWRTaXplPj4+PTA7dmFyIG1heEhlYXBTaXplPWdldEhlYXBNYXgoKTtpZihyZXF1ZXN0ZWRTaXplPm1heEhlYXBTaXplKXtyZXR1cm4gZmFsc2V9dmFyIGFsaWduVXA9KHgsbXVsdGlwbGUpPT54KyhtdWx0aXBsZS14JW11bHRpcGxlKSVtdWx0aXBsZTtmb3IodmFyIGN1dERvd249MTtjdXREb3duPD00O2N1dERvd24qPTIpe3ZhciBvdmVyR3Jvd25IZWFwU2l6ZT1vbGRTaXplKigxKy4yL2N1dERvd24pO292ZXJHcm93bkhlYXBTaXplPU1hdGgubWluKG92ZXJHcm93bkhlYXBTaXplLHJlcXVlc3RlZFNpemUrMTAwNjYzMjk2KTt2YXIgbmV3U2l6ZT1NYXRoLm1pbihtYXhIZWFwU2l6ZSxhbGlnblVwKE1hdGgubWF4KHJlcXVlc3RlZFNpemUsb3Zlckdyb3duSGVhcFNpemUpLDY1NTM2KSk7dmFyIHJlcGxhY2VtZW50PWdyb3dNZW1vcnkobmV3U2l6ZSk7aWYocmVwbGFjZW1lbnQpe3JldHVybiB0cnVlfX1yZXR1cm4gZmFsc2V9O2VtYmluZF9pbml0X2NoYXJDb2RlcygpO0JpbmRpbmdFcnJvcj1Nb2R1bGVbIkJpbmRpbmdFcnJvciJdPWNsYXNzIEJpbmRpbmdFcnJvciBleHRlbmRzIEVycm9ye2NvbnN0cnVjdG9yKG1lc3NhZ2Upe3N1cGVyKG1lc3NhZ2UpO3RoaXMubmFtZT0iQmluZGluZ0Vycm9yIjt9fTtNb2R1bGVbIkludGVybmFsRXJyb3IiXT1jbGFzcyBJbnRlcm5hbEVycm9yIGV4dGVuZHMgRXJyb3J7Y29uc3RydWN0b3IobWVzc2FnZSl7c3VwZXIobWVzc2FnZSk7dGhpcy5uYW1lPSJJbnRlcm5hbEVycm9yIjt9fTtpbml0X2VtdmFsKCk7dmFyIHdhc21JbXBvcnRzPXtmOl9fZW1iaW5kX3JlZ2lzdGVyX2JpZ2ludCxpOl9fZW1iaW5kX3JlZ2lzdGVyX2Jvb2wsaDpfX2VtYmluZF9yZWdpc3Rlcl9lbXZhbCxlOl9fZW1iaW5kX3JlZ2lzdGVyX2Zsb2F0LGI6X19lbWJpbmRfcmVnaXN0ZXJfaW50ZWdlcixhOl9fZW1iaW5kX3JlZ2lzdGVyX21lbW9yeV92aWV3LGQ6X19lbWJpbmRfcmVnaXN0ZXJfc3RkX3N0cmluZyxjOl9fZW1iaW5kX3JlZ2lzdGVyX3N0ZF93c3RyaW5nLGo6X19lbWJpbmRfcmVnaXN0ZXJfdm9pZCxnOl9lbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwfTt2YXIgd2FzbUV4cG9ydHM9Y3JlYXRlV2FzbSgpO01vZHVsZVsiX3NvcnQiXT0oYTAsYTEsYTIsYTMsYTQsYTUsYTYsYTcsYTgsYTkpPT4oTW9kdWxlWyJfc29ydCJdPXdhc21FeHBvcnRzWyJtIl0pKGEwLGExLGEyLGEzLGE0LGE1LGE2LGE3LGE4LGE5KTt2YXIgX21hbGxvYz1Nb2R1bGVbIl9tYWxsb2MiXT1hMD0+KF9tYWxsb2M9TW9kdWxlWyJfbWFsbG9jIl09d2FzbUV4cG9ydHNbIm8iXSkoYTApO3ZhciBfZnJlZT1Nb2R1bGVbIl9mcmVlIl09YTA9PihfZnJlZT1Nb2R1bGVbIl9mcmVlIl09d2FzbUV4cG9ydHNbInAiXSkoYTApO3ZhciBjYWxsZWRSdW47ZGVwZW5kZW5jaWVzRnVsZmlsbGVkPWZ1bmN0aW9uIHJ1bkNhbGxlcigpe2lmKCFjYWxsZWRSdW4pcnVuKCk7aWYoIWNhbGxlZFJ1bilkZXBlbmRlbmNpZXNGdWxmaWxsZWQ9cnVuQ2FsbGVyO307ZnVuY3Rpb24gcnVuKCl7aWYocnVuRGVwZW5kZW5jaWVzPjApe3JldHVybn1wcmVSdW4oKTtpZihydW5EZXBlbmRlbmNpZXM+MCl7cmV0dXJufWZ1bmN0aW9uIGRvUnVuKCl7aWYoY2FsbGVkUnVuKXJldHVybjtjYWxsZWRSdW49dHJ1ZTtNb2R1bGVbImNhbGxlZFJ1biJdPXRydWU7aWYoQUJPUlQpcmV0dXJuO2luaXRSdW50aW1lKCk7cmVhZHlQcm9taXNlUmVzb2x2ZShNb2R1bGUpO2lmKE1vZHVsZVsib25SdW50aW1lSW5pdGlhbGl6ZWQiXSlNb2R1bGVbIm9uUnVudGltZUluaXRpYWxpemVkIl0oKTtwb3N0UnVuKCk7fWlmKE1vZHVsZVsic2V0U3RhdHVzIl0pe01vZHVsZVsic2V0U3RhdHVzIl0oIlJ1bm5pbmcuLi4iKTtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7c2V0VGltZW91dChmdW5jdGlvbigpe01vZHVsZVsic2V0U3RhdHVzIl0oIiIpO30sMSk7ZG9SdW4oKTt9LDEpO31lbHNlIHtkb1J1bigpO319aWYoTW9kdWxlWyJwcmVJbml0Il0pe2lmKHR5cGVvZiBNb2R1bGVbInByZUluaXQiXT09ImZ1bmN0aW9uIilNb2R1bGVbInByZUluaXQiXT1bTW9kdWxlWyJwcmVJbml0Il1dO3doaWxlKE1vZHVsZVsicHJlSW5pdCJdLmxlbmd0aD4wKXtNb2R1bGVbInByZUluaXQiXS5wb3AoKSgpO319cnVuKCk7CgoKICAgIHJldHVybiBtb2R1bGVBcmcucmVhZHkKICB9CiAgKTsKICB9KSgpOwoKICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueQogIGxldCB3YXNtTW9kdWxlOwogIGFzeW5jIGZ1bmN0aW9uIGluaXRXYXNtKCkgewogICAgICB3YXNtTW9kdWxlID0gYXdhaXQgbG9hZFdhc20oKTsKICB9CiAgbGV0IHNvcnREYXRhOwogIGxldCB2aWV3UHJvalB0cjsKICBsZXQgdHJhbnNmb3Jtc1B0cjsKICBsZXQgdHJhbnNmb3JtSW5kaWNlc1B0cjsKICBsZXQgcG9zaXRpb25zUHRyOwogIGxldCBjaHVua3NQdHI7CiAgbGV0IGRlcHRoQnVmZmVyUHRyOwogIGxldCBkZXB0aEluZGV4UHRyOwogIGxldCBzdGFydHNQdHI7CiAgbGV0IGNvdW50c1B0cjsKICBsZXQgYWxsb2NhdGVkVmVydGV4Q291bnQgPSAwOwogIGxldCBhbGxvY2F0ZWRUcmFuc2Zvcm1Db3VudCA9IDA7CiAgbGV0IHZpZXdQcm9qID0gbmV3IEZsb2F0MzJBcnJheSgxNik7CiAgbGV0IGxvY2sgPSBmYWxzZTsKICBsZXQgYWxsb2NhdGlvblBlbmRpbmcgPSBmYWxzZTsKICBsZXQgc29ydGluZyA9IGZhbHNlOwogIGNvbnN0IGFsbG9jYXRlQnVmZmVycyA9IGFzeW5jICgpID0+IHsKICAgICAgaWYgKGxvY2spIHsKICAgICAgICAgIGFsbG9jYXRpb25QZW5kaW5nID0gdHJ1ZTsKICAgICAgICAgIHJldHVybjsKICAgICAgfQogICAgICBsb2NrID0gdHJ1ZTsKICAgICAgYWxsb2NhdGlvblBlbmRpbmcgPSBmYWxzZTsKICAgICAgaWYgKCF3YXNtTW9kdWxlKQogICAgICAgICAgYXdhaXQgaW5pdFdhc20oKTsKICAgICAgY29uc3QgdGFyZ2V0QWxsb2NhdGVkVmVydGV4Q291bnQgPSBNYXRoLnBvdygyLCBNYXRoLmNlaWwoTWF0aC5sb2cyKHNvcnREYXRhLnZlcnRleENvdW50KSkpOwogICAgICBpZiAoYWxsb2NhdGVkVmVydGV4Q291bnQgPCB0YXJnZXRBbGxvY2F0ZWRWZXJ0ZXhDb3VudCkgewogICAgICAgICAgaWYgKGFsbG9jYXRlZFZlcnRleENvdW50ID4gMCkgewogICAgICAgICAgICAgIHdhc21Nb2R1bGUuX2ZyZWUodmlld1Byb2pQdHIpOwogICAgICAgICAgICAgIHdhc21Nb2R1bGUuX2ZyZWUodHJhbnNmb3JtSW5kaWNlc1B0cik7CiAgICAgICAgICAgICAgd2FzbU1vZHVsZS5fZnJlZShwb3NpdGlvbnNQdHIpOwogICAgICAgICAgICAgIHdhc21Nb2R1bGUuX2ZyZWUoY2h1bmtzUHRyKTsKICAgICAgICAgICAgICB3YXNtTW9kdWxlLl9mcmVlKGRlcHRoQnVmZmVyUHRyKTsKICAgICAgICAgICAgICB3YXNtTW9kdWxlLl9mcmVlKGRlcHRoSW5kZXhQdHIpOwogICAgICAgICAgICAgIHdhc21Nb2R1bGUuX2ZyZWUoc3RhcnRzUHRyKTsKICAgICAgICAgICAgICB3YXNtTW9kdWxlLl9mcmVlKGNvdW50c1B0cik7CiAgICAgICAgICB9CiAgICAgICAgICBhbGxvY2F0ZWRWZXJ0ZXhDb3VudCA9IHRhcmdldEFsbG9jYXRlZFZlcnRleENvdW50OwogICAgICAgICAgdmlld1Byb2pQdHIgPSB3YXNtTW9kdWxlLl9tYWxsb2MoMTYgKiA0KTsKICAgICAgICAgIHRyYW5zZm9ybUluZGljZXNQdHIgPSB3YXNtTW9kdWxlLl9tYWxsb2MoYWxsb2NhdGVkVmVydGV4Q291bnQgKiA0KTsKICAgICAgICAgIHBvc2l0aW9uc1B0ciA9IHdhc21Nb2R1bGUuX21hbGxvYygzICogYWxsb2NhdGVkVmVydGV4Q291bnQgKiA0KTsKICAgICAgICAgIGNodW5rc1B0ciA9IHdhc21Nb2R1bGUuX21hbGxvYyhhbGxvY2F0ZWRWZXJ0ZXhDb3VudCk7CiAgICAgICAgICBkZXB0aEJ1ZmZlclB0ciA9IHdhc21Nb2R1bGUuX21hbGxvYyhhbGxvY2F0ZWRWZXJ0ZXhDb3VudCAqIDQpOwogICAgICAgICAgZGVwdGhJbmRleFB0ciA9IHdhc21Nb2R1bGUuX21hbGxvYyhhbGxvY2F0ZWRWZXJ0ZXhDb3VudCAqIDQpOwogICAgICAgICAgc3RhcnRzUHRyID0gd2FzbU1vZHVsZS5fbWFsbG9jKGFsbG9jYXRlZFZlcnRleENvdW50ICogNCk7CiAgICAgICAgICBjb3VudHNQdHIgPSB3YXNtTW9kdWxlLl9tYWxsb2MoYWxsb2NhdGVkVmVydGV4Q291bnQgKiA0KTsKICAgICAgfQogICAgICBpZiAoYWxsb2NhdGVkVHJhbnNmb3JtQ291bnQgPCBzb3J0RGF0YS50cmFuc2Zvcm1zLmxlbmd0aCkgewogICAgICAgICAgaWYgKGFsbG9jYXRlZFRyYW5zZm9ybUNvdW50ID4gMCkgewogICAgICAgICAgICAgIHdhc21Nb2R1bGUuX2ZyZWUodHJhbnNmb3Jtc1B0cik7CiAgICAgICAgICB9CiAgICAgICAgICBhbGxvY2F0ZWRUcmFuc2Zvcm1Db3VudCA9IHNvcnREYXRhLnRyYW5zZm9ybXMubGVuZ3RoOwogICAgICAgICAgdHJhbnNmb3Jtc1B0ciA9IHdhc21Nb2R1bGUuX21hbGxvYyhhbGxvY2F0ZWRUcmFuc2Zvcm1Db3VudCAqIDQpOwogICAgICB9CiAgICAgIGxvY2sgPSBmYWxzZTsKICAgICAgaWYgKGFsbG9jYXRpb25QZW5kaW5nKSB7CiAgICAgICAgICBhbGxvY2F0aW9uUGVuZGluZyA9IGZhbHNlOwogICAgICAgICAgYXdhaXQgYWxsb2NhdGVCdWZmZXJzKCk7CiAgICAgIH0KICB9OwogIGNvbnN0IHJ1blNvcnQgPSAoKSA9PiB7CiAgICAgIGlmIChsb2NrIHx8IGFsbG9jYXRpb25QZW5kaW5nIHx8ICF3YXNtTW9kdWxlKQogICAgICAgICAgcmV0dXJuOwogICAgICBsb2NrID0gdHJ1ZTsKICAgICAgd2FzbU1vZHVsZS5IRUFQRjMyLnNldChzb3J0RGF0YS5wb3NpdGlvbnMsIHBvc2l0aW9uc1B0ciAvIDQpOwogICAgICB3YXNtTW9kdWxlLkhFQVBGMzIuc2V0KHNvcnREYXRhLnRyYW5zZm9ybXMsIHRyYW5zZm9ybXNQdHIgLyA0KTsKICAgICAgd2FzbU1vZHVsZS5IRUFQVTMyLnNldChzb3J0RGF0YS50cmFuc2Zvcm1JbmRpY2VzLCB0cmFuc2Zvcm1JbmRpY2VzUHRyIC8gNCk7CiAgICAgIHdhc21Nb2R1bGUuSEVBUEYzMi5zZXQodmlld1Byb2osIHZpZXdQcm9qUHRyIC8gNCk7CiAgICAgIHdhc21Nb2R1bGUuX3NvcnQodmlld1Byb2pQdHIsIHRyYW5zZm9ybXNQdHIsIHRyYW5zZm9ybUluZGljZXNQdHIsIHNvcnREYXRhLnZlcnRleENvdW50LCBwb3NpdGlvbnNQdHIsIGNodW5rc1B0ciwgZGVwdGhCdWZmZXJQdHIsIGRlcHRoSW5kZXhQdHIsIHN0YXJ0c1B0ciwgY291bnRzUHRyKTsKICAgICAgY29uc3QgZGVwdGhJbmRleCA9IG5ldyBVaW50MzJBcnJheSh3YXNtTW9kdWxlLkhFQVBVMzIuYnVmZmVyLCBkZXB0aEluZGV4UHRyLCBzb3J0RGF0YS52ZXJ0ZXhDb3VudCk7CiAgICAgIGNvbnN0IGRldGFjaGVkRGVwdGhJbmRleCA9IG5ldyBVaW50MzJBcnJheShkZXB0aEluZGV4LnNsaWNlKCkuYnVmZmVyKTsKICAgICAgY29uc3QgY2h1bmtzID0gbmV3IFVpbnQ4QXJyYXkod2FzbU1vZHVsZS5IRUFQVTguYnVmZmVyLCBjaHVua3NQdHIsIHNvcnREYXRhLnZlcnRleENvdW50KTsKICAgICAgY29uc3QgZGV0YWNoZWRDaHVua3MgPSBuZXcgVWludDhBcnJheShjaHVua3Muc2xpY2UoKS5idWZmZXIpOwogICAgICBzZWxmLnBvc3RNZXNzYWdlKHsgZGVwdGhJbmRleDogZGV0YWNoZWREZXB0aEluZGV4LCBjaHVua3M6IGRldGFjaGVkQ2h1bmtzIH0sIFsKICAgICAgICAgIGRldGFjaGVkRGVwdGhJbmRleC5idWZmZXIsCiAgICAgICAgICBkZXRhY2hlZENodW5rcy5idWZmZXIsCiAgICAgIF0pOwogICAgICBsb2NrID0gZmFsc2U7CiAgfTsKICBjb25zdCB0aHJvdHRsZWRTb3J0ID0gKCkgPT4gewogICAgICBpZiAoIXNvcnRpbmcpIHsKICAgICAgICAgIHNvcnRpbmcgPSB0cnVlOwogICAgICAgICAgcnVuU29ydCgpOwogICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7CiAgICAgICAgICAgICAgc29ydGluZyA9IGZhbHNlOwogICAgICAgICAgICAgIHRocm90dGxlZFNvcnQoKTsKICAgICAgICAgIH0pOwogICAgICB9CiAgfTsKICBzZWxmLm9ubWVzc2FnZSA9IChlKSA9PiB7CiAgICAgIGlmIChlLmRhdGEuc29ydERhdGEpIHsKICAgICAgICAgIHNvcnREYXRhID0gewogICAgICAgICAgICAgIHBvc2l0aW9uczogRmxvYXQzMkFycmF5LmZyb20oZS5kYXRhLnNvcnREYXRhLnBvc2l0aW9ucyksCiAgICAgICAgICAgICAgdHJhbnNmb3JtczogRmxvYXQzMkFycmF5LmZyb20oZS5kYXRhLnNvcnREYXRhLnRyYW5zZm9ybXMpLAogICAgICAgICAgICAgIHRyYW5zZm9ybUluZGljZXM6IFVpbnQzMkFycmF5LmZyb20oZS5kYXRhLnNvcnREYXRhLnRyYW5zZm9ybUluZGljZXMpLAogICAgICAgICAgICAgIHZlcnRleENvdW50OiBlLmRhdGEuc29ydERhdGEudmVydGV4Q291bnQsCiAgICAgICAgICB9OwogICAgICAgICAgYWxsb2NhdGVCdWZmZXJzKCk7CiAgICAgIH0KICAgICAgaWYgKGUuZGF0YS52aWV3UHJvaikgewogICAgICAgICAgdmlld1Byb2ogPSBGbG9hdDMyQXJyYXkuZnJvbShlLmRhdGEudmlld1Byb2opOwogICAgICAgICAgdGhyb3R0bGVkU29ydCgpOwogICAgICB9CiAgfTsKCn0pKCk7Ci8vIyBzb3VyY2VNYXBwaW5nVVJMPVNvcnRXb3JrZXIuanMubWFwCgo=',
  null,
  !1,
)
class s {
  constructor(A, Q) {
    ;(this._scene = null),
      (this._camera = null),
      (this._started = !1),
      (this._initialized = !1),
      (this._renderer = A)
    const F = A.gl
    ;(this._program = F.createProgram()), (this._passes = Q || [])
    const U = F.createShader(F.VERTEX_SHADER)
    F.shaderSource(U, this._getVertexSource()),
      F.compileShader(U),
      F.getShaderParameter(U, F.COMPILE_STATUS) ||
        console.error(F.getShaderInfoLog(U))
    const l = F.createShader(F.FRAGMENT_SHADER)
    F.shaderSource(l, this._getFragmentSource()),
      F.compileShader(l),
      F.getShaderParameter(l, F.COMPILE_STATUS) ||
        console.error(F.getShaderInfoLog(l)),
      F.attachShader(this.program, U),
      F.attachShader(this.program, l),
      F.linkProgram(this.program),
      F.getProgramParameter(this.program, F.LINK_STATUS) ||
        console.error(F.getProgramInfoLog(this.program)),
      (this.resize = () => {
        F.useProgram(this._program), this._resize()
      }),
      (this.initialize = () => {
        console.assert(!this._initialized, 'ShaderProgram already initialized'),
          F.useProgram(this._program),
          this._initialize()
        for (const A of this.passes) A.initialize(this)
        ;(this._initialized = !0), (this._started = !0)
      }),
      (this.render = (A, Q) => {
        F.useProgram(this._program),
          (this._scene === A && this._camera === Q) ||
            (this.dispose(),
            (this._scene = A),
            (this._camera = Q),
            this.initialize())
        for (const A of this.passes) A.render()
        this._render()
      }),
      (this.dispose = () => {
        if (this._initialized) {
          F.useProgram(this._program)
          for (const A of this.passes) A.dispose()
          this._dispose(),
            (this._scene = null),
            (this._camera = null),
            (this._initialized = !1)
        }
      })
  }
  get renderer() {
    return this._renderer
  }
  get scene() {
    return this._scene
  }
  get camera() {
    return this._camera
  }
  get program() {
    return this._program
  }
  get passes() {
    return this._passes
  }
  get started() {
    return this._started
  }
}
var o = W(
    'Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwooZnVuY3Rpb24gKCkgewogICd1c2Ugc3RyaWN0JzsKCiAgdmFyIGxvYWRXYXNtID0gKCgpID0+IHsKICAgIAogICAgcmV0dXJuICgKICBmdW5jdGlvbihtb2R1bGVBcmcgPSB7fSkgewoKICB2YXIgTW9kdWxlPW1vZHVsZUFyZzt2YXIgcmVhZHlQcm9taXNlUmVzb2x2ZSxyZWFkeVByb21pc2VSZWplY3Q7TW9kdWxlWyJyZWFkeSJdPW5ldyBQcm9taXNlKChyZXNvbHZlLHJlamVjdCk9PntyZWFkeVByb21pc2VSZXNvbHZlPXJlc29sdmU7cmVhZHlQcm9taXNlUmVqZWN0PXJlamVjdDt9KTt2YXIgbW9kdWxlT3ZlcnJpZGVzPU9iamVjdC5hc3NpZ24oe30sTW9kdWxlKTt2YXIgc2NyaXB0RGlyZWN0b3J5PSIiO2Z1bmN0aW9uIGxvY2F0ZUZpbGUocGF0aCl7aWYoTW9kdWxlWyJsb2NhdGVGaWxlIl0pe3JldHVybiBNb2R1bGVbImxvY2F0ZUZpbGUiXShwYXRoLHNjcmlwdERpcmVjdG9yeSl9cmV0dXJuIHNjcmlwdERpcmVjdG9yeStwYXRofXZhciByZWFkQmluYXJ5O3t7c2NyaXB0RGlyZWN0b3J5PXNlbGYubG9jYXRpb24uaHJlZjt9aWYoc2NyaXB0RGlyZWN0b3J5LmluZGV4T2YoImJsb2I6IikhPT0wKXtzY3JpcHREaXJlY3Rvcnk9c2NyaXB0RGlyZWN0b3J5LnN1YnN0cigwLHNjcmlwdERpcmVjdG9yeS5yZXBsYWNlKC9bPyNdLiovLCIiKS5sYXN0SW5kZXhPZigiLyIpKzEpO31lbHNlIHtzY3JpcHREaXJlY3Rvcnk9IiI7fXt7cmVhZEJpbmFyeT11cmw9Pnt2YXIgeGhyPW5ldyBYTUxIdHRwUmVxdWVzdDt4aHIub3BlbigiR0VUIix1cmwsZmFsc2UpO3hoci5yZXNwb25zZVR5cGU9ImFycmF5YnVmZmVyIjt4aHIuc2VuZChudWxsKTtyZXR1cm4gbmV3IFVpbnQ4QXJyYXkoeGhyLnJlc3BvbnNlKX07fX19TW9kdWxlWyJwcmludCJdfHxjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpO3ZhciBlcnI9TW9kdWxlWyJwcmludEVyciJdfHxjb25zb2xlLmVycm9yLmJpbmQoY29uc29sZSk7T2JqZWN0LmFzc2lnbihNb2R1bGUsbW9kdWxlT3ZlcnJpZGVzKTttb2R1bGVPdmVycmlkZXM9bnVsbDtpZihNb2R1bGVbImFyZ3VtZW50cyJdKU1vZHVsZVsiYXJndW1lbnRzIl07aWYoTW9kdWxlWyJ0aGlzUHJvZ3JhbSJdKU1vZHVsZVsidGhpc1Byb2dyYW0iXTtpZihNb2R1bGVbInF1aXQiXSlNb2R1bGVbInF1aXQiXTt2YXIgd2FzbUJpbmFyeTtpZihNb2R1bGVbIndhc21CaW5hcnkiXSl3YXNtQmluYXJ5PU1vZHVsZVsid2FzbUJpbmFyeSJdO2lmKHR5cGVvZiBXZWJBc3NlbWJseSE9Im9iamVjdCIpe2Fib3J0KCJubyBuYXRpdmUgd2FzbSBzdXBwb3J0IGRldGVjdGVkIik7fWZ1bmN0aW9uIGludEFycmF5RnJvbUJhc2U2NChzKXt2YXIgZGVjb2RlZD1hdG9iKHMpO3ZhciBieXRlcz1uZXcgVWludDhBcnJheShkZWNvZGVkLmxlbmd0aCk7Zm9yKHZhciBpPTA7aTxkZWNvZGVkLmxlbmd0aDsrK2kpe2J5dGVzW2ldPWRlY29kZWQuY2hhckNvZGVBdChpKTt9cmV0dXJuIGJ5dGVzfWZ1bmN0aW9uIHRyeVBhcnNlQXNEYXRhVVJJKGZpbGVuYW1lKXtpZighaXNEYXRhVVJJKGZpbGVuYW1lKSl7cmV0dXJufXJldHVybiBpbnRBcnJheUZyb21CYXNlNjQoZmlsZW5hbWUuc2xpY2UoZGF0YVVSSVByZWZpeC5sZW5ndGgpKX12YXIgd2FzbU1lbW9yeTt2YXIgQUJPUlQ9ZmFsc2U7dmFyIEhFQVA4LEhFQVBVOCxIRUFQMTYsSEVBUFUxNixIRUFQMzIsSEVBUFUzMixIRUFQRjMyLEhFQVBGNjQ7ZnVuY3Rpb24gdXBkYXRlTWVtb3J5Vmlld3MoKXt2YXIgYj13YXNtTWVtb3J5LmJ1ZmZlcjtNb2R1bGVbIkhFQVA4Il09SEVBUDg9bmV3IEludDhBcnJheShiKTtNb2R1bGVbIkhFQVAxNiJdPUhFQVAxNj1uZXcgSW50MTZBcnJheShiKTtNb2R1bGVbIkhFQVBVOCJdPUhFQVBVOD1uZXcgVWludDhBcnJheShiKTtNb2R1bGVbIkhFQVBVMTYiXT1IRUFQVTE2PW5ldyBVaW50MTZBcnJheShiKTtNb2R1bGVbIkhFQVAzMiJdPUhFQVAzMj1uZXcgSW50MzJBcnJheShiKTtNb2R1bGVbIkhFQVBVMzIiXT1IRUFQVTMyPW5ldyBVaW50MzJBcnJheShiKTtNb2R1bGVbIkhFQVBGMzIiXT1IRUFQRjMyPW5ldyBGbG9hdDMyQXJyYXkoYik7TW9kdWxlWyJIRUFQRjY0Il09SEVBUEY2ND1uZXcgRmxvYXQ2NEFycmF5KGIpO312YXIgX19BVFBSRVJVTl9fPVtdO3ZhciBfX0FUSU5JVF9fPVtdO3ZhciBfX0FUUE9TVFJVTl9fPVtdO2Z1bmN0aW9uIHByZVJ1bigpe2lmKE1vZHVsZVsicHJlUnVuIl0pe2lmKHR5cGVvZiBNb2R1bGVbInByZVJ1biJdPT0iZnVuY3Rpb24iKU1vZHVsZVsicHJlUnVuIl09W01vZHVsZVsicHJlUnVuIl1dO3doaWxlKE1vZHVsZVsicHJlUnVuIl0ubGVuZ3RoKXthZGRPblByZVJ1bihNb2R1bGVbInByZVJ1biJdLnNoaWZ0KCkpO319Y2FsbFJ1bnRpbWVDYWxsYmFja3MoX19BVFBSRVJVTl9fKTt9ZnVuY3Rpb24gaW5pdFJ1bnRpbWUoKXtjYWxsUnVudGltZUNhbGxiYWNrcyhfX0FUSU5JVF9fKTt9ZnVuY3Rpb24gcG9zdFJ1bigpe2lmKE1vZHVsZVsicG9zdFJ1biJdKXtpZih0eXBlb2YgTW9kdWxlWyJwb3N0UnVuIl09PSJmdW5jdGlvbiIpTW9kdWxlWyJwb3N0UnVuIl09W01vZHVsZVsicG9zdFJ1biJdXTt3aGlsZShNb2R1bGVbInBvc3RSdW4iXS5sZW5ndGgpe2FkZE9uUG9zdFJ1bihNb2R1bGVbInBvc3RSdW4iXS5zaGlmdCgpKTt9fWNhbGxSdW50aW1lQ2FsbGJhY2tzKF9fQVRQT1NUUlVOX18pO31mdW5jdGlvbiBhZGRPblByZVJ1bihjYil7X19BVFBSRVJVTl9fLnVuc2hpZnQoY2IpO31mdW5jdGlvbiBhZGRPbkluaXQoY2Ipe19fQVRJTklUX18udW5zaGlmdChjYik7fWZ1bmN0aW9uIGFkZE9uUG9zdFJ1bihjYil7X19BVFBPU1RSVU5fXy51bnNoaWZ0KGNiKTt9dmFyIHJ1bkRlcGVuZGVuY2llcz0wO3ZhciBkZXBlbmRlbmNpZXNGdWxmaWxsZWQ9bnVsbDtmdW5jdGlvbiBhZGRSdW5EZXBlbmRlbmN5KGlkKXtydW5EZXBlbmRlbmNpZXMrKztNb2R1bGVbIm1vbml0b3JSdW5EZXBlbmRlbmNpZXMiXT8uKHJ1bkRlcGVuZGVuY2llcyk7fWZ1bmN0aW9uIHJlbW92ZVJ1bkRlcGVuZGVuY3koaWQpe3J1bkRlcGVuZGVuY2llcy0tO01vZHVsZVsibW9uaXRvclJ1bkRlcGVuZGVuY2llcyJdPy4ocnVuRGVwZW5kZW5jaWVzKTtpZihydW5EZXBlbmRlbmNpZXM9PTApe2lmKGRlcGVuZGVuY2llc0Z1bGZpbGxlZCl7dmFyIGNhbGxiYWNrPWRlcGVuZGVuY2llc0Z1bGZpbGxlZDtkZXBlbmRlbmNpZXNGdWxmaWxsZWQ9bnVsbDtjYWxsYmFjaygpO319fWZ1bmN0aW9uIGFib3J0KHdoYXQpe01vZHVsZVsib25BYm9ydCJdPy4od2hhdCk7d2hhdD0iQWJvcnRlZCgiK3doYXQrIikiO2Vycih3aGF0KTtBQk9SVD10cnVlO3doYXQrPSIuIEJ1aWxkIHdpdGggLXNBU1NFUlRJT05TIGZvciBtb3JlIGluZm8uIjt2YXIgZT1uZXcgV2ViQXNzZW1ibHkuUnVudGltZUVycm9yKHdoYXQpO3JlYWR5UHJvbWlzZVJlamVjdChlKTt0aHJvdyBlfXZhciBkYXRhVVJJUHJlZml4PSJkYXRhOmFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbTtiYXNlNjQsIjt2YXIgaXNEYXRhVVJJPWZpbGVuYW1lPT5maWxlbmFtZS5zdGFydHNXaXRoKGRhdGFVUklQcmVmaXgpO3ZhciB3YXNtQmluYXJ5RmlsZTt3YXNtQmluYXJ5RmlsZT0iZGF0YTphcHBsaWNhdGlvbi9vY3RldC1zdHJlYW07YmFzZTY0LEFHRnpiUUVBQUFBQlp3OWdCSDkvZjM4QVlBTi9mMzhBWUFWL2YzOS9md0JnQm45L2YzOS9md0JnQVg4QmYyQUJmd0JnQW45L0FHQURmMzkvQVg5Z0FBQmdCMzkvZjM5L2YzOEFZQUo5ZlFGL1lBUi9mMzUrQUdBQmZRRi9ZQXQvZjM5L2YzOS9mMzkvZndCZ0FuOS9BWDhDUFFvQllRRmhBQUVCWVFGaUFBSUJZUUZqQUFFQllRRmtBQVlCWVFGbEFBRUJZUUZtQUFrQllRRm5BQVFCWVFGb0FBVUJZUUZwQUFBQllRRnFBQVlER3hvSEJBb0ZDQVVHQ0FzQkFBRUZEQVFFRFFNREFnSUFBQTRIQndRRkFYQUJFQkFGQndFQmdBS0FnQUlHQ0FGL0FVR3duZ1FMQnhrR0FXc0NBQUZzQUE0QmJRQWFBVzRCQUFGdkFCa0JjQUFQQ1JVQkFFRUJDdzhSR0EwV0ZpTU5JaHNkSUEwY0hoOEswVkFhY1FFQmZ5QUNSUVJBSUFBb0FnUWdBU2dDQkVZUEN5QUFJQUZHQkVCQkFROExBa0FnQUNnQ0JDSUNMUUFBSWdCRklBQWdBU2dDQkNJQkxRQUFJZ05IY2cwQUEwQWdBUzBBQVNFRElBSXRBQUVpQUVVTkFTQUJRUUZxSVFFZ0FrRUJhaUVDSUFBZ0EwWU5BQXNMSUFBZ0EwWUxUd0VDZjBHb0dpZ0NBQ0lCSUFCQkIycEJlSEVpQW1vaEFBSkFJQUpCQUNBQUlBRk5HMFVFUUNBQVB3QkJFSFJORFFFZ0FCQUdEUUVMUWJnYVFUQTJBZ0JCZnc4TFFhZ2FJQUEyQWdBZ0FRc09BQ0FBRUJjZ0FSQVhRUkIwY2dzR0FDQUFFQThMS1FCQnNCcEJBVFlDQUVHMEdrRUFOZ0lBRUJGQnRCcEJyQm9vQWdBMkFnQkJyQnBCc0JvMkFnQUwwZ3NCQjM4Q1FDQUFSUTBBSUFCQkNHc2lBaUFBUVFScktBSUFJZ0ZCZUhFaUFHb2hCUUpBSUFGQkFYRU5BQ0FCUVFKeFJRMEJJQUlnQWlnQ0FDSUJheUlDUWN3YUtBSUFTUTBCSUFBZ0FXb2hBQUpBQWtCQjBCb29BZ0FnQWtjRVFDQUJRZjhCVFFSQUlBRkJBM1loQkNBQ0tBSU1JZ0VnQWlnQ0NDSURSZ1JBUWJ3YVFid2FLQUlBUVg0Z0JIZHhOZ0lBREFVTElBTWdBVFlDRENBQklBTTJBZ2dNQkFzZ0FpZ0NHQ0VHSUFJZ0FpZ0NEQ0lCUndSQUlBSW9BZ2dpQXlBQk5nSU1JQUVnQXpZQ0NBd0RDeUFDUVJScUlnUW9BZ0FpQTBVRVFDQUNLQUlRSWdORkRRSWdBa0VRYWlFRUN3TkFJQVFoQnlBRElnRkJGR29pQkNnQ0FDSUREUUFnQVVFUWFpRUVJQUVvQWhBaUF3MEFDeUFIUVFBMkFnQU1BZ3NnQlNnQ0JDSUJRUU54UVFOSERRSkJ4Qm9nQURZQ0FDQUZJQUZCZm5FMkFnUWdBaUFBUVFGeU5nSUVJQVVnQURZQ0FBOExRUUFoQVFzZ0JrVU5BQUpBSUFJb0Fod2lBMEVDZEVIc0hHb2lCQ2dDQUNBQ1JnUkFJQVFnQVRZQ0FDQUJEUUZCd0JwQndCb29BZ0JCZmlBRGQzRTJBZ0FNQWdzZ0JrRVFRUlFnQmlnQ0VDQUNSaHRxSUFFMkFnQWdBVVVOQVFzZ0FTQUdOZ0lZSUFJb0FoQWlBd1JBSUFFZ0F6WUNFQ0FESUFFMkFoZ0xJQUlvQWhRaUEwVU5BQ0FCSUFNMkFoUWdBeUFCTmdJWUN5QUNJQVZQRFFBZ0JTZ0NCQ0lCUVFGeFJRMEFBa0FDUUFKQUFrQWdBVUVDY1VVRVFFSFVHaWdDQUNBRlJnUkFRZFFhSUFJMkFnQkJ5QnBCeUJvb0FnQWdBR29pQURZQ0FDQUNJQUJCQVhJMkFnUWdBa0hRR2lnQ0FFY05Ca0hFR2tFQU5nSUFRZEFhUVFBMkFnQVBDMEhRR2lnQ0FDQUZSZ1JBUWRBYUlBSTJBZ0JCeEJwQnhCb29BZ0FnQUdvaUFEWUNBQ0FDSUFCQkFYSTJBZ1FnQUNBQ2FpQUFOZ0lBRHdzZ0FVRjRjU0FBYWlFQUlBRkIvd0ZOQkVBZ0FVRURkaUVFSUFVb0Fnd2lBU0FGS0FJSUlnTkdCRUJCdkJwQnZCb29BZ0JCZmlBRWQzRTJBZ0FNQlFzZ0F5QUJOZ0lNSUFFZ0F6WUNDQXdFQ3lBRktBSVlJUVlnQlNBRktBSU1JZ0ZIQkVCQnpCb29BZ0FhSUFVb0FnZ2lBeUFCTmdJTUlBRWdBellDQ0F3REN5QUZRUlJxSWdRb0FnQWlBMFVFUUNBRktBSVFJZ05GRFFJZ0JVRVFhaUVFQ3dOQUlBUWhCeUFESWdGQkZHb2lCQ2dDQUNJRERRQWdBVUVRYWlFRUlBRW9BaEFpQXcwQUN5QUhRUUEyQWdBTUFnc2dCU0FCUVg1eE5nSUVJQUlnQUVFQmNqWUNCQ0FBSUFKcUlBQTJBZ0FNQXd0QkFDRUJDeUFHUlEwQUFrQWdCU2dDSENJRFFRSjBRZXdjYWlJRUtBSUFJQVZHQkVBZ0JDQUJOZ0lBSUFFTkFVSEFHa0hBR2lnQ0FFRitJQU4zY1RZQ0FBd0NDeUFHUVJCQkZDQUdLQUlRSUFWR0cyb2dBVFlDQUNBQlJRMEJDeUFCSUFZMkFoZ2dCU2dDRUNJREJFQWdBU0FETmdJUUlBTWdBVFlDR0FzZ0JTZ0NGQ0lEUlEwQUlBRWdBellDRkNBRElBRTJBaGdMSUFJZ0FFRUJjallDQkNBQUlBSnFJQUEyQWdBZ0FrSFFHaWdDQUVjTkFFSEVHaUFBTmdJQUR3c2dBRUgvQVUwRVFDQUFRWGh4UWVRYWFpRUJBbjlCdkJvb0FnQWlBMEVCSUFCQkEzWjBJZ0J4UlFSQVFid2FJQUFnQTNJMkFnQWdBUXdCQ3lBQktBSUlDeUVBSUFFZ0FqWUNDQ0FBSUFJMkFnd2dBaUFCTmdJTUlBSWdBRFlDQ0E4TFFSOGhBeUFBUWYvLy93ZE5CRUFnQUVFbUlBQkJDSFpuSWdGcmRrRUJjU0FCUVFGMGEwRSthaUVEQ3lBQ0lBTTJBaHdnQWtJQU53SVFJQU5CQW5SQjdCeHFJUUVDUUFKQUFrQkJ3Qm9vQWdBaUJFRUJJQU4wSWdkeFJRUkFRY0FhSUFRZ0IzSTJBZ0FnQVNBQ05nSUFJQUlnQVRZQ0dBd0JDeUFBUVJrZ0EwRUJkbXRCQUNBRFFSOUhHM1FoQXlBQktBSUFJUUVEUUNBQklnUW9BZ1JCZUhFZ0FFWU5BaUFEUVIxMklRRWdBMEVCZENFRElBUWdBVUVFY1dvaUIwRVFhaWdDQUNJQkRRQUxJQWNnQWpZQ0VDQUNJQVEyQWhnTElBSWdBallDRENBQ0lBSTJBZ2dNQVFzZ0JDZ0NDQ0lBSUFJMkFnd2dCQ0FDTmdJSUlBSkJBRFlDR0NBQ0lBUTJBZ3dnQWlBQU5nSUlDMEhjR2tIY0dpZ0NBRUVCYXlJQVFYOGdBQnMyQWdBTEN5RUFJQUVFUUFOQUlBQkJBRG9BQUNBQVFRRnFJUUFnQVVFQmF5SUJEUUFMQ3d2ZUF3QkIzQmRCaWdrUUNVSG9GMEc1Q0VFQlFRQVFDRUgwRjBHMENFRUJRWUIvUWY4QUVBRkJqQmhCclFoQkFVR0FmMEgvQUJBQlFZQVlRYXNJUVFGQkFFSC9BUkFCUVpnWVFZa0lRUUpCZ0lCK1FmLy9BUkFCUWFRWVFZQUlRUUpCQUVILy93TVFBVUd3R0VHWUNFRUVRWUNBZ0lCNFFmLy8vLzhIRUFGQnZCaEJqd2hCQkVFQVFYOFFBVUhJR0VISENFRUVRWUNBZ0lCNFFmLy8vLzhIRUFGQjFCaEJ2Z2hCQkVFQVFYOFFBVUhnR0VHakNFS0FnSUNBZ0lDQWdJQi9Rdi8vLy8vLy8vLy8vd0FRRWtIc0dFR2lDRUlBUW44UUVrSDRHRUdjQ0VFRUVBUkJoQmxCZ3dsQkNCQUVRZlFPUWRrSUVBTkJ2QTlCaHcwUUEwR0VFRUVFUWN3SUVBSkIwQkJCQWtIbENCQUNRWndSUVFSQjlBZ1FBa0c0RVJBSFFlQVJRUUJCd2d3UUFFR0lFa0VBUWFnTkVBQkJzQkpCQVVIZ0RCQUFRZGdTUVFKQmp3a1FBRUdBRTBFRFFhNEpFQUJCcUJOQkJFSFdDUkFBUWRBVFFRVkI4d2tRQUVINEUwRUVRYzBORUFCQm9CUkJCVUhyRFJBQVFZZ1NRUUJCMlFvUUFFR3dFa0VCUWJnS0VBQkIyQkpCQWtHYkN4QUFRWUFUUVFOQitRb1FBRUdvRTBFRVFhRU1FQUJCMEJOQkJVSC9DeEFBUWNnVVFRaEIzZ3NRQUVId0ZFRUpRYndMRUFCQm1CVkJCa0daQ2hBQVFjQVZRUWRCa2c0UUFBc2NBQ0FBSUFGQkNDQUNweUFDUWlDSXB5QURweUFEUWlDSXB4QUZDeUFBQWtBZ0FDZ0NCQ0FCUncwQUlBQW9BaHhCQVVZTkFDQUFJQUkyQWh3TEM1b0JBQ0FBUVFFNkFEVUNRQ0FBS0FJRUlBSkhEUUFnQUVFQk9nQTBBa0FnQUNnQ0VDSUNSUVJBSUFCQkFUWUNKQ0FBSUFNMkFoZ2dBQ0FCTmdJUUlBTkJBVWNOQWlBQUtBSXdRUUZHRFFFTUFnc2dBU0FDUmdSQUlBQW9BaGdpQWtFQ1JnUkFJQUFnQXpZQ0dDQURJUUlMSUFBb0FqQkJBVWNOQWlBQ1FRRkdEUUVNQWdzZ0FDQUFLQUlrUVFGcU5nSWtDeUFBUVFFNkFEWUxDMTBCQVg4Z0FDZ0NFQ0lEUlFSQUlBQkJBVFlDSkNBQUlBSTJBaGdnQUNBQk5nSVFEd3NDUUNBQklBTkdCRUFnQUNnQ0dFRUNSdzBCSUFBZ0FqWUNHQThMSUFCQkFUb0FOaUFBUVFJMkFoZ2dBQ0FBS0FJa1FRRnFOZ0lrQ3dzQ0FBdDNBUVIvSUFDOElnUkIvLy8vQTNFaEFRSkFJQVJCRjNaQi93RnhJZ0pGRFFBZ0FrSHdBRTBFUUNBQlFZQ0FnQVJ5UWZFQUlBSnJkaUVCREFFTElBSkJqUUZMQkVCQmdQZ0JJUU5CQUNFQkRBRUxJQUpCQ25SQmdJQUhheUVEQ3lBRElBUkJFSFpCZ0lBQ2NYSWdBVUVOZG5KQi8vOERjUXNFQUNBQUM4WW5BUXgvSXdCQkVHc2lDaVFBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBSUFCQjlBRk5CRUJCdkJvb0FnQWlCa0VRSUFCQkMycEIrQU54SUFCQkMwa2JJZ1ZCQTNZaUFIWWlBVUVEY1FSQUFrQWdBVUYvYzBFQmNTQUFhaUlDUVFOMElnRkI1QnBxSWdBZ0FVSHNHbW9vQWdBaUFTZ0NDQ0lEUmdSQVFid2FJQVpCZmlBQ2QzRTJBZ0FNQVFzZ0F5QUFOZ0lNSUFBZ0F6WUNDQXNnQVVFSWFpRUFJQUVnQWtFRGRDSUNRUU55TmdJRUlBRWdBbW9pQVNBQktBSUVRUUZ5TmdJRURBb0xJQVZCeEJvb0FnQWlCMDBOQVNBQkJFQUNRRUVDSUFCMElnSkJBQ0FDYTNJZ0FTQUFkSEZvSWdGQkEzUWlBRUhrR21vaUFpQUFRZXdhYWlnQ0FDSUFLQUlJSWdOR0JFQkJ2Qm9nQmtGK0lBRjNjU0lHTmdJQURBRUxJQU1nQWpZQ0RDQUNJQU0yQWdnTElBQWdCVUVEY2pZQ0JDQUFJQVZxSWdRZ0FVRURkQ0lCSUFWcklnTkJBWEkyQWdRZ0FDQUJhaUFETmdJQUlBY0VRQ0FIUVhoeFFlUWFhaUVCUWRBYUtBSUFJUUlDZnlBR1FRRWdCMEVEZG5RaUJYRkZCRUJCdkJvZ0JTQUdjallDQUNBQkRBRUxJQUVvQWdnTElRVWdBU0FDTmdJSUlBVWdBallDRENBQ0lBRTJBZ3dnQWlBRk5nSUlDeUFBUVFocUlRQkIwQm9nQkRZQ0FFSEVHaUFETmdJQURBb0xRY0FhS0FJQUlndEZEUUVnQzJoQkFuUkI3QnhxS0FJQUlnSW9BZ1JCZUhFZ0JXc2hCQ0FDSVFFRFFBSkFJQUVvQWhBaUFFVUVRQ0FCS0FJVUlnQkZEUUVMSUFBb0FnUkJlSEVnQldzaUFTQUVJQUVnQkVraUFSc2hCQ0FBSUFJZ0FSc2hBaUFBSVFFTUFRc0xJQUlvQWhnaENTQUNJQUlvQWd3aUEwY0VRRUhNR2lnQ0FCb2dBaWdDQ0NJQUlBTTJBZ3dnQXlBQU5nSUlEQWtMSUFKQkZHb2lBU2dDQUNJQVJRUkFJQUlvQWhBaUFFVU5BeUFDUVJCcUlRRUxBMEFnQVNFSUlBQWlBMEVVYWlJQktBSUFJZ0FOQUNBRFFSQnFJUUVnQXlnQ0VDSUFEUUFMSUFoQkFEWUNBQXdJQzBGL0lRVWdBRUcvZjBzTkFDQUFRUXRxSWdCQmVIRWhCVUhBR2lnQ0FDSUlSUTBBUVFBZ0JXc2hCQUpBQWtBQ1FBSi9RUUFnQlVHQUFra05BQnBCSHlBRlFmLy8vd2RMRFFBYUlBVkJKaUFBUVFoMlp5SUFhM1pCQVhFZ0FFRUJkR3RCUG1vTElnZEJBblJCN0J4cUtBSUFJZ0ZGQkVCQkFDRUFEQUVMUVFBaEFDQUZRUmtnQjBFQmRtdEJBQ0FIUVI5SEczUWhBZ05BQWtBZ0FTZ0NCRUY0Y1NBRmF5SUdJQVJQRFFBZ0FTRURJQVlpQkEwQVFRQWhCQ0FCSVFBTUF3c2dBQ0FCS0FJVUlnWWdCaUFCSUFKQkhYWkJCSEZxS0FJUUlnRkdHeUFBSUFZYklRQWdBa0VCZENFQ0lBRU5BQXNMSUFBZ0EzSkZCRUJCQUNFRFFRSWdCM1FpQUVFQUlBQnJjaUFJY1NJQVJRMERJQUJvUVFKMFFld2NhaWdDQUNFQUN5QUFSUTBCQ3dOQUlBQW9BZ1JCZUhFZ0JXc2lBaUFFU1NFQklBSWdCQ0FCR3lFRUlBQWdBeUFCR3lFRElBQW9BaEFpQVFSL0lBRUZJQUFvQWhRTElnQU5BQXNMSUFORkRRQWdCRUhFR2lnQ0FDQUZhMDhOQUNBREtBSVlJUWNnQXlBREtBSU1JZ0pIQkVCQnpCb29BZ0FhSUFNb0FnZ2lBQ0FDTmdJTUlBSWdBRFlDQ0F3SEN5QURRUlJxSWdFb0FnQWlBRVVFUUNBREtBSVFJZ0JGRFFNZ0EwRVFhaUVCQ3dOQUlBRWhCaUFBSWdKQkZHb2lBU2dDQUNJQURRQWdBa0VRYWlFQklBSW9BaEFpQUEwQUN5QUdRUUEyQWdBTUJnc2dCVUhFR2lnQ0FDSURUUVJBUWRBYUtBSUFJUUFDUUNBRElBVnJJZ0ZCRUU4RVFDQUFJQVZxSWdJZ0FVRUJjallDQkNBQUlBTnFJQUUyQWdBZ0FDQUZRUU55TmdJRURBRUxJQUFnQTBFRGNqWUNCQ0FBSUFOcUlnRWdBU2dDQkVFQmNqWUNCRUVBSVFKQkFDRUJDMEhFR2lBQk5nSUFRZEFhSUFJMkFnQWdBRUVJYWlFQURBZ0xJQVZCeUJvb0FnQWlBa2tFUUVISUdpQUNJQVZySWdFMkFnQkIxQnBCMUJvb0FnQWlBQ0FGYWlJQ05nSUFJQUlnQVVFQmNqWUNCQ0FBSUFWQkEzSTJBZ1FnQUVFSWFpRUFEQWdMUVFBaEFDQUZRUzlxSWdRQ2YwR1VIaWdDQUFSQVFad2VLQUlBREFFTFFhQWVRbjgzQWdCQm1CNUNnS0NBZ0lDQUJEY0NBRUdVSGlBS1FReHFRWEJ4UWRpcTFhb0ZjellDQUVHb0hrRUFOZ0lBUWZnZFFRQTJBZ0JCZ0NBTElnRnFJZ1pCQUNBQmF5SUljU0lCSUFWTkRRZEI5QjBvQWdBaUF3UkFRZXdkS0FJQUlnY2dBV29pQ1NBSFRTQURJQWxKY2cwSUN3SkFRZmdkTFFBQVFRUnhSUVJBQWtBQ1FBSkFBa0JCMUJvb0FnQWlBd1JBUWZ3ZElRQURRQ0FESUFBb0FnQWlCMDhFUUNBSElBQW9BZ1JxSUFOTERRTUxJQUFvQWdnaUFBMEFDd3RCQUJBTElnSkJmMFlOQXlBQklRWkJtQjRvQWdBaUFFRUJheUlESUFKeEJFQWdBU0FDYXlBQ0lBTnFRUUFnQUd0eGFpRUdDeUFGSUFaUERRTkI5QjBvQWdBaUFBUkFRZXdkS0FJQUlnTWdCbW9pQ0NBRFRTQUFJQWhKY2cwRUN5QUdFQXNpQUNBQ1J3MEJEQVVMSUFZZ0Ftc2dDSEVpQmhBTElnSWdBQ2dDQUNBQUtBSUVha1lOQVNBQ0lRQUxJQUJCZjBZTkFTQUZRVEJxSUFaTkJFQWdBQ0VDREFRTFFad2VLQUlBSWdJZ0JDQUdhMnBCQUNBQ2EzRWlBaEFMUVg5R0RRRWdBaUFHYWlFR0lBQWhBZ3dEQ3lBQ1FYOUhEUUlMUWZnZFFmZ2RLQUlBUVFSeU5nSUFDeUFCRUFzaUFrRi9Sa0VBRUFzaUFFRi9SbklnQUNBQ1RYSU5CU0FBSUFKcklnWWdCVUVvYWswTkJRdEI3QjFCN0Iwb0FnQWdCbW9pQURZQ0FFSHdIU2dDQUNBQVNRUkFRZkFkSUFBMkFnQUxBa0JCMUJvb0FnQWlCQVJBUWZ3ZElRQURRQ0FDSUFBb0FnQWlBU0FBS0FJRUlnTnFSZzBDSUFBb0FnZ2lBQTBBQ3d3RUMwSE1HaWdDQUNJQVFRQWdBQ0FDVFJ0RkJFQkJ6Qm9nQWpZQ0FBdEJBQ0VBUVlBZUlBWTJBZ0JCL0IwZ0FqWUNBRUhjR2tGL05nSUFRZUFhUVpRZUtBSUFOZ0lBUVlnZVFRQTJBZ0FEUUNBQVFRTjBJZ0ZCN0JwcUlBRkI1QnBxSWdNMkFnQWdBVUh3R21vZ0F6WUNBQ0FBUVFGcUlnQkJJRWNOQUF0QnlCb2dCa0VvYXlJQVFYZ2dBbXRCQjNFaUFXc2lBellDQUVIVUdpQUJJQUpxSWdFMkFnQWdBU0FEUVFGeU5nSUVJQUFnQW1wQktEWUNCRUhZR2tHa0hpZ0NBRFlDQUF3RUN5QUNJQVJOSUFFZ0JFdHlEUUlnQUNnQ0RFRUljUTBDSUFBZ0F5QUdhallDQkVIVUdpQUVRWGdnQkd0QkIzRWlBR29pQVRZQ0FFSElHa0hJR2lnQ0FDQUdhaUlDSUFCcklnQTJBZ0FnQVNBQVFRRnlOZ0lFSUFJZ0JHcEJLRFlDQkVIWUdrR2tIaWdDQURZQ0FBd0RDMEVBSVFNTUJRdEJBQ0VDREFNTFFjd2FLQUlBSUFKTEJFQkJ6Qm9nQWpZQ0FBc2dBaUFHYWlFQlFmd2RJUUFDUUFKQUFrQURRQ0FCSUFBb0FnQkhCRUFnQUNnQ0NDSUFEUUVNQWdzTElBQXRBQXhCQ0hGRkRRRUxRZndkSVFBRFFBSkFJQVFnQUNnQ0FDSUJUd1JBSUFFZ0FDZ0NCR29pQXlBRVN3MEJDeUFBS0FJSUlRQU1BUXNMUWNnYUlBWkJLR3NpQUVGNElBSnJRUWR4SWdGcklnZzJBZ0JCMUJvZ0FTQUNhaUlCTmdJQUlBRWdDRUVCY2pZQ0JDQUFJQUpxUVNnMkFnUkIyQnBCcEI0b0FnQTJBZ0FnQkNBRFFTY2dBMnRCQjNGcVFTOXJJZ0FnQUNBRVFSQnFTUnNpQVVFYk5nSUVJQUZCaEI0cEFnQTNBaEFnQVVIOEhTa0NBRGNDQ0VHRUhpQUJRUWhxTmdJQVFZQWVJQVkyQWdCQi9CMGdBallDQUVHSUhrRUFOZ0lBSUFGQkdHb2hBQU5BSUFCQkJ6WUNCQ0FBUVFocUlRd2dBRUVFYWlFQUlBd2dBMGtOQUFzZ0FTQUVSZzBDSUFFZ0FTZ0NCRUYrY1RZQ0JDQUVJQUVnQkdzaUFrRUJjallDQkNBQklBSTJBZ0FnQWtIL0FVMEVRQ0FDUVhoeFFlUWFhaUVBQW45QnZCb29BZ0FpQVVFQklBSkJBM1owSWdKeFJRUkFRYndhSUFFZ0FuSTJBZ0FnQUF3QkN5QUFLQUlJQ3lFQklBQWdCRFlDQ0NBQklBUTJBZ3dnQkNBQU5nSU1JQVFnQVRZQ0NBd0RDMEVmSVFBZ0FrSC8vLzhIVFFSQUlBSkJKaUFDUVFoMlp5SUFhM1pCQVhFZ0FFRUJkR3RCUG1vaEFBc2dCQ0FBTmdJY0lBUkNBRGNDRUNBQVFRSjBRZXdjYWlFQkFrQkJ3Qm9vQWdBaUEwRUJJQUIwSWdaeFJRUkFRY0FhSUFNZ0JuSTJBZ0FnQVNBRU5nSUFEQUVMSUFKQkdTQUFRUUYyYTBFQUlBQkJIMGNiZENFQUlBRW9BZ0FoQXdOQUlBTWlBU2dDQkVGNGNTQUNSZzBESUFCQkhYWWhBeUFBUVFGMElRQWdBU0FEUVFSeGFpSUdLQUlRSWdNTkFBc2dCaUFFTmdJUUN5QUVJQUUyQWhnZ0JDQUVOZ0lNSUFRZ0JEWUNDQXdDQ3lBQUlBSTJBZ0FnQUNBQUtBSUVJQVpxTmdJRUlBSkJlQ0FDYTBFSGNXb2lCeUFGUVFOeU5nSUVJQUZCZUNBQmEwRUhjV29pQkNBRklBZHFJZ1ZySVFZQ1FFSFVHaWdDQUNBRVJnUkFRZFFhSUFVMkFnQkJ5QnBCeUJvb0FnQWdCbW9pQURZQ0FDQUZJQUJCQVhJMkFnUU1BUXRCMEJvb0FnQWdCRVlFUUVIUUdpQUZOZ0lBUWNRYVFjUWFLQUlBSUFacUlnQTJBZ0FnQlNBQVFRRnlOZ0lFSUFBZ0JXb2dBRFlDQUF3QkN5QUVLQUlFSWdKQkEzRkJBVVlFUUNBQ1FYaHhJUWtDUUNBQ1FmOEJUUVJBSUFRb0Fnd2lBQ0FFS0FJSUlnRkdCRUJCdkJwQnZCb29BZ0JCZmlBQ1FRTjJkM0UyQWdBTUFnc2dBU0FBTmdJTUlBQWdBVFlDQ0F3QkN5QUVLQUlZSVFnQ1FDQUVJQVFvQWd3aUFFY0VRRUhNR2lnQ0FCb2dCQ2dDQ0NJQklBQTJBZ3dnQUNBQk5nSUlEQUVMQWtBZ0JFRVVhaUlCS0FJQUlnSkZCRUFnQkNnQ0VDSUNSUTBCSUFSQkVHb2hBUXNEUUNBQklRTWdBaUlBUVJScUlnRW9BZ0FpQWcwQUlBQkJFR29oQVNBQUtBSVFJZ0lOQUFzZ0EwRUFOZ0lBREFFTFFRQWhBQXNnQ0VVTkFBSkFJQVFvQWh3aUFVRUNkRUhzSEdvaUFpZ0NBQ0FFUmdSQUlBSWdBRFlDQUNBQURRRkJ3QnBCd0Jvb0FnQkJmaUFCZDNFMkFnQU1BZ3NnQ0VFUVFSUWdDQ2dDRUNBRVJodHFJQUEyQWdBZ0FFVU5BUXNnQUNBSU5nSVlJQVFvQWhBaUFRUkFJQUFnQVRZQ0VDQUJJQUEyQWhnTElBUW9BaFFpQVVVTkFDQUFJQUUyQWhRZ0FTQUFOZ0lZQ3lBR0lBbHFJUVlnQkNBSmFpSUVLQUlFSVFJTElBUWdBa0YrY1RZQ0JDQUZJQVpCQVhJMkFnUWdCU0FHYWlBR05nSUFJQVpCL3dGTkJFQWdCa0Y0Y1VIa0dtb2hBQUovUWJ3YUtBSUFJZ0ZCQVNBR1FRTjJkQ0lDY1VVRVFFRzhHaUFCSUFKeU5nSUFJQUFNQVFzZ0FDZ0NDQXNoQVNBQUlBVTJBZ2dnQVNBRk5nSU1JQVVnQURZQ0RDQUZJQUUyQWdnTUFRdEJIeUVDSUFaQi8vLy9CMDBFUUNBR1FTWWdCa0VJZG1jaUFHdDJRUUZ4SUFCQkFYUnJRVDVxSVFJTElBVWdBallDSENBRlFnQTNBaEFnQWtFQ2RFSHNIR29oQVFKQUFrQkJ3Qm9vQWdBaUFFRUJJQUowSWdOeFJRUkFRY0FhSUFBZ0EzSTJBZ0FnQVNBRk5nSUFEQUVMSUFaQkdTQUNRUUYyYTBFQUlBSkJIMGNiZENFQ0lBRW9BZ0FoQUFOQUlBQWlBU2dDQkVGNGNTQUdSZzBDSUFKQkhYWWhBQ0FDUVFGMElRSWdBU0FBUVFSeGFpSURLQUlRSWdBTkFBc2dBeUFGTmdJUUN5QUZJQUUyQWhnZ0JTQUZOZ0lNSUFVZ0JUWUNDQXdCQ3lBQktBSUlJZ0FnQlRZQ0RDQUJJQVUyQWdnZ0JVRUFOZ0lZSUFVZ0FUWUNEQ0FGSUFBMkFnZ0xJQWRCQ0dvaEFBd0ZDeUFCS0FJSUlnQWdCRFlDRENBQklBUTJBZ2dnQkVFQU5nSVlJQVFnQVRZQ0RDQUVJQUEyQWdnTFFjZ2FLQUlBSWdBZ0JVME5BRUhJR2lBQUlBVnJJZ0UyQWdCQjFCcEIxQm9vQWdBaUFDQUZhaUlDTmdJQUlBSWdBVUVCY2pZQ0JDQUFJQVZCQTNJMkFnUWdBRUVJYWlFQURBTUxRYmdhUVRBMkFnQkJBQ0VBREFJTEFrQWdCMFVOQUFKQUlBTW9BaHdpQUVFQ2RFSHNIR29pQVNnQ0FDQURSZ1JBSUFFZ0FqWUNBQ0FDRFFGQndCb2dDRUYrSUFCM2NTSUlOZ0lBREFJTElBZEJFRUVVSUFjb0FoQWdBMFliYWlBQ05nSUFJQUpGRFFFTElBSWdCellDR0NBREtBSVFJZ0FFUUNBQ0lBQTJBaEFnQUNBQ05nSVlDeUFES0FJVUlnQkZEUUFnQWlBQU5nSVVJQUFnQWpZQ0dBc0NRQ0FFUVE5TkJFQWdBeUFFSUFWcUlnQkJBM0kyQWdRZ0FDQURhaUlBSUFBb0FnUkJBWEkyQWdRTUFRc2dBeUFGUVFOeU5nSUVJQU1nQldvaUFpQUVRUUZ5TmdJRUlBSWdCR29nQkRZQ0FDQUVRZjhCVFFSQUlBUkJlSEZCNUJwcUlRQUNmMEc4R2lnQ0FDSUJRUUVnQkVFRGRuUWlCWEZGQkVCQnZCb2dBU0FGY2pZQ0FDQUFEQUVMSUFBb0FnZ0xJUUVnQUNBQ05nSUlJQUVnQWpZQ0RDQUNJQUEyQWd3Z0FpQUJOZ0lJREFFTFFSOGhBQ0FFUWYvLy93ZE5CRUFnQkVFbUlBUkJDSFpuSWdCcmRrRUJjU0FBUVFGMGEwRSthaUVBQ3lBQ0lBQTJBaHdnQWtJQU53SVFJQUJCQW5SQjdCeHFJUUVDUUFKQUlBaEJBU0FBZENJRmNVVUVRRUhBR2lBRklBaHlOZ0lBSUFFZ0FqWUNBQXdCQ3lBRVFSa2dBRUVCZG10QkFDQUFRUjlIRzNRaEFDQUJLQUlBSVFVRFFDQUZJZ0VvQWdSQmVIRWdCRVlOQWlBQVFSMTJJUVVnQUVFQmRDRUFJQUVnQlVFRWNXb2lCaWdDRUNJRkRRQUxJQVlnQWpZQ0VBc2dBaUFCTmdJWUlBSWdBallDRENBQ0lBSTJBZ2dNQVFzZ0FTZ0NDQ0lBSUFJMkFnd2dBU0FDTmdJSUlBSkJBRFlDR0NBQ0lBRTJBZ3dnQWlBQU5nSUlDeUFEUVFocUlRQU1BUXNDUUNBSlJRMEFBa0FnQWlnQ0hDSUFRUUowUWV3Y2FpSUJLQUlBSUFKR0JFQWdBU0FETmdJQUlBTU5BVUhBR2lBTFFYNGdBSGR4TmdJQURBSUxJQWxCRUVFVUlBa29BaEFnQWtZYmFpQUROZ0lBSUFORkRRRUxJQU1nQ1RZQ0dDQUNLQUlRSWdBRVFDQURJQUEyQWhBZ0FDQUROZ0lZQ3lBQ0tBSVVJZ0JGRFFBZ0F5QUFOZ0lVSUFBZ0F6WUNHQXNDUUNBRVFROU5CRUFnQWlBRUlBVnFJZ0JCQTNJMkFnUWdBQ0FDYWlJQUlBQW9BZ1JCQVhJMkFnUU1BUXNnQWlBRlFRTnlOZ0lFSUFJZ0JXb2lBeUFFUVFGeU5nSUVJQU1nQkdvZ0JEWUNBQ0FIQkVBZ0IwRjRjVUhrR21vaEFFSFFHaWdDQUNFQkFuOUJBU0FIUVFOMmRDSUZJQVp4UlFSQVFid2FJQVVnQm5JMkFnQWdBQXdCQ3lBQUtBSUlDeUVGSUFBZ0FUWUNDQ0FGSUFFMkFnd2dBU0FBTmdJTUlBRWdCVFlDQ0F0QjBCb2dBellDQUVIRUdpQUVOZ0lBQ3lBQ1FRaHFJUUFMSUFwQkVHb2tBQ0FBQzZrTEFndC9DWDBqQUVHZ0FXc2lDeVFBSUF0Qk1HcEJKQkFRQTBBZ0FTQU5Sd1JBSUFJZ0RVRURiQ0lNUVFKcVFRSjBJZzVxS2dJQUlSY2dBaUFNUVFGcVFRSjBJZzlxS2dJQUlSZ2dDQ0FNUVFKMEloQnFJQUlnRUdvcUFnQWlHVGdDQUNBSUlBOXFJQmc0QWdBZ0NDQU9haUFYT0FJQUlBY2dEVUVGZEdvaURDQVlPQUlFSUF3Z0dUZ0NBQ0FNSUJjNEFnZ2dERUVBTmdJTUFrQWdBRVVFUUNBR0lBMXFMUUFBUlEwQkN5QU1RWUNBZ0FnMkFnd0xJQWNnRFVFRmRHb2lFU0FGSUExQkFuUWlERUVCY2lJU2FpMEFBRUVJZENBRklBeHFMUUFBY2lBRklBeEJBbklpRTJvdEFBQkJFSFJ5SUFVZ0RFRURjaUlNYWkwQUFFRVlkSEkyQWh3Z0N5QURJQkpCQW5RaUVtb3FBZ0FpRnpnQ2tBRWdDeUFESUJOQkFuUWlFMm9xQWdBaUdEZ0NsQUVnQ3lBRElBeEJBblFpRkdvcUFnQWlHVGdDbUFFZ0N5QURJQTFCQkhRaUZXb3FBZ0NNSWhvNEFwd0JJQXRCNEFCcUlnd2dDeW9DbUFFaUZrTUFBQURBbENBV2xDQUxLZ0tVQVNJV1F3QUFBTUNVSUJhVVF3QUFnRCtTa2pnQ0FDQU1JQXNxQXBBQkloWWdGcElnQ3lvQ2xBR1VJQXNxQXBnQlF3QUFBTUNVSUFzcUFwd0JsSkk0QWdRZ0RDQUxLZ0tRQVNJV0lCYVNJQXNxQXBnQmxDQUxLZ0tVQVNJV0lCYVNJQXNxQXB3QmxKSTRBZ2dnRENBTEtnS1FBU0lXSUJhU0lBc3FBcFFCbENBTEtnS1lBU0lXSUJhU0lBc3FBcHdCbEpJNEFnd2dEQ0FMS2dLWUFTSVdRd0FBQU1DVUlCYVVJQXNxQXBBQkloWkRBQUFBd0pRZ0ZwUkRBQUNBUDVLU09BSVFJQXdnQ3lvQ2xBRWlGaUFXa2lBTEtnS1lBWlFnQ3lvQ2tBRkRBQUFBd0pRZ0N5b0NuQUdVa2pnQ0ZDQU1JQXNxQXBBQkloWWdGcElnQ3lvQ21BR1VJQXNxQXBRQlF3QUFBTUNVSUFzcUFwd0JsSkk0QWhnZ0RDQUxLZ0tVQVNJV0lCYVNJQXNxQXBnQmxDQUxLZ0tRQVNJV0lCYVNJQXNxQXB3QmxKSTRBaHdnRENBTEtnS1VBU0lXUXdBQUFNQ1VJQmFVSUFzcUFwQUJJaFpEQUFBQXdKUWdGcFJEQUFDQVA1S1NPQUlnSUFrZ0ZXb2dGemdDQUNBSklCSnFJQmc0QWdBZ0NTQVRhaUFaT0FJQUlBa2dGR29nR2pnQ0FDQUxJQVFnRUdvcUFnQWlGemdDTUNBTElBUWdEMm9xQWdBaUdEZ0NRQ0FMSUFRZ0Rtb3FBZ0FpR1RnQ1VDQUtJQkJxSUJjNEFnQWdDaUFQYWlBWU9BSUFJQW9nRG1vZ0dUZ0NBQ0FMSUF3cUFoZ2dDeW9DT0pRZ0RDb0NBQ0FMS2dJd2xDQU1LZ0lNSUFzcUFqU1VrcEk0QWdBZ0N5QU1LZ0ljSUFzcUFqaVVJQXdxQWdRZ0N5b0NNSlFnRENvQ0VDQUxLZ0kwbEpLU09BSUVJQXNnRENvQ0lDQUxLZ0k0bENBTUtnSUlJQXNxQWpDVUlBd3FBaFFnQ3lvQ05KU1NramdDQ0NBTElBd3FBaGdnQ3lvQ1JKUWdEQ29DQUNBTEtnSThsQ0FNS2dJTUlBc3FBa0NVa3BJNEFnd2dDeUFNS2dJY0lBc3FBa1NVSUF3cUFnUWdDeW9DUEpRZ0RDb0NFQ0FMS2dKQWxKS1NPQUlRSUFzZ0RDb0NJQ0FMS2dKRWxDQU1LZ0lJSUFzcUFqeVVJQXdxQWhRZ0N5b0NRSlNTa2pnQ0ZDQUxJQXdxQWhnZ0N5b0NVSlFnRENvQ0FDQUxLZ0pJbENBTUtnSU1JQXNxQWt5VWtwSTRBaGdnQ3lBTUtnSWNJQXNxQWxDVUlBd3FBZ1FnQ3lvQ1NKUWdEQ29DRUNBTEtnSk1sSktTT0FJY0lBc2dEQ29DSUNBTEtnSlFsQ0FNS2dJSUlBc3FBa2lVSUF3cUFoUWdDeW9DVEpTU2tqZ0NJQ0FMS2dJZ0lSY2dDeW9DQ0NFWUlBc3FBaFFoR1NBUklBc3FBaGdpR2lBYWxDQUxLZ0lBSWhZZ0ZwUWdDeW9DRENJYklCdVVrcEpEQUFDQVFKUWdHaUFMS2dJY0loeVVJQllnQ3lvQ0JDSWRsQ0FiSUFzcUFoQWlIcFNTa2tNQUFJQkFsQkFNTmdJUUlCRWdHaUFYbENBV0lCaVVJQnNnR1pTU2trTUFBSUJBbENBY0lCeVVJQjBnSFpRZ0hpQWVsSktTUXdBQWdFQ1VFQXcyQWhRZ0VTQWNJQmVVSUIwZ0dKUWdIaUFabEpLU1F3QUFnRUNVSUJjZ0Y1UWdHQ0FZbENBWklCbVVrcEpEQUFDQVFKUVFERFlDR0NBTlFRRnFJUTBNQVFzTElBdEJvQUZxSkFBTEdnQWdBQ0FCS0FJSUlBVVFDZ1JBSUFFZ0FpQURJQVFRRkFzTE53QWdBQ0FCS0FJSUlBVVFDZ1JBSUFFZ0FpQURJQVFRRkE4TElBQW9BZ2dpQUNBQklBSWdBeUFFSUFVZ0FDZ0NBQ2dDRkJFREFBdVJBUUFnQUNBQktBSUlJQVFRQ2dSQUlBRWdBaUFERUJNUEN3SkFJQUFnQVNnQ0FDQUVFQXBGRFFBQ1FDQUNJQUVvQWhCSEJFQWdBU2dDRkNBQ1J3MEJDeUFEUVFGSERRRWdBVUVCTmdJZ0R3c2dBU0FDTmdJVUlBRWdBellDSUNBQklBRW9BaWhCQVdvMkFpZ0NRQ0FCS0FJa1FRRkhEUUFnQVNnQ0dFRUNSdzBBSUFGQkFUb0FOZ3NnQVVFRU5nSXNDd3Z5QVFBZ0FDQUJLQUlJSUFRUUNnUkFJQUVnQWlBREVCTVBDd0pBSUFBZ0FTZ0NBQ0FFRUFvRVFBSkFJQUlnQVNnQ0VFY0VRQ0FCS0FJVUlBSkhEUUVMSUFOQkFVY05BaUFCUVFFMkFpQVBDeUFCSUFNMkFpQUNRQ0FCS0FJc1FRUkdEUUFnQVVFQU93RTBJQUFvQWdnaUFDQUJJQUlnQWtFQklBUWdBQ2dDQUNnQ0ZCRURBQ0FCTFFBMUJFQWdBVUVETmdJc0lBRXRBRFJGRFFFTUF3c2dBVUVFTmdJc0N5QUJJQUkyQWhRZ0FTQUJLQUlvUVFGcU5nSW9JQUVvQWlSQkFVY05BU0FCS0FJWVFRSkhEUUVnQVVFQk9nQTJEd3NnQUNnQ0NDSUFJQUVnQWlBRElBUWdBQ2dDQUNnQ0dCRUNBQXNMTVFBZ0FDQUJLQUlJUVFBUUNnUkFJQUVnQWlBREVCVVBDeUFBS0FJSUlnQWdBU0FDSUFNZ0FDZ0NBQ2dDSEJFQUFBc1lBQ0FBSUFFb0FnaEJBQkFLQkVBZ0FTQUNJQU1RRlFzTGdBTUJCSDhqQUVId0FHc2lBaVFBSUFBb0FnQWlBMEVFYXlnQ0FDRUVJQU5CQ0dzb0FnQWhCU0FDUWdBM0FsQWdBa0lBTndKWUlBSkNBRGNDWUNBQ1FnQTNBR2NnQWtJQU53SklJQUpCQURZQ1JDQUNRZXdWTmdKQUlBSWdBRFlDUENBQ0lBRTJBamdnQUNBRmFpRURBa0FnQkNBQlFRQVFDZ1JBUVFBZ0F5QUZHeUVBREFFTElBQWdBMDRFUUNBQ1FnQTNBQzhnQWtJQU53SVlJQUpDQURjQ0lDQUNRZ0EzQWlnZ0FrSUFOd0lRSUFKQkFEWUNEQ0FDSUFFMkFnZ2dBaUFBTmdJRUlBSWdCRFlDQUNBQ1FRRTJBakFnQkNBQ0lBTWdBMEVCUVFBZ0JDZ0NBQ2dDRkJFREFDQUNLQUlZRFFFTFFRQWhBQ0FFSUFKQk9Hb2dBMEVCUVFBZ0JDZ0NBQ2dDR0JFQ0FBSkFBa0FnQWlnQ1hBNENBQUVDQ3lBQ0tBSk1RUUFnQWlnQ1dFRUJSaHRCQUNBQ0tBSlVRUUZHRzBFQUlBSW9BbUJCQVVZYklRQU1BUXNnQWlnQ1VFRUJSd1JBSUFJb0FtQU5BU0FDS0FKVVFRRkhEUUVnQWlnQ1dFRUJSdzBCQ3lBQ0tBSklJUUFMSUFKQjhBQnFKQUFnQUF1WkFRRUNmeU1BUVVCcUlnTWtBQUovUVFFZ0FDQUJRUUFRQ2cwQUdrRUFJQUZGRFFBYVFRQWdBVUdjRmhBaElnRkZEUUFhSUFOQkRHcEJOQkFRSUFOQkFUWUNPQ0FEUVg4MkFoUWdBeUFBTmdJUUlBTWdBVFlDQ0NBQklBTkJDR29nQWlnQ0FFRUJJQUVvQWdBb0Fod1JBQUFnQXlnQ0lDSUFRUUZHQkVBZ0FpQURLQUlZTmdJQUN5QUFRUUZHQ3lFRUlBTkJRR3NrQUNBRUN3b0FJQUFnQVVFQUVBb0xDN2NTQWdCQmdBZ0xwaEoxYm5OcFoyNWxaQ0J6YUc5eWRBQjFibk5wWjI1bFpDQnBiblFBWm14dllYUUFkV2x1ZERZMFgzUUFkVzV6YVdkdVpXUWdZMmhoY2dCaWIyOXNBSFZ1YzJsbmJtVmtJR3h2Ym1jQWMzUmtPanAzYzNSeWFXNW5BSE4wWkRvNmMzUnlhVzVuQUhOMFpEbzZkVEUyYzNSeWFXNW5BSE4wWkRvNmRUTXljM1J5YVc1bkFHUnZkV0pzWlFCMmIybGtBR1Z0YzJOeWFYQjBaVzQ2T20xbGJXOXllVjkyYVdWM1BITm9iM0owUGdCbGJYTmpjbWx3ZEdWdU9qcHRaVzF2Y25sZmRtbGxkengxYm5OcFoyNWxaQ0J6YUc5eWRENEFaVzF6WTNKcGNIUmxiam82YldWdGIzSjVYM1pwWlhjOGFXNTBQZ0JsYlhOamNtbHdkR1Z1T2pwdFpXMXZjbmxmZG1sbGR6eDFibk5wWjI1bFpDQnBiblErQUdWdGMyTnlhWEIwWlc0Nk9tMWxiVzl5ZVY5MmFXVjNQR1pzYjJGMFBnQmxiWE5qY21sd2RHVnVPanB0WlcxdmNubGZkbWxsZHp4MWFXNTBPRjkwUGdCbGJYTmpjbWx3ZEdWdU9qcHRaVzF2Y25sZmRtbGxkenhwYm5RNFgzUStBR1Z0YzJOeWFYQjBaVzQ2T20xbGJXOXllVjkyYVdWM1BIVnBiblF4Tmw5MFBnQmxiWE5qY21sd2RHVnVPanB0WlcxdmNubGZkbWxsZHp4cGJuUXhObDkwUGdCbGJYTmpjbWx3ZEdWdU9qcHRaVzF2Y25sZmRtbGxkengxYVc1ME5qUmZkRDRBWlcxelkzSnBjSFJsYmpvNmJXVnRiM0o1WDNacFpYYzhhVzUwTmpSZmRENEFaVzF6WTNKcGNIUmxiam82YldWdGIzSjVYM1pwWlhjOGRXbHVkRE15WDNRK0FHVnRjMk55YVhCMFpXNDZPbTFsYlc5eWVWOTJhV1YzUEdsdWRETXlYM1ErQUdWdGMyTnlhWEIwWlc0Nk9tMWxiVzl5ZVY5MmFXVjNQR05vWVhJK0FHVnRjMk55YVhCMFpXNDZPbTFsYlc5eWVWOTJhV1YzUEhWdWMybG5ibVZrSUdOb1lYSStBSE4wWkRvNlltRnphV05mYzNSeWFXNW5QSFZ1YzJsbmJtVmtJR05vWVhJK0FHVnRjMk55YVhCMFpXNDZPbTFsYlc5eWVWOTJhV1YzUEhOcFoyNWxaQ0JqYUdGeVBnQmxiWE5qY21sd2RHVnVPanB0WlcxdmNubGZkbWxsZHp4c2IyNW5QZ0JsYlhOamNtbHdkR1Z1T2pwdFpXMXZjbmxmZG1sbGR6eDFibk5wWjI1bFpDQnNiMjVuUGdCbGJYTmpjbWx3ZEdWdU9qcHRaVzF2Y25sZmRtbGxkenhrYjNWaWJHVStBRTVUZEROZlh6SXhNbUpoYzJsalgzTjBjbWx1WjBsalRsTmZNVEZqYUdGeVgzUnlZV2wwYzBsalJVVk9VMTg1WVd4c2IyTmhkRzl5U1dORlJVVkZBQUFBQUpRTUFBQXlCd0FBVGxOME0xOWZNakV5WW1GemFXTmZjM1J5YVc1blNXaE9VMTh4TVdOb1lYSmZkSEpoYVhSelNXaEZSVTVUWHpsaGJHeHZZMkYwYjNKSmFFVkZSVVVBQUpRTUFBQjhCd0FBVGxOME0xOWZNakV5WW1GemFXTmZjM1J5YVc1blNYZE9VMTh4TVdOb1lYSmZkSEpoYVhSelNYZEZSVTVUWHpsaGJHeHZZMkYwYjNKSmQwVkZSVVVBQUpRTUFBREVCd0FBVGxOME0xOWZNakV5WW1GemFXTmZjM1J5YVc1blNVUnpUbE5mTVRGamFHRnlYM1J5WVdsMGMwbEVjMFZGVGxOZk9XRnNiRzlqWVhSdmNrbEVjMFZGUlVVQUFBQ1VEQUFBREFnQUFFNVRkRE5mWHpJeE1tSmhjMmxqWDNOMGNtbHVaMGxFYVU1VFh6RXhZMmhoY2w5MGNtRnBkSE5KUkdsRlJVNVRYemxoYkd4dlkyRjBiM0pKUkdsRlJVVkZBQUFBbEF3QUFGZ0lBQUJPTVRCbGJYTmpjbWx3ZEdWdU0zWmhiRVVBQUpRTUFBQ2tDQUFBVGpFd1pXMXpZM0pwY0hSbGJqRXhiV1Z0YjNKNVgzWnBaWGRKWTBWRkFBQ1VEQUFBd0FnQUFFNHhNR1Z0YzJOeWFYQjBaVzR4TVcxbGJXOXllVjkyYVdWM1NXRkZSUUFBbEF3QUFPZ0lBQUJPTVRCbGJYTmpjbWx3ZEdWdU1URnRaVzF2Y25sZmRtbGxkMGxvUlVVQUFKUU1BQUFRQ1FBQVRqRXdaVzF6WTNKcGNIUmxiakV4YldWdGIzSjVYM1pwWlhkSmMwVkZBQUNVREFBQU9Ba0FBRTR4TUdWdGMyTnlhWEIwWlc0eE1XMWxiVzl5ZVY5MmFXVjNTWFJGUlFBQWxBd0FBR0FKQUFCT01UQmxiWE5qY21sd2RHVnVNVEZ0WlcxdmNubGZkbWxsZDBscFJVVUFBSlFNQUFDSUNRQUFUakV3WlcxelkzSnBjSFJsYmpFeGJXVnRiM0o1WDNacFpYZEpha1ZGQUFDVURBQUFzQWtBQUU0eE1HVnRjMk55YVhCMFpXNHhNVzFsYlc5eWVWOTJhV1YzU1d4RlJRQUFsQXdBQU5nSkFBQk9NVEJsYlhOamNtbHdkR1Z1TVRGdFpXMXZjbmxmZG1sbGQwbHRSVVVBQUpRTUFBQUFDZ0FBVGpFd1pXMXpZM0pwY0hSbGJqRXhiV1Z0YjNKNVgzWnBaWGRKZUVWRkFBQ1VEQUFBS0FvQUFFNHhNR1Z0YzJOeWFYQjBaVzR4TVcxbGJXOXllVjkyYVdWM1NYbEZSUUFBbEF3QUFGQUtBQUJPTVRCbGJYTmpjbWx3ZEdWdU1URnRaVzF2Y25sZmRtbGxkMGxtUlVVQUFKUU1BQUI0Q2dBQVRqRXdaVzF6WTNKcGNIUmxiakV4YldWdGIzSjVYM1pwWlhkSlpFVkZBQUNVREFBQW9Bb0FBRTR4TUY5ZlkzaDRZV0pwZGpFeE5sOWZjMmhwYlY5MGVYQmxYMmx1Wm05RkFBQUFBTHdNQUFESUNnQUFJQTBBQUU0eE1GOWZZM2g0WVdKcGRqRXhOMTlmWTJ4aGMzTmZkSGx3WlY5cGJtWnZSUUFBQUx3TUFBRDRDZ0FBN0FvQUFFNHhNRjlmWTNoNFlXSnBkakV4TjE5ZmNHSmhjMlZmZEhsd1pWOXBibVp2UlFBQUFMd01BQUFvQ3dBQTdBb0FBRTR4TUY5ZlkzaDRZV0pwZGpFeE9WOWZjRzlwYm5SbGNsOTBlWEJsWDJsdVptOUZBTHdNQUFCWUN3QUFUQXNBQUFBQUFBRE1Dd0FBQWdBQUFBTUFBQUFFQUFBQUJRQUFBQVlBQUFCT01UQmZYMk40ZUdGaWFYWXhNak5mWDJaMWJtUmhiV1Z1ZEdGc1gzUjVjR1ZmYVc1bWIwVUF2QXdBQUtRTEFBRHNDZ0FBZGdBQUFKQUxBQURZQ3dBQVlnQUFBSkFMQUFEa0N3QUFZd0FBQUpBTEFBRHdDd0FBYUFBQUFKQUxBQUQ4Q3dBQVlRQUFBSkFMQUFBSURBQUFjd0FBQUpBTEFBQVVEQUFBZEFBQUFKQUxBQUFnREFBQWFRQUFBSkFMQUFBc0RBQUFhZ0FBQUpBTEFBQTREQUFBYkFBQUFKQUxBQUJFREFBQWJRQUFBSkFMQUFCUURBQUFlQUFBQUpBTEFBQmNEQUFBZVFBQUFKQUxBQUJvREFBQVpnQUFBSkFMQUFCMERBQUFaQUFBQUpBTEFBQ0FEQUFBQUFBQUFCd0xBQUFDQUFBQUJ3QUFBQVFBQUFBRkFBQUFDQUFBQUFrQUFBQUtBQUFBQ3dBQUFBQUFBQUFFRFFBQUFnQUFBQXdBQUFBRUFBQUFCUUFBQUFnQUFBQU5BQUFBRGdBQUFBOEFBQUJPTVRCZlgyTjRlR0ZpYVhZeE1qQmZYM05wWDJOc1lYTnpYM1I1Y0dWZmFXNW1iMFVBQUFBQXZBd0FBTndNQUFBY0N3QUFVM1E1ZEhsd1pWOXBibVp2QUFBQUFKUU1BQUFRRFFCQnFCb0xBekFQQVE9PSI7aWYoIWlzRGF0YVVSSSh3YXNtQmluYXJ5RmlsZSkpe3dhc21CaW5hcnlGaWxlPWxvY2F0ZUZpbGUod2FzbUJpbmFyeUZpbGUpO31mdW5jdGlvbiBnZXRCaW5hcnlTeW5jKGZpbGUpe2lmKGZpbGU9PXdhc21CaW5hcnlGaWxlJiZ3YXNtQmluYXJ5KXtyZXR1cm4gbmV3IFVpbnQ4QXJyYXkod2FzbUJpbmFyeSl9dmFyIGJpbmFyeT10cnlQYXJzZUFzRGF0YVVSSShmaWxlKTtpZihiaW5hcnkpe3JldHVybiBiaW5hcnl9aWYocmVhZEJpbmFyeSl7cmV0dXJuIHJlYWRCaW5hcnkoZmlsZSl9dGhyb3cgImJvdGggYXN5bmMgYW5kIHN5bmMgZmV0Y2hpbmcgb2YgdGhlIHdhc20gZmFpbGVkIn1mdW5jdGlvbiBnZXRCaW5hcnlQcm9taXNlKGJpbmFyeUZpbGUpe3JldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpPT5nZXRCaW5hcnlTeW5jKGJpbmFyeUZpbGUpKX1mdW5jdGlvbiBpbnN0YW50aWF0ZUFycmF5QnVmZmVyKGJpbmFyeUZpbGUsaW1wb3J0cyxyZWNlaXZlcil7cmV0dXJuIGdldEJpbmFyeVByb21pc2UoYmluYXJ5RmlsZSkudGhlbihiaW5hcnk9PldlYkFzc2VtYmx5Lmluc3RhbnRpYXRlKGJpbmFyeSxpbXBvcnRzKSkudGhlbihpbnN0YW5jZT0+aW5zdGFuY2UpLnRoZW4ocmVjZWl2ZXIscmVhc29uPT57ZXJyKGBmYWlsZWQgdG8gYXN5bmNocm9ub3VzbHkgcHJlcGFyZSB3YXNtOiAke3JlYXNvbn1gKTthYm9ydChyZWFzb24pO30pfWZ1bmN0aW9uIGluc3RhbnRpYXRlQXN5bmMoYmluYXJ5LGJpbmFyeUZpbGUsaW1wb3J0cyxjYWxsYmFjayl7cmV0dXJuIGluc3RhbnRpYXRlQXJyYXlCdWZmZXIoYmluYXJ5RmlsZSxpbXBvcnRzLGNhbGxiYWNrKX1mdW5jdGlvbiBjcmVhdGVXYXNtKCl7dmFyIGluZm89eyJhIjp3YXNtSW1wb3J0c307ZnVuY3Rpb24gcmVjZWl2ZUluc3RhbmNlKGluc3RhbmNlLG1vZHVsZSl7d2FzbUV4cG9ydHM9aW5zdGFuY2UuZXhwb3J0czt3YXNtTWVtb3J5PXdhc21FeHBvcnRzWyJrIl07dXBkYXRlTWVtb3J5Vmlld3MoKTthZGRPbkluaXQod2FzbUV4cG9ydHNbImwiXSk7cmVtb3ZlUnVuRGVwZW5kZW5jeSgpO3JldHVybiB3YXNtRXhwb3J0c31hZGRSdW5EZXBlbmRlbmN5KCk7ZnVuY3Rpb24gcmVjZWl2ZUluc3RhbnRpYXRpb25SZXN1bHQocmVzdWx0KXtyZWNlaXZlSW5zdGFuY2UocmVzdWx0WyJpbnN0YW5jZSJdKTt9aWYoTW9kdWxlWyJpbnN0YW50aWF0ZVdhc20iXSl7dHJ5e3JldHVybiBNb2R1bGVbImluc3RhbnRpYXRlV2FzbSJdKGluZm8scmVjZWl2ZUluc3RhbmNlKX1jYXRjaChlKXtlcnIoYE1vZHVsZS5pbnN0YW50aWF0ZVdhc20gY2FsbGJhY2sgZmFpbGVkIHdpdGggZXJyb3I6ICR7ZX1gKTtyZWFkeVByb21pc2VSZWplY3QoZSk7fX1pbnN0YW50aWF0ZUFzeW5jKHdhc21CaW5hcnksd2FzbUJpbmFyeUZpbGUsaW5mbyxyZWNlaXZlSW5zdGFudGlhdGlvblJlc3VsdCkuY2F0Y2gocmVhZHlQcm9taXNlUmVqZWN0KTtyZXR1cm4ge319dmFyIGNhbGxSdW50aW1lQ2FsbGJhY2tzPWNhbGxiYWNrcz0+e3doaWxlKGNhbGxiYWNrcy5sZW5ndGg+MCl7Y2FsbGJhY2tzLnNoaWZ0KCkoTW9kdWxlKTt9fTtNb2R1bGVbIm5vRXhpdFJ1bnRpbWUiXXx8dHJ1ZTt2YXIgX19lbWJpbmRfcmVnaXN0ZXJfYmlnaW50PShwcmltaXRpdmVUeXBlLG5hbWUsc2l6ZSxtaW5SYW5nZSxtYXhSYW5nZSk9Pnt9O3ZhciBlbWJpbmRfaW5pdF9jaGFyQ29kZXM9KCk9Pnt2YXIgY29kZXM9bmV3IEFycmF5KDI1Nik7Zm9yKHZhciBpPTA7aTwyNTY7KytpKXtjb2Rlc1tpXT1TdHJpbmcuZnJvbUNoYXJDb2RlKGkpO31lbWJpbmRfY2hhckNvZGVzPWNvZGVzO307dmFyIGVtYmluZF9jaGFyQ29kZXM7dmFyIHJlYWRMYXRpbjFTdHJpbmc9cHRyPT57dmFyIHJldD0iIjt2YXIgYz1wdHI7d2hpbGUoSEVBUFU4W2NdKXtyZXQrPWVtYmluZF9jaGFyQ29kZXNbSEVBUFU4W2MrK11dO31yZXR1cm4gcmV0fTt2YXIgYXdhaXRpbmdEZXBlbmRlbmNpZXM9e307dmFyIHJlZ2lzdGVyZWRUeXBlcz17fTt2YXIgQmluZGluZ0Vycm9yO3ZhciB0aHJvd0JpbmRpbmdFcnJvcj1tZXNzYWdlPT57dGhyb3cgbmV3IEJpbmRpbmdFcnJvcihtZXNzYWdlKX07ZnVuY3Rpb24gc2hhcmVkUmVnaXN0ZXJUeXBlKHJhd1R5cGUscmVnaXN0ZXJlZEluc3RhbmNlLG9wdGlvbnM9e30pe3ZhciBuYW1lPXJlZ2lzdGVyZWRJbnN0YW5jZS5uYW1lO2lmKCFyYXdUeXBlKXt0aHJvd0JpbmRpbmdFcnJvcihgdHlwZSAiJHtuYW1lfSIgbXVzdCBoYXZlIGEgcG9zaXRpdmUgaW50ZWdlciB0eXBlaWQgcG9pbnRlcmApO31pZihyZWdpc3RlcmVkVHlwZXMuaGFzT3duUHJvcGVydHkocmF3VHlwZSkpe2lmKG9wdGlvbnMuaWdub3JlRHVwbGljYXRlUmVnaXN0cmF0aW9ucyl7cmV0dXJufWVsc2Uge3Rocm93QmluZGluZ0Vycm9yKGBDYW5ub3QgcmVnaXN0ZXIgdHlwZSAnJHtuYW1lfScgdHdpY2VgKTt9fXJlZ2lzdGVyZWRUeXBlc1tyYXdUeXBlXT1yZWdpc3RlcmVkSW5zdGFuY2U7aWYoYXdhaXRpbmdEZXBlbmRlbmNpZXMuaGFzT3duUHJvcGVydHkocmF3VHlwZSkpe3ZhciBjYWxsYmFja3M9YXdhaXRpbmdEZXBlbmRlbmNpZXNbcmF3VHlwZV07ZGVsZXRlIGF3YWl0aW5nRGVwZW5kZW5jaWVzW3Jhd1R5cGVdO2NhbGxiYWNrcy5mb3JFYWNoKGNiPT5jYigpKTt9fWZ1bmN0aW9uIHJlZ2lzdGVyVHlwZShyYXdUeXBlLHJlZ2lzdGVyZWRJbnN0YW5jZSxvcHRpb25zPXt9KXtpZighKCJhcmdQYWNrQWR2YW5jZSJpbiByZWdpc3RlcmVkSW5zdGFuY2UpKXt0aHJvdyBuZXcgVHlwZUVycm9yKCJyZWdpc3RlclR5cGUgcmVnaXN0ZXJlZEluc3RhbmNlIHJlcXVpcmVzIGFyZ1BhY2tBZHZhbmNlIil9cmV0dXJuIHNoYXJlZFJlZ2lzdGVyVHlwZShyYXdUeXBlLHJlZ2lzdGVyZWRJbnN0YW5jZSxvcHRpb25zKX12YXIgR2VuZXJpY1dpcmVUeXBlU2l6ZT04O3ZhciBfX2VtYmluZF9yZWdpc3Rlcl9ib29sPShyYXdUeXBlLG5hbWUsdHJ1ZVZhbHVlLGZhbHNlVmFsdWUpPT57bmFtZT1yZWFkTGF0aW4xU3RyaW5nKG5hbWUpO3JlZ2lzdGVyVHlwZShyYXdUeXBlLHtuYW1lOm5hbWUsImZyb21XaXJlVHlwZSI6ZnVuY3Rpb24od3Qpe3JldHVybiAhIXd0fSwidG9XaXJlVHlwZSI6ZnVuY3Rpb24oZGVzdHJ1Y3RvcnMsbyl7cmV0dXJuIG8/dHJ1ZVZhbHVlOmZhbHNlVmFsdWV9LCJhcmdQYWNrQWR2YW5jZSI6R2VuZXJpY1dpcmVUeXBlU2l6ZSwicmVhZFZhbHVlRnJvbVBvaW50ZXIiOmZ1bmN0aW9uKHBvaW50ZXIpe3JldHVybiB0aGlzWyJmcm9tV2lyZVR5cGUiXShIRUFQVThbcG9pbnRlcl0pfSxkZXN0cnVjdG9yRnVuY3Rpb246bnVsbH0pO307Y2xhc3MgSGFuZGxlQWxsb2NhdG9ye2NvbnN0cnVjdG9yKCl7dGhpcy5hbGxvY2F0ZWQ9W3VuZGVmaW5lZF07dGhpcy5mcmVlbGlzdD1bXTt9Z2V0KGlkKXtyZXR1cm4gdGhpcy5hbGxvY2F0ZWRbaWRdfWhhcyhpZCl7cmV0dXJuIHRoaXMuYWxsb2NhdGVkW2lkXSE9PXVuZGVmaW5lZH1hbGxvY2F0ZShoYW5kbGUpe3ZhciBpZD10aGlzLmZyZWVsaXN0LnBvcCgpfHx0aGlzLmFsbG9jYXRlZC5sZW5ndGg7dGhpcy5hbGxvY2F0ZWRbaWRdPWhhbmRsZTtyZXR1cm4gaWR9ZnJlZShpZCl7dGhpcy5hbGxvY2F0ZWRbaWRdPXVuZGVmaW5lZDt0aGlzLmZyZWVsaXN0LnB1c2goaWQpO319dmFyIGVtdmFsX2hhbmRsZXM9bmV3IEhhbmRsZUFsbG9jYXRvcjt2YXIgX19lbXZhbF9kZWNyZWY9aGFuZGxlPT57aWYoaGFuZGxlPj1lbXZhbF9oYW5kbGVzLnJlc2VydmVkJiYwPT09LS1lbXZhbF9oYW5kbGVzLmdldChoYW5kbGUpLnJlZmNvdW50KXtlbXZhbF9oYW5kbGVzLmZyZWUoaGFuZGxlKTt9fTt2YXIgY291bnRfZW12YWxfaGFuZGxlcz0oKT0+e3ZhciBjb3VudD0wO2Zvcih2YXIgaT1lbXZhbF9oYW5kbGVzLnJlc2VydmVkO2k8ZW12YWxfaGFuZGxlcy5hbGxvY2F0ZWQubGVuZ3RoOysraSl7aWYoZW12YWxfaGFuZGxlcy5hbGxvY2F0ZWRbaV0hPT11bmRlZmluZWQpeysrY291bnQ7fX1yZXR1cm4gY291bnR9O3ZhciBpbml0X2VtdmFsPSgpPT57ZW12YWxfaGFuZGxlcy5hbGxvY2F0ZWQucHVzaCh7dmFsdWU6dW5kZWZpbmVkfSx7dmFsdWU6bnVsbH0se3ZhbHVlOnRydWV9LHt2YWx1ZTpmYWxzZX0pO09iamVjdC5hc3NpZ24oZW12YWxfaGFuZGxlcyx7cmVzZXJ2ZWQ6ZW12YWxfaGFuZGxlcy5hbGxvY2F0ZWQubGVuZ3RofSksTW9kdWxlWyJjb3VudF9lbXZhbF9oYW5kbGVzIl09Y291bnRfZW12YWxfaGFuZGxlczt9O3ZhciBFbXZhbD17dG9WYWx1ZTpoYW5kbGU9PntpZighaGFuZGxlKXt0aHJvd0JpbmRpbmdFcnJvcigiQ2Fubm90IHVzZSBkZWxldGVkIHZhbC4gaGFuZGxlID0gIitoYW5kbGUpO31yZXR1cm4gZW12YWxfaGFuZGxlcy5nZXQoaGFuZGxlKS52YWx1ZX0sdG9IYW5kbGU6dmFsdWU9Pntzd2l0Y2godmFsdWUpe2Nhc2UgdW5kZWZpbmVkOnJldHVybiAxO2Nhc2UgbnVsbDpyZXR1cm4gMjtjYXNlIHRydWU6cmV0dXJuIDM7Y2FzZSBmYWxzZTpyZXR1cm4gNDtkZWZhdWx0OntyZXR1cm4gZW12YWxfaGFuZGxlcy5hbGxvY2F0ZSh7cmVmY291bnQ6MSx2YWx1ZTp2YWx1ZX0pfX19fTtmdW5jdGlvbiBzaW1wbGVSZWFkVmFsdWVGcm9tUG9pbnRlcihwb2ludGVyKXtyZXR1cm4gdGhpc1siZnJvbVdpcmVUeXBlIl0oSEVBUDMyW3BvaW50ZXI+PjJdKX12YXIgRW1WYWxUeXBlPXtuYW1lOiJlbXNjcmlwdGVuOjp2YWwiLCJmcm9tV2lyZVR5cGUiOmhhbmRsZT0+e3ZhciBydj1FbXZhbC50b1ZhbHVlKGhhbmRsZSk7X19lbXZhbF9kZWNyZWYoaGFuZGxlKTtyZXR1cm4gcnZ9LCJ0b1dpcmVUeXBlIjooZGVzdHJ1Y3RvcnMsdmFsdWUpPT5FbXZhbC50b0hhbmRsZSh2YWx1ZSksImFyZ1BhY2tBZHZhbmNlIjpHZW5lcmljV2lyZVR5cGVTaXplLCJyZWFkVmFsdWVGcm9tUG9pbnRlciI6c2ltcGxlUmVhZFZhbHVlRnJvbVBvaW50ZXIsZGVzdHJ1Y3RvckZ1bmN0aW9uOm51bGx9O3ZhciBfX2VtYmluZF9yZWdpc3Rlcl9lbXZhbD1yYXdUeXBlPT5yZWdpc3RlclR5cGUocmF3VHlwZSxFbVZhbFR5cGUpO3ZhciBmbG9hdFJlYWRWYWx1ZUZyb21Qb2ludGVyPShuYW1lLHdpZHRoKT0+e3N3aXRjaCh3aWR0aCl7Y2FzZSA0OnJldHVybiBmdW5jdGlvbihwb2ludGVyKXtyZXR1cm4gdGhpc1siZnJvbVdpcmVUeXBlIl0oSEVBUEYzMltwb2ludGVyPj4yXSl9O2Nhc2UgODpyZXR1cm4gZnVuY3Rpb24ocG9pbnRlcil7cmV0dXJuIHRoaXNbImZyb21XaXJlVHlwZSJdKEhFQVBGNjRbcG9pbnRlcj4+M10pfTtkZWZhdWx0OnRocm93IG5ldyBUeXBlRXJyb3IoYGludmFsaWQgZmxvYXQgd2lkdGggKCR7d2lkdGh9KTogJHtuYW1lfWApfX07dmFyIF9fZW1iaW5kX3JlZ2lzdGVyX2Zsb2F0PShyYXdUeXBlLG5hbWUsc2l6ZSk9PntuYW1lPXJlYWRMYXRpbjFTdHJpbmcobmFtZSk7cmVnaXN0ZXJUeXBlKHJhd1R5cGUse25hbWU6bmFtZSwiZnJvbVdpcmVUeXBlIjp2YWx1ZT0+dmFsdWUsInRvV2lyZVR5cGUiOihkZXN0cnVjdG9ycyx2YWx1ZSk9PnZhbHVlLCJhcmdQYWNrQWR2YW5jZSI6R2VuZXJpY1dpcmVUeXBlU2l6ZSwicmVhZFZhbHVlRnJvbVBvaW50ZXIiOmZsb2F0UmVhZFZhbHVlRnJvbVBvaW50ZXIobmFtZSxzaXplKSxkZXN0cnVjdG9yRnVuY3Rpb246bnVsbH0pO307dmFyIGludGVnZXJSZWFkVmFsdWVGcm9tUG9pbnRlcj0obmFtZSx3aWR0aCxzaWduZWQpPT57c3dpdGNoKHdpZHRoKXtjYXNlIDE6cmV0dXJuIHNpZ25lZD9wb2ludGVyPT5IRUFQOFtwb2ludGVyPj4wXTpwb2ludGVyPT5IRUFQVThbcG9pbnRlcj4+MF07Y2FzZSAyOnJldHVybiBzaWduZWQ/cG9pbnRlcj0+SEVBUDE2W3BvaW50ZXI+PjFdOnBvaW50ZXI9PkhFQVBVMTZbcG9pbnRlcj4+MV07Y2FzZSA0OnJldHVybiBzaWduZWQ/cG9pbnRlcj0+SEVBUDMyW3BvaW50ZXI+PjJdOnBvaW50ZXI9PkhFQVBVMzJbcG9pbnRlcj4+Ml07ZGVmYXVsdDp0aHJvdyBuZXcgVHlwZUVycm9yKGBpbnZhbGlkIGludGVnZXIgd2lkdGggKCR7d2lkdGh9KTogJHtuYW1lfWApfX07dmFyIF9fZW1iaW5kX3JlZ2lzdGVyX2ludGVnZXI9KHByaW1pdGl2ZVR5cGUsbmFtZSxzaXplLG1pblJhbmdlLG1heFJhbmdlKT0+e25hbWU9cmVhZExhdGluMVN0cmluZyhuYW1lKTt2YXIgZnJvbVdpcmVUeXBlPXZhbHVlPT52YWx1ZTtpZihtaW5SYW5nZT09PTApe3ZhciBiaXRzaGlmdD0zMi04KnNpemU7ZnJvbVdpcmVUeXBlPXZhbHVlPT52YWx1ZTw8Yml0c2hpZnQ+Pj5iaXRzaGlmdDt9dmFyIGlzVW5zaWduZWRUeXBlPW5hbWUuaW5jbHVkZXMoInVuc2lnbmVkIik7dmFyIGNoZWNrQXNzZXJ0aW9ucz0odmFsdWUsdG9UeXBlTmFtZSk9Pnt9O3ZhciB0b1dpcmVUeXBlO2lmKGlzVW5zaWduZWRUeXBlKXt0b1dpcmVUeXBlPWZ1bmN0aW9uKGRlc3RydWN0b3JzLHZhbHVlKXtjaGVja0Fzc2VydGlvbnModmFsdWUsdGhpcy5uYW1lKTtyZXR1cm4gdmFsdWU+Pj4wfTt9ZWxzZSB7dG9XaXJlVHlwZT1mdW5jdGlvbihkZXN0cnVjdG9ycyx2YWx1ZSl7Y2hlY2tBc3NlcnRpb25zKHZhbHVlLHRoaXMubmFtZSk7cmV0dXJuIHZhbHVlfTt9cmVnaXN0ZXJUeXBlKHByaW1pdGl2ZVR5cGUse25hbWU6bmFtZSwiZnJvbVdpcmVUeXBlIjpmcm9tV2lyZVR5cGUsInRvV2lyZVR5cGUiOnRvV2lyZVR5cGUsImFyZ1BhY2tBZHZhbmNlIjpHZW5lcmljV2lyZVR5cGVTaXplLCJyZWFkVmFsdWVGcm9tUG9pbnRlciI6aW50ZWdlclJlYWRWYWx1ZUZyb21Qb2ludGVyKG5hbWUsc2l6ZSxtaW5SYW5nZSE9PTApLGRlc3RydWN0b3JGdW5jdGlvbjpudWxsfSk7fTt2YXIgX19lbWJpbmRfcmVnaXN0ZXJfbWVtb3J5X3ZpZXc9KHJhd1R5cGUsZGF0YVR5cGVJbmRleCxuYW1lKT0+e3ZhciB0eXBlTWFwcGluZz1bSW50OEFycmF5LFVpbnQ4QXJyYXksSW50MTZBcnJheSxVaW50MTZBcnJheSxJbnQzMkFycmF5LFVpbnQzMkFycmF5LEZsb2F0MzJBcnJheSxGbG9hdDY0QXJyYXldO3ZhciBUQT10eXBlTWFwcGluZ1tkYXRhVHlwZUluZGV4XTtmdW5jdGlvbiBkZWNvZGVNZW1vcnlWaWV3KGhhbmRsZSl7dmFyIHNpemU9SEVBUFUzMltoYW5kbGU+PjJdO3ZhciBkYXRhPUhFQVBVMzJbaGFuZGxlKzQ+PjJdO3JldHVybiBuZXcgVEEoSEVBUDguYnVmZmVyLGRhdGEsc2l6ZSl9bmFtZT1yZWFkTGF0aW4xU3RyaW5nKG5hbWUpO3JlZ2lzdGVyVHlwZShyYXdUeXBlLHtuYW1lOm5hbWUsImZyb21XaXJlVHlwZSI6ZGVjb2RlTWVtb3J5VmlldywiYXJnUGFja0FkdmFuY2UiOkdlbmVyaWNXaXJlVHlwZVNpemUsInJlYWRWYWx1ZUZyb21Qb2ludGVyIjpkZWNvZGVNZW1vcnlWaWV3fSx7aWdub3JlRHVwbGljYXRlUmVnaXN0cmF0aW9uczp0cnVlfSk7fTtmdW5jdGlvbiByZWFkUG9pbnRlcihwb2ludGVyKXtyZXR1cm4gdGhpc1siZnJvbVdpcmVUeXBlIl0oSEVBUFUzMltwb2ludGVyPj4yXSl9dmFyIHN0cmluZ1RvVVRGOEFycmF5PShzdHIsaGVhcCxvdXRJZHgsbWF4Qnl0ZXNUb1dyaXRlKT0+e2lmKCEobWF4Qnl0ZXNUb1dyaXRlPjApKXJldHVybiAwO3ZhciBzdGFydElkeD1vdXRJZHg7dmFyIGVuZElkeD1vdXRJZHgrbWF4Qnl0ZXNUb1dyaXRlLTE7Zm9yKHZhciBpPTA7aTxzdHIubGVuZ3RoOysraSl7dmFyIHU9c3RyLmNoYXJDb2RlQXQoaSk7aWYodT49NTUyOTYmJnU8PTU3MzQzKXt2YXIgdTE9c3RyLmNoYXJDb2RlQXQoKytpKTt1PTY1NTM2KygodSYxMDIzKTw8MTApfHUxJjEwMjM7fWlmKHU8PTEyNyl7aWYob3V0SWR4Pj1lbmRJZHgpYnJlYWs7aGVhcFtvdXRJZHgrK109dTt9ZWxzZSBpZih1PD0yMDQ3KXtpZihvdXRJZHgrMT49ZW5kSWR4KWJyZWFrO2hlYXBbb3V0SWR4KytdPTE5Mnx1Pj42O2hlYXBbb3V0SWR4KytdPTEyOHx1JjYzO31lbHNlIGlmKHU8PTY1NTM1KXtpZihvdXRJZHgrMj49ZW5kSWR4KWJyZWFrO2hlYXBbb3V0SWR4KytdPTIyNHx1Pj4xMjtoZWFwW291dElkeCsrXT0xMjh8dT4+NiY2MztoZWFwW291dElkeCsrXT0xMjh8dSY2Mzt9ZWxzZSB7aWYob3V0SWR4KzM+PWVuZElkeClicmVhaztoZWFwW291dElkeCsrXT0yNDB8dT4+MTg7aGVhcFtvdXRJZHgrK109MTI4fHU+PjEyJjYzO2hlYXBbb3V0SWR4KytdPTEyOHx1Pj42JjYzO2hlYXBbb3V0SWR4KytdPTEyOHx1JjYzO319aGVhcFtvdXRJZHhdPTA7cmV0dXJuIG91dElkeC1zdGFydElkeH07dmFyIHN0cmluZ1RvVVRGOD0oc3RyLG91dFB0cixtYXhCeXRlc1RvV3JpdGUpPT5zdHJpbmdUb1VURjhBcnJheShzdHIsSEVBUFU4LG91dFB0cixtYXhCeXRlc1RvV3JpdGUpO3ZhciBsZW5ndGhCeXRlc1VURjg9c3RyPT57dmFyIGxlbj0wO2Zvcih2YXIgaT0wO2k8c3RyLmxlbmd0aDsrK2kpe3ZhciBjPXN0ci5jaGFyQ29kZUF0KGkpO2lmKGM8PTEyNyl7bGVuKys7fWVsc2UgaWYoYzw9MjA0Nyl7bGVuKz0yO31lbHNlIGlmKGM+PTU1Mjk2JiZjPD01NzM0Myl7bGVuKz00OysraTt9ZWxzZSB7bGVuKz0zO319cmV0dXJuIGxlbn07dmFyIFVURjhEZWNvZGVyPXR5cGVvZiBUZXh0RGVjb2RlciE9InVuZGVmaW5lZCI/bmV3IFRleHREZWNvZGVyKCJ1dGY4Iik6dW5kZWZpbmVkO3ZhciBVVEY4QXJyYXlUb1N0cmluZz0oaGVhcE9yQXJyYXksaWR4LG1heEJ5dGVzVG9SZWFkKT0+e3ZhciBlbmRJZHg9aWR4K21heEJ5dGVzVG9SZWFkO3ZhciBlbmRQdHI9aWR4O3doaWxlKGhlYXBPckFycmF5W2VuZFB0cl0mJiEoZW5kUHRyPj1lbmRJZHgpKSsrZW5kUHRyO2lmKGVuZFB0ci1pZHg+MTYmJmhlYXBPckFycmF5LmJ1ZmZlciYmVVRGOERlY29kZXIpe3JldHVybiBVVEY4RGVjb2Rlci5kZWNvZGUoaGVhcE9yQXJyYXkuc3ViYXJyYXkoaWR4LGVuZFB0cikpfXZhciBzdHI9IiI7d2hpbGUoaWR4PGVuZFB0cil7dmFyIHUwPWhlYXBPckFycmF5W2lkeCsrXTtpZighKHUwJjEyOCkpe3N0cis9U3RyaW5nLmZyb21DaGFyQ29kZSh1MCk7Y29udGludWV9dmFyIHUxPWhlYXBPckFycmF5W2lkeCsrXSY2MztpZigodTAmMjI0KT09MTkyKXtzdHIrPVN0cmluZy5mcm9tQ2hhckNvZGUoKHUwJjMxKTw8Nnx1MSk7Y29udGludWV9dmFyIHUyPWhlYXBPckFycmF5W2lkeCsrXSY2MztpZigodTAmMjQwKT09MjI0KXt1MD0odTAmMTUpPDwxMnx1MTw8Nnx1Mjt9ZWxzZSB7dTA9KHUwJjcpPDwxOHx1MTw8MTJ8dTI8PDZ8aGVhcE9yQXJyYXlbaWR4KytdJjYzO31pZih1MDw2NTUzNil7c3RyKz1TdHJpbmcuZnJvbUNoYXJDb2RlKHUwKTt9ZWxzZSB7dmFyIGNoPXUwLTY1NTM2O3N0cis9U3RyaW5nLmZyb21DaGFyQ29kZSg1NTI5NnxjaD4+MTAsNTYzMjB8Y2gmMTAyMyk7fX1yZXR1cm4gc3RyfTt2YXIgVVRGOFRvU3RyaW5nPShwdHIsbWF4Qnl0ZXNUb1JlYWQpPT5wdHI/VVRGOEFycmF5VG9TdHJpbmcoSEVBUFU4LHB0cixtYXhCeXRlc1RvUmVhZCk6IiI7dmFyIF9fZW1iaW5kX3JlZ2lzdGVyX3N0ZF9zdHJpbmc9KHJhd1R5cGUsbmFtZSk9PntuYW1lPXJlYWRMYXRpbjFTdHJpbmcobmFtZSk7dmFyIHN0ZFN0cmluZ0lzVVRGOD1uYW1lPT09InN0ZDo6c3RyaW5nIjtyZWdpc3RlclR5cGUocmF3VHlwZSx7bmFtZTpuYW1lLCJmcm9tV2lyZVR5cGUiKHZhbHVlKXt2YXIgbGVuZ3RoPUhFQVBVMzJbdmFsdWU+PjJdO3ZhciBwYXlsb2FkPXZhbHVlKzQ7dmFyIHN0cjtpZihzdGRTdHJpbmdJc1VURjgpe3ZhciBkZWNvZGVTdGFydFB0cj1wYXlsb2FkO2Zvcih2YXIgaT0wO2k8PWxlbmd0aDsrK2kpe3ZhciBjdXJyZW50Qnl0ZVB0cj1wYXlsb2FkK2k7aWYoaT09bGVuZ3RofHxIRUFQVThbY3VycmVudEJ5dGVQdHJdPT0wKXt2YXIgbWF4UmVhZD1jdXJyZW50Qnl0ZVB0ci1kZWNvZGVTdGFydFB0cjt2YXIgc3RyaW5nU2VnbWVudD1VVEY4VG9TdHJpbmcoZGVjb2RlU3RhcnRQdHIsbWF4UmVhZCk7aWYoc3RyPT09dW5kZWZpbmVkKXtzdHI9c3RyaW5nU2VnbWVudDt9ZWxzZSB7c3RyKz1TdHJpbmcuZnJvbUNoYXJDb2RlKDApO3N0cis9c3RyaW5nU2VnbWVudDt9ZGVjb2RlU3RhcnRQdHI9Y3VycmVudEJ5dGVQdHIrMTt9fX1lbHNlIHt2YXIgYT1uZXcgQXJyYXkobGVuZ3RoKTtmb3IodmFyIGk9MDtpPGxlbmd0aDsrK2kpe2FbaV09U3RyaW5nLmZyb21DaGFyQ29kZShIRUFQVThbcGF5bG9hZCtpXSk7fXN0cj1hLmpvaW4oIiIpO31fZnJlZSh2YWx1ZSk7cmV0dXJuIHN0cn0sInRvV2lyZVR5cGUiKGRlc3RydWN0b3JzLHZhbHVlKXtpZih2YWx1ZSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKXt2YWx1ZT1uZXcgVWludDhBcnJheSh2YWx1ZSk7fXZhciBsZW5ndGg7dmFyIHZhbHVlSXNPZlR5cGVTdHJpbmc9dHlwZW9mIHZhbHVlPT0ic3RyaW5nIjtpZighKHZhbHVlSXNPZlR5cGVTdHJpbmd8fHZhbHVlIGluc3RhbmNlb2YgVWludDhBcnJheXx8dmFsdWUgaW5zdGFuY2VvZiBVaW50OENsYW1wZWRBcnJheXx8dmFsdWUgaW5zdGFuY2VvZiBJbnQ4QXJyYXkpKXt0aHJvd0JpbmRpbmdFcnJvcigiQ2Fubm90IHBhc3Mgbm9uLXN0cmluZyB0byBzdGQ6OnN0cmluZyIpO31pZihzdGRTdHJpbmdJc1VURjgmJnZhbHVlSXNPZlR5cGVTdHJpbmcpe2xlbmd0aD1sZW5ndGhCeXRlc1VURjgodmFsdWUpO31lbHNlIHtsZW5ndGg9dmFsdWUubGVuZ3RoO312YXIgYmFzZT1fbWFsbG9jKDQrbGVuZ3RoKzEpO3ZhciBwdHI9YmFzZSs0O0hFQVBVMzJbYmFzZT4+Ml09bGVuZ3RoO2lmKHN0ZFN0cmluZ0lzVVRGOCYmdmFsdWVJc09mVHlwZVN0cmluZyl7c3RyaW5nVG9VVEY4KHZhbHVlLHB0cixsZW5ndGgrMSk7fWVsc2Uge2lmKHZhbHVlSXNPZlR5cGVTdHJpbmcpe2Zvcih2YXIgaT0wO2k8bGVuZ3RoOysraSl7dmFyIGNoYXJDb2RlPXZhbHVlLmNoYXJDb2RlQXQoaSk7aWYoY2hhckNvZGU+MjU1KXtfZnJlZShwdHIpO3Rocm93QmluZGluZ0Vycm9yKCJTdHJpbmcgaGFzIFVURi0xNiBjb2RlIHVuaXRzIHRoYXQgZG8gbm90IGZpdCBpbiA4IGJpdHMiKTt9SEVBUFU4W3B0citpXT1jaGFyQ29kZTt9fWVsc2Uge2Zvcih2YXIgaT0wO2k8bGVuZ3RoOysraSl7SEVBUFU4W3B0citpXT12YWx1ZVtpXTt9fX1pZihkZXN0cnVjdG9ycyE9PW51bGwpe2Rlc3RydWN0b3JzLnB1c2goX2ZyZWUsYmFzZSk7fXJldHVybiBiYXNlfSwiYXJnUGFja0FkdmFuY2UiOkdlbmVyaWNXaXJlVHlwZVNpemUsInJlYWRWYWx1ZUZyb21Qb2ludGVyIjpyZWFkUG9pbnRlcixkZXN0cnVjdG9yRnVuY3Rpb24ocHRyKXtfZnJlZShwdHIpO319KTt9O3ZhciBVVEYxNkRlY29kZXI9dHlwZW9mIFRleHREZWNvZGVyIT0idW5kZWZpbmVkIj9uZXcgVGV4dERlY29kZXIoInV0Zi0xNmxlIik6dW5kZWZpbmVkO3ZhciBVVEYxNlRvU3RyaW5nPShwdHIsbWF4Qnl0ZXNUb1JlYWQpPT57dmFyIGVuZFB0cj1wdHI7dmFyIGlkeD1lbmRQdHI+PjE7dmFyIG1heElkeD1pZHgrbWF4Qnl0ZXNUb1JlYWQvMjt3aGlsZSghKGlkeD49bWF4SWR4KSYmSEVBUFUxNltpZHhdKSsraWR4O2VuZFB0cj1pZHg8PDE7aWYoZW5kUHRyLXB0cj4zMiYmVVRGMTZEZWNvZGVyKXJldHVybiBVVEYxNkRlY29kZXIuZGVjb2RlKEhFQVBVOC5zdWJhcnJheShwdHIsZW5kUHRyKSk7dmFyIHN0cj0iIjtmb3IodmFyIGk9MDshKGk+PW1heEJ5dGVzVG9SZWFkLzIpOysraSl7dmFyIGNvZGVVbml0PUhFQVAxNltwdHIraSoyPj4xXTtpZihjb2RlVW5pdD09MClicmVhaztzdHIrPVN0cmluZy5mcm9tQ2hhckNvZGUoY29kZVVuaXQpO31yZXR1cm4gc3RyfTt2YXIgc3RyaW5nVG9VVEYxNj0oc3RyLG91dFB0cixtYXhCeXRlc1RvV3JpdGUpPT57bWF4Qnl0ZXNUb1dyaXRlPz89MjE0NzQ4MzY0NztpZihtYXhCeXRlc1RvV3JpdGU8MilyZXR1cm4gMDttYXhCeXRlc1RvV3JpdGUtPTI7dmFyIHN0YXJ0UHRyPW91dFB0cjt2YXIgbnVtQ2hhcnNUb1dyaXRlPW1heEJ5dGVzVG9Xcml0ZTxzdHIubGVuZ3RoKjI/bWF4Qnl0ZXNUb1dyaXRlLzI6c3RyLmxlbmd0aDtmb3IodmFyIGk9MDtpPG51bUNoYXJzVG9Xcml0ZTsrK2kpe3ZhciBjb2RlVW5pdD1zdHIuY2hhckNvZGVBdChpKTtIRUFQMTZbb3V0UHRyPj4xXT1jb2RlVW5pdDtvdXRQdHIrPTI7fUhFQVAxNltvdXRQdHI+PjFdPTA7cmV0dXJuIG91dFB0ci1zdGFydFB0cn07dmFyIGxlbmd0aEJ5dGVzVVRGMTY9c3RyPT5zdHIubGVuZ3RoKjI7dmFyIFVURjMyVG9TdHJpbmc9KHB0cixtYXhCeXRlc1RvUmVhZCk9Pnt2YXIgaT0wO3ZhciBzdHI9IiI7d2hpbGUoIShpPj1tYXhCeXRlc1RvUmVhZC80KSl7dmFyIHV0ZjMyPUhFQVAzMltwdHIraSo0Pj4yXTtpZih1dGYzMj09MClicmVhazsrK2k7aWYodXRmMzI+PTY1NTM2KXt2YXIgY2g9dXRmMzItNjU1MzY7c3RyKz1TdHJpbmcuZnJvbUNoYXJDb2RlKDU1Mjk2fGNoPj4xMCw1NjMyMHxjaCYxMDIzKTt9ZWxzZSB7c3RyKz1TdHJpbmcuZnJvbUNoYXJDb2RlKHV0ZjMyKTt9fXJldHVybiBzdHJ9O3ZhciBzdHJpbmdUb1VURjMyPShzdHIsb3V0UHRyLG1heEJ5dGVzVG9Xcml0ZSk9PnttYXhCeXRlc1RvV3JpdGU/Pz0yMTQ3NDgzNjQ3O2lmKG1heEJ5dGVzVG9Xcml0ZTw0KXJldHVybiAwO3ZhciBzdGFydFB0cj1vdXRQdHI7dmFyIGVuZFB0cj1zdGFydFB0cittYXhCeXRlc1RvV3JpdGUtNDtmb3IodmFyIGk9MDtpPHN0ci5sZW5ndGg7KytpKXt2YXIgY29kZVVuaXQ9c3RyLmNoYXJDb2RlQXQoaSk7aWYoY29kZVVuaXQ+PTU1Mjk2JiZjb2RlVW5pdDw9NTczNDMpe3ZhciB0cmFpbFN1cnJvZ2F0ZT1zdHIuY2hhckNvZGVBdCgrK2kpO2NvZGVVbml0PTY1NTM2KygoY29kZVVuaXQmMTAyMyk8PDEwKXx0cmFpbFN1cnJvZ2F0ZSYxMDIzO31IRUFQMzJbb3V0UHRyPj4yXT1jb2RlVW5pdDtvdXRQdHIrPTQ7aWYob3V0UHRyKzQ+ZW5kUHRyKWJyZWFrfUhFQVAzMltvdXRQdHI+PjJdPTA7cmV0dXJuIG91dFB0ci1zdGFydFB0cn07dmFyIGxlbmd0aEJ5dGVzVVRGMzI9c3RyPT57dmFyIGxlbj0wO2Zvcih2YXIgaT0wO2k8c3RyLmxlbmd0aDsrK2kpe3ZhciBjb2RlVW5pdD1zdHIuY2hhckNvZGVBdChpKTtpZihjb2RlVW5pdD49NTUyOTYmJmNvZGVVbml0PD01NzM0MykrK2k7bGVuKz00O31yZXR1cm4gbGVufTt2YXIgX19lbWJpbmRfcmVnaXN0ZXJfc3RkX3dzdHJpbmc9KHJhd1R5cGUsY2hhclNpemUsbmFtZSk9PntuYW1lPXJlYWRMYXRpbjFTdHJpbmcobmFtZSk7dmFyIGRlY29kZVN0cmluZyxlbmNvZGVTdHJpbmcsZ2V0SGVhcCxsZW5ndGhCeXRlc1VURixzaGlmdDtpZihjaGFyU2l6ZT09PTIpe2RlY29kZVN0cmluZz1VVEYxNlRvU3RyaW5nO2VuY29kZVN0cmluZz1zdHJpbmdUb1VURjE2O2xlbmd0aEJ5dGVzVVRGPWxlbmd0aEJ5dGVzVVRGMTY7Z2V0SGVhcD0oKT0+SEVBUFUxNjtzaGlmdD0xO31lbHNlIGlmKGNoYXJTaXplPT09NCl7ZGVjb2RlU3RyaW5nPVVURjMyVG9TdHJpbmc7ZW5jb2RlU3RyaW5nPXN0cmluZ1RvVVRGMzI7bGVuZ3RoQnl0ZXNVVEY9bGVuZ3RoQnl0ZXNVVEYzMjtnZXRIZWFwPSgpPT5IRUFQVTMyO3NoaWZ0PTI7fXJlZ2lzdGVyVHlwZShyYXdUeXBlLHtuYW1lOm5hbWUsImZyb21XaXJlVHlwZSI6dmFsdWU9Pnt2YXIgbGVuZ3RoPUhFQVBVMzJbdmFsdWU+PjJdO3ZhciBIRUFQPWdldEhlYXAoKTt2YXIgc3RyO3ZhciBkZWNvZGVTdGFydFB0cj12YWx1ZSs0O2Zvcih2YXIgaT0wO2k8PWxlbmd0aDsrK2kpe3ZhciBjdXJyZW50Qnl0ZVB0cj12YWx1ZSs0K2kqY2hhclNpemU7aWYoaT09bGVuZ3RofHxIRUFQW2N1cnJlbnRCeXRlUHRyPj5zaGlmdF09PTApe3ZhciBtYXhSZWFkQnl0ZXM9Y3VycmVudEJ5dGVQdHItZGVjb2RlU3RhcnRQdHI7dmFyIHN0cmluZ1NlZ21lbnQ9ZGVjb2RlU3RyaW5nKGRlY29kZVN0YXJ0UHRyLG1heFJlYWRCeXRlcyk7aWYoc3RyPT09dW5kZWZpbmVkKXtzdHI9c3RyaW5nU2VnbWVudDt9ZWxzZSB7c3RyKz1TdHJpbmcuZnJvbUNoYXJDb2RlKDApO3N0cis9c3RyaW5nU2VnbWVudDt9ZGVjb2RlU3RhcnRQdHI9Y3VycmVudEJ5dGVQdHIrY2hhclNpemU7fX1fZnJlZSh2YWx1ZSk7cmV0dXJuIHN0cn0sInRvV2lyZVR5cGUiOihkZXN0cnVjdG9ycyx2YWx1ZSk9PntpZighKHR5cGVvZiB2YWx1ZT09InN0cmluZyIpKXt0aHJvd0JpbmRpbmdFcnJvcihgQ2Fubm90IHBhc3Mgbm9uLXN0cmluZyB0byBDKysgc3RyaW5nIHR5cGUgJHtuYW1lfWApO312YXIgbGVuZ3RoPWxlbmd0aEJ5dGVzVVRGKHZhbHVlKTt2YXIgcHRyPV9tYWxsb2MoNCtsZW5ndGgrY2hhclNpemUpO0hFQVBVMzJbcHRyPj4yXT1sZW5ndGg+PnNoaWZ0O2VuY29kZVN0cmluZyh2YWx1ZSxwdHIrNCxsZW5ndGgrY2hhclNpemUpO2lmKGRlc3RydWN0b3JzIT09bnVsbCl7ZGVzdHJ1Y3RvcnMucHVzaChfZnJlZSxwdHIpO31yZXR1cm4gcHRyfSwiYXJnUGFja0FkdmFuY2UiOkdlbmVyaWNXaXJlVHlwZVNpemUsInJlYWRWYWx1ZUZyb21Qb2ludGVyIjpzaW1wbGVSZWFkVmFsdWVGcm9tUG9pbnRlcixkZXN0cnVjdG9yRnVuY3Rpb24ocHRyKXtfZnJlZShwdHIpO319KTt9O3ZhciBfX2VtYmluZF9yZWdpc3Rlcl92b2lkPShyYXdUeXBlLG5hbWUpPT57bmFtZT1yZWFkTGF0aW4xU3RyaW5nKG5hbWUpO3JlZ2lzdGVyVHlwZShyYXdUeXBlLHtpc1ZvaWQ6dHJ1ZSxuYW1lOm5hbWUsImFyZ1BhY2tBZHZhbmNlIjowLCJmcm9tV2lyZVR5cGUiOigpPT51bmRlZmluZWQsInRvV2lyZVR5cGUiOihkZXN0cnVjdG9ycyxvKT0+dW5kZWZpbmVkfSk7fTt2YXIgZ2V0SGVhcE1heD0oKT0+MjE0NzQ4MzY0ODt2YXIgZ3Jvd01lbW9yeT1zaXplPT57dmFyIGI9d2FzbU1lbW9yeS5idWZmZXI7dmFyIHBhZ2VzPShzaXplLWIuYnl0ZUxlbmd0aCs2NTUzNSkvNjU1MzY7dHJ5e3dhc21NZW1vcnkuZ3JvdyhwYWdlcyk7dXBkYXRlTWVtb3J5Vmlld3MoKTtyZXR1cm4gMX1jYXRjaChlKXt9fTt2YXIgX2Vtc2NyaXB0ZW5fcmVzaXplX2hlYXA9cmVxdWVzdGVkU2l6ZT0+e3ZhciBvbGRTaXplPUhFQVBVOC5sZW5ndGg7cmVxdWVzdGVkU2l6ZT4+Pj0wO3ZhciBtYXhIZWFwU2l6ZT1nZXRIZWFwTWF4KCk7aWYocmVxdWVzdGVkU2l6ZT5tYXhIZWFwU2l6ZSl7cmV0dXJuIGZhbHNlfXZhciBhbGlnblVwPSh4LG11bHRpcGxlKT0+eCsobXVsdGlwbGUteCVtdWx0aXBsZSklbXVsdGlwbGU7Zm9yKHZhciBjdXREb3duPTE7Y3V0RG93bjw9NDtjdXREb3duKj0yKXt2YXIgb3Zlckdyb3duSGVhcFNpemU9b2xkU2l6ZSooMSsuMi9jdXREb3duKTtvdmVyR3Jvd25IZWFwU2l6ZT1NYXRoLm1pbihvdmVyR3Jvd25IZWFwU2l6ZSxyZXF1ZXN0ZWRTaXplKzEwMDY2MzI5Nik7dmFyIG5ld1NpemU9TWF0aC5taW4obWF4SGVhcFNpemUsYWxpZ25VcChNYXRoLm1heChyZXF1ZXN0ZWRTaXplLG92ZXJHcm93bkhlYXBTaXplKSw2NTUzNikpO3ZhciByZXBsYWNlbWVudD1ncm93TWVtb3J5KG5ld1NpemUpO2lmKHJlcGxhY2VtZW50KXtyZXR1cm4gdHJ1ZX19cmV0dXJuIGZhbHNlfTtlbWJpbmRfaW5pdF9jaGFyQ29kZXMoKTtCaW5kaW5nRXJyb3I9TW9kdWxlWyJCaW5kaW5nRXJyb3IiXT1jbGFzcyBCaW5kaW5nRXJyb3IgZXh0ZW5kcyBFcnJvcntjb25zdHJ1Y3RvcihtZXNzYWdlKXtzdXBlcihtZXNzYWdlKTt0aGlzLm5hbWU9IkJpbmRpbmdFcnJvciI7fX07TW9kdWxlWyJJbnRlcm5hbEVycm9yIl09Y2xhc3MgSW50ZXJuYWxFcnJvciBleHRlbmRzIEVycm9ye2NvbnN0cnVjdG9yKG1lc3NhZ2Upe3N1cGVyKG1lc3NhZ2UpO3RoaXMubmFtZT0iSW50ZXJuYWxFcnJvciI7fX07aW5pdF9lbXZhbCgpO3ZhciB3YXNtSW1wb3J0cz17ZjpfX2VtYmluZF9yZWdpc3Rlcl9iaWdpbnQsaTpfX2VtYmluZF9yZWdpc3Rlcl9ib29sLGg6X19lbWJpbmRfcmVnaXN0ZXJfZW12YWwsZTpfX2VtYmluZF9yZWdpc3Rlcl9mbG9hdCxiOl9fZW1iaW5kX3JlZ2lzdGVyX2ludGVnZXIsYTpfX2VtYmluZF9yZWdpc3Rlcl9tZW1vcnlfdmlldyxkOl9fZW1iaW5kX3JlZ2lzdGVyX3N0ZF9zdHJpbmcsYzpfX2VtYmluZF9yZWdpc3Rlcl9zdGRfd3N0cmluZyxqOl9fZW1iaW5kX3JlZ2lzdGVyX3ZvaWQsZzpfZW1zY3JpcHRlbl9yZXNpemVfaGVhcH07dmFyIHdhc21FeHBvcnRzPWNyZWF0ZVdhc20oKTtNb2R1bGVbIl9wYWNrIl09KGEwLGExLGEyLGEzLGE0LGE1LGE2LGE3LGE4LGE5LGExMCk9PihNb2R1bGVbIl9wYWNrIl09d2FzbUV4cG9ydHNbIm0iXSkoYTAsYTEsYTIsYTMsYTQsYTUsYTYsYTcsYTgsYTksYTEwKTt2YXIgX21hbGxvYz1Nb2R1bGVbIl9tYWxsb2MiXT1hMD0+KF9tYWxsb2M9TW9kdWxlWyJfbWFsbG9jIl09d2FzbUV4cG9ydHNbIm8iXSkoYTApO3ZhciBfZnJlZT1Nb2R1bGVbIl9mcmVlIl09YTA9PihfZnJlZT1Nb2R1bGVbIl9mcmVlIl09d2FzbUV4cG9ydHNbInAiXSkoYTApO3ZhciBjYWxsZWRSdW47ZGVwZW5kZW5jaWVzRnVsZmlsbGVkPWZ1bmN0aW9uIHJ1bkNhbGxlcigpe2lmKCFjYWxsZWRSdW4pcnVuKCk7aWYoIWNhbGxlZFJ1bilkZXBlbmRlbmNpZXNGdWxmaWxsZWQ9cnVuQ2FsbGVyO307ZnVuY3Rpb24gcnVuKCl7aWYocnVuRGVwZW5kZW5jaWVzPjApe3JldHVybn1wcmVSdW4oKTtpZihydW5EZXBlbmRlbmNpZXM+MCl7cmV0dXJufWZ1bmN0aW9uIGRvUnVuKCl7aWYoY2FsbGVkUnVuKXJldHVybjtjYWxsZWRSdW49dHJ1ZTtNb2R1bGVbImNhbGxlZFJ1biJdPXRydWU7aWYoQUJPUlQpcmV0dXJuO2luaXRSdW50aW1lKCk7cmVhZHlQcm9taXNlUmVzb2x2ZShNb2R1bGUpO2lmKE1vZHVsZVsib25SdW50aW1lSW5pdGlhbGl6ZWQiXSlNb2R1bGVbIm9uUnVudGltZUluaXRpYWxpemVkIl0oKTtwb3N0UnVuKCk7fWlmKE1vZHVsZVsic2V0U3RhdHVzIl0pe01vZHVsZVsic2V0U3RhdHVzIl0oIlJ1bm5pbmcuLi4iKTtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7c2V0VGltZW91dChmdW5jdGlvbigpe01vZHVsZVsic2V0U3RhdHVzIl0oIiIpO30sMSk7ZG9SdW4oKTt9LDEpO31lbHNlIHtkb1J1bigpO319aWYoTW9kdWxlWyJwcmVJbml0Il0pe2lmKHR5cGVvZiBNb2R1bGVbInByZUluaXQiXT09ImZ1bmN0aW9uIilNb2R1bGVbInByZUluaXQiXT1bTW9kdWxlWyJwcmVJbml0Il1dO3doaWxlKE1vZHVsZVsicHJlSW5pdCJdLmxlbmd0aD4wKXtNb2R1bGVbInByZUluaXQiXS5wb3AoKSgpO319cnVuKCk7CgoKICAgIHJldHVybiBtb2R1bGVBcmcucmVhZHkKICB9CiAgKTsKICB9KSgpOwoKICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueQogIGxldCB3YXNtTW9kdWxlOwogIGFzeW5jIGZ1bmN0aW9uIGluaXRXYXNtKCkgewogICAgICB3YXNtTW9kdWxlID0gYXdhaXQgbG9hZFdhc20oKTsKICB9CiAgbGV0IGFsbG9jYXRlZFZlcnRleENvdW50ID0gMDsKICBjb25zdCB1cGRhdGVRdWV1ZSA9IG5ldyBBcnJheSgpOwogIGxldCBydW5uaW5nID0gZmFsc2U7CiAgbGV0IGxvYWRpbmcgPSBmYWxzZTsKICBsZXQgcG9zaXRpb25zUHRyOwogIGxldCByb3RhdGlvbnNQdHI7CiAgbGV0IHNjYWxlc1B0cjsKICBsZXQgY29sb3JzUHRyOwogIGxldCBzZWxlY3Rpb25QdHI7CiAgbGV0IGRhdGFQdHI7CiAgbGV0IHdvcmxkUG9zaXRpb25zUHRyOwogIGxldCB3b3JsZFJvdGF0aW9uc1B0cjsKICBsZXQgd29ybGRTY2FsZXNQdHI7CiAgY29uc3QgcGFjayA9IGFzeW5jIChzcGxhdCkgPT4gewogICAgICB3aGlsZSAobG9hZGluZykgewogICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMCkpOwogICAgICB9CiAgICAgIGlmICghd2FzbU1vZHVsZSkgewogICAgICAgICAgbG9hZGluZyA9IHRydWU7CiAgICAgICAgICBhd2FpdCBpbml0V2FzbSgpOwogICAgICAgICAgbG9hZGluZyA9IGZhbHNlOwogICAgICB9CiAgICAgIGNvbnN0IHRhcmdldEFsbG9jYXRlZFZlcnRleENvdW50ID0gTWF0aC5wb3coMiwgTWF0aC5jZWlsKE1hdGgubG9nMihzcGxhdC52ZXJ0ZXhDb3VudCkpKTsKICAgICAgaWYgKHRhcmdldEFsbG9jYXRlZFZlcnRleENvdW50ID4gYWxsb2NhdGVkVmVydGV4Q291bnQpIHsKICAgICAgICAgIGlmIChhbGxvY2F0ZWRWZXJ0ZXhDb3VudCA+IDApIHsKICAgICAgICAgICAgICB3YXNtTW9kdWxlLl9mcmVlKHBvc2l0aW9uc1B0cik7CiAgICAgICAgICAgICAgd2FzbU1vZHVsZS5fZnJlZShyb3RhdGlvbnNQdHIpOwogICAgICAgICAgICAgIHdhc21Nb2R1bGUuX2ZyZWUoc2NhbGVzUHRyKTsKICAgICAgICAgICAgICB3YXNtTW9kdWxlLl9mcmVlKGNvbG9yc1B0cik7CiAgICAgICAgICAgICAgd2FzbU1vZHVsZS5fZnJlZShzZWxlY3Rpb25QdHIpOwogICAgICAgICAgICAgIHdhc21Nb2R1bGUuX2ZyZWUoZGF0YVB0cik7CiAgICAgICAgICAgICAgd2FzbU1vZHVsZS5fZnJlZSh3b3JsZFBvc2l0aW9uc1B0cik7CiAgICAgICAgICAgICAgd2FzbU1vZHVsZS5fZnJlZSh3b3JsZFJvdGF0aW9uc1B0cik7CiAgICAgICAgICAgICAgd2FzbU1vZHVsZS5fZnJlZSh3b3JsZFNjYWxlc1B0cik7CiAgICAgICAgICB9CiAgICAgICAgICBhbGxvY2F0ZWRWZXJ0ZXhDb3VudCA9IHRhcmdldEFsbG9jYXRlZFZlcnRleENvdW50OwogICAgICAgICAgcG9zaXRpb25zUHRyID0gd2FzbU1vZHVsZS5fbWFsbG9jKDMgKiBhbGxvY2F0ZWRWZXJ0ZXhDb3VudCAqIDQpOwogICAgICAgICAgcm90YXRpb25zUHRyID0gd2FzbU1vZHVsZS5fbWFsbG9jKDQgKiBhbGxvY2F0ZWRWZXJ0ZXhDb3VudCAqIDQpOwogICAgICAgICAgc2NhbGVzUHRyID0gd2FzbU1vZHVsZS5fbWFsbG9jKDMgKiBhbGxvY2F0ZWRWZXJ0ZXhDb3VudCAqIDQpOwogICAgICAgICAgY29sb3JzUHRyID0gd2FzbU1vZHVsZS5fbWFsbG9jKDQgKiBhbGxvY2F0ZWRWZXJ0ZXhDb3VudCk7CiAgICAgICAgICBzZWxlY3Rpb25QdHIgPSB3YXNtTW9kdWxlLl9tYWxsb2MoYWxsb2NhdGVkVmVydGV4Q291bnQpOwogICAgICAgICAgZGF0YVB0ciA9IHdhc21Nb2R1bGUuX21hbGxvYyg4ICogYWxsb2NhdGVkVmVydGV4Q291bnQgKiA0KTsKICAgICAgICAgIHdvcmxkUG9zaXRpb25zUHRyID0gd2FzbU1vZHVsZS5fbWFsbG9jKDMgKiBhbGxvY2F0ZWRWZXJ0ZXhDb3VudCAqIDQpOwogICAgICAgICAgd29ybGRSb3RhdGlvbnNQdHIgPSB3YXNtTW9kdWxlLl9tYWxsb2MoNCAqIGFsbG9jYXRlZFZlcnRleENvdW50ICogNCk7CiAgICAgICAgICB3b3JsZFNjYWxlc1B0ciA9IHdhc21Nb2R1bGUuX21hbGxvYygzICogYWxsb2NhdGVkVmVydGV4Q291bnQgKiA0KTsKICAgICAgfQogICAgICB3YXNtTW9kdWxlLkhFQVBGMzIuc2V0KHNwbGF0LnBvc2l0aW9ucywgcG9zaXRpb25zUHRyIC8gNCk7CiAgICAgIHdhc21Nb2R1bGUuSEVBUEYzMi5zZXQoc3BsYXQucm90YXRpb25zLCByb3RhdGlvbnNQdHIgLyA0KTsKICAgICAgd2FzbU1vZHVsZS5IRUFQRjMyLnNldChzcGxhdC5zY2FsZXMsIHNjYWxlc1B0ciAvIDQpOwogICAgICB3YXNtTW9kdWxlLkhFQVBVOC5zZXQoc3BsYXQuY29sb3JzLCBjb2xvcnNQdHIpOwogICAgICB3YXNtTW9kdWxlLkhFQVBVOC5zZXQoc3BsYXQuc2VsZWN0aW9uLCBzZWxlY3Rpb25QdHIpOwogICAgICB3YXNtTW9kdWxlLl9wYWNrKHNwbGF0LnNlbGVjdGVkLCBzcGxhdC52ZXJ0ZXhDb3VudCwgcG9zaXRpb25zUHRyLCByb3RhdGlvbnNQdHIsIHNjYWxlc1B0ciwgY29sb3JzUHRyLCBzZWxlY3Rpb25QdHIsIGRhdGFQdHIsIHdvcmxkUG9zaXRpb25zUHRyLCB3b3JsZFJvdGF0aW9uc1B0ciwgd29ybGRTY2FsZXNQdHIpOwogICAgICBjb25zdCBvdXREYXRhID0gbmV3IFVpbnQzMkFycmF5KHdhc21Nb2R1bGUuSEVBUFUzMi5idWZmZXIsIGRhdGFQdHIsIHNwbGF0LnZlcnRleENvdW50ICogOCk7CiAgICAgIGNvbnN0IGRldGFjaGVkRGF0YSA9IG5ldyBVaW50MzJBcnJheShvdXREYXRhLnNsaWNlKCkuYnVmZmVyKTsKICAgICAgY29uc3Qgd29ybGRQb3NpdGlvbnMgPSBuZXcgRmxvYXQzMkFycmF5KHdhc21Nb2R1bGUuSEVBUEYzMi5idWZmZXIsIHdvcmxkUG9zaXRpb25zUHRyLCBzcGxhdC52ZXJ0ZXhDb3VudCAqIDMpOwogICAgICBjb25zdCBkZXRhY2hlZFdvcmxkUG9zaXRpb25zID0gbmV3IEZsb2F0MzJBcnJheSh3b3JsZFBvc2l0aW9ucy5zbGljZSgpLmJ1ZmZlcik7CiAgICAgIGNvbnN0IHdvcmxkUm90YXRpb25zID0gbmV3IEZsb2F0MzJBcnJheSh3YXNtTW9kdWxlLkhFQVBGMzIuYnVmZmVyLCB3b3JsZFJvdGF0aW9uc1B0ciwgc3BsYXQudmVydGV4Q291bnQgKiA0KTsKICAgICAgY29uc3QgZGV0YWNoZWRXb3JsZFJvdGF0aW9ucyA9IG5ldyBGbG9hdDMyQXJyYXkod29ybGRSb3RhdGlvbnMuc2xpY2UoKS5idWZmZXIpOwogICAgICBjb25zdCB3b3JsZFNjYWxlcyA9IG5ldyBGbG9hdDMyQXJyYXkod2FzbU1vZHVsZS5IRUFQRjMyLmJ1ZmZlciwgd29ybGRTY2FsZXNQdHIsIHNwbGF0LnZlcnRleENvdW50ICogMyk7CiAgICAgIGNvbnN0IGRldGFjaGVkV29ybGRTY2FsZXMgPSBuZXcgRmxvYXQzMkFycmF5KHdvcmxkU2NhbGVzLnNsaWNlKCkuYnVmZmVyKTsKICAgICAgY29uc3QgcmVzcG9uc2UgPSB7CiAgICAgICAgICBkYXRhOiBkZXRhY2hlZERhdGEsCiAgICAgICAgICB3b3JsZFBvc2l0aW9uczogZGV0YWNoZWRXb3JsZFBvc2l0aW9ucywKICAgICAgICAgIHdvcmxkUm90YXRpb25zOiBkZXRhY2hlZFdvcmxkUm90YXRpb25zLAogICAgICAgICAgd29ybGRTY2FsZXM6IGRldGFjaGVkV29ybGRTY2FsZXMsCiAgICAgICAgICBvZmZzZXQ6IHNwbGF0Lm9mZnNldCwKICAgICAgICAgIHZlcnRleENvdW50OiBzcGxhdC52ZXJ0ZXhDb3VudCwKICAgICAgICAgIHBvc2l0aW9uczogc3BsYXQucG9zaXRpb25zLmJ1ZmZlciwKICAgICAgICAgIHJvdGF0aW9uczogc3BsYXQucm90YXRpb25zLmJ1ZmZlciwKICAgICAgICAgIHNjYWxlczogc3BsYXQuc2NhbGVzLmJ1ZmZlciwKICAgICAgICAgIGNvbG9yczogc3BsYXQuY29sb3JzLmJ1ZmZlciwKICAgICAgICAgIHNlbGVjdGlvbjogc3BsYXQuc2VsZWN0aW9uLmJ1ZmZlciwKICAgICAgfTsKICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7IHJlc3BvbnNlOiByZXNwb25zZSB9LCBbCiAgICAgICAgICByZXNwb25zZS5kYXRhLmJ1ZmZlciwKICAgICAgICAgIHJlc3BvbnNlLndvcmxkUG9zaXRpb25zLmJ1ZmZlciwKICAgICAgICAgIHJlc3BvbnNlLndvcmxkUm90YXRpb25zLmJ1ZmZlciwKICAgICAgICAgIHJlc3BvbnNlLndvcmxkU2NhbGVzLmJ1ZmZlciwKICAgICAgICAgIHJlc3BvbnNlLnBvc2l0aW9ucywKICAgICAgICAgIHJlc3BvbnNlLnJvdGF0aW9ucywKICAgICAgICAgIHJlc3BvbnNlLnNjYWxlcywKICAgICAgICAgIHJlc3BvbnNlLmNvbG9ycywKICAgICAgICAgIHJlc3BvbnNlLnNlbGVjdGlvbiwKICAgICAgXSk7CiAgICAgIHJ1bm5pbmcgPSBmYWxzZTsKICB9OwogIGNvbnN0IHBhY2tUaHJvdHRsZWQgPSAoKSA9PiB7CiAgICAgIGlmICh1cGRhdGVRdWV1ZS5sZW5ndGggPT09IDApCiAgICAgICAgICByZXR1cm47CiAgICAgIGlmICghcnVubmluZykgewogICAgICAgICAgcnVubmluZyA9IHRydWU7CiAgICAgICAgICBjb25zdCBzcGxhdCA9IHVwZGF0ZVF1ZXVlLnNoaWZ0KCk7CiAgICAgICAgICBwYWNrKHNwbGF0KTsKICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gewogICAgICAgICAgICAgIHJ1bm5pbmcgPSBmYWxzZTsKICAgICAgICAgICAgICBwYWNrVGhyb3R0bGVkKCk7CiAgICAgICAgICB9LCAwKTsKICAgICAgfQogIH07CiAgc2VsZi5vbm1lc3NhZ2UgPSAoZSkgPT4gewogICAgICBpZiAoZS5kYXRhLnNwbGF0KSB7CiAgICAgICAgICBjb25zdCBzcGxhdCA9IGUuZGF0YS5zcGxhdDsKICAgICAgICAgIGZvciAoY29uc3QgW2luZGV4LCBleGlzdGluZ10gb2YgdXBkYXRlUXVldWUuZW50cmllcygpKSB7CiAgICAgICAgICAgICAgaWYgKGV4aXN0aW5nLm9mZnNldCA9PT0gc3BsYXQub2Zmc2V0KSB7CiAgICAgICAgICAgICAgICAgIHVwZGF0ZVF1ZXVlW2luZGV4XSA9IHNwbGF0OwogICAgICAgICAgICAgICAgICByZXR1cm47CiAgICAgICAgICAgICAgfQogICAgICAgICAgfQogICAgICAgICAgdXBkYXRlUXVldWUucHVzaChzcGxhdCk7CiAgICAgICAgICBwYWNrVGhyb3R0bGVkKCk7CiAgICAgIH0KICB9OwoKfSkoKTsKLy8jIHNvdXJjZU1hcHBpbmdVUkw9RGF0YVdvcmtlci5qcy5tYXAKCg==',
    null,
    !1,
  ),
  J = function (A = {}) {
    var Q,
      F,
      U = A
    U.ready = new Promise((A, U) => {
      ;(Q = A), (F = U)
    })
    var l,
      B = Object.assign({}, U),
      t = ''
    ;(t =
      0 !== (t = self.location.href).indexOf('blob:')
        ? t.substr(0, t.replace(/[?#].*/, '').lastIndexOf('/') + 1)
        : ''),
      (l = (A) => {
        var Q = new XMLHttpRequest()
        return (
          Q.open('GET', A, !1),
          (Q.responseType = 'arraybuffer'),
          Q.send(null),
          new Uint8Array(Q.response)
        )
      }),
      U.print || console.log.bind(console)
    var d,
      n,
      e = U.printErr || console.error.bind(console)
    function Z(A) {
      if (X(A))
        return (function (A) {
          for (
            var Q = atob(A), F = new Uint8Array(Q.length), U = 0;
            U < Q.length;
            ++U
          )
            F[U] = Q.charCodeAt(U)
          return F
        })(A.slice(G.length))
    }
    Object.assign(U, B),
      (B = null),
      U.arguments && U.arguments,
      U.thisProgram && U.thisProgram,
      U.quit && U.quit,
      U.wasmBinary && (d = U.wasmBinary),
      'object' != typeof WebAssembly && E('no native wasm support detected')
    var V,
      I,
      R,
      a,
      i,
      g,
      C,
      c,
      W = !1
    function h() {
      var A = n.buffer
      ;(U.HEAP8 = V = new Int8Array(A)),
        (U.HEAP16 = R = new Int16Array(A)),
        (U.HEAPU8 = I = new Uint8Array(A)),
        (U.HEAPU16 = a = new Uint16Array(A)),
        (U.HEAP32 = i = new Int32Array(A)),
        (U.HEAPU32 = g = new Uint32Array(A)),
        (U.HEAPF32 = C = new Float32Array(A)),
        (U.HEAPF64 = c = new Float64Array(A))
    }
    var s = [],
      o = [],
      J = [],
      b = 0,
      r = null
    function E(A) {
      U.onAbort?.(A),
        e((A = 'Aborted(' + A + ')')),
        (W = !0),
        (A += '. Build with -sASSERTIONS for more info.')
      var Q = new WebAssembly.RuntimeError(A)
      throw (F(Q), Q)
    }
    var m,
      N,
      G = 'data:application/octet-stream;base64,',
      X = (A) => A.startsWith(G)
    function Y(A) {
      return Promise.resolve().then(() =>
        (function (A) {
          if (A == m && d) return new Uint8Array(d)
          var Q = Z(A)
          if (Q) return Q
          if (l) return l(A)
          throw 'both async and sync fetching of the wasm failed'
        })(A),
      )
    }
    function y(A, Q, F, U) {
      return (function (A, Q, F) {
        return Y(A)
          .then((A) => WebAssembly.instantiate(A, Q))
          .then((A) => A)
          .then(F, (A) => {
            e(`failed to asynchronously prepare wasm: ${A}`), E(A)
          })
      })(Q, F, U)
    }
    X(
      (m =
        'data:application/octet-stream;base64,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OjptZW1vcnlfdmlldzx1bnNpZ25lZCBzaG9ydD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8aW50PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1bnNpZ25lZCBpbnQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGZsb2F0PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1aW50OF90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQ4X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVpbnQxNl90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQxNl90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1aW50NjRfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8aW50NjRfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dWludDMyX3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGludDMyX3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGNoYXI+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVuc2lnbmVkIGNoYXI+AHN0ZDo6YmFzaWNfc3RyaW5nPHVuc2lnbmVkIGNoYXI+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHNpZ25lZCBjaGFyPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxsb25nPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1bnNpZ25lZCBsb25nPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxkb3VibGU+AE5TdDNfXzIxMmJhc2ljX3N0cmluZ0ljTlNfMTFjaGFyX3RyYWl0c0ljRUVOU185YWxsb2NhdG9ySWNFRUVFAAAAAJQMAAAyBwAATlN0M19fMjEyYmFzaWNfc3RyaW5nSWhOU18xMWNoYXJfdHJhaXRzSWhFRU5TXzlhbGxvY2F0b3JJaEVFRUUAAJQMAAB8BwAATlN0M19fMjEyYmFzaWNfc3RyaW5nSXdOU18xMWNoYXJfdHJhaXRzSXdFRU5TXzlhbGxvY2F0b3JJd0VFRUUAAJQMAADEBwAATlN0M19fMjEyYmFzaWNfc3RyaW5nSURzTlNfMTFjaGFyX3RyYWl0c0lEc0VFTlNfOWFsbG9jYXRvcklEc0VFRUUAAACUDAAADAgAAE5TdDNfXzIxMmJhc2ljX3N0cmluZ0lEaU5TXzExY2hhcl90cmFpdHNJRGlFRU5TXzlhbGxvY2F0b3JJRGlFRUVFAAAAlAwAAFgIAABOMTBlbXNjcmlwdGVuM3ZhbEUAAJQMAACkCAAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJY0VFAACUDAAAwAgAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWFFRQAAlAwAAOgIAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0loRUUAAJQMAAAQCQAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJc0VFAACUDAAAOAkAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SXRFRQAAlAwAAGAJAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0lpRUUAAJQMAACICQAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJakVFAACUDAAAsAkAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWxFRQAAlAwAANgJAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0ltRUUAAJQMAAAACgAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJeEVFAACUDAAAKAoAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SXlFRQAAlAwAAFAKAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0lmRUUAAJQMAAB4CgAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJZEVFAACUDAAAoAoAAE4xMF9fY3h4YWJpdjExNl9fc2hpbV90eXBlX2luZm9FAAAAALwMAADICgAAIA0AAE4xMF9fY3h4YWJpdjExN19fY2xhc3NfdHlwZV9pbmZvRQAAALwMAAD4CgAA7AoAAE4xMF9fY3h4YWJpdjExN19fcGJhc2VfdHlwZV9pbmZvRQAAALwMAAAoCwAA7AoAAE4xMF9fY3h4YWJpdjExOV9fcG9pbnRlcl90eXBlX2luZm9FALwMAABYCwAATAsAAAAAAADMCwAAAgAAAAMAAAAEAAAABQAAAAYAAABOMTBfX2N4eGFiaXYxMjNfX2Z1bmRhbWVudGFsX3R5cGVfaW5mb0UAvAwAAKQLAADsCgAAdgAAAJALAADYCwAAYgAAAJALAADkCwAAYwAAAJALAADwCwAAaAAAAJALAAD8CwAAYQAAAJALAAAIDAAAcwAAAJALAAAUDAAAdAAAAJALAAAgDAAAaQAAAJALAAAsDAAAagAAAJALAAA4DAAAbAAAAJALAABEDAAAbQAAAJALAABQDAAAeAAAAJALAABcDAAAeQAAAJALAABoDAAAZgAAAJALAAB0DAAAZAAAAJALAACADAAAAAAAABwLAAACAAAABwAAAAQAAAAFAAAACAAAAAkAAAAKAAAACwAAAAAAAAAEDQAAAgAAAAwAAAAEAAAABQAAAAgAAAANAAAADgAAAA8AAABOMTBfX2N4eGFiaXYxMjBfX3NpX2NsYXNzX3R5cGVfaW5mb0UAAAAAvAwAANwMAAAcCwAAU3Q5dHlwZV9pbmZvAAAAAJQMAAAQDQBBqBoLAzAPAQ=='),
    ) || ((N = m), (m = U.locateFile ? U.locateFile(N, t) : t + N))
    var p = (A) => {
      for (; A.length > 0; ) A.shift()(U)
    }
    U.noExitRuntime
    var S,
      k,
      u = (A) => {
        for (var Q = '', F = A; I[F]; ) Q += S[I[F++]]
        return Q
      },
      T = {},
      H = {},
      D = (A) => {
        throw new k(A)
      }
    function w(A, Q, F = {}) {
      if (!('argPackAdvance' in Q))
        throw new TypeError(
          'registerType registeredInstance requires argPackAdvance',
        )
      return (function (A, Q, F = {}) {
        var U = Q.name
        if (
          (A || D(`type "${U}" must have a positive integer typeid pointer`),
          H.hasOwnProperty(A))
        ) {
          if (F.ignoreDuplicateRegistrations) return
          D(`Cannot register type '${U}' twice`)
        }
        if (((H[A] = Q), T.hasOwnProperty(A))) {
          var l = T[A]
          delete T[A], l.forEach((A) => A())
        }
      })(A, Q, F)
    }
    var f = new (class {
        constructor() {
          ;(this.allocated = [void 0]), (this.freelist = [])
        }
        get(A) {
          return this.allocated[A]
        }
        has(A) {
          return void 0 !== this.allocated[A]
        }
        allocate(A) {
          var Q = this.freelist.pop() || this.allocated.length
          return (this.allocated[Q] = A), Q
        }
        free(A) {
          ;(this.allocated[A] = void 0), this.freelist.push(A)
        }
      })(),
      x = () => {
        for (var A = 0, Q = f.reserved; Q < f.allocated.length; ++Q)
          void 0 !== f.allocated[Q] && ++A
        return A
      },
      M = (A) => (
        A || D('Cannot use deleted val. handle = ' + A), f.get(A).value
      ),
      v = (A) => {
        switch (A) {
          case void 0:
            return 1
          case null:
            return 2
          case !0:
            return 3
          case !1:
            return 4
          default:
            return f.allocate({ refcount: 1, value: A })
        }
      }
    function z(A) {
      return this.fromWireType(i[A >> 2])
    }
    var K = {
        name: 'emscripten::val',
        fromWireType: (A) => {
          var Q = M(A)
          return (
            ((A) => {
              A >= f.reserved && 0 == --f.get(A).refcount && f.free(A)
            })(A),
            Q
          )
        },
        toWireType: (A, Q) => v(Q),
        argPackAdvance: 8,
        readValueFromPointer: z,
        destructorFunction: null,
      },
      j = (A, Q) => {
        switch (Q) {
          case 4:
            return function (A) {
              return this.fromWireType(C[A >> 2])
            }
          case 8:
            return function (A) {
              return this.fromWireType(c[A >> 3])
            }
          default:
            throw new TypeError(`invalid float width (${Q}): ${A}`)
        }
      },
      O = (A, Q, F) => {
        switch (Q) {
          case 1:
            return F ? (A) => V[A >> 0] : (A) => I[A >> 0]
          case 2:
            return F ? (A) => R[A >> 1] : (A) => a[A >> 1]
          case 4:
            return F ? (A) => i[A >> 2] : (A) => g[A >> 2]
          default:
            throw new TypeError(`invalid integer width (${Q}): ${A}`)
        }
      }
    function L(A) {
      return this.fromWireType(g[A >> 2])
    }
    var P =
        'undefined' != typeof TextDecoder ? new TextDecoder('utf8') : void 0,
      _ = (A, Q) =>
        A
          ? ((A, Q, F) => {
              for (var U = Q + F, l = Q; A[l] && !(l >= U); ) ++l
              if (l - Q > 16 && A.buffer && P) return P.decode(A.subarray(Q, l))
              for (var B = ''; Q < l; ) {
                var t = A[Q++]
                if (128 & t) {
                  var d = 63 & A[Q++]
                  if (192 != (224 & t)) {
                    var n = 63 & A[Q++]
                    if (
                      (t =
                        224 == (240 & t)
                          ? ((15 & t) << 12) | (d << 6) | n
                          : ((7 & t) << 18) |
                            (d << 12) |
                            (n << 6) |
                            (63 & A[Q++])) < 65536
                    )
                      B += String.fromCharCode(t)
                    else {
                      var e = t - 65536
                      B += String.fromCharCode(
                        55296 | (e >> 10),
                        56320 | (1023 & e),
                      )
                    }
                  } else B += String.fromCharCode(((31 & t) << 6) | d)
                } else B += String.fromCharCode(t)
              }
              return B
            })(I, A, Q)
          : '',
      q =
        'undefined' != typeof TextDecoder
          ? new TextDecoder('utf-16le')
          : void 0,
      $ = (A, Q) => {
        for (var F = A, U = F >> 1, l = U + Q / 2; !(U >= l) && a[U]; ) ++U
        if ((F = U << 1) - A > 32 && q) return q.decode(I.subarray(A, F))
        for (var B = '', t = 0; !(t >= Q / 2); ++t) {
          var d = R[(A + 2 * t) >> 1]
          if (0 == d) break
          B += String.fromCharCode(d)
        }
        return B
      },
      AA = (A, Q, F) => {
        if (((F ??= 2147483647), F < 2)) return 0
        for (
          var U = Q, l = (F -= 2) < 2 * A.length ? F / 2 : A.length, B = 0;
          B < l;
          ++B
        ) {
          var t = A.charCodeAt(B)
          ;(R[Q >> 1] = t), (Q += 2)
        }
        return (R[Q >> 1] = 0), Q - U
      },
      QA = (A) => 2 * A.length,
      FA = (A, Q) => {
        for (var F = 0, U = ''; !(F >= Q / 4); ) {
          var l = i[(A + 4 * F) >> 2]
          if (0 == l) break
          if ((++F, l >= 65536)) {
            var B = l - 65536
            U += String.fromCharCode(55296 | (B >> 10), 56320 | (1023 & B))
          } else U += String.fromCharCode(l)
        }
        return U
      },
      UA = (A, Q, F) => {
        if (((F ??= 2147483647), F < 4)) return 0
        for (var U = Q, l = U + F - 4, B = 0; B < A.length; ++B) {
          var t = A.charCodeAt(B)
          if (
            (t >= 55296 &&
              t <= 57343 &&
              (t = (65536 + ((1023 & t) << 10)) | (1023 & A.charCodeAt(++B))),
            (i[Q >> 2] = t),
            (Q += 4) + 4 > l)
          )
            break
        }
        return (i[Q >> 2] = 0), Q - U
      },
      lA = (A) => {
        for (var Q = 0, F = 0; F < A.length; ++F) {
          var U = A.charCodeAt(F)
          U >= 55296 && U <= 57343 && ++F, (Q += 4)
        }
        return Q
      },
      BA = (A) => {
        var Q = (A - n.buffer.byteLength + 65535) / 65536
        try {
          return n.grow(Q), h(), 1
        } catch (A) {}
      }
    ;(() => {
      for (var A = new Array(256), Q = 0; Q < 256; ++Q)
        A[Q] = String.fromCharCode(Q)
      S = A
    })(),
      (k = U.BindingError = class extends Error {
        constructor(A) {
          super(A), (this.name = 'BindingError')
        }
      }),
      (U.InternalError = class extends Error {
        constructor(A) {
          super(A), (this.name = 'InternalError')
        }
      }),
      f.allocated.push(
        { value: void 0 },
        { value: null },
        { value: !0 },
        { value: !1 },
      ),
      Object.assign(f, { reserved: f.allocated.length }),
      (U.count_emval_handles = x)
    var tA = {
        f: (A, Q, F, U, l) => {},
        i: (A, Q, F, U) => {
          w(A, {
            name: (Q = u(Q)),
            fromWireType: function (A) {
              return !!A
            },
            toWireType: function (A, Q) {
              return Q ? F : U
            },
            argPackAdvance: 8,
            readValueFromPointer: function (A) {
              return this.fromWireType(I[A])
            },
            destructorFunction: null,
          })
        },
        h: (A) => w(A, K),
        e: (A, Q, F) => {
          w(A, {
            name: (Q = u(Q)),
            fromWireType: (A) => A,
            toWireType: (A, Q) => Q,
            argPackAdvance: 8,
            readValueFromPointer: j(Q, F),
            destructorFunction: null,
          })
        },
        b: (A, Q, F, U, l) => {
          Q = u(Q)
          var B = (A) => A
          if (0 === U) {
            var t = 32 - 8 * F
            B = (A) => (A << t) >>> t
          }
          var d = Q.includes('unsigned')
          w(A, {
            name: Q,
            fromWireType: B,
            toWireType: d
              ? function (A, Q) {
                  return this.name, Q >>> 0
                }
              : function (A, Q) {
                  return this.name, Q
                },
            argPackAdvance: 8,
            readValueFromPointer: O(Q, F, 0 !== U),
            destructorFunction: null,
          })
        },
        a: (A, Q, F) => {
          var U = [
            Int8Array,
            Uint8Array,
            Int16Array,
            Uint16Array,
            Int32Array,
            Uint32Array,
            Float32Array,
            Float64Array,
          ][Q]
          function l(A) {
            var Q = g[A >> 2],
              F = g[(A + 4) >> 2]
            return new U(V.buffer, F, Q)
          }
          w(
            A,
            {
              name: (F = u(F)),
              fromWireType: l,
              argPackAdvance: 8,
              readValueFromPointer: l,
            },
            { ignoreDuplicateRegistrations: !0 },
          )
        },
        d: (A, Q) => {
          var F = 'std::string' === (Q = u(Q))
          w(A, {
            name: Q,
            fromWireType(A) {
              var Q,
                U = g[A >> 2],
                l = A + 4
              if (F)
                for (var B = l, t = 0; t <= U; ++t) {
                  var d = l + t
                  if (t == U || 0 == I[d]) {
                    var n = _(B, d - B)
                    void 0 === Q
                      ? (Q = n)
                      : ((Q += String.fromCharCode(0)), (Q += n)),
                      (B = d + 1)
                  }
                }
              else {
                var e = new Array(U)
                for (t = 0; t < U; ++t) e[t] = String.fromCharCode(I[l + t])
                Q = e.join('')
              }
              return ZA(A), Q
            },
            toWireType(A, Q) {
              var U
              Q instanceof ArrayBuffer && (Q = new Uint8Array(Q))
              var l = 'string' == typeof Q
              l ||
                Q instanceof Uint8Array ||
                Q instanceof Uint8ClampedArray ||
                Q instanceof Int8Array ||
                D('Cannot pass non-string to std::string'),
                (U =
                  F && l
                    ? ((A) => {
                        for (var Q = 0, F = 0; F < A.length; ++F) {
                          var U = A.charCodeAt(F)
                          U <= 127
                            ? Q++
                            : U <= 2047
                            ? (Q += 2)
                            : U >= 55296 && U <= 57343
                            ? ((Q += 4), ++F)
                            : (Q += 3)
                        }
                        return Q
                      })(Q)
                    : Q.length)
              var B = eA(4 + U + 1),
                t = B + 4
              if (((g[B >> 2] = U), F && l))
                ((A, Q, F, U) => {
                  if (!(U > 0)) return 0
                  for (var l = F + U - 1, B = 0; B < A.length; ++B) {
                    var t = A.charCodeAt(B)
                    if (
                      (t >= 55296 &&
                        t <= 57343 &&
                        (t =
                          (65536 + ((1023 & t) << 10)) |
                          (1023 & A.charCodeAt(++B))),
                      t <= 127)
                    ) {
                      if (F >= l) break
                      Q[F++] = t
                    } else if (t <= 2047) {
                      if (F + 1 >= l) break
                      ;(Q[F++] = 192 | (t >> 6)), (Q[F++] = 128 | (63 & t))
                    } else if (t <= 65535) {
                      if (F + 2 >= l) break
                      ;(Q[F++] = 224 | (t >> 12)),
                        (Q[F++] = 128 | ((t >> 6) & 63)),
                        (Q[F++] = 128 | (63 & t))
                    } else {
                      if (F + 3 >= l) break
                      ;(Q[F++] = 240 | (t >> 18)),
                        (Q[F++] = 128 | ((t >> 12) & 63)),
                        (Q[F++] = 128 | ((t >> 6) & 63)),
                        (Q[F++] = 128 | (63 & t))
                    }
                  }
                  Q[F] = 0
                })(Q, I, t, U + 1)
              else if (l)
                for (var d = 0; d < U; ++d) {
                  var n = Q.charCodeAt(d)
                  n > 255 &&
                    (ZA(t),
                    D(
                      'String has UTF-16 code units that do not fit in 8 bits',
                    )),
                    (I[t + d] = n)
                }
              else for (d = 0; d < U; ++d) I[t + d] = Q[d]
              return null !== A && A.push(ZA, B), B
            },
            argPackAdvance: 8,
            readValueFromPointer: L,
            destructorFunction(A) {
              ZA(A)
            },
          })
        },
        c: (A, Q, F) => {
          var U, l, B, t, d
          ;(F = u(F)),
            2 === Q
              ? ((U = $), (l = AA), (t = QA), (B = () => a), (d = 1))
              : 4 === Q &&
                ((U = FA), (l = UA), (t = lA), (B = () => g), (d = 2)),
            w(A, {
              name: F,
              fromWireType: (A) => {
                for (
                  var F, l = g[A >> 2], t = B(), n = A + 4, e = 0;
                  e <= l;
                  ++e
                ) {
                  var Z = A + 4 + e * Q
                  if (e == l || 0 == t[Z >> d]) {
                    var V = U(n, Z - n)
                    void 0 === F
                      ? (F = V)
                      : ((F += String.fromCharCode(0)), (F += V)),
                      (n = Z + Q)
                  }
                }
                return ZA(A), F
              },
              toWireType: (A, U) => {
                'string' != typeof U &&
                  D(`Cannot pass non-string to C++ string type ${F}`)
                var B = t(U),
                  n = eA(4 + B + Q)
                return (
                  (g[n >> 2] = B >> d),
                  l(U, n + 4, B + Q),
                  null !== A && A.push(ZA, n),
                  n
                )
              },
              argPackAdvance: 8,
              readValueFromPointer: z,
              destructorFunction(A) {
                ZA(A)
              },
            })
        },
        j: (A, Q) => {
          w(A, {
            isVoid: !0,
            name: (Q = u(Q)),
            argPackAdvance: 0,
            fromWireType: () => {},
            toWireType: (A, Q) => {},
          })
        },
        g: (A) => {
          var Q = I.length,
            F = 2147483648
          if ((A >>>= 0) > F) return !1
          for (var U, l, B = 1; B <= 4; B *= 2) {
            var t = Q * (1 + 0.2 / B)
            t = Math.min(t, A + 100663296)
            var d = Math.min(
              F,
              (U = Math.max(A, t)) + (((l = 65536) - (U % l)) % l),
            )
            if (BA(d)) return !0
          }
          return !1
        },
      },
      dA = (function () {
        var A = { a: tA }
        function Q(A, Q) {
          var F
          return (
            (dA = A.exports),
            (n = dA.k),
            h(),
            (F = dA.l),
            o.unshift(F),
            (function (A) {
              if ((b--, U.monitorRunDependencies?.(b), 0 == b && r)) {
                var Q = r
                ;(r = null), Q()
              }
            })(),
            dA
          )
        }
        if ((b++, U.monitorRunDependencies?.(b), U.instantiateWasm))
          try {
            return U.instantiateWasm(A, Q)
          } catch (A) {
            e(`Module.instantiateWasm callback failed with error: ${A}`), F(A)
          }
        return (
          y(0, m, A, function (A) {
            Q(A.instance)
          }).catch(F),
          {}
        )
      })()
    U._pack = (A, Q, F, l, B, t, d, n, e, Z, V) =>
      (U._pack = dA.m)(A, Q, F, l, B, t, d, n, e, Z, V)
    var nA,
      eA = (U._malloc = (A) => (eA = U._malloc = dA.o)(A)),
      ZA = (U._free = (A) => (ZA = U._free = dA.p)(A))
    function VA() {
      function A() {
        nA ||
          ((nA = !0),
          (U.calledRun = !0),
          W ||
            (p(o),
            Q(U),
            U.onRuntimeInitialized && U.onRuntimeInitialized(),
            (function () {
              if (U.postRun)
                for (
                  'function' == typeof U.postRun && (U.postRun = [U.postRun]);
                  U.postRun.length;

                )
                  (A = U.postRun.shift()), J.unshift(A)
              var A
              p(J)
            })()))
      }
      b > 0 ||
        ((function () {
          if (U.preRun)
            for (
              'function' == typeof U.preRun && (U.preRun = [U.preRun]);
              U.preRun.length;

            )
              (A = U.preRun.shift()), s.unshift(A)
          var A
          p(s)
        })(),
        b > 0 ||
          (U.setStatus
            ? (U.setStatus('Running...'),
              setTimeout(function () {
                setTimeout(function () {
                  U.setStatus('')
                }, 1),
                  A()
              }, 1))
            : A()))
    }
    if (
      ((r = function A() {
        nA || VA(), nA || (r = A)
      }),
      U.preInit)
    )
      for (
        'function' == typeof U.preInit && (U.preInit = [U.preInit]);
        U.preInit.length > 0;

      )
        U.preInit.pop()()
    return VA(), A.ready
  }
class b {
  constructor(A) {
    ;(this.dataChanged = !1),
      (this.transformsChanged = !1),
      (this._updating = new Set()),
      (this._dirty = new Set())
    let Q = 0,
      F = 0
    ;(this._splatIndices = new Map()), (this._offsets = new Map())
    const U = new Map()
    for (const l of A.objects)
      l instanceof V &&
        (this._splatIndices.set(l, F),
        this._offsets.set(l, Q),
        U.set(Q, l),
        (Q += l.data.vertexCount),
        F++)
    ;(this._vertexCount = Q),
      (this._width = 2048),
      (this._height = Math.ceil((2 * this.vertexCount) / this.width)),
      (this._data = new Uint32Array(this.width * this.height * 4)),
      (this._transformsWidth = 5),
      (this._transformsHeight = U.size),
      (this._transforms = new Float32Array(
        this._transformsWidth * this._transformsHeight * 4,
      )),
      (this._transformIndicesWidth = 1024),
      (this._transformIndicesHeight = Math.ceil(
        this.vertexCount / this._transformIndicesWidth,
      )),
      (this._transformIndices = new Uint32Array(
        this._transformIndicesWidth * this._transformIndicesHeight,
      )),
      (this._positions = new Float32Array(3 * this.vertexCount)),
      (this._rotations = new Float32Array(4 * this.vertexCount)),
      (this._scales = new Float32Array(3 * this.vertexCount)),
      (this._worker = new o())
    const l = (A) => {
      const Q = this._splatIndices.get(A)
      this._transforms.set(A.transform.buffer, 20 * Q),
        (this._transforms[20 * Q + 16] = A.selected ? 1 : 0),
        (A.positionChanged = !1),
        (A.rotationChanged = !1),
        (A.scaleChanged = !1),
        (A.selectedChanged = !1),
        (this.transformsChanged = !0)
    }
    let B
    ;(this._worker.onmessage = (A) => {
      if (A.data.response) {
        const Q = A.data.response,
          F = U.get(Q.offset)
        l(F)
        const B = this._splatIndices.get(F)
        for (let A = 0; A < F.data.vertexCount; A++)
          this._transformIndices[Q.offset + A] = B
        this._data.set(Q.data, 8 * Q.offset),
          F.data.reattach(
            Q.positions,
            Q.rotations,
            Q.scales,
            Q.colors,
            Q.selection,
          ),
          this._positions.set(Q.worldPositions, 3 * Q.offset),
          this._rotations.set(Q.worldRotations, 4 * Q.offset),
          this._scales.set(Q.worldScales, 3 * Q.offset),
          this._updating.delete(F),
          (F.selectedChanged = !1),
          (this.dataChanged = !0)
      }
    }),
      (async function () {
        B = await J()
      })()
    const t = (A) => {
        if (!B)
          return void (async function () {
            for (; !B; ) await new Promise((A) => setTimeout(A, 0))
          })().then(() => {
            t(A)
          })
        l(A)
        const Q = B._malloc(3 * A.data.vertexCount * 4),
          F = B._malloc(4 * A.data.vertexCount * 4),
          U = B._malloc(3 * A.data.vertexCount * 4),
          d = B._malloc(4 * A.data.vertexCount),
          n = B._malloc(A.data.vertexCount),
          e = B._malloc(8 * A.data.vertexCount * 4),
          Z = B._malloc(3 * A.data.vertexCount * 4),
          V = B._malloc(4 * A.data.vertexCount * 4),
          I = B._malloc(3 * A.data.vertexCount * 4)
        B.HEAPF32.set(A.data.positions, Q / 4),
          B.HEAPF32.set(A.data.rotations, F / 4),
          B.HEAPF32.set(A.data.scales, U / 4),
          B.HEAPU8.set(A.data.colors, d),
          B.HEAPU8.set(A.data.selection, n),
          B._pack(A.selected, A.data.vertexCount, Q, F, U, d, n, e, Z, V, I)
        const R = new Uint32Array(B.HEAPU32.buffer, e, 8 * A.data.vertexCount),
          a = new Float32Array(B.HEAPF32.buffer, Z, 3 * A.data.vertexCount),
          i = new Float32Array(B.HEAPF32.buffer, V, 4 * A.data.vertexCount),
          g = new Float32Array(B.HEAPF32.buffer, I, 3 * A.data.vertexCount),
          C = this._splatIndices.get(A),
          c = this._offsets.get(A)
        for (let Q = 0; Q < A.data.vertexCount; Q++)
          this._transformIndices[c + Q] = C
        this._data.set(R, 8 * c),
          this._positions.set(a, 3 * c),
          this._rotations.set(i, 4 * c),
          this._scales.set(g, 3 * c),
          B._free(Q),
          B._free(F),
          B._free(U),
          B._free(d),
          B._free(n),
          B._free(e),
          B._free(Z),
          B._free(V),
          B._free(I),
          (this.dataChanged = !0)
      },
      d = (A) => {
        if (
          ((A.positionChanged ||
            A.rotationChanged ||
            A.scaleChanged ||
            A.selectedChanged) &&
            l(A),
          !A.data.changed || A.data.detached)
        )
          return
        const Q = {
          position: new Float32Array(A.position.flat()),
          rotation: new Float32Array(A.rotation.flat()),
          scale: new Float32Array(A.scale.flat()),
          selected: A.selected,
          vertexCount: A.data.vertexCount,
          positions: A.data.positions,
          rotations: A.data.rotations,
          scales: A.data.scales,
          colors: A.data.colors,
          selection: A.data.selection,
          offset: this._offsets.get(A),
        }
        this._worker.postMessage({ splat: Q }, [
          Q.position.buffer,
          Q.rotation.buffer,
          Q.scale.buffer,
          Q.positions.buffer,
          Q.rotations.buffer,
          Q.scales.buffer,
          Q.colors.buffer,
          Q.selection.buffer,
        ]),
          this._updating.add(A),
          (A.data.detached = !0)
      }
    ;(this.getSplat = (A) => {
      let Q = null
      for (const [F, U] of this._offsets) {
        if (!(A >= U)) break
        Q = F
      }
      return Q
    }),
      (this.getLocalIndex = (A, Q) => Q - this._offsets.get(A)),
      (this.markDirty = (A) => {
        this._dirty.add(A)
      }),
      (this.rebuild = () => {
        for (const A of this._dirty) d(A)
        this._dirty.clear()
      }),
      (this.dispose = () => {
        this._worker.terminate()
      })
    for (const A of this._splatIndices.keys()) t(A)
  }
  get offsets() {
    return this._offsets
  }
  get data() {
    return this._data
  }
  get width() {
    return this._width
  }
  get height() {
    return this._height
  }
  get transforms() {
    return this._transforms
  }
  get transformsWidth() {
    return this._transformsWidth
  }
  get transformsHeight() {
    return this._transformsHeight
  }
  get transformIndices() {
    return this._transformIndices
  }
  get transformIndicesWidth() {
    return this._transformIndicesWidth
  }
  get transformIndicesHeight() {
    return this._transformIndicesHeight
  }
  get positions() {
    return this._positions
  }
  get rotations() {
    return this._rotations
  }
  get scales() {
    return this._scales
  }
  get vertexCount() {
    return this._vertexCount
  }
  get needsRebuild() {
    return this._dirty.size > 0
  }
  get updating() {
    return this._updating.size > 0
  }
}
class r {
  constructor(A = 0, Q = 0, F = 0, U = 255) {
    ;(this.r = A), (this.g = Q), (this.b = F), (this.a = U)
  }
  flat() {
    return [this.r, this.g, this.b, this.a]
  }
  flatNorm() {
    return [this.r / 255, this.g / 255, this.b / 255, this.a / 255]
  }
  toHexString() {
    return (
      '#' +
      this.flat()
        .map((A) => A.toString(16).padStart(2, '0'))
        .join('')
    )
  }
  toString() {
    return `[${this.flat().join(', ')}]`
  }
}
class E extends s {
  constructor(A, Q) {
    super(A, Q),
      (this._outlineThickness = 10),
      (this._outlineColor = new r(255, 165, 0, 255)),
      (this._renderData = null),
      (this._depthIndex = new Uint32Array()),
      (this._chunks = null),
      (this._splatTexture = null)
    const F = A.canvas,
      U = A.gl
    let l, B, t, d, n, e, Z, I, R, a, i, g, C, c, W, s
    this._resize = () => {
      this._camera &&
        (this._camera.data.setSize(F.width, F.height),
        this._camera.update(),
        (B = U.getUniformLocation(this.program, 'projection')),
        U.uniformMatrix4fv(B, !1, this._camera.data.projectionMatrix.buffer),
        (t = U.getUniformLocation(this.program, 'viewport')),
        U.uniform2fv(t, new Float32Array([F.width, F.height])))
    }
    const o = () => {
      ;(l = new h()),
        (l.onmessage = (A) => {
          if (A.data.depthIndex) {
            const { depthIndex: Q, chunks: F } = A.data
            ;(this._depthIndex = Q),
              (this._chunks = F),
              U.bindBuffer(U.ARRAY_BUFFER, s),
              U.bufferData(U.ARRAY_BUFFER, Q, U.STATIC_DRAW)
          }
        })
    }
    this._initialize = () => {
      if (this._scene && this._camera) {
        this._resize(),
          this._scene.addEventListener('objectAdded', J),
          this._scene.addEventListener('objectRemoved', E)
        for (const A of this._scene.objects)
          A instanceof V && A.addEventListener('objectChanged', m)
        ;(this._renderData = new b(this._scene)),
          (d = U.getUniformLocation(this.program, 'focal')),
          U.uniform2fv(
            d,
            new Float32Array([this._camera.data.fx, this._camera.data.fy]),
          ),
          (n = U.getUniformLocation(this.program, 'view')),
          U.uniformMatrix4fv(n, !1, this._camera.data.viewMatrix.buffer),
          (R = U.getUniformLocation(this.program, 'outlineThickness')),
          U.uniform1f(R, this.outlineThickness),
          (a = U.getUniformLocation(this.program, 'outlineColor')),
          U.uniform4fv(a, new Float32Array(this.outlineColor.flatNorm())),
          (this._splatTexture = U.createTexture()),
          (e = U.getUniformLocation(this.program, 'u_texture')),
          U.uniform1i(e, 0),
          (C = U.createTexture()),
          (Z = U.getUniformLocation(this.program, 'u_transforms')),
          U.uniform1i(Z, 1),
          (c = U.createTexture()),
          (I = U.getUniformLocation(this.program, 'u_transformIndices')),
          U.uniform1i(I, 2),
          (W = U.createBuffer()),
          U.bindBuffer(U.ARRAY_BUFFER, W),
          U.bufferData(
            U.ARRAY_BUFFER,
            new Float32Array([-2, -2, 2, -2, 2, 2, -2, 2]),
            U.STATIC_DRAW,
          ),
          (i = U.getAttribLocation(this.program, 'position')),
          U.enableVertexAttribArray(i),
          U.vertexAttribPointer(i, 2, U.FLOAT, !1, 0, 0),
          (s = U.createBuffer()),
          (g = U.getAttribLocation(this.program, 'index')),
          U.enableVertexAttribArray(g),
          U.bindBuffer(U.ARRAY_BUFFER, s),
          o()
      } else console.error('Cannot render without scene and camera')
    }
    const J = (A) => {
        const Q = A
        Q.object instanceof V && Q.object.addEventListener('objectChanged', m),
          this.dispose()
      },
      E = (A) => {
        const Q = A
        Q.object instanceof V &&
          Q.object.removeEventListener('objectChanged', m),
          this.dispose()
      },
      m = (A) => {
        const Q = A
        Q.object instanceof V &&
          this._renderData &&
          this._renderData.markDirty(Q.object)
      }
    ;(this._render = () => {
      if (this._scene && this._camera && this.renderData) {
        if (
          (this.renderData.needsRebuild && this.renderData.rebuild(),
          this.renderData.dataChanged || this.renderData.transformsChanged)
        ) {
          this.renderData.dataChanged &&
            (U.activeTexture(U.TEXTURE0),
            U.bindTexture(U.TEXTURE_2D, this.splatTexture),
            U.texParameteri(U.TEXTURE_2D, U.TEXTURE_WRAP_S, U.CLAMP_TO_EDGE),
            U.texParameteri(U.TEXTURE_2D, U.TEXTURE_WRAP_T, U.CLAMP_TO_EDGE),
            U.texParameteri(U.TEXTURE_2D, U.TEXTURE_MIN_FILTER, U.NEAREST),
            U.texParameteri(U.TEXTURE_2D, U.TEXTURE_MAG_FILTER, U.NEAREST),
            U.texImage2D(
              U.TEXTURE_2D,
              0,
              U.RGBA32UI,
              this.renderData.width,
              this.renderData.height,
              0,
              U.RGBA_INTEGER,
              U.UNSIGNED_INT,
              this.renderData.data,
            )),
            this.renderData.transformsChanged &&
              (U.activeTexture(U.TEXTURE1),
              U.bindTexture(U.TEXTURE_2D, C),
              U.texParameteri(U.TEXTURE_2D, U.TEXTURE_WRAP_S, U.CLAMP_TO_EDGE),
              U.texParameteri(U.TEXTURE_2D, U.TEXTURE_WRAP_T, U.CLAMP_TO_EDGE),
              U.texParameteri(U.TEXTURE_2D, U.TEXTURE_MIN_FILTER, U.NEAREST),
              U.texParameteri(U.TEXTURE_2D, U.TEXTURE_MAG_FILTER, U.NEAREST),
              U.texImage2D(
                U.TEXTURE_2D,
                0,
                U.RGBA32F,
                this.renderData.transformsWidth,
                this.renderData.transformsHeight,
                0,
                U.RGBA,
                U.FLOAT,
                this.renderData.transforms,
              ),
              U.activeTexture(U.TEXTURE2),
              U.bindTexture(U.TEXTURE_2D, c),
              U.texParameteri(U.TEXTURE_2D, U.TEXTURE_WRAP_S, U.CLAMP_TO_EDGE),
              U.texParameteri(U.TEXTURE_2D, U.TEXTURE_WRAP_T, U.CLAMP_TO_EDGE),
              U.texParameteri(U.TEXTURE_2D, U.TEXTURE_MIN_FILTER, U.NEAREST),
              U.texParameteri(U.TEXTURE_2D, U.TEXTURE_MAG_FILTER, U.NEAREST),
              U.texImage2D(
                U.TEXTURE_2D,
                0,
                U.R32UI,
                this.renderData.transformIndicesWidth,
                this.renderData.transformIndicesHeight,
                0,
                U.RED_INTEGER,
                U.UNSIGNED_INT,
                this.renderData.transformIndices,
              ))
          const A = new Float32Array(this.renderData.positions.slice().buffer),
            Q = new Float32Array(this.renderData.transforms.slice().buffer),
            F = new Uint32Array(this.renderData.transformIndices.slice().buffer)
          l.postMessage(
            {
              sortData: {
                positions: A,
                transforms: Q,
                transformIndices: F,
                vertexCount: this.renderData.vertexCount,
              },
            },
            [A.buffer, Q.buffer, F.buffer],
          ),
            (this.renderData.dataChanged = !1),
            (this.renderData.transformsChanged = !1)
        }
        this._camera.update(),
          l.postMessage({ viewProj: this._camera.data.viewProj.buffer }),
          U.viewport(0, 0, F.width, F.height),
          U.clearColor(0, 0, 0, 0),
          U.clear(U.COLOR_BUFFER_BIT),
          U.disable(U.DEPTH_TEST),
          U.enable(U.BLEND),
          U.blendFuncSeparate(
            U.ONE_MINUS_DST_ALPHA,
            U.ONE,
            U.ONE_MINUS_DST_ALPHA,
            U.ONE,
          ),
          U.blendEquationSeparate(U.FUNC_ADD, U.FUNC_ADD),
          U.uniformMatrix4fv(B, !1, this._camera.data.projectionMatrix.buffer),
          U.uniformMatrix4fv(n, !1, this._camera.data.viewMatrix.buffer),
          U.bindBuffer(U.ARRAY_BUFFER, W),
          U.vertexAttribPointer(i, 2, U.FLOAT, !1, 0, 0),
          U.bindBuffer(U.ARRAY_BUFFER, s),
          U.bufferData(U.ARRAY_BUFFER, this.depthIndex, U.STATIC_DRAW),
          U.vertexAttribIPointer(g, 1, U.INT, 0, 0),
          U.vertexAttribDivisor(g, 1),
          U.drawArraysInstanced(
            U.TRIANGLE_FAN,
            0,
            4,
            this.renderData.vertexCount,
          )
      } else console.error('Cannot render without scene and camera')
    }),
      (this._dispose = () => {
        if (this._scene && this._camera && this.renderData) {
          this._scene.removeEventListener('objectAdded', J),
            this._scene.removeEventListener('objectRemoved', E)
          for (const A of this._scene.objects)
            A instanceof V && A.removeEventListener('objectChanged', m)
          l.terminate(),
            this.renderData.dispose(),
            U.deleteTexture(this.splatTexture),
            U.deleteTexture(C),
            U.deleteTexture(c),
            U.deleteBuffer(s),
            U.deleteBuffer(W)
        } else console.error('Cannot dispose without scene and camera')
      }),
      (this._setOutlineThickness = (A) => {
        ;(this._outlineThickness = A), this._initialized && U.uniform1f(R, A)
      }),
      (this._setOutlineColor = (A) => {
        ;(this._outlineColor = A),
          this._initialized && U.uniform4fv(a, new Float32Array(A.flatNorm()))
      })
  }
  get renderData() {
    return this._renderData
  }
  get depthIndex() {
    return this._depthIndex
  }
  get chunks() {
    return this._chunks
  }
  get splatTexture() {
    return this._splatTexture
  }
  get outlineThickness() {
    return this._outlineThickness
  }
  set outlineThickness(A) {
    this._setOutlineThickness(A)
  }
  get outlineColor() {
    return this._outlineColor
  }
  set outlineColor(A) {
    this._setOutlineColor(A)
  }
  _getVertexSource() {
    return '#version 300 es\nprecision highp float;\nprecision highp int;\n\nuniform highp usampler2D u_texture;\nuniform highp sampler2D u_transforms;\nuniform highp usampler2D u_transformIndices;\nuniform mat4 projection, view;\nuniform vec2 focal;\nuniform vec2 viewport;\n\nuniform bool useDepthFade;\nuniform float depthFade;\n\nin vec2 position;\nin int index;\n\nout vec4 vColor;\nout vec2 vPosition;\nout float vSize;\nout float vSelected;\n\nvoid main () {\n    uvec4 cen = texelFetch(u_texture, ivec2((uint(index) & 0x3ffu) << 1, uint(index) >> 10), 0);\n    float selected = float((cen.w >> 24) & 0xffu);\n\n    uint transformIndex = texelFetch(u_transformIndices, ivec2(uint(index) & 0x3ffu, uint(index) >> 10), 0).x;\n    mat4 transform = mat4(\n        texelFetch(u_transforms, ivec2(0, transformIndex), 0),\n        texelFetch(u_transforms, ivec2(1, transformIndex), 0),\n        texelFetch(u_transforms, ivec2(2, transformIndex), 0),\n        texelFetch(u_transforms, ivec2(3, transformIndex), 0)\n    );\n\n    if (selected < 0.5) {\n        selected = texelFetch(u_transforms, ivec2(4, transformIndex), 0).x;\n    }\n\n    mat4 viewTransform = view * transform;\n\n    vec4 cam = viewTransform * vec4(uintBitsToFloat(cen.xyz), 1);\n    vec4 pos2d = projection * cam;\n\n    float clip = 1.2 * pos2d.w;\n    if (pos2d.z < -pos2d.w || pos2d.z > pos2d.w || pos2d.x < -clip || pos2d.x > clip || pos2d.y < -clip || pos2d.y > clip) {\n        gl_Position = vec4(0.0, 0.0, 2.0, 1.0);\n        return;\n    }\n\n    uvec4 cov = texelFetch(u_texture, ivec2(((uint(index) & 0x3ffu) << 1) | 1u, uint(index) >> 10), 0);\n    vec2 u1 = unpackHalf2x16(cov.x), u2 = unpackHalf2x16(cov.y), u3 = unpackHalf2x16(cov.z);\n    mat3 Vrk = mat3(u1.x, u1.y, u2.x, u1.y, u2.y, u3.x, u2.x, u3.x, u3.y);\n\n    mat3 J = mat3(\n        focal.x / cam.z, 0., -(focal.x * cam.x) / (cam.z * cam.z), \n        0., -focal.y / cam.z, (focal.y * cam.y) / (cam.z * cam.z), \n        0., 0., 0.\n    );\n\n    mat3 T = transpose(mat3(viewTransform)) * J;\n    mat3 cov2d = transpose(T) * Vrk * T;\n\n    float mid = (cov2d[0][0] + cov2d[1][1]) / 2.0;\n    float radius = length(vec2((cov2d[0][0] - cov2d[1][1]) / 2.0, cov2d[0][1]));\n    float lambda1 = mid + radius, lambda2 = mid - radius;\n\n    if (lambda2 < 0.0) return;\n    vec2 diagonalVector = normalize(vec2(cov2d[0][1], lambda1 - cov2d[0][0]));\n    vec2 majorAxis = min(sqrt(2.0 * lambda1), 1024.0) * diagonalVector;\n    vec2 minorAxis = min(sqrt(2.0 * lambda2), 1024.0) * vec2(diagonalVector.y, -diagonalVector.x);\n\n    vColor = vec4((cov.w) & 0xffu, (cov.w >> 8) & 0xffu, (cov.w >> 16) & 0xffu, (cov.w >> 24) & 0xffu) / 255.0;\n    vPosition = position;\n    vSize = length(majorAxis);\n    vSelected = selected;\n\n    float scalingFactor = 1.0;\n\n    if (useDepthFade) {\n        float depthNorm = (pos2d.z / pos2d.w + 1.0) / 2.0;\n        float near = 0.1; float far = 100.0;\n        float normalizedDepth = (2.0 * near) / (far + near - depthNorm * (far - near));\n        float start = max(normalizedDepth - 0.1, 0.0);\n        float end = min(normalizedDepth + 0.1, 1.0);\n        scalingFactor = clamp((depthFade - start) / (end - start), 0.0, 1.0);\n    }\n\n    vec2 vCenter = vec2(pos2d) / pos2d.w;\n    gl_Position = vec4(\n        vCenter \n        + position.x * majorAxis * scalingFactor / viewport\n        + position.y * minorAxis * scalingFactor / viewport, 0.0, 1.0);\n}\n'
  }
  _getFragmentSource() {
    return '#version 300 es\nprecision highp float;\n\nuniform float outlineThickness;\nuniform vec4 outlineColor;\n\nin vec4 vColor;\nin vec2 vPosition;\nin float vSize;\nin float vSelected;\n\nout vec4 fragColor;\n\nvoid main () {\n    float A = -dot(vPosition, vPosition);\n\n    if (A < -4.0) discard;\n\n    if (vSelected < 0.5) {\n        float B = exp(A) * vColor.a;\n        fragColor = vec4(B * vColor.rgb, B);\n        return;\n    }\n\n    float outlineThreshold = -4.0 + (outlineThickness / vSize);\n\n    if (A < outlineThreshold) {\n        fragColor = outlineColor;\n    } \n    else {\n        float B = exp(A) * vColor.a;\n        fragColor = vec4(B * vColor.rgb, B);\n    }\n}\n'
  }
}
class m {
  constructor(A = 1) {
    let Q,
      F,
      U,
      l,
      B = 0,
      t = !1
    ;(this.initialize = (A) => {
      if (!(A instanceof E))
        throw new Error('FadeInPass requires a RenderProgram')
      ;(B = A.started ? 1 : 0),
        (t = !0),
        (Q = A),
        (F = A.renderer.gl),
        (U = F.getUniformLocation(Q.program, 'useDepthFade')),
        F.uniform1i(U, 1),
        (l = F.getUniformLocation(Q.program, 'depthFade')),
        F.uniform1f(l, B)
    }),
      (this.render = () => {
        var d
        t &&
          !(null === (d = Q.renderData) || void 0 === d
            ? void 0
            : d.updating) &&
          (F.useProgram(Q.program),
          (B = Math.min(B + 0.01 * A, 1)),
          B >= 1 && ((t = !1), F.uniform1i(U, 0)),
          F.uniform1f(l, B))
      })
  }
  dispose() {}
}
class N {
  constructor(A = null, Q = null) {
    this._backgroundColor = new r()
    const F = A || document.createElement('canvas')
    A ||
      ((F.style.display = 'block'),
      (F.style.boxSizing = 'border-box'),
      (F.style.width = '100%'),
      (F.style.height = '100%'),
      (F.style.margin = '0'),
      (F.style.padding = '0'),
      document.body.appendChild(F)),
      (F.style.background = this._backgroundColor.toHexString()),
      (this._canvas = F),
      (this._gl = F.getContext('webgl2', { antialias: !1 }))
    const U = Q || []
    Q || U.push(new m()), (this._renderProgram = new E(this, U))
    const l = [this._renderProgram]
    ;(this.resize = () => {
      const A = F.clientWidth,
        Q = F.clientHeight
      ;(F.width === A && F.height === Q) || this.setSize(A, Q)
    }),
      (this.setSize = (A, Q) => {
        ;(F.width = A),
          (F.height = Q),
          this._gl.viewport(0, 0, F.width, F.height)
        for (const A of l) A.resize()
      }),
      (this.render = (A, Q) => {
        for (const F of l) F.render(A, Q)
      }),
      (this.dispose = () => {
        for (const A of l) A.dispose()
      }),
      (this.addProgram = (A) => {
        l.push(A)
      }),
      (this.removeProgram = (A) => {
        const Q = l.indexOf(A)
        if (Q < 0) throw new Error('Program not found')
        l.splice(Q, 1)
      }),
      this.resize()
  }
  get canvas() {
    return this._canvas
  }
  get gl() {
    return this._gl
  }
  get renderProgram() {
    return this._renderProgram
  }
  get backgroundColor() {
    return this._backgroundColor
  }
  set backgroundColor(A) {
    ;(this._backgroundColor = A),
      (this._canvas.style.background = A.toHexString())
  }
}
class G {
  constructor(F, U, l = 0.5, B = 0.5, t = 5, d = !0, e = new A()) {
    ;(this.minAngle = -90),
      (this.maxAngle = 90),
      (this.minZoom = 0.1),
      (this.maxZoom = 30),
      (this.orbitSpeed = 1),
      (this.panSpeed = 1),
      (this.zoomSpeed = 1),
      (this.dampening = 0.12),
      (this.setCameraTarget = () => {})
    let Z = e.clone(),
      V = Z.clone(),
      I = l,
      R = B,
      a = t,
      i = !1,
      g = !1,
      C = 0,
      c = 0,
      W = 0
    const h = {}
    let s = !1
    
    F.addEventListener('objectChanged', () => {
      if (s) return
      const Q = F.rotation.toEuler()
      ;(I = -Q.y), (R = -Q.x)
      const U = F.position.x - a * Math.sin(I) * Math.cos(R),
        l = F.position.y + a * Math.sin(R),
        B = F.position.z + a * Math.cos(I) * Math.cos(R)
      V = new A(U, l, B)
    }),
      (this.setCameraTarget = (Q) => {
        const U = Q.x - F.position.x,
          l = Q.y - F.position.y,
          B = Q.z - F.position.z
        ;(a = Math.sqrt(U * U + l * l + B * B)),
          (R = Math.atan2(l, Math.sqrt(U * U + B * B))),
          (I = -Math.atan2(U, B)),
          (V = new A(Q.x, Q.y, Q.z))
      })
    const o = () =>
        0.1 + (0.9 * (a - this.minZoom)) / (this.maxZoom - this.minZoom),
      J = (A) => {
        ;(h[A.code] = !0),
          'ArrowUp' === A.code && (h.KeyW = !0),
          'ArrowDown' === A.code && (h.KeyS = !0),
          'ArrowLeft' === A.code && (h.KeyA = !0),
          'ArrowRight' === A.code && (h.KeyD = !0)
      },
      b = (A) => {
        ;(h[A.code] = !1),
          'ArrowUp' === A.code && (h.KeyW = !1),
          'ArrowDown' === A.code && (h.KeyS = !1),
          'ArrowLeft' === A.code && (h.KeyA = !1),
          'ArrowRight' === A.code && (h.KeyD = !1)
      },
      r = (A) => {
        p(A),
          (i = !0),
          (g = 2 === A.button),
          (c = A.clientX),
          (W = A.clientY),
          window.addEventListener('mouseup', E)
      },
      E = (A) => {
        p(A), (i = !1), (g = !1), window.removeEventListener('mouseup', E)
      },
      m = (Q) => {
        if ((p(Q), !i || !F)) return
        const U = Q.clientX - c,
          l = Q.clientY - W
        if (g) {
          const Q = o(),
            B = -U * this.panSpeed * 0.01 * Q,
            t = -l * this.panSpeed * 0.01 * Q,
            d = n.RotationFromQuaternion(F.rotation).buffer,
            e = new A(d[0], d[3], d[6]),
            Z = new A(d[1], d[4], d[7])
          ;(V = V.add(e.multiply(B))), (V = V.add(Z.multiply(t)))
        } else
          (I -= U * this.orbitSpeed * 0.003),
            (R += l * this.orbitSpeed * 0.003),
            (R = Math.min(
              Math.max(R, (this.minAngle * Math.PI) / 180),
              (this.maxAngle * Math.PI) / 180,
            ))
        ;(c = Q.clientX), (W = Q.clientY)
      },
      N = (A) => {
        p(A)
        const Q = o()
        ;(a += A.deltaY * this.zoomSpeed * 0.025 * Q),
          (a = Math.min(Math.max(a, this.minZoom), this.maxZoom))
      },
      G = (A) => {
        if ((p(A), 1 === A.touches.length))
          (i = !0),
            (g = !1),
            (c = A.touches[0].clientX),
            (W = A.touches[0].clientY),
            (C = 0)
        else if (2 === A.touches.length) {
          ;(i = !1),
            (g = !0),
            (c = (A.touches[0].clientX + A.touches[1].clientX) / 2),
            (W = (A.touches[0].clientY + A.touches[1].clientY) / 2)
          const Q = A.touches[0].clientX - A.touches[1].clientX,
            F = A.touches[0].clientY - A.touches[1].clientY
          C = Math.sqrt(Q * Q + F * F)
        }
      },
      X = (A) => {
        p(A), (i = !1), (g = !1)
      },
      Y = (Q) => {
        if ((p(Q), i && F))
          if (g) {
            const U = o(),
              l = Q.touches[0].clientX - Q.touches[1].clientX,
              B = Q.touches[0].clientY - Q.touches[1].clientY,
              t = Math.sqrt(l * l + B * B)
            ;(a += (C - t) * this.zoomSpeed * 0.1 * U),
              (a = Math.min(Math.max(a, this.minZoom), this.maxZoom)),
              (C = t)
            const d = (Q.touches[0].clientX + Q.touches[1].clientX) / 2,
              e = (Q.touches[0].clientY + Q.touches[1].clientY) / 2,
              Z = d - c,
              I = e - W,
              R = n.RotationFromQuaternion(F.rotation).buffer,
              i = new A(R[0], R[3], R[6]),
              g = new A(R[1], R[4], R[7])
            ;(V = V.add(i.multiply(-Z * this.panSpeed * 0.025 * U))),
              (V = V.add(g.multiply(-I * this.panSpeed * 0.025 * U))),
              (c = d),
              (W = e)
          } else {
            const A = Q.touches[0].clientX - c,
              F = Q.touches[0].clientY - W
            ;(I -= A * this.orbitSpeed * 0.003),
              (R += F * this.orbitSpeed * 0.003),
              (R = Math.min(
                Math.max(R, (this.minAngle * Math.PI) / 180),
                (this.maxAngle * Math.PI) / 180,
              )),
              (c = Q.touches[0].clientX),
              (W = Q.touches[0].clientY)
          }
      },
      y = (A, Q, F) => (1 - F) * A + F * Q
    this.update = () => {
      ;(s = !0),
        (l = y(l, I, this.dampening)),
        (B = y(B, R, this.dampening)),
        (t = y(t, a, this.dampening)),
        (Z = Z.lerp(V, this.dampening))
      const U = Z.x + t * Math.sin(l) * Math.cos(B),
        d = Z.y - t * Math.sin(B),
        e = Z.z - t * Math.cos(l) * Math.cos(B)
      F.position = new A(U, d, e)
      const i = Z.subtract(F.position).normalize(),
        g = Math.asin(-i.y),
        C = Math.atan2(i.x, i.z)
      F.rotation = Q.FromEuler(new A(g, C, 0))
      const c = 0.025,
        W = 0.01,
        o = n.RotationFromQuaternion(F.rotation).buffer,
        J = new A(-o[2], -o[5], -o[8]),
        b = new A(o[0], o[3], o[6])
      h.KeyS && (V = V.add(J.multiply(c))),
        h.KeyW && (V = V.subtract(J.multiply(c))),
        h.KeyA && (V = V.subtract(b.multiply(c))),
        h.KeyD && (V = V.add(b.multiply(c))),
        h.KeyE && (I += W),
        h.KeyQ && (I -= W),
        h.KeyR && (R += W),
        h.KeyF && (R -= W),
        (s = !1)
    }
    const p = (A) => {
      A.preventDefault(), A.stopPropagation()
    }
    ;(this.dispose = () => {
      U.removeEventListener('dragenter', p),
        U.removeEventListener('dragover', p),
        U.removeEventListener('dragleave', p),
        U.removeEventListener('contextmenu', p),
        U.removeEventListener('mousedown', r),
        U.removeEventListener('mousemove', m),
        U.removeEventListener('wheel', N),
        U.removeEventListener('touchstart', G),
        U.removeEventListener('touchend', X),
        U.removeEventListener('touchmove', Y),
        d &&
          (window.removeEventListener('keydown', J),
          window.removeEventListener('keyup', b))
    }),
      d &&
        (window.addEventListener('keydown', J),
        window.addEventListener('keyup', b)),
      U.addEventListener('dragenter', p),
      U.addEventListener('dragover', p),
      U.addEventListener('dragleave', p),
      U.addEventListener('contextmenu', p),
      U.addEventListener('mousedown', r),
      U.addEventListener('mousemove', m),
      U.addEventListener('wheel', N),
      U.addEventListener('touchstart', G),
      U.addEventListener('touchend', X),
      U.addEventListener('touchmove', Y),
      this.update()
  }
//   resetZoom() {
//     this.a = 5; // Reset desiredRadius to default value or a specific value as needed
// }
}
class X {
  constructor(A, Q) {
    ;(this.normal = A), (this.point = Q)
  }
  intersect(A, Q) {
    const F = this.normal.dot(Q)
    if (Math.abs(F) < 1e-4) return null
    const U = this.normal.dot(this.point.subtract(A)) / F
    return U < 0 ? null : A.add(Q.multiply(U))
  }
}
class Y {
  initialize(A) {}
  render() {}
  dispose() {}
}
var y = function (A = {}) {
  var Q,
    F,
    U = A
  U.ready = new Promise((A, U) => {
    ;(Q = A), (F = U)
  })
  var l = Object.assign({}, U),
    B = ''
  'undefined' != typeof document &&
    document.currentScript &&
    (B = document.currentScript.src),
    (B =
      0 !== B.indexOf('blob:')
        ? B.substr(0, B.replace(/[?#].*/, '').lastIndexOf('/') + 1)
        : ''),
    U.print || console.log.bind(console)
  var t,
    d,
    n = U.printErr || console.error.bind(console)
  function e(A) {
    if (G(A))
      return (function (A) {
        for (
          var Q = atob(A), F = new Uint8Array(Q.length), U = 0;
          U < Q.length;
          ++U
        )
          F[U] = Q.charCodeAt(U)
        return F
      })(A.slice(N.length))
  }
  Object.assign(U, l),
    (l = null),
    U.arguments && U.arguments,
    U.thisProgram && U.thisProgram,
    U.quit && U.quit,
    U.wasmBinary && (t = U.wasmBinary),
    'object' != typeof WebAssembly && r('no native wasm support detected')
  var Z,
    V,
    I,
    R,
    a,
    i,
    g,
    C,
    c = !1
  function W() {
    var A = d.buffer
    ;(U.HEAP8 = Z = new Int8Array(A)),
      (U.HEAP16 = I = new Int16Array(A)),
      (U.HEAPU8 = V = new Uint8Array(A)),
      (U.HEAPU16 = R = new Uint16Array(A)),
      (U.HEAP32 = a = new Int32Array(A)),
      (U.HEAPU32 = i = new Uint32Array(A)),
      (U.HEAPF32 = g = new Float32Array(A)),
      (U.HEAPF64 = C = new Float64Array(A))
  }
  var h = [],
    s = [],
    o = [],
    J = 0,
    b = null
  function r(A) {
    U.onAbort?.(A),
      n((A = 'Aborted(' + A + ')')),
      (c = !0),
      (A += '. Build with -sASSERTIONS for more info.')
    var Q = new WebAssembly.RuntimeError(A)
    throw (F(Q), Q)
  }
  var E,
    m,
    N = 'data:application/octet-stream;base64,',
    G = (A) => A.startsWith(N)
  function X(A) {
    return Promise.resolve().then(() =>
      (function (A) {
        if (A == E && t) return new Uint8Array(t)
        var Q = e(A)
        if (Q) return Q
        throw 'both async and sync fetching of the wasm failed'
      })(A),
    )
  }
  function Y(A, Q, F, U) {
    return (function (A, Q, F) {
      return X(A)
        .then((A) => WebAssembly.instantiate(A, Q))
        .then((A) => A)
        .then(F, (A) => {
          n(`failed to asynchronously prepare wasm: ${A}`), r(A)
        })
    })(Q, F, U)
  }
  G(
    (E =
      'data:application/octet-stream;base64,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CgRAIAEgAiADIAQQFA8LIAAoAggiACABIAIgAyAEIAUgACgCACgCFBEDAAuRAQAgACABKAIIIAQQCgRAIAEgAiADEBMPCwJAIAAgASgCACAEEApFDQACQCACIAEoAhBHBEAgASgCFCACRw0BCyADQQFHDQEgAUEBNgIgDwsgASACNgIUIAEgAzYCICABIAEoAihBAWo2AigCQCABKAIkQQFHDQAgASgCGEECRw0AIAFBAToANgsgAUEENgIsCwvyAQAgACABKAIIIAQQCgRAIAEgAiADEBMPCwJAIAAgASgCACAEEAoEQAJAIAIgASgCEEcEQCABKAIUIAJHDQELIANBAUcNAiABQQE2AiAPCyABIAM2AiACQCABKAIsQQRGDQAgAUEAOwE0IAAoAggiACABIAIgAkEBIAQgACgCACgCFBEDACABLQA1BEAgAUEDNgIsIAEtADRFDQEMAwsgAUEENgIsCyABIAI2AhQgASABKAIoQQFqNgIoIAEoAiRBAUcNASABKAIYQQJHDQEgAUEBOgA2DwsgACgCCCIAIAEgAiADIAQgACgCACgCGBECAAsLMQAgACABKAIIQQAQCgRAIAEgAiADEBUPCyAAKAIIIgAgASACIAMgACgCACgCHBEAAAsYACAAIAEoAghBABAKBEAgASACIAMQFQsLgAMBBH8jAEHwAGsiAiQAIAAoAgAiA0EEaygCACEEIANBCGsoAgAhBSACQgA3AlAgAkIANwJYIAJCADcCYCACQgA3AGcgAkIANwJIIAJBADYCRCACQewVNgJAIAIgADYCPCACIAE2AjggACAFaiEDAkAgBCABQQAQCgRAQQAgAyAFGyEADAELIAAgA04EQCACQgA3AC8gAkIANwIYIAJCADcCICACQgA3AiggAkIANwIQIAJBADYCDCACIAE2AgggAiAANgIEIAIgBDYCACACQQE2AjAgBCACIAMgA0EBQQAgBCgCACgCFBEDACACKAIYDQELQQAhACAEIAJBOGogA0EBQQAgBCgCACgCGBECAAJAAkAgAigCXA4CAAECCyACKAJMQQAgAigCWEEBRhtBACACKAJUQQFGG0EAIAIoAmBBAUYbIQAMAQsgAigCUEEBRwRAIAIoAmANASACKAJUQQFHDQEgAigCWEEBRw0BCyACKAJIIQALIAJB8ABqJAAgAAu1AQEEfyMAQUBqIgMkAAJ/QQEgACABQQAQCg0AGkEAIAFFDQAaQQAgAUGcFhAgIgFFDQAaIANBDGohBEE0IQUDQCAEQQA6AAAgBEEBaiEEIAVBAWsiBQ0ACyADQQE2AjggA0F/NgIUIAMgADYCECADIAE2AgggASADQQhqIAIoAgBBASABKAIAKAIcEQAAIAMoAiAiAEEBRgRAIAIgAygCGDYCAAsgAEEBRgshBiADQUBrJAAgBgsKACAAIAFBABAKCwu3EgIAQYAIC6YSdW5zaWduZWQgc2hvcnQAdW5zaWduZWQgaW50AGZsb2F0AHVpbnQ2NF90AHVuc2lnbmVkIGNoYXIAYm9vbAB1bnNpZ25lZCBsb25nAHN0ZDo6d3N0cmluZwBzdGQ6OnN0cmluZwBzdGQ6OnUxNnN0cmluZwBzdGQ6OnUzMnN0cmluZwBkb3VibGUAdm9pZABlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxzaG9ydD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dW5zaWduZWQgc2hvcnQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGludD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dW5zaWduZWQgaW50PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxmbG9hdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dWludDhfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8aW50OF90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1aW50MTZfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8aW50MTZfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dWludDY0X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGludDY0X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVpbnQzMl90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQzMl90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxjaGFyPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1bnNpZ25lZCBjaGFyPgBzdGQ6OmJhc2ljX3N0cmluZzx1bnNpZ25lZCBjaGFyPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxzaWduZWQgY2hhcj4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8bG9uZz4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dW5zaWduZWQgbG9uZz4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8ZG91YmxlPgBOU3QzX18yMTJiYXNpY19zdHJpbmdJY05TXzExY2hhcl90cmFpdHNJY0VFTlNfOWFsbG9jYXRvckljRUVFRQAAAACUDAAAMgcAAE5TdDNfXzIxMmJhc2ljX3N0cmluZ0loTlNfMTFjaGFyX3RyYWl0c0loRUVOU185YWxsb2NhdG9ySWhFRUVFAACUDAAAfAcAAE5TdDNfXzIxMmJhc2ljX3N0cmluZ0l3TlNfMTFjaGFyX3RyYWl0c0l3RUVOU185YWxsb2NhdG9ySXdFRUVFAACUDAAAxAcAAE5TdDNfXzIxMmJhc2ljX3N0cmluZ0lEc05TXzExY2hhcl90cmFpdHNJRHNFRU5TXzlhbGxvY2F0b3JJRHNFRUVFAAAAlAwAAAwIAABOU3QzX18yMTJiYXNpY19zdHJpbmdJRGlOU18xMWNoYXJfdHJhaXRzSURpRUVOU185YWxsb2NhdG9ySURpRUVFRQAAAJQMAABYCAAATjEwZW1zY3JpcHRlbjN2YWxFAACUDAAApAgAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWNFRQAAlAwAAMAIAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0lhRUUAAJQMAADoCAAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJaEVFAACUDAAAEAkAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SXNFRQAAlAwAADgJAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0l0RUUAAJQMAABgCQAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJaUVFAACUDAAAiAkAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWpFRQAAlAwAALAJAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0lsRUUAAJQMAADYCQAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJbUVFAACUDAAAAAoAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SXhFRQAAlAwAACgKAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0l5RUUAAJQMAABQCgAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJZkVFAACUDAAAeAoAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWRFRQAAlAwAAKAKAABOMTBfX2N4eGFiaXYxMTZfX3NoaW1fdHlwZV9pbmZvRQAAAAC8DAAAyAoAACANAABOMTBfX2N4eGFiaXYxMTdfX2NsYXNzX3R5cGVfaW5mb0UAAAC8DAAA+AoAAOwKAABOMTBfX2N4eGFiaXYxMTdfX3BiYXNlX3R5cGVfaW5mb0UAAAC8DAAAKAsAAOwKAABOMTBfX2N4eGFiaXYxMTlfX3BvaW50ZXJfdHlwZV9pbmZvRQC8DAAAWAsAAEwLAAAAAAAAzAsAAAIAAAADAAAABAAAAAUAAAAGAAAATjEwX19jeHhhYml2MTIzX19mdW5kYW1lbnRhbF90eXBlX2luZm9FALwMAACkCwAA7AoAAHYAAACQCwAA2AsAAGIAAACQCwAA5AsAAGMAAACQCwAA8AsAAGgAAACQCwAA/AsAAGEAAACQCwAACAwAAHMAAACQCwAAFAwAAHQAAACQCwAAIAwAAGkAAACQCwAALAwAAGoAAACQCwAAOAwAAGwAAACQCwAARAwAAG0AAACQCwAAUAwAAHgAAACQCwAAXAwAAHkAAACQCwAAaAwAAGYAAACQCwAAdAwAAGQAAACQCwAAgAwAAAAAAAAcCwAAAgAAAAcAAAAEAAAABQAAAAgAAAAJAAAACgAAAAsAAAAAAAAABA0AAAIAAAAMAAAABAAAAAUAAAAIAAAADQAAAA4AAAAPAAAATjEwX19jeHhhYml2MTIwX19zaV9jbGFzc190eXBlX2luZm9FAAAAALwMAADcDAAAHAsAAFN0OXR5cGVfaW5mbwAAAACUDAAAEA0AQagaCwPgDwE='),
  ) || ((m = E), (E = U.locateFile ? U.locateFile(m, B) : B + m))
  var y = (A) => {
    for (; A.length > 0; ) A.shift()(U)
  }
  U.noExitRuntime
  var p,
    S,
    k = (A) => {
      for (var Q = '', F = A; V[F]; ) Q += p[V[F++]]
      return Q
    },
    u = {},
    T = {},
    H = (A) => {
      throw new S(A)
    }
  function D(A, Q, F = {}) {
    if (!('argPackAdvance' in Q))
      throw new TypeError(
        'registerType registeredInstance requires argPackAdvance',
      )
    return (function (A, Q, F = {}) {
      var U = Q.name
      if (
        (A || H(`type "${U}" must have a positive integer typeid pointer`),
        T.hasOwnProperty(A))
      ) {
        if (F.ignoreDuplicateRegistrations) return
        H(`Cannot register type '${U}' twice`)
      }
      if (((T[A] = Q), u.hasOwnProperty(A))) {
        var l = u[A]
        delete u[A], l.forEach((A) => A())
      }
    })(A, Q, F)
  }
  var w = new (class {
      constructor() {
        ;(this.allocated = [void 0]), (this.freelist = [])
      }
      get(A) {
        return this.allocated[A]
      }
      has(A) {
        return void 0 !== this.allocated[A]
      }
      allocate(A) {
        var Q = this.freelist.pop() || this.allocated.length
        return (this.allocated[Q] = A), Q
      }
      free(A) {
        ;(this.allocated[A] = void 0), this.freelist.push(A)
      }
    })(),
    f = () => {
      for (var A = 0, Q = w.reserved; Q < w.allocated.length; ++Q)
        void 0 !== w.allocated[Q] && ++A
      return A
    },
    x = (A) => (
      A || H('Cannot use deleted val. handle = ' + A), w.get(A).value
    ),
    M = (A) => {
      switch (A) {
        case void 0:
          return 1
        case null:
          return 2
        case !0:
          return 3
        case !1:
          return 4
        default:
          return w.allocate({ refcount: 1, value: A })
      }
    }
  function v(A) {
    return this.fromWireType(a[A >> 2])
  }
  var z = {
      name: 'emscripten::val',
      fromWireType: (A) => {
        var Q = x(A)
        return (
          ((A) => {
            A >= w.reserved && 0 == --w.get(A).refcount && w.free(A)
          })(A),
          Q
        )
      },
      toWireType: (A, Q) => M(Q),
      argPackAdvance: 8,
      readValueFromPointer: v,
      destructorFunction: null,
    },
    K = (A, Q) => {
      switch (Q) {
        case 4:
          return function (A) {
            return this.fromWireType(g[A >> 2])
          }
        case 8:
          return function (A) {
            return this.fromWireType(C[A >> 3])
          }
        default:
          throw new TypeError(`invalid float width (${Q}): ${A}`)
      }
    },
    j = (A, Q, F) => {
      switch (Q) {
        case 1:
          return F ? (A) => Z[A >> 0] : (A) => V[A >> 0]
        case 2:
          return F ? (A) => I[A >> 1] : (A) => R[A >> 1]
        case 4:
          return F ? (A) => a[A >> 2] : (A) => i[A >> 2]
        default:
          throw new TypeError(`invalid integer width (${Q}): ${A}`)
      }
    }
  function O(A) {
    return this.fromWireType(i[A >> 2])
  }
  var L = 'undefined' != typeof TextDecoder ? new TextDecoder('utf8') : void 0,
    P = (A, Q) =>
      A
        ? ((A, Q, F) => {
            for (var U = Q + F, l = Q; A[l] && !(l >= U); ) ++l
            if (l - Q > 16 && A.buffer && L) return L.decode(A.subarray(Q, l))
            for (var B = ''; Q < l; ) {
              var t = A[Q++]
              if (128 & t) {
                var d = 63 & A[Q++]
                if (192 != (224 & t)) {
                  var n = 63 & A[Q++]
                  if (
                    (t =
                      224 == (240 & t)
                        ? ((15 & t) << 12) | (d << 6) | n
                        : ((7 & t) << 18) |
                          (d << 12) |
                          (n << 6) |
                          (63 & A[Q++])) < 65536
                  )
                    B += String.fromCharCode(t)
                  else {
                    var e = t - 65536
                    B += String.fromCharCode(
                      55296 | (e >> 10),
                      56320 | (1023 & e),
                    )
                  }
                } else B += String.fromCharCode(((31 & t) << 6) | d)
              } else B += String.fromCharCode(t)
            }
            return B
          })(V, A, Q)
        : '',
    _ =
      'undefined' != typeof TextDecoder ? new TextDecoder('utf-16le') : void 0,
    q = (A, Q) => {
      for (var F = A, U = F >> 1, l = U + Q / 2; !(U >= l) && R[U]; ) ++U
      if ((F = U << 1) - A > 32 && _) return _.decode(V.subarray(A, F))
      for (var B = '', t = 0; !(t >= Q / 2); ++t) {
        var d = I[(A + 2 * t) >> 1]
        if (0 == d) break
        B += String.fromCharCode(d)
      }
      return B
    },
    $ = (A, Q, F) => {
      if (((F ??= 2147483647), F < 2)) return 0
      for (
        var U = Q, l = (F -= 2) < 2 * A.length ? F / 2 : A.length, B = 0;
        B < l;
        ++B
      ) {
        var t = A.charCodeAt(B)
        ;(I[Q >> 1] = t), (Q += 2)
      }
      return (I[Q >> 1] = 0), Q - U
    },
    AA = (A) => 2 * A.length,
    QA = (A, Q) => {
      for (var F = 0, U = ''; !(F >= Q / 4); ) {
        var l = a[(A + 4 * F) >> 2]
        if (0 == l) break
        if ((++F, l >= 65536)) {
          var B = l - 65536
          U += String.fromCharCode(55296 | (B >> 10), 56320 | (1023 & B))
        } else U += String.fromCharCode(l)
      }
      return U
    },
    FA = (A, Q, F) => {
      if (((F ??= 2147483647), F < 4)) return 0
      for (var U = Q, l = U + F - 4, B = 0; B < A.length; ++B) {
        var t = A.charCodeAt(B)
        if (
          (t >= 55296 &&
            t <= 57343 &&
            (t = (65536 + ((1023 & t) << 10)) | (1023 & A.charCodeAt(++B))),
          (a[Q >> 2] = t),
          (Q += 4) + 4 > l)
        )
          break
      }
      return (a[Q >> 2] = 0), Q - U
    },
    UA = (A) => {
      for (var Q = 0, F = 0; F < A.length; ++F) {
        var U = A.charCodeAt(F)
        U >= 55296 && U <= 57343 && ++F, (Q += 4)
      }
      return Q
    },
    lA = (A) => {
      var Q = (A - d.buffer.byteLength + 65535) / 65536
      try {
        return d.grow(Q), W(), 1
      } catch (A) {}
    }
  ;(() => {
    for (var A = new Array(256), Q = 0; Q < 256; ++Q)
      A[Q] = String.fromCharCode(Q)
    p = A
  })(),
    (S = U.BindingError = class extends Error {
      constructor(A) {
        super(A), (this.name = 'BindingError')
      }
    }),
    (U.InternalError = class extends Error {
      constructor(A) {
        super(A), (this.name = 'InternalError')
      }
    }),
    w.allocated.push(
      { value: void 0 },
      { value: null },
      { value: !0 },
      { value: !1 },
    ),
    Object.assign(w, { reserved: w.allocated.length }),
    (U.count_emval_handles = f)
  var BA = {
      f: (A, Q, F, U, l) => {},
      i: (A, Q, F, U) => {
        D(A, {
          name: (Q = k(Q)),
          fromWireType: function (A) {
            return !!A
          },
          toWireType: function (A, Q) {
            return Q ? F : U
          },
          argPackAdvance: 8,
          readValueFromPointer: function (A) {
            return this.fromWireType(V[A])
          },
          destructorFunction: null,
        })
      },
      h: (A) => D(A, z),
      e: (A, Q, F) => {
        D(A, {
          name: (Q = k(Q)),
          fromWireType: (A) => A,
          toWireType: (A, Q) => Q,
          argPackAdvance: 8,
          readValueFromPointer: K(Q, F),
          destructorFunction: null,
        })
      },
      b: (A, Q, F, U, l) => {
        Q = k(Q)
        var B = (A) => A
        if (0 === U) {
          var t = 32 - 8 * F
          B = (A) => (A << t) >>> t
        }
        var d = Q.includes('unsigned')
        D(A, {
          name: Q,
          fromWireType: B,
          toWireType: d
            ? function (A, Q) {
                return this.name, Q >>> 0
              }
            : function (A, Q) {
                return this.name, Q
              },
          argPackAdvance: 8,
          readValueFromPointer: j(Q, F, 0 !== U),
          destructorFunction: null,
        })
      },
      a: (A, Q, F) => {
        var U = [
          Int8Array,
          Uint8Array,
          Int16Array,
          Uint16Array,
          Int32Array,
          Uint32Array,
          Float32Array,
          Float64Array,
        ][Q]
        function l(A) {
          var Q = i[A >> 2],
            F = i[(A + 4) >> 2]
          return new U(Z.buffer, F, Q)
        }
        D(
          A,
          {
            name: (F = k(F)),
            fromWireType: l,
            argPackAdvance: 8,
            readValueFromPointer: l,
          },
          { ignoreDuplicateRegistrations: !0 },
        )
      },
      d: (A, Q) => {
        var F = 'std::string' === (Q = k(Q))
        D(A, {
          name: Q,
          fromWireType(A) {
            var Q,
              U = i[A >> 2],
              l = A + 4
            if (F)
              for (var B = l, t = 0; t <= U; ++t) {
                var d = l + t
                if (t == U || 0 == V[d]) {
                  var n = P(B, d - B)
                  void 0 === Q
                    ? (Q = n)
                    : ((Q += String.fromCharCode(0)), (Q += n)),
                    (B = d + 1)
                }
              }
            else {
              var e = new Array(U)
              for (t = 0; t < U; ++t) e[t] = String.fromCharCode(V[l + t])
              Q = e.join('')
            }
            return eA(A), Q
          },
          toWireType(A, Q) {
            var U
            Q instanceof ArrayBuffer && (Q = new Uint8Array(Q))
            var l = 'string' == typeof Q
            l ||
              Q instanceof Uint8Array ||
              Q instanceof Uint8ClampedArray ||
              Q instanceof Int8Array ||
              H('Cannot pass non-string to std::string'),
              (U =
                F && l
                  ? ((A) => {
                      for (var Q = 0, F = 0; F < A.length; ++F) {
                        var U = A.charCodeAt(F)
                        U <= 127
                          ? Q++
                          : U <= 2047
                          ? (Q += 2)
                          : U >= 55296 && U <= 57343
                          ? ((Q += 4), ++F)
                          : (Q += 3)
                      }
                      return Q
                    })(Q)
                  : Q.length)
            var B = nA(4 + U + 1),
              t = B + 4
            if (((i[B >> 2] = U), F && l))
              ((A, Q, F, U) => {
                if (!(U > 0)) return 0
                for (var l = F + U - 1, B = 0; B < A.length; ++B) {
                  var t = A.charCodeAt(B)
                  if (
                    (t >= 55296 &&
                      t <= 57343 &&
                      (t =
                        (65536 + ((1023 & t) << 10)) |
                        (1023 & A.charCodeAt(++B))),
                    t <= 127)
                  ) {
                    if (F >= l) break
                    Q[F++] = t
                  } else if (t <= 2047) {
                    if (F + 1 >= l) break
                    ;(Q[F++] = 192 | (t >> 6)), (Q[F++] = 128 | (63 & t))
                  } else if (t <= 65535) {
                    if (F + 2 >= l) break
                    ;(Q[F++] = 224 | (t >> 12)),
                      (Q[F++] = 128 | ((t >> 6) & 63)),
                      (Q[F++] = 128 | (63 & t))
                  } else {
                    if (F + 3 >= l) break
                    ;(Q[F++] = 240 | (t >> 18)),
                      (Q[F++] = 128 | ((t >> 12) & 63)),
                      (Q[F++] = 128 | ((t >> 6) & 63)),
                      (Q[F++] = 128 | (63 & t))
                  }
                }
                Q[F] = 0
              })(Q, V, t, U + 1)
            else if (l)
              for (var d = 0; d < U; ++d) {
                var n = Q.charCodeAt(d)
                n > 255 &&
                  (eA(t),
                  H('String has UTF-16 code units that do not fit in 8 bits')),
                  (V[t + d] = n)
              }
            else for (d = 0; d < U; ++d) V[t + d] = Q[d]
            return null !== A && A.push(eA, B), B
          },
          argPackAdvance: 8,
          readValueFromPointer: O,
          destructorFunction(A) {
            eA(A)
          },
        })
      },
      c: (A, Q, F) => {
        var U, l, B, t, d
        ;(F = k(F)),
          2 === Q
            ? ((U = q), (l = $), (t = AA), (B = () => R), (d = 1))
            : 4 === Q && ((U = QA), (l = FA), (t = UA), (B = () => i), (d = 2)),
          D(A, {
            name: F,
            fromWireType: (A) => {
              for (
                var F, l = i[A >> 2], t = B(), n = A + 4, e = 0;
                e <= l;
                ++e
              ) {
                var Z = A + 4 + e * Q
                if (e == l || 0 == t[Z >> d]) {
                  var V = U(n, Z - n)
                  void 0 === F
                    ? (F = V)
                    : ((F += String.fromCharCode(0)), (F += V)),
                    (n = Z + Q)
                }
              }
              return eA(A), F
            },
            toWireType: (A, U) => {
              'string' != typeof U &&
                H(`Cannot pass non-string to C++ string type ${F}`)
              var B = t(U),
                n = nA(4 + B + Q)
              return (
                (i[n >> 2] = B >> d),
                l(U, n + 4, B + Q),
                null !== A && A.push(eA, n),
                n
              )
            },
            argPackAdvance: 8,
            readValueFromPointer: v,
            destructorFunction(A) {
              eA(A)
            },
          })
      },
      j: (A, Q) => {
        D(A, {
          isVoid: !0,
          name: (Q = k(Q)),
          argPackAdvance: 0,
          fromWireType: () => {},
          toWireType: (A, Q) => {},
        })
      },
      g: (A) => {
        var Q = V.length,
          F = 2147483648
        if ((A >>>= 0) > F) return !1
        for (var U, l, B = 1; B <= 4; B *= 2) {
          var t = Q * (1 + 0.2 / B)
          t = Math.min(t, A + 100663296)
          var d = Math.min(
            F,
            (U = Math.max(A, t)) + (((l = 65536) - (U % l)) % l),
          )
          if (lA(d)) return !0
        }
        return !1
      },
    },
    tA = (function () {
      var A = { a: BA }
      function Q(A, Q) {
        var F
        return (
          (tA = A.exports),
          (d = tA.k),
          W(),
          (F = tA.l),
          s.unshift(F),
          (function (A) {
            if ((J--, U.monitorRunDependencies?.(J), 0 == J && b)) {
              var Q = b
              ;(b = null), Q()
            }
          })(),
          tA
        )
      }
      if ((J++, U.monitorRunDependencies?.(J), U.instantiateWasm))
        try {
          return U.instantiateWasm(A, Q)
        } catch (A) {
          n(`Module.instantiateWasm callback failed with error: ${A}`), F(A)
        }
      return (
        Y(0, E, A, function (A) {
          Q(A.instance)
        }).catch(F),
        {}
      )
    })()
  U._evaluate = (A, Q, F, l, B, t, d, n, e, Z, V, I, R) =>
    (U._evaluate = tA.m)(A, Q, F, l, B, t, d, n, e, Z, V, I, R)
  var dA,
    nA = (U._malloc = (A) => (nA = U._malloc = tA.o)(A)),
    eA = (U._free = (A) => (eA = U._free = tA.p)(A))
  function ZA() {
    function A() {
      dA ||
        ((dA = !0),
        (U.calledRun = !0),
        c ||
          (y(s),
          Q(U),
          U.onRuntimeInitialized && U.onRuntimeInitialized(),
          (function () {
            if (U.postRun)
              for (
                'function' == typeof U.postRun && (U.postRun = [U.postRun]);
                U.postRun.length;

              )
                (A = U.postRun.shift()), o.unshift(A)
            var A
            y(o)
          })()))
    }
    J > 0 ||
      ((function () {
        if (U.preRun)
          for (
            'function' == typeof U.preRun && (U.preRun = [U.preRun]);
            U.preRun.length;

          )
            (A = U.preRun.shift()), h.unshift(A)
        var A
        y(h)
      })(),
      J > 0 ||
        (U.setStatus
          ? (U.setStatus('Running...'),
            setTimeout(function () {
              setTimeout(function () {
                U.setStatus('')
              }, 1),
                A()
            }, 1))
          : A()))
  }
  if (
    ((b = function A() {
      dA || ZA(), dA || (b = A)
    }),
    U.preInit)
  )
    for (
      'function' == typeof U.preInit && (U.preInit = [U.preInit]);
      U.preInit.length > 0;

    )
      U.preInit.pop()()
  return ZA(), A.ready
}
class p {
  constructor(A) {
    let Q
    ;(async () => {
      Q = await y()
    })()
    let F,
      U,
      l,
      B,
      t,
      d,
      n,
      e,
      Z,
      V,
      I,
      R = 0,
      a = 0
    this.testPoint = (i, g) => {
      if (!Q) throw new Error('Wasm module not loaded')
      if (!A.camera) throw new Error('Camera not set')
      if (!A.renderData || !A.depthIndex || !A.chunks) return null
      const C = A.renderData,
        c = A.depthIndex,
        W = A.chunks,
        h = Math.pow(2, Math.ceil(Math.log2(C.vertexCount)))
      var s
      ;(s = h) > R &&
        (R > 0 &&
          (Q._free(F),
          Q._free(l),
          Q._free(B),
          Q._free(t),
          Q._free(d),
          Q._free(n),
          Q._free(e),
          Q._free(Z),
          Q._free(V),
          Q._free(I)),
        (R = s),
        (F = Q._malloc(64)),
        (l = Q._malloc(4 * R)),
        (B = Q._malloc(3 * R * 4)),
        (t = Q._malloc(4 * R * 4)),
        (d = Q._malloc(3 * R * 4)),
        (n = Q._malloc(4 * R)),
        (e = Q._malloc(R)),
        (Z = Q._malloc(12)),
        (V = Q._malloc(12)),
        (I = Q._malloc(4)))
      const o = Math.pow(2, Math.ceil(Math.log2(C.transforms.length / 20)))
      var J
      ;(J = o) > a &&
        (a > 0 && Q._free(U), (a = J), (U = Q._malloc(20 * a * 4)))
      const b = (i + 1) / 2,
        r = (g + 1) / 2,
        E = Math.floor(15 * b) + 15 * Math.floor(15 * r),
        m = A.camera,
        N = m.screenPointToRay(i, g)
      Q.HEAPF32.set(m.data.viewMatrix.buffer, F / 4),
        Q.HEAPU32.set(C.transformIndices, l / 4),
        Q.HEAPF32.set(C.positions, B / 4),
        Q.HEAPF32.set(C.rotations, t / 4),
        Q.HEAPF32.set(C.scales, d / 4),
        Q.HEAPU32.set(c, n / 4),
        Q.HEAPU8.set(W, e),
        Q.HEAPF32.set(m.position.flat(), Z / 4),
        Q.HEAPF32.set(N.flat(), V / 4),
        Q.HEAPF32.set(C.transforms, U / 4),
        Q._evaluate(F, U, l, B, t, d, n, e, C.vertexCount, E, Z, V, I)
      const G = Q.HEAPU32[I / 4]
      if (4294967295 !== G) {
        return C.getSplat(G)
      }
      return null
    }
  }
}
export {
  a as Camera,
  I as CameraData,
  r as Color32,
  m as FadeInPass,
  p as IntersectionTester,
  g as Loader,
  n as Matrix3,
  U as Matrix4,
  d as Object3D,
  G as OrbitControls,
  C as PLYLoader,
  X as Plane,
  Q as Quaternion,
  b as RenderData,
  E as RenderProgram,
  i as Scene,
  Y as ShaderPass,
  s as ShaderProgram,
  V as Splat,
  e as SplatData,
  A as Vector3,
  R as Vector4,
  N as WebGLRenderer,
}
//# sourceMappingURL=index.js.map
