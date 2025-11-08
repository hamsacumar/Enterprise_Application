using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class ServiceItem
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("name")]
        public string Name { get; set; } = null!;

        [BsonElement("description")]
        public string? Description { get; set; }

        [BsonElement("price")]
        public decimal Price { get; set; }

        [BsonElement("vehicleCategory")]
        public string VehicleCategory { get; set; } = string.Empty; 


        [BsonElement("createdAt")]
        [JsonIgnore] // <- hides CreatedAt from POST body
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
