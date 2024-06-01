using System.ComponentModel.DataAnnotations;

public class LoginModel
{
    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Password { get; set; } = string.Empty;

    public bool RememberMe { get; set; }
}
