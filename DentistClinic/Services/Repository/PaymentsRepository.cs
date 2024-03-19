using DentistClinic.Core.Models;
using DentistClinic.Data.Context;
using DentistClinic.Services.Interfaces;

namespace DentistClinic.Services.Repository
{
	public class PaymentsRepository : GenericRepository<PaymentRecord>, IPaymentsRepository
	{
		public PaymentsRepository(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
		{
		}
	}
}
