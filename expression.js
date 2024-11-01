import ExpressionType from "./expression-type.js"

export default class Expression
{
    static createAlternation(leftExpression, rightExpression)
    {
        if(leftExpression.expressionType === ExpressionType.terminationType)
        {
            if(rightExpression.expressionType === ExpressionType.alternationType)
            {
                return Expression.createAlternationType(rightExpression.leftExpression, rightExpression.rightExpression)
            }

            if(rightExpression.expressionType === ExpressionType.concatenationType)
            {
                return Expression.createConcatenationType(rightExpression.leftExpression, rightExpression.rightExpression)
            }

            if(rightExpression.expressionType === ExpressionType.reductionType)
            {
                return Expression.createReductionType(rightExpression.leftExpression, rightExpression.rightExpression)
            }

            if(rightExpression.expressionType === ExpressionType.interpretationType)
            {
                return Expression.createInterpretationType(rightExpression.leftExpression)
            }

            if(rightExpression.expressionType === ExpressionType.derivationType)
            {
                return Expression.createDerivationType(rightExpression.leftExpression)
            }

            return Expression.createTerminationType(leftExpression.leftExpression)
        }

        if(rightExpression.expressionType === ExpressionType.terminationType)
        {
            if(leftExpression.expressionType === ExpressionType.alternationType)
            {
                return Expression.createAlternationType(leftExpression.leftExpression, leftExpression.rightExpression)
            }

            if(leftExpression.expressionType === ExpressionType.concatenationType)
            {
                return Expression.createConcatenationType(leftExpression.leftExpression, leftExpression.rightExpression)
            }

            if(leftExpression.expressionType === ExpressionType.reductionType)
            {
                return Expression.createReductionType(leftExpression.leftExpression, leftExpression.rightExpression)
            }

            if(leftExpression.expressionType === ExpressionType.interpretationType)
            {
                return Expression.createInterpretationType(leftExpression.leftExpression)
            }

            if(leftExpression.expressionType === ExpressionType.derivationType)
            {
                return Expression.createDerivationType(leftExpression.leftExpression)
            }

            return Expression.createTerminationType(rightExpression.leftExpression)
        }

        return Expression.createAlternationType(leftExpression, rightExpression)
    }

    static createConcatenation(leftExpression, rightExpression)
    {
        if(leftExpression.expressionType === ExpressionType.terminationType)
        {
            return Expression.createTerminationType(leftExpression.leftExpression)
        }

        if(rightExpression.expressionType === ExpressionType.terminationType)
        {
            return Expression.createTerminationType(rightExpression.leftExpression)
        }

        if(leftExpression.expressionType === ExpressionType.derivationType)
        {
            return Expression.createReductionType(rightExpression, rightExpressions => rightExpressions.flatMap(rightExpression => leftExpression.leftExpression().flatMap(leftExpression => ({leftExpression: leftExpression, rightExpression: rightExpression}))))
        }

        if(rightExpression.expressionType === ExpressionType.derivationType)
        {
            return Expression.createReductionType(leftExpression, leftExpressions => leftExpressions.flatMap(leftExpression => rightExpression.leftExpression().flatMap(rightExpression => ({leftExpression: leftExpression, rightExpression: rightExpression}))))
        }

        if(leftExpression.expressionType === ExpressionType.reductionType)
        {
            return Expression.createReductionType(Expression.createConcatenationType(leftExpression.leftExpression, rightExpression), rightExpressions => rightExpressions.flatMap(rightExpression => leftExpression.rightExpression([rightExpression.leftExpression]).flatMap(leftExpression => ({leftExpression: leftExpression, rightExpression: rightExpression.rightExpression}))))
        }

        if(rightExpression.expressionType === ExpressionType.reductionType)
        {
            return Expression.createReductionType(Expression.createConcatenationType(leftExpression, rightExpression.leftExpression), leftExpressions => leftExpressions.flatMap(leftExpression => rightExpression.rightExpression([leftExpression.rightExpression]).flatMap(rightExpression => ({leftExpression: leftExpression.leftExpression, rightExpression: rightExpression}))))
        }

        if(leftExpression.expressionType === ExpressionType.concatenationType)
        {
            return Expression.createReductionType(Expression.createConcatenationType(leftExpression.leftExpression, Expression.createConcatenationType(leftExpression.rightExpression, rightExpression)), rightExpressions => rightExpressions.flatMap(rightExpression => ({leftExpression: ({leftExpression: rightExpression.leftExpression, rightExpression: rightExpression.rightExpression.leftExpression}), rightExpression: rightExpression.rightExpression.rightExpression})))
        }

        return Expression.createConcatenationType(leftExpression, rightExpression)
    }

