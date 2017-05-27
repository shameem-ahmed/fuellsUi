using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using System.IO;
using System.Threading;

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

        public List<rpa1Request> requestGetAll()
        {
            List<rpa1Request> lstReqs = new List<rpa1Request>();

            var collection = _database.GetCollection<BsonDocument>("rpa1requests");

            //var filter = new BsonDocument();
            var filter = Builders<BsonDocument>.Filter.Eq("isActive", true);

            var f1 = collection.Find(filter);
            var l1 = f1.ToList<BsonDocument>();

            foreach (var doc in l1)
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

            return lstReqs;

        }

        public void CreateResponse(rpa1Request req)
        {
            string filepath = @"C:\RPAFAISAL\Data\results.csv";

            if (File.Exists(filepath))
            {
                string[] allLines = File.ReadAllLines(filepath);

                var query = (from line in allLines
                             let data = line.Split(';')
                             select new
                             {
                                 RunDate = data[0],
                                 title = data[1],
                                 isBuyNow = data[3],
                                 price = data[7],
                                 bidsCount = data[4],
                                 endingTime = data[5],
                                 url = data[6],
                                 datePosted = data[8],
                                 returns = "",
                                 condition = "",
                                 pageNo = "",
                                 rowNo = ""
                             }).ToList();

                var res = new BsonDocument
                {
                    { "request", new ObjectId(req.Id) },
                    { "runDate", DateTime.Now.ToString() },
                    { "resultCount", query.Count() },
                    { "__v", 0 }
                };

                var collection = _database.GetCollection<BsonDocument>("rpa1responses");

                Console.WriteLine("RPA1TIMER: Insert response doc");
                Thread.Sleep(500);

                collection.InsertOne(res);

                string resId = res["_id"].ToString();

                var collection2 = _database.GetCollection<BsonDocument>("rpa1responsedetails");

                int i = 0;
                foreach (var row in query)
                {
                    var res2 = new BsonDocument
                    {
                        { "response", new ObjectId(resId) },
                        { "title", row.title },
                        { "isBuyNow", row.isBuyNow },
                        { "price", row.price },
                        { "bidsCount", row.bidsCount},
                        { "endingTime", row.endingTime },
                        { "url", row.url },
                        { "datePosted", row.datePosted },
                        { "retrns", row.returns },
                        { "condition", row.condition },
                        { "pageNo", row.pageNo},
                        { "rowNo", row.rowNo },
                        { "__v", 0 }
                    };
                    
                    collection2.InsertOne(res2);

                    i++;
                    Console.WriteLine($"RPA1TIMER: Insert response detail doc#: {i.ToString()}");
                    Thread.Sleep(500);
                }
            }
        }

        public void responseInsert(dynamic Data)
        {
            var user = new BsonDocument
            {
                { "request", "" },
                { "runDate", DateTime.Now.ToString() },
                { "resultCount", Data.Count() }

            };

            var collection = _database.GetCollection<BsonDocument>("rpa1responses");

            collection.InsertOne(Data);
        }

        public void userInsert(string email, string name, string pwd)
        {
            var user = new BsonDocument
            {
                { "name", name },
                { "email", email },
                { "pwd", pwd },
                { "isActive", true }
            };

            var collection = _database.GetCollection<BsonDocument>("rpa1users");

            collection.InsertOne(user);

        }
    }
}
