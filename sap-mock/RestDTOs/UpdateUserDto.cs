using Newtonsoft.Json;

namespace sap_mock.RestDTOs {
    public class UpdateUserDto {

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public int Age { get; set; }
            
        public string Email { get; set; }
    }
}