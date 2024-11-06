
# Expression Parser

A simple but powerful parsing library for JavaScript.

## Features

- Clean code with no dependencies.
- Supports all context free languages.
- Handles both left and right recursive grammars.
- Acceptable performance for small to medium languages.

## Dependencies

- None.

## Sources

Install the library using npm:

~~~
npm install @qvick/expression-parser
~~~

Download the source code using git:

~~~
git clone https://github.com/Qvick/expression-parser.git
~~~

## Remarks

Right recursive grammars should be preferred due to performance reasons.

## Usage

### Static Methods

- The **createAlternation** method creates a new expression that matches either the **leftExpression** or the **rightExpression**.

    ~~~js
    Expression.createAlternation(leftExpression, rightExpression)
    ~~~

- The **createConcatenation** method creates a new expression that matches the **leftExpression** followed by the **rightExpression**.

    ~~~js
    Expression.createConcatenation(leftExpression, rightExpression)
    ~~~

- The **createReduction** method creates a new expression that matches the **leftExpression** and the **rightExpression** is used to map syntax trees from one form to another.

    ~~~js
    Expression.createReduction(leftExpression, rightExpression)
    ~~~

- The **createSubstitution** method creates a new expression that matches the **leftExpression**.

    ~~~js
    Expression.createSubstitution(leftExpression)
    ~~~

- The **createInterpretation** method creates a new expression that matches the **leftExpression**.

    ~~~js
    Expression.createInterpretation(leftExpression)
    ~~~

- The **createDerivation** method creates a new expression that matches the empty string.

    ~~~js
    Expression.createDerivation(leftExpression)
    ~~~

- The **createTermination** method creates a new expression that matches the empty set.

    ~~~js
    Expression.createTermination()
    ~~~

### Instance Methods

- The **validate** method checks whether the language contains the empty string.

    ~~~js
    Expression.prototype.validate()
    ~~~

- The **reduce** method returns an optimized form of the expression.

    ~~~js
    Expression.prototype.reduce()
    ~~~

- The **derive** method returns the derivative with respect to **expressionValue**.

    ~~~js
    Expression.prototype.derive(expressionValue)
    ~~~

- The **evaluate** method returns an array of concrete syntax trees.

    ~~~js
    Expression.prototype.evaluate()
    ~~~

## Example

This example shows how to make an arithmetic calculator that handles addition, subtraction, multiplication, division and grouping.

~~~js

import ExpressionScope from "@qvick/expression-parser/expression-scope.js"
import Expression from "@qvick/expression-parser/expression.js"

class Addition
{
    constructor(leftExpression, rightExpression)
    {
        this.leftExpression = leftExpression

        this.rightExpression = rightExpression
    }

    evaluate()
    {
        return this.leftExpression.evaluate() + this.rightExpression.evaluate()
    }
}

class Subtraction
{
    constructor(leftExpression, rightExpression)
    {
        this.leftExpression = leftExpression

        this.rightExpression = rightExpression
    }

    evaluate()
    {
        return this.leftExpression.evaluate() - this.rightExpression.evaluate()
    }
}

class Multiplication
{
    constructor(leftExpression, rightExpression)
    {
        this.leftExpression = leftExpression

        this.rightExpression = rightExpression
    }

    evaluate()
    {
        return this.leftExpression.evaluate() * this.rightExpression.evaluate()
    }
}

class Division
{
    constructor(leftExpression, rightExpression)
    {
        this.leftExpression = leftExpression

        this.rightExpression = rightExpression
    }

    evaluate()
    {
        return this.leftExpression.evaluate() / this.rightExpression.evaluate()
    }
}

class Interpretation
{
    constructor(leftExpression)
    {
        this.leftExpression = leftExpression
    }

    evaluate()
    {
        return parseInt(this.leftExpression)
    }
}

const expressionRange = new RegExp("\\d")

const expressionScope = new ExpressionScope()

