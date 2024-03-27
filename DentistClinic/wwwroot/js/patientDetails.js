
//document ready
$(document).ready(function () {


    $("body").delegate(".js-delete-box", "click", function () {

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

    $("body").delegate(".js-delete-plan", "click", function () {
        var deleteBtn = $(this);

        //handl confirmation sweetAlert2
        Swal.fire({
            title: 'Are you sure?',
            text: "you sure want delete this plan?",
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

                            deleteBtn.closest(".plan-row").remove();
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


    //Create new Prescription
    $(".js-create-prescription").on("click", function () {


        let createPrescriptionBtn = $(this); 


        //call ajax
        $.post({

            url: createPrescriptionBtn.data("url"),
            cache: false,
            data: { "__RequestVerificationToken": $("#tokkenForgery").val() },

            success: function (response) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Prescription has been created",
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {

                    $(".prescription-container").prepend(response);

                    KTMenu.init();
                    KTMenu.initHandlers();
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


    });
    $(".js-delete-prescription").on("click", function () {
        var deleteBtn = $(this);

        //handl confirmation sweetAlert2
        Swal.fire({
            title: 'Are you sure?',
            text: "you sure want delete this prescription?",
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
                            title: "Prescription has been deleted",
                            showConfirmButton: false,
                            timer: 1500
                        }).then(() => {

                            deleteBtn.closest(".prescription-box").remove();
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


});











