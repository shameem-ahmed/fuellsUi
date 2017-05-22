using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Driver;
using MongoDB.Driver.Core.Events;

namespace rpa1Timer
{
    class mongoLib
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

            var collection = _database.GetCollection<BsonDocument>("requests");

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

        //private void CmdStartHandlerForFindCommand(CommandStartedEvent cmdStart)
        //{
        //    if (cmdStart.CommandName == "find")
        //    {
        //        WriteToConsole(cmdStart.Command, "request");
        //    }
        //}

        //private void CmdSuccessHandlerForFindCommand(CommandSucceededEvent cmdSuccess)
        //{
        //    if (cmdSuccess.CommandName == "find")
        //    {
        //        WriteToConsole(cmdSuccess.Reply, "response");
        //    }
        //}

        //private void WriteToConsole(BsonDocument data, string type)
        //{
        //    Console.WriteLine($"********************* Find {type} *********************");

        //    Console.WriteLine(data.ToJson(new JsonWriterSettings { Indent = true }));
        //}
    }
}
