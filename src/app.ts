import * as Immutable from "immutable"

// -------------- Week 1 -------------- //
type Fun<a, b> = {
  f: (i: a) => b,
  then: <c>(g: Fun<b, c>) => Fun<a, c>
  repeat: () => Fun<number, Fun<a, a>>
}

let Fun = function <a, b>(f: (val: a) => b): Fun<a, b> {
  return {
    f: f,
    then: function <c>(this: Fun<a, b>, g: Fun<b, c>): Fun<a, c> {
      return Fun<a, c>(a => g.f(this.f(a)))
    },
    repeat: function (this: Fun<a, a>): Fun<number, Fun<a, a>> {
      return Fun<number, Fun<a, a>>(x => repeat(this, x))
    }
  }
}

let id = <a>(): Fun<a, a> => Fun(x => x)

let incr = Fun<number, number>(x => x + 1)
let double = Fun<number, number>(x => x * 2)
let negate = Fun<boolean, boolean>(x => !x)
let is_even = Fun<number, boolean>(x => x % 2 == 0)
let convert = Fun<number, string>((x: number) => String(x))
let square = Fun((x: number) => x * x)
let isPositive = Fun((x: number) => x > 0)
let isEven = Fun((x: number) => x % 2 == 0)
let invert = Fun((x: number) => -x)
let squareRoot = Fun((x: number) => Math.sqrt(x))

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

let aa = ifThenElse(is_even, double, incr)
let ab = aa.f(5);

let ac = incr.then(is_even).f(5);
let ad = incr.then(double).then(convert).f(5)


let repeat = <a>(f: Fun<a, a>, n: number): Fun<a, a> =>
  (n <= 0) ? f : f.then(repeat(f, incr.f(n)))



// -------------- Week 2 -------------- //
type Countainer<a> = { content: a, counter: number }

let map_countainer = function <a, b>(f: Fun<a, b>): Fun<Countainer<a>, Countainer<b>> {
  return Fun(c => ({ content: f.f(c.content), counter: c.counter }))
}

let tick: Fun<Countainer<number>, Countainer<number>> = Fun(c => ({ ...c, counter: c.counter + 1 }))
let incr_countainer: Fun<Countainer<number>, Countainer<number>> = map_countainer(incr)
let is_countainer_even: Fun<Countainer<number>, Countainer<boolean>> = map_countainer(is_even)

let countainer: Countainer<number> = { content: 3, counter: 0 }
let ba = incr_countainer.f(countainer);

type Option<a> = { kind: "none" } | { kind: "some", value: a }
let none = function <a>(): Option<a> { return { kind: "none" } }
let some = function <a>(x: a): Option<a> { return { kind: "some", value: x } }
let option: Option<number> = { kind: "some", value: 2 };

let map_Option = function <a, b>(f: Fun<a, b>): Fun<Option<a>, Option<b>> {
  return Fun(x => x.kind == "none" ? none<b>() : some<b>(f.f(x.value)))
}

function printOption(x: Option<number>): string {
  if (x.kind == "some")
    return `the value is ${x.value}`
  else
    return "there is no value"
}

let bb: Fun<Option<number>, Option<number>> = map_Option(incr.then(double.then(incr)))
let ca = bb.f(option);

type Id<a> = a
let map_Id = <a, b>(f: Fun<a, b>): Fun<Id<a>, Id<b>> => f

let cb = map_Id(incr).f(4);
let cc = incr.f(4);

type CountainerMaybe<a> = Countainer<Option<a>>
let map_Countainer_Maybe = function <a, b>(f: Fun<a, b>): Fun<CountainerMaybe<a>, CountainerMaybe<b>> {
  return map_countainer<Option<a>, Option<b>>(map_Option<a, b>(f));
}


let countainerOption: Countainer<Option<number>> = { content: { kind: "some", value: 2 }, counter: 0 }
let countainerMaybe: CountainerMaybe<number> = countainerOption;
let cd = map_Countainer_Maybe(incr).f(countainerOption).content;


type Triplet<a> = {
  x: a,
  y: a,
  z: a
}
let map_Triplet = function <a, b>(f: Fun<a, b>): Fun<Triplet<a>, Triplet<b>> {
  return Fun((t: Triplet<a>) => {
    return {
      x: f.f(t.x),
      y: f.f(t.y),
      z: f.f(t.z)
    }
  })
}

type Constant<a, s> = s
let map_Constant = function <a, b, s>(f: Fun<a, b>): Fun<Constant<a, s>, Constant<b, s>> {
  return Fun(x => {
    return x;
  })
}

let ce = map_Option(incr.then(double)).f(option);
let cf = map_Option(incr).then(map_Option(double)).f(option);

let cg = map_Option(incr).then(map_Option(incr))



