using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using sap_mock.Models;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;
using sap_mock.RestDTOs;
using System.Collections.Generic;
using sap_mock.AppDtos;
using sap_mock.Exceptions;

namespace sap_mock.Services {

    public class UserService {

        private readonly UserContext _context;

        public UserService(UserContext context) {
            _context = context;
        }

        public async Task<List<User>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> GetUser(long id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User> CreateUser(User user) {
            user.IntegrationId = Guid.NewGuid().ToString();
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User> CreateUser(AppUserDto userDto) {
            var existingUser = await _context.Users.SingleOrDefaultAsync(u => u.Email == userDto.Email);

            if (existingUser != null) {

                throw new BusinessValidationException(
                    "User with provided email already exists", "email"
                );
            }
            
            var user = new User();
            user.IntegrationId = userDto.IntegrationId;
            user.FirstName = userDto.FirstName;
            user.LastName = userDto.LastName;
            user.Email = userDto.Email;
            user.Age = userDto.Age;
            user.Password = userDto.Password;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User> UpdateUser(long id, UpdateUserDto userDto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return null;
            }

            if (userDto.FirstName != null) {
                user.FirstName = userDto.FirstName;
            }
            
            if (userDto.LastName != null) {
                user.LastName = userDto.LastName;
            }

            if (userDto.Age != 0) {
                user.Age = userDto.Age;
            }

            if (userDto.Email != null) {
                user.Email = userDto.Email;
            }

            try
            {
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
                return user;
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
        }

        public async Task<User> UpdateUser(AppUserDto userDto)
        {
            Console.WriteLine(userDto);
            var user = await _context.Users.SingleOrDefaultAsync(u => u.IntegrationId == userDto.IntegrationId);
            if (user == null)
            {
                return null;
            }

            user.FirstName = userDto.FirstName;
            user.LastName = userDto.LastName;
            user.Age = userDto.Age;
            user.Email = userDto.Email;

            var existingUser = await _context.Users.SingleOrDefaultAsync(u => u.Email == userDto.Email && u.IntegrationId != userDto.IntegrationId);

            if (existingUser != null) {

                throw new BusinessValidationException(
                    "User with provided email already exists", "email"
                );
            }

            try
            {
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
                return user;
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
        }

        public async Task<User> DeleteUser(string id)
        {
            var user = await _context.Users.SingleAsync(u => u.IntegrationId == id);
            if (user == null)
            {
                return null;
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();                
            return user;
        }

        public async Task<User> DeleteUser(long id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return null;
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();                
            return user;
        }

    }

}