namespace Domain.Entities
{
    public class RefreshToken : BaseEntity
    {
        public string Token { get; private set; }
        public DateTime ExpiryDate { get; private set; }
        public Guid UserId { get; private set; }

        public RefreshToken(string token, DateTime expiryDate, Guid userId)
        {
            Token = token;
            ExpiryDate = expiryDate;
            UserId = userId;
        }
    }
}