// -------------- Week 3 -------------- //
type F<a> = a;
type Unit = {}
let Unit: Unit = {}
type Pair<a, b> = { fst: a, snd: b }

let apply = <a, b>(): Fun<Pair<Fun<a, b>, a>, b> => Fun(p => p.fst.f(p.snd))

let zero_int: Fun<Unit, number> = Fun((_: Unit) => 0)
let plus_int: Fun<Pair<number, number>, number> = Fun(ab => ab.fst + ab.snd)

let verify_identity_int = (x: number) =>
  plus_int.f({ fst: zero_int.f(Unit), snd: x }) == x &&
  plus_int.f({ snd: zero_int.f(Unit), fst: x }) == x

let verify_assoc_int = (a: number, b: number, c: number) =>
  plus_int.f({ fst: plus_int.f({ fst: a, snd: b }), snd: c }) ==
  plus_int.f({ fst: a, snd: plus_int.f({ fst: b, snd: c }) })

let da = { fst: zero_int.f(Unit), snd: 10 }
let db = plus_int.f(da);
let dc = (plus_int.f({ fst: 10, snd: 20 }));
let dd = plus_int.f({ fst: 10, snd: plus_int.f({ fst: 10, snd: 20 }) });

let zero_string = function (_: Unit): string {
  return "";
}
let plus_string = function (p: Pair<string, string>): string {
  return p.fst.concat(p.snd);
}
let de = (plus_string({ fst: "a", snd: "b" }));




// -------------- Week 4 -------------- //
type Fun_n<a> = Fun<number, a>
let map_Fun_n = <a, b>(f: Fun<a, b>, p: Fun_n<a>): Fun_n<b> =>
  p.then(f)
let unit_Fun_n = <a>() =>
  Fun<a, Fun_n<a>>(x => Fun(i => x))
let join_Fun_n = <a>() =>
  Fun<Fun_n<Fun_n<a>>, Fun_n<a>>(f => Fun(i => f.f(i).f(i)))


let fst = <a, b>(): Fun<Pair<a, b>, a> => Fun(p => p.fst)
let snd = <a, b>(): Fun<Pair<a, b>, b> => Fun(p => p.snd)
let map_Pair = <a, b, a1, b1>(f: Fun<a, a1>, g: Fun<b, b1>): Fun<Pair<a, b>, Pair<a1, b1>> =>
  Fun(p => ({ fst: f.f(p.fst), snd: g.f(p.snd) }))

type WithNum<a> = Pair<a, number>

let map_WithNum = <a, b>(f: Fun<a, b>): Fun<WithNum<a>, WithNum<b>> =>
  map_Pair(f, id<number>())
let unit_WithNum = <a>(): Fun<a, WithNum<a>> =>
  Fun(x => ({ fst: x, snd: 0 }));
let join_WithNum = <a>(): Fun<WithNum<WithNum<a>>, WithNum<a>> =>
  Fun(x => ({ fst: x.fst.fst, snd: x.snd + x.fst.snd }))


let ea: WithNum<number> = { fst: 10, snd: 30 }
let eb = map_WithNum(incr).f(ea);


// -------------- Week 5 -------------- //
interface Option2<a> {
  v: ({ k: "n" } | { k: "s", v: a }),
  then: <b>(k: (_: a) => Option2<b>) => Option2<b>
}

let none2 = <a>(): Option2<a> => (
  {
    v: { k: "n" },
    then: function <b>(this: Option2<a>, k: (_: a) => Option2<b>) { return bind_Option2(this, k) }
  })
let some2 = <a>(): Fun<a, Option2<a>> =>
  Fun<a, Option2<a>>(x => ({
    v: { k: "s", v: x },
    then: function <b>(this: Option2<a>, k: (_: a) => Option2<b>) { return bind_Option2(this, k) }
  }))

let map_Option2 = <a, b>(f: Fun<a, b>): Fun<Option2<a>, Option2<b>> =>
  Fun(x => x.v.k == "n" ? none2<b>() : f.then(some2<b>()).f(x.v.v))

let unit_Option = <a>() => some2<a>()
let join_Option2 = <a>(): Fun<Option2<Option2<a>>, Option2<a>> =>
  Fun(x => x.v.k == "n" ? none2<a>() : x.v.v)
let bind_Option2 = <a, b>(p: Option2<a>, k: (_: a) => Option2<b>): Option2<b> =>
  map_Option2<a, Option2<b>>(Fun(k)).then(join_Option2<b>()).f(p)

let safe_div = (a: Option2<number>, b: Option2<number>): Option2<number> =>
  a.then(a_v =>
    b.then(b_v =>
      b_v == 0 ? none2<number>() : some2<number>().f(a_v / b_v)))

