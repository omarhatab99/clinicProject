//constants
let documentations = [];
let updatedRaw = undefined;

//document ready
$(document).ready(function () {



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

            $.post({

                url: "/Payments/Create",
                cache: false,
                data: {

                    "date": paymentObject.date,
                    "type": paymentObject.type,
                    "value": paymentObject.value,
                    "note": paymentObject.note,
                    "__RequestVerificationToken": $("#tokkenForgery").val(),

                },

                success: function (response) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Reservation has been Cancelled",
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

    //handle bootstrap modal
    $("body").delegate(".js-report-modal", "click", function () {

        let renderBtn = $(this);

        let modal = $("#Modal");

        //set modal title
        modal.find("#ModalLabel").text(renderBtn.data("title"));

        if (renderBtn.data("update") !== undefined) {
            updatedRaw = renderBtn.closest(".medical-report");
        }

        //set modal body (ajax call)
        $.get({

            url: renderBtn.data("url"),
            success: function (result) {

                modal.find(".modal-body").html(result);

                $.validator.unobtrusive.parse(modal);

                //handle flatepicker
                $(".report-sdate").flatpickr({
                    altInput: true,
                    altFormat: "F j, Y",
                    maxDate: "today"
                });
                $(".report-edate").flatpickr({
                    altInput: true,
                    altFormat: "F j, Y",
                    maxDate:"today"
                });

                uploaddocumentationsDragAndDrop();
                //show modal
                modal.modal("show");
            },
            error: function () {
                console.log("Error");
            }

        });


    });

    //hande toggle status
    $("body").delegate(".js-delete-report", "click", function () {

        var deleteBtn = $(this);
        //handl confirmation sweetAlert2
        Swal.fire({
            title: 'Are you sure?',
            text: "you sure want delete this report?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, iam sure!',
            customClass: {
                confirmButton: "btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary",
                cancelButton: "btn btn-outline btn-outline-dashed btn-outline-danger btn-active-light-danger",
            }
        }).then((result) => {
            if (result.isConfirmed) {
                //call ajax
                $.post({

                    url: deleteBtn.data("url"),
                    cache: false,
                    data: { "__RequestVerificationToken": $("#tokkenForgery").val() },

                    success: function () {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Medical Report has been deleted",
                            showConfirmButton: false,
                            timer: 1500
                        }).then(() => {
                            
                            deleteBtn.closest(".medical-report").remove();
                            //remove it from datatable
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

    customLightBox();



});


//datatables

//functionalites
const uploaddocumentationsDragAndDrop = () => {
    const browse = document.querySelector(".select");
    const input = document.querySelector(".form-upload input");

    browse.addEventListener("click", () => { //to make input open from browse text

        input.click();

    });


    //input change event
    input.addEventListener("change", () => {

        documentations = [];
        const imgs = Array.from(input.files);

        imgs.forEach((img) => { //add documentations from input in documentations array after chcek no consistency and length no more 5

            if (documentations.every((e) => { return e.name !== img.name })) {
                documentations.push(img);
            }


        });
        showdocumentations(documentations); //display in image container

    });


    //display selected documentations in container
    const showdocumentations = (documentations) => {
        let cartona = "";

        documentations.forEach((img, index) => {

            cartona +=
                `
            <div class="image" style="margin-right:5px">
                <img src=${URL.createObjectURL(img)} alt="image">
                <span class="deleteImg" data-index=${index}>&times;</span>
            </div>
            `

        });

        document.querySelector(".image-container").innerHTML = cartona;
    }


    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("deleteImg")) {
            removeFileFromFileList(event.target.dataset.index, 1);
            documentations = [];
            const imgs = Array.from(input.files);

            imgs.forEach((img) => { //add documentations from input in documentations array after chcek no consistency and length no more 5

                if (documentations.every((e) => { return e.name !== img.name })) {
                    documentations.push(img);
                }


            });
            showdocumentations(documentations); //display in image container
        }
    });


    function removeFileFromFileList(index) {
        const dt = new DataTransfer()
        const { files } = input

        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            if (parseInt(index) !== i)
                dt.items.add(file) // here you exclude the file. thus removing it.
        }

        input.files = dt.files // Assign the updates list
    }

}
function customLightBox() {
    //handle lightcustom
    let imgIndex = 0;
    let documentationList = [];
    $("body").delegate(".gallery-img-link", "click", function (event) {
        event.preventDefault();
        var card = $(this).data("card");
        documentationList = $(`.documentation-img.${card}`);

        imgIndex = $(this).data("index");
        $(".image-center").attr("src", documentationList[imgIndex].src);

        $(".lightBox-overlay").removeClass("d-none");
        $(".lightBox-overlay").addClass("d-flex");
        $(".lightBox-overlay").css("z-index", 1000000000);
    });

    $("body").delegate(".lightBox-overlay", "click", function () {

        $(".lightBox-overlay").removeClass("d-flex");
        $(".lightBox-overlay").addClass("d-none");

    });

    $("body").delegate(".lightbox-arrow-left", "click", function (event) {

        event.stopPropagation();
        imgIndex--;
        if (imgIndex < 0) {
            imgIndex = documentationList.length - 1;
            $(".image-center").attr("src", documentationList[imgIndex].src);
        }
        else {
            $(".image-center").attr("src", documentationList[imgIndex].src);
        }

    });

    $("body").delegate(".lightbox-arrow-right", "click", function (event) {

        event.stopPropagation();

        imgIndex++;

        if (imgIndex > (documentationList.length - 1)) {
            imgIndex = 0;
            $(".image-center").attr("src", documentationList[imgIndex].src);
        }
        else {
            $(".image-center").attr("src", documentationList[imgIndex].src);
        }

    });
}
function disableBtnSubmit() {
    $("body :submit").attr("disabled", "disabled").attr("data-kt-indicator", "on");
}
function onRequestBegin() {
    disableBtnSubmit();
};
function onRequestSuccess(response) {
    let modal = $("#Modal");
    modal.modal("hide");

    Swal.fire({
        position: "center",
        icon: "success",
        title: response.message,
        showConfirmButton: false,
        timer: 1500
    }).then(() => {
        var itemObj = $(response);

        if (updatedRaw != undefined) { //update
            $(updatedRaw).after(itemObj);
            updatedRaw.remove();
        }
        else {//create
            $(".reports-container").append(itemObj);
        }

        KTMenu.init();
        KTMenu.initHandlers();
        customLightBox();
    });
    
}
function onRequestFailure(response) {
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
function onRequestComplete() {
    $("body :submit").removeAttr("disabled").removeAttr("data-kt-indicator");
};

//libraries handling
$(".payment-date").flatpickr({
    altInput: true,
    altFormat: "F j, Y",
    defaultDate: "today",
});





