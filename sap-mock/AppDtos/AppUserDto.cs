using System.ComponentModel.DataAnnotations;
using System;
using Newtonsoft.Json;

namespace sap_mock.AppDtos {
    public class AppUserDto {
        [JsonProperty("integrationId")]
        [Required]
        public string IntegrationId { get; set; }

        [JsonProperty("firstName")]
        [Required]
        public string FirstName { get; set; }
        
        [JsonProperty("lastName")]
        [Required]
        public string LastName { get; set; }
        
        [JsonProperty("age")]
        [Required]
        public int Age { get; set; }

        [JsonProperty("email")]
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [JsonProperty("password")]
        [Required]
        public string Password { get; set; }
        public AppUserDto(User user) {
            IntegrationId = user.IntegrationId;
            FirstName = user.FirstName;
            LastName = user.LastName;
            Age = user.Age;
            Email = user.Email;
            Password = user.Password;
        }

        public AppUserDto() {
            IntegrationId = null;
            FirstName = null;
            LastName = null;
            Email = null;
            Password = null;
        }
    }
}