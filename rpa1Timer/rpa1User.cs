using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace rpa1Timer
{
    public class rpa1User
    {
        [BsonId]
        public ObjectId ID { get; set;  }

        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("email")]
        public string Email { get; set; }

        [BsonElement("pwd")]
        public string Password { get; set; }

        [BsonElement("isActive")]
        public bool IsActive { get; set; }
    }

    public class rpa1Request
    {
        public string Id { get; set; }

        public string User { get; set; }

        public string Time { get; set; }

        public string Type { get; set; }

        public string Title { get; set; }

        public string Search1 { get; set; }

        public string Search2 { get; set; }

        public string Search3 { get; set; }

        public string Country { get; set; }

        public string Filter { get; set; }

        public bool IsActive { get; set; }

    }
}
