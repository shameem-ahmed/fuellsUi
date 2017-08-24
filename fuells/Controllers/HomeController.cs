using System;
using System.Collections.Generic;
using System.Configuration;
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

        public ActionResult Login()
        {
            ViewBag.Message = "Login";
            return View();
        }

        public ActionResult PO()
        {
            ViewBag.Message = "Purchase Orders.";
            return View();
        }

        public ActionResult Customer()
        {
            ViewBag.Message = "Customer";
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

        public ActionResult GLOC()
        {
            ViewBag.Message = "Geo Locations";
            return View();
        }

        public ActionResult User()
        {
            ViewBag.Message = "Users";
            return View();
        }

        public FileResult GetPO(string id)
        {
            id = "0.pdf";
            string sFolder = ConfigurationManager.AppSettings["FuellsFolder"];
            byte[] fileBytes = System.IO.File.ReadAllBytes(sFolder + @"\PO\" + id);
            Response.AppendHeader("Content-Disposition", "inline;test.pdf");
            return File(fileBytes, "application/pdf");

        }

        public FileResult GetLO(string id)
        {
            id = "0.pdf";
            string sFolder = ConfigurationManager.AppSettings["FuellsFolder"];
            byte[] fileBytes = System.IO.File.ReadAllBytes(sFolder + @"\PO\" + id);
            Response.AppendHeader("Content-Disposition", "inline;test.pdf");
            return File(fileBytes, "application/pdf");
        }

    }
}