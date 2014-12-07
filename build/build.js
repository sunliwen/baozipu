$(function () {
    function e() {
        trackEvent(["welcomeSection", $welcome]);
        switchTo($welcome, "bounceInDown"), $welcome.show(), C && (C = !1, D ? g(["../images/buy_btn_small.png", "../images/restart_btn_small.png", "../images/out_small.png", "../images/share_info.png", "../images/share_arrow_small.png", "../images/congrats_small.png", "../images/plus.png", "../images/share_msg.png", "../images/compiled/small_ending@2x.png"]) : g(["../images/buy_btn.png", "../images/restart_btn.png", "../images/out.png", "../images/share_info.png", "../images/share_arrow.png", "../images/congrats.png", "../images/plus.png", "../images/share_msg.png", "../images/compiled/normal_ending@2x.png"]),
            $.getJSON("data/data.json", function (e) {
                $.extend(w, e.data);
            })
        )
    }

    function showStartPage() {
        window.navigator.msPointerEnabled || "desktop" === I ? $(".start_btn").on("click", function () {
            switchTo($welcome, "pressRelease", function () {
                $welcome.hide(), $(".start_btn").data("animating", !1)
            }), setTimeout(function () {
                viewQuestion(E)
            }, 100), S++, trackEvent("click_start_btn", S)
        }) : $(".start_btn").on("touchstart", function () {
            $(this).data("animating") || ($welcome.addClass("pressDown"), $(this).data("canceled", !1), $(this).addClass("hover"))
        }).on("touchmove", function (e) {
            e.preventDefault(), $(this).data("animating") || t(e, 10) || ($(this).data("canceled", !0).removeClass("hover"), $welcome.removeClass("pressDown"))
        }).on("touchcancel", function () {
            $(this).data("canceled", !0).removeClass("hover"), $welcome.removeClass("pressDown")
        }).on("touchend", function () {
            $(this).data("canceled") || $(this).data("animating") || ($(this).data("animating", !0), $welcome.removeClass("pressDown"), switchTo($welcome, "pressRelease", function () {
                $welcome.hide(), $(".start_btn").data("animating", !1)
            }), setTimeout(function () {
                viewQuestion(E)
            }, 100), $(this).removeClass("hover"), S++, trackEvent("click_start_btn", S))
        })
    }

    function t(e, n) {
        n || (n = 0);
        var t = $(e.currentTarget).width(), i = $(e.currentTarget).height(), o = e.originalEvent.changedTouches[0].clientX - $(e.currentTarget).offset().left, a = e.originalEvent.changedTouches[0].clientY - $(e.currentTarget).offset().top;
        return o > -n && t + n > o && a > -n && i + n > a
    }

    function viewQuestion(e, n) {
        var t = _();
        $(".money", t).html(k + " 万"), $(".title", t).html("第" + y + "题"), $(".describe", t).html(e.describe), h(t);
        $(".choice", t);
        $("button[data-choice=A]", t).html(e.A.describe), $("button[data-choice=B]", t).html(e.B.describe), e.C && e.C.describe ? $("button[data-choice=C]", t).html(e.C.describe) : $("button[data-choice=C]", t).remove(), switchTo(t, "moveInRight", function () {
            o(t), n && $(".income", t).html(n).show()
        }), t.css("visibility", "visible"), trackEvent("view_question", y)
    }

    function o(e) {
        var n = window.navigator.msPointerEnabled || "desktop" === I ? "click" : "touchend", t = $(".choice", e), o = function () {
            t.off(n, o);
            var c = $(this).attr("data-choice"), d = E[c];
            if (x += d.rp, k += d.income, 0 >= x) {
                var m = w[E.rpEnding];
                q ? s(m) : a(m, d)
            } else if (0 >= k) {
                var m = w[E.moneyEnding];
                q ? s(m) : a(m, d)
            } else if (nextQuestion = w[d.next]) {
                y++;
                var l = E.annualGain;
                l += parseInt(k * E.interest), k += l, E = nextQuestion, 8 === y && (l = d.income), viewQuestion(nextQuestion, l)
            } else {
                "不退休，让我再活五百年" === d.describe && (d.ending = Math.random() < .5 ? "e_3_19_2_1" : "e_3_19_2_2");
                var m = w[d.ending];
                s(m)
            }
            switchTo(e, "moveOutLeft", function () {
                e.remove()
            })
        };
        t.on("touchmove", function (e) {
            e.preventDefault()
        }).on(n, o)
    }

    function a(e, n) {
        if (!E.B.next)return s(e), void 0;
        q = !0;
        var t = Math.random();
        if (1 / 3 > t)var o = w.q_revive[0]; else if (2 / 3 > t)var o = w.q_revive[1]; else var o = w.q_revive[2];
        var a = _();
        $(".money", a).remove(), $(".title", a).html("WARNING"), $(".describe", a).html(o.describe);
        var c = $(".choice", a);
        $("button[data-choice=A]", a).html(o.A.describe), $("button[data-choice=B]", a).html(o.B.describe), $("button[data-choice=C]", a).html(o.C.describe);
        var l = window.navigator.msPointerEnabled || "desktop" === I ? "click" : "touchend", u = function () {
            c.off(l, u);
            var t = $(".msg"), o = $(this).attr("data-choice");
            if ("C" === o) {
                var d = E.B;
                y++, nextQuestion = w[d.next], x -= n.rp, k -= n.income, x += d.rp, k += d.income, 0 > k && (k -= d.income);
                var _ = E.annualGain;
                _ += parseInt(k * E.interest), k += _, E = nextQuestion;
                var g = $(".success-msg", t);
                switchTo(g, "zoomIn"), t.addClass("success").show(), setTimeout(function () {
                    t.addClass("dark")
                }, 0), $("button", g).one(l, function () {
                    t.removeClass("dark"), switchTo(g, "zoomOut", function () {
                        t.hide().removeClass("success"), viewQuestion(nextQuestion, _)
                    }), a.remove(), m(), trackEvent("click_continue_btn")
                })
            } else {
                var g = $(".fail-msg", t);
                switchTo(g, "zoomIn"), t.addClass("fail").show(), setTimeout(function () {
                    t.addClass("dark")
                }, 0), $("button", g).one(l, function () {
                    t.removeClass("dark"), a.remove(), switchTo(g, "zoomOut", function () {
                        t.hide().removeClass("fail")
                    }), setTimeout(function () {
                        s(e, !0)
                    }, 220), trackEvent("click_show_ending_btn")
                })
            }
            trackEvent("click_revive_choice_btn", o)
        };
        c.on("touchmove", function (e) {
            e.preventDefault()
        }).on(l, u), blockBackground(function () {
            a.appendTo(document.body), switchTo(a, "bounceInDown"), a.css("visibility", "visible")
        }), trackEvent("view_revive_question", y)
    }

    function s(e) {
        var n = $(".ending_title", T), t = $(".ending_card", T);
        $(".ending_info").html(e.info), e.isSuccess ? n.addClass("success") : n.removeClass("success"), D ? t.removeClass().addClass("ending_card z-icon-ending_" + e.type + "_small") : t.removeClass().addClass("ending_card z-icon-ending_" + e.type);
        var i = $("section[class=question]");
        i.length ? (switchTo(i, "moveOutLeft", function () {
            i.remove()
        }), e.isSuccess ? (switchTo(T, "moveInRight", function () {
            showResultPage()
        }), T.show()) : blockBackground(function () {
            switchTo(T, "bounceInDown", function () {
                showResultPage()
            }), T.show()
        })) : (switchTo(T, "fadeIn", function () {
            showResultPage()
        }), T.show());
        var o = w.shareEndings[e.type];
        document.title = o, "wechat" === I ? (T.removeClass("no-share"), O.desc = o, wechat("friend", O, P), wechat("timeline", O, P), wechat("weibo", O, P)) : "weibo" == I && (document.title = "#财务包子铺# - " + document.title), trackEvent("view_ending", e.type)
    }

    function showResultPage() {
        var n = window.navigator.msPointerEnabled || "desktop" === I ? "click" : "touchend";
        $(".restart_btn", T).one(n, function () {
            y = 1, q = !1, x = v, k = f, E = w.q_1_1, switchTo(T, "fadeOut", function () {
                T.hide(), e()
            }), m(), trackEvent("click_restart_btn")
        }), $(".buy_btn", T).one(n, function () {
            trackEvent("click_buy_btn"), setTimeout(function () {
                window.location.href = "http://www.amazon.cn/dp/B00P0RR1LO"
            }, 100)
        })
    }

    function switchTo(e, n, t) {
        var i = $(e);
        i.addClass("animated " + n), $(e).one("webkitAnimationEnd animationend", function () {
            i.removeClass("animated " + n), t && t()
        })
    }

    function blockBackground(e) {
        document.documentElement.style.animationPlayState = "paused", document.documentElement.style.WebkitAnimationPlayState = "paused";
        var n = window.getComputedStyle(document.documentElement, null).getPropertyValue("background-color");
        $deadMask.style.display = "block", $deadMask.style.backgroundColor = n, setTimeout(function () {
            $deadMask.style.backgroundColor = "#000", setTimeout(e, 500)
        }, 10)
    }

    function m() {
        var e = window.getComputedStyle(document.documentElement, null).getPropertyValue("background-color");
        $deadMask.style.backgroundColor = e, setTimeout(function () {
            $deadMask.style.display = "none", document.documentElement.style.animationPlayState = "running", document.documentElement.style.WebkitAnimationPlayState = "running"
        }, 500)
    }

    function l() {
        var e = navigator.userAgent;
        return -1 === e.indexOf("Mobile") ? "desktop" : -1 !== e.indexOf("QQ") ? "qq" : -1 !== e.indexOf("Weibo") ? "weibo" : -1 !== e.indexOf("MicroMessenger") ? "wechat" : "undefined" != typeof WeixinJSBridge ? "wechat" : "unknown"
    }

    function getElementsByClassName(className) {
        return document.getElementsByClassName(className)[0]
    }

    function _() {
        var e = $(".question.next");
        return e.clone().appendTo(document.body), e.removeClass("next"), e
    }

    function g(e, n) {
        for (var t = 0, i = function () {
            t++, t === e.length && n && n()
        }, o = [], a = 0; a < e.length; a++)o[a] = new Image, o[a].onload = i, o[a].src = e[a]
    }

    function h(e) {
        for (var n = $(".choice", e), t = $(".choices", e).html(""), i = p(), o = 0; 3 > o; o++)t.append(n[i[o]])
    }

    function p() {
        for (var e, n, t = [0, 1, 2], i = t.length; i; e = Math.floor(Math.random() * i), n = t[--i], t[i] = t[e], t[e] = n);
        return t
    }

    function trackEvent(e, n) {
        if(window._gaq) {
            window._gaq.push(["_trackEvent", "baozipu", e, n + ""]);
        } else {
            console.log(["_trackEvent", "baozipu", e, n + ""]);
        }
    }

    var f = 60, v = 250, w = {
        q_1_1: {
            describe: "首先是店址。下木议员说：权力和地产的关键都在于位置，你越靠近中心，你就越有价值。那么包子铺的位置要选在哪个中心呢：",
            A: {
                rp: 0,
                income: -15,
                next: "q_1_2",
                describe: "商业中心国贸 CBD，工作日整箱整箱的上班族"
            },
            B: {
                rp: 0,
                income: -10,
                next: "q_1_2",
                describe: "交通中心东直门，全年外来人口穿梭不断"
            },
            C: {
                rp: -30,
                income: -5,
                next: "q_1_2",
                describe: "院校中心学院路，管它清华北大学生钱最好赚"
            },
            annualGain: 0,
            interest: 0
        },
        q_1_2: {
            describe: "然后就是包子的口味了。据说，有品牌愿意为一个祖传牛肉汤花 500 万。你会选择：",
            A: {rp: 0, income: -15, next: "q_1_3", describe: "买断鼎泰丰的秘方"},
            B: {rp: 0, income: -10, describe: "从肉联厂购进现成标准馅料", next: "q_1_3"},
            C: {rp: -50, income: -5, describe: "家楼下菜场自己买菜研制", next: "q_1_3"},
            annualGain: 0,
            interest: 0
        },
        q_1_3: {
            describe: "包子铺就差一个做包子的了，正如很多创业项目只差一个写代码的了，你要从什么渠道招帮手：",
            A: {
                rp: 0,
                income: -15,
                next: "q_1_4",
                describe: "挖来老李饺子馆的厨子，工资翻番，一箭双雕"
            },
            B: {rp: 0, income: -10, next: "q_1_4", describe: "去招聘网站发广告，高薪钓大厨"},
            C: {
                rp: -25,
                income: -5,
                next: "q_1_4",
                describe: "让已退休的老爸帮忙，成本低，好控制"
            },
            annualGain: 0,
            interest: 0
        },
        q_1_4: {
            describe: "经过七七四十九天的酝酿，你夜观天象，包子店开张的吉日到了。该怎么让食客知道呢：",
            A: {
                rp: 0,
                income: -15,
                next: "q_1_5",
                describe: "在《北京晚报》报上登半版广告，很贵但是覆盖广"
            },
            B: {
                rp: 0,
                income: -10,
                next: "q_1_5",
                describe: "请美食作家来免费试吃，写知乎专栏评价"
            },
            C: {
                rp: -50,
                income: -5,
                next: "q_1_5",
                describe: "雇人在包子店附近塞传单，虽然扰民但覆盖精准嘛"
            },
            moneyEnding: "e_1_4_1",
            annualGain: 20,
            interest: 0
        },
        e_1_4_1: {
            type: 1,
            info: "事实证明，爱吃包子的人不看报纸。一无所有的你想到了曾经在一无所有时拥有过的她。你鼓起勇气说这么多年从未忘记她。她十分感动，然后嫁给了老李。"
        },
        q_1_5: {
            describe: "包子铺迎来了第一次进账。成为老板后的第一桶金，你打算：",
            A: {
                rp: 0,
                income: -25,
                next: "q_1_6",
                describe: "把包子铺的店面装修成花梨木的明式风格，做精品包子铺"
            },
            B: {rp: 0, income: -10, next: "q_1_6", describe: "统统投资银行理财产品，保值为先"},
            C: {
                rp: -9999,
                income: 0,
                next: "q_1_6",
                describe: "给之前认识的大妞买件貂儿（紫貂皮哦！）"
            },
            interest: 0,
            annualGain: 20,
            rpEnding: "e_1_5_1",
            moneyEnding: "e_1_5_2"
        },
        e_1_5_1: {
            type: 3,
            info: "大妞沉迷于你的揉面手艺，揉了又揉，你最终因为纵欲而倾家荡产。你靠着屡经考验的揉面手艺被一家按摩店收留，获得客人们的一致好评，成为头牌。"
        },
        e_1_5_2: {
            type: 2,
            info: "醒木一拍，你的包子铺已经被德云社低价收购了。失败后的你，凭借蒸包子不怕热的技能，在一家洗浴中心做搓澡工，日搓体泥三百两，获得了中心年度员工。"
        },
        q_1_6: {
            describe: "包子铺已进入稳定盈利期，做出一番事业的时机到了。英明如你，开始融资吧：",
            A: {rp: 0, income: 0, next: "q_2_1_1", describe: "最保险，还是找银行申请贷款吧"},
            B: {
                rp: 0,
                income: 0,
                next: "q_2_2_1",
                describe: "想个好商业模式，寻求投资人的风险投资"
            },
            C: {
                rp: 0,
                income: 0,
                next: "q_2_3_1",
                describe: "通过民间借贷筹钱，虽然有风险，但是很容易筹到"
            },
            rpEnding: "",
            moneyEnding: "",
            annualGain: 0,
            interest: 0
        },
        q_revive: [{
            describe: "开包子铺不易啊，稍有不慎就要倒闭了。这时有一张真人前来食包，你给他讲了你即将破产的血泪故事，他大笑三声，掏出三本书来，你选择：",
            A: {describe: "卡拉马佐夫兄弟"},
            B: {describe: "贫穷的本质"},
            C: {describe: "金钱有术"}
        }, {
            describe: "经营之路步步惊心，一步走错就会倒闭啊。这时有一张真人前来食包，你给他讲了你即将破产的血泪故事，他大笑三声，掏出三本书来，你选择：",
            A: {describe: "卡拉马佐夫兄弟"},
            B: {describe: "贫穷的本质"},
            C: {describe: "金钱有术"}
        }, {
            describe: "老板你决策失误了啊，包子铺就要倒闭啦。这时有一张真人前来食包，你给他讲了你即将破产的血泪故事，他大笑三声，掏出三本书来，你选择：",
            A: {describe: "卡拉马佐夫兄弟"},
            B: {describe: "贫穷的本质"},
            C: {describe: "金钱有术"}
        }]
    },
        C = !0,
        y = 1,
        q = !1,
        x = v,
        k = f,
        E = w.q_1_1,
        $deadMask = getElementsByClassName("dead_mask"),
        $welcome = (getElementsByClassName("ending"),
            $(".welcome")),
        T = $(".ending"),
        I = l(),
        D = document.documentElement.clientHeight <= 450 ? !0 : !1;
    setTimeout(function () {
        "weibo" === I && (document.title = "#财务包子铺# - 能闯到 17 题之后的都是人生赢家。")
    }, 1e3);
    var O = {
        app: "", img: function () {
            return location.origin + "/images/share_img.png"
        }, link: location.origin, desc: "能闯到 17 题之后的都是人生赢家。", title: "财务包子铺"
    }, P = function (e) {
        "send_app_msg:confirm" === e.err_msg ? trackEvent("wechat_share_friend", "success") : "send_app_msg:cancel" === e.err_msg ? trackEvent("wechat_share_friend", "cancel") : "share_timeline:ok" === e.err_msg ? trackEvent("wechat_share_timeline", "success") : "share_timeline:cancel" === e.err_msg ? trackEvent("wechat_share_timeline", "cancel") : trackEvent("wechat_share", "unknow")
    }, S = 0, G = function () {
        D ? g(["images/logo_small.png", "images/start_btn_small.png", "images/A_small.png", "images/B_small.png", "images/C_small.png", "images/question_title_bg_small.png", "images/coin_small.png", "images/share_img.png"], e) : g(["images/logo.png", "images/start_btn.png", "images/A.png", "images/B.png", "images/C.png", "images/question_title_bg.png", "images/coin.png", "images/share_img.png"], e), "wechat" === I && (wechat("friend", O, P), wechat("timeline", O, P)), showStartPage()
    };
    G()
});