    static createReduction(leftExpression, rightExpression)
    {
        if(leftExpression.expressionType === ExpressionType.terminationType)
        {
            return Expression.createTerminationType(leftExpression.leftExpression)
        }

        if(leftExpression.expressionType === ExpressionType.derivationType)
        {
            return Expression.createDerivationType(leftExpressions => rightExpression(leftExpression.leftExpression(leftExpressions)))
        }

        if(leftExpression.expressionType === ExpressionType.reductionType)
        {
            return Expression.createReductionType(leftExpression.leftExpression, leftExpressions => rightExpression(leftExpression.rightExpression(leftExpressions)))
        }

        return Expression.createReductionType(leftExpression, rightExpression)
    }

    static createSubstitution(leftExpression)
    {
        return Expression.createSubstitutionType(leftExpression)
    }

    static createInterpretation(leftExpression)
    {
        return Expression.createInterpretationType(leftExpression)
    }

    static createDerivation(leftExpression)
    {
        return Expression.createDerivationType(leftExpression)
    }

    static createTermination(leftExpression)
    {
        return Expression.createTerminationType(leftExpression)
    }

    static createAlternationType(leftExpression, rightExpression)
    {
        return new Expression(ExpressionType.alternationType, leftExpression, rightExpression)
    }

    static createConcatenationType(leftExpression, rightExpression)
    {
        return new Expression(ExpressionType.concatenationType, leftExpression, rightExpression)
    }

    static createReductionType(leftExpression, rightExpression)
    {
        return new Expression(ExpressionType.reductionType, leftExpression, rightExpression)
    }

    static createSubstitutionType(leftExpression)
    {
        return new Expression(ExpressionType.substitutionType, leftExpression)
    }

    static createInterpretationType(leftExpression)
    {
        return new Expression(ExpressionType.interpretationType, leftExpression)
    }

    static createDerivationType(leftExpression)
    {
        return new Expression(ExpressionType.derivationType, leftExpression)
    }

    static createTerminationType(leftExpression)
    {
        return new Expression(ExpressionType.terminationType, leftExpression)
    }

    static validationState = Symbol("Expression.prototype.validate")

    static reductionState = Symbol("Expression.prototype.reduce")

    static derivationState = Symbol("Expression.prototype.derive")

    static evaluationState = Symbol("Expression.prototype.evaluate")

    get leftExpressions()
    {
        return this.leftExpression.evaluate()
    }

    get rightExpressions()
    {
        return this.rightExpression.evaluate()
    }

    constructor(expressionType, leftExpression, rightExpression)
    {
        this.expressionType = expressionType

        this.leftExpression = leftExpression

        this.rightExpression = rightExpression
    }

    update(expressionType, leftExpression, rightExpression)
    {
        this.expressionType = expressionType

        this.leftExpression = leftExpression

        this.rightExpression = rightExpression
    }

    validate(expressionState = Expression.validationState)
    {
        if(this.expressionState === expressionState)
        {
            return this.expressionCache
        }

        const expressionCache = ExpressionType.terminationType.validate()

        this.expressionState = expressionState

        this.expressionCache = expressionCache

        if(this.expressionType === ExpressionType.alternationType)
        {
            this.expressionCache = this.leftExpression.validate(expressionState) || this.rightExpression.validate(expressionState)
        }
        else if(this.expressionType === ExpressionType.concatenationType)
        {
            this.expressionCache = this.leftExpression.validate(expressionState) && this.rightExpression.validate(expressionState)
        }
        else if(this.expressionType === ExpressionType.reductionType)
        {
            this.expressionCache = this.leftExpression.validate(expressionState)
        }
        else if(this.expressionType === ExpressionType.derivationType)
        {
            this.expressionCache = this.expressionType.validate(expressionState)
        }

        return this.expressionCache
    }

