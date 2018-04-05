var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var Fun = function (f) {
    return {
        f: f,
        then: function (g) {
            return then_operator(this, g);
        }
    };
};
var then_operator = function (f, g) {
    return Fun(function (a) { return g.f(f.f(a)); });
};
var id = function (x) {
    return Fun(function (x) { return x; });
};
var incr = Fun(function (x) { return x + 1; });
var double = Fun(function (x) { return x * 2; });
var negate = Fun(function (x) { return !x; });
var is_even = Fun(function (x) { return x % 2 == 0; });
var convert = Fun(function (x) { return String(x); });
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
var incr_then_double = incr.then(double);
var incr_twice = incr.then(incr);
var double_twice = double.then(double);
var my_f = incr.then(is_even);
var ab = incr.then(double).f(5);
var ac = incr.then(double).then(convert).f(5);
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
var zero_number = function (_) {
    return 0;
};
var plus_number = function (p) {
    return p.fst + p.snd;
};
var da = { fst: zero_number({}), snd: 10 };
var db = plus_number(da);
var dc = (plus_number({ fst: 10, snd: 20 }));
var dd = plus_number({ fst: 10, snd: plus_number({ fst: 10, snd: 20 }) });
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
    return map_Pair(f, id(0));
};
var unit_WithNum = function () {
    return Fun(function (x) { return ({ fst: x, snd: 0 }); });
};
var join_WithNum = function () {
    return Fun(function (x) { return ({ fst: x.fst.fst, snd: x.snd + x.fst.snd }); });
};
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
var unit_Option2 = function () { return some2(); };
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
//# sourceMappingURL=app.js.map