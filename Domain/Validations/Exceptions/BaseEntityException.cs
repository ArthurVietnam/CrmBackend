namespace Domain.Validations.Exceptions;

public abstract class BaseEntityException : Exception
{
    protected BaseEntityException(string message) : base(message)
    {
    }
}