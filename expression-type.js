export default class ExpressionType
{
    static alternationType = new ExpressionType(1 << 0)

    static concatenationType = new ExpressionType(1 << 1)

    static reductionType = new ExpressionType(1 << 2)

    static substitutionType = new ExpressionType(1 << 3)

    static interpretationType = new ExpressionType(1 << 4)

    static derivationType = new ExpressionType(1 << 5)

    static terminationType = new ExpressionType(1 << 6)

    constructor(expressionValue, expressionCache = [])
    {
        this.expressionValue = expressionValue

        this.expressionCache = expressionCache
    }

    validate()
    {
        return this.expressionValue === ExpressionType.derivationType.expressionValue
    }

    evaluate()
    {
        return this.expressionCache
    }
}
