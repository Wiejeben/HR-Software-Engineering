export { } // allow each file to work independently

// Function wrapper
type Fun<a, b> = {
    f: (_: a) => b,
    then: <c>(g: Fun<b, c>) => Fun<a, c>,
    repeat: () => Fun<number, Fun<a, a>>,
    repeatUntil: () => Fun<Fun<a, boolean>, Fun<a, a>>
}

// Create a function wrapper
let Fun = <a, b>(f: (_: a) => b): Fun<a, b> => ({
    f: f,
    then: function <c>(this: Fun<a, b>, g: Fun<b, c>): Fun<a, c> {
        return then(this, g)
    },
    repeat: function (this: Fun<a, a>): Fun<number, Fun<a, a>> {
        return Fun(x => repeat(this, x))
    },
    repeatUntil: function (this: Fun<a, a>): Fun<Fun<a, boolean>, Fun<a, a>> {
        return Fun(x => repeatUntil(this, x))
    }
})

// Make chaining of the function wrapper possible
let then = <a, b, c>(f: Fun<a, b>, g: Fun<b, c>): Fun<a, c> => Fun(a => g.f(f.f(a)))

let repeat = <a>(f: Fun<a, a>, n: number): Fun<a, a> => (n <= 0) ? f : f.then(repeat(f, decr.f(n)))

let repeatUntil = <a>(f: Fun<a, a>, predicate: Fun<a, boolean>): Fun<a, a> => {
    let g = (x: a): a => predicate.f(x) ? x : g(f.f(x))
    return Fun(x => g(x))
}

// Defining funtions that use this wrapper
let incr = Fun((x: number) => x + 1)
let decr = Fun((x: number) => x - 1)
let double = Fun((x: number) => x * 2)
let square = Fun((x: number) => x * x)
let isPositive = Fun((x: number) => x > 0)
let isEven = Fun((x: number) => x % 2 == 0)
let invert = Fun((x: number) => -x)
let squareRoot = Fun((x: number) => Math.sqrt(x))

let ifThenElse = <a, b>(f: Fun<a, boolean>, _then: Fun<a, b>, _else: Fun<a, b>): Fun<a, b> => Fun(x => f.f(x) ? _then.f(x) : _else.f(x))

// Increment a number and then check if it is positive
incr.then(isPositive)

// Increment a number, double it and check if it is positive
incr.then(double).then(isPositive)

// Implement a function that computes the square root if the input is positive, otherwise inverts it and then performs the square root
ifThenElse(isPositive, squareRoot, invert.then(squareRoot))

// Square a number and then if it is even invert it otherwise do the square root
ifThenElse(square.then(isEven), square.then(invert), square.then(squareRoot))

// Complete the code of repeat, which repeats a function n times.
incr.repeat().f(10).f(10) // 21 (executes 1 + 10 times)

// Extend the type Fun<a, b> with an additional method repeatUntil that takes a predicate and repeats a function until the predicate returns false.
incr.repeatUntil().f(isEven).f(19) // 20
