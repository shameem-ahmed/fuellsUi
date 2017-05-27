using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace rpa1Ui.Controllers
{
    public class ResultController : Controller
    {
        // GET: Result
        public ActionResult Index(string reqId)
        {
            ViewBag.reqId = reqId;

            return View("Result");
        }
    }
}