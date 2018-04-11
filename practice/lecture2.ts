export { } // allow each file to work independently

// Function wrapper
type Fun<a, b> = {
    f: (_: a) => b,
    then: <c>(g: Fun<b, c>) => Fun<a, c>
}

// Create a function wrapper
let Fun = <a, b>(f: (_: a) => b): Fun<a, b> => ({
    f: f,
    then: function <c>(this: Fun<a, b>, g: Fun<b, c>): Fun<a, c> {
        return then(this, g)
    }
})

// Make chaining of the function wrapper possible
let then = <a, b, c>(f: Fun<a, b>, g: Fun<b, c>): Fun<a, c> => Fun(a => g.f(f.f(a)))

// Defining funtions that use this wrapper
let incr: Fun<number, number> = Fun(x => x + 1)

// Be out empty value
type Unit = {}
let Unit: Unit = {}

type List<a> = { kind: 'Cons', head: a, tail: List<a> } | { kind: 'Empty' }

let empty = <a>() => Fun<Unit, List<a>>(_ => ({ kind: 'Empty' }))
let cons = <a>() => Fun<a, List<a>>(x => ({ kind: 'Cons', head: x, tail: empty<a>().f(Unit) }))

let map_List = <a, b>(f: Fun<a, b>): Fun<List<a>, List<b>> => {
    return Fun<List<a>, List<b>>(x => {
        if (x.kind == 'Empty') {
            return x;
        } else {
            // TODO: Make use of the cons function
            return {
                kind: 'Cons',
                head: f.f(x.head),
                tail: map_List(f).f(x.tail)
            }
        }
    })
}

let firstItem = cons<number>().f(123)
if (firstItem.kind == 'Cons') {
    firstItem.tail = cons<number>().f(321)
}
// console.log(firstItem)
console.log(map_List(incr).f(firstItem))
