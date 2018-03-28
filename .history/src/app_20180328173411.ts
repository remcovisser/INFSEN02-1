type Fun<a,b> = { f:(i:a) => b }
let Fun = function<a,b>(f:(_:a) => b) : Fun<a,b> {  return { f:f } }

let double = Fun<number,number>(x => x * 3)
let aaa = double.f(10);


let then = function<a,b,c>(f:Fun<a,b>, g:Fun<b,c>) : Fun<a,c> {
    return Fun<a,c>(a => g.f(f.f(a)))
}