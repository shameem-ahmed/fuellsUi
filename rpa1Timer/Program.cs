using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Configuration;

using MongoDB;
using MongoDB.Bson;
using MongoDB.Driver;


namespace rpa1Timer
{
    class Program
    {
        static bool bTest = false;

        static void Main(string[] args)
        {

            if (args.Length == 1)
            {
                bTest = args[0] == "yes";
            }

            string sFolder = ConfigurationManager.AppSettings["sFolder"].ToString();
            string sUiPathFolder = ConfigurationManager.AppSettings["sUiPathFolder"].ToString();
            string sRoboPath = ConfigurationManager.AppSettings["sRoboPath"].ToString();
         
            //1. setup mongodb
            mongo2 m2 = new mongo2();

            m2.mongoUrl = ConfigurationManager.AppSettings["mongoUrl"].ToString();
            m2.mongoDb = ConfigurationManager.AppSettings["mongoDb"].ToString();

            m2.setup();

            //2. start timer
            bool endless = true;

            while (endless)
            {

                //2.1. get all requests
                List<rpa1Request> lstReqs = m2.requestGetAll();

                //2.2. loop all requests
                foreach (rpa1Request req in lstReqs)
                {
                    int min = 0;
                    string hour = req.Time;
                    if (bTest)
                    {
                        min = DateTime.Now.Minute;
                        hour = DateTime.Now.Hour.ToString();
                    }
                    if (DateTime.Now.Minute == min)
                    {

                        if (DateTime.Now.Hour.ToString() == hour)
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

                            //2.2.6 write user in user.txt
                            sw = new StreamWriter($"{sFolder}user.txt");
                            sw.WriteLine(req.User);
                            sw.Close();

                            //2.2.7 launch uiPath robo
                            var process = Process.Start($"{sUiPathFolder}\\UiRobot.exe", $"/file: {sRoboPath}");

                            process.WaitForExit();

                            //2.2.8. read csv file and push data in mongodb (response)
                            m2.CreateResponse(req);

                        }
                    }
                }
                //wait for a minute
                Thread.Sleep(1000);
            }
        }
    }
}
