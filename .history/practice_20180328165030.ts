

type Fun<a,b> = { f:(i:a) => b }
let Fun = function<a,b>(f:(_:a) => b) : Fun<a,b> {  return { f:f } }

let test = Fun<number,string>(x => 'a')
console.log(test + "Hello");
let double = Fun<number,number>(x => x * 2)

let then = function<a,b,c>(f:Fun<a,b>, g:Fun<b,c>) : Fun<a,c> {
    return Fun<a,c>(a => g.f(f.f(a)))
}