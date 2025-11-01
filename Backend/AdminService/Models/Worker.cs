using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AdminService.Models
{
    public class Worker
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("email")]
        public string Email { get; set; } = string.Empty;

        [BsonElement("contact")]
        public string Contact { get; set; } = string.Empty;

        [BsonElement("role")]
        public string Role { get; set; } = "worker";

        [BsonElement("specialization")]
        public string? Specialization { get; set; }

        [BsonElement("passwordHash")]
        public string PasswordHash { get; set; } = string.Empty;
    }
}
