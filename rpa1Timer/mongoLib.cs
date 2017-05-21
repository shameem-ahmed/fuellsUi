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
        public MongoClient CreateClient()
        {
            return new MongoClient(
                new MongoClientSettings
                {
                    ClusterConfigurator = builder =>
                    {
                        builder.Subscribe(new SingleEventSubscriber<CommandStartedEvent>(CmdStartHandlerForFindCommand));
                        builder.Subscribe(new SingleEventSubscriber<CommandSucceededEvent>(CmdSuccessHandlerForFindCommand));
                    }
                });
        }

        private void CmdStartHandlerForFindCommand(CommandStartedEvent cmdStart)
        {
            if (cmdStart.CommandName == "find")
            {
                WriteToConsole(cmdStart.Command, "request");
            }
        }

        private void CmdSuccessHandlerForFindCommand(CommandSucceededEvent cmdSuccess)
        {
            if (cmdSuccess.CommandName == "find")
            {
                WriteToConsole(cmdSuccess.Reply, "response");
            }
        }

        private void WriteToConsole(BsonDocument data, string type)
        {
            Console.WriteLine($"********************* Find {type} *********************");

            Console.WriteLine(data.ToJson(new JsonWriterSettings { Indent = true }));
        }
    }
}
