namespace Domain.Entities;

public abstract class BaseEntity
{
    public Guid Id { get; private set; }
    
    protected void SetId(Guid id)
    {
        Id = id;
    }
    
    public override bool Equals(object? obj)
    {
        if (obj == null)
            return false;

        if (obj is not BaseEntity entity)
            return false;

        if (Id != entity.Id)
            return false;

        if (this.GetHashCode() != entity.GetHashCode())
        {
            return false;
        }
        
        return true;
    }

    public override int GetHashCode()
    {
        return Id.GetHashCode();
    }
}