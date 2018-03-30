// -------------- Week 1 -------------- //

type Fun<a, b> = {
  f: (i: a) => b,
  then: <c>(g: Fun<b, c>) => Fun<a, c>
}

let Fun = function <a, b>(f: (val: a) => b): Fun<a, b> {
  return {
    f: f,
    then: function <c>(this: Fun<a, b>, g: Fun<b, c>): Fun<a, c> {
      return then_operator(this, g)
    }
  }
}

let then_operator = function <a, b, c>(f: Fun<a, b>, g: Fun<b, c>): Fun<a, c> {
  return Fun<a, c>(a => g.f(f.f(a)))
}

let id = function <a>(x): Fun<a, a> {
  return Fun<a, a>(x => x)
}


let incr = Fun<number, number>(x => x + 1)
let double = Fun<number, number>(x => x * 2)
let negate = Fun<boolean, boolean>(x => !x)
let is_even = Fun<number, boolean>(x => x % 2 == 0)
let convert = Fun<number, string>((x: number) => String(x))

let ifThenElse =
  function <a, b>(p: Fun<a, boolean>, _then: Fun<a, b>, _else: Fun<a, b>): Fun<a, b> {
    return Fun((x: a) => {
      if (p.f(x)) {
        return _then.f(x)
      }
      else {
        return _else.f(x)
      }
    })
  }

let xx = ifThenElse(is_even, double, incr);


let incr_then_double = incr.then(double)
let incr_twice = incr.then(incr)
let double_twice = double.then(double)
let my_f = incr.then(is_even)


let x = incr.then(double).f(5);
let y = incr.then(double).then(convert).f(5)





// -------------- Week 2 -------------- //

type Countainer<a> = { content: a, counter: number }

let map_countainer = function <a, b>(f: Fun<a, b>): Fun<Countainer<a>, Countainer<b>> {
  return Fun(c => ({ content: f.f(c.content), counter: c.counter }))
}

let tick: Fun<Countainer<number>, Countainer<number>> = Fun(c => ({ ...c, counter: c.counter + 1 }))

let incr_countainer: Fun<Countainer<number>, Countainer<number>> = map_countainer(incr)
let is_countainer_even: Fun<Countainer<number>, Countainer<boolean>> = map_countainer(is_even)

let countainer: Countainer<number> = { content: 3, counter: 0 }
let a = incr_countainer.f(countainer);
let b = incr_countainer.then(incr_countainer).then(tick).f(countainer);


type Option<a> = { kind: "none" } | { kind: "some", value: a }
let none = function <a>(): Option<a> { return { kind: "none" } }
let some = function <a>(x: a): Option<a> { return { kind: "some", value: x } }

let map_Option = function <a, b>(f: Fun<a, b>): Fun<Option<a>, Option<b>> {
  return Fun(x => x.kind == "none" ? none<b>() : some<b>(f.f(x.value)))
}

function printOption(x: Option<number>): string {
  if (x.kind == "some")
    return `the value is ${x.value}`
  else
    return "there is no value"
}

let pipeline: Fun<Option<number>, Option<number>> = map_Option(incr.then(double.then(incr)))

let option: Option<number> = { kind: "some", value: 2 };
let c = pipeline.f(option);


type Id<a> = a
let map_Id = function <a, b>(f: Fun<a, b>): Fun<Id<a>, Id<b>> {
  return f
}

let d = map_Id(incr).f(4);
let e = incr.f(4);

type CountainerMaybe<a> = Countainer<Option<a>>
let map_Countainer_Maybe = function <a, b>(f: Fun<a, b>): Fun<CountainerMaybe<a>, CountainerMaybe<b>> {
  return map_countainer<Option<a>, Option<b>>(map_Option<a, b>(f));
}


let countainerOption: Countainer<Option<number>> = { content: { kind: "some", value: 2 }, counter: 0 }
let countainerMaybe: CountainerMaybe<number> = countainerOption;
let ee = map_Countainer_Maybe(incr).f(countainerOption).content;
console.log(printOption(ee));