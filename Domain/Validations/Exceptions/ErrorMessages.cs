namespace Domain.Validations.Exceptions;

public abstract class ErrorMessages
{
    public const string NullError = "{0} is null.";
    public const string EmptyError = "{0} empty.";
    public const string NotFoundError = " {0} with property {1} = {2} was not found.";
}