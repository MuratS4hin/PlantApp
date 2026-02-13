using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Npgsql;
using PlantAppBE.Models;
using NpgsqlTypes;

namespace PlantAppBE.DataAccess
{
    public class Database
    {
        private readonly DatabaseSettings _settings;

        public Database(IOptions<DatabaseSettings> options)
        {
            _settings = options.Value;
        }

        private string ConnectionString =>
            $"Host={_settings.Host};Port={_settings.Port};Database={_settings.Database};Username={_settings.Username};Password={_settings.Password}";

        #region Create
        public async Task EnsureCreatedAsync()
        {
            await using var connection = new NpgsqlConnection(ConnectionString);
            await connection.OpenAsync();

            const string createUsersSql = @"
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    email TEXT NOT NULL,
                    password_hash TEXT NOT NULL,
                    password_salt BYTEA NOT NULL,
                    created_at BIGINT NOT NULL,
                    full_name TEXT,
                    phone_number TEXT,
                    location TEXT,
                    bio TEXT
                );";

            const string createUsersIndexSql = @"
                CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx
                ON users (LOWER(email));";

            const string createPlantsSql = @"
                CREATE TABLE IF NOT EXISTS plants (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    plant_name TEXT NOT NULL,
                    plant_type TEXT,
                    plant_image BYTEA,
                    plant_image_mime TEXT,
                    care_notes TEXT,
                    sunlight TEXT,
                    is_summer BOOLEAN NOT NULL DEFAULT false,
                    summer_watering_number INTEGER NOT NULL DEFAULT 0,
                    summer_watering_unit TEXT,
                    summer_watering_day_unit INTEGER NOT NULL DEFAULT 0,
                    winter_watering_number INTEGER NOT NULL DEFAULT 0,
                    winter_watering_unit TEXT,
                    winter_watering_day_unit INTEGER NOT NULL DEFAULT 0,
                    fertilizing_number INTEGER NOT NULL DEFAULT 0,
                    fertilizing_unit TEXT,
                    fertilizing_day_unit INTEGER NOT NULL DEFAULT 0,
                    last_watered BIGINT NOT NULL DEFAULT 0,
                    last_fertilized BIGINT NOT NULL DEFAULT 0
                );";

            await using var createUsersCommand = new NpgsqlCommand(createUsersSql, connection);
            await createUsersCommand.ExecuteNonQueryAsync();

            await using var createUsersIndexCommand = new NpgsqlCommand(createUsersIndexSql, connection);
            await createUsersIndexCommand.ExecuteNonQueryAsync();

            await using var createPlantsCommand = new NpgsqlCommand(createPlantsSql, connection);
            await createPlantsCommand.ExecuteNonQueryAsync();
        }

        public async Task<User> CreateUserAsync(User user)
        {
            await using var connection = new NpgsqlConnection(ConnectionString);
            await connection.OpenAsync();

            const string insertSql = @"
                INSERT INTO users (
                    email,
                    password_hash,
                    password_salt,
                    created_at
                )
                VALUES (
                    @email,
                    @password_hash,
                    @password_salt,
                    @created_at
                )
                RETURNING id;";

            await using var command = new NpgsqlCommand(insertSql, connection);
            command.Parameters.AddWithValue("email", user.Email);
            command.Parameters.AddWithValue("password_hash", user.PasswordHash);
            var saltParam = command.Parameters.Add("password_salt", NpgsqlDbType.Bytea);
            saltParam.Value = user.PasswordSalt;
            command.Parameters.AddWithValue("created_at", user.CreatedAt);

            var newId = (int)(await command.ExecuteScalarAsync());
            user.Id = newId;

            return user;
        }

