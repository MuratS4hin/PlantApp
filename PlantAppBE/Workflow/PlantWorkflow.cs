using System.Collections.Generic;
using System.Threading.Tasks;
using PlantAppBE.DataAccess;
using PlantAppBE.Models;

namespace PlantAppBE.Workflow
{
    public class PlantWorkflow : IPlantWorkflow
    {
        private readonly Database _database;

        public PlantWorkflow(Database database)
        {
            _database = database;
        }

        public async Task<List<Plant>> GetPlantsAsync()
        {
            return await _database.GetPlantsAsync();
        }

        public async Task<Plant> CreatePlantAsync(Plant plant)
        {
            if (string.IsNullOrWhiteSpace(plant.PlantName))
            {
                plant.PlantName = "Unnamed Plant";
            }

            return await _database.CreatePlantAsync(plant);
        }

        public async Task<Plant?> UpdatePlantAsync(int id, Plant plant)
        {
            if (string.IsNullOrWhiteSpace(plant.PlantName))
            {
                plant.PlantName = "Unnamed Plant";
            }

            return await _database.UpdatePlantAsync(id, plant);
        }

        public async Task<bool> DeletePlantAsync(int id)
        {
            return await _database.DeletePlantAsync(id);
        }
    }
}