    reduce(expressionValue = Expression.reductionState)
    {
        if(this.expressionValue === expressionValue)
        {
            return this.expressionNode
        }

        const expressionNode = Expression.createSubstitution()

        this.expressionValue = expressionValue

        this.expressionNode = expressionNode

        if(this.expressionType === ExpressionType.alternationType)
        {
            this.expressionNode.updateAlternation(this.leftExpression.reduce(expressionValue), this.rightExpression.reduce(expressionValue))

            if(this.expressionNode.leftExpression !== this.leftExpression.reduce(expressionValue) || this.expressionNode.rightExpression !== this.rightExpression.reduce(expressionValue))
            {
                this.expressionNode = this.expressionNode.reduce(expressionValue)
            }
        }
        else if(this.expressionType === ExpressionType.concatenationType)
        {
            this.expressionNode.updateConcatenation(this.leftExpression.reduce(expressionValue), this.rightExpression.reduce(expressionValue))

            if(this.expressionNode.leftExpression !== this.leftExpression.reduce(expressionValue) || this.expressionNode.rightExpression !== this.rightExpression.reduce(expressionValue))
            {
                this.expressionNode = this.expressionNode.reduce(expressionValue)
            }
        }
        else if(this.expressionType === ExpressionType.reductionType)
        {
            this.expressionNode.updateReduction(this.leftExpression.reduce(expressionValue), this.rightExpression)

            if(this.expressionNode.leftExpression !== this.leftExpression.reduce(expressionValue))
            {
                this.expressionNode = this.expressionNode.reduce(expressionValue)
            }
        }
        else if(this.expressionType === ExpressionType.interpretationType)
        {
            this.expressionNode.updateInterpretation(this.leftExpression)
        }
        else if(this.expressionType === ExpressionType.derivationType)
        {
            this.expressionNode.updateDerivation(this.leftExpression)
        }
        else if(this.expressionType === ExpressionType.terminationType)
        {
            this.expressionNode.updateTermination(this.leftExpression)
        }

        return this.expressionNode
    }

    derive(expressionValue = Expression.derivationState)
    {
        if(this.expressionValue === expressionValue)
        {
            return this.expressionNode
        }

        const expressionNode = Expression.createSubstitution()

        this.expressionValue = expressionValue

        this.expressionNode = expressionNode

        if(this.expressionType === ExpressionType.alternationType)
        {
            this.expressionNode.updateAlternation(this.leftExpression.derive(expressionValue), this.rightExpression.derive(expressionValue))
        }
        else if(this.expressionType === ExpressionType.concatenationType)
        {
            if(this.leftExpression.validate())
            {
                this.expressionNode.updateAlternation(Expression.createConcatenation(this.leftExpression.derive(expressionValue), this.rightExpression), Expression.createReduction(this.rightExpression.derive(expressionValue), rightExpressions => rightExpressions.flatMap(rightExpression => this.leftExpressions.flatMap(leftExpression => ({leftExpression, rightExpression})))))
            }
            else
            {
                this.expressionNode.updateConcatenation(this.leftExpression.derive(expressionValue), this.rightExpression)
            }
        }
        else if(this.expressionType === ExpressionType.reductionType)
        {
            this.expressionNode.updateReduction(this.leftExpression.derive(expressionValue), this.rightExpression)
        }
        else if(this.expressionType === ExpressionType.interpretationType)
        {
            if(this.leftExpression.call(expressionValue, expressionValue))
            {
                this.expressionNode.updateDerivation(expressionValues => [expressionValue])
            }
            else
            {
                this.expressionNode.updateTermination(expressionValue)
            }
        }
        else if(this.expressionType === ExpressionType.derivationType)
        {
            this.expressionNode.updateTermination()
        }
        else if(this.expressionType === ExpressionType.terminationType)
        {
            this.expressionNode.updateTermination()
        }

        return this.expressionNode
    }

