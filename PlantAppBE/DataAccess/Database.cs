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

        public async Task EnsureCreatedAsync()
        {
            await using var connection = new NpgsqlConnection(ConnectionString);
            await connection.OpenAsync();

            const string createTableSql = @"
                CREATE TABLE IF NOT EXISTS plants (
                    id SERIAL PRIMARY KEY,
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

            const string migrateImageSql = @"
                ALTER TABLE plants
                ADD COLUMN IF NOT EXISTS plant_image_mime TEXT;

                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_name = 'plants'
                          AND column_name = 'plant_image'
                          AND data_type <> 'bytea'
                    ) THEN
                        ALTER TABLE plants
                        ALTER COLUMN plant_image TYPE BYTEA
                        USING NULL;
                    END IF;
                END $$;";

            await using var command = new NpgsqlCommand(createTableSql, connection);
            await command.ExecuteNonQueryAsync();

            await using var migrateCommand = new NpgsqlCommand(migrateImageSql, connection);
            await migrateCommand.ExecuteNonQueryAsync();
        }

        public async Task<List<Plant>> GetPlantsAsync()
        {
            var plants = new List<Plant>();

            await using var connection = new NpgsqlConnection(ConnectionString);
            await connection.OpenAsync();

            const string querySql = @"
                SELECT id,
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
                FROM plants
                ORDER BY id;";

            await using var command = new NpgsqlCommand(querySql, connection);
            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                plants.Add(new Plant
                {
                    Id = reader.GetInt32(0),
                    PlantName = reader.GetString(1),
                    PlantType = reader.IsDBNull(2) ? null : reader.GetString(2),
                    PlantImage = reader.IsDBNull(3) ? null : reader.GetFieldValue<byte[]>(3),
                    PlantImageMimeType = reader.IsDBNull(4) ? null : reader.GetString(4),
                    CareNotes = reader.IsDBNull(5) ? null : reader.GetString(5),
                    Sunlight = reader.IsDBNull(6) ? null : reader.GetString(6),
                    IsSummer = reader.GetBoolean(7),
                    SummerWateringNumber = reader.GetInt32(8),
                    SummerWateringUnit = reader.IsDBNull(9) ? null : reader.GetString(9),
                    SummerWateringDayUnit = reader.GetInt32(10),
                    WinterWateringNumber = reader.GetInt32(11),
                    WinterWateringUnit = reader.IsDBNull(12) ? null : reader.GetString(12),
                    WinterWateringDayUnit = reader.GetInt32(13),
                    FertilizingNumber = reader.GetInt32(14),
                    FertilizingUnit = reader.IsDBNull(15) ? null : reader.GetString(15),
                    FertilizingDayUnit = reader.GetInt32(16),
                    LastWatered = reader.GetInt64(17),
                    LastFertilized = reader.GetInt64(18)
                });
            }

            return plants;
        }

        public async Task<Plant> CreatePlantAsync(Plant plant)
        {
            await using var connection = new NpgsqlConnection(ConnectionString);
            await connection.OpenAsync();

            const string insertSql = @"
                INSERT INTO plants (
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

        public async Task<Plant?> UpdatePlantAsync(int id, Plant plant)
        {
            await using var connection = new NpgsqlConnection(ConnectionString);
            await connection.OpenAsync();

            const string updateSql = @"
                UPDATE plants
                SET plant_name = @plant_name,
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
    }
}