function printOption2(x: Option2<number>): string {
  if (x.v.k == "s")
    return `the value is ${x.v.v}`
  else
    return "there is no value"
}

let fa = some2<number>().f(10);
let fb = some2<number>().f(20);
console.log(printOption2(safe_div(fa, fb)));



// -------------- Week 6 -------------- //
interface St<s, a> {
  run: Fun<s, Pair<a, s>>,
  then: <b>(k: (_: a) => St<s, b>) => St<s, b>
}

let run_St = <s, a>(): Fun<St<s, a>, Fun<s, Pair<a, s>>> => Fun(p => p.run)
let mk_St = <s, a>(run: Fun<s, Pair<a, s>>): St<s, a> => ({
  run: run,
  then: function <b>(this: St<s, a>, k: (_: a) => St<s, b>): St<s, b> { return bind_St(this, k) }
})

let map_St = <s, a, b>(f: Fun<a, b>): Fun<St<s, a>, St<s, b>> =>
  Fun((p: St<s, a>): St<s, b> => mk_St(p.run.then(map_Pair<a, s, b, s>(f, id()))))
let join_St = <s, a>(): Fun<St<s, St<s, a>>, St<s, a>> =>
  Fun((p: St<s, St<s, a>>): St<s, a> => mk_St<s, a>(p.run.then(map_Pair(run_St(), id())).then(apply())))

let unit_St = <s, a>(a: a): St<s, a> =>
  mk_St(Fun(s => ({ fst: a, snd: s })))
let bind_St = <s, a, b>(p: St<s, a>, k: (_: a) => St<s, b>): St<s, b> =>
  map_St<s, a, St<s, b>>(Fun(k)).then(join_St<s, b>()).f(p)


let add_st = <s>(p: St<s, number>, q: St<s, number>): St<s, number> =>
  p.then(p_v =>
    q.then(q_v =>
      unit_St(p_v + q_v)))



type Producer<a> = Fun<Unit, a>
type Reader<s, a> = Fun<s, a>
type State<s, a> = Fun<s, Pair<a, s>>
type RenderingBuffer = string
type Renderer = State<RenderingBuffer, Unit>

let render_nothing: Renderer = Fun(b => ({ fst: {}, snd: b }))
let render_string = (s: string): Renderer => (Fun(b => ({ fst: {}, snd: b + s })))
let render_asterisk = render_string("*")
let render_space = render_string(" ")
let render_newline = render_string("\n")


// let repeat = <s, a>(n: number, f: (_: a) => State<s, a>): (_: a) => State<s, Unit> =>
//   a => n == 0 ? unit_St(a) : f(a).then(a => repeat(n - 1, f).f(a))


// let render_line = (n: number): Renderer =>
//   repeat<RenderingBuffer, Unit>(n, _ => render_asterisk)({})

// let render_square = (n: number): Renderer =>
//   repeat<RenderingBuffer, Unit>(n, _ =>
//     render_line(n).then(_ => render_newline)({}))


// console.log(render_square(10).f("").fst)


// -------------- Week 7 -------------- //

interface StFail<s, a> {
  run: Fun<s, Option2<Pair<a, s>>>,
  then: <b>(k: (_: a) => StFail<s, b>) => StFail<s, b>
}

let run_StFail = <s, a>(): Fun<StFail<s, a>, Fun<s, Option2<Pair<a, s>>>> => Fun(p => p.run)
let mk_StateFail = <s, a>(run: Fun<s, Option2<Pair<a, s>>>): StFail<s, a> => ({
  run: run,
  then: function <b>(this: StFail<s, a>, k: (_: a) => StFail<s, b>) { return bind_StFail(this, k) }
})

let unit_StFail = <s, a>(a: a): StFail<s, a> =>
  mk_StateFail(Fun(s => unit_Option<Pair<a, s>>().f({ fst: a, snd: s })))

let fail_StFail = <s, a>(): StFail<s, a> =>
  mk_StateFail(Fun(s => none2()))

let map_StFail = <s, a, b>(f: Fun<a, b>): Fun<StFail<s, a>, StFail<s, b>> =>
  Fun((p: StFail<s, a>) => mk_StateFail(p.run.then(map_Option2(map_Pair(f, id<s>())))))

let join_StFail = <s, a>(): Fun<StFail<s, StFail<s, a>>, StFail<s, a>> =>
  Fun((p: StFail<s, StFail<s, a>>) =>
    mk_StateFail(
      p.run.then(
        map_Option2(
          map_Pair(
            run_StFail<s, a>(), id<s>()).then(apply())).then(
              join_Option2()))
    )
  )

let bind_StFail = <s, a, b>(p: StFail<s, a>, k: (_: a) => StFail<s, b>): StFail<s, b> =>
  map_StFail<s, a, StFail<s, b>>(Fun(k)).then(join_StFail()).f(p)