        public async Task<Plant> CreatePlantAsync(Plant plant)
        {
            await using var connection = new NpgsqlConnection(ConnectionString);
            await connection.OpenAsync();

            const string insertSql = @"
                INSERT INTO plants (
                    user_id,
                    plant_name,
                    plant_type,
                    plant_image,
                    plant_image_mime,
                    care_notes,
                    sunlight,
                    is_summer,
                    summer_watering_number,
                    summer_watering_unit,
                    summer_watering_day_unit,
                    winter_watering_number,
                    winter_watering_unit,
                    winter_watering_day_unit,
                    fertilizing_number,
                    fertilizing_unit,
                    fertilizing_day_unit,
                    last_watered,
                    last_fertilized
                )
                VALUES (
                    @user_id,
                    @plant_name,
                    @plant_type,
                    @plant_image,
                    @plant_image_mime,
                    @care_notes,
                    @sunlight,
                    @is_summer,
                    @summer_watering_number,
                    @summer_watering_unit,
                    @summer_watering_day_unit,
                    @winter_watering_number,
                    @winter_watering_unit,
                    @winter_watering_day_unit,
                    @fertilizing_number,
                    @fertilizing_unit,
                    @fertilizing_day_unit,
                    @last_watered,
                    @last_fertilized
                )
                RETURNING id;";

            await using var command = new NpgsqlCommand(insertSql, connection);
            command.Parameters.AddWithValue("user_id", (object?)plant.UserId ?? DBNull.Value);
            command.Parameters.AddWithValue("plant_name", plant.PlantName);
            command.Parameters.AddWithValue("plant_type", (object?)plant.PlantType ?? DBNull.Value);
            var imageParam = command.Parameters.Add("plant_image", NpgsqlDbType.Bytea);
            imageParam.Value = (object?)plant.PlantImage ?? DBNull.Value;
            command.Parameters.AddWithValue("plant_image_mime", (object?)plant.PlantImageMimeType ?? DBNull.Value);
            command.Parameters.AddWithValue("care_notes", (object?)plant.CareNotes ?? DBNull.Value);
            command.Parameters.AddWithValue("sunlight", (object?)plant.Sunlight ?? DBNull.Value);
            command.Parameters.AddWithValue("is_summer", plant.IsSummer);
            command.Parameters.AddWithValue("summer_watering_number", plant.SummerWateringNumber);
            command.Parameters.AddWithValue("summer_watering_unit", (object?)plant.SummerWateringUnit ?? DBNull.Value);
            command.Parameters.AddWithValue("summer_watering_day_unit", plant.SummerWateringDayUnit);
            command.Parameters.AddWithValue("winter_watering_number", plant.WinterWateringNumber);
            command.Parameters.AddWithValue("winter_watering_unit", (object?)plant.WinterWateringUnit ?? DBNull.Value);
            command.Parameters.AddWithValue("winter_watering_day_unit", plant.WinterWateringDayUnit);
            command.Parameters.AddWithValue("fertilizing_number", plant.FertilizingNumber);
            command.Parameters.AddWithValue("fertilizing_unit", (object?)plant.FertilizingUnit ?? DBNull.Value);
            command.Parameters.AddWithValue("fertilizing_day_unit", plant.FertilizingDayUnit);
            command.Parameters.AddWithValue("last_watered", plant.LastWatered);
            command.Parameters.AddWithValue("last_fertilized", plant.LastFertilized);

            var newId = (int)(await command.ExecuteScalarAsync());
            plant.Id = newId;

            return plant;
        }
        #endregion

        #region Read
        public async Task<User?> GetUserByEmailAsync(string email)
        {
            await using var connection = new NpgsqlConnection(ConnectionString);
            await connection.OpenAsync();

            const string querySql = @"
                SELECT id,
                       email,
                       password_hash,
                       password_salt,
                      created_at,
                      full_name,
                      phone_number,
                      location,
                      bio
                FROM users
                WHERE LOWER(email) = LOWER(@email)
                LIMIT 1;";

            await using var command = new NpgsqlCommand(querySql, connection);
            command.Parameters.AddWithValue("email", email);

            await using var reader = await command.ExecuteReaderAsync();
            if (!await reader.ReadAsync())
            {
                return null;
            }

            return new User
            {
                Id = reader.GetInt32(0),
                Email = reader.GetString(1),
                PasswordHash = reader.GetString(2),
                PasswordSalt = reader.GetFieldValue<byte[]>(3),
                CreatedAt = reader.GetInt64(4),
                FullName = reader.IsDBNull(5) ? null : reader.GetString(5),
                PhoneNumber = reader.IsDBNull(6) ? null : reader.GetString(6),
                Location = reader.IsDBNull(7) ? null : reader.GetString(7),
                Bio = reader.IsDBNull(8) ? null : reader.GetString(8)
            };
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            await using var connection = new NpgsqlConnection(ConnectionString);
            await connection.OpenAsync();

            const string querySql = @"
                SELECT id,
                       email,
                       password_hash,
                       password_salt,
                       created_at,
                       full_name,
                       phone_number,
                       location,
                       bio
                FROM users
                WHERE id = @id
                LIMIT 1;";

            await using var command = new NpgsqlCommand(querySql, connection);
            command.Parameters.AddWithValue("id", id);

            await using var reader = await command.ExecuteReaderAsync();
            if (!await reader.ReadAsync())
            {
                return null;
            }

            return new User
            {
                Id = reader.GetInt32(0),
                Email = reader.GetString(1),
                PasswordHash = reader.GetString(2),
                PasswordSalt = reader.GetFieldValue<byte[]>(3),
                CreatedAt = reader.GetInt64(4),
                FullName = reader.IsDBNull(5) ? null : reader.GetString(5),
                PhoneNumber = reader.IsDBNull(6) ? null : reader.GetString(6),
                Location = reader.IsDBNull(7) ? null : reader.GetString(7),
                Bio = reader.IsDBNull(8) ? null : reader.GetString(8)
            };
        }

