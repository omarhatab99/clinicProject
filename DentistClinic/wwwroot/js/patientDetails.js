$(document).ready(function () {

    $(".payment-date").flatpickr({
        altInput: true,
        altFormat: "F j, Y",
        defaultDate: "today",
    });

    let paymentForm = document.getElementById("paymentForm");
    
    $('.js-add-payment').unbind().bind('click', function (event) {

        event.preventDefault();

        let modal = $("#paymentRecords");

        if (!paymentForm.payment_date.value || !paymentForm.payment_type.value || !paymentForm.payment_value.value) {
            Swal.fire({
                text: `some fields must be required ..!!`,
                icon: "warning",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                    confirmButton: "btn btn-primary",
                }
            });
        }
        else {
            //create object from payment and send it to ajax data
            const paymentObject = new Object();
            paymentObject.date = paymentForm.payment_date.value;
            paymentObject.type = paymentForm.payment_type.value;
            paymentObject.value= paymentForm.payment_value.value;
            paymentObject.note = paymentForm.payment_note.value;
            paymentObject.patientid = document.getElementById("PaymentPatientId").value;
            $.post({

                url: "/Payments/Create",
                cache: false,
                data: {

                    "date": paymentObject.date,
                    "type": paymentObject.type,
                    "value": paymentObject.value,
                    "note": paymentObject.note,
                    "patientId":paymentObject.patientid,
                    "__RequestVerificationToken": $("#tokkenForgery").val(),

                },

                success: function (response) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Payment has been Registerd",
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        var itemObj = $(response);
                        $(".js-datatables").DataTable().row.add(itemObj).draw();
                        modal.modal("hide");
                    });
                },
                error: function (response) {
                    Swal.fire({
                        text: `${response.responseText}`,
                        icon: "warning",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary",
                        }
                    });
                }
            });
        }
        


    });


});
