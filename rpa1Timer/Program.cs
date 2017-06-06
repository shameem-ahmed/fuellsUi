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

                int reqNo = 0;
                //2.2. loop all requests
                foreach (rpa1Request req in lstReqs)
                {
                    reqNo++;

                    Console.WriteLine($"RPA1TIMER: Starting req #: {reqNo.ToString()} id: {req.Id}");
                    Thread.Sleep(500);

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
                            Console.WriteLine("RPA1TIMER: Writing search texts to search.txt");
                            Thread.Sleep(500);

                            StreamWriter sw = new StreamWriter($"{sFolder}search.txt");
                            sw.WriteLine(req.Search1);
                            sw.WriteLine(req.Search2);
                            sw.Write(req.Search3);
                            sw.Close();

                            //2.2.4 write filter in filter.txt
                            Console.WriteLine("RPA1TIMER: Writing filter text to filter.txt");
                            Thread.Sleep(500);

                            sw = new StreamWriter($"{sFolder}filter.txt");
                            sw.WriteLine(req.Filter);
                            sw.Close();

                            //2.2.5 write country in country.txt
                            Console.WriteLine("RPA1TIMER: Writing country to country.txt");
                            Thread.Sleep(500);

                            sw = new StreamWriter($"{sFolder}country.txt");
                            sw.Write((req.Country == "0") ? "United States" : "Canada");
                            sw.Close();

                            //2.2.6 write user in user.txt
                            Console.WriteLine("RPA1TIMER: Writing user to user.txt");
                            Thread.Sleep(500);

                            sw = new StreamWriter($"{sFolder}user.txt");
                            sw.Write(req.User);
                            sw.Close();

                            //2.2.7 clear result.txt
                            Console.WriteLine("RPA1TIMER: Clear result.txt");
                            Thread.Sleep(500);

                            sw = new StreamWriter($"{sFolder}result.txt");
                            sw.Write("");
                            sw.Close();

                            //2.2.8. check if UiRobot is running
                            Process[] pname = Process.GetProcessesByName("UiRobot");
                            Thread.Sleep(500);

                            if (pname.Length == 0)
                            {
                                //2.2.9 set status.txt=idle when UiRobot.exe is not running
                                Console.WriteLine("RPA1TIMER: Set status.txt to idle if no instance of UiRobot is running");
                                Thread.Sleep(500);

                                sw = new StreamWriter($"{sFolder}status.txt");
                                sw.Write("idle");
                                sw.Close();
                            }

                            //2.2.8 launch uiPath robo
                            Console.WriteLine("RPA1TIMER: Start UiRobot");
                            Thread.Sleep(500);

                            var process = Process.Start(sUiPathFolder + @"\UiRobot.exe", @"/file:" + sRoboPath);

                            process.WaitForExit();

                            string sResult = File.ReadAllText($"{sFolder}result.txt");

                            Console.WriteLine("RPA1TIMER: Check if result.txt is success");
                            Thread.Sleep(500);

                            if (sResult.ToLower().Trim() == "success")
                            {
                                //2.2.9. read csv file and push data in mongodb (response)
                                Console.WriteLine($"RPA1TIMER: Export results.txt to mongodb results collection");
                                Thread.Sleep(500);

                                m2.CreateResponse(req);

                                Console.WriteLine("RPA1TIMER: Delete results.txt after exporting");
                                Thread.Sleep(500);

                                File.Delete($@"C:\RPAFAISAL\Data\results.csv");
                            }
                            else
                            {
                                //2.2.10. handle uiPath fail and errors
                                Console.WriteLine("RPA1TIMER: If UiRobot failed, set status.txt to idle");
                                Thread.Sleep(500);

                                sw = new StreamWriter($"{sFolder}status.txt");
                                sw.WriteLine("idle");
                                sw.Close();
                            }
                            Console.WriteLine("RPA1TIMER: finish processing request");
                            Console.WriteLine("====================================");
                            Thread.Sleep(500);

                        }
                    }
                }
                endless = false;
            }
            Console.WriteLine("RPA1TIMER: press any key to close the timer...");

            Console.Read();

        }
    }
}
