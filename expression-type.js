export default class ExpressionType
{
    static alternationType = new ExpressionType(0)

    static concatenationType = new ExpressionType(1)

    static reductionType = new ExpressionType(2)

    static substitutionType = new ExpressionType(3)

    static interpretationType = new ExpressionType(4)

    static derivationType = new ExpressionType(5)

    static terminationType = new ExpressionType(6)

    constructor(expressionCode, expressionQueue = [])
    {
        this.expressionCode = expressionCode

        this.expressionQueue = expressionQueue
    }

    validate()
    {
        return this.expressionCode === ExpressionType.derivationType.expressionCode
    }

    evaluate()
    {
        return this.expressionQueue
    }
}