let get_st_fail = <s>(): StFail<s, s> =>
  mk_StateFail(Fun(s => some2<Pair<s, s>>().f({ fst: s, snd: s })))

let set_st_fail = <s>(new_s: s): StFail<s, Unit> =>
  mk_StateFail(Fun(s => some2<Pair<Unit, s>>().f({ fst: {}, snd: new_s })))



// -------------- Week 8 -------------- //

let together = <s, a, b>(p: StFail<s, a>, q: StFail<s, b>): StFail<s, Pair<a, b>> =>
  p.then(p_v =>
    q.then(q_v =>
      unit_StFail({ fst: p_v, snd: q_v })))

let mt_if = <s, a>(c: StFail<s, boolean>, t: StFail<s, a>, e: StFail<s, a>): StFail<s, a> =>
  c.then(c_v => c_v ? t : e)


type Memory = Immutable.Map<string, number>
type FakeThread<a> = StFail<Memory, a>

let get_var = (v: string): FakeThread<number> =>
  get_st_fail<Memory>().then(m =>
    m.has(v) ? unit_StFail(m.get(v))
      : fail_StFail<Memory, number>()
  )

let set_var = (v: string, e: number): FakeThread<Unit> =>
  get_st_fail<Memory>().then(m =>
    set_st_fail<Memory>(m.set(v, e)))

let swap_a_b: FakeThread<number> =
  together(get_var("a"), get_var("b")).then(({ fst: a_v, snd: b_v }) =>
    together(set_var("a", b_v), set_var("b", a_v)).then(_ =>
      unit_StFail(a_v + b_v)
    ))

let initial_memory = Immutable.Map<string, number>([["a", 1], ["b", 2]])


type ThreadResult<s, e, a> =
  { k: "res", v: Pair<s, a> }
  | { k: "fail", v: e }
  | { k: "brrrr", v: Pair<Thread<s, e, a>, s> }

interface Thread<s, e, a> {
  run: Fun<s, ThreadResult<s, e, a>>,
}

let mk_Thread = <s, e, a>(run: Fun<s, ThreadResult<s, e, a>>): Thread<s, e, a> => ({ run: run })

let map_ThreadResult = <s, e, a, b>(f: Fun<a, b>): Fun<ThreadResult<s, e, a>, ThreadResult<s, e, b>> =>
  Fun((r: ThreadResult<s, e, a>): ThreadResult<s, e, b> =>
    r.k == "res" ?
      ({ k: "res", v: map_Pair<s, a, s, b>(id<s>(), f).f(r.v) })
      : r.k == "fail" ?
        ({ k: "fail", v: r.v })
        : ({ k: "brrrr", v: map_Pair(map_Thread<s, e, a, b>(f), id<s>()).f(r.v) })
  )

let map_Thread = <s, e, a, b>(f: Fun<a, b>): Fun<Thread<s, e, a>, Thread<s, e, b>> =>
  Fun((p: Thread<s, e, a>): Thread<s, e, b> =>
    mk_Thread(
      p.run.then(map_ThreadResult<s, e, a, b>(f))
    ))

let unit = <s, e, a>(a: a): Thread<s, e, a> =>
  mk_Thread(Fun((s0: s): ThreadResult<s, e, a> => ({ k: "res", v: { fst: s0, snd: a } })))
let fail = <s, e, a>(e: e): Thread<s, e, a> =>
  mk_Thread(Fun((s0: s): ThreadResult<s, e, a> => ({ k: "fail", v: e })))
let freeze = <s, e>(): Thread<s, e, Unit> =>
  mk_Thread(Fun((s0: s): ThreadResult<s, e, Unit> => ({ k: "brrrr", v: { fst: unit({}), snd: s0 } })))



let join_Thread = <s, e, a>(): Fun<Thread<s, e, Thread<s, e, a>>, Thread<s, e, a>> =>
  Fun((pp: Thread<s, e, Thread<s, e, a>>): Thread<s, e, a> =>
    mk_Thread(
      Fun((s0: s): ThreadResult<s, e, a> => {
        let qp: ThreadResult<s, e, Thread<s, e, a>> = pp.run.f(s0)
        if (qp.k == "res") {
          let p: Thread<s, e, a> = qp.v.snd
          let s1 = qp.v.fst
          let q: ThreadResult<s, e, a> = p.run.f(s1)
          return q
        } else if (qp.k == "fail") {
          return { k: "fail", v: qp.v }
        } else {
          let pp1: Thread<s, e, Thread<s, e, a>> = qp.v.fst
          let s1 = qp.v.snd
          let p: Thread<s, e, a> = join_Thread<s, e, a>().f(pp1)
          let q: ThreadResult<s, e, a> = p.run.f(s1)
          return q
        }
      }
      ))
  )
