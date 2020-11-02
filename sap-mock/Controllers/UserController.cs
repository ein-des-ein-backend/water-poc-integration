using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using sap_mock.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using sap_mock.Services;
using sap_mock.RestDTOs;
using System.Collections.Generic;
using sap_mock.AppDtos;

namespace sap_mock.Controllers {

    [ApiController]
    [Route("/api/users")]
    public class UserController : ControllerBase {
        private readonly UserService _userService;

        private readonly MessagingService _messagingService;

        public UserController(UserService userService, MessagingService messagingService) {
            _userService = userService;
            _messagingService = messagingService;
        }

        [HttpGet]
        public async Task<ActionResult<List<User>>> GetUsers()
        {
            return await _userService.GetUsers();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(long id)
        {
            var user = await _userService.GetUser(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpPost]
        public async Task<ActionResult<User>> CreateUser(User user) {
            var createdUser = await _userService.CreateUser(user);
            var serializerSettings = new JsonSerializerSettings();
            serializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            string messageDataString = JsonConvert.SerializeObject(new AppUserDto(createdUser), serializerSettings);
            await _messagingService.sendMessage("[SAP] Created user", messageDataString);
            return CreatedAtAction("CreateUser", new { id = createdUser.Id }, createdUser);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<User>> UpdateUser(long id, UpdateUserDto userDto)
        {
            var updatedUser = await _userService.UpdateUser(id, userDto);
            if (updatedUser == null)
            {
                return NotFound();
            }
            var serializerSettings = new JsonSerializerSettings();
            serializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            string messageDataString = JsonConvert.SerializeObject(new AppUserDto(updatedUser), serializerSettings);
            await _messagingService.sendMessage("[SAP] Updated user", messageDataString);
            return CreatedAtAction("UpdateUser", new { id = updatedUser.Id }, updatedUser);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<User>> DeleteUser(long id)
        {
            var deletedUser = await _userService.DeleteUser(id);
            if (deletedUser == null)
            {
                return NotFound();
            }
            var serializerSettings = new JsonSerializerSettings();
            serializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            string messageDataString = JsonConvert.SerializeObject(new AppUserDto(deletedUser), serializerSettings);
            await _messagingService.sendMessage("[SAP] Deleted user", messageDataString);
                
            return CreatedAtAction("DeleteUser", new { id = deletedUser.Id }, deletedUser);;
        }
    }

}