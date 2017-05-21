using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

using MongoDB;
using MongoDB.Bson;
using MongoDB.Driver;


namespace rpa1Timer
{
    class Program
    {
        static void Main(string[] args)
        {

            string sFolder = @"C:\RPAFAISAL\";
            string sUiPathFolder = @"C:\Users\admin\AppData\Local\UiPath\app-2017.1.6309.33850";
            string sRoboPath = @"C:\Shameem\Projects\RPAFaisal\EbayBot\EbayBot\Main.xaml";

            //1. setup mongodb
            mongo2 m2 = new mongo2();

            m2.mongoUrl = "mongodb://localhost:27017";
            m2.mongoDb = "rpa1db";

            m2.setup();

            //2. start timer
            bool endless = true;

            while (endless)
            {
                //2.1. get all requests
                Task<List<rpa1Request>> task1 = m2.requestGetAll();

                bool isWip = true;

                while (isWip)
                {
                    if (task1.IsCompleted)
                    {
                        List<rpa1Request> lstReqs = task1.Result;

                        //2.2. loop all requests
                        foreach(rpa1Request req in lstReqs)
                        {
                            if (DateTime.Now.Minute == 0)
                            {
                                if (DateTime.Now.Hour.ToString() == req.Time)
                                {
                                    //2.2.3 write search items in search.txt
                                    StreamWriter sw = new StreamWriter($"{sFolder}search.txt");
                                    sw.WriteLine(req.Search1);
                                    sw.WriteLine(req.Search2);
                                    sw.WriteLine(req.Search3);
                                    sw.Close();

                                    //2.2.4 write filter in filter.txt
                                    sw = new StreamWriter($"{sFolder}filter.txt");
                                    sw.WriteLine(req.Filter);
                                    sw.Close();

                                    //2.2.5 write country in country.txt
                                    sw = new StreamWriter($"{sFolder}country.txt");
                                    sw.WriteLine((req.Country == "0") ? "America" : "Canada");
                                    sw.Close();

                                    //2.2.6 launch uiPath robo
                                    var process = Process.Start($"{sUiPathFolder}\\UiRobot.exe", $"/file: {sRoboPath}");

                                    process.WaitForExit();

                                    //2.2.7. read csv file and push data in mongodb (response)



                                }
                            }
                        }


                        Console.WriteLine(lstReqs.Count.ToString());
                        Console.Read();

                        isWip = false;
                    }
                }
                //wait for a minute
                Thread.Sleep(30000);

            }


            Task<int> userCount = m2.userGetAll();


            while (endless)
            {
                if (userCount.IsCompleted)
                {
                    Console.WriteLine(userCount.Result.ToString());
                    Console.ReadLine();
                    endless = false;
                }
            }

            m2.userInsert("shameem@microsoft.com", "Shameem Ahmed", "P@ssw0rd");
         
        }
    }
}
