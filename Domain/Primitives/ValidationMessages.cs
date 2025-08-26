namespace Domain.Primitives;

public static class ValidationMessages
{
    public static string NotEmpty = "{PropertyName} not filled in.";
    public static string WrongLength="{PropertyName} should be no less {MinLength} and no more {MaxLength}.";
    public static string WrongTime = "{PropertyName} can't be less than the end.";
    public static string WrongEmail = "{PropertyName} is not E-mail address";
    public static string WrongPhone = "{PropertyName} is not number of phone";
}