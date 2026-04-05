namespace RestaurantOrderTracker.Application.Common;

public sealed class OperationResult<T>
{
    private OperationResult(bool isSuccess, T? value, IReadOnlyList<string> errors)
    {
        IsSuccess = isSuccess;
        Value = value;
        Errors = errors;
    }

    public bool IsSuccess { get; }

    public T? Value { get; }

    public IReadOnlyList<string> Errors { get; }

    public static OperationResult<T> Success(T value)
    {
        return new OperationResult<T>(true, value, Array.Empty<string>());
    }

    public static OperationResult<T> Failure(params string[] errors)
    {
        return new OperationResult<T>(false, default, errors);
    }

    public static OperationResult<T> Failure(IEnumerable<string> errors)
    {
        return new OperationResult<T>(false, default, errors.ToArray());
    }
}