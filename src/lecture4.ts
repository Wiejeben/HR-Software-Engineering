// START: From previous lectures
const then = <a, b, c>(f: Fun<a, b>, g: Fun<b, c>): Fun<a, c> => Fun<a, c>(a => g.f(f.f(a)))
type Fun<a, b> = { f: (i: a) => b, then: <c>(g: Fun<b,c>) => Fun<a,c> }
let Fun = <a, b>(f: (_: a) => b): Fun<a, b> => ({
    f: f,
    then: <c>(this: Fun<a, b>, g: Fun<b, c>): Fun<a, c> => then(this, g)
})
const id = <a>(): Fun<a,a> => Fun<a,a>(x => x)

// monoid

type Fun_n<a> = Fun<number,a>
let map_Fun_n = <a, b>(f: Fun<a, b>, p: Fun_n<a>): Fun_n<b> => p.then(f)

let unit_Fun_n = <a>() => Fun(x => Fun(i => x))
let join_Fun_n = <a>() => Fun(f => Fun(i => f.f(i).f(i))) // TODO: Fix

type Pair<a, b> = { x: a, y: b }
let fst = <a, b>(): Fun<Pair<a, b>, a> => Fun(p => p.x)
let snd = <a, b>(): Fun<Pair<a, b>, b> => Fun(p => p.y)
let map_Pair = <a, b, a1, b1>(f: Fun<a, a1>, g: Fun<b, b1>): Fun<Pair<a, b>, Pair<a1, b1>> => Fun(p => ({ x: f.f(p.x), y: g.f(p.y) }))

type WithNum<a> = Pair<a,number>
let map_WithNum = <a, b>(f: Fun<a,b>) : Fun<WithNum<a>, WithNum<b>> => map_Pair(f, id<number>())
let unit_WithNum = <a>(): Fun<a, WithNum<a>> => Fun(x => { x: x, y: 0 }) // TODO: Fix
let join_WithNum = <a>(): Fun<WithNum<WithNum<a>>, WithNum<a>> => Fun(x => { x: x.x.x, y: x.y + x.x.y }) // TODO: Fix

type Id<a> = a
let map_Id = <a,b>(f:Fun<a,b>) : Fun<Id<a>,Id<b>> => f

let unit_Id = <a>(): Fun<a, Id<a>> => id<a>()
let join_Id = <a>(): Fun<Id<Id<a>>, Id<a>> => id<a>()
