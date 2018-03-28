var Fun = function (f) { return { f: f }; };
// let double = Fun<number,number>(x => x * 4)
// let aaa = double.f(10);
var x = 10;
var y = 20;
var then = function (f, g) {
    return Fun(function (a) { return g.f(f.f(a)); });
};
//# sourceMappingURL=app.js.map