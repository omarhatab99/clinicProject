using DentistClinic.Core.Models;
using DentistClinic.Core.ViewModels;
using DentistClinic.CustomeValidation;
using Microsoft.AspNetCore.Mvc;

namespace DentistClinic.Controllers
{
    public class PaymentsController : Controller
    {

        [AjaxOnly]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public IActionResult Create(PaymentRecord payment)
        {
            //code
            if (ModelState.IsValid)
            {
                //code
                PaymentViewModel vmodel = new PaymentViewModel()
                {
                    Date = payment.Date,
                    Type = payment.Type,
                    Value = payment.Value,
                    Note = payment.Note,
                };


                return PartialView("_Payment" , vmodel);

            }
            else
            {
                return BadRequest("something is wrong..!!");
            }
        }
    }
}