    evaluate(expressionValue = Expression.evaluationState)
    {
        if(this.expressionValue === expressionValue)
        {
            return this.expressionNode
        }

        const expressionNode = ExpressionType.substitutionType.evaluate()

        this.expressionValue = expressionValue

        this.expressionNode = expressionNode

        if(this.expressionType === ExpressionType.alternationType)
        {
            if(this.leftExpression.validate() || this.rightExpression.validate())
            {
                this.expressionNode = this.leftExpressions.concat(this.rightExpressions)
            }
        }
        else if(this.expressionType === ExpressionType.concatenationType)
        {
            if(this.leftExpression.validate() && this.rightExpression.validate())
            {
                this.expressionNode = this.leftExpressions.flatMap(leftExpression => this.rightExpressions.flatMap(rightExpression => ({leftExpression, rightExpression})))
            }
        }
        else if(this.expressionType === ExpressionType.reductionType)
        {
            if(this.leftExpression.validate())
            {
                this.expressionNode = this.rightExpression.call(this.rightExpression, this.leftExpressions)
            }
        }
        else if(this.expressionType === ExpressionType.derivationType)
        {
            if(this.expressionType.validate())
            {
                this.expressionNode = this.leftExpression.call(this.leftExpression)
            }
        }

        return this.expressionNode
    }

    updateAlternation(leftExpression, rightExpression)
    {
        if(leftExpression.expressionType === ExpressionType.terminationType)
        {
            if(rightExpression.expressionType === ExpressionType.alternationType)
            {
                return this.updateAlternationType(rightExpression.leftExpression, rightExpression.rightExpression)
            }

            if(rightExpression.expressionType === ExpressionType.concatenationType)
            {
                return this.updateConcatenationType(rightExpression.leftExpression, rightExpression.rightExpression)
            }

            if(rightExpression.expressionType === ExpressionType.reductionType)
            {
                return this.updateReductionType(rightExpression.leftExpression, rightExpression.rightExpression)
            }

            if(rightExpression.expressionType === ExpressionType.interpretationType)
            {
                return this.updateInterpretationType(rightExpression.leftExpression)
            }

            if(rightExpression.expressionType === ExpressionType.derivationType)
            {
                return this.updateDerivationType(rightExpression.leftExpression)
            }

            return this.updateTerminationType(leftExpression.leftExpression)
        }

        if(rightExpression.expressionType === ExpressionType.terminationType)
        {
            if(leftExpression.expressionType === ExpressionType.alternationType)
            {
                return this.updateAlternationType(leftExpression.leftExpression, leftExpression.rightExpression)
            }

            if(leftExpression.expressionType === ExpressionType.concatenationType)
            {
                return this.updateConcatenationType(leftExpression.leftExpression, leftExpression.rightExpression)
            }

            if(leftExpression.expressionType === ExpressionType.reductionType)
            {
                return this.updateReductionType(leftExpression.leftExpression, leftExpression.rightExpression)
            }

            if(leftExpression.expressionType === ExpressionType.interpretationType)
            {
                return this.updateInterpretationType(leftExpression.leftExpression)
            }

            if(leftExpression.expressionType === ExpressionType.derivationType)
            {
                return this.updateDerivationType(leftExpression.leftExpression)
            }

            return this.updateTerminationType(rightExpression.leftExpression)
        }

        return this.updateAlternationType(leftExpression, rightExpression)
    }

