using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;

namespace rpa1Timer
{
    public class mongo2
    {

        public string mongoUrl;
        public string mongoDb;

        IMongoClient _client;
        IMongoDatabase _database;

        public void setup()
        {
            _client = new MongoClient(mongoUrl);
            _database = _client.GetDatabase(mongoDb);
        }

        public async Task<Int32> userGetAll()
        {
            Int32 res = 0;

            var collection = _database.GetCollection<BsonDocument>("users");

            var filter = new BsonDocument();

            //var count = 0;

            using (var cursor = await collection.FindAsync(filter))
            {
                while (await cursor.MoveNextAsync())
                {
                    var batch = cursor.Current;

                    foreach (var doc in batch)
                    {
                        Console.WriteLine(doc);

                        res++;

                    }
                }
            }

            return res;

        }

        public async Task<List<rpa1Request>> requestGetAll()
        {
            List<rpa1Request> lstReqs = new List<rpa1Request>();

            var collection = _database.GetCollection<BsonDocument>("requests");

            //var filter = new BsonDocument();
            var filter = Builders<BsonDocument>.Filter.Eq("isActive", true);

            using (var cursor = await collection.FindAsync(filter))
            {
                while (await cursor.MoveNextAsync())
                {
                    var batch = cursor.Current;

                    foreach (var doc in batch)
                    {
                        rpa1Request r1 = new rpa1Request();

                        r1.Id = doc["_id"].ToString();
                        r1.User = doc["user"].ToString();
                        r1.Time = doc["time"].ToString();
                        r1.Type = doc["type"].ToString();
                        r1.Title = doc["title"].ToString();
                        r1.Search1 = doc["search1"].ToString();
                        r1.Search2 = doc["search2"].ToString();
                        r1.Search3 = doc["search3"].ToString();
                        r1.Country = doc["country"].ToString();
                        r1.Filter = doc["filter"].ToString();

                        lstReqs.Add(r1);
                    }
                }
            }

            return lstReqs;

        }

        public async void userInsert(string email, string name, string pwd)
        {
            var user = new BsonDocument
            {
                { "name", name },
                { "email", email },
                { "pwd", pwd },
                { "isActive", true }
            };

            var collection = _database.GetCollection<BsonDocument>("users");

            await collection.InsertOneAsync(user);

        }
    }
}
