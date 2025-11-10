namespace AdminService.Settings;

public class AuthServiceClientConfig
{
    public string ClassifyUrl { get; }

    public AuthServiceClientConfig(string classifyUrl)
    {
        ClassifyUrl = classifyUrl;
    }
}
