using System.Collections.Generic;
using System.Threading.Tasks;
using PlantAppBE.Models;

namespace PlantAppBE.Workflow
{
    public interface IPlantWorkflow
    {
        Task<List<Plant>> GetPlantsAsync();
        Task<Plant> CreatePlantAsync(Plant plant);
        Task<Plant?> UpdatePlantAsync(int id, Plant plant);
        Task<bool> DeletePlantAsync(int id);
    }
}
