using System;
using System.Collections.Generic;

namespace sap_mock.Exceptions {

    public class ValidationError {
        public string message { get; set; }
        public string field { get; set; }

        public ValidationError(string msg, string key) {
            message = msg;
            field = key;
        }
    }
    public class BusinessValidationException : Exception {
        

        public List<ValidationError> Errors { get; } 

        public BusinessValidationException(List<ValidationError> ListOfErrors) {
            Errors = ListOfErrors;
        }

        public BusinessValidationException(string message, string field) {
            Errors = new List<ValidationError>();
            Errors.Add(new ValidationError(message, field));
        }

    }
}