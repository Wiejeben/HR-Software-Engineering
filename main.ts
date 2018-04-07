// Function wrapper
type Fun<a, b> = { f: (_: a) => b, then: <c>(g: Fun<b, c>) => Fun<a, c> }

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
let decr: Fun<number, number> = Fun(x => x - 1)
let double: Fun<number, number> = Fun(x => x * 2)
let is_even: Fun<number, boolean> = Fun(x => x % 2 == 0)
let is_odd: Fun<number, boolean> = Fun(x => x % 2 == 1)
let str_len: Fun<string, number> = Fun(x => x.length)
let to_string: Fun<number, string> = Fun(x => x.toString())

// Depending on the first paramter, we execute the second or third function
let ifThenElse = <a, b>(f: Fun<a, boolean>, _then: Fun<a, b>, _else: Fun<a, b>): Fun<a, b> => Fun(x => f.f(x) ? _then.f(x) : _else.f(x))

// console.log(str_len.then(incr).then(is_even).f('Hello, World!')) // output: true

// Define identity function, this does absolutely nothing, (just makes sure that the type is correct)
let id = <a>(): Fun<a, a> => Fun(x => x)

// We can create structures
type Countainer<a> = { value: a, counter: number }

// Can contain different type of values as long as the structure is the same
let counter_string: Countainer<string> = { value: 'Hello, World!', counter: 0 }
let counter_number: Countainer<number> = { value: 123, counter: 2 }

// In order to use our function wrapper, we must map our structure
let map_Countainer = <a, b>(f: Fun<a, b>): Fun<Countainer<a>, Countainer<b>> => Fun(x => ({ ...x, value: f.f(x.value) }))

let unit_Countainer = <a>(): Fun<a, Countainer<a>> => Fun(x => ({ value: x, counter: 0 }))
let join_Countainer = <a>(): Fun<Countainer<Countainer<a>>, Countainer<a>> => Fun(x => ({ value: x.value.value, counter: x.counter + x.value.counter }))

// Also apply the identity function to the Countainer structure
let id_Countainer = <a>(): Fun<Countainer<a>, Countainer<a>> => map_Countainer(id<a>())

// console.log(map_Countainer(str_len.then(incr)).f(counter_string)) // output: { value: 14, counter: 0 }

// Be out empty value
type Unit = {}
let Unit: Unit = {}

type Option<a> = { kind: 'none' } | { kind: 'some', value: a } & { then: <b>(k: (_: a) => Option<b>) => Option<b> }

// Construct different option types
let none = <a>(): Fun<Unit, Option<a>> => Fun<Unit, Option<a>>(_ => ({ kind: 'none' }))
let some = <a>(): Fun<a, Option<a>> => Fun<a, Option<a>>(x => ({
    kind: 'some',
    value: x,
    then: function <b>(this: Option<a>, k: (_: a) => Option<b>) {
        return bind_Option(this, k)
    }
}))

let map_Option = <a, b>(f: Fun<a, b>): Fun<Option<a>, Option<b>> =>
    Fun<Option<a>, Option<b>>(x => x.kind == 'none' ? none<b>().f(Unit) : some<b>().f(f.f(x.value)))

let id_Option = <a>(): Fun<Option<a>, Option<a>> => map_Option(id<a>())

// Introduce join and unit
let unit_Option = <a>(): Fun<a, Option<a>> => Fun(x => some<a>().f(x))
let join_Option = <a>(): Fun<Option<Option<a>>, Option<a>> => Fun(o => o.kind == 'none' ? none<a>().f(Unit) : o.value)
let bind_Option = <a, b>(p: Option<a>, k: (_: a) => Option<b>): Option<b> => map_Option<a, Option<b>>(Fun(k)).then(join_Option<b>()).f(p)

// console.log(map_Option(str_len).f(some<string>().f('Hello'))) // output: { kind: 'some', value: 5 }
// console.log(map_Option(incr).then(map_Option(double)).f(some<number>().f(10))) // output: { kind: 'some', value: 22, then: [Function: then] }
// console.log(some<number>().then(map_Option(incr)).then(map_Option(double)).f(10)) // output: { kind: 'some', value: 22, then: [Function: then] }

type Either<a, b> = { kind: 'left', value: a } | { kind: 'right', value: b }

let inl = <a, b>(): Fun<a, Either<a, b>> => Fun<a, Either<a, b>>(x => ({ kind: 'left', value: x }))
let inr = <a, b>(): Fun<b, Either<a, b>> => Fun<b, Either<a, b>>(x => ({ kind: 'right', value: x }))

// console.log(incr.then(inl<number, number>()).f(10)) // output: { kind: 'left', value: 11 }

// Map is a bit harder for Either since we want the ability to apply a different function depending on the kind
let map_Either = <a0, a1, b0, b1>(f: Fun<a0, a1>, g: Fun<b0, b1>): Fun<Either<a0, b0>, Either<a1, b1>> =>
    Fun(x => x.kind == 'left' ? f.then(inl<a1, b1>()).f(x.value) : g.then(inr<a1, b1>()).f(x.value))

let id_Either = <a, b>(): Fun<Either<a, b>, Either<a, b>> => map_Either(id<a>(), id<b>())

let join_left_Either = <a, b>(): Fun<Either<Either<a, b>, b>, Either<a, b>> => Fun<Either<Either<a, b>, b>, Either<a, b>>(x => x.kind == 'left' ? x.value : x)
let join_right_Either = <a, b>(): Fun<Either<a, Either<a, b>>, Either<a, b>> => Fun<Either<a, Either<a, b>>, Either<a, b>>(x => x.kind == 'left' ? x : x.value)

let inner = inl<number, number>().f(123)
let outer = inl<Either<number, number>, number>().f(inner)
let inner_again = join_left_Either<number, number>().f(outer)
// console.log(inner_again) // output: { kind: 'left', value: 123 }

let chained = inl().then(inl()).then(join_left_Either()).f('123')
// console.log(chained) // output: { kind: 'left', value: 123 }

let bind_Either = <a, b, c>(p: Either<a, b>, k: ((_: b) => Either<a, c>)): Either<a, c> => map_Either(id<a>(), Fun(k)).then(join_right_Either()).f(p);

// console.log(id_Either<number, string>().f(inl<number, string>().f(10))) // output: { kind: 'left', value: 10 }