    updateConcatenation(leftExpression, rightExpression)
    {
        if(leftExpression.expressionType === ExpressionType.terminationType)
        {
            return this.updateTerminationType(leftExpression.leftExpression)
        }

        if(rightExpression.expressionType === ExpressionType.terminationType)
        {
            return this.updateTerminationType(rightExpression.leftExpression)
        }

        if(leftExpression.expressionType === ExpressionType.derivationType)
        {
            return this.updateReductionType(rightExpression, rightExpressions => rightExpressions.flatMap(rightExpression => leftExpression.leftExpression().flatMap(leftExpression => ({leftExpression: leftExpression, rightExpression: rightExpression}))))
        }

        if(rightExpression.expressionType === ExpressionType.derivationType)
        {
            return this.updateReductionType(leftExpression, leftExpressions => leftExpressions.flatMap(leftExpression => rightExpression.leftExpression().flatMap(rightExpression => ({leftExpression: leftExpression, rightExpression: rightExpression}))))
        }

        if(leftExpression.expressionType === ExpressionType.reductionType)
        {
            return this.updateReductionType(Expression.createConcatenationType(leftExpression.leftExpression, rightExpression), rightExpressions => rightExpressions.flatMap(rightExpression => leftExpression.rightExpression([rightExpression.leftExpression]).flatMap(leftExpression => ({leftExpression: leftExpression, rightExpression: rightExpression.rightExpression}))))
        }

        if(rightExpression.expressionType === ExpressionType.reductionType)
        {
            return this.updateReductionType(Expression.createConcatenationType(leftExpression, rightExpression.leftExpression), leftExpressions => leftExpressions.flatMap(leftExpression => rightExpression.rightExpression([leftExpression.rightExpression]).flatMap(rightExpression => ({leftExpression: leftExpression.leftExpression, rightExpression: rightExpression}))))
        }

        if(leftExpression.expressionType === ExpressionType.concatenationType)
        {
            return this.updateReductionType(Expression.createConcatenationType(leftExpression.leftExpression, Expression.createConcatenationType(leftExpression.rightExpression, rightExpression)), rightExpressions => rightExpressions.flatMap(rightExpression => ({leftExpression: ({leftExpression: rightExpression.leftExpression, rightExpression: rightExpression.rightExpression.leftExpression}), rightExpression: rightExpression.rightExpression.rightExpression})))
        }

        return this.updateConcatenationType(leftExpression, rightExpression)
    }

    updateReduction(leftExpression, rightExpression)
    {
        if(leftExpression.expressionType === ExpressionType.terminationType)
        {
            return this.updateTerminationType(leftExpression.leftExpression)
        }

        if(leftExpression.expressionType === ExpressionType.derivationType)
        {
            return this.updateDerivationType(leftExpressions => rightExpression(leftExpression.leftExpression(leftExpressions)))
        }

        if(leftExpression.expressionType === ExpressionType.reductionType)
        {
            return this.updateReductionType(leftExpression.leftExpression, leftExpressions => rightExpression(leftExpression.rightExpression(leftExpressions)))
        }

        return this.updateReductionType(leftExpression, rightExpression)
    }

    updateSubstitution(leftExpression)
    {
        return this.updateSubstitutionType(leftExpression)
    }

    updateInterpretation(leftExpression)
    {
        return this.updateInterpretationType(leftExpression)
    }

    updateDerivation(leftExpression)
    {
        return this.updateDerivationType(leftExpression)
    }

    updateTermination(leftExpression)
    {
        return this.updateTerminationType(leftExpression)
    }

    updateAlternationType(leftExpression, rightExpression)
    {
        return this.update(ExpressionType.alternationType, leftExpression, rightExpression)
    }

    updateConcatenationType(leftExpression, rightExpression)
    {
        return this.update(ExpressionType.concatenationType, leftExpression, rightExpression)
    }

    updateReductionType(leftExpression, rightExpression)
    {
        return this.update(ExpressionType.reductionType, leftExpression, rightExpression)
    }

    updateSubstitutionType(leftExpression)
    {
        return this.update(ExpressionType.substitutionType, leftExpression)
    }

    updateInterpretationType(leftExpression)
    {
        return this.update(ExpressionType.interpretationType, leftExpression)
    }

    updateDerivationType(leftExpression)
    {
        return this.update(ExpressionType.derivationType, leftExpression)
    }

    updateTerminationType(leftExpression)
    {
        return this.update(ExpressionType.terminationType, leftExpression)
    }
}
