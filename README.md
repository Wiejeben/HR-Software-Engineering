# Basic toolbox
Functions, types  
Composition of types and referential transparency

# Functors
Generic types as functions between types  
Generic types induce map, which is a function between functions
Examples:
- Identity
- Pair (left/right/product)
- Sum (left/right/product)
- Option
- List

Properties of functors: preservation of identity and composition  
Useful tip: performance optimization by merging maps

Functors can be composed into new functors  
List(Option)

# Monoids
Fundamental structure which arises everywhere  
Joining, unit, associativity  
Examples:
- string, plus, empty
- number, plus, 0
- number, times, 1
- list, concat, empty
- ...

Monoids over functors:
Reformulation of monoids in functional terms: unit becomes a function (eta/return)

# Monads introduction
Monads arise everywhere we can augment a functor with joining, unit, and associativity  
The bind operator
Examples:
- Identity (bind is simply function composition!)
- Pair (left and right)

We now move on to more and more advanced monads which are quite useful in practice.

## Sum(s)
Concept: safe representation of a happy-flow and an error flow  
Sum (left and right)  
Option  
Exception  
Examples:
- Optional in Java
- Maybe in Haskell
- Optional in C++

## State
Concept: arbitrating state-management, own DSL  
Example:
- Mini-language

## Combining monads: parser
Concept: different monads can be composed together in order to form a larger monad  
The larger monad is still a monad!


Let us show that parser is the combination of state and option/exception
Example:
- Parser for the mini-language from the State
- Mini-language with exceptions

## Coroutines
Concept: modelling domain-specific concurrency in a concurrency-unsafe host-language
Examples:
- Promises
- TPL
- Mini-language with exceptions and breakpoints

# Definitions
- **data race/race condition**: async operation where te sequence of execution preduces a different outcome.
- **composition**: given two entities of the same sort, we can compose them into a new one.
- **neutral element of composition**: example; it behaves similarly to 0 with respect to addition.
- **identity function**: when given a parameter, simply returns it right away without modification.
- **referential transparency/determinism**: ensures that a function will always behave the exact same way when called with the same parameters.
- **preservation of identity**: ?
- **homomorphism**: ?
- **structure preserving transformation**: output will produce the same structure as the input.
- **generic structures/generic programming/parametric polymorphism**: changes behaviour depending on variable type paremeters.
- **map**: transform content/values of structure.
- **functors**: a well behaved data structure that always behaves in a reliable, intuitive way (Option, Countainer).
- **associative/association law**: order of execution does not matter `(a + (b + c) = (a + b) + c)`.
- **higher order meta programming abstractions**: ?
- **monoid**: datatypes that follows associative law.
- **unit / constructor**: `a => Fun<a>`, which takes as input a value of an arbitrary type a and embeds it into its simplest possible representation within functor.
- **join / flattten**: `Fun<Fun<a>> => Fun<a>`, which takes as input Fun nested twice, and flattens it into a single Fun.
- **map / adapter?**: insures that the function is applied to the correct value within a given structure.
- **(endo)functors**: functor that goes from type to type.
- **bind**: links multiple instances of a monad, where the second instance depends on the contents of the first parameter.
- **kleisli**: hen the return value is encapsulated in an instance of a monad.
- **polymorphic datatype**: datatype which can contain multiple structures
- **monad**: both functor and monoid
