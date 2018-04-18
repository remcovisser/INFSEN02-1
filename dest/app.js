"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var Immutable = require("immutable");
var Fun = function (f) {
    return {
        f: f,
        then: function (g) {
            var _this = this;
            //return then_operator(this, g)
            return Fun(function (a) { return g.f(_this.f(a)); });
        },
        repeat: function () {
            var _this = this;
            return Fun(function (x) { return repeat(_this, x); });
        }
    };
};
// let then_operator = function <a, b, c>(f: Fun<a, b>, g: Fun<b, c>): Fun<a, c> {
//   return Fun<a, c>(a => g.f(f.f(a)))
// }
var id = function () { return Fun(function (x) { return x; }); };
var incr = Fun(function (x) { return x + 1; });
var double = Fun(function (x) { return x * 2; });
var negate = Fun(function (x) { return !x; });
var is_even = Fun(function (x) { return x % 2 == 0; });
var convert = Fun(function (x) { return String(x); });
var square = Fun(function (x) { return x * x; });
var isPositive = Fun(function (x) { return x > 0; });
var isEven = Fun(function (x) { return x % 2 == 0; });
var invert = Fun(function (x) { return -x; });
var squareRoot = Fun(function (x) { return Math.sqrt(x); });
var ifThenElse = function (p, _then, _else) {
    return Fun(function (x) {
        if (p.f(x)) {
            return _then.f(x);
        }
        else {
            return _else.f(x);
        }
    });
};
var aa = ifThenElse(is_even, double, incr);
var x = ifThenElse(is_even, double, double.then(double));
x.f(5);
var ab = aa.f(5);
var ac = incr.then(is_even).f(5);
var ad = incr.then(double).then(convert).f(5);
var repeat = function (f, n) {
    return (n <= 0) ? f : f.then(repeat(f, incr.f(n)));
};
var map_countainer = function (f) {
    return Fun(function (c) { return ({ content: f.f(c.content), counter: c.counter }); });
};
var tick = Fun(function (c) { return (__assign({}, c, { counter: c.counter + 1 })); });
var incr_countainer = map_countainer(incr);
var is_countainer_even = map_countainer(is_even);
var countainer = { content: 3, counter: 0 };
var ba = incr_countainer.f(countainer);
var bb = incr_countainer.then(incr_countainer).then(tick).f(countainer);
var none = function () { return { kind: "none" }; };
var some = function (x) { return { kind: "some", value: x }; };
var map_Option = function (f) {
    return Fun(function (x) { return x.kind == "none" ? none() : some(f.f(x.value)); });
};
function printOption(x) {
    if (x.kind == "some")
        return "the value is " + x.value;
    else
        return "there is no value";
}
var pipeline = map_Option(incr.then(double.then(incr)));
var option = { kind: "some", value: 2 };
var ca = pipeline.f(option);
var map_Id = function (f) { return f; };
var cb = map_Id(incr).f(4);
var cc = incr.f(4);
var map_Countainer_Maybe = function (f) {
    return map_countainer(map_Option(f));
};
var countainerOption = { content: { kind: "some", value: 2 }, counter: 0 };
var countainerMaybe = countainerOption;
var cd = map_Countainer_Maybe(incr).f(countainerOption).content;
var map_Triplet = function (f) {
    return Fun(function (t) {
        return {
            x: f.f(t.x),
            y: f.f(t.y),
            z: f.f(t.z)
        };
    });
};
var map_Constant = function (f) {
    return Fun(function (x) {
        return x;
    });
};
var ce = map_Option(incr.then(double)).f(option);
var cf = map_Option(incr).then(map_Option(double)).f(option);
var cg = map_Option(incr).then(map_Option(incr));
var Unit = {};
var apply = function () { return Fun(function (p) { return p.fst.f(p.snd); }); };
var zero_int = Fun(function (_) { return 0; });
var plus_int = Fun(function (ab) { return ab.fst + ab.snd; });
var verify_identity_int = function (x) {
    return plus_int.f({ fst: zero_int.f(Unit), snd: x }) == x &&
        plus_int.f({ snd: zero_int.f(Unit), fst: x }) == x;
};
var verify_assoc_int = function (a, b, c) {
    return plus_int.f({ fst: plus_int.f({ fst: a, snd: b }), snd: c }) ==
        plus_int.f({ fst: a, snd: plus_int.f({ fst: b, snd: c }) });
};
var da = { fst: zero_int.f(Unit), snd: 10 };
var db = plus_int.f(da);
var dc = (plus_int.f({ fst: 10, snd: 20 }));
var dd = plus_int.f({ fst: 10, snd: plus_int.f({ fst: 10, snd: 20 }) });
var zero_string = function (_) {
    return "";
};
var plus_string = function (p) {
    return p.fst.concat(p.snd);
};
var de = (plus_string({ fst: "a", snd: "b" }));
var map_Fun_n = function (f, p) {
    return p.then(f);
};
var unit_Fun_n = function () {
    return Fun(function (x) { return Fun(function (i) { return x; }); });
};
var join_Fun_n = function () {
    return Fun(function (f) { return Fun(function (i) { return f.f(i).f(i); }); });
};
var fst = function () { return Fun(function (p) { return p.fst; }); };
var snd = function () { return Fun(function (p) { return p.snd; }); };
var map_Pair = function (f, g) {
    return Fun(function (p) { return ({ fst: f.f(p.fst), snd: g.f(p.snd) }); });
};
var map_WithNum = function (f) {
    return map_Pair(f, id());
};
var unit_WithNum = function () {
    return Fun(function (x) { return ({ fst: x, snd: 0 }); });
};
var join_WithNum = function () {
    return Fun(function (x) { return ({ fst: x.fst.fst, snd: x.snd + x.fst.snd }); });
};
var ea = { fst: 10, snd: 30 };
var eb = map_WithNum(incr).f(ea);
var none2 = function () { return ({
    v: { k: "n" },
    then: function (k) { return bind_Option2(this, k); }
}); };
var some2 = function () {
    return Fun(function (x) { return ({
        v: { k: "s", v: x },
        then: function (k) { return bind_Option2(this, k); }
    }); });
};
var map_Option2 = function (f) {
    return Fun(function (x) { return x.v.k == "n" ? none2() : f.then(some2()).f(x.v.v); });
};
var unit_Option = function () { return some2(); };
var join_Option2 = function () {
    return Fun(function (x) { return x.v.k == "n" ? none2() : x.v.v; });
};
var bind_Option2 = function (p, k) {
    return map_Option2(Fun(k)).then(join_Option2()).f(p);
};
var safe_div = function (a, b) {
    return a.then(function (a_v) {
        return b.then(function (b_v) {
            return b_v == 0 ? none2() : some2().f(a_v / b_v);
        });
    });
};
function printOption2(x) {
    if (x.v.k == "s")
        return "the value is " + x.v.v;
    else
        return "there is no value";
}
var fa = some2().f(10);
var fb = some2().f(20);
console.log(printOption2(safe_div(fa, fb)));
var run_St = function () { return Fun(function (p) { return p.run; }); };
var mk_St = function (run) { return ({
    run: run,
    then: function (k) { return bind_St(this, k); }
}); };
var map_St = function (f) {
    return Fun(function (p) { return mk_St(p.run.then(map_Pair(f, id()))); });
};
var join_St = function () {
    return Fun(function (p) { return mk_St(p.run.then(map_Pair(run_St(), id())).then(apply())); });
};
var unit_St = function (a) {
    return mk_St(Fun(function (s) { return ({ fst: a, snd: s }); }));
};
var bind_St = function (p, k) {
    return map_St(Fun(k)).then(join_St()).f(p);
};
var add_st = function (p, q) {
    return p.then(function (p_v) {
        return q.then(function (q_v) {
            return unit_St(p_v + q_v);
        });
    });
};
var render_nothing = Fun(function (b) { return ({ fst: {}, snd: b }); });
var render_string = function (s) { return (Fun(function (b) { return ({ fst: {}, snd: b + s }); })); };
var render_asterisk = render_string("*");
var render_space = render_string(" ");
var render_newline = render_string("\n");
var run_StFail = function () { return Fun(function (p) { return p.run; }); };
var mk_StateFail = function (run) { return ({
    run: run,
    then: function (k) { return bind_StFail(this, k); }
}); };
var unit_StFail = function (a) {
    return mk_StateFail(Fun(function (s) { return unit_Option().f({ fst: a, snd: s }); }));
};
var fail_StFail = function () {
    return mk_StateFail(Fun(function (s) { return none2(); }));
};
var map_StFail = function (f) {
    return Fun(function (p) { return mk_StateFail(p.run.then(map_Option2(map_Pair(f, id())))); });
};
var join_StFail = function () {
    return Fun(function (p) {
        return mk_StateFail(p.run.then(map_Option2(map_Pair(run_StFail(), id()).then(apply())).then(join_Option2())));
    });
};
var bind_StFail = function (p, k) {
    return map_StFail(Fun(k)).then(join_StFail()).f(p);
};
var get_st_fail = function () {
    return mk_StateFail(Fun(function (s) { return some2().f({ fst: s, snd: s }); }));
};
var set_st_fail = function (new_s) {
    return mk_StateFail(Fun(function (s) { return some2().f({ fst: {}, snd: new_s }); }));
};
// -------------- Week 8 -------------- //
var together = function (p, q) {
    return p.then(function (p_v) {
        return q.then(function (q_v) {
            return unit_StFail({ fst: p_v, snd: q_v });
        });
    });
};
var mt_if = function (c, t, e) {
    return c.then(function (c_v) { return c_v ? t : e; });
};
var get_var = function (v) {
    return get_st_fail().then(function (m) {
        return m.has(v) ? unit_StFail(m.get(v))
            : fail_StFail();
    });
};
var set_var = function (v, e) {
    return get_st_fail().then(function (m) {
        return set_st_fail(m.set(v, e));
    });
};
var swap_a_b = together(get_var("a"), get_var("b")).then(function (_a) {
    var a_v = _a.fst, b_v = _a.snd;
    return together(set_var("a", b_v), set_var("b", a_v)).then(function (_) {
        return unit_StFail(a_v + b_v);
    });
});
var initial_memory = Immutable.Map([["a", 1], ["b", 2]]);
var mk_Thread = function (run) { return ({ run: run }); };
var map_ThreadResult = function (f) {
    return Fun(function (r) {
        return r.k == "res" ?
            ({ k: "res", v: map_Pair(id(), f).f(r.v) })
            : r.k == "fail" ?
                ({ k: "fail", v: r.v })
                : ({ k: "brrrr", v: map_Pair(map_Thread(f), id()).f(r.v) });
    });
};
var map_Thread = function (f) {
    return Fun(function (p) {
        return mk_Thread(p.run.then(map_ThreadResult(f)));
    });
};
var unit = function (a) {
    return mk_Thread(Fun(function (s0) { return ({ k: "res", v: { fst: s0, snd: a } }); }));
};
var fail = function (e) {
    return mk_Thread(Fun(function (s0) { return ({ k: "fail", v: e }); }));
};
var freeze = function () {
    return mk_Thread(Fun(function (s0) { return ({ k: "brrrr", v: { fst: unit({}), snd: s0 } }); }));
};
var join_Thread = function () {
    return Fun(function (pp) {
        return mk_Thread(Fun(function (s0) {
            var qp = pp.run.f(s0);
            if (qp.k == "res") {
                var p = qp.v.snd;
                var s1 = qp.v.fst;
                var q = p.run.f(s1);
                return q;
            }
            else if (qp.k == "fail") {
                return { k: "fail", v: qp.v };
            }
            else {
                var pp1 = qp.v.fst;
                var s1 = qp.v.snd;
                var p = join_Thread().f(pp1);
                var q = p.run.f(s1);
                return q;
            }
        }));
    });
};
//# sourceMappingURL=app.js.map