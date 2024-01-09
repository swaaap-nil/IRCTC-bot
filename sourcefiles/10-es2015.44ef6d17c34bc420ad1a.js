;(window.webpackJsonp = window.webpackJsonp || []).push([
    [10],
    {
        NSaA: function (e, t, n) {
            'use strict'
            n.r(t),
                n.d(t, 'PaymentModule', function () {
                    return di
                })
            var a = n('dPl2'),
                i = n('3TGi'),
                c = n('/zH8'),
                s = n('PqYM'),
                l = n('wEpY'),
                r = n('61lg'),
                o = n('fXoL'),
                g = n('tyNb'),
                d = n('ofXK'),
                b = n('yVE3'),
                u = n('Ouoq'),
                p = n('jo8z'),
                m = n('kt0X'),
                h = n('rg3I'),
                f = n('7zfz'),
                v = n('Gxio'),
                y = n('/RsI'),
                S = n('3Pt+')
            function k(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 22),
                        o.ac(1, 'input', 23),
                        o.ic('ngModelChange', function (t) {
                            return o.Kc(e), (o.mc().otp = t)
                        })('keypress', function (t) {
                            return o.Kc(e), o.mc().validateOtp(t)
                        }),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc()
                    o.Cb(1),
                        o.uc(
                            'placeholder',
                            null == e.langService.lang ? null : e.langService.lang.otp,
                        ),
                        o.tc('ngModel', e.otp)
                }
            }
            function T(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 4),
                        o.ac(1, 'span', 24),
                        o.ic('click', function () {
                            return o.Kc(e), o.mc().resendOtp()
                        }),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc()
                    o.Cb(1),
                        o.tc(
                            'innerHTML',
                            null == e.langService.lang
                                ? null
                                : e.langService.lang.ewalletClickHereMsg,
                            o.Lc,
                        )
                }
            }
            const D = function () {
                return { width: '600px' }
            }
            let C = (() => {
                class e {
                    constructor(e, t, n, a, i, c, s, l, r) {
                        ;(this.router = e),
                            (this._location = t),
                            (this.langService = n),
                            (this.userService = a),
                            (this.restClientService = i),
                            (this.paymentService = c),
                            (this.store = s),
                            (this.bookingService = l),
                            (this.messageService = r),
                            (this.reTryBooking = false),
                            (this.errorMessage = ''),
                            (this.charCount = 0),
                            (this.withoutOTP = false),
                            (this.userResponse = null)
                    }
                    ngOnInit() {
                        ;(this.withoutOTP =
                            'true' == this.paymentService.paymentDetailDTO.withoutOTP),
                            (this.userResponse = this.userService.userResponse),
                            (this.jdSub = this.store
                                .select(c.h)
                                .subscribe((e) => (this.clientTxnId = e.clientTxnId)))
                        const e = this.paymentService.paymentDetailDTO.paramList
                        ;(Array.isArray(e) ? e : Array.of(e)).forEach((e) => {
                            'BALANCE' === e.key || 'balance' === e.key
                                ? (this.ewalletBalance = Number(e.value))
                                : ('AMOUNT' !== e.key && 'amount' !== e.key) ||
                                  (this.amount = Number(e.value))
                        }),
                            (this.userName = this.userService.userResponse.userName),
                            'SOFT_POINT_PURCHASE' == this.paymentService.paymentType &&
                                (this.clientTxnId =
                                    this.paymentService.paymentDetailDTO.transationId + '')
                    }
                    ngOnDestroy() {
                        this.jdSub.unsubscribe()
                    }
                    onConfirm() {
                        if (!this.withoutOTP && this.charCount < 3)
                            return (
                                console.log(
                                    'Logged out because of char pressed is' + this.charCount,
                                ),
                                this.userService.logout(),
                                void this.router.navigate(['/logout'])
                            )
                        console.log('OTP :' + this.otp)
                        const e = this.paymentService.paymentDetailDTO
                        if (
                            ((e.paramList = [
                                { key: 'OTP', value: this.otp },
                                {
                                    key: 'TXN_TYPE',
                                    value: this.paymentService.paymentType + '',
                                },
                            ]),
                            this.reTryBooking &&
                                (e.paramList = [
                                    { key: 'Success', value: '000' },
                                    { key: 'Message', value: 'Success' },
                                    ,
                                    {
                                        key: 'TXN_TYPE',
                                        value: this.paymentService.paymentType + '',
                                    },
                                ]),
                            (this.langService.loader = true),
                            'SOFT_POINT_PURCHASE' != this.paymentService.paymentType)
                        ) {
                            this.jdSub = this.store.select(c.h).subscribe((e) => {
                                this.journeyDetails = e
                            })
                            let t = this.userResponse.mobileAppConfigDTO.minmPaymentTime,
                                n = new Date().getTime() - this.journeyDetails.startTime
                            n < t
                                ? Object(s.a)(t - n).subscribe(() => {
                                      this.bookingService
                                          .verifyPayment(this.clientTxnId, e)
                                          .subscribe((e) => {
                                              if (
                                                  (console.log(JSON.stringify(e)),
                                                  (this.langService.loader = false),
                                                  (this.bookingService.bookingResponse = e),
                                                  (e.bookingResponseDTO = Array.isArray(
                                                      e.bookingResponseDTO,
                                                  )
                                                      ? e.bookingResponseDTO
                                                      : Array.of(e.bookingResponseDTO)),
                                                  null == e.bookingResponseDTO[0].errorMessage
                                                      ? this.router.navigate([
                                                            'payment/ewallet-response',
                                                        ])
                                                      : ((this.errorMessage =
                                                            e.bookingResponseDTO[0].errorMessage),
                                                        null !=
                                                            this.bookingService.bookingResponse
                                                                .retryBooking &&
                                                        'true' ==
                                                            this.bookingService.bookingResponse
                                                                .retryBooking
                                                            ? (this.reTryBooking = true)
                                                            : ((this.reTryBooking = false),
                                                              this.messageService.add({
                                                                  life: this.langService.life,
                                                                  severity: 'error',
                                                                  summary:
                                                                      this.langService.errorMsg
                                                                          .errorHeader,
                                                                  detail: e.bookingResponseDTO[0]
                                                                      .errorMessage,
                                                              }))),
                                                  null !=
                                                      this.bookingService.bookingResponse
                                                          .userDetail)
                                              ) {
                                                  this.userService.userResponse =
                                                      this.bookingService.bookingResponse.userDetail
                                                  let e = JSON.parse(
                                                      JSON.stringify(
                                                          this.bookingService.bookingResponse
                                                              .userDetail,
                                                      ),
                                                  )
                                                  void 0 !== e.userConfigurablesDTOs &&
                                                      (e.userConfigurablesDTOs = Array.isArray(
                                                          e.userConfigurablesDTOs,
                                                      )
                                                          ? e.userConfigurablesDTOs
                                                          : Array.of(e.userConfigurablesDTOs))
                                                  const t = {
                                                      token: this.restClientService.token,
                                                      user: e,
                                                  }
                                                  ;(this.userService.userResponse = e),
                                                      this.store.dispatch(new l.e(t)),
                                                      this.store.dispatch(new r.r(null))
                                              }
                                          })
                                  })
                                : this.bookingService
                                      .verifyPayment(this.clientTxnId, e)
                                      .subscribe((e) => {
                                          console.log(JSON.stringify(e)),
                                              (this.langService.loader = false),
                                              (this.bookingService.bookingResponse = e),
                                              (e.bookingResponseDTO = Array.isArray(
                                                  e.bookingResponseDTO,
                                              )
                                                  ? e.bookingResponseDTO
                                                  : Array.of(e.bookingResponseDTO)),
                                              null == e.bookingResponseDTO[0].errorMessage
                                                  ? this.router.navigate([
                                                        'payment/ewallet-response',
                                                    ])
                                                  : ((this.errorMessage =
                                                        e.bookingResponseDTO[0].errorMessage),
                                                    null !=
                                                        this.bookingService.bookingResponse
                                                            .retryBooking &&
                                                    'true' ==
                                                        this.bookingService.bookingResponse
                                                            .retryBooking
                                                        ? (this.reTryBooking = true)
                                                        : ((this.reTryBooking = false),
                                                          this.messageService.add({
                                                              life: this.langService.life,
                                                              severity: 'error',
                                                              summary:
                                                                  this.langService.errorMsg
                                                                      .errorHeader,
                                                              detail: e.bookingResponseDTO[0]
                                                                  .errorMessage,
                                                          }))),
                                              null !=
                                                  this.bookingService.bookingResponse.userDetail &&
                                                  (this.userService.userResponse =
                                                      this.bookingService.bookingResponse.userDetail)
                                      })
                        }
                        'SOFT_POINT_PURCHASE' == this.paymentService.paymentType &&
                            ((null != this.clientTxnId && null != this.clientTxnId) ||
                                (this.clientTxnId = e.transationId + ''),
                            this.bookingService.verifyLoyaltyPurchagetEwallet(e).subscribe((e) => {
                                ;(this.langService.loader = true),
                                    console.log(JSON.stringify(e)),
                                    (this.softPurchaseView = e),
                                    null == this.softPurchaseView.errorMessage &&
                                    13 == this.softPurchaseView.paymentDetailDTO.txnStatus
                                        ? ((this.paymentService.softPurchaseView =
                                              this.softPurchaseView),
                                          this.router.navigate(['payment/ewallet-response']))
                                        : this.messageService.add({
                                              life: this.langService.life,
                                              severity: 'error',
                                              summary: this.langService.errorMsg.errorHeader,
                                              detail: this.softPurchaseView.errorMessage,
                                          })
                            }))
                    }
                    keyboardInput(e) {
                        console.log(
                            e.key + ' & val = ' + e.keyCode + ' & Count =' + this.charCount,
                        ),
                            e.ctrlKey || 'Control' == e.key || 'ContextMenu' == e.key
                                ? (event.preventDefault(), event.stopPropagation())
                                : 'input' == e.target.localName &&
                                  'number' == e.target.type &&
                                  (this.charCount = this.charCount + 1)
                    }
                    resendOtp() {
                        console.log('Resend otp' + this.clientTxnId),
                            this.bookingService
                                .resendPaymentOtp(this.clientTxnId)
                                .subscribe((e) => {
                                    console.log(JSON.stringify(e)),
                                        this.messageService.add({
                                            life: this.langService.life,
                                            severity: 'success',
                                            summary: '',
                                            detail: e.status,
                                        })
                                })
                    }
                    get validOtp() {
                        return this.otp && this.otp.length > 1
                    }
                    onCancel() {
                        this.router.navigate(
                            'SOFT_POINT_PURCHASE' == this.paymentService.paymentType
                                ? ['payment/purchase-loyalty']
                                : ['train-search'],
                        )
                    }
                    redirect() {
                        console.log('Booking Ticket canceled.... without choice.... '),
                            this.router.navigate(['home'])
                    }
                    validateOtp(e) {
                        return 8 === e.charCode || 0 === e.charCode || 13 === e.charCode
                            ? null
                            : e.charCode >= 48 && e.charCode <= 57
                    }
                }
                return (
                    (e.ɵfac = function (t) {
                        return new (t || e)(
                            o.Ub(g.c),
                            o.Ub(d.k),
                            o.Ub(b.a),
                            o.Ub(u.a),
                            o.Ub(p.a),
                            o.Ub(i.b),
                            o.Ub(m.b),
                            o.Ub(h.a),
                            o.Ub(f.d),
                        )
                    }),
                    (e.ɵcmp = o.Ob({
                        type: e,
                        selectors: [['app-ewallet-confirm']],
                        hostBindings: function (e, t) {
                            1 & e &&
                                o.ic(
                                    'keydown',
                                    function (e) {
                                        return t.keyboardInput(e)
                                    },
                                    false,
                                    o.Jc,
                                )
                        },
                        decls: 59,
                        vars: 29,
                        consts: [
                            [
                                1,
                                'top-header',
                                'hidden-lg',
                                'hidden-md',
                                'hidden-sm',
                                2,
                                'padding-top',
                                '14px',
                                'padding-bottom',
                                '14px',
                            ],
                            [1, 'top-header-content', 'col-xs-12'],
                            [1, 'fa', 'fa-long-arrow-left', 2, 'padding-right', '5px', 3, 'click'],
                            [1, 'col-xs-12', 'col-sm-6', 'border-all', 'col-sm-push-3'],
                            [1, 'inputBoxPad', 'col-xs-12'],
                            [1, 'pull-left'],
                            [1, 'pull-right'],
                            [
                                'class',
                                'inputBoxPad col-sm-4 col-xs-12',
                                'oncontextmenu',
                                'return false',
                                4,
                                'ngIf',
                            ],
                            ['class', 'inputBoxPad col-xs-12', 4, 'ngIf'],
                            [1, 'col-xs-12'],
                            [1, 'text-center'],
                            [1, 'pull-left', 2, 'width', '49.9%'],
                            [
                                'type',
                                'button',
                                1,
                                'mob-bot-btn',
                                'search_btn',
                                2,
                                'background',
                                '#fb792b',
                                3,
                                'click',
                            ],
                            [1, 'pull-right', 2, 'width', '49.9%'],
                            ['type', 'button', 1, 'mob-bot-btn', 'search_btn', 3, 'click'],
                            [
                                'modal',
                                'true',
                                'header',
                                'Retry Booking Confirmation',
                                3,
                                'visible',
                                'responsive',
                                'closable',
                                'closeOnEscape',
                                'visibleChange',
                            ],
                            [1, 'pnr-detail'],
                            [
                                1,
                                'col-md-12',
                                'col-sm-12',
                                'col-xs-12',
                                'text-center',
                                2,
                                'padding-top',
                                '10px',
                            ],
                            [1, 'text-center', 2, 'font-size', '1.5rem', 'color', 'red'],
                            [
                                1,
                                'text-center',
                                'col-md-12',
                                'col-sm-12',
                                'col-xs-12',
                                2,
                                'padding-top',
                                '15px',
                            ],
                            [
                                'type',
                                'submit',
                                1,
                                'loginButton',
                                'col-md-5',
                                'col-sm-5',
                                'col-xs-5',
                                'pull-right',
                                3,
                                'click',
                            ],
                            [
                                1,
                                'loginButton',
                                'col-md-5',
                                'col-sm-5',
                                'col-xs-5',
                                'pull-left',
                                3,
                                'click',
                            ],
                            [
                                'oncontextmenu',
                                'return false',
                                1,
                                'inputBoxPad',
                                'col-sm-4',
                                'col-xs-12',
                            ],
                            [
                                'type',
                                'number',
                                'minlength',
                                '1',
                                'maxlength',
                                '8',
                                'autocomplete',
                                'off',
                                1,
                                'form-control',
                                3,
                                'ngModel',
                                'placeholder',
                                'ngModelChange',
                                'keypress',
                            ],
                            [3, 'innerHTML', 'click'],
                        ],
                        template: function (e, t) {
                            1 & e &&
                                (o.ac(0, 'div', 0),
                                o.ac(1, 'span', 1),
                                o.ac(2, 'span', 2),
                                o.ic('click', function () {
                                    return t._location.back()
                                }),
                                o.Zb(),
                                o.ac(3, 'strong'),
                                o.Tc(4),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Vb(5, 'p-toast'),
                                o.ac(6, 'div', 3),
                                o.ac(7, 'div', 4),
                                o.ac(8, 'span', 5),
                                o.Tc(9),
                                o.Zb(),
                                o.ac(10, 'span', 6),
                                o.Tc(11),
                                o.Zb(),
                                o.Zb(),
                                o.ac(12, 'div', 4),
                                o.ac(13, 'span', 5),
                                o.Tc(14),
                                o.Zb(),
                                o.ac(15, 'span', 6),
                                o.Tc(16),
                                o.Zb(),
                                o.Zb(),
                                o.ac(17, 'div', 4),
                                o.ac(18, 'span', 5),
                                o.Tc(19),
                                o.Zb(),
                                o.ac(20, 'span', 6),
                                o.Tc(21),
                                o.nc(22, 'number'),
                                o.Zb(),
                                o.Zb(),
                                o.ac(23, 'div', 4),
                                o.ac(24, 'span', 5),
                                o.Tc(25),
                                o.Zb(),
                                o.ac(26, 'span', 6),
                                o.Tc(27),
                                o.nc(28, 'number'),
                                o.Zb(),
                                o.Zb(),
                                o.ac(29, 'div', 4),
                                o.ac(30, 'span'),
                                o.Tc(31),
                                o.Zb(),
                                o.Zb(),
                                o.Rc(32, k, 2, 2, 'div', 7),
                                o.Rc(33, T, 2, 1, 'div', 8),
                                o.ac(34, 'div', 9),
                                o.ac(35, 'div', 10),
                                o.ac(36, 'div', 11),
                                o.ac(37, 'button', 12),
                                o.ic('click', function () {
                                    return t.onConfirm()
                                }),
                                o.Tc(38),
                                o.Zb(),
                                o.Zb(),
                                o.ac(39, 'div', 13),
                                o.ac(40, 'button', 14),
                                o.ic('click', function () {
                                    return t._location.back()
                                }),
                                o.Tc(41),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.ac(42, 'p-dialog', 15),
                                o.ic('visibleChange', function (e) {
                                    return (t.reTryBooking = e)
                                }),
                                o.ac(43, 'div', 16),
                                o.ac(44, 'div'),
                                o.ac(45, 'div', 17),
                                o.ac(46, 'b'),
                                o.ac(47, 'div', 18),
                                o.ac(48, 'p'),
                                o.ac(49, 'span'),
                                o.Tc(50),
                                o.Zb(),
                                o.Zb(),
                                o.ac(51, 'p'),
                                o.ac(52, 'span'),
                                o.Tc(53),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.ac(54, 'div', 19),
                                o.ac(55, 'button', 20),
                                o.ic('click', function () {
                                    return t.onConfirm()
                                }),
                                o.Tc(56, 'Yes'),
                                o.Zb(),
                                o.ac(57, 'button', 21),
                                o.ic('click', function () {
                                    return t.redirect()
                                }),
                                o.Tc(58, 'No'),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Zb()),
                                2 & e &&
                                    (o.Cb(4),
                                    o.Vc(
                                        ' ',
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.ewalletPay,
                                        ' ',
                                    ),
                                    o.Cb(5),
                                    o.Uc(
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.userName,
                                    ),
                                    o.Cb(2),
                                    o.Uc(t.userName),
                                    o.Cb(3),
                                    o.Uc(
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.curntBal,
                                    ),
                                    o.Cb(2),
                                    o.Vc('₹ ', t.ewalletBalance, ''),
                                    o.Cb(3),
                                    o.Vc(
                                        '*',
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.amntToDeduct,
                                        '',
                                    ),
                                    o.Cb(2),
                                    o.Vc('₹ ', o.pc(22, 22, t.amount, '1.2-2'), ''),
                                    o.Cb(4),
                                    o.Uc(
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.remainingBal,
                                    ),
                                    o.Cb(2),
                                    o.Vc(
                                        '₹ ',
                                        o.pc(28, 25, t.ewalletBalance - t.amount, '1.2-2'),
                                        '',
                                    ),
                                    o.Cb(4),
                                    o.Uc(
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.ewalletAmount,
                                    ),
                                    o.Cb(1),
                                    o.tc('ngIf', !t.withoutOTP),
                                    o.Cb(1),
                                    o.tc('ngIf', !t.withoutOTP),
                                    o.Cb(5),
                                    o.Vc(
                                        ' ',
                                        null == t.langService.lang ? null : t.langService.lang.cnf,
                                        ' ',
                                    ),
                                    o.Cb(3),
                                    o.Uc(
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.cancel,
                                    ),
                                    o.Cb(1),
                                    o.Pc(o.yc(28, D)),
                                    o.tc('visible', t.reTryBooking)('responsive', true)(
                                        'closable',
                                        false,
                                    )('closeOnEscape', false),
                                    o.Cb(8),
                                    o.Uc(t.errorMessage),
                                    o.Cb(3),
                                    o.Uc(
                                        null == t.langService.errorMsg
                                            ? null
                                            : t.langService.errorMsg.ewalletConfirmAlert1,
                                    ))
                        },
                        directives: [v.a, d.o, y.a, S.s, S.b, S.l, S.k, S.n, S.q],
                        pipes: [d.g],
                        encapsulation: 2,
                    })),
                    e
                )
            })()
            var I = n('fk4S')
            const Z = function () {
                return { width: '600px' }
            }
            let w = (() => {
                class e {
                    constructor(e, t, n, a, i, c, s, l) {
                        ;(this.router = e),
                            (this.userService = t),
                            (this.langService = n),
                            (this.store = a),
                            (this.paymentService = i),
                            (this.bookingService = c),
                            (this.messageService = s),
                            (this.restClientService = l),
                            (this.reTryBooking = false),
                            (this.errorMessage = ''),
                            (this.charCount = 0)
                    }
                    ngOnInit() {
                        ;(this.softPaymentDTO = this.paymentService.softPaymentDTO),
                            this.store
                                .select(c.h)
                                .subscribe((e) => (this.clientTxnId = e.clientTxnId))
                        const e = this.paymentService.paymentDetailDTO.paramList
                        ;(Array.isArray(e) ? e : Array.of(e)).forEach((e) => {
                            ;('AMOUNT' !== e.key && 'amount' !== e.key) ||
                                (this.amount = Number(e.value))
                        }),
                            (this.userName = this.userService.userResponse.userName)
                    }
                    resendOtp() {
                        console.log('Resend otp' + this.clientTxnId),
                            this.bookingService
                                .resendPaymentOtp(this.clientTxnId)
                                .subscribe((e) => {
                                    console.log(JSON.stringify(e)),
                                        this.messageService.add({
                                            life: this.langService.life,
                                            severity: 'success',
                                            summary: '',
                                            detail: e.status,
                                        })
                                })
                    }
                    //here
                    onConfirm() {
                        if (this.charCount < 3)
                            return (
                                console.log(
                                    'Logged out because of char pressed is' + this.charCount,
                                ),
                                this.userService.logout(),
                                void this.router.navigate(['/logout'])
                            )
                        console.log('OTP :' + this.otp)
                        const e = this.paymentService.paymentDetailDTO
                        ;(e.paramList = [{ key: 'OTP', value: this.otp }]),
                            this.reTryBooking &&
                                (e.paramList = [
                                    { key: 'Success', value: '000' },
                                    { key: 'Message', value: 'Success' },
                                ]),
                            (this.langService.loader = true),
                            (this.jdSub = this.store.select(c.h).subscribe((e) => {
                                this.journeyDetails = e
                            })),
                            console.log(JSON.stringify(e))
                        let t = this.userService.userResponse.mobileAppConfigDTO.minmPaymentTime,
                            n = new Date().getTime() - this.journeyDetails.startTime
                        n < t
                            ? Object(s.a)(t - n).subscribe(() => {
                                  this.bookingService
                                      .verifyPayment(this.clientTxnId, e)
                                      .subscribe((e) => {
                                          console.log(JSON.stringify(e)),
                                              (this.langService.loader = false),
                                              (this.bookingService.bookingResponse = e),
                                              this.userMaintain(e.userDetail),
                                              (e.bookingResponseDTO = Array.isArray(
                                                  e.bookingResponseDTO,
                                              )
                                                  ? e.bookingResponseDTO
                                                  : Array.of(e.bookingResponseDTO)),
                                              null == e.bookingResponseDTO[0].errorMessage
                                                  ? this.router.navigate([
                                                        'payment/ewallet-response',
                                                    ])
                                                  : ((this.errorMessage =
                                                        e.bookingResponseDTO[0].errorMessage),
                                                    null !=
                                                        this.bookingService.bookingResponse
                                                            .retryBooking &&
                                                    'true' ==
                                                        this.bookingService.bookingResponse
                                                            .retryBooking
                                                        ? (this.reTryBooking = true)
                                                        : ((this.reTryBooking = false),
                                                          this.messageService.add({
                                                              life: this.langService.life,
                                                              severity: 'error',
                                                              summary:
                                                                  this.langService.errorMsg
                                                                      .errorHeader,
                                                              detail: e.bookingResponseDTO[0]
                                                                  .errorMessage,
                                                          }))),
                                              null !=
                                                  this.bookingService.bookingResponse.userDetail &&
                                                  (this.userService.userResponse =
                                                      this.bookingService.bookingResponse.userDetail)
                                      })
                              })
                            : this.bookingService
                                  .verifyPayment(this.clientTxnId, e)
                                  .subscribe((e) => {
                                      console.log(JSON.stringify(e)),
                                          (this.langService.loader = false),
                                          (this.bookingService.bookingResponse = e),
                                          this.userMaintain(e.userDetail),
                                          (e.bookingResponseDTO = Array.isArray(
                                              e.bookingResponseDTO,
                                          )
                                              ? e.bookingResponseDTO
                                              : Array.of(e.bookingResponseDTO)),
                                          null == e.bookingResponseDTO[0].errorMessage
                                              ? this.router.navigate(['payment/ewallet-response'])
                                              : ((this.errorMessage =
                                                    e.bookingResponseDTO[0].errorMessage),
                                                null !=
                                                    this.bookingService.bookingResponse
                                                        .retryBooking &&
                                                'true' ==
                                                    this.bookingService.bookingResponse.retryBooking
                                                    ? (this.reTryBooking = true)
                                                    : ((this.reTryBooking = false),
                                                      this.messageService.add({
                                                          life: this.langService.life,
                                                          severity: 'error',
                                                          summary:
                                                              this.langService.errorMsg.errorHeader,
                                                          detail: e.bookingResponseDTO[0]
                                                              .errorMessage,
                                                      }))),
                                          null != this.bookingService.bookingResponse.userDetail &&
                                              (this.userService.userResponse =
                                                  this.bookingService.bookingResponse.userDetail)
                                  })
                    }
                    keyboardInput(e) {
                        console.log(
                            e.key + ' & val = ' + e.keyCode + ' & Count =' + this.charCount,
                        ),
                            e.ctrlKey || 'Control' == e.key || 'ContextMenu' == e.key
                                ? (event.preventDefault(), event.stopPropagation())
                                : 'input' == e.target.localName &&
                                  'number' == e.target.type &&
                                  (this.charCount = this.charCount + 1)
                    }
                    onCancel() {
                        this.router.navigate(['/'])
                    }
                    validateOtp(e) {
                        return 8 === e.charCode || 0 === e.charCode || 13 === e.charCode
                            ? null
                            : e.charCode >= 48 && e.charCode <= 57
                    }
                    get validOtp() {
                        return this.otp && this.otp.length >= 1 && this.otp.length <= 8
                    }
                    redirect() {
                        console.log('Booking Ticket canceled.... without choice.... '),
                            this.router.navigate(['home'])
                    }
                    userMaintain(e) {
                        if (null != e && null != e) {
                            void 0 !== (e = JSON.parse(JSON.stringify(e))).userConfigurablesDTOs &&
                                (e.userConfigurablesDTOs = Array.isArray(e.userConfigurablesDTOs)
                                    ? e.userConfigurablesDTOs
                                    : Array.of(e.userConfigurablesDTOs))
                            const t = {
                                token: this.restClientService.token,
                                user: e,
                            }
                            ;(this.userService.userResponse = e),
                                this.store.dispatch(new l.e(t)),
                                this.store.dispatch(new r.r(null))
                        }
                    }
                }
                return (
                    (e.ɵfac = function (t) {
                        return new (t || e)(
                            o.Ub(g.c),
                            o.Ub(u.a),
                            o.Ub(b.a),
                            o.Ub(m.b),
                            o.Ub(i.b),
                            o.Ub(h.a),
                            o.Ub(f.d),
                            o.Ub(p.a),
                        )
                    }),
                    (e.ɵcmp = o.Ob({
                        type: e,
                        selectors: [['app-loyalty-redemption-otp']],
                        hostBindings: function (e, t) {
                            1 & e &&
                                o.ic(
                                    'keydown',
                                    function (e) {
                                        return t.keyboardInput(e)
                                    },
                                    false,
                                    o.Jc,
                                )
                        },
                        decls: 66,
                        vars: 28,
                        consts: [
                            [1, 'container-fluid'],
                            [1, 'row-fluid'],
                            [1, 'col-xs-12', 'nopadding'],
                            [1, 'container', 'nopadding'],
                            [1, 'row-fluid', 'nopadding'],
                            [1, 'col-md-12', 'nopadding'],
                            ['legend', 'Please confirm transaction', 1, 'nopadding'],
                            [1, 'table', 'table-striped', 'nopadding'],
                            [1, 'nopadding'],
                            [1, 'container-fluid', 2, 'padding-bottom', '20px'],
                            [1, 'row-fluid', 2, 'text-align', 'center', 'padding-bottom', '20px'],
                            [
                                'oncontextmenu',
                                'return false',
                                1,
                                'inputBoxPad',
                                'col-sm-4',
                                'col-xs-12',
                            ],
                            [
                                'type',
                                'number',
                                'minlength',
                                '1',
                                'maxlength',
                                '8',
                                'autocomplete',
                                'off',
                                1,
                                'form-control',
                                3,
                                'ngModel',
                                'placeholder',
                                'ngModelChange',
                                'keypress',
                            ],
                            [1, 'inputBoxPad', 'col-xs-12'],
                            [3, 'innerHTML', 'click'],
                            [1, 'col-xs-12'],
                            [1, 'text-center'],
                            [1, 'pull-left', 2, 'width', '49.9%'],
                            [
                                'type',
                                'button',
                                1,
                                'mob-bot-btn',
                                'search_btn',
                                2,
                                'background',
                                '#fb792b',
                                3,
                                'click',
                            ],
                            [1, 'pull-right', 2, 'width', '49.9%'],
                            ['type', 'button', 1, 'mob-bot-btn', 'search_btn', 3, 'click'],
                            [1, 'col-md-1'],
                            [
                                'modal',
                                'true',
                                'header',
                                'Retry Booking Confirmation',
                                3,
                                'visible',
                                'responsive',
                                'closable',
                                'closeOnEscape',
                                'visibleChange',
                            ],
                            [1, 'pnr-detail'],
                            [
                                1,
                                'col-md-12',
                                'col-sm-12',
                                'col-xs-12',
                                'text-center',
                                2,
                                'padding-top',
                                '10px',
                            ],
                            [1, 'text-center', 2, 'font-size', '1.5rem', 'color', 'red'],
                            [
                                1,
                                'text-center',
                                'col-md-12',
                                'col-sm-12',
                                'col-xs-12',
                                2,
                                'padding-top',
                                '15px',
                            ],
                            [
                                'type',
                                'submit',
                                1,
                                'loginButton',
                                'col-md-5',
                                'col-sm-5',
                                'col-xs-5',
                                'pull-right',
                                3,
                                'click',
                            ],
                            [
                                1,
                                'loginButton',
                                'col-md-5',
                                'col-sm-5',
                                'col-xs-5',
                                'pull-left',
                                3,
                                'click',
                            ],
                        ],
                        template: function (e, t) {
                            1 & e &&
                                (o.ac(0, 'div', 0),
                                o.ac(1, 'div', 1),
                                o.ac(2, 'div', 2),
                                o.ac(3, 'div', 3),
                                o.ac(4, 'div', 1),
                                o.Vb(5, 'p-toast'),
                                o.Zb(),
                                o.ac(6, 'div', 4),
                                o.ac(7, 'div', 5),
                                o.ac(8, 'p-fieldset', 6),
                                o.ac(9, 'table', 7),
                                o.ac(10, 'tbody', 8),
                                o.ac(11, 'tr'),
                                o.ac(12, 'td'),
                                o.Tc(13),
                                o.Zb(),
                                o.ac(14, 'td'),
                                o.Tc(15),
                                o.Zb(),
                                o.Zb(),
                                o.ac(16, 'tr'),
                                o.ac(17, 'td'),
                                o.Tc(18),
                                o.Zb(),
                                o.ac(19, 'td'),
                                o.Tc(20),
                                o.Zb(),
                                o.Zb(),
                                o.ac(21, 'tr'),
                                o.ac(22, 'td'),
                                o.Tc(23),
                                o.Zb(),
                                o.ac(24, 'td'),
                                o.Tc(25),
                                o.Zb(),
                                o.Zb(),
                                o.ac(26, 'tr'),
                                o.ac(27, 'td'),
                                o.Tc(28),
                                o.Zb(),
                                o.ac(29, 'td'),
                                o.Tc(30),
                                o.nc(31, 'number'),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.ac(32, 'div', 9),
                                o.ac(33, 'div', 10),
                                o.ac(34, 'h3'),
                                o.Tc(35),
                                o.Zb(),
                                o.Zb(),
                                o.ac(36, 'div', 11),
                                o.ac(37, 'input', 12),
                                o.ic('ngModelChange', function (e) {
                                    return (t.otp = e)
                                })('keypress', function (e) {
                                    return t.validateOtp(e)
                                }),
                                o.Zb(),
                                o.Zb(),
                                o.ac(38, 'div', 13),
                                o.ac(39, 'span', 14),
                                o.ic('click', function () {
                                    return t.resendOtp()
                                }),
                                o.Zb(),
                                o.Zb(),
                                o.ac(40, 'div', 15),
                                o.ac(41, 'div', 16),
                                o.ac(42, 'div', 17),
                                o.ac(43, 'button', 18),
                                o.ic('click', function () {
                                    return t.onConfirm()
                                }),
                                o.Tc(44),
                                o.Zb(),
                                o.Zb(),
                                o.ac(45, 'div', 19),
                                o.ac(46, 'button', 20),
                                o.ic('click', function () {
                                    return t.onCancel()
                                }),
                                o.Tc(47),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Vb(48, 'div', 21),
                                o.Zb(),
                                o.Zb(),
                                o.ac(49, 'p-dialog', 22),
                                o.ic('visibleChange', function (e) {
                                    return (t.reTryBooking = e)
                                }),
                                o.ac(50, 'div', 23),
                                o.ac(51, 'div'),
                                o.ac(52, 'div', 24),
                                o.ac(53, 'b'),
                                o.ac(54, 'div', 25),
                                o.ac(55, 'p'),
                                o.ac(56, 'span'),
                                o.Tc(57),
                                o.Zb(),
                                o.Zb(),
                                o.ac(58, 'p'),
                                o.ac(59, 'span'),
                                o.Tc(60),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.ac(61, 'div', 26),
                                o.ac(62, 'button', 27),
                                o.ic('click', function () {
                                    return t.onConfirm()
                                }),
                                o.Tc(63),
                                o.Zb(),
                                o.ac(64, 'button', 28),
                                o.ic('click', function () {
                                    return t.redirect()
                                }),
                                o.Tc(65),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Zb()),
                                2 & e &&
                                    (o.Cb(13),
                                    o.Vc(
                                        '',
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.userName,
                                        ' :',
                                    ),
                                    o.Cb(2),
                                    o.Uc(t.userName),
                                    o.Cb(3),
                                    o.Vc(
                                        '',
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.curntSoftAccntBal,
                                        ' :',
                                    ),
                                    o.Cb(2),
                                    o.Vc('₹ ', t.softPaymentDTO.loyaltyPointBalance, ''),
                                    o.Cb(3),
                                    o.Vc(
                                        '',
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.amntToDeduct,
                                        ' :',
                                    ),
                                    o.Cb(2),
                                    o.Vc('* ₹ ', t.amount, ''),
                                    o.Cb(3),
                                    o.Vc(
                                        '',
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.remainingBal,
                                        ' :',
                                    ),
                                    o.Cb(2),
                                    o.Vc(
                                        '₹ ',
                                        o.pc(
                                            31,
                                            24,
                                            t.softPaymentDTO.loyaltyPointBalance - t.amount,
                                            '1.2-2',
                                        ),
                                        '',
                                    ),
                                    o.Cb(5),
                                    o.Uc(
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.otpSecurity,
                                    ),
                                    o.Cb(2),
                                    o.uc(
                                        'placeholder',
                                        null == t.langService.lang ? null : t.langService.lang.otp,
                                    ),
                                    o.tc('ngModel', t.otp),
                                    o.Cb(2),
                                    o.tc(
                                        'innerHTML',
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.ewalletClickHereMsg,
                                        o.Lc,
                                    ),
                                    o.Cb(5),
                                    o.Vc(
                                        ' ',
                                        null == t.langService.lang ? null : t.langService.lang.cnf,
                                        ' ',
                                    ),
                                    o.Cb(3),
                                    o.Uc(
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.cancel,
                                    ),
                                    o.Cb(2),
                                    o.Pc(o.yc(27, Z)),
                                    o.tc('visible', t.reTryBooking)('responsive', true)(
                                        'closable',
                                        false,
                                    )('closeOnEscape', false),
                                    o.Cb(8),
                                    o.Uc(t.errorMessage),
                                    o.Cb(3),
                                    o.Uc(
                                        null == t.langService.errorMsg
                                            ? null
                                            : t.langService.errorMsg.ewalletConfirmAlert1,
                                    ),
                                    o.Cb(3),
                                    o.Uc(
                                        null == t.langService.lang ? null : t.langService.lang.yes,
                                    ),
                                    o.Cb(2),
                                    o.Uc(null == t.langService.lang ? null : t.langService.lang.no))
                        },
                        directives: [v.a, I.a, S.s, S.b, S.l, S.k, S.n, S.q, y.a],
                        pipes: [d.g],
                        encapsulation: 2,
                    })),
                    e
                )
            })()
            var P = n('PCNd')
            const M = ['countdownNumberEl']
            let R = (() => {
                    class e {
                        constructor() {
                            this.countdown = 120
                        }
                        ngOnInit() {}
                        ngAfterViewInit() {
                            this.countdownNumberEl &&
                                ((this.countdownNumberEl.nativeElement.style.height =
                                    this.countdownNumberEl.nativeElement.scrollHeight + 'px'),
                                (this.countdownNumberEl.nativeElement.innerHTML =
                                    this.countdown.toString() + ' sec'),
                                setInterval(() => {
                                    ;(this.countdown =
                                        this.countdown - 1 <= 0 ? 120 : this.countdown - 1),
                                        (this.countdownNumberEl.nativeElement.innerHTML =
                                            this.countdown.toString() + ' sec')
                                }, 1e3))
                        }
                    }
                    return (
                        (e.ɵfac = function (t) {
                            return new (t || e)()
                        }),
                        (e.ɵcmp = o.Ob({
                            type: e,
                            selectors: [['app-hdfc-payment']],
                            viewQuery: function (e, t) {
                                var n
                                1 & e && o.cd(M, true),
                                    2 & e && o.Hc((n = o.jc())) && (t.countdownNumberEl = n.first)
                            },
                            decls: 13,
                            vars: 0,
                            consts: [
                                [
                                    1,
                                    'center-block',
                                    'text-center',
                                    2,
                                    'width',
                                    '66%',
                                    'color',
                                    'rgb(255, 0, 13)',
                                    'font-size',
                                    '3.2rem',
                                    'margin-top',
                                    '50px',
                                ],
                                [
                                    1,
                                    'center-block',
                                    'text-center',
                                    2,
                                    'width',
                                    '66%',
                                    'color',
                                    'rgb(255, 0, 21)',
                                    'font-size',
                                    '3.2rem',
                                ],
                                [
                                    1,
                                    'container',
                                    2,
                                    'position',
                                    'relative',
                                    'margin',
                                    'auto',
                                    'margin-top',
                                    '100px',
                                    'margin-bottom',
                                    '200px',
                                    'text-align',
                                    'center',
                                ],
                                [
                                    2,
                                    'color',
                                    'rgb(214, 2, 2)',
                                    'display',
                                    'inline-block',
                                    'line-height',
                                    '40px',
                                    'font-size',
                                    '4.0rem',
                                    'margin-bottom',
                                    '50px',
                                ],
                                ['countdownNumberEl', ''],
                                [
                                    'stroke',
                                    'blue',
                                    'r',
                                    '80',
                                    'cx',
                                    '100',
                                    'cy',
                                    '100',
                                    'fill',
                                    'none',
                                    'stroke-width',
                                    '5',
                                ],
                                [
                                    1,
                                    'center-block',
                                    'text-center',
                                    2,
                                    'width',
                                    '66%',
                                    'color',
                                    'rgb(255, 0, 0)',
                                    'font-size',
                                    '3.2rem',
                                    'margin-top',
                                    '108px',
                                ],
                                [
                                    1,
                                    'center-block',
                                    'text-center',
                                    2,
                                    'width',
                                    '66%',
                                    'color',
                                    'rgb(255, 0, 0)',
                                    'font-size',
                                    '3.2rem',
                                ],
                            ],
                            template: function (e, t) {
                                1 & e &&
                                    (o.ac(0, 'div', 0),
                                    o.Tc(1, ' BHIM / UPI Payment '),
                                    o.Zb(),
                                    o.ac(2, 'div', 1),
                                    o.Tc(3, ' (Powered by HDFC BANK) '),
                                    o.Zb(),
                                    o.ac(4, 'div', 2),
                                    o.Vb(5, 'div', 3, 4),
                                    o.lc(),
                                    o.ac(7, 'svg'),
                                    o.Vb(8, 'circle', 5),
                                    o.Zb(),
                                    o.kc(),
                                    o.ac(9, 'div', 6),
                                    o.Tc(10, ' Payment is initiated... '),
                                    o.Zb(),
                                    o.ac(11, 'div', 7),
                                    o.Tc(
                                        12,
                                        ' Please approve the notification received on your mobile App… ',
                                    ),
                                    o.Zb(),
                                    o.Zb())
                            },
                            styles: [
                                'svg[_ngcontent-%COMP%]{position:absolute;top:-34%;left:40%;width:241px;height:194px;transform:rotateY(-180deg) rotate(-90deg)}svg[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%]{stroke-dasharray:500px;stroke-dashoffset:0px;stroke-linecap:round;-webkit-animation:countdown 120s linear infinite forwards;animation:countdown 120s linear infinite forwards}@-webkit-keyframes countdown{0%{stroke-dashoffset:0px}to{stroke-dashoffset:500px}}@keyframes countdown{0%{stroke-dashoffset:0px}to{stroke-dashoffset:500px}}',
                            ],
                        })),
                        e
                    )
                })(),
                x = (() => {
                    class e {
                        constructor() {
                            ;(this.NETBANKING = 1),
                                (this.CREDIT_CARD = 2),
                                (this.DEBIT_CARD = 3),
                                (this.CASH_CARD = 4),
                                (this.UPI = 17),
                                (this.MVISA = 15),
                                (this.POD = 16),
                                (this.MPP = 9),
                                (this.PREPAID = 6),
                                (this.EMI = 8),
                                (this.EWALLET = 7),
                                (this.IC_PAYMENT_REDIRECT_RDS = 10),
                                (this.RDS = 5),
                                (this.IRCTC_IPAY = 18),
                                (this.LOYALITY_INDIGO = 19)
                        }
                    }
                    return (e.SOFT_REDEMPTION = 14), e
                })()
            function O(e) {
                const t = e.value
                return (function (e) {
                    let t,
                        n,
                        a = false,
                        i = 0
                    for (t = e.length - 1; t >= 0; t--)
                        (n = Number(e.charAt(t))),
                            a && ((n *= 2), n > 9 && (n -= 9)),
                            (a = !a),
                            (i += n)
                    return i % 10 == 0
                })(t)
                    ? (console.log(t + ': true'), true)
                    : (console.log(t + ': false'), false)
            }
            class E {
                constructor() {}
            }
            var A = n('gsC4'),
                V = n('8cFx'),
                B = n('rLOZ'),
                L = n('jLSX'),
                N = n('dts7')
            function U(e, t) {
                if ((1 & e && (o.ac(0, 'div', 33), o.Tc(1), o.Zb()), 2 & e)) {
                    const e = o.mc()
                    o.Cb(1),
                        o.Vc(
                            ' ',
                            null == e.langService.errorMsg
                                ? null
                                : e.langService.errorMsg.requiredAlert,
                            ' ',
                        )
                }
            }
            let F = (() => {
                class e {
                    constructor(e, t) {
                        ;(this.fb = e),
                            (this.langService = t),
                            (this.captchaType = 'LOGINCAPTCHA'),
                            (this.cardForm = e.group({
                                cardType: ['', S.x.required],
                                cardNo: ['', S.x.required],
                                cardExpMon: ['', S.x.required],
                                cardExpYear: ['', S.x.required],
                                cvv: ['', S.x.required],
                                name: ['', S.x.required],
                                captcha: ['', S.x.required],
                            }))
                    }
                    initcardType() {
                        ;(this.cardType = []),
                            this.cardType.push({
                                label: 'Select Card',
                                value: null,
                            }),
                            this.cardType.push({ label: 'VISA', value: 'VC' }),
                            this.cardType.push({ label: 'MASTER', value: 'MC' })
                    }
                    initMonth() {
                        ;(this.month = []),
                            this.month.push({
                                label: 'Select Month',
                                value: null,
                            }),
                            this.month.push({ label: '01 (Jan)', value: '01' }),
                            this.month.push({ label: '02 (Feb)', value: '02' }),
                            this.month.push({ label: '03 (Mar)', value: '03' }),
                            this.month.push({ label: '04 (Apr)', value: '04' }),
                            this.month.push({ label: '05 (May)', value: '05' }),
                            this.month.push({ label: '06 (Jun)', value: '06' }),
                            this.month.push({ label: '07 (Jul)', value: '07' }),
                            this.month.push({ label: '08 (Aug)', value: '08' }),
                            this.month.push({ label: '09 (Sep)', value: '09' }),
                            this.month.push({ label: '10 (Oct)', value: '10' }),
                            this.month.push({ label: '11 (Nov)', value: '11' }),
                            this.month.push({ label: '12 (Dec)', value: '12' })
                    }
                    ngOnInit() {
                        this.onSelectCard(), this.onSelectMonth()
                    }
                    onSelectCard() {
                        ;(this.cardType = []),
                            this.cardType.push({
                                label: 'Select Card',
                                value: null,
                            }),
                            this.cardType.push({ label: 'VISA', value: 'VC' }),
                            this.cardType.push({ label: 'MASTER', value: 'MC' })
                    }
                    onSelectMonth() {
                        '21' === this.bankId.value &&
                            ((this.month = []),
                            this.month.push({
                                label: 'Select Month',
                                value: null,
                            }),
                            this.month.push({ label: '01 (Jan)', value: '01' }),
                            this.month.push({ label: '02 (Feb)', value: '02' }),
                            this.month.push({ label: '03 (Mar)', value: '03' }),
                            this.month.push({ label: '04 (Apr)', value: '04' }),
                            this.month.push({ label: '05 (May)', value: '05' }),
                            this.month.push({ label: '06 (Jun)', value: '06' }),
                            this.month.push({ label: '07 (Jul)', value: '07' }),
                            this.month.push({ label: '08 (Aug)', value: '08' }),
                            this.month.push({ label: '09 (Sep)', value: '09' }),
                            this.month.push({ label: '10 (Oct)', value: '10' }),
                            this.month.push({ label: '11 (Nov)', value: '11' }),
                            this.month.push({ label: '12 (Dec)', value: '12' }))
                    }
                    initCardInput() {}
                }
                return (
                    (e.ɵfac = function (t) {
                        return new (t || e)(o.Ub(S.d), o.Ub(b.a))
                    }),
                    (e.ɵcmp = o.Ob({
                        type: e,
                        selectors: [['app-card-input']],
                        inputs: { cardForm: 'cardForm' },
                        decls: 53,
                        vars: 3,
                        consts: [
                            [3, 'formGroup'],
                            [1, 'header', 'col-md-12'],
                            [1, 'form-group', 'col-md-12'],
                            [
                                'type',
                                'text',
                                'placeholder',
                                'Enter your 16 digit card number',
                                'name',
                                'cardNo',
                                'formControlName',
                                'cardNo',
                                1,
                                'payment_tex',
                                3,
                                'value',
                            ],
                            ['class', 'alert alert-danger', 4, 'ngIf'],
                            [
                                'type',
                                'text',
                                'placeholder',
                                'Enter your name as specified on the card',
                                'name',
                                'cardName',
                                'formControlName',
                                'cardName',
                                1,
                                'payment_tex',
                            ],
                            [1, 'form-group', 'col-md-6'],
                            ['formControlName', 'cardExpMon', 1, 'payment_tex'],
                            ['value', '0', 'selected', 'selected'],
                            ['value', '01'],
                            ['value', '02'],
                            ['value', '03'],
                            ['value', '04'],
                            ['value', '05'],
                            ['value', '06'],
                            ['value', '07'],
                            ['value', '08'],
                            ['value', '09'],
                            ['value', '10'],
                            ['value', '11'],
                            ['value', '12'],
                            [
                                'type',
                                'text',
                                'placeholder',
                                'Expiry year (YYYY)',
                                'maxlength',
                                '4',
                                'formControlName',
                                'cardExpYear',
                                1,
                                'payment_tex',
                            ],
                            [1, 'form-group', 'col-md-3'],
                            [
                                'type',
                                'text',
                                'placeholder',
                                'CVV',
                                'formControlName',
                                'cvv',
                                1,
                                'payment_tex',
                            ],
                            [1, 'form-group', 'col-md-9'],
                            [
                                'appLazyLoad',
                                '',
                                'rel',
                                'preload',
                                'src',
                                './assets/images/cvv-caption.png',
                                'width',
                                '45',
                            ],
                            [1, ''],
                            [1, 'captcha_p'],
                            [1, 'form-group'],
                            [
                                'type',
                                'text',
                                'id',
                                'captcha',
                                'placeholder',
                                'Enter Captcha',
                                'name',
                                'captcha',
                                'formControlName',
                                'captcha',
                                1,
                                'payment_tex',
                            ],
                            [1, 'captcha_div'],
                            ['href', '#', 1, 'pull-right'],
                            [1, 'glyphicon', 'glyphicon-repeat'],
                            [1, 'alert', 'alert-danger'],
                        ],
                        template: function (e, t) {
                            1 & e &&
                                (o.ac(0, 'form', 0),
                                o.ac(1, 'div', 1),
                                o.ac(2, 'div', 2),
                                o.Vb(3, 'input', 3),
                                o.Rc(4, U, 2, 1, 'div', 4),
                                o.Zb(),
                                o.ac(5, 'div', 2),
                                o.Vb(6, 'input', 5),
                                o.Zb(),
                                o.ac(7, 'div', 6),
                                o.ac(8, 'select', 7),
                                o.ac(9, 'option', 8),
                                o.Tc(10, 'Expiry month (MM)'),
                                o.Zb(),
                                o.ac(11, 'option', 9),
                                o.Tc(12, '01 (Jan)'),
                                o.Zb(),
                                o.ac(13, 'option', 10),
                                o.Tc(14, '02 (Feb)'),
                                o.Zb(),
                                o.ac(15, 'option', 11),
                                o.Tc(16, '03 (Mar)'),
                                o.Zb(),
                                o.ac(17, 'option', 12),
                                o.Tc(18, '04 (Apr)'),
                                o.Zb(),
                                o.ac(19, 'option', 13),
                                o.Tc(20, '05 (May)'),
                                o.Zb(),
                                o.ac(21, 'option', 14),
                                o.Tc(22, '06 (Jun)'),
                                o.Zb(),
                                o.ac(23, 'option', 15),
                                o.Tc(24, '07 (Jul)'),
                                o.Zb(),
                                o.ac(25, 'option', 16),
                                o.Tc(26, '08 (Aug)'),
                                o.Zb(),
                                o.ac(27, 'option', 17),
                                o.Tc(28, '09 (Sep)'),
                                o.Zb(),
                                o.ac(29, 'option', 18),
                                o.Tc(30, '10 (Oct)'),
                                o.Zb(),
                                o.ac(31, 'option', 19),
                                o.Tc(32, '11 (Nov)'),
                                o.Zb(),
                                o.ac(33, 'option', 20),
                                o.Tc(34, '12 (Dec)'),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.ac(35, 'div', 6),
                                o.Vb(36, 'input', 21),
                                o.Zb(),
                                o.ac(37, 'div', 22),
                                o.Vb(38, 'input', 23),
                                o.Zb(),
                                o.ac(39, 'div', 24),
                                o.ac(40, 'span'),
                                o.Vb(41, 'img', 25),
                                o.Zb(),
                                o.ac(42, 'span', 26),
                                o.Tc(43, ' Last 3 digit at the back of the card'),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.ac(44, 'div', 1),
                                o.ac(45, 'div', 27),
                                o.ac(46, 'div', 28),
                                o.Vb(47, 'input', 29),
                                o.ac(48, 'div', 30),
                                o.ac(49, 'span'),
                                o.Tc(50, 'INDIAN RAILWAYS'),
                                o.Zb(),
                                o.ac(51, 'a', 31),
                                o.Vb(52, 'span', 32),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Zb()),
                                2 & e &&
                                    (o.tc('formGroup', t.cardForm),
                                    o.Cb(3),
                                    o.uc('value', t.cardForm.get('cardNo').value),
                                    o.Cb(1),
                                    o.tc(
                                        'ngIf',
                                        t.cardForm.controls.cardNo.invalid &&
                                            t.cardForm.controls.cardNo.touched,
                                    ))
                        },
                        directives: [S.z, S.o, S.i, S.b, S.n, S.g, d.o, S.w, S.r, S.y, S.k],
                        encapsulation: 2,
                    })),
                    e
                )
            })()
            const _ = ['firstInput']
            function K(e, t) {
                1 & e && o.Vb(0, 'div', 14)
            }
            function j(e, t) {
                if ((1 & e && (o.ac(0, 'a', 15), o.Tc(1, '(Offers) '), o.Zb()), 2 & e)) {
                    const e = o.mc().$implicit
                    o.uc('href', e.offerUrl, o.Mc)
                }
            }
            function z(e, t) {
                if ((1 & e && (o.ac(0, 'span', 16), o.Tc(1), o.Zb()), 2 & e)) {
                    const e = o.mc().$implicit
                    o.Cb(1), o.Uc(e.message)
                }
            }
            function q(e, t) {
                if ((1 & e && o.Vb(0, 'app-card-input', 17), 2 & e)) {
                    const e = o.mc(4)
                    o.tc('cardForm', e.payForm)
                }
            }
            function H(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'span'),
                        o.ac(1, 'td', 4),
                        o.ac(2, 'div', 5, 6),
                        o.ic('click', function () {
                            o.Kc(e)
                            const n = t.$implicit
                            return o.mc(3).selectBank(n.bankId)
                        })('keyDown.Enter', function () {
                            o.Kc(e)
                            const n = t.$implicit
                            return o.mc(3).selectBank(n.bankId)
                        }),
                        o.Rc(4, K, 1, 0, 'div', 7),
                        o.ac(5, 'div', 8),
                        o.Vb(6, 'img', 9),
                        o.ac(7, 'span', 10),
                        o.Tc(8),
                        o.Rc(9, j, 2, 1, 'a', 11),
                        o.Rc(10, z, 2, 1, 'span', 12),
                        o.Zb(),
                        o.Zb(),
                        o.Rc(11, q, 1, 1, 'app-card-input', 13),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = t.$implicit,
                        n = t.index,
                        a = o.mc(3)
                    o.Cb(1),
                        o.Kb('col-pad col-sm-6 col-xs-12 pull-', n % 2 == 0 ? 'left' : 'right', ''),
                        o.Cb(1),
                        o.Kb(
                            'link no-pad col-xs-12 border-all ',
                            e.bankId == a.selectedBnk ? 'dull-back' : '',
                            '',
                        ),
                        o.Cb(2),
                        o.tc('ngIf', e.bankId == a.selectedBnk),
                        o.Cb(2),
                        o.vc('src', './assets/images/payment/', e.bankId, '.png', o.Mc),
                        o.Cb(2),
                        o.Vc('', e.bankName, ' '),
                        o.Cb(1),
                        o.tc('ngIf', null != e.offerUrl && '' !== e.offerUrl && 103 != e.bankId),
                        o.Cb(1),
                        o.tc('ngIf', e.bankId == a.selectedBnk),
                        o.Cb(1),
                        o.tc('ngIf', e.cardFlag)
                }
            }
            function $(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div'),
                        o.ac(1, 'table'),
                        o.ac(2, 'tr'),
                        o.Rc(3, H, 12, 12, 'span', 3),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(2)
                    o.Cb(3), o.tc('ngForOf', e.bankList)
                }
            }
            function W(e, t) {
                1 & e && o.Vb(0, 'div', 14)
            }
            function Y(e, t) {
                if ((1 & e && (o.ac(0, 'a', 15), o.Tc(1, '(Offers) '), o.Zb()), 2 & e)) {
                    const e = o.mc().$implicit
                    o.uc('href', e.offerUrl, o.Mc)
                }
            }
            function G(e, t) {
                if ((1 & e && (o.ac(0, 'span', 16), o.Tc(1), o.Zb()), 2 & e)) {
                    const e = o.mc().$implicit
                    o.Cb(1), o.Uc(e.message)
                }
            }
            function J(e, t) {
                if ((1 & e && o.Vb(0, 'app-card-input', 17), 2 & e)) {
                    const e = o.mc(4)
                    o.tc('cardForm', e.payForm)
                }
            }
            function X(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'span'),
                        o.ac(1, 'td', 4),
                        o.ac(2, 'div', 5, 6),
                        o.ic('click', function () {
                            o.Kc(e)
                            const n = t.$implicit
                            return o.mc(3).selectBank(n.bankId)
                        })('keyDown.Enter', function () {
                            o.Kc(e)
                            const n = t.$implicit
                            return o.mc(3).selectBank(n.bankId)
                        }),
                        o.Rc(4, W, 1, 0, 'div', 7),
                        o.ac(5, 'div', 8),
                        o.Vb(6, 'img', 9),
                        o.ac(7, 'span', 10),
                        o.Tc(8),
                        o.Rc(9, Y, 2, 1, 'a', 11),
                        o.Rc(10, G, 2, 1, 'span', 12),
                        o.Zb(),
                        o.Zb(),
                        o.Rc(11, J, 1, 1, 'app-card-input', 13),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = t.$implicit,
                        n = t.index,
                        a = o.mc(3)
                    o.Cb(1),
                        o.Kb(
                            'col-pad  col-lg-12 col-md-12  col-sm-12 col-xs-12 pull-',
                            n % 2 == 0 ? 'left' : 'right',
                            '',
                        ),
                        o.Cb(1),
                        o.Kb(
                            'link no-pad col-xs-12 border-all ',
                            e.bankId == a.selectedBnk ? 'dull-back' : '',
                            '',
                        ),
                        o.Cb(2),
                        o.tc('ngIf', e.bankId == a.selectedBnk),
                        o.Cb(2),
                        o.vc('src', './assets/images/payment/', e.bankId, '.png', o.Mc),
                        o.Cb(2),
                        o.Vc('', e.bankName, ' '),
                        o.Cb(1),
                        o.tc('ngIf', null != e.offerUrl && '' !== e.offerUrl && 103 != e.bankId),
                        o.Cb(1),
                        o.tc('ngIf', e.bankId == a.selectedBnk),
                        o.Cb(1),
                        o.tc('ngIf', e.cardFlag)
                }
            }
            function Q(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div'),
                        o.ac(1, 'table'),
                        o.ac(2, 'tr'),
                        o.Rc(3, X, 12, 12, 'span', 3),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(2)
                    o.Cb(3), o.tc('ngForOf', e.bankList)
                }
            }
            function ee(e, t) {
                1 & e && o.Vb(0, 'div', 14)
            }
            function te(e, t) {
                if ((1 & e && (o.ac(0, 'a', 15), o.Tc(1, '(Offers) '), o.Zb()), 2 & e)) {
                    const e = o.mc().$implicit
                    o.uc('href', e.offerUrl, o.Mc)
                }
            }
            function ne(e, t) {
                if ((1 & e && (o.ac(0, 'span', 16), o.Tc(1), o.Zb()), 2 & e)) {
                    const e = o.mc().$implicit
                    o.Cb(1), o.Uc(e.message)
                }
            }
            function ae(e, t) {
                if ((1 & e && o.Vb(0, 'app-card-input', 17), 2 & e)) {
                    const e = o.mc(4)
                    o.tc('cardForm', e.payForm)
                }
            }
            function ie(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'span'),
                        o.ac(1, 'td', 4),
                        o.ac(2, 'div', 5, 6),
                        o.ic('click', function () {
                            o.Kc(e)
                            const n = t.$implicit
                            return o.mc(3).selectBank(n.bankId)
                        })('keyDown.Enter', function () {
                            o.Kc(e)
                            const n = t.$implicit
                            return o.mc(3).selectBank(n.bankId)
                        }),
                        o.Rc(4, ee, 1, 0, 'div', 7),
                        o.ac(5, 'div', 8),
                        o.Vb(6, 'img', 9),
                        o.ac(7, 'span', 10),
                        o.Tc(8),
                        o.Rc(9, te, 2, 1, 'a', 11),
                        o.Rc(10, ne, 2, 1, 'span', 12),
                        o.Zb(),
                        o.Zb(),
                        o.Rc(11, ae, 1, 1, 'app-card-input', 13),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = t.$implicit,
                        n = t.index,
                        a = o.mc(3)
                    o.Cb(1),
                        o.Kb(
                            'col-pad  col-lg-12 col-md-12  col-sm-12 col-xs-12 pull-',
                            n % 2 == 0 ? 'left' : 'right',
                            '',
                        ),
                        o.Cb(1),
                        o.Kb(
                            'link no-pad col-xs-12 border-all ',
                            e.bankId == a.selectedBnk ? 'dull-back' : '',
                            '',
                        ),
                        o.Cb(2),
                        o.tc('ngIf', e.bankId == a.selectedBnk),
                        o.Cb(2),
                        o.vc('src', './assets/images/payment/', e.bankId, '.png', o.Mc),
                        o.Cb(2),
                        o.Vc('', e.bankName, ' '),
                        o.Cb(1),
                        o.tc('ngIf', null != e.offerUrl && '' !== e.offerUrl && 103 != e.bankId),
                        o.Cb(1),
                        o.tc('ngIf', e.bankId == a.selectedBnk),
                        o.Cb(1),
                        o.tc('ngIf', e.cardFlag)
                }
            }
            function ce(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div'),
                        o.ac(1, 'table'),
                        o.ac(2, 'tr'),
                        o.Rc(3, ie, 12, 12, 'span', 3),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(2)
                    o.Cb(3), o.tc('ngForOf', e.bankList)
                }
            }
            function se(e, t) {
                1 & e && o.Vb(0, 'div', 14)
            }
            function le(e, t) {
                if ((1 & e && (o.ac(0, 'a', 15), o.Tc(1, '(Offers) '), o.Zb()), 2 & e)) {
                    const e = o.mc().$implicit
                    o.uc('href', e.offerUrl, o.Mc)
                }
            }
            function re(e, t) {
                if ((1 & e && (o.ac(0, 'span', 16), o.Tc(1), o.Zb()), 2 & e)) {
                    const e = o.mc().$implicit
                    o.Cb(1), o.Uc(e.message)
                }
            }
            function oe(e, t) {
                if ((1 & e && o.Vb(0, 'app-card-input', 17), 2 & e)) {
                    const e = o.mc(4)
                    o.tc('cardForm', e.payForm)
                }
            }
            function ge(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'span'),
                        o.ac(1, 'td', 4),
                        o.ac(2, 'div', 5),
                        o.ic('click', function () {
                            o.Kc(e)
                            const n = t.$implicit
                            return o.mc(3).selectBank(n.bankId)
                        })('keyDown.Enter', function () {
                            o.Kc(e)
                            const n = t.$implicit
                            return o.mc(3).selectBank(n.bankId)
                        }),
                        o.Rc(3, se, 1, 0, 'div', 7),
                        o.ac(4, 'div', 8),
                        o.Vb(5, 'img', 9),
                        o.ac(6, 'span', 10),
                        o.Tc(7),
                        o.Rc(8, le, 2, 1, 'a', 11),
                        o.Rc(9, re, 2, 1, 'span', 12),
                        o.Zb(),
                        o.Zb(),
                        o.Rc(10, oe, 1, 1, 'app-card-input', 13),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = t.$implicit,
                        n = t.index,
                        a = o.mc(3)
                    o.Cb(1),
                        o.Kb('col-pad col-sm-6 col-xs-12 pull-', n % 2 == 0 ? 'left' : 'right', ''),
                        o.Cb(1),
                        o.Kb(
                            'link no-pad col-xs-12 border-all ',
                            e.bankId == a.selectedBnk ? 'dull-back' : '',
                            '',
                        ),
                        o.Cb(1),
                        o.tc('ngIf', e.bankId == a.selectedBnk),
                        o.Cb(2),
                        o.vc('src', './assets/images/payment/', e.bankId, '.png', o.Mc),
                        o.Cb(2),
                        o.Vc('', e.bankName, ' '),
                        o.Cb(1),
                        o.tc('ngIf', null != e.offerUrl && '' !== e.offerUrl && 103 != e.bankId),
                        o.Cb(1),
                        o.tc('ngIf', e.bankId == a.selectedBnk),
                        o.Cb(1),
                        o.tc('ngIf', e.cardFlag)
                }
            }
            function de(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div'),
                        o.ac(1, 'table'),
                        o.ac(2, 'tr'),
                        o.Rc(3, ge, 11, 12, 'span', 3),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(2)
                    o.Cb(3), o.tc('ngForOf', e.bankList)
                }
            }
            function be(e, t) {
                1 & e && o.Vb(0, 'div', 14)
            }
            function ue(e, t) {
                if ((1 & e && (o.ac(0, 'a', 15), o.Tc(1, '(Offers) '), o.Zb()), 2 & e)) {
                    const e = o.mc().$implicit
                    o.uc('href', e.offerUrl, o.Mc)
                }
            }
            function pe(e, t) {
                if ((1 & e && (o.ac(0, 'span', 16), o.Tc(1), o.Zb()), 2 & e)) {
                    const e = o.mc().$implicit
                    o.Cb(1), o.Uc(e.message)
                }
            }
            function me(e, t) {
                if ((1 & e && o.Vb(0, 'app-card-input', 17), 2 & e)) {
                    const e = o.mc(4)
                    o.tc('cardForm', e.payForm)
                }
            }
            function he(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'span'),
                        o.ac(1, 'td', 4),
                        o.ac(2, 'div', 5, 6),
                        o.ic('click', function () {
                            o.Kc(e)
                            const n = t.$implicit
                            return o.mc(3).selectBank(n.bankId)
                        })('keyDown.Enter', function () {
                            o.Kc(e)
                            const n = t.$implicit
                            return o.mc(3).selectBank(n.bankId)
                        }),
                        o.Rc(4, be, 1, 0, 'div', 7),
                        o.ac(5, 'div', 8),
                        o.Vb(6, 'img', 9),
                        o.ac(7, 'span', 10),
                        o.Tc(8),
                        o.Rc(9, ue, 2, 1, 'a', 11),
                        o.Rc(10, pe, 2, 1, 'span', 12),
                        o.Zb(),
                        o.Zb(),
                        o.Rc(11, me, 1, 1, 'app-card-input', 13),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = t.$implicit,
                        n = t.index,
                        a = o.mc(3)
                    o.Cb(1),
                        o.Kb('col-pad col-sm-6 col-xs-12 pull-', n % 2 == 0 ? 'left' : 'right', ''),
                        o.Cb(1),
                        o.Kb(
                            'link no-pad col-xs-12 border-all ',
                            e.bankId == a.selectedBnk ? 'dull-back' : '',
                            '',
                        ),
                        o.Cb(2),
                        o.tc('ngIf', e.bankId == a.selectedBnk),
                        o.Cb(2),
                        o.vc('src', './assets/images/payment/', e.bankId, '.png', o.Mc),
                        o.Cb(2),
                        o.Vc('', e.bankName, ' '),
                        o.Cb(1),
                        o.tc('ngIf', null != e.offerUrl && '' !== e.offerUrl && 103 != e.bankId),
                        o.Cb(1),
                        o.tc('ngIf', e.bankId == a.selectedBnk),
                        o.Cb(1),
                        o.tc('ngIf', e.cardFlag)
                }
            }
            function fe(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div'),
                        o.ac(1, 'table'),
                        o.ac(2, 'tr'),
                        o.Rc(3, he, 12, 12, 'span', 3),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(2)
                    o.Cb(3), o.tc('ngForOf', e.bankList)
                }
            }
            function ve(e, t) {
                1 & e && o.Vb(0, 'div', 14)
            }
            function ye(e, t) {
                if ((1 & e && (o.ac(0, 'a', 15), o.Tc(1, '(Offers) '), o.Zb()), 2 & e)) {
                    const e = o.mc().$implicit
                    o.uc('href', e.offerUrl, o.Mc)
                }
            }
            function Se(e, t) {
                if ((1 & e && (o.ac(0, 'span', 19), o.Tc(1), o.Zb()), 2 & e)) {
                    const e = o.mc().$implicit
                    o.tc('innerHTML', e.message, o.Lc), o.Cb(1), o.Uc(e.message)
                }
            }
            function ke(e, t) {
                if ((1 & e && o.Vb(0, 'app-card-input', 17), 2 & e)) {
                    const e = o.mc(4)
                    o.tc('cardForm', e.payForm)
                }
            }
            function Te(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'span'),
                        o.ac(1, 'td', 4),
                        o.ac(2, 'div', 5, 6),
                        o.ic('click', function () {
                            o.Kc(e)
                            const n = t.$implicit
                            return o.mc(3).selectBank(n.bankId)
                        })('keyDown.Enter', function () {
                            o.Kc(e)
                            const n = t.$implicit
                            return o.mc(3).selectBank(n.bankId)
                        }),
                        o.Rc(4, ve, 1, 0, 'div', 7),
                        o.ac(5, 'div', 8),
                        o.Vb(6, 'img', 9),
                        o.ac(7, 'span', 10),
                        o.Tc(8),
                        o.Rc(9, ye, 2, 1, 'a', 11),
                        o.Rc(10, Se, 2, 2, 'span', 18),
                        o.Zb(),
                        o.Zb(),
                        o.Rc(11, ke, 1, 1, 'app-card-input', 13),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = t.$implicit,
                        n = t.index,
                        a = o.mc(3)
                    o.Cb(1),
                        o.Kb(
                            'col-pad col-lg-12 col-md-12 col-sm-12 col-xs-12 pull-',
                            n % 2 == 0 ? 'left' : 'right',
                            '',
                        ),
                        o.Cb(1),
                        o.Kb(
                            'link no-pad col-xs-12 border-all ',
                            e.bankId == a.selectedBnk ? 'dull-back' : '',
                            '',
                        ),
                        o.Cb(2),
                        o.tc('ngIf', e.bankId == a.selectedBnk),
                        o.Cb(2),
                        o.vc('src', './assets/images/payment/', e.bankId, '.png', o.Mc),
                        o.Cb(2),
                        o.Vc('', e.bankName, ' '),
                        o.Cb(1),
                        o.tc('ngIf', null != e.offerUrl && '' !== e.offerUrl && 103 != e.bankId),
                        o.Cb(1),
                        o.tc('ngIf', e.bankId == a.selectedBnk),
                        o.Cb(1),
                        o.tc('ngIf', e.cardFlag)
                }
            }
            function De(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div'),
                        o.ac(1, 'table'),
                        o.ac(2, 'tr'),
                        o.Rc(3, Te, 12, 12, 'span', 3),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(2)
                    o.Cb(3), o.tc('ngForOf', e.bankList)
                }
            }
            function Ce(e, t) {
                1 & e && o.Vb(0, 'div', 14)
            }
            function Ie(e, t) {
                if ((1 & e && (o.ac(0, 'a', 15), o.Tc(1, '(Offers) '), o.Zb()), 2 & e)) {
                    const e = o.mc().$implicit
                    o.uc('href', e.offerUrl, o.Mc)
                }
            }
            function Ze(e, t) {
                if ((1 & e && (o.ac(0, 'span', 16), o.Tc(1), o.Zb()), 2 & e)) {
                    const e = o.mc().$implicit
                    o.Cb(1), o.Uc(e.message)
                }
            }
            function we(e, t) {
                if ((1 & e && o.Vb(0, 'app-card-input', 17), 2 & e)) {
                    const e = o.mc(4)
                    o.tc('cardForm', e.payForm)
                }
            }
            function Pe(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'span'),
                        o.ac(1, 'td', 4),
                        o.ac(2, 'div', 5, 6),
                        o.ic('click', function () {
                            o.Kc(e)
                            const n = t.$implicit
                            return o.mc(3).selectBank(n.bankId)
                        })('keyDown.Enter', function () {
                            o.Kc(e)
                            const n = t.$implicit
                            return o.mc(3).selectBank(n.bankId)
                        }),
                        o.Rc(4, Ce, 1, 0, 'div', 7),
                        o.ac(5, 'div', 8),
                        o.Vb(6, 'img', 9),
                        o.ac(7, 'span', 10),
                        o.Tc(8),
                        o.Rc(9, Ie, 2, 1, 'a', 11),
                        o.Rc(10, Ze, 2, 1, 'span', 12),
                        o.Zb(),
                        o.Zb(),
                        o.Rc(11, we, 1, 1, 'app-card-input', 13),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = t.$implicit,
                        n = t.index,
                        a = o.mc(3)
                    o.Cb(1),
                        o.Kb(
                            'col-pad col-lg-12 col-md-12 col-sm-12 col-xs-12 pull-',
                            n % 2 == 0 ? 'left' : 'right',
                            '',
                        ),
                        o.Cb(1),
                        o.Kb(
                            'link no-pad col-xs-12 border-all ',
                            e.bankId == a.selectedBnk ? 'dull-back' : '',
                            '',
                        ),
                        o.Cb(2),
                        o.tc('ngIf', e.bankId == a.selectedBnk),
                        o.Cb(2),
                        o.vc('src', './assets/images/payment/', e.bankId, '.png', o.Mc),
                        o.Cb(2),
                        o.Vc('', e.bankName, ' '),
                        o.Cb(1),
                        o.tc('ngIf', null != e.offerUrl && '' !== e.offerUrl && 103 != e.bankId),
                        o.Cb(1),
                        o.tc('ngIf', e.bankId == a.selectedBnk),
                        o.Cb(1),
                        o.tc('ngIf', e.cardFlag)
                }
            }
            function Me(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div'),
                        o.Vb(1, 'div', 20),
                        o.ac(2, 'table'),
                        o.ac(3, 'tr'),
                        o.Rc(4, Pe, 12, 12, 'span', 3),
                        o.Zb(),
                        o.Zb(),
                        o.ac(5, 'div', 21),
                        o.ic('focus', function () {
                            return o.Kc(e), o.mc(2).onFocusguardLast()
                        }),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(2)
                    o.Cb(4), o.tc('ngForOf', e.bankList)
                }
            }
            function Re(e, t) {
                1 & e && o.Vb(0, 'div', 14)
            }
            function xe(e, t) {
                if ((1 & e && (o.ac(0, 'a', 15), o.Tc(1, '(Offers) '), o.Zb()), 2 & e)) {
                    const e = o.mc().$implicit
                    o.uc('href', e.offerUrl, o.Mc)
                }
            }
            function Oe(e, t) {
                if ((1 & e && (o.ac(0, 'span', 16), o.Tc(1), o.Zb()), 2 & e)) {
                    const e = o.mc().$implicit
                    o.Cb(1), o.Uc(e.message)
                }
            }
            function Ee(e, t) {
                if ((1 & e && o.Vb(0, 'app-card-input', 17), 2 & e)) {
                    const e = o.mc(4)
                    o.tc('cardForm', e.payForm)
                }
            }
            function Ae(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'span'),
                        o.ac(1, 'td', 4),
                        o.ac(2, 'div', 5, 6),
                        o.ic('click', function () {
                            o.Kc(e)
                            const n = t.$implicit
                            return o.mc(3).selectBank(n.bankId)
                        })('keyDown.Enter', function () {
                            o.Kc(e)
                            const n = t.$implicit
                            return o.mc(3).selectBank(n.bankId)
                        }),
                        o.Rc(4, Re, 1, 0, 'div', 7),
                        o.ac(5, 'div', 8),
                        o.Vb(6, 'img', 9),
                        o.ac(7, 'span', 10),
                        o.Tc(8),
                        o.Rc(9, xe, 2, 1, 'a', 11),
                        o.Rc(10, Oe, 2, 1, 'span', 12),
                        o.Zb(),
                        o.Zb(),
                        o.Rc(11, Ee, 1, 1, 'app-card-input', 13),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = t.$implicit,
                        n = t.index,
                        a = o.mc(3)
                    o.Cb(1),
                        o.Kb(
                            'col-pad col-lg-12 col-md-12 col-sm-12 col-xs-12 pull-',
                            n % 2 == 0 ? 'left' : 'right',
                            '',
                        ),
                        o.Cb(1),
                        o.Kb(
                            'link no-pad col-xs-12 border-all ',
                            e.bankId == a.selectedBnk ? 'dull-back' : '',
                            '',
                        ),
                        o.Cb(2),
                        o.tc('ngIf', e.bankId == a.selectedBnk),
                        o.Cb(2),
                        o.vc('src', './assets/images/payment/', e.bankId, '.png', o.Mc),
                        o.Cb(2),
                        o.Vc('', e.bankName, ' '),
                        o.Cb(1),
                        o.tc('ngIf', null != e.offerUrl && '' !== e.offerUrl && 103 != e.bankId),
                        o.Cb(1),
                        o.tc('ngIf', e.bankId == a.selectedBnk),
                        o.Cb(1),
                        o.tc('ngIf', e.cardFlag)
                }
            }
            function Ve(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div'),
                        o.ac(1, 'table'),
                        o.ac(2, 'tr'),
                        o.Rc(3, Ae, 12, 12, 'span', 3),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(2)
                    o.Cb(3), o.tc('ngForOf', e.bankList)
                }
            }
            function Be(e, t) {
                1 & e && o.Vb(0, 'div', 14)
            }
            function Le(e, t) {
                if ((1 & e && (o.ac(0, 'a', 15), o.Tc(1, '(Offers) '), o.Zb()), 2 & e)) {
                    const e = o.mc().$implicit
                    o.uc('href', e.offerUrl, o.Mc)
                }
            }
            function Ne(e, t) {
                if ((1 & e && (o.ac(0, 'span', 19), o.Tc(1), o.Zb()), 2 & e)) {
                    const e = o.mc().$implicit
                    o.tc('innerHTML', e.message, o.Lc), o.Cb(1), o.Uc(e.message)
                }
            }
            function Ue(e, t) {
                if ((1 & e && o.Vb(0, 'app-card-input', 17), 2 & e)) {
                    const e = o.mc(4)
                    o.tc('cardForm', e.payForm)
                }
            }
            function Fe(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'span'),
                        o.ac(1, 'td', 4),
                        o.ac(2, 'div', 5, 6),
                        o.ic('click', function () {
                            o.Kc(e)
                            const n = t.$implicit
                            return o.mc(3).selectBank(n.bankId)
                        })('keyDown.Enter', function () {
                            o.Kc(e)
                            const n = t.$implicit
                            return o.mc(3).selectBank(n.bankId)
                        }),
                        o.Rc(4, Be, 1, 0, 'div', 7),
                        o.ac(5, 'div', 8),
                        o.Vb(6, 'img', 9),
                        o.ac(7, 'span', 10),
                        o.Tc(8),
                        o.Rc(9, Le, 2, 1, 'a', 11),
                        o.Rc(10, Ne, 2, 2, 'span', 18),
                        o.Zb(),
                        o.Zb(),
                        o.Rc(11, Ue, 1, 1, 'app-card-input', 13),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = t.$implicit,
                        n = t.index,
                        a = o.mc(3)
                    o.Cb(1),
                        o.Kb(
                            'col-pad col-lg-12 col-md-12 col-sm-12 col-xs-12 pull-',
                            n % 2 == 0 ? 'left' : 'right',
                            '',
                        ),
                        o.Cb(1),
                        o.Kb(
                            'link no-pad col-xs-12 border-all ',
                            e.bankId == a.selectedBnk ? 'dull-back' : '',
                            '',
                        ),
                        o.Cb(2),
                        o.tc('ngIf', e.bankId == a.selectedBnk),
                        o.Cb(2),
                        o.vc('src', './assets/images/payment/', e.bankId, '.png', o.Mc),
                        o.Cb(2),
                        o.Vc('', e.bankName, ' '),
                        o.Cb(1),
                        o.tc('ngIf', null != e.offerUrl && '' !== e.offerUrl && 103 != e.bankId),
                        o.Cb(1),
                        o.tc('ngIf', e.bankId == a.selectedBnk),
                        o.Cb(1),
                        o.tc('ngIf', e.cardFlag)
                }
            }
            function _e(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div'),
                        o.ac(1, 'table'),
                        o.ac(2, 'tr'),
                        o.Rc(3, Fe, 12, 12, 'span', 3),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(2)
                    o.Cb(3), o.tc('ngForOf', e.bankList)
                }
            }
            function Ke(e, t) {
                1 & e && o.Vb(0, 'div', 14)
            }
            function je(e, t) {
                if ((1 & e && (o.ac(0, 'a', 15), o.Tc(1, '(Offers) '), o.Zb()), 2 & e)) {
                    const e = o.mc().$implicit
                    o.uc('href', e.offerUrl, o.Mc)
                }
            }
            function ze(e, t) {
                if ((1 & e && (o.ac(0, 'span', 16), o.Tc(1), o.Zb()), 2 & e)) {
                    const e = o.mc().$implicit
                    o.Cb(1), o.Uc(e.message)
                }
            }
            function qe(e, t) {
                if ((1 & e && o.Vb(0, 'app-card-input', 17), 2 & e)) {
                    const e = o.mc(4)
                    o.tc('cardForm', e.payForm)
                }
            }
            function He(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'span'),
                        o.ac(1, 'td', 4),
                        o.ac(2, 'div', 5, 6),
                        o.ic('click', function () {
                            o.Kc(e)
                            const n = t.$implicit
                            return o.mc(3).selectBank(n.bankId)
                        })('keyDown.Enter', function () {
                            o.Kc(e)
                            const n = t.$implicit
                            return o.mc(3).selectBank(n.bankId)
                        }),
                        o.Rc(4, Ke, 1, 0, 'div', 7),
                        o.ac(5, 'div', 8),
                        o.Vb(6, 'img', 9),
                        o.ac(7, 'span', 10),
                        o.Tc(8),
                        o.Rc(9, je, 2, 1, 'a', 11),
                        o.Rc(10, ze, 2, 1, 'span', 12),
                        o.Zb(),
                        o.Zb(),
                        o.Rc(11, qe, 1, 1, 'app-card-input', 13),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = t.$implicit,
                        n = t.index,
                        a = o.mc(3)
                    o.Cb(1),
                        o.Kb(
                            'col-pad col-lg-12 col-md-12 col-sm-12 col-xs-12 pull-',
                            n % 2 == 0 ? 'left' : 'right',
                            '',
                        ),
                        o.Cb(1),
                        o.Kb(
                            'link no-pad col-xs-12 border-all ',
                            e.bankId == a.selectedBnk ? 'dull-back' : '',
                            '',
                        ),
                        o.Cb(2),
                        o.tc('ngIf', e.bankId == a.selectedBnk),
                        o.Cb(2),
                        o.vc('src', './assets/images/payment/', e.bankId, '.png', o.Mc),
                        o.Cb(2),
                        o.Vc('', e.bankName, ' '),
                        o.Cb(1),
                        o.tc('ngIf', null != e.offerUrl && '' !== e.offerUrl && 103 != e.bankId),
                        o.Cb(1),
                        o.tc('ngIf', e.bankId == a.selectedBnk),
                        o.Cb(1),
                        o.tc('ngIf', e.cardFlag)
                }
            }
            function $e(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div'),
                        o.ac(1, 'table'),
                        o.ac(2, 'tr'),
                        o.Rc(3, He, 12, 12, 'span', 3),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(2)
                    o.Cb(3), o.tc('ngForOf', e.bankList)
                }
            }
            function We(e, t) {
                1 & e && o.Vb(0, 'div', 14)
            }
            function Ye(e, t) {
                if ((1 & e && (o.ac(0, 'a', 15), o.Tc(1, '(Offers) '), o.Zb()), 2 & e)) {
                    const e = o.mc().$implicit
                    o.uc('href', e.offerUrl, o.Mc)
                }
            }
            function Ge(e, t) {
                if ((1 & e && (o.ac(0, 'span', 19), o.Tc(1), o.Zb()), 2 & e)) {
                    const e = o.mc().$implicit
                    o.tc('innerHTML', e.message, o.Lc), o.Cb(1), o.Uc(e.message)
                }
            }
            function Je(e, t) {
                if ((1 & e && o.Vb(0, 'app-card-input', 17), 2 & e)) {
                    const e = o.mc(4)
                    o.tc('cardForm', e.payForm)
                }
            }
            function Xe(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'span'),
                        o.ac(1, 'td', 4),
                        o.ac(2, 'div', 5, 6),
                        o.ic('click', function () {
                            o.Kc(e)
                            const n = t.$implicit
                            return o.mc(3).selectBank(n.bankId)
                        })('keyDown.Enter', function () {
                            o.Kc(e)
                            const n = t.$implicit
                            return o.mc(3).selectBank(n.bankId)
                        }),
                        o.Rc(4, We, 1, 0, 'div', 7),
                        o.ac(5, 'div', 8),
                        o.Vb(6, 'img', 9),
                        o.ac(7, 'span', 10),
                        o.Tc(8),
                        o.Rc(9, Ye, 2, 1, 'a', 11),
                        o.Rc(10, Ge, 2, 2, 'span', 18),
                        o.Zb(),
                        o.Zb(),
                        o.Rc(11, Je, 1, 1, 'app-card-input', 13),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = t.$implicit,
                        n = t.index,
                        a = o.mc(3)
                    o.Cb(1),
                        o.Kb(
                            'col-pad col-lg-12 col-md-12 col-sm-12 col-xs-12 pull-',
                            n % 2 == 0 ? 'left' : 'right',
                            '',
                        ),
                        o.Cb(1),
                        o.Kb(
                            'link no-pad col-xs-12 border-all ',
                            e.bankId == a.selectedBnk ? 'dull-back' : '',
                            '',
                        ),
                        o.Cb(2),
                        o.tc('ngIf', e.bankId == a.selectedBnk),
                        o.Cb(2),
                        o.vc('src', './assets/images/payment/', e.bankId, '.png', o.Mc),
                        o.Cb(2),
                        o.Vc('', e.bankName, ' '),
                        o.Cb(1),
                        o.tc('ngIf', null != e.offerUrl && '' !== e.offerUrl && 103 != e.bankId),
                        o.Cb(1),
                        o.tc('ngIf', e.bankId == a.selectedBnk),
                        o.Cb(1),
                        o.tc('ngIf', e.cardFlag)
                }
            }
            function Qe(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div'),
                        o.ac(1, 'table'),
                        o.ac(2, 'tr'),
                        o.Rc(3, Xe, 12, 12, 'span', 3),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(2)
                    o.Cb(3), o.tc('ngForOf', e.bankList)
                }
            }
            function et(e, t) {
                1 & e && o.Vb(0, 'div', 14)
            }
            function tt(e, t) {
                if ((1 & e && (o.ac(0, 'a', 15), o.Tc(1, '(Offers) '), o.Zb()), 2 & e)) {
                    const e = o.mc().$implicit
                    o.uc('href', e.offerUrl, o.Mc)
                }
            }
            function nt(e, t) {
                if ((1 & e && (o.ac(0, 'span', 19), o.Tc(1), o.Zb()), 2 & e)) {
                    const e = o.mc().$implicit
                    o.tc('innerHTML', e.message, o.Lc), o.Cb(1), o.Uc(e.message)
                }
            }
            function at(e, t) {
                if ((1 & e && o.Vb(0, 'app-card-input', 17), 2 & e)) {
                    const e = o.mc(4)
                    o.tc('cardForm', e.payForm)
                }
            }
            function it(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'span'),
                        o.ac(1, 'td', 4),
                        o.ac(2, 'div', 5, 6),
                        o.ic('click', function () {
                            o.Kc(e)
                            const n = t.$implicit
                            return o.mc(3).selectBank(n.bankId)
                        })('keyDown.Enter', function () {
                            o.Kc(e)
                            const n = t.$implicit
                            return o.mc(3).selectBank(n.bankId)
                        }),
                        o.Rc(4, et, 1, 0, 'div', 7),
                        o.ac(5, 'div', 8),
                        o.Vb(6, 'img', 9),
                        o.ac(7, 'span', 10),
                        o.Tc(8),
                        o.Rc(9, tt, 2, 1, 'a', 11),
                        o.Rc(10, nt, 2, 2, 'span', 18),
                        o.Zb(),
                        o.Zb(),
                        o.Rc(11, at, 1, 1, 'app-card-input', 13),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = t.$implicit,
                        n = t.index,
                        a = o.mc(3)
                    o.Cb(1),
                        o.Kb(
                            'col-pad col-lg-12 col-md-12 col-sm-12 col-xs-12 pull-',
                            n % 2 == 0 ? 'left' : 'right',
                            '',
                        ),
                        o.Cb(1),
                        o.Kb(
                            'link no-pad col-xs-12 border-all ',
                            e.bankId == a.selectedBnk ? 'dull-back' : '',
                            '',
                        ),
                        o.Cb(2),
                        o.tc('ngIf', e.bankId == a.selectedBnk),
                        o.Cb(2),
                        o.vc('src', './assets/images/payment/', e.bankId, '.png', o.Mc),
                        o.Cb(2),
                        o.Vc('', e.bankName, ' '),
                        o.Cb(1),
                        o.tc('ngIf', null != e.offerUrl && '' !== e.offerUrl && 103 != e.bankId),
                        o.Cb(1),
                        o.tc('ngIf', e.bankId == a.selectedBnk),
                        o.Cb(1),
                        o.tc('ngIf', e.cardFlag)
                }
            }
            function ct(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div'),
                        o.ac(1, 'table'),
                        o.ac(2, 'tr'),
                        o.Rc(3, it, 12, 12, 'span', 3),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(2)
                    o.Cb(3), o.tc('ngForOf', e.bankList)
                }
            }
            function st(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div', 32),
                        o.ac(1, 'strong'),
                        o.Tc(2),
                        o.nc(3, 'currency'),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(5)
                    o.Cb(2),
                        o.Wc(
                            '',
                            null == e.langService.lang ? null : e.langService.lang.ewalletBalance,
                            ' ',
                            o.qc(3, 2, e.ewallet.currentBalance, 'INR', true),
                            '',
                        )
                }
            }
            function lt(e, t) {
                if ((1 & e && (o.ac(0, 'div', 33), o.Vb(1, 'input', 34), o.Zb()), 2 & e)) {
                    const e = o.mc(5)
                    o.Cb(1),
                        o.uc(
                            'placeholder',
                            null == e.langService.lang
                                ? null
                                : e.langService.lang.paymentPageEwalletMsg2,
                        )
                }
            }
            function rt(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 35),
                        o.ac(1, 'a', 36),
                        o.ic('click', function () {
                            return o.Kc(e), o.mc(5).forgotClick()
                        }),
                        o.Tc(2),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(5)
                    o.Cb(2),
                        o.Vc(
                            '',
                            null == e.langService.lang
                                ? null
                                : e.langService.lang.forgotTransactionPassword,
                            '?',
                        )
                }
            }
            function ot(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 5, 6),
                        o.ic('click', function () {
                            o.Kc(e)
                            const t = o.mc().$implicit
                            return o.mc(3).selectBank(t.bankId)
                        })('keyDown.Enter', function () {
                            o.Kc(e)
                            const t = o.mc().$implicit
                            return o.mc(3).selectBank(t.bankId)
                        }),
                        o.Vb(2, 'div', 14),
                        o.Rc(3, st, 4, 6, 'div', 25),
                        o.ac(4, 'div', 26),
                        o.ac(5, 'form', 27),
                        o.Rc(6, lt, 2, 1, 'div', 28),
                        o.Zb(),
                        o.Zb(),
                        o.Rc(7, rt, 3, 1, 'div', 29),
                        o.ac(8, 'div', 30),
                        o.ac(9, 'span', 31),
                        o.Tc(10),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc().$implicit,
                        t = o.mc(3)
                    o.Kb(
                        'text-center link no-pad col-xs-12 border-all ',
                        e.bankId == t.selectedBnk ? 'dull-back' : '',
                        '',
                    ),
                        o.Cb(3),
                        o.tc('ngIf', t.ewallet),
                        o.Cb(2),
                        o.tc('formGroup', t.payForm),
                        o.Cb(1),
                        o.tc('ngIf', 'false' == t.ewalletTxnFlag),
                        o.Cb(1),
                        o.tc('ngIf', 'false' == t.ewalletTxnFlag),
                        o.Cb(3),
                        o.Uc(null == t.langService.lang ? null : t.langService.lang.ewalletAmount)
                }
            }
            function gt(e, t) {
                if (
                    (1 & e && (o.ac(0, 'div', 37, 6), o.ac(2, 'strong'), o.Tc(3), o.Zb(), o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc().$implicit
                    o.Cb(3), o.Uc(e.disableReason)
                }
            }
            function dt(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'span'),
                        o.ac(1, 'td', 22),
                        o.Rc(2, ot, 11, 8, 'div', 23),
                        o.Rc(3, gt, 4, 1, 'div', 24),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = t.$implicit
                    o.Cb(2),
                        o.tc('ngIf', 'true' == e.enableFlag),
                        o.Cb(1),
                        o.tc('ngIf', 'false' == e.enableFlag)
                }
            }
            function bt(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div'),
                        o.ac(1, 'table'),
                        o.ac(2, 'tr'),
                        o.Rc(3, dt, 4, 2, 'span', 3),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(2)
                    o.Cb(3), o.tc('ngForOf', e.bankList)
                }
            }
            function ut(e, t) {
                1 & e && o.Vb(0, 'div', 14)
            }
            function pt(e, t) {
                if ((1 & e && (o.ac(0, 'a', 15), o.Tc(1, '(Offers) '), o.Zb()), 2 & e)) {
                    const e = o.mc().$implicit
                    o.uc('href', e.offerUrl, o.Mc)
                }
            }
            function mt(e, t) {
                if ((1 & e && (o.ac(0, 'span', 16), o.Tc(1), o.Zb()), 2 & e)) {
                    const e = o.mc().$implicit
                    o.Cb(1), o.Uc(e.message)
                }
            }
            function ht(e, t) {
                if ((1 & e && o.Vb(0, 'app-card-input', 17), 2 & e)) {
                    const e = o.mc(4)
                    o.tc('cardForm', e.payForm)
                }
            }
            function ft(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'span'),
                        o.ac(1, 'td', 4),
                        o.ac(2, 'div', 5, 6),
                        o.ic('click', function () {
                            o.Kc(e)
                            const n = t.$implicit
                            return o.mc(3).selectBank(n.bankId)
                        })('keyDown.Enter', function () {
                            o.Kc(e)
                            const n = t.$implicit
                            return o.mc(3).selectBank(n.bankId)
                        }),
                        o.Rc(4, ut, 1, 0, 'div', 7),
                        o.ac(5, 'div', 8),
                        o.Vb(6, 'img', 9),
                        o.ac(7, 'span', 10),
                        o.Tc(8),
                        o.Rc(9, pt, 2, 1, 'a', 11),
                        o.Rc(10, mt, 2, 1, 'span', 12),
                        o.Zb(),
                        o.Zb(),
                        o.Rc(11, ht, 1, 1, 'app-card-input', 13),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = t.$implicit,
                        n = t.index,
                        a = o.mc(3)
                    o.Cb(1),
                        o.Kb(
                            'col-pad col-lg-12 col-md-12 col-sm-12 col-xs-12 pull-',
                            n % 2 == 0 ? 'left' : 'right',
                            '',
                        ),
                        o.Cb(1),
                        o.Kb(
                            'link no-pad col-xs-12 border-all ',
                            e.bankId == a.selectedBnk ? 'dull-back' : '',
                            '',
                        ),
                        o.Cb(2),
                        o.tc('ngIf', e.bankId == a.selectedBnk),
                        o.Cb(2),
                        o.vc('src', './assets/images/payment/', e.bankId, '.png', o.Mc),
                        o.Cb(2),
                        o.Vc('', e.bankName, ' '),
                        o.Cb(1),
                        o.tc('ngIf', null != e.offerUrl && '' !== e.offerUrl && 103 != e.bankId),
                        o.Cb(1),
                        o.tc('ngIf', e.bankId == a.selectedBnk),
                        o.Cb(1),
                        o.tc('ngIf', e.cardFlag)
                }
            }
            function vt(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div'),
                        o.ac(1, 'table'),
                        o.ac(2, 'tr'),
                        o.Rc(3, ft, 12, 12, 'span', 3),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(2)
                    o.Cb(3), o.tc('ngForOf', e.bankList)
                }
            }
            function yt(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div', 1),
                        o.Vb(1, 'p-toast'),
                        o.Rc(2, $, 4, 1, 'div', 2),
                        o.Rc(3, Q, 4, 1, 'div', 2),
                        o.Rc(4, ce, 4, 1, 'div', 2),
                        o.Rc(5, de, 4, 1, 'div', 2),
                        o.Rc(6, fe, 4, 1, 'div', 2),
                        o.Rc(7, De, 4, 1, 'div', 2),
                        o.Rc(8, Me, 6, 1, 'div', 2),
                        o.Rc(9, Ve, 4, 1, 'div', 2),
                        o.Rc(10, _e, 4, 1, 'div', 2),
                        o.Rc(11, $e, 4, 1, 'div', 2),
                        o.Rc(12, Qe, 4, 1, 'div', 2),
                        o.Rc(13, ct, 4, 1, 'div', 2),
                        o.Rc(14, bt, 4, 1, 'div', 2),
                        o.Rc(15, vt, 4, 1, 'div', 2),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc()
                    o.Cb(2),
                        o.tc('ngIf', e.bankType == e.paymentMode.NETBANKING),
                        o.Cb(1),
                        o.tc('ngIf', e.bankType == e.paymentMode.MVISA),
                        o.Cb(1),
                        o.tc('ngIf', e.bankType == e.paymentMode.LOYALITY_INDIGO),
                        o.Cb(1),
                        o.tc('ngIf', e.bankType == e.paymentMode.CASH_CARD),
                        o.Cb(1),
                        o.tc('ngIf', e.bankType == e.paymentMode.DEBIT_CARD),
                        o.Cb(1),
                        o.tc('ngIf', e.bankType == e.paymentMode.IRCTC_IPAY),
                        o.Cb(1),
                        o.tc('ngIf', e.bankType == e.paymentMode.UPI),
                        o.Cb(1),
                        o.tc('ngIf', e.bankType == e.paymentMode.PREPAID),
                        o.Cb(1),
                        o.tc('ngIf', e.bankType == e.paymentMode.EMI),
                        o.Cb(1),
                        o.tc('ngIf', e.bankType == e.paymentMode.POD),
                        o.Cb(1),
                        o.tc('ngIf', e.bankType == e.paymentMode.CREDIT_CARD),
                        o.Cb(1),
                        o.tc('ngIf', e.bankType == e.paymentMode.MPP),
                        o.Cb(1),
                        o.tc('ngIf', e.bankType == e.paymentMode.EWALLET),
                        o.Cb(1),
                        o.tc('ngIf', e.bankType == e.paymentMode.IC_PAYMENT_REDIRECT_RDS)
                }
            }
            let St = (() => {
                class e {
                    constructor(e, t, n) {
                        ;(this.langService = e),
                            (this.store = t),
                            (this.router = n),
                            (this.bankSelection = new o.n()),
                            (this.paymentMode = new x())
                    }
                    ngOnInit() {
                        this.bankListSub = this.store.select(c.b).subscribe((e) => {
                            null != e &&
                                ((this.bankList = e.bank),
                                (this.bankType = e.type),
                                (this.ewallet = e.ewallet),
                                (this.selectedBnk = void 0))
                        })
                    }
                    ngAfterViewInit() {
                        Object(s.a)(300).subscribe(() => {
                            null != this.firstInput && this.firstInput.nativeElement.focus()
                        }),
                            this.bankList && this.selectBank((this.selectedBnk = 113))
                    }
                    ngOnDestroy() {
                        null != this.bankListSub && this.bankListSub.unsubscribe()
                    }
                    selectBank(e) {
                        console.log('selected bank is : ' + e), (this.selectedBnk = e)
                        let t = new Object()
                        ;(t.bankId = e), this.bankSelection.emit(t)
                    }
                    forgotClick() {
                        this.router.navigate(['/profile/forget-transaction-password'])
                    }
                }
                return (
                    (e.ɵfac = function (t) {
                        return new (t || e)(o.Ub(b.a), o.Ub(m.b), o.Ub(g.c))
                    }),
                    (e.ɵcmp = o.Ob({
                        type: e,
                        selectors: [['app-bank']],
                        viewQuery: function (e, t) {
                            var n
                            1 & e && o.cd(_, true),
                                2 & e && o.Hc((n = o.jc())) && (t.firstInput = n.first)
                        },
                        inputs: { payForm: 'payForm' },
                        outputs: { bankSelection: 'bankSelection' },
                        decls: 1,
                        vars: 1,
                        consts: [
                            [
                                'id',
                                'bank-type',
                                'class',
                                'no-pad col-xs-12',
                                'style',
                                'overflow-y:auto;',
                                4,
                                'ngIf',
                            ],
                            ['id', 'bank-type', 1, 'no-pad', 'col-xs-12', 2, 'overflow-y', 'auto'],
                            [4, 'ngIf'],
                            [4, 'ngFor', 'ngForOf'],
                            [2, 'padding-bottom', '6px'],
                            ['tabindex', '0', 3, 'click', 'keyDown.Enter'],
                            ['firstInput', ''],
                            ['class', 'fa fa-check-circle col-xs-push-11 bank-checked', 4, 'ngIf'],
                            [1, 'col-pad', 'col-xs-12', 'bank-text'],
                            [
                                'appLazyLoad',
                                '',
                                'rel',
                                'preload',
                                'appLazyLoad',
                                '',
                                'alt',
                                'Rail Icon',
                                1,
                                'bank-img',
                                3,
                                'src',
                            ],
                            [1, 'col-pad'],
                            [
                                'target',
                                '_blank',
                                'rel',
                                'noopener noreferrer',
                                'style',
                                ' color:red;',
                                3,
                                'href',
                                4,
                                'ngIf',
                            ],
                            ['class', 'txnCharge', 4, 'ngIf'],
                            [3, 'cardForm', 4, 'ngIf'],
                            [1, 'fa', 'fa-check-circle', 'col-xs-push-11', 'bank-checked'],
                            [
                                'target',
                                '_blank',
                                'rel',
                                'noopener noreferrer',
                                2,
                                'color',
                                'red',
                                3,
                                'href',
                            ],
                            [1, 'txnCharge'],
                            [3, 'cardForm'],
                            ['class', 'txnCharge', 3, 'innerHTML', 4, 'ngIf'],
                            [1, 'txnCharge', 3, 'innerHTML'],
                            ['tabindex', '0', 1, 'focusguard'],
                            ['id', 'focusguardLast', 'tabindex', '0', 1, 'focusguard', 3, 'focus'],
                            [1, 'col-pad', 'col-xs-12', 2, 'padding-bottom', '6px'],
                            ['tabindex', '0', 3, 'class', 'click', 'keyDown.Enter', 4, 'ngIf'],
                            ['class', 'no-pad col-xs-12 border-all', 4, 'ngIf'],
                            ['class', 'inputBoxPad col-xs-12', 4, 'ngIf'],
                            [
                                'oncontextmenu',
                                'return false',
                                1,
                                'inputBoxPad',
                                'col-sm-push-3',
                                'col-sm-6',
                                'col-xs-12',
                            ],
                            [3, 'formGroup'],
                            ['class', 'ui-float-label', 4, 'ngIf'],
                            ['class', 'form-group text-center col-xs-12', 4, 'ngIf'],
                            [1, 'form-group', 'col-xs-12', 'note'],
                            [1, 'pay_tax_text'],
                            [1, 'inputBoxPad', 'col-xs-12'],
                            [1, 'ui-float-label'],
                            [
                                'type',
                                'password',
                                'formControlName',
                                'txnPassword',
                                'autocomplete',
                                'off',
                                1,
                                'form-control',
                                3,
                                'placeholder',
                            ],
                            [1, 'form-group', 'text-center', 'col-xs-12'],
                            [
                                'href',
                                '#',
                                'onclick',
                                'return false;',
                                'tabindex',
                                '0',
                                1,
                                '',
                                2,
                                'color',
                                '#1457a7',
                                3,
                                'click',
                            ],
                            [1, 'no-pad', 'col-xs-12', 'border-all'],
                        ],
                        template: function (e, t) {
                            1 & e && o.Rc(0, yt, 16, 14, 'div', 0),
                                2 & e && o.tc('ngIf', null != t.bankList && null != t.bankList)
                        },
                        directives: [d.o, v.a, d.n, F, S.z, S.o, S.i, S.b, S.n, S.g],
                        pipes: [d.d],
                        styles: [''],
                    })),
                    e
                )
            })()
            var kt = n('myAP')
            const Tt = ['firstInput'],
                Dt = ['firstInput1'],
                Ct = ['firstInput2'],
                It = ['firstInput3'],
                Zt = ['firstInput4'],
                wt = ['firstInput5'],
                Pt = ['firstInput6'],
                Mt = ['firstInput7'],
                Rt = ['firstInput8'],
                xt = ['firstInput9'],
                Ot = ['firstInput10'],
                Et = ['firstInput11'],
                At = ['firstInput12'],
                Vt = ['firstInput13'],
                Bt = ['lastInput']
            function Lt(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div'),
                        o.ac(1, 'p-messages', 27),
                        o.ic('valueChange', function (t) {
                            return o.Kc(e), (o.mc(5).msgsLowBalance = t)
                        }),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(5)
                    o.Cb(1),
                        o.tc('enableService', false)('value', e.msgsLowBalance)('closable', false)
                }
            }
            function Nt(e, t) {
                if ((1 & e && (o.ac(0, 'span', 32), o.Tc(1), o.Zb()), 2 & e)) {
                    const e = o.mc(7)
                    o.Cb(1), o.Vc(' ₹ ', e.softPaymentDTO.loyaltyPointBalance, ' ')
                }
            }
            function Ut(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div'),
                        o.ac(1, 'span', 28),
                        o.Tc(2),
                        o.Zb(),
                        o.Vb(3, 'br'),
                        o.Vb(4, 'br'),
                        o.ac(5, 'div', 29),
                        o.ac(6, 'span', 30),
                        o.Tc(7),
                        o.Zb(),
                        o.Rc(8, Nt, 2, 1, 'span', 31),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(6)
                    o.Cb(2),
                        o.Uc(
                            null == e.langService.lang ? null : e.langService.lang.currentLoyality,
                        ),
                        o.Cb(5),
                        o.Vc(
                            ' ',
                            null == e.langService.lang
                                ? null
                                : e.langService.lang.yourLoyalityPoint,
                            ' ',
                        ),
                        o.Cb(1),
                        o.tc('ngIf', e.softPaymentDTO)
                }
            }
            function Ft(e, t) {
                if ((1 & e && o.Rc(0, Ut, 9, 3, 'div', 23), 2 & e)) {
                    o.mc()
                    const e = o.Ic(6),
                        t = o.mc(4)
                    o.tc('ngIf', t.softPaymentDTO.loyaltyPointBalance <= t.softPaymentDTO.amount)(
                        'ngIfElse',
                        e,
                    )
                }
            }
            function _t(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 29),
                        o.ac(1, 'a', 33),
                        o.ic('click', function () {
                            return o.Kc(e), o.mc(5).purchaseLoyaltyPoints()
                        }),
                        o.Tc(2),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(5)
                    o.Cb(2), o.Uc(e.softPaymentDTO.purchaseLoyalityPoint)
                }
            }
            function Kt(e, t) {
                if ((1 & e && (o.ac(0, 'span', 34), o.Tc(1), o.Zb()), 2 & e)) {
                    const e = o.mc(5)
                    o.Cb(1),
                        o.Uc(null == e.langService.lang ? null : e.langService.lang.loyaltyAllowed)
                }
            }
            function jt(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div'),
                        o.Rc(1, Lt, 2, 3, 'div', 23),
                        o.Rc(2, Ft, 1, 2, 'ng-template', null, 24, o.Sc),
                        o.Rc(4, _t, 3, 1, 'div', 25),
                        o.Rc(5, Kt, 2, 1, 'ng-template', null, 26, o.Sc),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.Ic(3),
                        t = o.mc(4)
                    o.Cb(1),
                        o.tc(
                            'ngIf',
                            t.softPaymentDTO.loyaltyPointBalance < t.softPaymentDTO.minBalance,
                        )('ngIfElse', e),
                        o.Cb(3),
                        o.tc(
                            'ngIf',
                            t.softPaymentDTO.loyaltyPointBalance < t.softPaymentDTO.minBalance ||
                                t.softPaymentDTO.loyaltyPointBalance <= t.softPaymentDTO.amount,
                        )
                }
            }
            function zt(e, t) {
                if ((1 & e && (o.ac(0, 'span', 42), o.Tc(1), o.Zb()), 2 & e)) {
                    const e = o.mc(5)
                    o.Cb(1),
                        o.Wc(
                            ' ',
                            null == e.langService.lang
                                ? null
                                : e.langService.lang.yourLoyalityPoint,
                            ' ₹ ',
                            e.softPaymentDTO.loyaltyPointBalance,
                            ' ',
                        )
                }
            }
            function qt(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 35),
                        o.Vb(1, 'img', 36),
                        o.ac(2, 'span', 37),
                        o.Tc(3),
                        o.Zb(),
                        o.Vb(4, 'br'),
                        o.Rc(5, zt, 2, 2, 'span', 38),
                        o.Vb(6, 'br'),
                        o.Tc(7),
                        o.Vb(8, 'input', 39),
                        o.Vb(9, 'br'),
                        o.ac(10, 'span', 40),
                        o.Tc(11),
                        o.Zb(),
                        o.Vb(12, 'br'),
                        o.ac(13, 'div'),
                        o.ac(14, 'button', 41),
                        o.ic('click', function () {
                            return o.Kc(e), o.mc(4).loyaltyRedemptionClicked()
                        }),
                        o.Tc(15),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(4)
                    o.Cb(1),
                        o.vc(
                            'src',
                            './assets/images/loyaltyImages/',
                            e.softPaymentDTO.loyaltyBankId,
                            '.png',
                            o.Mc,
                        ),
                        o.Cb(2),
                        o.Vc(' (', e.softPaymentDTO.loyaltyBankName, ') '),
                        o.Cb(2),
                        o.tc('ngIf', e.softPaymentDTO),
                        o.Cb(2),
                        o.Vc(
                            ' ',
                            null == e.langService.lang
                                ? null
                                : e.langService.lang.paymentPageEwalletMsg2,
                            ': ',
                        ),
                        o.Cb(4),
                        o.Uc(e.softPaymentDTO.message),
                        o.Cb(3),
                        o.tc('disabled', !e.payForm.controls.txnPassword.value),
                        o.Cb(1),
                        o.Uc(
                            null == e.langService.lang
                                ? null
                                : e.langService.lang.paymentPageEwalletMsg3,
                        )
                }
            }
            function Ht(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div', 20),
                        o.ac(1, 'div', 21),
                        o.ac(2, 'table'),
                        o.ac(3, 'tr'),
                        o.Rc(4, jt, 7, 3, 'div', 5),
                        o.Rc(5, qt, 16, 7, 'div', 22),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(3)
                    o.Cb(4),
                        o.tc('ngIf', 'false' == e.softPaymentDTO.activatedFlag),
                        o.Cb(1),
                        o.tc('ngIf', 'true' == e.softPaymentDTO.activatedFlag)
                }
            }
            function $t(e, t) {
                1 & e && o.Vb(0, 'div', 47)
            }
            function Wt(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'span'),
                        o.ac(1, 'td', 43),
                        o.ac(2, 'div', 44),
                        o.ic('click', function () {
                            o.Kc(e)
                            const t = o.mc().$implicit
                            return o.mc(3).onSelectBankSoft(t.loyaltyBankId)
                        })('keyDown.Enter', function () {
                            o.Kc(e)
                            const t = o.mc().$implicit
                            return o.mc(3).onSelectBankSoft(t.loyaltyBankId)
                        }),
                        o.Rc(3, $t, 1, 0, 'div', 45),
                        o.ac(4, 'div', 20),
                        o.Vb(5, 'img', 36),
                        o.ac(6, 'span', 46),
                        o.Tc(7),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(),
                        t = e.index,
                        n = e.$implicit,
                        a = o.mc(3)
                    o.Cb(1),
                        o.Kb(
                            'col-pad  col-lg-24 col-md-24  col-sm-12 col-xs-12 pull-',
                            t % 2 == 0 ? 'left' : 'right',
                            '',
                        ),
                        o.Cb(1),
                        o.Kb(
                            'link no-pad col-xs-12 border-all ',
                            n.loyaltyBankName == a.onSelectBankSoft ? 'dull-back' : '',
                            '',
                        ),
                        o.Cb(1),
                        o.tc('ngIf', n.loyaltyBankId == a.selectedBnk),
                        o.Cb(2),
                        o.vc(
                            'src',
                            './assets/images/loyaltyImages/',
                            n.loyaltyBankId,
                            '.png',
                            o.Mc,
                        ),
                        o.Cb(2),
                        o.Vc('', n.loyaltyBankName, ' ')
                }
            }
            function Yt(e, t) {
                if ((1 & e && (o.ac(0, 'span'), o.Rc(1, Wt, 8, 9, 'span', 5), o.Zb()), 2 & e)) {
                    const e = t.$implicit
                    o.Cb(1), o.tc('ngIf', 101 != e.loyaltyBankId)
                }
            }
            function Gt(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'p-tabPanel', 16),
                        o.Rc(1, Ht, 6, 2, 'div', 17),
                        o.ac(2, 'div', 18),
                        o.ac(3, 'table'),
                        o.ac(4, 'tr'),
                        o.Rc(5, Yt, 2, 1, 'span', 19),
                        o.Vb(6, 'span'),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(2)
                    o.Cb(1),
                        o.tc('ngIf', e.softPaymentDTO),
                        o.Cb(4),
                        o.tc('ngForOf', e.softPaymentDTOs)
                }
            }
            function Jt(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'p-tabView', 14), o.Rc(1, Gt, 7, 2, 'p-tabPanel', 15), o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc()
                    o.Cb(1), o.tc('ngIf', e.softPaymentDTO)
                }
            }
            function Xt(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 56),
                        o.ic('keyDown.Enter', function () {
                            o.Kc(e)
                            const t = o.mc(3)
                            return (t.bankId = t.p.bankId)
                        }),
                        o.ac(1, 'div', 57),
                        o.ac(2, 'div', 58),
                        o.ac(3, 'label', 59),
                        o.Tc(4),
                        o.Zb(),
                        o.Vb(5, 'input', 60),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(3)
                    o.Cb(4),
                        o.Uc(
                            null == e.langService.lang
                                ? null
                                : e.langService.lang.paymentPageEwalletMsg2,
                        )
                }
            }
            function Qt(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'p-tabPanel', 49),
                        o.Vb(1, 'div', 50),
                        o.ac(2, 'div', 51),
                        o.ac(3, 'div'),
                        o.Rc(4, Xt, 6, 1, 'div', 52),
                        o.ac(5, 'div', 53),
                        o.ac(6, 'button', 54),
                        o.ic('click', function () {
                            return o.Kc(e), o.mc(2).rdsPaymentClicked()
                        }),
                        o.Tc(7),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.ac(8, 'div', 55),
                        o.ic('focus', function () {
                            return o.Kc(e), o.mc(2).onFocusguardLast()
                        }),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(2)
                    o.uc('header', null == e.langService.lang ? null : e.langService.lang.rds),
                        o.Cb(4),
                        o.tc('ngIf', e.txnPasswordMandate),
                        o.Cb(2),
                        o.tc(
                            'disabled',
                            null == e.txnPassword.value || '' == e.txnPassword.value.trim(),
                        ),
                        o.Cb(1),
                        o.Vc(
                            '',
                            null == e.langService.lang
                                ? null
                                : e.langService.lang.paymentPageEwalletMsg3,
                            ' ',
                        )
                }
            }
            function en(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'p-tabView', 14), o.Rc(1, Qt, 9, 4, 'p-tabPanel', 48), o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc()
                    o.Cb(1),
                        o.tc(
                            'ngIf',
                            2 == e.rdsflag && 'true' == e.travelAgFlag && 'false' == e.upiAgRdsFlag,
                        )
                }
            }
            function tn(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 63, 64),
                        o.ic('click', function () {
                            o.Kc(e)
                            const t = o.mc(2)
                            return t.onSelectPayMode(t.paymentMode.IRCTC_IPAY)
                        }),
                        o.Vb(2, 'img', 65),
                        o.ac(3, 'span', 46),
                        o.Tc(4),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(2)
                    o.Kb(
                        'bank-type col-xs-12 ',
                        e.paymentMode.IRCTC_IPAY == e.selectedBankType ? 'bank-type-active' : '',
                        '',
                    ),
                        o.Cb(4),
                        o.Uc(null == e.langService.lang ? null : e.langService.lang.ipay)
                }
            }
            function nn(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 63, 64),
                        o.ic('click', function () {
                            o.Kc(e)
                            const t = o.mc(2)
                            return t.onSelectPayMode(t.paymentMode.EWALLET)
                        }),
                        o.Vb(2, 'img', 66),
                        o.ac(3, 'span', 46),
                        o.Tc(4),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(2)
                    o.Kb(
                        'bank-type col-xs-12 ',
                        e.paymentMode.EWALLET == e.selectedBankType ? 'bank-type-active' : '',
                        '',
                    ),
                        o.Cb(4),
                        o.Uc(null == e.langService.lang ? null : e.langService.lang.irctcEwallet)
                }
            }
            function an(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 63, 64),
                        o.ic('click', function () {
                            o.Kc(e)
                            const t = o.mc(2)
                            return t.onSelectPayMode(t.paymentMode.MPP)
                        }),
                        o.Vb(2, 'img', 67),
                        o.ac(3, 'span', 46),
                        o.Tc(4),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(2)
                    o.Kb(
                        'bank-type col-xs-12 ',
                        e.paymentMode.MPP == e.selectedBankType ? 'bank-type-active' : '',
                        '',
                    ),
                        o.Cb(4),
                        o.Uc(
                            null == e.langService.lang
                                ? null
                                : e.langService.lang.multiplePaymentService,
                        )
                }
            }
            function cn(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 63, 64),
                        o.ic('click', function () {
                            o.Kc(e)
                            const t = o.mc(2)
                            return t.onSelectPayMode(t.paymentMode.UPI)
                        }),
                        o.Vb(2, 'img', 68),
                        o.ac(3, 'span', 46),
                        o.Tc(4),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(2)
                    o.Kb(
                        'bank-type col-xs-12 ',
                        e.paymentMode.UPI == e.selectedBankType ? 'bank-type-active' : '',
                        '',
                    ),
                        o.Cb(4),
                        o.Uc(null == e.langService.lang ? null : e.langService.lang.bhimUpiUssd)
                }
            }
            function sn(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 63, 64),
                        o.ic('click', function () {
                            o.Kc(e)
                            const t = o.mc(2)
                            return t.onSelectPayMode(t.paymentMode.NETBANKING)
                        }),
                        o.Vb(2, 'img', 69),
                        o.ac(3, 'span', 46),
                        o.Tc(4),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(2)
                    o.Kb(
                        'bank-type col-xs-12 ',
                        e.paymentMode.NETBANKING == e.selectedBankType ? 'bank-type-active' : '',
                        '',
                    ),
                        o.Cb(4),
                        o.Uc(null == e.langService.lang ? null : e.langService.lang.netbanking)
                }
            }
            function ln(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 63, 64),
                        o.ic('click', function () {
                            o.Kc(e)
                            const t = o.mc(2)
                            return t.onSelectPayMode(t.paymentMode.DEBIT_CARD)
                        }),
                        o.Vb(2, 'img', 70),
                        o.ac(3, 'span', 46),
                        o.Tc(4),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(2)
                    o.Kb(
                        'bank-type col-xs-12 ',
                        e.paymentMode.DEBIT_CARD == e.selectedBankType ? 'bank-type-active' : '',
                        '',
                    ),
                        o.Cb(4),
                        o.Uc(
                            null == e.langService.lang ? null : e.langService.lang.debitCardwithPin,
                        )
                }
            }
            function rn(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 63, 64),
                        o.ic('click', function () {
                            o.Kc(e)
                            const t = o.mc(2)
                            return t.onSelectPayMode(t.paymentMode.CREDIT_CARD)
                        }),
                        o.Vb(2, 'img', 70),
                        o.ac(3, 'span', 46),
                        o.Tc(4),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(2)
                    o.Kb(
                        'bank-type col-xs-12 ',
                        e.paymentMode.CREDIT_CARD == e.selectedBankType ? 'bank-type-active' : '',
                        '',
                    ),
                        o.Cb(4),
                        o.Uc(null == e.langService.lang ? null : e.langService.lang.message14)
                }
            }
            function on(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 63, 64),
                        o.ic('click', function () {
                            o.Kc(e)
                            const t = o.mc(2)
                            return t.onSelectPayMode(t.paymentMode.POD)
                        }),
                        o.Vb(2, 'img', 71),
                        o.ac(3, 'span', 46),
                        o.Tc(4),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(2)
                    o.Kb(
                        'bank-type col-xs-12 ',
                        e.paymentMode.POD == e.selectedBankType ? 'bank-type-active' : '',
                        '',
                    ),
                        o.Cb(4),
                        o.Uc(null == e.langService.lang ? null : e.langService.lang.payOnDelivery)
                }
            }
            function gn(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 63, 64),
                        o.ic('click', function () {
                            o.Kc(e)
                            const t = o.mc(2)
                            return t.onSelectPayMode(t.paymentMode.MVISA)
                        }),
                        o.Vb(2, 'img', 68),
                        o.ac(3, 'span', 46),
                        o.Tc(4),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(2)
                    o.Kb(
                        'bank-type col-xs-12 ',
                        e.paymentMode.MVISA == e.selectedBankType ? 'bank-type-active' : '',
                        '',
                    ),
                        o.Cb(4),
                        o.Uc(null == e.langService.lang ? null : e.langService.lang.bharatQr)
                }
            }
            function dn(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 63, 64),
                        o.ic('click', function () {
                            o.Kc(e)
                            const t = o.mc(2)
                            return t.onSelectPayMode(t.paymentMode.CASH_CARD)
                        }),
                        o.Vb(2, 'img', 72),
                        o.ac(3, 'span', 46),
                        o.Tc(4),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(2)
                    o.Kb(
                        'bank-type col-xs-12 ',
                        e.paymentMode.CASH_CARD == e.selectedBankType ? 'bank-type-active' : '',
                        '',
                    ),
                        o.Cb(4),
                        o.Uc(null == e.langService.lang ? null : e.langService.lang.walletsCashCard)
                }
            }
            function bn(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 63, 64),
                        o.ic('click', function () {
                            o.Kc(e)
                            const t = o.mc(2)
                            return t.onSelectPayMode(t.paymentMode.PREPAID)
                        }),
                        o.Vb(2, 'img', 73),
                        o.ac(3, 'span', 46),
                        o.Tc(4),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(2)
                    o.Kb(
                        'bank-type col-xs-12 ',
                        e.paymentMode.PREPAID == e.selectedBankType ? 'bank-type-active' : '',
                        '',
                    ),
                        o.Cb(4),
                        o.Uc(null == e.langService.lang ? null : e.langService.lang.IrctcPrepaid)
                }
            }
            function un(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 63, 64),
                        o.ic('click', function () {
                            o.Kc(e)
                            const t = o.mc(2)
                            return t.onSelectPayMode(t.paymentMode.IC_PAYMENT_REDIRECT_RDS)
                        }),
                        o.Vb(2, 'img', 74),
                        o.ac(3, 'span', 46),
                        o.Tc(4),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(2)
                    o.Kb(
                        'bank-type col-xs-12 ',
                        e.paymentMode.IC_PAYMENT_REDIRECT_RDS == e.selectedBankType
                            ? 'bank-type-active'
                            : '',
                        '',
                    ),
                        o.Cb(4),
                        o.Uc(null == e.langService.lang ? null : e.langService.lang.rdsUrl)
                }
            }
            function pn(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 75),
                        o.ic('click', function () {
                            o.Kc(e)
                            const t = o.mc(2)
                            return t.onSelectPayMode(t.paymentMode.EMI)
                        })('keydown.Enter', function () {
                            o.Kc(e)
                            const t = o.mc(2)
                            return t.onSelectPayMode(t.paymentMode.EMI)
                        }),
                        o.Vb(1, 'img', 76),
                        o.ac(2, 'span', 46),
                        o.Tc(3),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(2)
                    o.Kb(
                        'bank-type col-xs-12 ',
                        e.paymentMode.EMI == e.selectedBankType ? 'bank-type-active' : '',
                        '',
                    ),
                        o.Cb(3),
                        o.Uc(null == e.langService.lang ? null : e.langService.lang.Emi)
                }
            }
            function mn(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 63, 64),
                        o.ic('click', function () {
                            o.Kc(e)
                            const t = o.mc(2)
                            return t.onSelectPayMode(t.paymentMode.LOYALITY_INDIGO)
                        }),
                        o.Vb(2, 'img', 72),
                        o.ac(3, 'span', 46),
                        o.Tc(4, '6E Rewards '),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(2)
                    o.Kb(
                        'bank-type col-xs-12 ',
                        e.paymentMode.LOYALITY_INDIGO == e.selectedBankType
                            ? 'bank-type-active'
                            : '',
                        '',
                    )
                }
            }
            function hn(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'span'),
                        o.Rc(1, tn, 5, 4, 'div', 61),
                        o.Rc(2, nn, 5, 4, 'div', 61),
                        o.Rc(3, an, 5, 4, 'div', 61),
                        o.Rc(4, cn, 5, 4, 'div', 61),
                        o.Rc(5, sn, 5, 4, 'div', 61),
                        o.Rc(6, ln, 5, 4, 'div', 61),
                        o.Rc(7, rn, 5, 4, 'div', 61),
                        o.Rc(8, on, 5, 4, 'div', 61),
                        o.Rc(9, gn, 5, 4, 'div', 61),
                        o.Rc(10, dn, 5, 4, 'div', 61),
                        o.Rc(11, bn, 5, 4, 'div', 61),
                        o.Rc(12, un, 5, 4, 'div', 61),
                        o.Rc(13, pn, 4, 4, 'div', 62),
                        o.Rc(14, mn, 5, 3, 'div', 61),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc()
                    o.Cb(1),
                        o.tc('ngIf', e.bankList[e.paymentMode.IRCTC_IPAY]),
                        o.Cb(1),
                        o.tc('ngIf', 2 == e.rdsflag && e.bankList[e.paymentMode.EWALLET]),
                        o.Cb(1),
                        o.tc('ngIf', e.bankList[e.paymentMode.MPP]),
                        o.Cb(1),
                        o.tc('ngIf', e.bankList[e.paymentMode.UPI]),
                        o.Cb(1),
                        o.tc('ngIf', e.bankList[e.paymentMode.NETBANKING]),
                        o.Cb(1),
                        o.tc('ngIf', e.bankList[e.paymentMode.DEBIT_CARD]),
                        o.Cb(1),
                        o.tc('ngIf', e.bankList[e.paymentMode.CREDIT_CARD]),
                        o.Cb(1),
                        o.tc('ngIf', e.bankList[e.paymentMode.POD]),
                        o.Cb(1),
                        o.tc('ngIf', e.bankList[e.paymentMode.MVISA]),
                        o.Cb(1),
                        o.tc('ngIf', e.bankList[e.paymentMode.CASH_CARD]),
                        o.Cb(1),
                        o.tc('ngIf', e.bankList[e.paymentMode.PREPAID]),
                        o.Cb(1),
                        o.tc('ngIf', e.bankList[e.paymentMode.IC_PAYMENT_REDIRECT_RDS]),
                        o.Cb(1),
                        o.tc('ngIf', e.bankList[e.paymentMode.EMI]),
                        o.Cb(1),
                        o.tc('ngIf', e.bankList[e.paymentMode.LOYALITY_INDIGO])
                }
            }
            function fn(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 77),
                        o.ac(1, 'app-bank', 78),
                        o.ic('bankSelection', function (t) {
                            return o.Kc(e), o.mc().bankSelection(t)
                        }),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc()
                    o.Cb(1), o.tc('payForm', e.payForm)
                }
            }
            function vn(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'span', 92),
                        o.Tc(1),
                        o.nc(2, 'stationName'),
                        o.nc(3, 'stationName'),
                        o.nc(4, 'date'),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(2)
                    o.Cb(1),
                        o.Xc(
                            ' ',
                            o.qc(2, 3, e.journeyDetails.fromStation, '', e.langService.langChoice),
                            ' to ',
                            o.qc(3, 7, e.journeyDetails.upToStation, '', e.langService.langChoice),
                            ' | ',
                            o.pc(
                                4,
                                11,
                                e.journeyDetails.lapDetails[0].avlDetails.journeyDate,
                                'EEE, dd MMM',
                            ),
                            ' ',
                        )
                }
            }
            function yn(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div', 93),
                        o.ac(1, 'button', 94),
                        o.Tc(2),
                        o.nc(3, 'number'),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(2)
                    o.Cb(2),
                        o.Vc(
                            ' ₹ ',
                            o.pc(3, 1, e.singleDayAvlEnqDtls.totalCollectibleAmount, '1.2-2'),
                            ' ',
                        )
                }
            }
            function Sn(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'p-sidebar', 79),
                        o.ic('visibleChange', function (t) {
                            return o.Kc(e), (o.mc().showBankListMob = t)
                        }),
                        o.ac(1, 'div', 80),
                        o.ac(2, 'div', 81),
                        o.ac(3, 'div', 82),
                        o.ac(4, 'div', 83),
                        o.ac(5, 'div', 84),
                        o.ic('click', function () {
                            return o.Kc(e), (o.mc().showBankListMob = false)
                        }),
                        o.Zb(),
                        o.ac(6, 'div', 85),
                        o.ac(7, 'strong'),
                        o.Tc(8),
                        o.Zb(),
                        o.Vb(9, 'br'),
                        o.Rc(10, vn, 5, 14, 'span', 86),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.ac(11, 'div', 87),
                        o.ac(12, 'app-bank', 78),
                        o.ic('bankSelection', function (t) {
                            return o.Kc(e), o.mc().bankSelection(t)
                        }),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.ac(13, 'div', 88),
                        o.Rc(14, yn, 4, 4, 'div', 89),
                        o.ac(15, 'div', 90),
                        o.ac(16, 'button', 91),
                        o.ic('click', function () {
                            return o.Kc(e), o.mc().payNow()
                        }),
                        o.Tc(17),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc()
                    o.tc('visible', e.showBankListMob)('fullScreen', true)('baseZIndex', 1e4),
                        o.Cb(8),
                        o.Uc(null == e.langService.lang ? null : e.langService.lang.payBook),
                        o.Cb(2),
                        o.tc('ngIf', !e.forEwallet),
                        o.Cb(2),
                        o.tc('payForm', e.payForm),
                        o.Cb(2),
                        o.tc('ngIf', !e.forEwallet),
                        o.Cb(3),
                        o.Vc(
                            '',
                            null == e.langService.lang ? null : e.langService.lang.payBook,
                            ' ',
                        )
                }
            }
            function kn(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div', 93),
                        o.ac(1, 'button', 94),
                        o.Tc(2),
                        o.nc(3, 'number'),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(2)
                    o.Cb(2),
                        o.Vc(
                            ' ₹ ',
                            o.pc(3, 1, e.singleDayAvlEnqDtls.totalCollectibleAmount, '1.2-2'),
                            ' ',
                        )
                }
            }
            const Tn = function () {
                return { height: '0px' }
            }
            function Dn(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'p-sidebar', 9),
                        o.ac(1, 'div', 10),
                        o.Rc(2, kn, 4, 4, 'div', 89),
                        o.ac(3, 'div', 90),
                        o.ac(4, 'button', 91),
                        o.ic('click', function () {
                            return o.Kc(e), o.mc().showBank()
                        }),
                        o.Tc(5),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc()
                    o.tc('modal', false)('visible', true)('ngStyle', o.yc(5, Tn)),
                        o.Cb(2),
                        o.tc('ngIf', !e.forEwallet),
                        o.Cb(3),
                        o.Vc(
                            '',
                            null == e.langService.lang
                                ? null
                                : e.langService.lang.psgnInputpageMsg22,
                            ' ',
                        )
                }
            }
            function Cn(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div', 85),
                        o.ac(1, 'strong'),
                        o.Tc(2),
                        o.Zb(),
                        o.Vb(3, 'br'),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(2)
                    o.Cb(2),
                        o.Uc(null == e.langService.lang ? null : e.langService.lang.makePayment)
                }
            }
            function In(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'p-sidebar', 79),
                        o.ic('visibleChange', function (t) {
                            return o.Kc(e), (o.mc().showBankListMob = t)
                        }),
                        o.ac(1, 'div', 80),
                        o.ac(2, 'div', 81),
                        o.ac(3, 'div', 82),
                        o.ac(4, 'div', 83),
                        o.ac(5, 'div', 84),
                        o.ic('click', function () {
                            return o.Kc(e), (o.mc().showBankListMob = false)
                        }),
                        o.Zb(),
                        o.Rc(6, Cn, 4, 1, 'div', 95),
                        o.Zb(),
                        o.Zb(),
                        o.ac(7, 'div', 87),
                        o.ac(8, 'app-bank', 78),
                        o.ic('bankSelection', function (t) {
                            return o.Kc(e), o.mc().bankSelection(t)
                        }),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.ac(9, 'div', 88),
                        o.ac(10, 'div', 96),
                        o.ac(11, 'button', 91),
                        o.ic('click', function () {
                            return o.Kc(e), o.mc().payNow()
                        }),
                        o.Tc(12),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc()
                    o.tc('visible', e.showBankListMob)('fullScreen', true)('baseZIndex', 1e4),
                        o.Cb(6),
                        o.tc('ngIf', e.forEwallet),
                        o.Cb(2),
                        o.tc('payForm', e.payForm),
                        o.Cb(4),
                        o.Uc(null == e.langService.lang ? null : e.langService.lang.makePayment)
                }
            }
            function Zn(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 96),
                        o.ac(1, 'button', 91),
                        o.ic('click', function () {
                            return o.Kc(e), o.mc().showBank()
                        }),
                        o.Tc(2),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc()
                    o.Cb(2),
                        o.Vc(
                            '',
                            null == e.langService.lang
                                ? null
                                : e.langService.lang.psgnInputpageMsg22,
                            ' ',
                        )
                }
            }
            function wn(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'p-sidebar', 97),
                        o.ac(1, 'div', 10),
                        o.ac(2, 'div', 96),
                        o.ac(3, 'button', 91),
                        o.ic('click', function () {
                            return o.Kc(e), o.mc().payNow()
                        }),
                        o.Tc(4),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc()
                    o.tc('modal', false)('visible', true)('ngStyle', o.yc(4, Tn)),
                        o.Cb(4),
                        o.Uc(null == e.langService.lang ? null : e.langService.lang.makePayment)
                }
            }
            function Pn(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'p-sidebar', 79),
                        o.ic('visibleChange', function (t) {
                            return o.Kc(e), (o.mc().showBankListMob = t)
                        }),
                        o.ac(1, 'div', 80),
                        o.ac(2, 'div', 81),
                        o.ac(3, 'div', 82),
                        o.ac(4, 'div', 83),
                        o.ac(5, 'div', 84),
                        o.ic('click', function () {
                            return o.Kc(e), (o.mc().showBankListMob = false)
                        }),
                        o.Zb(),
                        o.ac(6, 'div', 85),
                        o.ac(7, 'strong'),
                        o.Tc(8),
                        o.Zb(),
                        o.Vb(9, 'br'),
                        o.ac(10, 'span', 92),
                        o.Tc(11),
                        o.nc(12, 'stationName'),
                        o.nc(13, 'stationName'),
                        o.nc(14, 'date'),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.ac(15, 'div', 87),
                        o.ac(16, 'app-bank', 78),
                        o.ic('bankSelection', function (t) {
                            return o.Kc(e), o.mc().bankSelection(t)
                        }),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.ac(17, 'div', 88),
                        o.ac(18, 'div', 93),
                        o.ac(19, 'button', 94),
                        o.Tc(20),
                        o.nc(21, 'number'),
                        o.Zb(),
                        o.Zb(),
                        o.ac(22, 'div', 90),
                        o.ac(23, 'button', 91),
                        o.ic('click', function () {
                            return o.Kc(e), o.mc().payNow()
                        }),
                        o.Tc(24),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc()
                    o.tc('visible', e.showBankListMob)('fullScreen', true)('baseZIndex', 1e4),
                        o.Cb(8),
                        o.Uc(null == e.langService.lang ? null : e.langService.lang.payBook),
                        o.Cb(3),
                        o.Xc(
                            ' ',
                            o.qc(
                                12,
                                10,
                                e.journeyDetails.fromStation,
                                '',
                                e.langService.langChoice,
                            ),
                            ' to ',
                            o.qc(
                                13,
                                14,
                                e.journeyDetails.upToStation,
                                '',
                                e.langService.langChoice,
                            ),
                            ' | ',
                            o.pc(
                                14,
                                18,
                                e.journeyDetails.lapDetails[0].avlDetails.journeyDate,
                                'EEE, dd MMM',
                            ),
                            ' ',
                        ),
                        o.Cb(5),
                        o.tc('payForm', e.payForm),
                        o.Cb(4),
                        o.Vc(
                            ' ₹ ',
                            o.pc(21, 21, e.singleDayAvlEnqDtls.totalCollectibleAmount, '1.2-2'),
                            ' ',
                        ),
                        o.Cb(4),
                        o.Vc(
                            '',
                            null == e.langService.lang ? null : e.langService.lang.payBook,
                            ' ',
                        )
                }
            }
            function Mn(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'p-sidebar', 9),
                        o.ac(1, 'div', 10),
                        o.ac(2, 'div', 93),
                        o.ac(3, 'button', 94),
                        o.Tc(4),
                        o.nc(5, 'number'),
                        o.Zb(),
                        o.Zb(),
                        o.ac(6, 'div', 90),
                        o.ac(7, 'button', 91),
                        o.ic('click', function () {
                            return o.Kc(e), o.mc().showBank()
                        }),
                        o.Tc(8),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc()
                    o.tc('modal', false)('visible', true)('ngStyle', o.yc(8, Tn)),
                        o.Cb(4),
                        o.Vc(
                            ' ₹ ',
                            o.pc(5, 5, e.singleDayAvlEnqDtls.totalCollectibleAmount, '1.2-2'),
                            ' ',
                        ),
                        o.Cb(4),
                        o.Vc(
                            '',
                            null == e.langService.lang
                                ? null
                                : e.langService.lang.psgnInputpageMsg22,
                            ' ',
                        )
                }
            }
            function Rn(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'button', 101),
                        o.ic('click', function () {
                            return o.Kc(e), o.mc(2).payNow()
                        }),
                        o.Tc(1),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(2)
                    o.Cb(1),
                        o.Vc(
                            '',
                            null == e.langService.lang ? null : e.langService.lang.payBook,
                            ' ',
                        )
                }
            }
            function xn(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 98),
                        o.ac(1, 'button', 99),
                        o.ic('click', function () {
                            return o.Kc(e), o.mc().goBack()
                        }),
                        o.Tc(2, 'Back'),
                        o.Zb(),
                        o.Rc(3, Rn, 2, 1, 'button', 100),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc()
                    o.Cb(3),
                        o.tc(
                            'ngIf',
                            null != e.selectedBankType &&
                                null != e.selectedBankType &&
                                !e.forEwallet,
                        )
                }
            }
            let On = (() => {
                class e {
                    constructor(e, t, n, a, i, c, s, l, r, g) {
                        ;(this.router = e),
                            (this.fb = t),
                            (this.rollesPipe = n),
                            (this.userService = a),
                            (this.langService = i),
                            (this.paymentService = c),
                            (this.commonService = s),
                            (this.store = l),
                            (this.messageService = r),
                            (this.localStorage = g),
                            (this.prefBank = false),
                            (this.bankInput = new S.e('')),
                            (this.txnPassword = new S.e('', [S.x.required])),
                            (this.cardInputFlag = false),
                            (this.paymentMode = new x()),
                            (this.error = true),
                            (this.showPref = false),
                            (this.bankListdto = new E()),
                            (this.captchaType = 'PAYMENT'),
                            (this.txnPasswordMandate = false),
                            (this.msgsLoyality = []),
                            (this.msgsLowBalance = []),
                            (this.msgsDisableReason = []),
                            (this.showHdfc = false),
                            (this.paymentInitiated = false),
                            (this.ftPymntMsgFlag = false),
                            (this.charCount = 0),
                            (this.shMsg = {
                                cc_dc: false,
                                dcp: false,
                                showLoyalityMessage: false,
                                upiAgRdsFlag: false,
                            }),
                            (this.showBankListMob = false),
                            (this.softFlag = false),
                            (this.fetchPref = false),
                            (this.makePayment = new o.n()),
                            (this.showMsg = new o.n()),
                            (this.forEwallet = false),
                            (this.payForm = t.group({
                                bankId: this.bankInput,
                                bankId1: this.bankInput,
                                payButton: [''],
                                favFlag: [''],
                                cardType: ['', S.x.required],
                                cardNo: [
                                    '',
                                    [
                                        S.x.required,
                                        S.x.maxLength(19),
                                        S.x.minLength(13),
                                        S.x.pattern('[0-9]+'),
                                        O,
                                    ],
                                ],
                                cardExpMon: ['', S.x.required],
                                cardExpYear: [
                                    '',
                                    [
                                        S.x.required,
                                        S.x.maxLength(4),
                                        S.x.minLength(4),
                                        S.x.pattern('[0-9]+'),
                                    ],
                                ],
                                cvv: [
                                    '',
                                    [
                                        S.x.required,
                                        S.x.maxLength(4),
                                        S.x.minLength(3),
                                        S.x.pattern('[0-9]+'),
                                    ],
                                ],
                                cardName: ['', [S.x.required, S.x.pattern('[a-z]*')]],
                                captcha: ['', S.x.required],
                                txnPassword: this.txnPassword,
                                virtualPaymentAddress: ['', S.x.required],
                            }))
                    }
                    ngOnInit() {
                        if (
                            ((this.jdSub = this.store.select(c.h).subscribe((e) => {
                                this.journeyDetails = e
                            })),
                            (this.singleDayAvlEnqDtls = this.commonService.singleDayAvlEnqDtls),
                            null != this.journeyDetails &&
                                this.journeyDetails.loyaltyRedemptionBooking &&
                                ((this.softFlag = true),
                                (this.softBankList = Array.isArray(
                                    this.singleDayAvlEnqDtls.softPaymentDTOs,
                                )
                                    ? this.singleDayAvlEnqDtls.softPaymentDTOs
                                    : Array.of(this.singleDayAvlEnqDtls.softPaymentDTOs)),
                                this.softBankList.forEach((e) => {
                                    ;(e.imageName = e.loyaltyBankName.split(' ')[0]),
                                        101 == e.loyaltyBankId &&
                                            ((this.loyaltynumber = e.loyalityNumberSoft),
                                            (this.softBankId = e.loyaltyBankId),
                                            (this.softPaymentDTO = e))
                                })),
                            (this.bankArray = Array.isArray(this.bankArray)
                                ? this.bankArray
                                : Array.of(this.bankArray)),
                            (void 0 === this.bankArray && null == this.bankArray) ||
                                this.paymentService.setBankDetail(this.bankArray),
                            this.setPreferredBankList(),
                            (this.bankList = this.paymentService.getBankMap()),
                            (this.modes = this.paymentService.paymentModes),
                            void 0 !== this.userService.userResponse.rolles &&
                                (this.PREFERED_BANK =
                                    1 ==
                                    this.userService.userResponse.rolles[
                                        this.rollesPipe.transform('PREFERED_BANK') - 1
                                    ]),
                            void 0 !== this.userService.userResponse &&
                                null != this.userService.userResponse &&
                                ((this.rdsflag = this.userService.userResponse.rdsFlag),
                                (this.taflag =
                                    1 ==
                                    this.userService.userResponse.rolles[
                                        this.rollesPipe.transform('RDS') - 1
                                    ]
                                        ? 2
                                        : 1),
                                (this.travelAgFlag =
                                    this.commonService.singleDayAvlEnqDtls.avlFareResponseDTO[0]
                                        .taRdsFlag + ''),
                                (this.upiAgRdsFlag =
                                    this.commonService.singleDayAvlEnqDtls.avlFareResponseDTO[0]
                                        .upiRdsFlag + ''),
                                (this.ftPymntMsgFlag =
                                    this.commonService.singleDayAvlEnqDtls.ftBookingMsgFlag),
                                console.log('TA RDS FLAG: ' + this.travelAgFlag),
                                (this.shMsg.upiAgRdsFlag = 'true' == this.upiAgRdsFlag),
                                this.showMsg.emit(this.shMsg)),
                            2 == this.rdsflag &&
                                2 == this.taflag &&
                                !this.softPaymentDTO &&
                                this.bankArray)
                        )
                            for (const e of this.bankArray)
                                if (
                                    ((this.txnPasswordMandate = 'true' == e.txnPasswordMandatory),
                                    this.txnPasswordMandate)
                                )
                                    break
                        this.fetchPref && this.fetchPreferredBankList(),
                            console.log(
                                'asdf: ' + this.showPref + this.firstInput + this.firstInput1,
                            ),
                            Object(s.a)(300).subscribe(() => {
                                this.showPref &&
                                    null != this.firstInput &&
                                    this.firstInput.nativeElement.focus(),
                                    window.scrollTo(0, 0)
                            }),
                            (this.shMsg.showLoyalityMessage = !!this.commonService.accrualBooking),
                            this.showMsg.emit(this.shMsg),
                            this.msgsLowBalance.push({
                                severity: 'error',
                                detail: 'Note: Your current Loyalty Account Balance is not sufficient for this transaction.Kindly deposit amount in your Loyalty Account or you may continue booking with any other payment option.',
                            }),
                            null != this.bankList &&
                                this.bankList.length > 0 &&
                                null != this.bankList[this.paymentMode.EWALLET] &&
                                'false' === this.bankList[this.paymentMode.EWALLET][0].enableFlag &&
                                this.msgsDisableReason.push({
                                    severity: 'error',
                                    detail: this.bankList[this.paymentMode.EWALLET][0]
                                        .disableReason,
                                }),
                            this.userService.getObservable('showNlpCaptcha').subscribe((e) => {
                                this.showNlpCaptcha = e
                            })
                    }
                    ngAfterViewInit() {
                        window.scroll({ top: 0, left: 0, behavior: 'smooth' }),
                            Object(s.a)(300).subscribe(() => {
                                null != this.firstInput && this.firstInput.nativeElement.focus()
                            }),
                            this.bankList && this.onSelectPayMode(this.paymentMode.IRCTC_IPAY)
                    }
                    ngOnDestroy() {
                        this.jdSub.unsubscribe()
                    }
                    fetchPreferredBankList() {
                        this.paymentService.fetchPreferredBankList().subscribe((e) => {
                            if (
                                (console.log(JSON.stringify(e)),
                                (this.ts = e),
                                void 0 !== this.ts.bankDetailList)
                            ) {
                                if (
                                    ((this.error = false),
                                    null != this.ts.preferredbankList &&
                                        '' !== this.ts.preferredbankList.toString() &&
                                        this.ts.preferredbankList.length > 0)
                                ) {
                                    if (
                                        ((this.showPref = false),
                                        (this.preferredbankList = Array.isArray(
                                            this.ts.preferredbankList,
                                        )
                                            ? this.ts.preferredbankList
                                            : Array.of(this.ts.preferredbankList)),
                                        this.forEwallet)
                                    ) {
                                        let e = this.preferredbankList
                                        this.preferredbankList = []
                                        for (let t of e)
                                            ('Net Banking' != t.paymentModeName &&
                                                'Debit Card with PIN' != t.paymentModeName) ||
                                                this.preferredbankList.push(t)
                                    }
                                } else this.showPref = true
                                this.error = true
                            }
                        })
                    }
                    goBack() {
                        ;(this.commonService.reviewPage = true),
                            this.router.navigate(['booking/reviewBooking'], {
                                replaceUrl: true,
                            })
                    }
                    onSelectBankSoft(e) {
                        ;(null == e && null == e) ||
                            ((this.loyaltyBankName = e),
                            (this.selectedBnk = e),
                            this.messageService.add({
                                life: this.langService.life,
                                severity: 'info',
                                summary: this.langService.errorMsg.infoHeader,
                                detail: 'Redemption Not allowed',
                            }),
                            console.log('loyaltyBankName: ' + e))
                    }
                    setPreferredBankList() {
                        if (
                            (console.log(
                                'this.preferredbankList:::::  Called...' + this.preferedBankArray,
                            ),
                            void 0 !== this.preferedBankArray)
                        ) {
                            this.preferredbankList = new Array()
                            for (const e of this.preferedBankArray) {
                                console.log('this.preferredbankList:::::  Bank...' + e)
                                let t = new E()
                                ;(t.bankId = e.bankId),
                                    (t.bankName = e.bankName),
                                    (t.paymentMode = e.paymentMode),
                                    (t.message = e.message),
                                    (t.enableFlag = e.enableFlag),
                                    (t.offerMsg = e.offerMsg),
                                    (t.offerUrl = e.offerUrl),
                                    (t.disableReason = e.disableReason),
                                    (t.displaySection = e.displaySection),
                                    (t.txnPasswordMandatory = 'true' == e.txnPasswordMandatory),
                                    this.preferredbankList.push(t)
                            }
                            console.log('this.preferredbankList:::::  ' + this.preferredbankList),
                                this.preferredbankList.length > 0 && (this.showPref = true)
                        }
                    }
                    onSelectBank(e) {
                        if (null != e || null != e) {
                            ;(this.bankId = e), console.log('BankId: ' + e)
                            let t = this.paymentService.getBank(this.bankId)
                            this.message = t.message
                        }
                    }
                    paymentClicked() {
                        96 == this.bankId &&
                            ((this.paymentInitiated = true),
                            setTimeout(() => {
                                this.paymentInitiated = false
                            }, 3333)),
                            this.prefBank &&
                                !(null == this.bankId || null == this.bankId || this.bankId <= 0) &&
                                this.paymentService
                                    .savePreferredBankList(this.bankId.toString(), 'Y')
                                    .subscribe((e) => {
                                        console.log('resp: ' + JSON.stringify(e))
                                    })
                        let e = {
                            bankId: 99 === this.bankId ? 999 : this.bankId,
                            txnType: 1,
                            paramList: [],
                        }
                        console.log('Do Payment'), this.makePayment.emit(e)
                    }
                    paymentClicked1() {
                        let e = {
                            bankId: 96,
                            txnType: 1,
                            paramList: [
                                {
                                    key: 'virtualPaymentAddress',
                                    value: this.payForm.controls.virtualPaymentAddress.value,
                                },
                            ],
                        }
                        console.log('Do Payment'),
                            this.makePayment.emit(e),
                            this.router.navigate(['payment/hdfcpayment'])
                    }
                    ewalletPaymentClicked() {
                        const t = {
                            bankId: e.EWALLET_ID,
                            txnType: this.paymentMode.EWALLET,
                            paramList: [
                                {
                                    key: 'TXN_PASSWORD',
                                    value: this.txnPassword.value,
                                },
                            ],
                        }
                        console.log('Do Payment'), this.makePayment.emit(t)
                    }
                    rdsPaymentClicked() {
                        const t = {
                            bankId: e.AGENT_RDS_ID,
                            txnType: this.paymentMode.RDS,
                            paramList: [
                                {
                                    key: 'TXN_PASSWORD',
                                    value: this.txnPassword.value,
                                },
                            ],
                        }
                        console.log('Do Payment'), this.makePayment.emit(t)
                    }
                    keyboardInput(e) {
                        console.log(
                            e.key + ' & val = ' + e.keyCode + ' & Count =' + this.charCount,
                        ),
                            e.ctrlKey || 'Control' == e.key || 'ContextMenu' == e.key
                                ? (event.preventDefault(), event.stopPropagation())
                                : 'input' == e.target.localName &&
                                  'password' == e.target.type &&
                                  (this.charCount = this.charCount + 1)
                    }
                    loyaltyRedemptionClicked() {
                        if (this.charCount < 4)
                            return (
                                console.log(
                                    'Logged out because of char pressed is' + this.charCount,
                                ),
                                this.userService.logout(),
                                void this.router.navigate(['/logout'])
                            )
                        const e = {
                            bankId: this.softBankId,
                            txnType: x.SOFT_REDEMPTION,
                            loyaltyNum: this.loyaltynumber,
                            paramList: [
                                {
                                    key: 'TXN_PASSWORD',
                                    value: this.txnPassword.value,
                                },
                            ],
                        }
                        console.log('Do Loyalty Redemption'), this.makePayment.emit(e)
                    }
                    purchaseLoyaltyPoints() {
                        this.router.navigate(['/payment/purchase-loyalty'])
                    }
                    onTabChange(e) {
                        let t = 1
                        this.showPref && (t = 0),
                            e.index + t == 3
                                ? Object(s.a)(200).subscribe(() => {
                                      this.firstInput3.nativeElement.focus()
                                  })
                                : e.index + t == 10
                                  ? Object(s.a)(200).subscribe(() => {
                                        this.firstInput4.nativeElement.focus()
                                    })
                                  : e.index + t == 0
                                    ? Object(s.a)(200).subscribe(() => {
                                          this.firstInput.nativeElement.focus()
                                      })
                                    : e.index + t == 1
                                      ? Object(s.a)(200).subscribe(() => {
                                            this.firstInput1.nativeElement.focus()
                                        })
                                      : e.index + t == 2
                                        ? Object(s.a)(200).subscribe(() => {
                                              this.firstInput2.nativeElement.focus()
                                          })
                                        : e.index + t == 5
                                          ? Object(s.a)(200).subscribe(() => {
                                                this.firstInput5.nativeElement.focus()
                                            })
                                          : e.index + t == 6
                                            ? Object(s.a)(200).subscribe(() => {
                                                  this.firstInput6.nativeElement.focus()
                                              })
                                            : e.index + t == 7
                                              ? Object(s.a)(200).subscribe(() => {
                                                    this.firstInput7.nativeElement.focus()
                                                })
                                              : e.index + t == 8
                                                ? Object(s.a)(200).subscribe(() => {
                                                      this.firstInput8.nativeElement.focus()
                                                  })
                                                : e.index + t == 9
                                                  ? Object(s.a)(200).subscribe(() => {
                                                        this.firstInput9.nativeElement.focus()
                                                    })
                                                  : e.index + t == 10
                                                    ? Object(s.a)(200).subscribe(() => {
                                                          this.firstInput10.nativeElement.focus()
                                                      })
                                                    : (e.index + t == 3 || e.index + t == 12) &&
                                                      Object(s.a)(200).subscribe(() => {
                                                          this.firstInput11.nativeElement.focus()
                                                      })
                    }
                    addPreferred(e) {
                        console.log('e: ' + e.target.checked),
                            (this.prefBank = !!e.target.checked),
                            console.log(this.prefBank)
                    }
                    onFocusguardLast() {
                        this.lastInput.nativeElement.focus()
                    }
                    onSelectPayMode(e) {
                        console.log('Payment clicked is of type: ' + e), (this.selectedBankType = e)
                        let t = new Object()
                        ;(t.bank = this.bankList[e]),
                            (t.type = e),
                            (t.ewallet = this.ewallet),
                            this.store.dispatch(new r.c(t)),
                            (this.shMsg.dcp = e == this.paymentMode.DEBIT_CARD),
                            (this.shMsg.cc_dc = e == this.paymentMode.CREDIT_CARD),
                            this.showMsg.emit(this.shMsg)
                    }
                    showBank() {
                        null == this.selectedBankType ||
                        null == this.selectedBankType ||
                        '' == this.selectedBankType
                            ? this.messageService.add({
                                  life: this.langService.life,
                                  severity: 'info',
                                  summary: this.langService.errorMsg.infoHeader,
                                  detail: this.langService.errorMsg.paymentType,
                              })
                            : (this.showBankListMob = true)
                    }
                    bankSelection(e) {
                        this.bankId = e.bankId
                    }
                    payNow() {
                        null == this.selectedBankType ||
                        null == this.selectedBankType ||
                        '' == this.selectedBankType
                            ? this.messageService.add({
                                  life: this.langService.life,
                                  severity: 'info',
                                  summary: this.langService.errorMsg.infoHeader,
                                  detail: this.langService.errorMsg.paymentType,
                              })
                            : this.selectedBankType == this.paymentMode.EWALLET ||
                              (null != this.bankId && null != this.bankId) ||
                              this.messageService.add({
                                  life: this.langService.life,
                                  severity: 'info',
                                  summary: this.langService.errorMsg.infoHeader,
                                  detail: this.langService.errorMsg.paymentType,
                              }),
                            this.selectedBankType == this.paymentMode.EWALLET
                                ? this.ewalletPaymentClicked()
                                : 'rds' == this.selectedBankType
                                  ? this.rdsPaymentClicked()
                                  : 96 == this.bankId
                                    ? this.paymentClicked1()
                                    : this.paymentClicked()
                    }
                }
                return (
                    (e.EWALLET_ID = 1e3),
                    (e.AGENT_RDS_ID = 0),
                    (e.ɵfac = function (t) {
                        return new (t || e)(
                            o.Ub(g.c),
                            o.Ub(S.d),
                            o.Ub(A.a),
                            o.Ub(u.a),
                            o.Ub(b.a),
                            o.Ub(i.b),
                            o.Ub(V.a),
                            o.Ub(m.b),
                            o.Ub(f.d),
                            o.Ub(B.b),
                        )
                    }),
                    (e.ɵcmp = o.Ob({
                        type: e,
                        selectors: [['app-payment']],
                        viewQuery: function (e, t) {
                            var n
                            1 & e &&
                                (o.cd(Tt, true),
                                o.cd(Dt, true),
                                o.cd(Ct, true),
                                o.cd(It, true),
                                o.cd(Zt, true),
                                o.cd(wt, true),
                                o.cd(Pt, true),
                                o.cd(Mt, true),
                                o.cd(Rt, true),
                                o.cd(xt, true),
                                o.cd(Ot, true),
                                o.cd(Et, true),
                                o.cd(At, true),
                                o.cd(Vt, true),
                                o.cd(Bt, true)),
                                2 & e &&
                                    (o.Hc((n = o.jc())) && (t.firstInput = n.first),
                                    o.Hc((n = o.jc())) && (t.firstInput1 = n.first),
                                    o.Hc((n = o.jc())) && (t.firstInput2 = n.first),
                                    o.Hc((n = o.jc())) && (t.firstInput3 = n.first),
                                    o.Hc((n = o.jc())) && (t.firstInput4 = n.first),
                                    o.Hc((n = o.jc())) && (t.firstInput5 = n.first),
                                    o.Hc((n = o.jc())) && (t.firstInput6 = n.first),
                                    o.Hc((n = o.jc())) && (t.firstInput7 = n.first),
                                    o.Hc((n = o.jc())) && (t.firstInput8 = n.first),
                                    o.Hc((n = o.jc())) && (t.firstInput9 = n.first),
                                    o.Hc((n = o.jc())) && (t.firstInput10 = n.first),
                                    o.Hc((n = o.jc())) && (t.firstInput11 = n.first),
                                    o.Hc((n = o.jc())) && (t.firstInput12 = n.first),
                                    o.Hc((n = o.jc())) && (t.firstInput13 = n.first),
                                    o.Hc((n = o.jc())) && (t.lastInput = n.first))
                        },
                        hostBindings: function (e, t) {
                            1 & e &&
                                o.ic(
                                    'keydown',
                                    function (e) {
                                        return t.keyboardInput(e)
                                    },
                                    false,
                                    o.Jc,
                                )
                        },
                        inputs: {
                            bankArray: ['bankDetail', 'bankArray'],
                            preferedBankArray: ['preferedBankDetail', 'preferedBankArray'],
                            ewallet: 'ewallet',
                            softPaymentDTO: 'softPaymentDTO',
                            fetchPref: 'fetchPref',
                            softPaymentDTOs: 'softPaymentDTOs',
                            forEwallet: 'forEwallet',
                        },
                        outputs: {
                            makePayment: 'makePayment',
                            showMsg: 'showMsg',
                        },
                        decls: 19,
                        vars: 17,
                        consts: [
                            [1, ''],
                            [1, 'col-md-12', 2, 'padding', '0px'],
                            [3, 'formGroup'],
                            ['orientation', 'left', 4, 'ngIf'],
                            ['id', 'pay-type', 1, 'no-pad', 'col-sm-3', 'col-xs-12'],
                            [4, 'ngIf'],
                            ['class', 'col-pad col-sm-9 bank-box hidden-xs', 4, 'ngIf'],
                            [
                                'class',
                                'hidden-lg hidden-md hidden-sm',
                                3,
                                'visible',
                                'fullScreen',
                                'baseZIndex',
                                'visibleChange',
                                4,
                                'ngIf',
                            ],
                            [
                                'class',
                                'col-xs-12 hidden-lg hidden-md hidden-sm',
                                'position',
                                'bottom',
                                3,
                                'modal',
                                'visible',
                                'ngStyle',
                                4,
                                'ngIf',
                            ],
                            [
                                'position',
                                'bottom',
                                1,
                                'col-xs-12',
                                'hidden-lg',
                                'hidden-md',
                                'hidden-sm',
                                3,
                                'modal',
                                'visible',
                                'ngStyle',
                            ],
                            [1, 'text-center'],
                            ['class', 'pull-right', 'style', 'width: 99.9%;', 4, 'ngIf'],
                            [
                                'class',
                                'col-xs-push-2 col-xs-6 hidden-xs',
                                'id',
                                'bnkBtn',
                                'position',
                                'bottom',
                                3,
                                'modal',
                                'visible',
                                'ngStyle',
                                4,
                                'ngIf',
                            ],
                            ['class', 'row body_div text-center', 4, 'ngIf'],
                            ['orientation', 'left'],
                            ['header', 'Redeem Loyalty Points', 4, 'ngIf'],
                            ['header', 'Redeem Loyalty Points'],
                            ['class', 'col-pad col-xs-12 bank-text ', 4, 'ngIf'],
                            ['id', 'bank-type', 1, 'no-pad', 'col-xs-12', 2, 'overflow-y', 'auto'],
                            [4, 'ngFor', 'ngForOf'],
                            [1, 'col-pad', 'col-xs-12', 'bank-text'],
                            [1, 'col-xs-12', 'border-all', 2, 'width', '522px'],
                            ['oncontextmenu', 'return false', 4, 'ngIf'],
                            [4, 'ngIf', 'ngIfElse'],
                            ['insufficientBalance', ''],
                            ['style', 'text-align:center', 4, 'ngIf'],
                            ['inactiveLoyaltyRedemption', ''],
                            [3, 'enableService', 'value', 'closable', 'valueChange'],
                            [
                                2,
                                'color',
                                'rgb(231, 20, 20)',
                                'font-size',
                                '1.2rem',
                                'font-weight',
                                'bold',
                            ],
                            [2, 'text-align', 'center'],
                            [2, 'color', '#666', 'font-size', '1.4rem', 'font-weight', 'bold'],
                            ['style', 'font-size: 1.4rem; font-weight: bold;', 4, 'ngIf'],
                            [2, 'font-size', '1.4rem', 'font-weight', 'bold'],
                            [2, 'color', '#337ab7', 'cursor', 'hand', 3, 'click'],
                            [2, 'color', 'rgb(231, 20, 20)', 'font-size', '1.2rem'],
                            ['oncontextmenu', 'return false'],
                            [
                                'appLazyLoad',
                                '',
                                'rel',
                                'preload',
                                'appLazyLoad',
                                '',
                                'alt',
                                'Rail Icon',
                                1,
                                'bank-img',
                                3,
                                'src',
                            ],
                            [
                                2,
                                'color',
                                'rgb(15, 15, 15)',
                                'font-size',
                                '1.8rem',
                                'font-weight',
                                'bold',
                            ],
                            ['style', 'font-size: 2.0rem; font-weight: bold;', 4, 'ngIf'],
                            [
                                'type',
                                'password',
                                'formControlName',
                                'txnPassword',
                                'autocomplete',
                                'off',
                            ],
                            [1, 'pay_tax_text'],
                            ['type', 'button', 1, 'btn', 'btn-primary', 3, 'disabled', 'click'],
                            [2, 'font-size', '2.0rem', 'font-weight', 'bold'],
                            [2, 'padding-bottom', '6px'],
                            ['tabindex', '0', 3, 'click', 'keyDown.Enter'],
                            ['class', 'fa fa-check-circle col-xs-push-11 bank-checked', 4, 'ngIf'],
                            [1, 'col-pad'],
                            [1, 'fa', 'fa-check-circle', 'col-xs-push-11', 'bank-checked'],
                            [3, 'header', 4, 'ngIf'],
                            [3, 'header'],
                            ['tabindex', '0', 1, 'focusguard'],
                            [1, 'scroller'],
                            ['class', 'col-md-12', 'tabindex', '0', 3, 'keyDown.Enter', 4, 'ngIf'],
                            [1, 'form-group', 'text-center'],
                            ['type', 'button', 1, 'btn_continue', 3, 'disabled', 'click'],
                            ['id', 'focusguardLast', 'tabindex', '0', 1, 'focusguard', 3, 'focus'],
                            ['tabindex', '0', 1, 'col-md-12', 3, 'keyDown.Enter'],
                            [1, 'payment_box'],
                            [1, 'form-group', 'form-inline'],
                            ['for', 'txnPassword'],
                            [
                                'type',
                                'password',
                                'formControlName',
                                'txnPassword',
                                'tabindex',
                                '0',
                                1,
                                'form-control',
                            ],
                            ['tabindex', '0', 3, 'class', 'click', 4, 'ngIf'],
                            ['tabindex', '0', 3, 'class', 'click', 'keydown.Enter', 4, 'ngIf'],
                            ['tabindex', '0', 3, 'click'],
                            ['firstInput', ''],
                            [
                                'appLazyLoad',
                                '',
                                'rel',
                                'preload',
                                'appLazyLoad',
                                '',
                                'src',
                                './assets/images/Irctc Wallet.PNG',
                                'alt',
                                'Rail Icon',
                                1,
                                'bank-img',
                            ],
                            [
                                'appLazyLoad',
                                '',
                                'rel',
                                'preload',
                                'appLazyLoad',
                                '',
                                'src',
                                './assets/images/IrctcEWallet.png',
                                'alt',
                                'Rail Icon',
                                1,
                                'bank-img',
                            ],
                            [
                                'appLazyLoad',
                                '',
                                'rel',
                                'preload',
                                'appLazyLoad',
                                '',
                                'src',
                                './assets/images/multiplepaymenticon.png',
                                'alt',
                                'Rail Icon',
                                1,
                                'bank-img',
                            ],
                            [
                                'appLazyLoad',
                                '',
                                'rel',
                                'preload',
                                'appLazyLoad',
                                '',
                                'src',
                                './assets/images/qrcodeicon.png',
                                'alt',
                                'Rail Icon',
                                1,
                                'bank-img',
                            ],
                            [
                                'appLazyLoad',
                                '',
                                'rel',
                                'preload',
                                'appLazyLoad',
                                '',
                                'src',
                                './assets/images/Netbankingicon.png',
                                'alt',
                                'Rail Icon',
                                1,
                                'bank-img',
                            ],
                            [
                                'appLazyLoad',
                                '',
                                'rel',
                                'preload',
                                'appLazyLoad',
                                '',
                                'src',
                                './assets/images/creditcardicon.png',
                                'alt',
                                'Rail Icon',
                                1,
                                'bank-img',
                            ],
                            [
                                'appLazyLoad',
                                '',
                                'rel',
                                'preload',
                                'appLazyLoad',
                                '',
                                'src',
                                './assets/images/paylatericon.png',
                                'alt',
                                'Rail Icon',
                                1,
                                'bank-img',
                            ],
                            [
                                'appLazyLoad',
                                '',
                                'rel',
                                'preload',
                                'appLazyLoad',
                                '',
                                'src',
                                './assets/images/wallaeticon.png',
                                'alt',
                                'Rail Icon',
                                1,
                                'bank-img',
                            ],
                            [
                                'appLazyLoad',
                                '',
                                'rel',
                                'preload',
                                'appLazyLoad',
                                '',
                                'src',
                                './assets/images/Irctc Prepaid.PNG',
                                'alt',
                                'Rail Icon',
                                1,
                                'bank-img',
                            ],
                            [
                                'appLazyLoad',
                                '',
                                'rel',
                                'preload',
                                'appLazyLoad',
                                '',
                                'src',
                                './assets/images/ic_launcher_xxxxx.png',
                                'alt',
                                'Rail Icon',
                                1,
                                'bank-img',
                            ],
                            ['tabindex', '0', 3, 'click', 'keydown.Enter'],
                            [
                                'appLazyLoad',
                                '',
                                'rel',
                                'preload',
                                'appLazyLoad',
                                '',
                                'src',
                                './assets/images/emi.png',
                                'alt',
                                'Rail Icon',
                                1,
                                'bank-img',
                            ],
                            [1, 'col-pad', 'col-sm-9', 'bank-box', 'hidden-xs'],
                            [3, 'payForm', 'bankSelection'],
                            [
                                1,
                                'hidden-lg',
                                'hidden-md',
                                'hidden-sm',
                                3,
                                'visible',
                                'fullScreen',
                                'baseZIndex',
                                'visibleChange',
                            ],
                            [1, 'filter-div'],
                            [2, 'height', '92vh', 'overflow-y', 'scroll', 'padding-bottom', '10vh'],
                            [1, 'bank-top-header'],
                            [1, 'top-header-content', 'col-xs-12'],
                            [
                                1,
                                'fa',
                                'fa-long-arrow-left',
                                2,
                                'width',
                                '10%',
                                'margin-top',
                                '12px',
                                3,
                                'click',
                            ],
                            [1, 'pull-right', 2, 'width', '90%'],
                            ['class', 't_2', 'style', 'color: #fff;', 4, 'ngIf'],
                            [2, 'padding-top', '10px'],
                            [1, 'text-center', 'bottom-btn'],
                            ['class', 'pull-left', 'style', 'width: 49.9%;', 4, 'ngIf'],
                            [1, 'pull-right', 2, 'width', '49.9%'],
                            [
                                'type',
                                'button',
                                1,
                                'mob-bot-btn',
                                'search_btn',
                                2,
                                'background',
                                '#fb792b',
                                3,
                                'click',
                            ],
                            [1, 't_2', 2, 'color', '#fff'],
                            [1, 'pull-left', 2, 'width', '49.9%'],
                            ['type', 'button', 1, 'mob-bot-btn', 'search_btn'],
                            ['style', 'width: 90%;', 'class', 'pull-right', 4, 'ngIf'],
                            [1, 'pull-right', 2, 'width', '99.9%'],
                            [
                                'id',
                                'bnkBtn',
                                'position',
                                'bottom',
                                1,
                                'col-xs-push-2',
                                'col-xs-6',
                                'hidden-xs',
                                3,
                                'modal',
                                'visible',
                                'ngStyle',
                            ],
                            [1, 'row', 'body_div', 'text-center'],
                            [
                                'type',
                                'button',
                                'value',
                                'Back',
                                1,
                                'btnDefault',
                                2,
                                'margin',
                                '5px',
                                'padding',
                                '6px 60px',
                                'font-weight',
                                'bold',
                                3,
                                'click',
                            ],
                            [
                                'type',
                                'button',
                                'class',
                                'btn btn-primary hidden-xs',
                                'style',
                                'margin: 5px; padding: 6px 60px; font-weight: bold; font-size: 17px;',
                                3,
                                'click',
                                4,
                                'ngIf',
                            ],
                            [
                                'type',
                                'button',
                                1,
                                'btn',
                                'btn-primary',
                                'hidden-xs',
                                2,
                                'margin',
                                '5px',
                                'padding',
                                '6px 60px',
                                'font-weight',
                                'bold',
                                'font-size',
                                '17px',
                                3,
                                'click',
                            ],
                        ],
                        template: function (e, t) {
                            1 & e &&
                                (o.Vb(0, 'p-toast'),
                                o.ac(1, 'div', 0),
                                o.ac(2, 'div', 1),
                                o.ac(3, 'form', 2),
                                o.Rc(4, Jt, 2, 1, 'p-tabView', 3),
                                o.Rc(5, en, 2, 1, 'p-tabView', 3),
                                o.ac(6, 'div', 4),
                                o.Rc(7, hn, 15, 14, 'span', 5),
                                o.Zb(),
                                o.Rc(8, fn, 2, 1, 'div', 6),
                                o.Rc(9, Sn, 18, 8, 'p-sidebar', 7),
                                o.Rc(10, Dn, 6, 6, 'p-sidebar', 8),
                                o.Rc(11, In, 13, 6, 'p-sidebar', 7),
                                o.ac(12, 'p-sidebar', 9),
                                o.ac(13, 'div', 10),
                                o.Rc(14, Zn, 3, 1, 'div', 11),
                                o.Zb(),
                                o.Zb(),
                                o.Rc(15, wn, 5, 5, 'p-sidebar', 12),
                                o.Rc(16, Pn, 25, 24, 'p-sidebar', 7),
                                o.Rc(17, Mn, 9, 9, 'p-sidebar', 8),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Rc(18, xn, 4, 1, 'div', 13)),
                                2 & e &&
                                    (o.Cb(3),
                                    o.tc('formGroup', t.payForm),
                                    o.Cb(1),
                                    o.tc('ngIf', t.softPaymentDTO),
                                    o.Cb(1),
                                    o.tc(
                                        'ngIf',
                                        2 == t.rdsflag &&
                                            'true' == t.travelAgFlag &&
                                            'false' == t.upiAgRdsFlag,
                                    ),
                                    o.Cb(2),
                                    o.tc('ngIf', t.bankList),
                                    o.Cb(1),
                                    o.tc(
                                        'ngIf',
                                        null != t.selectedBankType && null != t.selectedBankType,
                                    ),
                                    o.Cb(1),
                                    o.tc(
                                        'ngIf',
                                        null != t.selectedBankType &&
                                            null != t.selectedBankType &&
                                            !t.forEwallet &&
                                            !t.softPaymentDTO,
                                    ),
                                    o.Cb(1),
                                    o.tc('ngIf', !t.softPaymentDTO),
                                    o.Cb(1),
                                    o.tc(
                                        'ngIf',
                                        null != t.selectedBankType &&
                                            null != t.selectedBankType &&
                                            t.forEwallet &&
                                            !t.softPaymentDTO,
                                    ),
                                    o.Cb(1),
                                    o.tc('modal', false)('visible', true)('ngStyle', o.yc(16, Tn)),
                                    o.Cb(2),
                                    o.tc('ngIf', t.forEwallet),
                                    o.Cb(1),
                                    o.tc(
                                        'ngIf',
                                        null != t.selectedBankType &&
                                            null != t.selectedBankType &&
                                            t.forEwallet,
                                    ),
                                    o.Cb(1),
                                    o.tc(
                                        'ngIf',
                                        null != t.selectedBankType &&
                                            t.softPaymentDTO &&
                                            'false' == t.softPaymentDTO.activatedFlag,
                                    ),
                                    o.Cb(1),
                                    o.tc(
                                        'ngIf',
                                        null != t.selectedBankType &&
                                            t.softPaymentDTO &&
                                            'false' == t.softPaymentDTO.activatedFlag,
                                    ),
                                    o.Cb(1),
                                    o.tc('ngIf', !t.forEwallet))
                        },
                        directives: [
                            v.a,
                            S.z,
                            S.o,
                            S.i,
                            d.o,
                            L.a,
                            d.p,
                            a.b,
                            a.a,
                            d.n,
                            N.a,
                            S.b,
                            S.n,
                            S.g,
                            St,
                        ],
                        pipes: [kt.a, d.f, d.g],
                        encapsulation: 2,
                    })),
                    e
                )
            })()
            var En = n('lZMd'),
                An = n('kyvP'),
                Vn = n('Nf9I'),
                Bn = n('jIHw'),
                Ln = n('qxh7'),
                Nn = n('2hp+'),
                Un = n('RDwO'),
                Fn = n('xRjm')
            function _n(e, t) {
                if ((1 & e && (o.ac(0, 'span', 14), o.Tc(1), o.Zb()), 2 & e)) {
                    const e = o.mc(2)
                    o.Cb(1),
                        o.Wc(
                            ' ',
                            e.journeyDetails.adultCount,
                            ' ',
                            null == e.langService.lang ? null : e.langService.lang.adult,
                            ' ',
                        )
                }
            }
            function Kn(e, t) {
                if ((1 & e && (o.ac(0, 'span', 14), o.Tc(1), o.Zb()), 2 & e)) {
                    const e = o.mc(2)
                    o.Cb(1),
                        o.Wc(
                            ' ',
                            e.journeyDetails.childCount,
                            ' ',
                            null == e.langService.lang ? null : e.langService.lang.child,
                            ' ',
                        )
                }
            }
            function jn(e, t) {
                if (
                    (1 & e && (o.ac(0, 'span', 14), o.Tc(1), o.nc(2, 'stationName'), o.Zb()), 2 & e)
                ) {
                    const e = o.mc(2)
                    o.Cb(1),
                        o.Vc(
                            ' | ',
                            o.qc(
                                2,
                                1,
                                e.journeyDetails.boardingStation,
                                '',
                                e.langService.langChoice,
                            ),
                            '',
                        )
                }
            }
            function zn(e, t) {
                if (
                    (1 & e && (o.ac(0, 'span', 14), o.Tc(1), o.nc(2, 'stationName'), o.Zb()), 2 & e)
                ) {
                    const e = o.mc().$implicit,
                        t = o.mc()
                    o.Cb(1), o.Vc(' | ', o.qc(2, 1, e.brdStnCode, '', t.langService.langChoice), '')
                }
            }
            function qn(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div', 3),
                        o.ac(1, 'span', 4),
                        o.ac(2, 'strong'),
                        o.Tc(3),
                        o.Zb(),
                        o.Tc(4),
                        o.nc(5, 'genderName'),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = t.$implicit,
                        n = t.index
                    o.Cb(3),
                        o.Wc('', n + 1, '. ', null == e ? null : e.passengerName, ' '),
                        o.Cb(1),
                        o.Wc(
                            ' ',
                            null == e ? null : e.passengerAge,
                            ' yrs | ',
                            o.oc(5, 4, null == e ? null : e.passengerGender),
                            ' ',
                        )
                }
            }
            function Hn(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div'),
                        o.ac(1, 'div', 3),
                        o.ac(2, 'span', 4),
                        o.ac(3, 'span', 5),
                        o.ac(4, 'strong'),
                        o.Tc(5),
                        o.Zb(),
                        o.Zb(),
                        o.ac(6, 'span', 6),
                        o.Tc(7),
                        o.Zb(),
                        o.Zb(),
                        o.ac(8, 'span', 7),
                        o.Tc(9),
                        o.nc(10, 'date'),
                        o.Zb(),
                        o.Zb(),
                        o.ac(11, 'div', 8),
                        o.ac(12, 'strong'),
                        o.ac(13, 'span', 4),
                        o.Tc(14),
                        o.nc(15, 'stationName'),
                        o.Zb(),
                        o.ac(16, 'span', 7),
                        o.Tc(17),
                        o.nc(18, 'stationName'),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.ac(19, 'div', 9),
                        o.Vb(20, 'span', 10),
                        o.Zb(),
                        o.ac(21, 'div', 8),
                        o.ac(22, 'span', 4),
                        o.Tc(23),
                        o.nc(24, 'date'),
                        o.Zb(),
                        o.ac(25, 'span', 7),
                        o.Tc(26),
                        o.nc(27, 'date'),
                        o.Zb(),
                        o.Zb(),
                        o.ac(28, 'div', 11),
                        o.ac(29, 'span', 12),
                        o.ac(30, 'strong'),
                        o.Rc(31, _n, 2, 2, 'span', 13),
                        o.Rc(32, Kn, 2, 2, 'span', 13),
                        o.Tc(33, ' | '),
                        o.ac(34, 'span', 14),
                        o.Tc(35),
                        o.nc(36, 'className'),
                        o.Zb(),
                        o.ac(37, 'span', 14),
                        o.Tc(38),
                        o.nc(39, 'quotaName'),
                        o.Zb(),
                        o.Rc(40, jn, 3, 5, 'span', 13),
                        o.Rc(41, zn, 3, 5, 'span', 13),
                        o.ac(42, 'span', 14),
                        o.Tc(43),
                        o.nc(44, 'date'),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.ac(45, 'div', 3),
                        o.ac(46, 'span', 4),
                        o.ac(47, 'strong'),
                        o.Tc(48),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Rc(49, qn, 6, 6, 'div', 15),
                        o.Vb(50, 'div', 16),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = t.$implicit,
                        n = t.index,
                        a = o.mc()
                    o.Cb(5),
                        o.Uc(e.avlDetails.trainName),
                        o.Cb(2),
                        o.Vc('(', e.avlDetails.trainNo, ')'),
                        o.Cb(2),
                        o.Uc(o.pc(10, 20, e.avlDetails.journeyDate, 'EEE, dd MMM')),
                        o.Cb(5),
                        o.Uc(o.qc(15, 23, e.avlDetails.from, '', a.langService.langChoice)),
                        o.Cb(3),
                        o.Uc(o.qc(18, 27, e.avlDetails.to, '', a.langService.langChoice)),
                        o.Cb(6),
                        o.Wc(
                            '',
                            e.avlDetails.from,
                            ' (',
                            o.pc(24, 31, e.avlDetails.journeyDate, 'HH:mm'),
                            ')',
                        ),
                        o.Cb(3),
                        o.Wc(
                            '',
                            e.avlDetails.to,
                            ' (',
                            o.pc(27, 34, e.avlDetails.arivalDate, 'HH:mm'),
                            ')',
                        ),
                        o.Cb(5),
                        o.tc('ngIf', a.journeyDetails.adultCount > 0),
                        o.Cb(1),
                        o.tc('ngIf', a.journeyDetails.childCount > 0),
                        o.Cb(3),
                        o.Vc(
                            '',
                            o.pc(36, 37, e.avlDetails.enqClass, a.langService.langChoice),
                            ' ',
                        ),
                        o.Cb(3),
                        o.Vc(' | ', o.pc(39, 40, e.journeyQuota, a.langService.langChoice), ''),
                        o.Cb(2),
                        o.tc('ngIf', 0 == n),
                        o.Cb(1),
                        o.tc('ngIf', 0 != n),
                        o.Cb(2),
                        o.Xc(
                            ' | ',
                            null == a.langService.lang ? null : a.langService.lang.boardingDate,
                            ': ',
                            o.pc(44, 43, a.boardingStation.boardingDate, 'dd MMM yyyy'),
                            ' ',
                            a.boardingStation.departureTime,
                            '',
                        ),
                        o.Cb(5),
                        o.Uc(
                            null == a.langService.lang ? null : a.langService.lang.passengerDetails,
                        ),
                        o.Cb(1),
                        o.tc('ngForOf', a.journeyDetails.adult[n])
                }
            }
            let $n = (() => {
                class e {
                    constructor(e, t) {
                        ;(this.langService = e), (this.store = t)
                    }
                    ngOnInit() {
                        this.jdSub = this.store.select(c.h).subscribe((e) => {
                            ;(this.journeyDetails = e),
                                e.boardingData.boardingStationList.forEach((t) => {
                                    null == this.boardingStation &&
                                        e.boardingStation == t.stnNameCode.split('-')[1].trim() &&
                                        (this.boardingStation = t)
                                })
                        })
                    }
                    ngOnDestroy() {
                        this.jdSub.unsubscribe()
                    }
                }
                return (
                    (e.ɵfac = function (t) {
                        return new (t || e)(o.Ub(b.a), o.Ub(m.b))
                    }),
                    (e.ɵcmp = o.Ob({
                        type: e,
                        selectors: [['app-journey-details']],
                        decls: 16,
                        vars: 15,
                        consts: [
                            [1, 'col-xs-12', 'border-all', 2, 'padding', '0px'],
                            [1, 'col-xs-12', 'line-def', 'top-header', 2, 'position', 'relative'],
                            [4, 'ngFor', 'ngForOf'],
                            [1, 'col-xs-12', 'line-def'],
                            [1, 'pull-left'],
                            [1, ''],
                            [1, 'dull'],
                            [1, 'pull-right'],
                            [1, 'col-xs-12'],
                            [1, 'col-xs-12', 'text-center'],
                            [
                                1,
                                'fa',
                                'fa-long-arrow-right',
                                2,
                                'position',
                                'absolute',
                                'top',
                                '-6px',
                            ],
                            [1, 'line-def', 'col-xs-12', 'text-center', 'remove-padding'],
                            [1, 'dull-back', 2, 'padding', '5px'],
                            ['style', 'padding: 2px 0px;', 4, 'ngIf'],
                            [2, 'padding', '2px 0px'],
                            ['class', 'col-xs-12 line-def', 4, 'ngFor', 'ngForOf'],
                            [
                                1,
                                'col-xs-12',
                                2,
                                'padding-left',
                                '0',
                                'padding-right',
                                '0',
                                'border-top',
                                '1px solid #c8c8c8',
                            ],
                        ],
                        template: function (e, t) {
                            1 & e &&
                                (o.ac(0, 'div', 0),
                                o.ac(1, 'div', 1),
                                o.Tc(2),
                                o.Zb(),
                                o.Rc(3, Hn, 51, 46, 'div', 2),
                                o.ac(4, 'div', 3),
                                o.ac(5, 'span', 4),
                                o.ac(6, 'strong'),
                                o.Tc(7),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.ac(8, 'div', 3),
                                o.ac(9, 'span', 4),
                                o.Tc(10),
                                o.nc(11, 'mask'),
                                o.Zb(),
                                o.Vb(12, 'br'),
                                o.ac(13, 'span', 4),
                                o.Tc(14),
                                o.nc(15, 'mask'),
                                o.Zb(),
                                o.Zb(),
                                o.Zb()),
                                2 & e &&
                                    (o.Cb(2),
                                    o.Vc(
                                        ' ',
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.journeySum,
                                        ' ',
                                    ),
                                    o.Cb(1),
                                    o.tc('ngForOf', t.journeyDetails.lapDetails),
                                    o.Cb(4),
                                    o.Uc(
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.contactDetails,
                                    ),
                                    o.Cb(3),
                                    o.Wc(
                                        '',
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.email,
                                        ': ',
                                        o.qc(
                                            11,
                                            7,
                                            t.journeyDetails.emailId,
                                            2,
                                            t.journeyDetails.emailId.indexOf('@'),
                                        ),
                                        '',
                                    ),
                                    o.Cb(4),
                                    o.Wc(
                                        '',
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.mobile,
                                        ': ',
                                        o.qc(
                                            15,
                                            11,
                                            t.journeyDetails.mobileNumber,
                                            4,
                                            t.journeyDetails.mobileNumber.length - 2,
                                        ),
                                        '',
                                    ))
                        },
                        directives: [d.n, d.o],
                        pipes: [Ln.a, d.f, kt.a, Nn.a, Un.a, Fn.a],
                        styles: [''],
                    })),
                    e
                )
            })()
            var Wn = n('nnEn'),
                Yn = n('7CaW'),
                Gn = n('5XMG')
            function Jn(e, t) {
                if (
                    (1 & e &&
                        (o.Vb(0, 'div', 37),
                        o.ac(1, 'div', 38),
                        o.ac(2, 'div', 39),
                        o.Tc(3),
                        o.Zb(),
                        o.Vb(4, 'div', 40),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = t.$implicit
                    o.Cb(3), o.Uc(e.summary), o.Cb(1), o.tc('innerHTML', e.detail, o.Lc)
                }
            }
            function Xn(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'ol', 51),
                        o.ac(1, 'li'),
                        o.Tc(2),
                        o.ac(3, 'span'),
                        o.Tc(4),
                        o.Zb(),
                        o.Tc(5),
                        o.ac(6, 'span'),
                        o.ac(7, 'a', 45),
                        o.Tc(8),
                        o.Zb(),
                        o.Zb(),
                        o.Tc(9),
                        o.Zb(),
                        o.ac(10, 'li'),
                        o.Tc(11),
                        o.ac(12, 'span'),
                        o.Tc(13),
                        o.Zb(),
                        o.Tc(14),
                        o.Zb(),
                        o.ac(15, 'li'),
                        o.Tc(16),
                        o.ac(17, 'span'),
                        o.Tc(18),
                        o.Zb(),
                        o.Tc(19),
                        o.ac(20, 'span'),
                        o.Tc(21),
                        o.Zb(),
                        o.Tc(22),
                        o.ac(23, 'span'),
                        o.Tc(24),
                        o.Zb(),
                        o.Tc(25),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(3)
                    o.Cb(2),
                        o.Vc(
                            '',
                            null == e.langService.lang ? null : e.langService.lang.message1,
                            ' ',
                        ),
                        o.Cb(2),
                        o.Uc(null == e.langService.lang ? null : e.langService.lang.message2),
                        o.Cb(1),
                        o.Vc(
                            '',
                            null == e.langService.lang ? null : e.langService.lang.message3,
                            ' ',
                        ),
                        o.Cb(3),
                        o.Uc(null == e.langService.lang ? null : e.langService.lang.message4),
                        o.Cb(1),
                        o.Vc(
                            ' ',
                            null == e.langService.lang ? null : e.langService.lang.message5,
                            '',
                        ),
                        o.Cb(2),
                        o.Vc(
                            '',
                            null == e.langService.lang ? null : e.langService.lang.message6,
                            ' ',
                        ),
                        o.Cb(2),
                        o.Vc(
                            "'",
                            null == e.langService.lang ? null : e.langService.lang.message7,
                            "'",
                        ),
                        o.Cb(1),
                        o.Vc(
                            ' ',
                            null == e.langService.lang ? null : e.langService.lang.message7,
                            '',
                        ),
                        o.Cb(2),
                        o.Vc(
                            '',
                            null == e.langService.lang ? null : e.langService.lang.message9,
                            ' ',
                        ),
                        o.Cb(2),
                        o.Vc(
                            "'",
                            null == e.langService.lang ? null : e.langService.lang.message10,
                            "'",
                        ),
                        o.Cb(1),
                        o.Vc(
                            ' ',
                            null == e.langService.lang ? null : e.langService.lang.message11,
                            ' ',
                        ),
                        o.Cb(2),
                        o.Vc(
                            "'",
                            null == e.langService.lang ? null : e.langService.lang.message21,
                            "'",
                        ),
                        o.Cb(1),
                        o.Vc(
                            ' ',
                            null == e.langService.lang ? null : e.langService.lang.message22,
                            ' ',
                        ),
                        o.Cb(2),
                        o.Vc(
                            "'",
                            null == e.langService.lang ? null : e.langService.lang.message12,
                            "'",
                        ),
                        o.Cb(1),
                        o.Vc(
                            ' ',
                            null == e.langService.lang ? null : e.langService.lang.message13,
                            ' ',
                        )
                }
            }
            function Qn(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'ol', 51),
                        o.ac(1, 'li'),
                        o.Tc(2),
                        o.ac(3, 'span'),
                        o.Tc(4),
                        o.Zb(),
                        o.Tc(5, ').'),
                        o.Zb(),
                        o.ac(6, 'li'),
                        o.Tc(7),
                        o.ac(8, 'span'),
                        o.Tc(9),
                        o.Zb(),
                        o.Tc(10, '.'),
                        o.Zb(),
                        o.ac(11, 'li'),
                        o.Tc(12),
                        o.ac(13, 'span'),
                        o.Tc(14),
                        o.Zb(),
                        o.Tc(15, '.'),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(3)
                    o.Cb(2),
                        o.Vc(
                            '',
                            null == e.langService.lang ? null : e.langService.lang.message23,
                            ' ',
                        ),
                        o.Cb(2),
                        o.Uc(null == e.langService.lang ? null : e.langService.lang.message24),
                        o.Cb(3),
                        o.Vc(
                            '',
                            null == e.langService.lang ? null : e.langService.lang.message25,
                            ' ',
                        ),
                        o.Cb(2),
                        o.Vc(
                            "'",
                            null == e.langService.lang ? null : e.langService.lang.message26,
                            "'",
                        ),
                        o.Cb(3),
                        o.Vc(
                            '',
                            null == e.langService.lang ? null : e.langService.lang.message27,
                            ' ',
                        ),
                        o.Cb(2),
                        o.Vc(
                            "'",
                            null == e.langService.lang ? null : e.langService.lang.message28,
                            "'",
                        )
                }
            }
            function ea(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div', 49),
                        o.Rc(1, Xn, 26, 15, 'ol', 50),
                        o.Rc(2, Qn, 16, 6, 'ol', 50),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(2)
                    o.Cb(1), o.tc('ngIf', e.shMsg.cc_dc), o.Cb(1), o.tc('ngIf', e.shMsg.dcp)
                }
            }
            function ta(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div', 52),
                        o.ac(1, 'ol', 51),
                        o.ac(2, 'li'),
                        o.Tc(3),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(2)
                    o.Cb(3),
                        o.Uc(
                            null == e.langService.errorMsg
                                ? null
                                : e.langService.errorMsg.loyalityMessageInfo,
                        )
                }
            }
            function na(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div', 52),
                        o.ac(1, 'ol', 51),
                        o.ac(2, 'li'),
                        o.Tc(3),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(2)
                    o.Cb(3),
                        o.Uc(null == e.langService.lang ? null : e.langService.lang.rdsUpiMessage)
                }
            }
            function aa(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div', 41),
                        o.Rc(1, ea, 3, 2, 'div', 42),
                        o.Vb(2, 'div', 43),
                        o.ac(3, 'div', 25),
                        o.ac(4, 'span', 44),
                        o.Tc(5),
                        o.Zb(),
                        o.ac(6, 'a', 45),
                        o.ac(7, 'span', 46),
                        o.Vb(8, 'img', 47),
                        o.Tc(9),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Rc(10, ta, 4, 1, 'div', 48),
                        o.Rc(11, na, 4, 1, 'div', 48),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc()
                    o.Cb(1),
                        o.tc('ngIf', e.shMsg.cc_dc || e.shMsg.dcp),
                        o.Cb(4),
                        o.Uc(null == e.langService.lang ? null : e.langService.lang.payMethod),
                        o.Cb(4),
                        o.Vc(
                            ' ',
                            null == e.langService.lang ? null : e.langService.lang.securePayment,
                            '',
                        ),
                        o.Cb(1),
                        o.tc('ngIf', e.shMsg.showLoyalityMessage),
                        o.Cb(1),
                        o.tc('ngIf', e.shMsg.upiAgRdsFlag)
                }
            }
            function ia(e, t) {
                if ((1 & e && (o.ac(0, 'span'), o.Tc(1), o.Zb()), 2 & e)) {
                    const e = o.mc().$implicit
                    o.Cb(1), o.Vc(' Train ', e.trainNo, '')
                }
            }
            function ca(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div', 55),
                        o.ac(1, 'p-panel', 56),
                        o.ac(2, 'p-header', 57),
                        o.ac(3, 'div', 58),
                        o.ac(4, 'span', 59),
                        o.Tc(5),
                        o.nc(6, 'titlecase'),
                        o.Rc(7, ia, 2, 1, 'span', 60),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Vb(8, 'app-meal-opted', 61),
                        o.Zb(),
                        o.Vb(9, 'div', 62),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = t.$implicit,
                        n = o.mc(2)
                    o.Cb(1),
                        o.tc('toggleable', n.journeyDetails.multilapBooking),
                        o.Cb(4),
                        o.Vc(
                            ' ',
                            o.oc(
                                6,
                                6,
                                null == n.langService.lang ? null : n.langService.lang.mealOpted,
                            ),
                            ' ',
                        ),
                        o.Cb(2),
                        o.tc('ngIf', n.journeyDetails.multilapBooking),
                        o.Cb(1),
                        o.tc('selectedMeal', e.mealDtlsArr)('totalAmount', e.totalAmount)(
                            'multiLap',
                            n.journeyDetails.multilapBooking,
                        )
                }
            }
            function sa(e, t) {
                if ((1 & e && (o.ac(0, 'div', 53), o.Rc(1, ca, 10, 8, 'div', 54), o.Zb()), 2 & e)) {
                    const e = o.mc()
                    o.Cb(1), o.tc('ngForOf', e.mealDtlsArr)
                }
            }
            let la = (() => {
                class e {
                    constructor(e, t, n, a, i, c, s, l, r, o, g, d) {
                        ;(this.router = e),
                            (this.userService = t),
                            (this.langService = n),
                            (this.commonService = a),
                            (this.store = i),
                            (this.bookingService = c),
                            (this.paymentService = s),
                            (this.localStorage = l),
                            (this.confirmationService = r),
                            (this.location = o),
                            (this.messageService = g),
                            (this._location = d),
                            (this.fareSummarySidebar = false),
                            (this.paymentMode = new x()),
                            (this.userResponse = null),
                            (this.shMsg = {
                                cc_dc: false,
                                dcp: false,
                                showLoyalityMessage: false,
                                upiAgRdsFlag: false,
                            }),
                            (this.msg = false),
                            (this.showMealDetails = false),
                            (this.totalAmount = 0),
                            (this.adIdPOT = 'div-gpt-ad-1548235931568-0'),
                            (this.adIdPOB = 'div-gpt-ad-1548236647378-0'),
                            (this.adIdPORB = 'div-gpt-ad-1548236172382-0'),
                            (this.adIdPOT = this.userService.getAdsRandomId()),
                            (this.adIdPOB = this.userService.getAdsRandomId()),
                            (this.adIdPORB = this.userService.getAdsRandomId())
                    }
                    ngOnInit() {
                        this.store.select(c.h).subscribe((e) => {
                            null != e && (this.journeyDetails = e)
                        }),
                            this.commonService.bankErrorFlag &&
                                ((this.journeyDetails = this.localStorage.get('journeyDetails')),
                                (this.journeyDetails = JSON.parse(
                                    JSON.stringify(this.journeyDetails),
                                )),
                                this.localStorage.remove('journeyDetails'),
                                (this.commonService.singleDayAvlEnqDtls =
                                    this.localStorage.get('singleDayAvlEnqDtls')),
                                this.localStorage.remove('singleDayAvlEnqDtls'),
                                (this.commonService.bankErrorFlag = false)),
                            this.store.dispatch(new r.j(this.journeyDetails)),
                            (this.singleDayAvlEnqDtls = this.commonService.singleDayAvlEnqDtls),
                            this.localStorage.set(
                                'singleDayAvlEnqDtls',
                                this.commonService.singleDayAvlEnqDtls,
                            ),
                            this.localStorage.set('journeyDetails', this.journeyDetails),
                            this.localStorage.set('quotaFlag', this.userService.quota),
                            (this.bankDetailDTO = this.singleDayAvlEnqDtls.bankDetailDTO),
                            console.log(
                                'this.singleDayAvlEnqDtls.preferredbankList........' +
                                    JSON.stringify(this.singleDayAvlEnqDtls.preferedBankDetailDTO),
                            ),
                            void 0 !== this.singleDayAvlEnqDtls.preferedBankDetailDTO &&
                                (console.log('Prefered bank found......'),
                                (this.preferredbankList = Array.isArray(
                                    this.singleDayAvlEnqDtls.preferedBankDetailDTO,
                                )
                                    ? this.singleDayAvlEnqDtls.preferedBankDetailDTO
                                    : Array.of(this.singleDayAvlEnqDtls.preferedBankDetailDTO))),
                            this.journeyDetails.loyaltyRedemptionBooking &&
                                (this.singleDayAvlEnqDtls.softPaymentDTO.amount = Number(
                                    this.singleDayAvlEnqDtls.totalCollectibleAmount,
                                )),
                            (this.userResponse = this.userService.userResponse),
                            null != this.commonService.selectedMealDetails &&
                                this.commonService.selectedMealDetails.length > 0 &&
                                ((this.mealDtlsArr = []),
                                this.commonService.selectedMealDetails.forEach((e) => {
                                    ;(this.mealDetails = e.mealDtlsArr),
                                        null != this.mealDetails &&
                                            this.mealDetails.length > 0 &&
                                            ((this.showMealDetails = true),
                                            (this.totalAmount = 0),
                                            (e.mealDtlsArr = this.chooseSelectedMeal()),
                                            (e.totalAmount = this.totalAmount),
                                            e.mealDtlsArr.length > 0 && this.mealDtlsArr.push(e))
                                }))
                    }
                    ngOnDestroy() {
                        this.langService.isAdsEnable && googletag.destroySlots()
                    }
                    ngAfterViewInit() {
                        this.langService.isAdsEnable &&
                            ((this.adsDTO = this.userService.getPsgnDetailForAds(
                                this.journeyDetails.adult[0],
                            )),
                            this.displayAds(
                                '/37179215/GPT_NWEB_PAYMENT_TOP',
                                '/37179215/GPT_NWEB_PAYMENT_BOTTOM',
                                '/37179215/GPT_NWEB_PAYMENT_RIGHT',
                            )),
                            (this.commonService.reviewPage = false),
                            this.location.onPopState(() => {
                                this.commonService.reviewPage = true
                            })
                    }
                    makePayment(e) {
                        ;(this.langService.loader = true),
                            console.log('makePayment()-----> ' + JSON.stringify(e))
                        const t = Object.assign({}, e, {
                            amount: this.singleDayAvlEnqDtls.totalCollectibleAmount,
                            transationId: 0,
                            txnStatus: 1,
                        })
                        let n = true
                        this.journeyDetails.lapDetails.forEach((e) => {
                            ;(n = n && !(e.avlNotWL || e.racNotWL || 0 == e.travelInsuranceValue)),
                                99 == t.bankId && 'FT' === e.quotaCode && (t.bankId = 999)
                        }),
                            this.bookingService
                                .bookingInitPayment(
                                    this.journeyDetails.clientTxnId,
                                    n ? 'NA' : '',
                                    t,
                                )
                                .subscribe(
                                    (e) => {
                                        const n = Object.assign({}, this.journeyDetails)
                                        if (
                                            ((n.startTime = new Date().getTime()),
                                            this.store.dispatch(new r.j(n)),
                                            (this.langService.loader = false),
                                            console.log(
                                                'BookingInitPayment..... ' + JSON.stringify(e),
                                            ),
                                            null != e.errorMsg)
                                        )
                                            this.messageService.add({
                                                life: this.langService.life,
                                                severity: 'error',
                                                key: 'c',
                                                summary: this.langService.errorMsg.errorHeader,
                                                detail: '' + e.errorMsg,
                                            })
                                        else if ('12' === e.txnStatus)
                                            if (
                                                (this.messageService.add({
                                                    life: this.langService.life,
                                                    severity: 'info',
                                                    summary: this.langService.errorMsg.infoHeader,
                                                    detail: this.langService.errorMsg
                                                        .paymentOptionsInfo1,
                                                }),
                                                this.localStorage.set(
                                                    'JourneyDetails',
                                                    this.journeyDetails,
                                                ),
                                                t.bankId == On.EWALLET_ID)
                                            )
                                                console.log('EWALLET REDIRECT'),
                                                    (this.paymentService.paymentDetailDTO = e),
                                                    this.router.navigate([
                                                        '/payment/ewallet-confirm',
                                                    ])
                                            else if (t.txnType === x.SOFT_REDEMPTION)
                                                console.log('SOFT_REDEMPTION REDIRECT'),
                                                    (this.paymentService.paymentDetailDTO = e),
                                                    (this.paymentService.softPaymentDTO =
                                                        this.softPaymentDTO),
                                                    this.router.navigate([
                                                        '/payment/loyalty-redemption-confirm',
                                                    ])
                                            else if (t.txnType === this.paymentMode.RDS) {
                                                console.log(' RDS'),
                                                    (this.langService.loader = true)
                                                let e =
                                                        this.userResponse.mobileAppConfigDTO
                                                            .minmPaymentTime,
                                                    n =
                                                        this.userResponse.mobileAppConfigDTO
                                                            .paymentCompletCheckEnable,
                                                    a = new Date()
                                                a.getHours(),
                                                    a.getMinutes(),
                                                    1 != n && (e = 1),
                                                    Object(s.a)(e).subscribe(() => {
                                                        ;(this.langService.loader = false),
                                                            this.verifyPayment(t)
                                                    })
                                            } else
                                                (this.paymentService.paymentType = i.a.BOOKING),
                                                    this.localStorage.set('BankDetails', t),
                                                    this.router.navigate([
                                                        '/payment/paymentredirect',
                                                    ])
                                    },
                                    (e) => {
                                        console.error(
                                            'BookingInitPayment Error..... ' + JSON.stringify(e),
                                        ),
                                            this.messageService.add({
                                                life: this.langService.life,
                                                severity: 'error',
                                                summary: this.langService.errorMsg.infoHeader,
                                                detail: '' + e.message.innerHTML,
                                            }),
                                            (this.langService.loader = false)
                                    },
                                    () => {
                                        console.log('BookingInitPayment finished....')
                                    },
                                )
                    }
                    verifyPayment(e) {
                        ;(this.langService.loader = true),
                            this.bookingService
                                .verifyPayment(this.journeyDetails.clientTxnId, e)
                                .subscribe((t) => {
                                    if (
                                        ((this.langService.loader = false),
                                        console.log(JSON.stringify(t)),
                                        (this.bookingService.bookingResponse = t),
                                        null == this.bookingService.bookingResponse.errorMessage)
                                    )
                                        this.router.navigate(['payment/ewallet-response'])
                                    else {
                                        let t =
                                            this.bookingService.bookingResponse.errorMessage.split(
                                                '-',
                                            )[0]
                                        null != this.bookingService.bookingResponse.retryBooking &&
                                        'true' == this.bookingService.bookingResponse.retryBooking
                                            ? this.confirmationService.confirm({
                                                  message:
                                                      t +
                                                      '. ' +
                                                      this.langService.errorMsg
                                                          .paymentResponseAlert1,
                                                  accept: () => {
                                                      this.verifyPayment(e)
                                                  },
                                                  reject: () => {
                                                      this.router.navigate(['train-search'])
                                                  },
                                              })
                                            : this.messageService.add({
                                                  life: this.langService.life,
                                                  severity: 'error',
                                                  summary: this.langService.errorMsg.errorHeader,
                                                  detail: this.bookingService.bookingResponse
                                                      .errorMessage,
                                              })
                                    }
                                })
                    }
                    get softPaymentDTO() {
                        return this.journeyDetails.loyaltyRedemptionBooking
                            ? this.singleDayAvlEnqDtls.softPaymentDTO
                            : null
                    }
                    get softPaymentDTOs() {
                        return this.journeyDetails.loyaltyRedemptionBooking
                            ? this.singleDayAvlEnqDtls.softPaymentDTOs
                            : null
                    }
                    goBack() {
                        ;(this.commonService.reviewPage = true), this._location.back()
                    }
                    showMsg(e) {
                        ;(this.shMsg = e),
                            (this.msg = false),
                            setTimeout(() => {
                                this.msg = true
                            }, 2)
                    }
                    displayAds(e, t, n) {
                        let a = window.googletag || { cmd: [] }
                        a.cmd.push(() => {
                            var t = googletag
                                .sizeMapping()
                                .addSize(
                                    [1280, 0],
                                    [
                                        [1200, 250],
                                        [970, 250],
                                        [970, 90],
                                        [728, 90],
                                    ],
                                )
                                .addSize(
                                    [980, 0],
                                    [
                                        [970, 250],
                                        [970, 90],
                                        [728, 90],
                                    ],
                                )
                                .addSize([768, 0], [728, 90])
                                .addSize([320, 0], [300, 250])
                                .build()
                            googletag
                                .defineSlot(
                                    e,
                                    [
                                        [300, 250],
                                        [728, 90],
                                        [970, 250],
                                        [970, 90],
                                        [1200, 250],
                                    ],
                                    this.adIdPOT,
                                )
                                .setTargeting('Destination', [
                                    this.journeyDetails.lapDetails[0].toStnCode,
                                ])
                                .setTargeting('Quota', [
                                    this.journeyDetails.lapDetails[0].quotaCode,
                                ])
                                .setTargeting('Departure', [
                                    this.userService.formatDateYYYYMMDD(
                                        this.journeyDetails.lapDetails[0].departureDateTime,
                                    ),
                                ])
                                .setTargeting('Meal', [this.adsDTO.meal])
                                .setTargeting('Gender', [this.adsDTO.gender])
                                .setTargeting(
                                    'TrainType',
                                    this.journeyDetails.lapDetails[0].trainType,
                                )
                                .setTargeting('Arrival', [
                                    this.userService.formatDateYYYYMMDD(
                                        this.journeyDetails.lapDetails[0].arrivalDateTime,
                                    ),
                                ])
                                .setTargeting('Age', [this.adsDTO.age])
                                .setTargeting('Source', [
                                    this.journeyDetails.lapDetails[0].fromStnCode,
                                ])
                                .setTargeting('Classes', [
                                    this.journeyDetails.lapDetails[0].classCode,
                                ])
                                .defineSizeMapping(t)
                                .setCollapseEmptyDiv(true)
                                .addService(googletag.pubads()),
                                googletag.pubads().enableSingleRequest(),
                                googletag.pubads().collapseEmptyDivs(),
                                googletag.enableServices()
                        }),
                            a.cmd.push(() => {
                                var e = googletag
                                    .sizeMapping()
                                    .addSize(
                                        [980, 0],
                                        [
                                            [970, 90],
                                            [728, 90],
                                        ],
                                    )
                                    .addSize([768, 0], [728, 90])
                                    .addSize([320, 0], [320, 50])
                                    .build()
                                googletag
                                    .defineSlot(
                                        t,
                                        [
                                            [970, 90],
                                            [728, 90],
                                            [320, 50],
                                        ],
                                        this.adIdPOB,
                                    )
                                    .setTargeting('Destination', [
                                        this.journeyDetails.lapDetails[0].toStnCode,
                                    ])
                                    .setTargeting('Quota', [
                                        this.journeyDetails.lapDetails[0].quotaCode,
                                    ])
                                    .setTargeting('Departure', [
                                        this.userService.formatDateYYYYMMDD(
                                            this.journeyDetails.lapDetails[0].departureDateTime,
                                        ),
                                    ])
                                    .setTargeting('Meal', [this.adsDTO.meal])
                                    .setTargeting('Gender', [this.adsDTO.gender])
                                    .setTargeting(
                                        'TrainType',
                                        this.journeyDetails.lapDetails[0].trainType,
                                    )
                                    .setTargeting('Arrival', [
                                        this.userService.formatDateYYYYMMDD(
                                            this.journeyDetails.lapDetails[0].arrivalDateTime,
                                        ),
                                    ])
                                    .setTargeting('Age', [this.adsDTO.age])
                                    .setTargeting('Source', [
                                        this.journeyDetails.lapDetails[0].fromStnCode,
                                    ])
                                    .setTargeting('Classes', [
                                        this.journeyDetails.lapDetails[0].classCode,
                                    ])
                                    .defineSizeMapping(e)
                                    .setCollapseEmptyDiv(true)
                                    .addService(googletag.pubads()),
                                    googletag.pubads().enableSingleRequest(),
                                    googletag.pubads().collapseEmptyDivs(),
                                    googletag.enableServices()
                            }),
                            a.cmd.push(() => {
                                var e = googletag
                                    .sizeMapping()
                                    .addSize([1024, 0], [300, 250])
                                    .build()
                                googletag
                                    .defineSlot(n, [300, 250], this.adIdPORB)
                                    .setTargeting('Destination', [
                                        this.journeyDetails.lapDetails[0].toStnCode,
                                    ])
                                    .setTargeting('Quota', [
                                        this.journeyDetails.lapDetails[0].quotaCode,
                                    ])
                                    .setTargeting('Departure', [
                                        this.userService.formatDateYYYYMMDD(
                                            this.journeyDetails.lapDetails[0].departureDateTime,
                                        ),
                                    ])
                                    .setTargeting('Meal', [this.adsDTO.meal])
                                    .setTargeting('Gender', [this.adsDTO.gender])
                                    .setTargeting(
                                        'TrainType',
                                        this.journeyDetails.lapDetails[0].trainType,
                                    )
                                    .setTargeting('Arrival', [
                                        this.userService.formatDateYYYYMMDD(
                                            this.journeyDetails.lapDetails[0].arrivalDateTime,
                                        ),
                                    ])
                                    .setTargeting('Age', [this.adsDTO.age])
                                    .setTargeting('Source', [
                                        this.journeyDetails.lapDetails[0].fromStnCode,
                                    ])
                                    .setTargeting('Classes', [
                                        this.journeyDetails.lapDetails[0].classCode,
                                    ])
                                    .defineSizeMapping(e)
                                    .setCollapseEmptyDiv(true)
                                    .addService(googletag.pubads()),
                                    googletag.pubads().enableSingleRequest(),
                                    googletag.pubads().collapseEmptyDivs(),
                                    googletag.enableServices()
                            }),
                            googletag.display(this.adIdPOT)
                    }
                    chooseSelectedMeal() {
                        for (
                            var e, t, n, a = new Array(), i = 0;
                            i < this.mealDetails.length;
                            i++
                        ) {
                            ;(t = new En.a()), (n = new Array())
                            for (
                                var c = 0, s = 0;
                                s < this.mealDetails[i].mealDetailList.length;
                                s++
                            )
                                this.mealDetails[i].mealDetailList[s].quantity > 0 &&
                                    (((e = new An.a()).mealId =
                                        this.mealDetails[i].mealDetailList[s].mealId),
                                    (e.mealTypeId =
                                        this.mealDetails[i].mealDetailList[s].mealTypeId),
                                    (e.quantity = this.mealDetails[i].mealDetailList[s].quantity),
                                    (e.mealCode = this.mealDetails[i].mealDetailList[s].mealCode),
                                    (e.mealType = this.mealDetails[i].mealDetailList[s].mealType),
                                    (e.mealName = this.mealDetails[i].mealDetailList[s].mealName),
                                    (e.mealDetails =
                                        this.mealDetails[i].mealDetailList[s].mealDetails),
                                    (e.mealRate = this.mealDetails[i].mealDetailList[s].mealRate),
                                    (e.totalAmt =
                                        this.mealDetails[i].mealDetailList[s].quantity *
                                        this.mealDetails[i].mealDetailList[s].mealRate),
                                    n.push(e),
                                    (c += e.totalAmt))
                            null != n &&
                                null != n &&
                                n.length > 0 &&
                                ((t.mealDetailList = n),
                                (t.mealType = this.mealDetails[i].mealType),
                                (this.totalAmount = this.totalAmount + c),
                                a.push(t))
                        }
                        return a
                    }
                }
                return (
                    (e.ɵfac = function (t) {
                        return new (t || e)(
                            o.Ub(g.c),
                            o.Ub(u.a),
                            o.Ub(b.a),
                            o.Ub(V.a),
                            o.Ub(m.b),
                            o.Ub(h.a),
                            o.Ub(i.b),
                            o.Ub(B.b),
                            o.Ub(f.a),
                            o.Ub(d.s),
                            o.Ub(f.d),
                            o.Ub(d.k),
                        )
                    }),
                    (e.ɵcmp = o.Ob({
                        type: e,
                        selectors: [['app-payment-options']],
                        decls: 60,
                        vars: 34,
                        consts: [
                            [
                                'icon',
                                'fa fa-question-circle',
                                2,
                                'min-width',
                                '35% !important',
                                'max-width',
                                '95% !important',
                                3,
                                'header',
                            ],
                            ['cd', ''],
                            [1, 'text-center'],
                            [
                                'type',
                                'button',
                                'pButton',
                                '',
                                'icon',
                                'fa fa-close',
                                2,
                                'margin-right',
                                '20px',
                                3,
                                'label',
                                'click',
                            ],
                            [
                                'type',
                                'button',
                                'pButton',
                                '',
                                'icon',
                                'fa fa-check',
                                3,
                                'label',
                                'click',
                            ],
                            ['key', 'c'],
                            ['pTemplate', 'message'],
                            [1, 'top-header', 'hidden-lg', 'hidden-md', 'hidden-sm'],
                            [1, 'top-header-content', 'col-xs-12'],
                            [
                                1,
                                'fa',
                                'fa-long-arrow-left',
                                2,
                                'width',
                                '10%',
                                'margin-top',
                                '12px',
                                3,
                                'click',
                            ],
                            [1, 'pull-right', 2, 'width', '90%'],
                            [1, 't_2', 2, 'color', '#fff'],
                            [
                                1,
                                'text-center',
                                2,
                                'width',
                                '100%',
                                'margin-left',
                                '-15px',
                                'text-align',
                                'center',
                            ],
                            [1, 'text-center', 2, 'margin-left', '23px', 3, 'id'],
                            [1, 'col-xs-12', 'hidden-xs', 2, 'padding', '30px 0 60px 0'],
                            [1, 'col-xs-push-2', 'col-xs-8'],
                            [1, 'text-center', 2, 'margin-top', '-42px'],
                            [1, 'col-xs-4', 2, 'padding', '0px'],
                            [1, 'progress-active', 'progress-step'],
                            [1, 'progress-val'],
                            [1, 'pull-left', 'progress-text', 2, 'margin-left', '-36px'],
                            [1, 'col-xs-push-6', 'progress-active', 'progress-step'],
                            [1, 'col-xs-push-5', 'progress-text'],
                            [1, 'pull-right'],
                            [1, 'progress-text'],
                            [1, ''],
                            ['class', 'col-xs-12 remove-padding', 4, 'ngIf'],
                            ['id', 'psgn-form', 1, 'col-xs-12', 2, 'padding', '0px'],
                            [1, 'col-sm-9', 'col-xs-12', 'remove-padding'],
                            [
                                1,
                                'form-group',
                                'col-xs-12',
                                'border-all',
                                'dull-back',
                                2,
                                'padding',
                                '0px',
                            ],
                            [
                                3,
                                'bankDetail',
                                'preferedBankDetail',
                                'fetchPref',
                                'softPaymentDTO',
                                'softPaymentDTOs',
                                'ewallet',
                                'makePayment',
                                'showMsg',
                            ],
                            [1, 'form-group', 'col-xs-12', 't-body'],
                            [1, 'text-center', 3, 'id'],
                            [
                                1,
                                'remove-padding',
                                'col-sm-3',
                                'col-xs-12',
                                2,
                                'padding-bottom',
                                '80px',
                            ],
                            [3, 'avlY', 'journeyDetails'],
                            [
                                'id',
                                'meal-summary',
                                'class',
                                'col-xs-12 border-all mealpanel zeroPadding',
                                4,
                                'ngIf',
                            ],
                            [1, 'hidden-xs'],
                            [
                                1,
                                'pi',
                                'pi-times-circle',
                                'col-xs-1',
                                'zeroPadding',
                                2,
                                'padding-top',
                                '5px',
                                'font-size',
                                '2rem',
                            ],
                            [1, 'col-xs-11', 'zeroPadding', 2, 'margin', '0px', 'flex', '1 1 auto'],
                            [2, 'font-weight', '700', 'font-size', '2rem'],
                            [2, 'margin', '0.5rem 0 0 0', 3, 'innerHTML'],
                            [1, 'col-xs-12', 'remove-padding'],
                            ['class', 'col-xs-12 pay-msg sptrain', 4, 'ngIf'],
                            [1, 'clearfix', 2, 'margin-top', '3%'],
                            [1, 'payment_opt'],
                            ['href', ''],
                            [1, 'safe_secure', 'pull-right'],
                            [
                                'appLazyLoad',
                                '',
                                'rel',
                                'preload',
                                'src',
                                './assets/images/safe.png',
                                'width',
                                '20',
                            ],
                            ['class', 'col-xs-12 remove-padding pay-msg sptrain', 4, 'ngIf'],
                            [1, 'col-xs-12', 'pay-msg', 'sptrain'],
                            ['class', 'fill', 4, 'ngIf'],
                            [1, 'fill'],
                            [1, 'col-xs-12', 'remove-padding', 'pay-msg', 'sptrain'],
                            [
                                'id',
                                'meal-summary',
                                1,
                                'col-xs-12',
                                'border-all',
                                'mealpanel',
                                'zeroPadding',
                            ],
                            ['class', 'reviewMeal', 4, 'ngFor', 'ngForOf'],
                            [1, 'reviewMeal'],
                            [
                                'expandIcon',
                                'fa fa-angle-down',
                                'collapseIcon',
                                'fa fa-angle-up',
                                3,
                                'toggleable',
                            ],
                            [1, 'col-xs-11', 2, 'padding', '0px 0px'],
                            [1, 'ui-helper-clearfix'],
                            [1, 'ui-panel-title', 'p-heading', 2, 'font-size', '1.5rem'],
                            [4, 'ngIf'],
                            [3, 'selectedMeal', 'totalAmount', 'multiLap'],
                            [1, 'clearfix'],
                        ],
                        template: function (e, t) {
                            if (1 & e) {
                                const e = o.bc()
                                o.ac(0, 'p-confirmDialog', 0, 1),
                                    o.ac(2, 'p-footer'),
                                    o.ac(3, 'div', 2),
                                    o.ac(4, 'button', 3),
                                    o.ic('click', function () {
                                        return o.Kc(e), o.Ic(1).reject()
                                    }),
                                    o.Zb(),
                                    o.ac(5, 'button', 4),
                                    o.ic('click', function () {
                                        return o.Kc(e), o.Ic(1).accept()
                                    }),
                                    o.Zb(),
                                    o.Zb(),
                                    o.Zb(),
                                    o.Zb(),
                                    o.ac(6, 'p-toast', 5),
                                    o.Rc(7, Jn, 5, 2, 'ng-template', 6),
                                    o.Zb(),
                                    o.Vb(8, 'p-toast'),
                                    o.ac(9, 'div', 7),
                                    o.ac(10, 'div', 8),
                                    o.ac(11, 'div', 9),
                                    o.ic('click', function () {
                                        return t.goBack()
                                    }),
                                    o.Zb(),
                                    o.ac(12, 'div', 10),
                                    o.ac(13, 'strong'),
                                    o.Tc(14),
                                    o.Zb(),
                                    o.Vb(15, 'br'),
                                    o.ac(16, 'span', 11),
                                    o.Tc(17),
                                    o.nc(18, 'stationName'),
                                    o.nc(19, 'stationName'),
                                    o.nc(20, 'date'),
                                    o.Zb(),
                                    o.Zb(),
                                    o.Zb(),
                                    o.Zb(),
                                    o.ac(21, 'div', 12),
                                    o.Vb(22, 'div', 13),
                                    o.Zb(),
                                    o.ac(23, 'div', 14),
                                    o.ac(24, 'div', 15),
                                    o.Vb(25, 'hr'),
                                    o.ac(26, 'div', 16),
                                    o.ac(27, 'div', 17),
                                    o.ac(28, 'div', 18),
                                    o.ac(29, 'div', 19),
                                    o.Tc(30, '1'),
                                    o.Zb(),
                                    o.Zb(),
                                    o.ac(31, 'div', 20),
                                    o.Tc(32),
                                    o.Zb(),
                                    o.Zb(),
                                    o.ac(33, 'div', 17),
                                    o.ac(34, 'div', 21),
                                    o.ac(35, 'div', 19),
                                    o.Tc(36, '2'),
                                    o.Zb(),
                                    o.Zb(),
                                    o.ac(37, 'div', 22),
                                    o.Tc(38),
                                    o.Zb(),
                                    o.Zb(),
                                    o.ac(39, 'div', 17),
                                    o.ac(40, 'div', 23),
                                    o.ac(41, 'div', 18),
                                    o.ac(42, 'div', 19),
                                    o.Tc(43, '3'),
                                    o.Zb(),
                                    o.Zb(),
                                    o.ac(44, 'div', 24),
                                    o.Tc(45),
                                    o.Zb(),
                                    o.Zb(),
                                    o.Zb(),
                                    o.Zb(),
                                    o.Zb(),
                                    o.Zb(),
                                    o.ac(46, 'div', 25),
                                    o.Rc(47, aa, 12, 5, 'div', 26),
                                    o.ac(48, 'div', 27),
                                    o.ac(49, 'div', 28),
                                    o.ac(50, 'div', 29),
                                    o.ac(51, 'app-payment', 30),
                                    o.ic('makePayment', function (e) {
                                        return t.makePayment(e)
                                    })('showMsg', function (e) {
                                        return t.showMsg(e)
                                    }),
                                    o.Zb(),
                                    o.Zb(),
                                    o.ac(52, 'div', 31),
                                    o.Vb(53, 'div', 32),
                                    o.Zb(),
                                    o.Zb(),
                                    o.ac(54, 'div', 33),
                                    o.Vb(55, 'app-journey-details'),
                                    o.Vb(56, 'app-fare-summary', 34),
                                    o.Rc(57, sa, 2, 1, 'div', 35),
                                    o.ac(58, 'div', 36),
                                    o.Vb(59, 'div', 32),
                                    o.Zb(),
                                    o.Zb(),
                                    o.Zb(),
                                    o.Zb()
                            }
                            2 & e &&
                                (o.uc(
                                    'header',
                                    null == t.langService.lang
                                        ? null
                                        : t.langService.lang.confirmation,
                                ),
                                o.Cb(4),
                                o.uc(
                                    'label',
                                    null == t.langService.lang ? null : t.langService.lang.no,
                                ),
                                o.Cb(1),
                                o.uc(
                                    'label',
                                    null == t.langService.lang ? null : t.langService.lang.yes,
                                ),
                                o.Cb(9),
                                o.Uc(
                                    null == t.langService.lang
                                        ? null
                                        : t.langService.lang.payMethod,
                                ),
                                o.Cb(3),
                                o.Xc(
                                    ' ',
                                    o.qc(
                                        18,
                                        23,
                                        t.journeyDetails.fromStation,
                                        '',
                                        t.langService.langChoice,
                                    ),
                                    ' to ',
                                    o.qc(
                                        19,
                                        27,
                                        t.journeyDetails.upToStation,
                                        '',
                                        t.langService.langChoice,
                                    ),
                                    ' | ',
                                    o.pc(
                                        20,
                                        31,
                                        t.journeyDetails.lapDetails[0].avlDetails.journeyDate,
                                        'EEE, dd MMM',
                                    ),
                                    ' ',
                                ),
                                o.Cb(5),
                                o.tc('id', t.adIdPOT),
                                o.Cb(10),
                                o.Uc(
                                    null == t.langService.lang
                                        ? null
                                        : t.langService.lang.passengerDetails,
                                ),
                                o.Cb(6),
                                o.Uc(
                                    null == t.langService.lang
                                        ? null
                                        : t.langService.lang.reviewBooking,
                                ),
                                o.Cb(7),
                                o.Uc(
                                    null == t.langService.lang ? null : t.langService.lang.payment,
                                ),
                                o.Cb(2),
                                o.tc('ngIf', t.msg),
                                o.Cb(4),
                                o.tc('bankDetail', t.bankDetailDTO)(
                                    'preferedBankDetail',
                                    t.preferredbankList,
                                )('fetchPref', false)('softPaymentDTO', t.softPaymentDTO)(
                                    'softPaymentDTOs',
                                    t.softPaymentDTOs,
                                )(
                                    'ewallet',
                                    t.singleDayAvlEnqDtls.avlFareResponseDTO[0].ewalletDTO,
                                ),
                                o.Cb(2),
                                o.tc('id', t.adIdPOB),
                                o.Cb(3),
                                o.tc('avlY', true)('journeyDetails', t.journeyDetails),
                                o.Cb(1),
                                o.tc('ngIf', t.showMealDetails),
                                o.Cb(2),
                                o.tc('id', t.adIdPORB))
                        },
                        directives: [
                            Vn.a,
                            f.b,
                            Bn.a,
                            v.a,
                            f.e,
                            d.o,
                            On,
                            $n,
                            Wn.a,
                            d.n,
                            Yn.a,
                            f.c,
                            Gn.a,
                        ],
                        pipes: [kt.a, d.f, d.t],
                        styles: [
                            '@media (max-width:768px){[_nghost-%COMP%] #app-fare-summary .ui-sidebar.ui-widget.ui-widget-content.ui-shadow.ui-sidebar-active.ui-sidebar-right{top:50px;overflow:scroll;max-height:562px;width:300px}}.fare-summary-div[_ngcontent-%COMP%]{margin-top:10px;background-color:#e8e8e8;padding:10px}.payment-box[_ngcontent-%COMP%]{padding:0}.pi[_ngcontent-%COMP%]{font-family:primeicons;font-style:normal;font-weight:400;font-variant:normal;text-transform:none;line-height:1;display:inline-block;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.pi-times-circle[_ngcontent-%COMP%]:before{content:"\\e90c"}',
                        ],
                    })),
                    e
                )
            })()
            var ra = n('Evzh')
            function oa(e, t) {
                if ((1 & e && (o.ac(0, 'div'), o.Vb(1, 'input', 3), o.Zb()), 2 & e)) {
                    const e = t.$implicit
                    o.Cb(1), o.uc('name', e.name), o.uc('value', e.value)
                }
            }
            let ga = (() => {
                class e {
                    constructor(e, t, n, a, i, c) {
                        ;(this.langService = e),
                            (this.userService = t),
                            (this.activateRoute = n),
                            (this.paymentService = a),
                            (this.tokenService = i),
                            (this.localStorage = c),
                            (this.url = null),
                            (this.params = []),
                            (this.redirectFlag = false),
                            (this.message = '')
                    }
                    ngOnInit() {
                        console.log('activate ' + this.activateRoute.snapshot.url),
                            'paymentredirect' === this.activateRoute.snapshot.url.toString()
                                ? this.initPayment()
                                : (console.log(this.activateRoute.snapshot.params.id),
                                  this.initRedirect())
                    }
                    initRedirect() {
                        let e = this.activateRoute.snapshot.params.id
                        void 0 !== ra.j[e] &&
                            ((this.redirectFlag = true),
                            (this.message = e),
                            (this.url = `${ra.d}/${ra.j[e]}`),
                            null == this.localStorage.get('token') ||
                            '' == this.localStorage.get('token') ||
                            null == this.localStorage.get('token')
                                ? this.localStorage.set('token', this.tokenService.token)
                                : (this.tokenService.token = this.localStorage.get('token')),
                            this.params.push({
                                name: 'token',
                                value: this.tokenService.token.access_token,
                            }))
                    }
                    initPayment() {
                        ;(this.url = this.tokenService.baseUrl + '/PaymentRedirect'),
                            (this.message = 'Payment'),
                            this.localStorage.set('token', this.tokenService.token),
                            this.localStorage.set('PAYMENT_TYPE', this.paymentService.paymentType),
                            this.localStorage.set('Language', this.langService.langChoice),
                            this.localStorage.set('greq', this.tokenService.uid),
                            null == this.userService.clientTxnId
                                ? (this.userService.clientTxnId =
                                      this.localStorage.get('clientTxnId'))
                                : this.localStorage.set(
                                      'clientTxnId',
                                      this.userService.clientTxnId,
                                  ),
                            console.log(this.tokenService.token),
                            console.log(this.tokenService.token.access_token),
                            this.params.push({
                                name: 'token',
                                value: this.tokenService.token.access_token,
                            }),
                            this.paymentService.paymentType === i.a.BOOKING
                                ? this.params.push({
                                      name: 'txn',
                                      value: `${this.userService.userResponse.userName}:${this.userService.clientTxnId}`,
                                  })
                                : (this.paymentService.paymentType !== i.a.EWALLET_DEPOSIT &&
                                      this.paymentService.paymentType !== i.a.SOFT_POINT_PURCHASE &&
                                      this.paymentService.paymentType !==
                                          i.a.INTERNATIONAL_USER_REG &&
                                      this.paymentService.paymentType !==
                                          i.a.EWALLET_REGISTRATION) ||
                                  this.params.push({
                                      name: 'id',
                                      value: '' + this.paymentService.paymentId,
                                  }),
                            this.params.push({
                                name: `${this.userService.userResponse.userName}:${this.userService.clientTxnId}`,
                                value: `${new Date().getTime() / (1e5 * Math.random())}${
                                    this.tokenService.csrfToken
                                }${new Date().getTime() / (1e6 * Math.random())}`,
                            }),
                            (this.redirectFlag = true)
                    }
                    ngAfterViewInit() {
                        console.log('Redirect ' + this.redirectFlag),
                            this.redirectFlag && document.getElementById('submitId').click()
                    }
                }
                return (
                    (e.ɵfac = function (t) {
                        return new (t || e)(
                            o.Ub(b.a),
                            o.Ub(u.a),
                            o.Ub(g.a),
                            o.Ub(i.b),
                            o.Ub(p.a),
                            o.Ub(B.b),
                        )
                    }),
                    (e.ɵcmp = o.Ob({
                        type: e,
                        selectors: [['app-payment-redirect']],
                        decls: 6,
                        vars: 4,
                        consts: [
                            ['ngNoForm', '', 'method', 'POST', 'id', 'formid', 3, 'action'],
                            [4, 'ngFor', 'ngForOf'],
                            ['type', 'submit', 'id', 'submitId', 2, 'visibility', 'hidden'],
                            ['type', 'hidden', 3, 'name', 'value'],
                        ],
                        template: function (e, t) {
                            1 & e &&
                                (o.ac(0, 'p'),
                                o.Tc(1),
                                o.Zb(),
                                o.ac(2, 'form', 0),
                                o.Rc(3, oa, 2, 2, 'div', 1),
                                o.ac(4, 'button', 2),
                                o.Tc(5, 'submit'),
                                o.Zb(),
                                o.Zb()),
                                2 & e &&
                                    (o.Cb(1),
                                    o.Wc(
                                        ' ',
                                        null == t.langService.errorMsg
                                            ? null
                                            : t.langService.errorMsg.paymentRedirectInfo1,
                                        ' ',
                                        t.message,
                                        '\n',
                                    ),
                                    o.Cb(1),
                                    o.uc('action', t.url, o.Mc),
                                    o.Cb(1),
                                    o.tc('ngForOf', t.params))
                        },
                        directives: [d.n],
                        styles: [''],
                    })),
                    e
                )
            })()
            class da {}
            class ba {}
            var ua = n('buLN')
            function pa(e, t) {
                1 & e &&
                    (o.ac(0, 'div'),
                    o.ac(1, 'span', 6),
                    o.Vb(2, 'i', 7),
                    o.Tc(3, ' Loading...'),
                    o.Zb(),
                    o.Zb())
            }
            function ma(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'tr', 12),
                        o.ac(1, 'td'),
                        o.Tc(2),
                        o.Zb(),
                        o.ac(3, 'td'),
                        o.Tc(4),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(3)
                    o.Cb(2),
                        o.Uc(null == e.langService.lang ? null : e.langService.lang.loyalityNumber),
                        o.Cb(2),
                        o.Vc(' ', e.loyaltyNumber, '')
                }
            }
            const ha = function () {
                return { margin: '20px 0px' }
            }
            function fa(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'p-panel', 11),
                        o.ac(1, 'p', 12),
                        o.Tc(2),
                        o.Zb(),
                        o.ac(3, 'table', 13),
                        o.ac(4, 'tbody'),
                        o.Rc(5, ma, 5, 2, 'tr', 14),
                        o.ac(6, 'tr'),
                        o.ac(7, 'td', 15),
                        o.Tc(8),
                        o.Zb(),
                        o.ac(9, 'td'),
                        o.ac(10, 'input', 16),
                        o.ic('ngModelChange', function (t) {
                            return o.Kc(e), (o.mc(2).numberOfPointsToPurchase = t)
                        })('keypress', function (t) {
                            return o.Kc(e), o.mc(2).onlyNumericInput(t)
                        }),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.ac(11, 'tr', 12),
                        o.ac(12, 'td'),
                        o.Tc(13),
                        o.Zb(),
                        o.ac(14, 'td'),
                        o.Tc(15),
                        o.Zb(),
                        o.Zb(),
                        o.ac(16, 'tr', 12),
                        o.ac(17, 'td'),
                        o.Tc(18),
                        o.Zb(),
                        o.ac(19, 'td'),
                        o.Tc(20),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Vb(21, 'app-gst-input', 17),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(2)
                    o.Pc(o.yc(12, ha)),
                        o.uc(
                            'header',
                            null == e.langService.lang
                                ? null
                                : e.langService.lang.purchaseLoyalityPoints,
                        ),
                        o.Cb(2),
                        o.Vc(
                            ' ',
                            null == e.langService.lang ? null : e.langService.lang.hdrMsg,
                            ' ',
                        ),
                        o.Cb(3),
                        o.tc('ngIf', '' != e.loyaltyNumber),
                        o.Cb(3),
                        o.Uc(
                            null == e.langService.lang ? null : e.langService.lang.pointsToPurchase,
                        ),
                        o.Cb(2),
                        o.tc('ngModel', e.numberOfPointsToPurchase),
                        o.Cb(3),
                        o.Uc(null == e.langService.lang ? null : e.langService.lang.pointValue),
                        o.Cb(2),
                        o.Vc(
                            ' ',
                            null == e.langService.lang ? null : e.langService.lang.forPoint,
                            '',
                        ),
                        o.Cb(3),
                        o.Vc(
                            '',
                            null == e.langService.lang ? null : e.langService.lang.totalValue,
                            ' ',
                        ),
                        o.Cb(2),
                        o.Uc(1.5 * e.numberOfPointsToPurchase),
                        o.Cb(1),
                        o.tc('gstControl', e.gstControl)
                }
            }
            function va(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div', 18),
                        o.ac(1, 'span', 19),
                        o.ac(2, 'strong'),
                        o.Tc(3),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(2)
                    o.Cb(3), o.Uc(e.errorMsg)
                }
            }
            function ya(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'app-payment', 20),
                        o.ic('makePayment', function (t) {
                            return o.Kc(e), o.mc(2).makePayment(t)
                        }),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(2)
                    o.tc('forEwallet', true)('bankDetail', e.bankDetailDTO)('fetchPref', true)(
                        'ewallet',
                        e.ewalletDTO,
                    )
                }
            }
            function Sa(e, t) {
                if (
                    (1 & e &&
                        (o.Rc(0, fa, 22, 13, 'p-panel', 8),
                        o.Rc(1, va, 4, 1, 'div', 9),
                        o.Rc(2, ya, 1, 4, 'app-payment', 10)),
                    2 & e)
                ) {
                    const e = o.mc()
                    o.tc('ngIf', e.initSuccess),
                        o.Cb(1),
                        o.tc('ngIf', !e.initSuccess),
                        o.Cb(1),
                        o.tc('ngIf', e.initSuccess)
                }
            }
            let ka = (() => {
                class e {
                    constructor(e, t, n, a, i, c) {
                        ;(this.router = e),
                            (this.fb = t),
                            (this.userService = n),
                            (this.langService = a),
                            (this.paymentService = i),
                            (this.messageService = c),
                            (this.initSuccess = true),
                            (this.loadingBankList = true),
                            (this.numberOfPointsToPurchase = 0),
                            (this.gstEnableFlag = 0),
                            (this.loyaltyNumber = ''),
                            (this.softuserflag = false),
                            (this.noRedemPlag = true)
                    }
                    ngOnInit() {
                        if (this.softUser) {
                            console.log('Soft Purchase > getting  bankList ')
                            let e = 1
                            ;(this.initSuccess = false),
                                (this.softBankList = Array.isArray(
                                    this.userService.userResponse.softBankList,
                                )
                                    ? this.userService.userResponse.softBankList
                                    : Array.of(this.userService.userResponse.softBankList)),
                                this.softBankList.forEach((e) => {
                                    101 == e.bankId && (this.loyaltyNumber = e.paymentModeName)
                                }),
                                this.paymentService.initLoyaltyPurchasePoiints().subscribe((t) => {
                                    console.log(
                                        `Soft Purchase >>>>>> bankList (${e++}) = ${JSON.stringify(
                                            t,
                                        )}`,
                                    ),
                                        null != t
                                            ? t.errorMessage
                                                ? ((this.initSuccess = false),
                                                  (this.errorMsg = t.errorMessage),
                                                  this.messageService.add({
                                                      life: this.langService.life,
                                                      severity: 'error',
                                                      summary:
                                                          this.langService.errorMsg.errorHeader,
                                                      detail: t.errorMessage,
                                                  }))
                                                : ((this.softPurchaseView = t),
                                                  (this.gstEnableFlag =
                                                      this.softPurchaseView.softPointsPurchaseView.gstEnableFlag),
                                                  (this.bankDetailDTO = t.bankDetailDTO),
                                                  (this.ewalletDTO = t.ewalletDTO),
                                                  this.initGstControl(),
                                                  (this.initSuccess = true))
                                            : ((this.initSuccess = false),
                                              this.messageService.add({
                                                  life: this.langService.life,
                                                  severity: 'error',
                                                  summary: this.langService.errorMsg.errorHeader,
                                                  detail: this.langService.errorMsg
                                                      .unableToPorcessYrReq,
                                              })),
                                        (this.loadingBankList = false)
                                })
                        } else (this.loadingBankList = false), (this.initSuccess = false)
                    }
                    initGstControl() {
                        this.gstControl = this.fb.group({
                            gstIn: [null],
                            nameOnGst: [null],
                            flat: [null],
                            street: [null],
                            area: [null],
                            pin: [null],
                            state: [null],
                            city: [null],
                            error: [null],
                        })
                    }
                    get softUser() {
                        return (
                            this.softuserflag ||
                                void 0 === this.userService.userResponse.userConfigurablesDTOs ||
                                this.userService.userResponse.userConfigurablesDTOs.forEach((e) => {
                                    ;(this.softuserflag =
                                        this.softuserflag || 'true' == e.softUser),
                                        (this.noRedemPlag =
                                            this.noRedemPlag ||
                                            'true' === e.loyaltyRedemptionBookingAllowed)
                                }),
                            this.softuserflag
                        )
                    }
                    get noPointsToRedeem() {
                        return false
                    }
                    get noRedemptionPrivledge() {
                        return this.noRedemPlag
                    }
                    makePayment(e) {
                        if (
                            (console.log('Payment Input Data: ' + JSON.stringify(e)),
                            console.log('GST Inputs : ' + JSON.stringify(this.gstControl.value)),
                            console.log(
                                'SoftPurchaseView: ' + JSON.stringify(this.softPurchaseView),
                            ),
                            this.numberOfPointsToPurchase <= 0)
                        )
                            this.messageService.add({
                                life: this.langService.life,
                                severity: 'error',
                                summary: this.langService.errorMsg.errorHeader,
                                detail: this.langService.errorMsg.loyaltyPurchaseSoftUserErr4,
                            })
                        else {
                            99 === e.bankId && (e.bankId = 999)
                            let t = new da()
                            ;(t.bankId = e.bankId),
                                (t.paramList = e.paramList),
                                (t.softPointsPurchaseView = new ba()),
                                (t.softPointsPurchaseView.pointsToPurchase =
                                    this.numberOfPointsToPurchase),
                                this.gstControl.controls.gstIn.value &&
                                    (t.softPointsPurchaseView = Object.assign(
                                        {},
                                        t.softPointsPurchaseView,
                                        this.gstControl.value,
                                    )),
                                (t.softPointsPurchaseView.gstEnableFlag = this.gstEnableFlag),
                                this.paymentService.initiatePurchasePointsWS(t).subscribe((t) => {
                                    if (
                                        (console.log(
                                            'initiatePurchasePointsWS.response : ' +
                                                JSON.stringify(t),
                                        ),
                                        null != t)
                                    )
                                        if (
                                            ((this.softPurchaseView = t),
                                            this.softPurchaseView.errorMessage ||
                                                this.softPurchaseView.softPointsPurchaseView
                                                    .errorMessage)
                                        ) {
                                            let e
                                            ;(e = this.softPurchaseView.errorMessage
                                                ? this.softPurchaseView.errorMessage
                                                : this.softPurchaseView.softPointsPurchaseView
                                                      .errorMessage),
                                                this.messageService.add({
                                                    life: this.langService.life,
                                                    severity: 'error',
                                                    summary: this.langService.errorMsg.errorHeader,
                                                    detail: e,
                                                })
                                        } else
                                            e.bankId == On.EWALLET_ID
                                                ? (console.log('EWALLET REDIRECT'),
                                                  (this.paymentService.paymentDetailDTO =
                                                      t.paymentDetailDTO),
                                                  (this.paymentService.paymentType =
                                                      i.a.SOFT_POINT_PURCHASE),
                                                  this.router.navigate([
                                                      '/payment/ewallet-confirm',
                                                  ]))
                                                : ((this.paymentService.paymentType =
                                                      i.a.SOFT_POINT_PURCHASE),
                                                  (this.paymentService.paymentId =
                                                      this.softPurchaseView.softPointsPurchaseView.loyaltyTxnDtlsSrlNo),
                                                  (this.userService.clientTxnId =
                                                      this.paymentService.paymentId.toString()),
                                                  this.router.navigate(['payment/paymentredirect']))
                                })
                        }
                    }
                    onlyNumericInput(e) {
                        var t = (t = document.all ? e.keyCode : e.which)
                        return 8 === t || 32 === t || (t >= 48 && t <= 57)
                    }
                }
                return (
                    (e.ɵfac = function (t) {
                        return new (t || e)(
                            o.Ub(g.c),
                            o.Ub(S.d),
                            o.Ub(u.a),
                            o.Ub(b.a),
                            o.Ub(i.b),
                            o.Ub(f.d),
                        )
                    }),
                    (e.ɵcmp = o.Ob({
                        type: e,
                        selectors: [['app-loyalty-purchase']],
                        decls: 8,
                        vars: 2,
                        consts: [
                            [1, 'container-fluid'],
                            [1, 'row'],
                            [1, 'col-md-1'],
                            [1, 'col-md-10'],
                            [4, 'ngIf', 'ngIfElse'],
                            ['showLoyaltyPurchase', ''],
                            [2, 'font-size', '4.5rem'],
                            [1, 'fa', 'fa-spinner', 'fa-spin'],
                            ['id', 'loyaltyAccountPages', 3, 'header', 'style', 4, 'ngIf'],
                            ['class', 'text-center', 4, 'ngIf'],
                            [
                                3,
                                'forEwallet',
                                'bankDetail',
                                'fetchPref',
                                'ewallet',
                                'makePayment',
                                4,
                                'ngIf',
                            ],
                            ['id', 'loyaltyAccountPages', 3, 'header'],
                            [2, 'line-height', '25px'],
                            [1, 'table', 'table-striped'],
                            ['style', 'line-height: 25px;', 4, 'ngIf'],
                            [2, 'vertical-align', 'middle'],
                            [
                                'type',
                                'number',
                                'min',
                                '0',
                                'size',
                                '10',
                                'placeholder',
                                'Number of points',
                                1,
                                'form-control',
                                3,
                                'ngModel',
                                'ngModelChange',
                                'keypress',
                            ],
                            [3, 'gstControl'],
                            [1, 'text-center'],
                            [2, 'color', 'red', 'font-size', '3rem'],
                            [3, 'forEwallet', 'bankDetail', 'fetchPref', 'ewallet', 'makePayment'],
                        ],
                        template: function (e, t) {
                            if (
                                (1 & e &&
                                    (o.Vb(0, 'p-toast'),
                                    o.ac(1, 'div', 0),
                                    o.ac(2, 'div', 1),
                                    o.Vb(3, 'div', 2),
                                    o.ac(4, 'div', 3),
                                    o.Rc(5, pa, 4, 0, 'div', 4),
                                    o.Rc(6, Sa, 3, 3, 'ng-template', null, 5, o.Sc),
                                    o.Zb(),
                                    o.Zb(),
                                    o.Zb()),
                                2 & e)
                            ) {
                                const e = o.Ic(7)
                                o.Cb(5), o.tc('ngIf', t.loadingBankList)('ngIfElse', e)
                            }
                        },
                        directives: [v.a, d.o, Yn.a, S.s, S.b, S.n, S.q, ua.a, On],
                        styles: [''],
                    })),
                    e
                )
            })()
            class Ta {}
            var Da = n('oo/N')
            class Ca {}
            var Ia = n('LuMj')
            function Za(e, t) {
                if ((1 & e && o.Vb(0, 'div', 14), 2 & e)) {
                    const e = o.mc()
                    o.tc('id', e.adIdPnT)
                }
            }
            function wa(e, t) {
                if ((1 & e && o.Vb(0, 'div', 14), 2 & e)) {
                    const e = o.mc()
                    o.tc('id', e.adPnRT)
                }
            }
            function Pa(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 15),
                        o.ac(1, 'div', 16),
                        o.ac(2, 'div', 17),
                        o.ac(3, 'p-radioButton', 18),
                        o.ic('ngModelChange', function (t) {
                            return o.Kc(e), (o.mc().regType = t)
                        }),
                        o.Zb(),
                        o.Zb(),
                        o.ac(4, 'div', 17),
                        o.ac(5, 'p-radioButton', 19),
                        o.ic('click', function () {
                            return o.Kc(e), o.mc().checkaadhaarflag()
                        }),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.ac(6, 'div', 16),
                        o.ac(7, 'div', 20),
                        o.ac(8, 'span'),
                        o.ac(9, 'strong'),
                        o.Tc(10),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.ac(11, 'div', 21),
                        o.ac(12, 'input', 22),
                        o.ic('ngModelChange', function (t) {
                            return o.Kc(e), (o.mc().pancardNumber = t)
                        }),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.ac(13, 'div', 16),
                        o.ac(14, 'div', 20),
                        o.ac(15, 'span'),
                        o.ac(16, 'strong'),
                        o.Tc(17),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.ac(18, 'div', 21),
                        o.ac(19, 'input', 23),
                        o.ic('ngModelChange', function (t) {
                            return o.Kc(e), (o.mc().cardHolderName = t)
                        }),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.ac(20, 'div', 15),
                        o.ac(21, 'div', 24),
                        o.ac(22, 'button', 25),
                        o.ic('click', function () {
                            return o.Kc(e), o.mc().checkewalletreginput()
                        }),
                        o.Tc(23),
                        o.Zb(),
                        o.Zb(),
                        o.ac(24, 'div', 24),
                        o.ac(25, 'button', 26),
                        o.Tc(26),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc()
                    o.Cb(3),
                        o.uc(
                            'label',
                            null == e.langService.lang ? null : e.langService.lang.PanCardNumber,
                        ),
                        o.tc('ngModel', e.regType),
                        o.Cb(2),
                        o.uc(
                            'label',
                            null == e.langService.lang ? null : e.langService.lang.aadhaarNumber,
                        ),
                        o.Cb(5),
                        o.Vc(
                            '',
                            null == e.langService.lang ? null : e.langService.lang.PanCardNumber,
                            ':',
                        ),
                        o.Cb(2),
                        o.uc(
                            'placeholder',
                            null == e.langService.lang
                                ? null
                                : e.langService.lang.enterPanCardNumber,
                        ),
                        o.tc('ngModel', e.pancardNumber),
                        o.Cb(5),
                        o.Vc(
                            '',
                            null == e.langService.lang
                                ? null
                                : e.langService.lang.panCardholderFirstName,
                            ':',
                        ),
                        o.Cb(2),
                        o.uc(
                            'placeholder',
                            null == e.langService.lang ? null : e.langService.lang.enterFirstName,
                        ),
                        o.tc('ngModel', e.cardHolderName),
                        o.Cb(4),
                        o.Uc(
                            null == e.langService.lang
                                ? null
                                : e.langService.lang.userRegverNAvlmessage,
                        ),
                        o.Cb(3),
                        o.Uc(
                            null == e.langService.lang
                                ? null
                                : e.langService.lang.updateProfileLabel4,
                        )
                }
            }
            function Ma(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div'),
                        o.ac(1, 'label', 35),
                        o.Tc(2),
                        o.Vb(3, 'BR'),
                        o.Vb(4, 'BR'),
                        o.Tc(5),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(2)
                    o.Cb(2),
                        o.Wc(
                            '',
                            null == e.langService.errorMsg
                                ? null
                                : e.langService.errorMsg.ewalletRegVerificationInfo,
                            ' ',
                            null == e.langService.errorMsg
                                ? null
                                : e.langService.errorMsg.ewalletRegVerificationInfo2,
                            ' ',
                        ),
                        o.Cb(3),
                        o.Xc(
                            ' ',
                            null == e.langService.errorMsg
                                ? null
                                : e.langService.errorMsg.ewalletRegVerificationInfo3,
                            ' ',
                            e.sDto.ewalletRegistrationFee,
                            '+ ',
                            null == e.langService.errorMsg
                                ? null
                                : e.langService.errorMsg.ewalletRegVerificationInfo4,
                            ' ',
                        )
                }
            }
            function Ra(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div'),
                        o.ac(1, 'label', 35),
                        o.Tc(2),
                        o.Vb(3, 'BR'),
                        o.Vb(4, 'BR'),
                        o.Tc(5),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc(2)
                    o.Cb(2),
                        o.Wc(
                            '',
                            null == e.langService.errorMsg
                                ? null
                                : e.langService.errorMsg.ewalletRegVerificationInfo1,
                            ' ',
                            null == e.langService.errorMsg
                                ? null
                                : e.langService.errorMsg.ewalletRegVerificationInfo2,
                            ' ',
                        ),
                        o.Cb(3),
                        o.Xc(
                            ' ',
                            null == e.langService.errorMsg
                                ? null
                                : e.langService.errorMsg.ewalletRegVerificationInfo3,
                            ' ',
                            e.sDto.ewalletRegistrationFee,
                            '+ ',
                            null == e.langService.errorMsg
                                ? null
                                : e.langService.errorMsg.ewalletRegVerificationInfo4,
                            ' ',
                        )
                }
            }
            function xa(e, t) {
                if ((1 & e && o.Vb(0, 'app-gst-input', 36), 2 & e)) {
                    const e = o.mc(2)
                    o.tc('gstControl', e.gstControl)
                }
            }
            function Oa(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'app-payment', 37),
                        o.ic('makePayment', function (t) {
                            return o.Kc(e), o.mc(2).makePayment(t)
                        }),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(2)
                    o.tc('fetchPref', false)('bankDetail', e.bankDetailDTO)
                }
            }
            function Ea(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 15),
                        o.ac(1, 'div', 24),
                        o.ac(2, 'button', 25),
                        o.ic('click', function () {
                            return o.Kc(e), o.mc(2).registerUser()
                        }),
                        o.Tc(3),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(2)
                    o.Cb(3), o.Uc(null == e.langService.lang ? null : e.langService.lang.submit)
                }
            }
            function Aa(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div'),
                        o.ac(1, 'div', 16),
                        o.Rc(2, Ma, 6, 5, 'div', 9),
                        o.Rc(3, Ra, 6, 5, 'div', 9),
                        o.Zb(),
                        o.ac(4, 'div', 27),
                        o.ac(5, 'div', 16),
                        o.ac(6, 'div', 28),
                        o.ac(7, 'label'),
                        o.Tc(8),
                        o.Zb(),
                        o.Zb(),
                        o.ac(9, 'div', 28),
                        o.ac(10, 'input', 29),
                        o.ic('ngModelChange', function (t) {
                            return o.Kc(e), (o.mc().transPwd = t)
                        }),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.ac(11, 'div', 16),
                        o.ac(12, 'div', 30),
                        o.ac(13, 'label'),
                        o.Tc(14),
                        o.Zb(),
                        o.Zb(),
                        o.ac(15, 'div', 28),
                        o.ac(16, 'input', 31),
                        o.ic('ngModelChange', function (t) {
                            return o.Kc(e), (o.mc().conTransPwd = t)
                        }),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.ac(17, 'div', 32),
                        o.ac(18, 'div'),
                        o.Rc(19, xa, 1, 1, 'app-gst-input', 33),
                        o.Zb(),
                        o.Zb(),
                        o.Rc(20, Oa, 1, 2, 'app-payment', 34),
                        o.Rc(21, Ea, 4, 1, 'div', 8),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc()
                    o.Cb(2),
                        o.tc('ngIf', 'pancardflg' === e.regType),
                        o.Cb(1),
                        o.tc('ngIf', 'aadharflg' === e.regType),
                        o.Cb(5),
                        o.Vc(
                            '',
                            null == e.langService.lang
                                ? null
                                : e.langService.lang.paymentPageEwalletMsg2,
                            ':',
                        ),
                        o.Cb(2),
                        o.uc(
                            'placeholder',
                            null == e.langService.lang ? null : e.langService.lang.enterTrxnPwd,
                        ),
                        o.tc('ngModel', e.transPwd),
                        o.Cb(4),
                        o.Vc(
                            '',
                            null == e.langService.lang ? null : e.langService.lang.confirmTrxnPwd,
                            ':',
                        ),
                        o.Cb(2),
                        o.uc(
                            'placeholder',
                            null == e.langService.lang
                                ? null
                                : e.langService.lang.enterconfirmTrxnPwd,
                        ),
                        o.tc('ngModel', e.conTransPwd),
                        o.Cb(3),
                        o.tc('ngIf', e.verifypayment && e.paymentRequire && !e.zeroPaymentVerify),
                        o.Cb(1),
                        o.tc('ngIf', e.verifypayment && e.paymentRequire && !e.zeroPaymentVerify),
                        o.Cb(1),
                        o.tc('ngIf', e.zeroPaymentVerify)
                }
            }
            function Va(e, t) {
                if ((1 & e && o.Vb(0, 'div', 14), 2 & e)) {
                    const e = o.mc()
                    o.tc('id', e.adIdPnB)
                }
            }
            function Ba(e, t) {
                if ((1 & e && o.Vb(0, 'div', 14), 2 & e)) {
                    const e = o.mc()
                    o.tc('id', e.adPnRB)
                }
            }
            let La = (() => {
                class e {
                    constructor(e, t, n, a, i, c, s) {
                        ;(this.router = e),
                            (this.fb = t),
                            (this.userService = n),
                            (this.langService = a),
                            (this.store = i),
                            (this.paymentService = c),
                            (this.tokenService = s),
                            (this.accountRenewStat = false),
                            (this.verifypayment = false),
                            (this.paymentRequire = true),
                            (this.registerSuccess = false),
                            (this.ewalletDocumentinput = false),
                            (this.loading = false),
                            (this.regType = 'pancardflg'),
                            (this.zeroPaymentVerify = false),
                            (this.adIdPnT = 'div-gpt-ad-1548829043753-0'),
                            (this.adIdPnB = 'div-gpt-ad-1548829186616-0'),
                            (this.adPnRT = 'div-gpt-ad-1548829336921-0'),
                            (this.adPnRB = 'div-gpt-ad-1548829466052-0'),
                            (this.adIdPnT = this.userService.getAdsRandomId()),
                            (this.adIdPnB = this.userService.getAdsRandomId()),
                            (this.adPnRT = this.userService.getAdsRandomId()),
                            (this.adPnRB = this.userService.getAdsRandomId())
                    }
                    ngOnInit() {
                        this.paymentService.ewalletRegisterNow().subscribe((e) => {
                            ;(this.sDto = e),
                                console.log('initEwalletReg.response : ' + JSON.stringify(e)),
                                null != this.sDto.errorMessage && void 0 !== this.sDto.errorMessage
                                    ? (this.errorMessage = this.sDto.errorMessage)
                                    : 'ewalletPanApiInput' === this.sDto.reDirectPage
                                      ? (this.ewalletDocumentinput = true)
                                      : 'ewalletPaymentInput' === this.sDto.reDirectPage ||
                                          'pacardVerifySuccess' === this.sDto.reDirectPage
                                        ? ((this.bankDetailDTO = Array.isArray(
                                              this.sDto.bankDetailDTO,
                                          )
                                              ? this.sDto.bankDetailDTO
                                              : Array.of(this.sDto.bankDetailDTO)),
                                          (this.ewalletRegDisplayFlag = 2),
                                          (this.verifypayment = true))
                                        : 'ewalletPaymentInputNoFee' === this.sDto.reDirectPage ||
                                            'pancardVerifySuccessNoFee' === this.sDto.reDirectPage
                                          ? ((this.ewalletDocumentinput = false),
                                            (this.verifypayment = true),
                                            (this.zeroPaymentVerify = true),
                                            (this.paymentRequire = false))
                                          : 'updateAadharEKyc' === this.sDto.reDirectPage &&
                                            ((this.ewalletRegDisplayFlag = 4),
                                            this.router.navigate(['profile/aadhar-kyc']))
                        }),
                            this.initGstControl(),
                            (this.url = `${ra.a}/${ra.f}`)
                    }
                    ngOnDestroy() {
                        this.langService.isAdsEnable && googletag.destroySlots()
                    }
                    ngAfterViewInit() {}
                    checkaadhaarflag() {
                        ;(this.regType = 'aadharflg'),
                            2 == this.userService.userResponse.aadhaarVerifyFlag
                                ? (console.log(
                                      'aadhaar flag' +
                                          this.userService.userResponse.aadhaarVerifyFlag,
                                  ),
                                  this.router.navigate(['/payment/ewalletreg-payment']))
                                : this.router.navigate(['profile/aadhar-kyc'])
                    }
                    checkewalletreginput() {
                        if (
                            ((this.langService.loader = true),
                            (this.regType = 'pancardflg'),
                            (this.errorMessage = ''),
                            '' === this.pancardNumber || void 0 === this.pancardNumber)
                        )
                            return (
                                (this.errorMessage =
                                    this.langService.errorMsg.ewalletRegPanCardErr1),
                                void (this.langService.loader = false)
                            )
                        if (!/(^([a-zA-Z]{5})([0-9]{4})([a-zA-Z]{1})$)/.test(this.pancardNumber))
                            return (
                                (this.errorMessage =
                                    this.langService.errorMsg.ewalletRegPanCardErr2),
                                void (this.langService.loader = false)
                            )
                        if ('' === this.cardHolderName || void 0 === this.cardHolderName)
                            return (
                                (this.errorMessage =
                                    this.langService.errorMsg.ewalletRegCardHldrNameErr1),
                                void (this.langService.loader = false)
                            )
                        if (!/^[A-Za-z\s]+$/.test(this.cardHolderName))
                            return (
                                (this.errorMessage =
                                    this.langService.errorMsg.ewalletRegCardHldrNameErr2),
                                void (this.langService.loader = false)
                            )
                        let e = new Ta()
                        ;(e.pancardNumber = this.pancardNumber),
                            (e.cardHolderName = this.cardHolderName),
                            this.paymentService.ewalletRegister(e).subscribe((e) => {
                                ;(this.sDto = e),
                                    (this.langService.loader = false),
                                    console.log('initEwalletReg.response : ' + JSON.stringify(e)),
                                    null != this.sDto.errorMessage &&
                                    void 0 !== this.sDto.errorMessage
                                        ? (this.errorMessage = this.sDto.errorMessage)
                                        : 'ewalletPaymentInput' === this.sDto.reDirectPage ||
                                            'pacardVerifySuccess' === this.sDto.reDirectPage
                                          ? ((this.bankDetailDTO = Array.isArray(
                                                this.sDto.bankDetailDTO,
                                            )
                                                ? this.sDto.bankDetailDTO
                                                : Array.of(this.sDto.bankDetailDTO)),
                                            (this.verifypayment = true))
                                          : ('ewalletPaymentInputNoFee' !==
                                                this.sDto.reDirectPage &&
                                                'pancardVerifySuccessNoFee' !==
                                                    this.sDto.reDirectPage) ||
                                            ((this.ewalletDocumentinput = false),
                                            (this.verifypayment = true),
                                            (this.zeroPaymentVerify = true),
                                            (this.paymentRequire = false))
                            })
                    }
                    initGstControl() {
                        this.gstControl = this.fb.group({
                            gstIn: [null],
                            nameOnGst: [null],
                            flat: [null],
                            street: [null],
                            area: [null],
                            pin: [null],
                            state: [null],
                            city: [null],
                            error: [null],
                        })
                    }
                    makePayment(e) {
                        ;(this.msgs = []), (this.growlMsgs = [])
                        const t = new RegExp('((?=.*\\d)(?=.*[a-z])(?=.*[A-Zd@$!%*#^?&]).{8,15})')
                        if ('' === this.transPwd || void 0 === this.transPwd)
                            return void (this.errorMessage =
                                this.langService.errorMsg.ewalletRegTxnPwdErr1)
                        if (this.transPwd.length < 7)
                            return void (this.errorMessage =
                                this.langService.errorMsg.ewalletRegTxnPwdErr5)
                        if (this.transPwd.length > 15)
                            return void (this.errorMessage =
                                this.langService.errorMsg.ewalletRegTxnPwdErr6)
                        if (!t.test(this.transPwd))
                            return void (this.errorMessage =
                                this.langService.errorMsg.forgetTxnPwdErr22)
                        if ('' === this.conTransPwd || void 0 === this.conTransPwd)
                            return void (this.errorMessage =
                                this.langService.errorMsg.ewalletRegTxnPwdErr8)
                        if (this.transPwd !== this.conTransPwd)
                            return void (this.errorMessage =
                                this.langService.errorMsg.ewalletRegTxnPwdErr9)
                        ;(this.sDto1 = new Da.a()),
                            (this.sDto1.txnPassword = this.transPwd),
                            (this.sDto1.txnPasswordConfirm = this.conTransPwd),
                            console.log('initEwalletRegPaymnt.request : ' + JSON.stringify(e)),
                            this.gstControl.controls.gstIn.value &&
                                (this.sDto1.gstDetailsDTO = Object.assign(
                                    {},
                                    this.sDto1.gstDetailsDTO,
                                    this.gstControl.value,
                                ))
                        let n = new Ca()
                        ;(n.bankId = e.bankId),
                            (n.paramList = e.paramList),
                            (this.sDto1.paymentDetailDTO = Object.assign(
                                {},
                                this.sDto1.paymentDetailDTO,
                                n,
                            )),
                            console.log(
                                'initEwalletRegPaymnt.requestDTO : ' + JSON.stringify(this.sDto1),
                            ),
                            this.paymentService.initEwalletRegPaymnt(this.sDto1).subscribe((e) => {
                                if (
                                    (console.log(
                                        'initEwalletRegPaymnt.response : ' + JSON.stringify(e),
                                    ),
                                    null != e)
                                )
                                    if (
                                        ((this.sDto1 = e),
                                        null != this.sDto.errorMessage &&
                                            void 0 !== this.sDto.errorMessage)
                                    ) {
                                        let e
                                        ;(this.errorMessage = this.sDto.errorMessage),
                                            this.growlMsgs.push({
                                                severity: 'error',
                                                summary: this.langService.errorMsg.errorHeader,
                                                detail: e,
                                            })
                                    } else if (null == this.sDto1.paymentDetailDTO.errorMsg)
                                        (this.paymentService.paymentType =
                                            i.a.EWALLET_REGISTRATION),
                                            (this.paymentService.paymentId =
                                                this.sDto1.paymentDetailDTO.transationId),
                                            (this.userService.clientTxnId =
                                                this.paymentService.paymentId.toString()),
                                            this.router.navigate(['payment/paymentredirect'])
                                    else {
                                        let e
                                        ;(this.errorMessage = this.sDto1.paymentDetailDTO.errorMsg),
                                            this.growlMsgs.push({
                                                severity: 'error',
                                                summary: this.langService.errorMsg.errorHeader,
                                                detail: e,
                                            })
                                    }
                            })
                    }
                    registerUser() {
                        ;(this.msgs = []), (this.growlMsgs = [])
                        const e = new RegExp('((?=.*\\d)(?=.*[a-z])(?=.*[A-Zd@$!%*#^?&]).{8,15})')
                        if ('' === this.transPwd || void 0 === this.transPwd)
                            return void (this.errorMessage =
                                this.langService.errorMsg.ewalletRegTxnPwdErr1)
                        if (this.transPwd.length < 7)
                            return void (this.errorMessage =
                                this.langService.errorMsg.ewalletRegTxnPwdErr5)
                        if (this.transPwd.length > 15)
                            return void (this.errorMessage =
                                this.langService.errorMsg.ewalletRegTxnPwdErr6)
                        if (!e.test(this.transPwd))
                            return void (this.errorMessage =
                                this.langService.errorMsg.forgetTxnPwdErr22)
                        if ('' === this.conTransPwd || void 0 === this.conTransPwd)
                            return void (this.errorMessage =
                                this.langService.errorMsg.ewalletRegTxnPwdErr8)
                        if (this.transPwd !== this.conTransPwd)
                            return void (this.errorMessage =
                                this.langService.errorMsg.ewalletRegTxnPwdErr9)
                        ;(this.sDto1 = new Da.a()),
                            (this.sDto1.txnPassword = this.transPwd),
                            (this.sDto1.txnPasswordConfirm = this.conTransPwd)
                        let t = new Ca()
                        ;(this.sDto1.paymentDetailDTO = Object.assign(
                            {},
                            this.sDto1.paymentDetailDTO,
                            t,
                        )),
                            console.log('EwalletReg.requestDTO : ' + JSON.stringify(this.sDto1)),
                            this.paymentService.getEwalletRegWS(this.sDto1).subscribe((e) => {
                                if (
                                    (console.log('initEwalletReg.response : ' + JSON.stringify(e)),
                                    null != e)
                                )
                                    if (
                                        ((this.sDto1 = e),
                                        null != this.sDto.errorMessage &&
                                            void 0 !== this.sDto.errorMessage)
                                    ) {
                                        let e
                                        ;(this.errorMessage = this.sDto.errorMessage),
                                            this.growlMsgs.push({
                                                severity: 'error',
                                                summary: this.langService.errorMsg.errorHeader,
                                                detail: e,
                                            })
                                    } else if (null == this.sDto1.paymentDetailDTO.errorMsg)
                                        (this.registerSuccess = true),
                                            (this.verifypayment = false),
                                            (this.paymentRequire = false),
                                            this.maintainLoginState(this.sDto1.userDetail)
                                    else {
                                        let e
                                        ;(this.errorMessage = this.sDto1.paymentDetailDTO.errorMsg),
                                            this.growlMsgs.push({
                                                severity: 'error',
                                                summary: this.langService.errorMsg.errorHeader,
                                                detail: e,
                                            })
                                    }
                            })
                    }
                    maintainLoginState(e) {
                        if (((this.authToken = this.tokenService.token), e)) {
                            const t = { token: this.authToken, user: e }
                            ;(this.userService.userResponse = e), this.store.dispatch(new l.e(t))
                        }
                    }
                    displayAds(e, t) {
                        this.langService.isAdsEnable &&
                            Object(s.a)(800).subscribe(() => {
                                let n = window.googletag
                                ;(n = window.googletag || { cmd: [] }),
                                    n.cmd.push(() => {
                                        var t = googletag
                                            .sizeMapping()
                                            .addSize(
                                                [1280, 0],
                                                [
                                                    [1200, 250],
                                                    [970, 250],
                                                    [970, 90],
                                                    [728, 90],
                                                ],
                                            )
                                            .addSize(
                                                [980, 0],
                                                [
                                                    [970, 250],
                                                    [970, 90],
                                                    [728, 90],
                                                ],
                                            )
                                            .addSize([768, 0], [728, 90])
                                            .addSize([320, 0], [300, 250])
                                            .build()
                                        googletag
                                            .defineSlot(
                                                e,
                                                [
                                                    [970, 90],
                                                    [728, 90],
                                                    [1200, 250],
                                                    [300, 250],
                                                    [970, 250],
                                                ],
                                                this.verifypayment ? this.adPnRT : this.adIdPnT,
                                            )
                                            .setTargeting('Gender', [this.userService.getGender()])
                                            .setTargeting('Age', [this.userService.getAge()])
                                            .defineSizeMapping(t)
                                            .setCollapseEmptyDiv(true)
                                            .addService(googletag.pubads()),
                                            googletag.pubads().enableSingleRequest(),
                                            googletag.pubads().collapseEmptyDivs(),
                                            googletag.enableServices()
                                    }),
                                    n.cmd.push(() => {
                                        var e = googletag
                                            .sizeMapping()
                                            .addSize(
                                                [980, 0],
                                                [
                                                    [970, 90],
                                                    [728, 90],
                                                ],
                                            )
                                            .addSize([768, 0], [728, 90])
                                            .addSize([320, 0], [320, 50])
                                            .build()
                                        googletag
                                            .defineSlot(
                                                t,
                                                [
                                                    [728, 90],
                                                    [970, 90],
                                                    [320, 50],
                                                ],
                                                this.verifypayment ? this.adPnRB : this.adIdPnB,
                                            )
                                            .setTargeting('Gender', [this.userService.getGender()])
                                            .setTargeting('Age', [this.userService.getAge()])
                                            .defineSizeMapping(e)
                                            .setCollapseEmptyDiv(true)
                                            .addService(googletag.pubads()),
                                            googletag.pubads().enableSingleRequest(),
                                            googletag.pubads().collapseEmptyDivs(),
                                            googletag.enableServices(),
                                            this.verifypayment
                                                ? (googletag.display(this.adPnRT),
                                                  googletag.display(this.adPnRB))
                                                : (googletag.display(this.adIdPnT),
                                                  googletag.display(this.adIdPnB))
                                    })
                            })
                    }
                    logout() {
                        console.log('Logout called '), this.store.dispatch({ type: l.d })
                    }
                }
                return (
                    (e.ɵfac = function (t) {
                        return new (t || e)(
                            o.Ub(g.c),
                            o.Ub(S.d),
                            o.Ub(u.a),
                            o.Ub(b.a),
                            o.Ub(m.b),
                            o.Ub(i.b),
                            o.Ub(p.a),
                        )
                    }),
                    (e.ɵcmp = o.Ob({
                        type: e,
                        selectors: [['app-ewallet-registration']],
                        decls: 23,
                        vars: 15,
                        consts: [
                            ['class', 'text-center', 3, 'id', 4, 'ngIf'],
                            [1, 'text-center', 'hidden-xs', 'hidden-sm', 'hidden-md'],
                            [
                                'src',
                                'http://contents.irctc.co.in/en/VERIFY_PAN_RESULT_TOP.jpeg',
                                'scrolling',
                                'no',
                                'width',
                                '1200',
                                'height',
                                '250',
                            ],
                            [1, 'container'],
                            [1, 'col-xs-12', 'bth_header', 'heading-font', 'row', 'text-center'],
                            [1, 'clearfix'],
                            [
                                1,
                                'container',
                                'row',
                                'profile_item_box',
                                'col-lg-9',
                                'col-md-9',
                                'col-sm-9',
                            ],
                            [1, 'col-xs-12', 'text-center', 2, 'color', 'red', 'padding', '10px'],
                            ['class', 'col-xs-12', 4, 'ngIf'],
                            [4, 'ngIf'],
                            [
                                'src',
                                'http://contents.irctc.co.in/en/VERIFY_PAN_RESULT_BOTTOM.jpeg',
                                'scrolling',
                                'no',
                                'width',
                                '970',
                                'height',
                                '90',
                            ],
                            [
                                'header',
                                'eWallet Registration Account',
                                3,
                                'visible',
                                'closable',
                                'visibleChange',
                            ],
                            [1, 'a', 3, 'href', 'click'],
                            [1, 'list_text', 2, 'color', '#1457a7'],
                            [1, 'text-center', 3, 'id'],
                            [1, 'col-xs-12'],
                            [1, 'col-xs-12', 'pull-left', 'profileDiv'],
                            [1, 'col-md-3', 'col-sm-5', 'col-xs-12', 'pwEditContent'],
                            [
                                'id',
                                'pancardflg',
                                'name',
                                'pancardflg',
                                'value',
                                'pancardflg',
                                1,
                                'form-group',
                                3,
                                'label',
                                'ngModel',
                                'ngModelChange',
                            ],
                            [
                                'id',
                                'aadharflg',
                                'name',
                                'aadharflg',
                                1,
                                'form-group',
                                3,
                                'label',
                                'click',
                            ],
                            [1, 'col-md-4', 'col-sm-5', 'col-xs-12', 'pwEditContent'],
                            [1, 'col-md-5', 'col-sm-5', 'col-xs-12', 'pwEditContent'],
                            [
                                'maxlength',
                                '10',
                                'type',
                                'text',
                                'name',
                                'PancardNumber',
                                1,
                                'form-control',
                                3,
                                'ngModel',
                                'placeholder',
                                'ngModelChange',
                            ],
                            [
                                'maxlength',
                                '40',
                                'type',
                                'text',
                                'name',
                                'FirstName',
                                1,
                                'form-control',
                                3,
                                'ngModel',
                                'placeholder',
                                'ngModelChange',
                            ],
                            [
                                1,
                                'col-md-2',
                                'col-sm-3',
                                'col-xs-6',
                                'inlineBlock',
                                'text-left',
                                2,
                                'padding',
                                '10px 15px 0px 0px',
                            ],
                            ['type', 'submit', 1, 'form-control', 'btn', 'btn-primary', 3, 'click'],
                            [
                                'type',
                                'submit',
                                'routerLink',
                                '/train-search',
                                1,
                                'form-control',
                                'btn',
                                'buttonCancel',
                            ],
                            [1, 'col-xs-12', 'zeroPadding'],
                            [1, 'col-md-5', 'col-sm-6', 'col-xs-12', 'pwEditContent'],
                            [
                                'maxlength',
                                '10',
                                'type',
                                'password',
                                'name',
                                'transPwd',
                                'value',
                                '',
                                1,
                                'form-control',
                                3,
                                'ngModel',
                                'placeholder',
                                'ngModelChange',
                            ],
                            [
                                1,
                                'col-md-5',
                                'col-sm-6',
                                'col-xs-12',
                                'pwEditContent',
                                2,
                                'padding-top',
                                '10px',
                            ],
                            [
                                'maxlength',
                                '10',
                                'type',
                                'password',
                                'name',
                                'conTransPwd',
                                'value',
                                '',
                                1,
                                'form-control',
                                3,
                                'ngModel',
                                'placeholder',
                                'ngModelChange',
                            ],
                            [1, 'col-xs-12', 2, 'padding-top', '20px'],
                            [3, 'gstControl', 4, 'ngIf'],
                            [3, 'fetchPref', 'bankDetail', 'makePayment', 4, 'ngIf'],
                            [1, ''],
                            [3, 'gstControl'],
                            [3, 'fetchPref', 'bankDetail', 'makePayment'],
                        ],
                        template: function (e, t) {
                            1 & e &&
                                (o.Rc(0, Za, 1, 1, 'div', 0),
                                o.Rc(1, wa, 1, 1, 'div', 0),
                                o.ac(2, 'div', 1),
                                o.Vb(3, 'img', 2),
                                o.Zb(),
                                o.ac(4, 'div', 3),
                                o.ac(5, 'div', 4),
                                o.Tc(6),
                                o.Zb(),
                                o.Vb(7, 'div', 5),
                                o.ac(8, 'div', 6),
                                o.ac(9, 'div', 7),
                                o.Tc(10),
                                o.Zb(),
                                o.Rc(11, Pa, 27, 11, 'div', 8),
                                o.Rc(12, Aa, 22, 11, 'div', 9),
                                o.Zb(),
                                o.Zb(),
                                o.Rc(13, Va, 1, 1, 'div', 0),
                                o.Rc(14, Ba, 1, 1, 'div', 0),
                                o.ac(15, 'div', 1),
                                o.Vb(16, 'img', 10),
                                o.Zb(),
                                o.ac(17, 'p-dialog', 11),
                                o.ic('visibleChange', function (e) {
                                    return (t.registerSuccess = e)
                                }),
                                o.Tc(18),
                                o.ac(19, 'a', 12),
                                o.ic('click', function () {
                                    return t.logout()
                                }),
                                o.ac(20, 'span', 13),
                                o.Tc(21),
                                o.Zb(),
                                o.Zb(),
                                o.Tc(22),
                                o.Zb()),
                                2 & e &&
                                    (o.tc('ngIf', !(t.verifypayment || t.registerSuccess)),
                                    o.Cb(1),
                                    o.tc('ngIf', t.verifypayment || t.registerSuccess),
                                    o.Cb(5),
                                    o.Vc(
                                        ' ',
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.verifyPANCARDAadhaarCard,
                                        ' ',
                                    ),
                                    o.Cb(4),
                                    o.Uc(t.errorMessage),
                                    o.Cb(1),
                                    o.tc(
                                        'ngIf',
                                        !t.verifypayment &&
                                            t.ewalletDocumentinput &&
                                            !t.accountRenewStat,
                                    ),
                                    o.Cb(1),
                                    o.tc('ngIf', t.verifypayment),
                                    o.Cb(1),
                                    o.tc('ngIf', !(t.verifypayment || t.registerSuccess)),
                                    o.Cb(1),
                                    o.tc('ngIf', t.verifypayment || t.registerSuccess),
                                    o.Cb(3),
                                    o.tc('visible', t.registerSuccess)('closable', false),
                                    o.Cb(1),
                                    o.Wc(
                                        ' ',
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.ewalletRegSuccessInfo1,
                                        ' ',
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.userRegistrationLable1_1,
                                        ' ',
                                    ),
                                    o.Cb(1),
                                    o.uc('href', t.url, o.Mc),
                                    o.Cb(2),
                                    o.Uc(
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.userRegistrationLable1_2,
                                    ),
                                    o.Cb(1),
                                    o.Vc(
                                        ' ',
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.tologin,
                                        '.\n',
                                    ))
                        },
                        directives: [d.o, y.a, Ia.a, S.n, S.q, S.b, S.k, g.d, ua.a, On],
                        encapsulation: 2,
                    })),
                    e
                )
            })()
            function Na(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div'),
                        o.ac(1, 'span', 8),
                        o.Vb(2, 'i', 9),
                        o.Tc(3),
                        o.Zb(),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc()
                    o.Cb(3),
                        o.Uc(
                            null == e.langService.errorMsg
                                ? null
                                : e.langService.errorMsg.loadingInfo,
                        )
                }
            }
            function Ua(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 11),
                        o.ac(1, 'div', 12),
                        o.Tc(2),
                        o.Zb(),
                        o.Vb(3, 'div', 13),
                        o.ac(4, 'div', 14),
                        o.ac(5, 'table', 15),
                        o.ac(6, 'tbody'),
                        o.ac(7, 'tr'),
                        o.ac(8, 'td'),
                        o.ac(9, 'strong'),
                        o.Tc(10),
                        o.Zb(),
                        o.Zb(),
                        o.ac(11, 'td'),
                        o.Tc(12),
                        o.nc(13, 'currency'),
                        o.Zb(),
                        o.Zb(),
                        o.ac(14, 'tr'),
                        o.ac(15, 'td', 16),
                        o.ac(16, 'strong'),
                        o.Tc(17),
                        o.Zb(),
                        o.Zb(),
                        o.ac(18, 'td'),
                        o.ac(19, 'span', 17),
                        o.ac(20, 'input', 18),
                        o.ic('ngModelChange', function (t) {
                            return o.Kc(e), (o.mc(2).amount = t)
                        }),
                        o.Zb(),
                        o.Zb(),
                        o.ac(21, 'span', 19),
                        o.Tc(22),
                        o.ac(23, 'strong'),
                        o.Tc(24),
                        o.nc(25, 'currency'),
                        o.Zb(),
                        o.Tc(26),
                        o.ac(27, 'strong'),
                        o.Tc(28),
                        o.nc(29, 'currency'),
                        o.Zb(),
                        o.Zb(),
                        o.ac(30, 'span', 19),
                        o.Tc(31, ' Note: '),
                        o.ac(32, 'strong'),
                        o.Tc(33, 'Amount In Decimal Value Not Allowed '),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.ac(34, 'tr'),
                        o.ac(35, 'td', 16),
                        o.ac(36, 'strong'),
                        o.Tc(37),
                        o.Zb(),
                        o.Zb(),
                        o.ac(38, 'td'),
                        o.ac(39, 'span', 17),
                        o.ac(40, 'input', 18),
                        o.ic('ngModelChange', function (t) {
                            return o.Kc(e), (o.mc(2).confirmAmount = t)
                        }),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.ac(41, 'app-payment', 20),
                        o.ic('makePayment', function (t) {
                            return o.Kc(e), o.mc(2).makePayment(t)
                        }),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc(2)
                    o.Cb(2),
                        o.Uc(null == e.langService.lang ? null : e.langService.lang.railPayDeposit),
                        o.Cb(8),
                        o.Vc(
                            '',
                            null == e.langService.lang ? null : e.langService.lang.closingBalance,
                            ': ',
                        ),
                        o.Cb(2),
                        o.Uc(o.qc(13, 18, e.eWalletDepositPaymentDetail.balance, 'INR', true)),
                        o.Cb(5),
                        o.Vc(
                            '',
                            null == e.langService.lang ? null : e.langService.lang.depositAmount,
                            ': ',
                        ),
                        o.Cb(3),
                        o.uc('min', e.minDepositAmount),
                        o.uc('max', e.maxDepositAmount),
                        o.tc('ngModel', e.amount),
                        o.Cb(2),
                        o.Vc(
                            '',
                            null == e.langService.lang ? null : e.langService.lang.minimum,
                            ': ',
                        ),
                        o.Cb(2),
                        o.Uc(o.qc(25, 22, e.minDepositAmount, 'INR', true)),
                        o.Cb(2),
                        o.Vc(
                            ' ',
                            null == e.langService.lang ? null : e.langService.lang.maximum,
                            ': ',
                        ),
                        o.Cb(2),
                        o.Uc(o.qc(29, 26, e.maxDepositAmount, 'INR', true)),
                        o.Cb(9),
                        o.Vc(
                            '',
                            null == e.langService.lang
                                ? null
                                : e.langService.lang.confirmDepositAmount,
                            ': ',
                        ),
                        o.Cb(3),
                        o.uc('min', e.minDepositAmount),
                        o.uc('max', e.maxDepositAmount),
                        o.tc('ngModel', e.confirmAmount),
                        o.Cb(1),
                        o.tc('forEwallet', true)('bankDetail', e.bankDetailDTO)('fetchPref', true)
                }
            }
            function Fa(e, t) {
                if ((1 & e && o.Rc(0, Ua, 42, 30, 'div', 10), 2 & e)) {
                    const e = o.mc()
                    o.tc('ngIf', e.depositOptionShow)
                }
            }
            let _a = (() => {
                class e {
                    constructor(e, t, n, a, i) {
                        ;(this.router = e),
                            (this.userService = t),
                            (this.langService = n),
                            (this.paymentService = a),
                            (this.messageService = i),
                            (this.loading = true),
                            (this.adIdEwdT = 'div-gpt-ad-1548668806204-0'),
                            (this.adIdEwdB = 'div-gpt-ad-1548668955324-0'),
                            (this.adIdEwdT = this.userService.getAdsRandomId()),
                            (this.adIdEwdB = this.userService.getAdsRandomId())
                    }
                    ngOnInit() {
                        this.paymentService.getEalletDepositBankList().subscribe((e) => {
                            null != e
                                ? ((this.eWalletDepositPaymentDetail = e),
                                  (this.eWalletDepositPaymentDetail.minDepositAmount = 100),
                                  this.eWalletDepositPaymentDetail.message
                                      ? this.messageService.add({
                                            life: this.langService.life,
                                            severity: 'error',
                                            summary: this.langService.errorMsg.errorHeader,
                                            detail: this.eWalletDepositPaymentDetail.message,
                                        })
                                      : ((this.depositOptionShow = true),
                                        (this.bankDetailDTO = Array.isArray(
                                            this.eWalletDepositPaymentDetail.bankDetailDTO,
                                        )
                                            ? this.eWalletDepositPaymentDetail.bankDetailDTO
                                            : Array.of(
                                                  this.eWalletDepositPaymentDetail.bankDetailDTO,
                                              )),
                                        (this.minDepositAmount =
                                            this.eWalletDepositPaymentDetail.minDepositAmount),
                                        (this.maxDepositAmount = Math.floor(
                                            this.eWalletDepositPaymentDetail.maxBalance -
                                                this.eWalletDepositPaymentDetail.balance,
                                        ))))
                                : this.messageService.add({
                                      life: this.langService.life,
                                      severity: 'error',
                                      summary: this.langService.errorMsg.errorHeader,
                                      detail: this.langService.errorMsg.unableToProcess,
                                  }),
                                (this.loading = false)
                        })
                    }
                    ngOnDestroy() {
                        this.langService.isAdsEnable && googletag.destroySlots()
                    }
                    ngAfterViewInit() {
                        this.langService.isAdsEnable &&
                            this.displayAds(
                                '/37179215/NWEB_EWALLET_DEPOSIT_TOP',
                                '/37179215/NWEB_EWALLET_DEPOSIT_BOTTOM',
                            )
                    }
                    makePayment(e) {
                        let t = false
                        if (
                            (this.amount < this.minDepositAmount &&
                                (this.messageService.add({
                                    life: this.langService.life,
                                    severity: 'error',
                                    summary: this.langService.errorMsg.errorHeader,
                                    detail:
                                        this.langService.errorMsg.ewalletDepositErr1 +
                                        ' ' +
                                        this.minDepositAmount,
                                }),
                                (t = true)),
                            this.amount > this.maxDepositAmount &&
                                (this.messageService.add({
                                    life: this.langService.life,
                                    severity: 'error',
                                    summary: this.langService.errorMsg.errorHeader,
                                    detail:
                                        this.langService.errorMsg.ewalletDepositErr2 +
                                        ' ' +
                                        this.maxDepositAmount,
                                }),
                                (t = true)),
                            this.amount !== this.confirmAmount &&
                                (this.messageService.add({
                                    life: this.langService.life,
                                    severity: 'error',
                                    summary: this.langService.errorMsg.errorHeader,
                                    detail: this.langService.errorMsg.ewalletDepositErr3,
                                }),
                                (t = true)),
                            'number' != typeof this.amount &&
                                'number' != typeof this.confirmAmount &&
                                (this.messageService.add({
                                    life: this.langService.life,
                                    severity: 'error',
                                    summary: this.langService.errorMsg.errorHeader,
                                    detail: this.langService.errorMsg.ewalletDepositAmountMessage,
                                }),
                                (t = true)),
                            t)
                        )
                            return
                        console.log('EWallet Deposit Payment Input Data: ' + JSON.stringify(e))
                        const n = Object.assign({}, e, {
                            amount: this.amount,
                            transationId: 0,
                            txnStatus: 1,
                        })
                        99 === n.bankId && (n.bankId = 999),
                            this.paymentService.initEwalletDepositPayment(n).subscribe((e) => {
                                if (
                                    (console.log(
                                        'eWallet Deposit Init payment response : ' +
                                            JSON.stringify(e),
                                    ),
                                    null != e)
                                ) {
                                    const t = e
                                    t.errorMsg
                                        ? this.messageService.add({
                                              life: this.langService.life,
                                              severity: 'error',
                                              summary: this.langService.errorMsg.errorHeader,
                                              detail: t.errorMsg,
                                          })
                                        : ((this.paymentService.paymentType = i.a.EWALLET_DEPOSIT),
                                          (this.paymentService.paymentId = t.transationId),
                                          (this.userService.clientTxnId =
                                              t.transationId.toString()),
                                          this.router.navigate(['payment/paymentredirect']))
                                }
                            })
                    }
                    validateAmount() {}
                    validateConfirmAmount() {}
                    displayAds(e, t) {
                        let n = window.googletag
                        ;(n = window.googletag || { cmd: [] }),
                            n.cmd.push(() => {
                                var t = googletag
                                    .sizeMapping()
                                    .addSize(
                                        [1280, 0],
                                        [
                                            [1200, 250],
                                            [970, 250],
                                            [970, 90],
                                            [728, 90],
                                        ],
                                    )
                                    .addSize(
                                        [980, 0],
                                        [
                                            [970, 250],
                                            [970, 90],
                                            [728, 90],
                                        ],
                                    )
                                    .addSize([768, 0], [728, 90])
                                    .addSize([320, 0], [300, 250])
                                    .build()
                                googletag
                                    .defineSlot(
                                        e,
                                        [
                                            [970, 250],
                                            [970, 90],
                                            [300, 250],
                                            [728, 90],
                                            [1200, 250],
                                        ],
                                        this.adIdEwdT,
                                    )
                                    .setTargeting('Gender', [this.userService.getGender()])
                                    .setTargeting('Age', [this.userService.getAge()])
                                    .defineSizeMapping(t)
                                    .setCollapseEmptyDiv(true)
                                    .addService(googletag.pubads()),
                                    googletag.pubads().enableSingleRequest(),
                                    googletag.pubads().collapseEmptyDivs(),
                                    googletag.enableServices()
                            }),
                            n.cmd.push(() => {
                                var e = googletag
                                    .sizeMapping()
                                    .addSize(
                                        [980, 0],
                                        [
                                            [970, 90],
                                            [728, 90],
                                        ],
                                    )
                                    .addSize([768, 0], [728, 90])
                                    .addSize([320, 0], [320, 50])
                                    .build()
                                googletag
                                    .defineSlot(
                                        t,
                                        [
                                            [320, 50],
                                            [970, 90],
                                            [728, 90],
                                        ],
                                        this.adIdEwdB,
                                    )
                                    .setTargeting('Gender', [this.userService.getGender()])
                                    .setTargeting('Age', [this.userService.getAge()])
                                    .defineSizeMapping(e)
                                    .setCollapseEmptyDiv(true)
                                    .addService(googletag.pubads()),
                                    googletag.pubads().enableSingleRequest(),
                                    googletag.pubads().collapseEmptyDivs(),
                                    googletag.enableServices()
                            }),
                            googletag.display(this.adIdEwdT)
                    }
                }
                return (
                    (e.ɵfac = function (t) {
                        return new (t || e)(o.Ub(g.c), o.Ub(u.a), o.Ub(b.a), o.Ub(i.b), o.Ub(f.d))
                    }),
                    (e.ɵcmp = o.Ob({
                        type: e,
                        selectors: [['app-ewallet-deposit']],
                        decls: 11,
                        vars: 4,
                        consts: [
                            [1, 'text-center', 3, 'id'],
                            [1, 'container-fluid'],
                            [1, 'row-fluid'],
                            [1, 'col-md-1'],
                            [1, 'col-md-10'],
                            [4, 'ngIf', 'ngIfElse'],
                            ['showDeposit', ''],
                            [1, 'row-fluid', 2, 'padding-bottom', '35px'],
                            [2, 'font-size', '4.5rem'],
                            [1, 'fa', 'fa-spinner', 'fa-spin'],
                            ['class', 'container pnr-detail', 4, 'ngIf'],
                            [1, 'container', 'pnr-detail'],
                            [1, 'bth_header', 'heading-font', 'row', 'pull-left'],
                            [1, 'clearfix'],
                            [2, 'border', '1px solid #c8c8c8'],
                            [1, 'table'],
                            [2, 'vertical-align', 'middle'],
                            [1, 'col-xs-6', 'zeroPadding'],
                            [
                                'type',
                                'number',
                                'onkeypress',
                                'return event.charCode >= 48 && event.charCode <= 57',
                                'required',
                                '',
                                1,
                                'form-control',
                                3,
                                'ngModel',
                                'min',
                                'max',
                                'ngModelChange',
                            ],
                            [1, 'pull-right'],
                            [3, 'forEwallet', 'bankDetail', 'fetchPref', 'makePayment'],
                        ],
                        template: function (e, t) {
                            if (
                                (1 & e &&
                                    (o.Vb(0, 'div', 0),
                                    o.ac(1, 'div', 1),
                                    o.ac(2, 'div', 2),
                                    o.Vb(3, 'div', 3),
                                    o.ac(4, 'div', 4),
                                    o.Rc(5, Na, 4, 1, 'div', 5),
                                    o.Rc(6, Fa, 1, 1, 'ng-template', null, 6, o.Sc),
                                    o.Zb(),
                                    o.Vb(8, 'div', 3),
                                    o.Zb(),
                                    o.ac(9, 'div', 7),
                                    o.Vb(10, 'div', 0),
                                    o.Zb(),
                                    o.Zb()),
                                2 & e)
                            ) {
                                const e = o.Ic(7)
                                o.tc('id', t.adIdEwdT),
                                    o.Cb(5),
                                    o.tc('ngIf', t.loading)('ngIfElse', e),
                                    o.Cb(5),
                                    o.tc('id', t.adIdEwdB)
                            }
                        },
                        directives: [d.o, S.s, S.b, S.v, S.n, S.q, On],
                        pipes: [d.d],
                        styles: ['td[_ngcontent-%COMP%]{border-top:none!important}'],
                    })),
                    e
                )
            })()
            const Ka = function () {
                return { margin: '20px 0px' }
            }
            let ja = (() => {
                class e {
                    constructor(e, t, n, a) {
                        ;(this.fb = e),
                            (this.langService = t),
                            (this.paymentService = n),
                            (this.router = a),
                            (this.accountRenewStat = false)
                    }
                    ngOnInit() {
                        this.paymentService.ewalletRegisterNow().subscribe((e) => {
                            ;(this.sDto = e),
                                null != this.sDto.errorMessage && void 0 !== this.sDto.errorMessage
                                    ? (this.errorMessage = this.sDto.errorMessage)
                                    : 'ewalletPaymentInput' === this.sDto.reDirectPage
                                      ? ((this.bankDetailDTO = Array.isArray(
                                            this.sDto.bankDetailDTO,
                                        )
                                            ? this.sDto.bankDetailDTO
                                            : Array.of(this.sDto.bankDetailDTO)),
                                        (this.ewalletRegDisplayFlag = 2))
                                      : 'ewalletPaymentInputNoFee' === this.sDto.reDirectPage &&
                                        (this.ewalletRegDisplayFlag = 3)
                        }),
                            this.initGstControl()
                    }
                    initGstControl() {
                        this.gstControl = this.fb.group({
                            gstIn: [null],
                            nameOnGst: [null],
                            flat: [null],
                            street: [null],
                            area: [null],
                            pin: [null],
                            state: [null],
                            city: [null],
                            error: [null],
                        })
                    }
                    makePayment(e) {
                        ;(this.msgs = []), (this.growlMsgs = [])
                        const t = new RegExp('((?=.*\\d)(?=.*[a-z])(?=.*[A-Zd@$!%*#^?&]).{8,15})')
                        if ('' === this.transPwd || void 0 === this.transPwd)
                            return void (this.errorMessage =
                                this.langService.errorMsg.ewalletRegTxnPwdErr1)
                        if (!t.test(this.transPwd))
                            return void (this.errorMessage =
                                this.langService.errorMsg.ewalletRegTxnPwdErr2)
                        if (this.transPwd.length < 7)
                            return void (this.errorMessage =
                                this.langService.errorMsg.ewalletRegTxnPwdErr5)
                        if (this.transPwd.length > 15)
                            return void (this.errorMessage =
                                this.langService.errorMsg.ewalletRegTxnPwdErr6)
                        if ('' === this.conTransPwd || void 0 === this.conTransPwd)
                            return void (this.errorMessage =
                                this.langService.errorMsg.ewalletRegTxnPwdErr8)
                        if (this.transPwd !== this.conTransPwd)
                            return void (this.errorMessage =
                                this.langService.errorMsg.ewalletRegTxnPwdErr9)
                        this.gstControl.controls.gstIn.value &&
                            (this.sDto1.gstDetailsDTO = Object.assign(
                                {},
                                this.sDto1.gstDetailsDTO,
                                this.gstControl.value,
                            ))
                        let n = new Ta()
                        this.paymentService.initEwalletRegPaymnt(n).subscribe((e) => {
                            if (
                                (console.log(
                                    'initEwalletRegPaymnt.response : ' + JSON.stringify(e),
                                ),
                                null != e)
                            )
                                if (
                                    ((this.sDto = e),
                                    null != this.sDto.errorMessage &&
                                        void 0 !== this.sDto.errorMessage)
                                ) {
                                    let e
                                    ;(this.errorMessage = this.sDto.errorMessage),
                                        this.growlMsgs.push({
                                            severity: 'error',
                                            summary: this.langService.errorMsg.errorHeader,
                                            detail: e,
                                        })
                                } else
                                    (this.paymentService.paymentType = i.a.EWALLET_REGISTRATION),
                                        this.router.navigate(['payment/paymentredirect'])
                        })
                    }
                }
                return (
                    (e.ɵfac = function (t) {
                        return new (t || e)(o.Ub(S.d), o.Ub(b.a), o.Ub(i.b), o.Ub(g.c))
                    }),
                    (e.ɵcmp = o.Ob({
                        type: e,
                        selectors: [['app-ewallet-reg-payment']],
                        decls: 31,
                        vars: 10,
                        consts: [
                            [1, 'container-fluid'],
                            [1, 'row-fluid'],
                            [1, 'col-md-1'],
                            [1, 'col-md-10'],
                            ['header', 'Verify PAN Card / Aadhaar Card', 3, 'toggleable'],
                            [1, 'pnrbox', 2, 'padding', '20px'],
                            ['action', '', 1, 'form-inline'],
                            [1, 'form-group'],
                            [2, 'width', '200px', 'text-align', 'left'],
                            [
                                'maxlength',
                                '10',
                                'type',
                                'text',
                                'name',
                                'transPwd',
                                'value',
                                '',
                                'placeholder',
                                'Enter Transaction Password',
                                1,
                                'form-control',
                                3,
                                'ngModel',
                                'ngModelChange',
                            ],
                            [
                                'maxlength',
                                '10',
                                'type',
                                'text',
                                'name',
                                'conTransPwd',
                                'value',
                                '',
                                'placeholder',
                                'Enter Confirm Transaction Password',
                                1,
                                'form-control',
                                3,
                                'ngModel',
                                'ngModelChange',
                            ],
                            [2, 'width', '500px', 'text-align', 'left'],
                            [3, 'gstControl'],
                            [3, 'bankDetail', 'fetchPref', 'makePayment'],
                            [2, 'color', 'red', 'padding', '10px'],
                        ],
                        template: function (e, t) {
                            1 & e &&
                                (o.ac(0, 'div', 0),
                                o.ac(1, 'div', 1),
                                o.Vb(2, 'div', 2),
                                o.ac(3, 'div', 3),
                                o.ac(4, 'p-panel', 4),
                                o.ac(5, 'div', 5),
                                o.ac(6, 'form', 6),
                                o.Vb(7, 'br'),
                                o.Vb(8, 'br'),
                                o.ac(9, 'div', 7),
                                o.ac(10, 'label', 8),
                                o.Tc(11, 'Transaction Password:'),
                                o.Zb(),
                                o.ac(12, 'input', 9),
                                o.ic('ngModelChange', function (e) {
                                    return (t.transPwd = e)
                                }),
                                o.Zb(),
                                o.Zb(),
                                o.Vb(13, 'br'),
                                o.Vb(14, 'br'),
                                o.ac(15, 'div', 7),
                                o.ac(16, 'label', 8),
                                o.Tc(17, 'Confirm Transaction Password:'),
                                o.Zb(),
                                o.ac(18, 'input', 10),
                                o.ic('ngModelChange', function (e) {
                                    return (t.conTransPwd = e)
                                }),
                                o.Zb(),
                                o.Zb(),
                                o.Vb(19, 'br'),
                                o.Vb(20, 'br'),
                                o.Vb(21, 'br'),
                                o.Vb(22, 'br'),
                                o.ac(23, 'div', 7),
                                o.ac(24, 'label', 11),
                                o.Tc(
                                    25,
                                    'Registration Fee for IRCTC eWallet Scheme: Rs 50+ Applicable GST',
                                ),
                                o.Zb(),
                                o.Zb(),
                                o.Vb(26, 'app-gst-input', 12),
                                o.ac(27, 'app-payment', 13),
                                o.ic('makePayment', function (e) {
                                    return t.makePayment(e)
                                }),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.ac(28, 'div', 14),
                                o.Tc(29),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Vb(30, 'div', 2),
                                o.Zb(),
                                o.Zb()),
                                2 & e &&
                                    (o.Cb(4),
                                    o.Pc(o.yc(9, Ka)),
                                    o.tc('toggleable', false),
                                    o.Cb(8),
                                    o.tc('ngModel', t.transPwd),
                                    o.Cb(6),
                                    o.tc('ngModel', t.conTransPwd),
                                    o.Cb(8),
                                    o.tc('gstControl', t.gstControl),
                                    o.Cb(1),
                                    o.tc('bankDetail', t.bankDetailDTO)('fetchPref', true),
                                    o.Cb(2),
                                    o.Uc(t.errorMessage))
                        },
                        directives: [Yn.a, S.z, S.o, S.p, S.b, S.k, S.n, S.q, ua.a, On],
                        encapsulation: 2,
                    })),
                    e
                )
            })()
            class za {}
            class qa {}
            const Ha = function () {
                return { margin: '20px 0px' }
            }
            let $a = (() => {
                class e {
                    constructor(e, t, n, a, i, c) {
                        ;(this.router = e),
                            (this.fb = t),
                            (this.userService = n),
                            (this.langService = a),
                            (this.paymentService = i),
                            (this.messageService = c),
                            (this.isError = true),
                            (this.isSuccess = false),
                            (this.isEditIsd = false),
                            (this.verifyUser = false),
                            (this.isInternationalUser = false),
                            (this.userResponse = null),
                            (this.statusDto = null),
                            (this.verifypayment = false)
                    }
                    ngOnInit() {
                        ;(this.verifyUser = false),
                            (this.userResponse = this.userService.userResponse),
                            console.log(
                                'bank list: ' + JSON.stringify(this.userResponse.bankDetailDTO),
                            ),
                            console.log('payment Amount:' + this.userResponse.totalAmount),
                            (this.bankDetailDTO = Array.isArray(this.userResponse.bankDetailDTO)
                                ? this.userResponse.bankDetailDTO
                                : Array.of(this.userResponse.bankDetailDTO)),
                            (this.verifypayment = true),
                            94 != this.userResponse.countryId
                                ? ((this.isInternationalUser = true), this.initGstControl())
                                : (this.isInternationalUser = false)
                    }
                    makePayment(e) {
                        if (
                            (console.log('Payment Input Data: ' + JSON.stringify(e)),
                            console.log('GST Inputs : ' + JSON.stringify(this.gstControl.value)),
                            this.totalAmount <= 0)
                        )
                            this.messageService.add({
                                life: this.langService.life,
                                severity: 'error',
                                summary: this.langService.errorMsg.errorHeader,
                                detail: this.langService.errorMsg.loyaltyPurchaseSoftUserErr4,
                            })
                        else {
                            ;(this.userregPaymentView = new za()),
                                99 === e.bankId && (e.bankId = 999),
                                (this.userregPaymentView.bankId = e.bankId)
                            let t = new qa()
                            ;(this.userregPaymentView.userRegistrationPaymentView = t),
                                (this.userregPaymentView.userRegistrationPaymentView.totalAmount =
                                    parseInt(this.userResponse.totalAmount)),
                                this.gstControl.controls.gstIn.value &&
                                    (this.userregPaymentView.userRegistrationPaymentView =
                                        Object.assign(
                                            {},
                                            this.userregPaymentView.userRegistrationPaymentView,
                                            this.gstControl.value,
                                        )),
                                this.paymentService
                                    .initiateFtUserRegWS(this.userregPaymentView)
                                    .subscribe((e) => {
                                        if (
                                            (console.log(
                                                'initiateFTUserRegPaymentWS.response : ' +
                                                    JSON.stringify(e),
                                            ),
                                            null != e)
                                        )
                                            if (
                                                ((this.userregPaymentView = e),
                                                this.userregPaymentView.errorMessage ||
                                                    this.userregPaymentView
                                                        .userRegistrationPaymentView.errorMessage)
                                            ) {
                                                let t
                                                ;(t = this.userregPaymentView.errorMessage
                                                    ? this.userregPaymentView.errorMessage
                                                    : this.userregPaymentView
                                                          .userRegistrationPaymentView
                                                          .errorMessage),
                                                    this.messageService.add({
                                                        life: this.langService.life,
                                                        severity: 'error',
                                                        summary:
                                                            this.langService.errorMsg.errorHeader,
                                                        detail: t,
                                                    }),
                                                    e.errorMessage &&
                                                        this.messageService.add({
                                                            life: this.langService.life,
                                                            severity: 'error',
                                                            summary:
                                                                this.langService.errorMsg
                                                                    .errorHeader,
                                                            detail: e.errorMessage,
                                                        })
                                            } else
                                                (this.paymentService.paymentType =
                                                    i.a.INTERNATIONAL_USER_REG),
                                                    (this.paymentService.paymentId =
                                                        this.userregPaymentView.userRegistrationPaymentView.paymentTxnId),
                                                    (this.userService.clientTxnId =
                                                        this.paymentService.paymentId.toString()),
                                                    this.router.navigate([
                                                        'payment/paymentredirect',
                                                    ])
                                    })
                        }
                    }
                    userProfileUpdate() {
                        this.router.navigate(['/profile/update-profile'])
                    }
                    initGstControl() {
                        this.gstControl = this.fb.group({
                            gstIn: [null],
                            nameOnGst: [null],
                            flat: [null],
                            street: [null],
                            area: [null],
                            pin: [null],
                            state: [null],
                            city: [null],
                            error: [null],
                        })
                    }
                }
                return (
                    (e.ɵfac = function (t) {
                        return new (t || e)(
                            o.Ub(g.c),
                            o.Ub(S.d),
                            o.Ub(u.a),
                            o.Ub(b.a),
                            o.Ub(i.b),
                            o.Ub(f.d),
                        )
                    }),
                    (e.ɵcmp = o.Ob({
                        type: e,
                        selectors: [['app-non-reg-payment']],
                        decls: 30,
                        vars: 16,
                        consts: [
                            [1, 'container-fluid'],
                            [3, 'header'],
                            [1, 'row'],
                            [1, 'col-md-1'],
                            [1, 'col-md-10'],
                            [1, 'alert', 'alert-info'],
                            [1, 'alert', 'alert-warning'],
                            ['href', '#', 'onclick', 'return false;', 1, '', 3, 'click'],
                            [3, 'gstControl'],
                            [
                                1,
                                'level_1',
                                'col-md-12',
                                'col-xs-12',
                                'col-sm-12',
                                2,
                                'color',
                                'red',
                                'font-weight',
                                'bold',
                            ],
                            [3, 'forEwallet', 'bankDetail', 'fetchPref', 'makePayment'],
                        ],
                        template: function (e, t) {
                            1 & e &&
                                (o.ac(0, 'div', 0),
                                o.ac(1, 'p-panel', 1),
                                o.ac(2, 'div', 2),
                                o.Vb(3, 'div', 3),
                                o.ac(4, 'div', 4),
                                o.Vb(5, 'p-toast'),
                                o.ac(6, 'div', 5),
                                o.ac(7, 'p'),
                                o.ac(8, 'strong'),
                                o.Tc(9),
                                o.Zb(),
                                o.Tc(10),
                                o.Zb(),
                                o.Zb(),
                                o.ac(11, 'div', 6),
                                o.ac(12, 'strong'),
                                o.Tc(13),
                                o.ac(14, 'u'),
                                o.ac(15, 'a', 7),
                                o.ic('click', function () {
                                    return t.userProfileUpdate()
                                }),
                                o.Tc(16),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Zb(),
                                o.Vb(17, 'div', 3),
                                o.Zb(),
                                o.ac(18, 'div', 2),
                                o.Vb(19, 'div', 3),
                                o.ac(20, 'div', 4),
                                o.Vb(21, 'app-gst-input', 8),
                                o.Zb(),
                                o.Vb(22, 'div', 3),
                                o.Zb(),
                                o.ac(23, 'div', 2),
                                o.Vb(24, 'div', 3),
                                o.ac(25, 'div', 4),
                                o.ac(26, 'div', 9),
                                o.Tc(27),
                                o.Zb(),
                                o.ac(28, 'app-payment', 10),
                                o.ic('makePayment', function (e) {
                                    return t.makePayment(e)
                                }),
                                o.Zb(),
                                o.Zb(),
                                o.Vb(29, 'div', 3),
                                o.Zb(),
                                o.Zb(),
                                o.Zb()),
                                2 & e &&
                                    (o.Cb(1),
                                    o.Pc(o.yc(15, Ha)),
                                    o.uc(
                                        'header',
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.nonRegPaymentComponentHeader,
                                    ),
                                    o.Cb(8),
                                    o.Vc(
                                        '',
                                        null == t.langService.lang ? null : t.langService.lang.info,
                                        '! ',
                                    ),
                                    o.Cb(1),
                                    o.Yc(
                                        ' ',
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.nonRegPaymentInfo1_1,
                                        ' ',
                                        t.userResponse.totalAmount,
                                        '+ ',
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.nonRegPaymentInfo1_2,
                                        ' ',
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.nonRegPaymentInfo2,
                                        ' ',
                                    ),
                                    o.Cb(3),
                                    o.Vc(
                                        '',
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.warning,
                                        '! ',
                                    ),
                                    o.Cb(3),
                                    o.Uc(
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.warningNonRegPayment,
                                    ),
                                    o.Cb(5),
                                    o.tc('gstControl', t.gstControl),
                                    o.Cb(6),
                                    o.Vc(
                                        '',
                                        null == t.langService.lang
                                            ? null
                                            : t.langService.lang.message29,
                                        ' ',
                                    ),
                                    o.Cb(1),
                                    o.tc('forEwallet', true)('bankDetail', t.bankDetailDTO)(
                                        'fetchPref',
                                        false,
                                    ))
                        },
                        directives: [Yn.a, v.a, ua.a, On],
                        encapsulation: 2,
                    })),
                    e
                )
            })()
            var Wa = n('Kk/z'),
                Ya = n('v9KR'),
                Ga = n('B2C1')
            function Ja(e, t) {
                if ((1 & e && o.Vb(0, 'app-booking-confirmation', 4), 2 & e)) {
                    const e = o.mc(2)
                    o.tc('bkgResponse', e.bkgRespDto)
                }
            }
            function Xa(e, t) {
                if ((1 & e && o.Vb(0, 'app-booking-failed', 5), 2 & e)) {
                    const e = o.mc(2)
                    o.tc('msg', e.bkgRespDto.errorMessage)
                }
            }
            function Qa(e, t) {
                if (
                    (1 & e &&
                        (o.ac(0, 'div'),
                        o.Rc(1, Ja, 1, 1, 'app-booking-confirmation', 1),
                        o.Rc(2, Xa, 1, 1, 'ng-template', 2, 3, o.Sc),
                        o.Zb()),
                    2 & e)
                ) {
                    const e = o.Ic(3),
                        t = o.mc()
                    o.Cb(1), o.tc('ngIf', t.bookingSuccess)('ngIfElse', e)
                }
            }
            function ei(e, t) {
                if (
                    (1 & e && (o.ac(0, 'div'), o.Vb(1, 'app-loyalty-purchase-response', 6), o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc()
                    o.Cb(1), o.tc('softPurchaseView', e.softPurchaseView)
                }
            }
            let ti = (() => {
                class e {
                    constructor(e, t, n, a) {
                        ;(this.store = e),
                            (this.bookingService = t),
                            (this.paymentService = n),
                            (this.langService = a)
                    }
                    ngOnInit() {
                        ;(this.bkgRespDto = this.bookingService.bookingResponse),
                            (this.payment_type = this.paymentService.paymentType + ''),
                            (this.softPurchaseView = this.paymentService.softPurchaseView),
                            null != this.bkgRespDto && null == this.bkgRespDto.errorMessage
                                ? (this.bookingSuccess = true)
                                : ((this.bookingSuccess = false), (this.langService.loader = false))
                    }
                }
                return (
                    (e.ɵfac = function (t) {
                        return new (t || e)(o.Ub(m.b), o.Ub(h.a), o.Ub(i.b), o.Ub(b.a))
                    }),
                    (e.ɵcmp = o.Ob({
                        type: e,
                        selectors: [['app-ewallet-response']],
                        decls: 2,
                        vars: 2,
                        consts: [
                            [4, 'ngIf'],
                            [3, 'bkgResponse', 4, 'ngIf', 'ngIfElse'],
                            ['style', 'padding: 50px;', 'class', 'text-center'],
                            ['bookingFailed', ''],
                            [3, 'bkgResponse'],
                            [3, 'msg'],
                            [3, 'softPurchaseView'],
                        ],
                        template: function (e, t) {
                            1 & e && (o.Rc(0, Qa, 4, 2, 'div', 0), o.Rc(1, ei, 2, 1, 'div', 0)),
                                2 & e &&
                                    (o.tc('ngIf', 'SOFT_POINT_PURCHASE' != t.payment_type),
                                    o.Cb(1),
                                    o.tc('ngIf', 'SOFT_POINT_PURCHASE' === t.payment_type))
                        },
                        directives: [d.o, Wa.a, Ya.a, Ga.a],
                        styles: [''],
                    })),
                    e
                )
            })()
            var ni = n('nDdX'),
                ai = n('aLLc')
            function ii(e, t) {
                if ((1 & e && (o.ac(0, 'a', 25), o.Tc(1), o.Zb()), 2 & e)) {
                    const e = o.mc(2)
                    o.Cb(1),
                        o.Vc(
                            ' ',
                            null == e.langService.lang
                                ? null
                                : e.langService.lang.userRegtermsConditions,
                            '',
                        )
                }
            }
            function ci(e, t) {
                if ((1 & e && (o.ac(0, 'a', 26), o.Tc(1), o.Zb()), 2 & e)) {
                    const e = o.mc(2)
                    o.Cb(1),
                        o.Vc(
                            ' ',
                            null == e.langService.lang
                                ? null
                                : e.langService.lang.userRegtermsConditions,
                            '',
                        )
                }
            }
            function si(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 8),
                        o.ac(1, 'div', 9),
                        o.Vb(2, 'div', 10),
                        o.ac(3, 'div', 11),
                        o.ac(4, 'label'),
                        o.Tc(5),
                        o.Zb(),
                        o.Zb(),
                        o.ac(6, 'div', 12),
                        o.ac(7, 'input', 13),
                        o.ic('ngModelChange', function (t) {
                            return o.Kc(e), (o.mc().emailId = t)
                        }),
                        o.Zb(),
                        o.Zb(),
                        o.Vb(8, 'div', 14),
                        o.Zb(),
                        o.ac(9, 'div', 9),
                        o.Vb(10, 'div', 10),
                        o.ac(11, 'div', 11),
                        o.ac(12, 'label'),
                        o.Tc(13),
                        o.Zb(),
                        o.Zb(),
                        o.ac(14, 'div', 12),
                        o.ac(15, 'input', 15),
                        o.ic('ngModelChange', function (t) {
                            return o.Kc(e), (o.mc().loginPassword = t)
                        }),
                        o.Zb(),
                        o.Zb(),
                        o.Vb(16, 'div', 14),
                        o.Zb(),
                        o.ac(17, 'div', 9),
                        o.Vb(18, 'div', 10),
                        o.ac(19, 'div', 16),
                        o.ac(20, 'span', 17),
                        o.ac(21, 'input', 18),
                        o.ic('ngModelChange', function (t) {
                            return o.Kc(e), (o.mc().checkboxrenew = t)
                        }),
                        o.Zb(),
                        o.Zb(),
                        o.ac(22, 'span', 19),
                        o.ac(23, 'label'),
                        o.Tc(24),
                        o.Rc(25, ii, 2, 1, 'a', 20),
                        o.Rc(26, ci, 2, 1, 'a', 21),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.ac(27, 'div', 22),
                        o.ac(28, 'div', 23),
                        o.ac(29, 'button', 24),
                        o.ic('click', function () {
                            return o.Kc(e), o.mc().checkInputAccountRenewal()
                        }),
                        o.Tc(30),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc()
                    o.Cb(5),
                        o.Vc(
                            '',
                            null == e.langService.lang
                                ? null
                                : e.langService.lang.registeredEmailId,
                            ':',
                        ),
                        o.Cb(2),
                        o.uc(
                            'placeholder',
                            null == e.langService.lang ? null : e.langService.lang.enterEmailId,
                        ),
                        o.tc('ngModel', e.emailId),
                        o.Cb(6),
                        o.Vc(
                            '',
                            null == e.langService.lang ? null : e.langService.lang.loginPassword,
                            ':',
                        ),
                        o.Cb(2),
                        o.uc(
                            'placeholder',
                            null == e.langService.lang
                                ? null
                                : e.langService.lang.enterLoginPassword,
                        ),
                        o.tc('ngModel', e.loginPassword),
                        o.Cb(6),
                        o.tc('ngModel', e.checkboxrenew),
                        o.Cb(3),
                        o.Vc(
                            '',
                            null == e.langService.lang ? null : e.langService.lang.iHaveRead,
                            ' ',
                        ),
                        o.Cb(1),
                        o.tc('ngIf', 'en' == e.langService.langChoice),
                        o.Cb(1),
                        o.tc('ngIf', 'hi' == e.langService.langChoice),
                        o.Cb(4),
                        o.Uc(null == e.langService.lang ? null : e.langService.lang.submit)
                }
            }
            function li(e, t) {
                if (1 & e) {
                    const e = o.bc()
                    o.ac(0, 'div', 27),
                        o.ac(1, 'div', 9),
                        o.Vb(2, 'div', 28),
                        o.ac(3, 'div', 29),
                        o.ac(4, 'label'),
                        o.Tc(5),
                        o.Zb(),
                        o.Zb(),
                        o.ac(6, 'div', 30),
                        o.ac(7, 'input', 31),
                        o.ic('ngModelChange', function (t) {
                            return o.Kc(e), (o.mc().passwordDTO.seqQuestion = t)
                        }),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.ac(8, 'div', 22),
                        o.ac(9, 'div', 23),
                        o.ac(10, 'button', 32),
                        o.ic('click', function () {
                            return o.Kc(e), o.mc().submitOtp()
                        }),
                        o.Tc(11),
                        o.Zb(),
                        o.Zb(),
                        o.Zb(),
                        o.Zb()
                }
                if (2 & e) {
                    const e = o.mc()
                    o.Cb(5),
                        o.Vc('', null == e.langService.lang ? null : e.langService.lang.otp, ':'),
                        o.Cb(2),
                        o.uc(
                            'placeholder',
                            null == e.langService.lang ? null : e.langService.lang.enterOTP,
                        ),
                        o.tc('ngModel', e.passwordDTO.seqQuestion),
                        o.Cb(4),
                        o.Uc(null == e.langService.lang ? null : e.langService.lang.renew)
                }
            }
            function ri(e, t) {
                if (
                    (1 & e && (o.ac(0, 'div', 33), o.ac(1, 'span', 34), o.Tc(2), o.Zb(), o.Zb()),
                    2 & e)
                ) {
                    const e = o.mc()
                    o.Cb(2),
                        o.Vc(
                            ' ',
                            null == e.langService.lang ? null : e.langService.lang.ewalletRenewMsg,
                            ' ',
                        )
                }
            }
            function oi(e, t) {
                if ((1 & e && (o.ac(0, 'div', 35), o.Tc(1), o.Zb()), 2 & e)) {
                    const e = o.mc()
                    o.Cb(1), o.Uc(e.errorMessage)
                }
            }
            const gi = [
                { path: 'bkgPaymentOptions', component: la },
                { path: 'paymentredirect', component: ga },
                { path: 'redirect/:id', component: ga },
                { path: 'purchase-loyalty', component: ka },
                { path: 'hdfcpayment', component: R },
                { path: 'ewallet-registration', component: La },
                { path: 'ewalletreg-payment', component: ja },
                { path: 'nonIndianreg-payment', component: $a },
                { path: 'loyalty-redemption-confirm', component: w },
                { path: 'ewallet-deposit', component: _a },
                { path: 'ewallet-confirm', component: C },
                { path: 'ewallet-response', component: ti },
                {
                    path: 'ewallet-account_renewal',
                    component: (() => {
                        class e {
                            constructor(e, t) {
                                ;(this.paymentService = e),
                                    (this.langService = t),
                                    (this.loginPassword = ''),
                                    (this.emailId = ''),
                                    (this.accountRenewStat = '1'),
                                    (this.passwordDTO = new ai.a())
                            }
                            ngOnInit() {}
                            checkInputAccountRenewal() {
                                if (null != this.validateEmailInput())
                                    return void (this.errorMessage = this.validateEmailInput())
                                this.errorMessage = ''
                                let e = new ni.a()
                                ;(e.emailId = this.emailId),
                                    (e.loginPassword = this.loginPassword),
                                    this.paymentService.ewalletRenewal(e).subscribe((e) => {
                                        console.log(e),
                                            (this.sDto = e),
                                            null != this.sDto.error &&
                                            void 0 !== this.sDto.error &&
                                            '' != this.sDto.error
                                                ? ((this.errorMessage = this.sDto.error),
                                                  (this.accountRenewStat = '1'))
                                                : ((this.errorMessage = this.sDto.status),
                                                  (this.accountRenewStat = '2'))
                                    })
                            }
                            submitOtp() {
                                null != this.passwordDTO.seqQuestion &&
                                null != this.passwordDTO.seqQuestion &&
                                '' != this.passwordDTO.seqQuestion
                                    ? ((this.errorMessage = ''),
                                      this.paymentService
                                          .ewalletRenewalOtp(this.passwordDTO)
                                          .subscribe((e) => {
                                              ;(this.sDto = e),
                                                  console.log(e),
                                                  null == this.sDto || null == this.sDto
                                                      ? (this.errorMessage =
                                                            this.langService.errorMsg.otpMsg1)
                                                      : null != this.sDto.error &&
                                                          void 0 !== this.sDto.error &&
                                                          '' != this.sDto.error
                                                        ? ((this.errorMessage =
                                                              this.langService.errorMsg.otpMsg1),
                                                          (this.accountRenewStat = '2'))
                                                        : (this.accountRenewStat = '3')
                                          }))
                                    : (this.errorMessage = this.langService.errorMsg.otpMsg)
                            }
                            validateEmailInput() {
                                let e = this.emailId,
                                    t = this.loginPassword
                                return (
                                    console.log('registeredEmailId-->' + this.emailId),
                                    '' === e && '' === t
                                        ? ((this.errorMsg =
                                              this.langService.errorMsg.forgetTxnPwdErr12),
                                          this.errorMsg)
                                        : '' === e
                                          ? ((this.errorMsg =
                                                this.langService.errorMsg.forgetTxnPwdErr13),
                                            this.errorMsg)
                                          : e.length < 1 || e.toString.length > 50
                                            ? ((this.errorMsg =
                                                  this.langService.errorMsg.forgetTxnPwdErr14),
                                              this.errorMsg)
                                            : /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/.test(
                                                    e,
                                                )
                                              ? '' === t
                                                  ? ((this.errorMsg =
                                                        this.langService.errorMsg.forgetTxnPwdErr16),
                                                    this.errorMsg)
                                                  : ((this.errorMsg = null), null)
                                              : ((this.errorMsg =
                                                    this.langService.errorMsg.forgetTxnPwdErr15),
                                                this.errorMsg)
                                )
                            }
                        }
                        return (
                            (e.ɵfac = function (t) {
                                return new (t || e)(o.Ub(i.b), o.Ub(b.a))
                            }),
                            (e.ɵcmp = o.Ob({
                                type: e,
                                selectors: [['app-account-renewal']],
                                decls: 9,
                                vars: 5,
                                consts: [
                                    [1, 'container', 'text-center'],
                                    [1, '', 2, 'max-width', '93%', 'margin', '0 auto'],
                                    [1, ''],
                                    [1, 'bth_header', 'heading-font', 'row', 'text-center'],
                                    ['class', 'main_h row', 4, 'ngIf'],
                                    ['class', 'form-group  row', 4, 'ngIf'],
                                    ['class', 'row text-center', 4, 'ngIf'],
                                    ['style', 'color:red; padding:10px', 4, 'ngIf'],
                                    [1, 'main_h', 'row'],
                                    [1, 'row'],
                                    [1, 'col-md-3', 'col-sm-2', 'hidden-xs'],
                                    [
                                        1,
                                        'col-md-3',
                                        'col-sm-4',
                                        'col-xs-12',
                                        'text-center',
                                        'adhr-aln',
                                        2,
                                        'padding-top',
                                        '10px',
                                    ],
                                    [1, 'col-md-3', 'col-sm-4', 'col-xs-12', 'form-group'],
                                    [
                                        'maxlength',
                                        '40',
                                        'type',
                                        'text',
                                        'name',
                                        'email',
                                        'value',
                                        '',
                                        1,
                                        'form-control',
                                        3,
                                        'ngModel',
                                        'placeholder',
                                        'ngModelChange',
                                    ],
                                    [1, 'col-md-1', 'col-sm-1', 'hidden-xs'],
                                    [
                                        'type',
                                        'password',
                                        'name',
                                        'loginPassword',
                                        'value',
                                        '',
                                        1,
                                        'form-control',
                                        3,
                                        'ngModel',
                                        'placeholder',
                                        'ngModelChange',
                                    ],
                                    [1, 'col-md-6', 'col-sm-8', 'col-xs-12'],
                                    [1, 'col-md-2', 'col-sm-2', 'col-xs-2'],
                                    [
                                        'type',
                                        'checkbox',
                                        'name',
                                        'EwalletCheckbox',
                                        'id',
                                        'checkboxewallet',
                                        'checked',
                                        '',
                                        2,
                                        'zoom',
                                        '1.5',
                                        3,
                                        'ngModel',
                                        'ngModelChange',
                                    ],
                                    [
                                        1,
                                        'col-md-10',
                                        'col-sm-10',
                                        'col-xs-10',
                                        2,
                                        'padding-top',
                                        '5px',
                                    ],
                                    [
                                        'target',
                                        '_blank',
                                        'rel',
                                        'noopener noreferrer',
                                        'style',
                                        'color: rgb(33, 61, 119);',
                                        'href',
                                        'http://contents.irctc.co.in/en/eWalletTermsAndConditions.pdf',
                                        4,
                                        'ngIf',
                                    ],
                                    [
                                        'target',
                                        '_blank',
                                        'rel',
                                        'noopener noreferrer',
                                        'style',
                                        'color: rgb(33, 61, 119);',
                                        'href',
                                        'http://contents.irctc.co.in/hi/eWalletTermsAndConditions.pdf',
                                        4,
                                        'ngIf',
                                    ],
                                    [1, 'container-fluid', 'row'],
                                    [1, 'text-center', 'col-md-12', 2, 'margin-top', '15px'],
                                    ['type', 'submit', 1, 'btn', 'btn-primary', 3, 'click'],
                                    [
                                        'target',
                                        '_blank',
                                        'rel',
                                        'noopener noreferrer',
                                        'href',
                                        'http://contents.irctc.co.in/en/eWalletTermsAndConditions.pdf',
                                        2,
                                        'color',
                                        'rgb(33, 61, 119)',
                                    ],
                                    [
                                        'target',
                                        '_blank',
                                        'rel',
                                        'noopener noreferrer',
                                        'href',
                                        'http://contents.irctc.co.in/hi/eWalletTermsAndConditions.pdf',
                                        2,
                                        'color',
                                        'rgb(33, 61, 119)',
                                    ],
                                    [1, 'form-group', 'row'],
                                    [1, 'col-lg-4', 'col-md-3', 'col-sm-2', 'hidden-xs'],
                                    [
                                        1,
                                        'col-lg-1',
                                        'col-md-2',
                                        'col-sm-4',
                                        'col-xs-12',
                                        'text-center',
                                        2,
                                        'padding-top',
                                        '10px',
                                    ],
                                    [1, 'col-lg-2', 'col-md-4', 'col-sm-6', 'col-xs-12'],
                                    [
                                        'maxlength',
                                        '10',
                                        'type',
                                        'text',
                                        'name',
                                        'otp',
                                        'value',
                                        '',
                                        1,
                                        'form-control',
                                        3,
                                        'ngModel',
                                        'placeholder',
                                        'ngModelChange',
                                    ],
                                    [
                                        'type',
                                        'submit',
                                        1,
                                        'btn',
                                        'btn-primary',
                                        'text-center',
                                        3,
                                        'click',
                                    ],
                                    [1, 'row', 'text-center'],
                                    [2, 'color', 'green', 'font-weight', 'bold'],
                                    [2, 'color', 'red', 'padding', '10px'],
                                ],
                                template: function (e, t) {
                                    1 & e &&
                                        (o.ac(0, 'div', 0),
                                        o.ac(1, 'div', 1),
                                        o.ac(2, 'div', 2),
                                        o.ac(3, 'div', 3),
                                        o.Tc(4),
                                        o.Zb(),
                                        o.Zb(),
                                        o.Rc(5, si, 31, 11, 'div', 4),
                                        o.Rc(6, li, 12, 4, 'div', 5),
                                        o.Rc(7, ri, 3, 1, 'div', 6),
                                        o.Rc(8, oi, 2, 1, 'div', 7),
                                        o.Zb(),
                                        o.Zb()),
                                        2 & e &&
                                            (o.Cb(4),
                                            o.Vc(
                                                ' ',
                                                null == t.langService.lang
                                                    ? null
                                                    : t.langService.lang.ewalletAccountRenew,
                                                ' ',
                                            ),
                                            o.Cb(1),
                                            o.tc('ngIf', '1' == t.accountRenewStat),
                                            o.Cb(1),
                                            o.tc('ngIf', '2' == t.accountRenewStat),
                                            o.Cb(1),
                                            o.tc('ngIf', '3' == t.accountRenewStat),
                                            o.Cb(1),
                                            o.tc('ngIf', '3' != t.accountRenewStat))
                                },
                                directives: [d.o, S.b, S.k, S.n, S.q, S.a],
                                encapsulation: 2,
                            })),
                            e
                        )
                    })(),
                },
            ]
            let di = (() => {
                class e {}
                return (
                    (e.ɵmod = o.Sb({ type: e })),
                    (e.ɵinj = o.Rb({
                        factory: function (t) {
                            return new (t || e)()
                        },
                        providers: [i.b],
                        imports: [[g.g.forChild(gi), P.a.forRoot(), a.c], g.g],
                    })),
                    e
                )
            })()
        },
    },
])