        public async Task<List<Plant>> GetPlantsAsync(int? userId = null)
        {
            var plants = new List<Plant>();

            await using var connection = new NpgsqlConnection(ConnectionString);
            await connection.OpenAsync();

            var querySql = @"
                SELECT id,
                       user_id,
                       plant_name,
                       plant_type,
                       plant_image,
                       plant_image_mime,
                       care_notes,
                       sunlight,
                       is_summer,
                       summer_watering_number,
                       summer_watering_unit,
                       summer_watering_day_unit,
                       winter_watering_number,
                       winter_watering_unit,
                       winter_watering_day_unit,
                       fertilizing_number,
                       fertilizing_unit,
                       fertilizing_day_unit,
                       last_watered,
                       last_fertilized
                FROM plants";

            if (userId.HasValue)
            {
                querySql += " WHERE user_id = @user_id";
            }

            querySql += " ORDER BY id;";

            await using var command = new NpgsqlCommand(querySql, connection);
            if (userId.HasValue)
            {
                command.Parameters.AddWithValue("user_id", userId.Value);
            }

            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                plants.Add(new Plant
                {
                    Id = reader.GetInt32(0),
                    UserId = reader.IsDBNull(1) ? null : reader.GetInt32(1),
                    PlantName = reader.GetString(2),
                    PlantType = reader.IsDBNull(3) ? null : reader.GetString(3),
                    PlantImage = reader.IsDBNull(4) ? null : reader.GetFieldValue<byte[]>(4),
                    PlantImageMimeType = reader.IsDBNull(5) ? null : reader.GetString(5),
                    CareNotes = reader.IsDBNull(6) ? null : reader.GetString(6),
                    Sunlight = reader.IsDBNull(7) ? null : reader.GetString(7),
                    IsSummer = reader.GetBoolean(8),
                    SummerWateringNumber = reader.GetInt32(9),
                    SummerWateringUnit = reader.IsDBNull(10) ? null : reader.GetString(10),
                    SummerWateringDayUnit = reader.GetInt32(11),
                    WinterWateringNumber = reader.GetInt32(12),
                    WinterWateringUnit = reader.IsDBNull(13) ? null : reader.GetString(13),
                    WinterWateringDayUnit = reader.GetInt32(14),
                    FertilizingNumber = reader.GetInt32(15),
                    FertilizingUnit = reader.IsDBNull(16) ? null : reader.GetString(16),
                    FertilizingDayUnit = reader.GetInt32(17),
                    LastWatered = reader.GetInt64(18),
                    LastFertilized = reader.GetInt64(19)
                });
            }

