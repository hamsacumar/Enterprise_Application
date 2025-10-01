namespace AdminService.Services
{
    public interface IAdminService
    {
        string GetMessage();
    }

    public class AdminService : IAdminService
    {
        public string GetMessage()
        {
            return "Hello from Admin Service!";
        }
    }
}
