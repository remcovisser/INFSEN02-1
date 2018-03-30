// -------------- Week 1 -------------- //
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
var xx = ifThenElse(is_even, double, incr);
var incr_then_double = incr.then(double);
var incr_twice = incr.then(incr);
var double_twice = double.then(double);
var my_f = incr.then(is_even);
var x = incr.then(double).f(5);
var y = incr.then(double).then(convert).f(5);
var map_countainer = function (f) {
    return Fun(function (c) { return ({ content: f.f(c.content), counter: c.counter }); });
};
var tick = Fun(function (c) { return (__assign({}, c, { counter: c.counter + 1 })); });
var incr_countainer = map_countainer(incr);
var is_countainer_even = map_countainer(is_even);
var countainer = { content: 3, counter: 0 };
var a = incr_countainer.f(countainer);
var b = incr_countainer.then(incr_countainer).then(tick).f(countainer);
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
var c = pipeline.f(option);
var map_Id = function (f) {
    return f;
};
var d = map_Id(incr).f(4);
var e = incr.f(4);
var map_Countainer_Maybe = function (f) {
    return map_countainer(map_Option(f));
};
var countainerOption = { content: { kind: "some", value: 2 }, counter: 0 };
var countainerMaybe = countainerOption;
var ee = map_Countainer_Maybe(incr).f(countainerOption).content;
console.log(printOption(ee));
//# sourceMappingURL=app.js.map