// additive-expression ::= multiplicative-expression | additive-expression "+" multiplicative-expression | additive-expression "-" multiplicative-expression;
expressionScope.additiveExpression = Expression.createAlternation(expressionScope.multiplicativeExpression, Expression.createAlternation(Expression.createReduction(Expression.createConcatenation(expressionScope.additiveExpression, Expression.createConcatenation(Expression.createInterpretation(expressionValue => expressionValue === "+"), expressionScope.multiplicativeExpression)), leftExpressions => leftExpressions.flatMap(leftExpression => new Addition(leftExpression.leftExpression, leftExpression.rightExpression.rightExpression))), Expression.createReduction(Expression.createConcatenation(expressionScope.additiveExpression, Expression.createConcatenation(Expression.createInterpretation(expressionValue => expressionValue === "-"), expressionScope.multiplicativeExpression)), leftExpressions => leftExpressions.flatMap(leftExpression => new Subtraction(leftExpression.leftExpression, leftExpression.rightExpression.rightExpression)))))

// multiplicative-expression ::= parenthetical-expression | multiplicative-expression "*" parenthetical-expression | multiplicative-expression "/" parenthetical-expression;
expressionScope.multiplicativeExpression = Expression.createAlternation(expressionScope.parentheticalExpression, Expression.createAlternation(Expression.createReduction(Expression.createConcatenation(expressionScope.multiplicativeExpression, Expression.createConcatenation(Expression.createInterpretation(expressionValue => expressionValue === "*"), expressionScope.parentheticalExpression)), leftExpressions => leftExpressions.flatMap(leftExpression => new Multiplication(leftExpression.leftExpression, leftExpression.rightExpression.rightExpression))), Expression.createReduction(Expression.createConcatenation(expressionScope.multiplicativeExpression, Expression.createConcatenation(Expression.createInterpretation(expressionValue => expressionValue === "/"), expressionScope.parentheticalExpression)), leftExpressions => leftExpressions.flatMap(leftExpression => new Division(leftExpression.leftExpression, leftExpression.rightExpression.rightExpression)))))

// parenthetical-expression ::= numerical-expression | "(" additive-expression ")"
expressionScope.parentheticalExpression = Expression.createAlternation(Expression.createReduction(expressionScope.numericalExpression, leftExpressions => leftExpressions.flatMap(leftExpression => new Interpretation(leftExpression))), Expression.createReduction(Expression.createConcatenation(Expression.createInterpretation(expressionValue => expressionValue === "("), Expression.createConcatenation(expressionScope.additiveExpression, Expression.createInterpretation(expressionValue => expressionValue === ")"))), leftExpressions => leftExpressions.flatMap(leftExpression => leftExpression.rightExpression.leftExpression)))

// numerical-expression ::= literal-expression | literal-expression numerical-expression
expressionScope.numericalExpression = Expression.createAlternation(expressionScope.literalExpression, Expression.createReduction(Expression.createConcatenation(expressionScope.literalExpression, expressionScope.numericalExpression), leftExpressions => leftExpressions.flatMap(leftExpression => leftExpression.leftExpression + leftExpression.rightExpression)))

// literal-expression ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
expressionScope.literalExpression = Expression.createInterpretation(expressionValue => expressionRange.test(expressionValue))

function derive(expressionRule, expressionValue)
{
    return expressionRule.derive(expressionValue)
}

function evaluate(expressionRule)
{
    return expressionRule.evaluate()
}

const expressionValues = ["(", "3", "0", "+", "5", "0", ")", "*", "(", "9", "0", "-", "7", "0", ")", "/", "1", "0", "+", "1", "0"]

const expressionNodes = evaluate(expressionValues.reduce(derive, expressionScope.additiveExpression.reduce()))

for(const expressionNode of expressionNodes)
{
    console.log(expressionNode.evaluate())
}

~~~

## License

This project is licensed under the terms of the ISC license.
