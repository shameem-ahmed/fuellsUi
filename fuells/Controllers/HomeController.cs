using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace fuells.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Message = "Dashboard";

            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult PO()
        {
            ViewBag.Message = "Purchase Orders.";

            return View();
        }

        public ActionResult Buyer()
        {
            ViewBag.Message = "Buyer";

            return View();
        }

        public ActionResult MDS()
        {
            ViewBag.Message = "Master Data Sheet";

            return View();
        }

        public ActionResult JC()
        {
            ViewBag.Message = "Job card";

            return View();
        }

        public ActionResult Style()
        {
            ViewBag.Message = "Style";

            return View();
        }

        public ActionResult LO()
        {
            ViewBag.Message = "Leather orders";

            return View();
        }

        public ActionResult Supplier()
        {
            ViewBag.Message = "Supplier";

            return View();
        }

        public ActionResult Company()
        {
            ViewBag.Message = "Company";

            return View();
        }

        public ActionResult LOV()
        {
            ViewBag.Message = "List of values";

            return View();
        }

        public ActionResult User()
        {
            ViewBag.Message = "Users";

            return View();
        }

    }
}