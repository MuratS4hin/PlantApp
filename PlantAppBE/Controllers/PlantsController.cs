using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PlantAppBE.Models;
using PlantAppBE.Workflow;

namespace PlantAppBE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlantsController : ControllerBase
    {
        private readonly IPlantWorkflow _workflow;

        public PlantsController(IPlantWorkflow workflow)
        {
            _workflow = workflow;
        }

        [HttpGet]
        public async Task<ActionResult<List<Plant>>> GetPlants([FromQuery] int? userId = null)
        {
            var plants = await _workflow.GetPlantsAsync(userId);
            return plants;
        }

        [HttpPost]
        public async Task<ActionResult<Plant>> CreatePlant(Plant plant)
        {
            var createdPlant = await _workflow.CreatePlantAsync(plant);
            return CreatedAtAction(nameof(GetPlants), new { id = createdPlant.Id }, createdPlant);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<Plant>> UpdatePlant(int id, Plant plant)
        {
            var updatedPlant = await _workflow.UpdatePlantAsync(id, plant);
            if (updatedPlant == null)
            {
                return NotFound();
            }

            return Ok(updatedPlant);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeletePlant(int id)
        {
            var deleted = await _workflow.DeletePlantAsync(id);
            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}