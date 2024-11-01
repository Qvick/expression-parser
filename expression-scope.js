import Expression from "./expression.js"

export default class ExpressionScope
{
    constructor(expressionTable = new Map())
    {
        return new Proxy(expressionTable, ExpressionScope)
    }

    static get(expressionTable, expressionRule)
    {
        if(expressionTable.has(expressionRule))
        {
            return expressionTable.get(expressionRule)
        }
        else
        {
            const expressionNode = Expression.createSubstitution()

            expressionTable.set(expressionRule, expressionNode)

            return expressionTable.get(expressionRule)
        }
    }

    static set(expressionTable, expressionRule, expressionValue)
    {
        if(expressionTable.has(expressionRule))
        {
            const expressionNode = expressionTable.get(expressionRule)

            expressionNode.updateAlternation(expressionValue, Expression.createTermination())

            return expressionTable.set(expressionRule, expressionNode)
        }
        else
        {
            return expressionTable.set(expressionRule, expressionValue)
        }
    }
}