            return plants;
        }
        #endregion

        #region Update
        public async Task<User?> UpdateUserProfileAsync(int id, string? fullName, string? phoneNumber, string? location, string? bio)
        {
            await using var connection = new NpgsqlConnection(ConnectionString);
            await connection.OpenAsync();

            const string updateSql = @"
                UPDATE users
                SET full_name = @full_name,
                    phone_number = @phone_number,
                    location = @location,
                    bio = @bio
                WHERE id = @id
                RETURNING id;";

            await using var command = new NpgsqlCommand(updateSql, connection);
            command.Parameters.AddWithValue("id", id);
            command.Parameters.AddWithValue("full_name", (object?)fullName ?? DBNull.Value);
            command.Parameters.AddWithValue("phone_number", (object?)phoneNumber ?? DBNull.Value);
            command.Parameters.AddWithValue("location", (object?)location ?? DBNull.Value);
            command.Parameters.AddWithValue("bio", (object?)bio ?? DBNull.Value);

            var result = await command.ExecuteScalarAsync();
            if (result == null)
            {
                return null;
            }

            return await GetUserByIdAsync(id);
        }

        public async Task<Plant?> UpdatePlantAsync(int id, Plant plant)
        {
            await using var connection = new NpgsqlConnection(ConnectionString);
            await connection.OpenAsync();

            const string updateSql = @"
                UPDATE plants
                SET user_id = @user_id,
                    plant_name = @plant_name,
                    plant_type = @plant_type,
                    plant_image = @plant_image,
                    plant_image_mime = @plant_image_mime,
                    care_notes = @care_notes,
                    sunlight = @sunlight,
                    is_summer = @is_summer,
                    summer_watering_number = @summer_watering_number,
                    summer_watering_unit = @summer_watering_unit,
                    summer_watering_day_unit = @summer_watering_day_unit,
                    winter_watering_number = @winter_watering_number,
                    winter_watering_unit = @winter_watering_unit,
                    winter_watering_day_unit = @winter_watering_day_unit,
                    fertilizing_number = @fertilizing_number,
                    fertilizing_unit = @fertilizing_unit,
                    fertilizing_day_unit = @fertilizing_day_unit,
                    last_watered = @last_watered,
                    last_fertilized = @last_fertilized
                WHERE id = @id
                RETURNING id;";

            await using var command = new NpgsqlCommand(updateSql, connection);
            command.Parameters.AddWithValue("id", id);
            command.Parameters.AddWithValue("user_id", (object?)plant.UserId ?? DBNull.Value);
            command.Parameters.AddWithValue("plant_name", plant.PlantName);
            command.Parameters.AddWithValue("plant_type", (object?)plant.PlantType ?? DBNull.Value);
            var updateImageParam = command.Parameters.Add("plant_image", NpgsqlDbType.Bytea);
            updateImageParam.Value = (object?)plant.PlantImage ?? DBNull.Value;
            command.Parameters.AddWithValue("plant_image_mime", (object?)plant.PlantImageMimeType ?? DBNull.Value);
            command.Parameters.AddWithValue("care_notes", (object?)plant.CareNotes ?? DBNull.Value);
            command.Parameters.AddWithValue("sunlight", (object?)plant.Sunlight ?? DBNull.Value);
            command.Parameters.AddWithValue("is_summer", plant.IsSummer);
            command.Parameters.AddWithValue("summer_watering_number", plant.SummerWateringNumber);
            command.Parameters.AddWithValue("summer_watering_unit", (object?)plant.SummerWateringUnit ?? DBNull.Value);
            command.Parameters.AddWithValue("summer_watering_day_unit", plant.SummerWateringDayUnit);
            command.Parameters.AddWithValue("winter_watering_number", plant.WinterWateringNumber);
            command.Parameters.AddWithValue("winter_watering_unit", (object?)plant.WinterWateringUnit ?? DBNull.Value);
            command.Parameters.AddWithValue("winter_watering_day_unit", plant.WinterWateringDayUnit);
            command.Parameters.AddWithValue("fertilizing_number", plant.FertilizingNumber);
            command.Parameters.AddWithValue("fertilizing_unit", (object?)plant.FertilizingUnit ?? DBNull.Value);
            command.Parameters.AddWithValue("fertilizing_day_unit", plant.FertilizingDayUnit);
            command.Parameters.AddWithValue("last_watered", plant.LastWatered);
            command.Parameters.AddWithValue("last_fertilized", plant.LastFertilized);

            var result = await command.ExecuteScalarAsync();
            if (result == null)
            {
                return null;
            }

            plant.Id = id;
            return plant;
        }
        #endregion

        #region Delete
        public async Task<bool> DeletePlantAsync(int id)
        {
            await using var connection = new NpgsqlConnection(ConnectionString);
            await connection.OpenAsync();

            const string deleteSql = @"
                DELETE FROM plants
                WHERE id = @id;";

            await using var command = new NpgsqlCommand(deleteSql, connection);
            command.Parameters.AddWithValue("id", id);

            var affected = await command.ExecuteNonQueryAsync();
            return affected > 0;
        }
        #endregion
    }
}
