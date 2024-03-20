using DentistClinic.Core.Models;
using DentistClinic.Core.ViewModels;
using DentistClinic.CustomeValidation;
using DentistClinic.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DentistClinic.Controllers
{
    public class PaymentsController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        public PaymentsController(IUnitOfWork unitOfWork)
        {
            this._unitOfWork = unitOfWork;
        }

        [AjaxOnly]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public IActionResult Create(PaymentRecord payment)
        {
            //code
            if (ModelState.IsValid)
            {
                Patient currentPatient = _unitOfWork.patientRepository.GetById(payment.PatientId);
                if(currentPatient == null) {
                    return BadRequest("something is wrong..!!");
                }
                if (payment.Type == "Pay"|| payment.Type == "Adjustment -ve") {
                    payment.Value = -payment.Value;
                }
                _unitOfWork.paymentsRepository.Create(payment);
                currentPatient.CurentBalance += payment.Value;
                _unitOfWork.patientRepository.Update(currentPatient);
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
