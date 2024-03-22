//constants
let table;
let datatable;
let exportColumns = [];
let updatedRaw = undefined;

//document ready
$(document).ready(function () {

    //handle bootstrap modal
    $("body").delegate(".js-render-modal", "click", function () {


        const  renderModelBtn = $(this);

        const modal = $("#Modal");

        //set modal title
        modal.find("#ModalLabel").text(renderModelBtn.data("title"));

        if (renderModelBtn.data("update") !== undefined) {
            updatedRaw = renderModelBtn.parents("tr");
        }

        //set modal body (ajax call)
        $.get({

            url: renderModelBtn.data("url"),
            success: function (result) {

                modal.find(".modal-body").html(result);

                $('.js-select2').select2({
                    dropdownParent: $('#Modal'),
                    tags: true,
                });

                $.validator.unobtrusive.parse(modal);

                //show modal
                modal.modal("show");
            },
            error: function () {
                console.log("Error");
            }

        });


    });
    //hande toggle status
    $("body").delegate(".js-toggle-status", "click", function () {

        var toggleBtn = $(this);
        //handl confirmation sweetAlert2
        Swal.fire({
            title: 'Are you sure?',
            text: "you sure that you need to toggle this item status?",
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

                    url: toggleBtn.data("url"),

                    data: { "__RequestVerificationToken": $("#tokkenForgery").val() },

                    success: function (response) {
                        let vmodel = response;
                        let targetRaw = toggleBtn.parents("tr");

                        targetRaw.find(".js-status").text((vmodel.isDeleted) ? "Deleted" : "Available")
                            .toggleClass("badge-light-success badge-light-danger");
                        //this method created  in site.js
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Successfully",
                            showConfirmButton: false,
                            timer: 1500
                        }).then(() => {
                            targetRaw.addClass('animate__animated animate__bounce');
                            setTimeout(() => { targetRaw.removeClass('animate__animated animate__bounce') }, 3000);
                        });
                    },
                    error: function () {
                        //this method created  in site.js
                        Swal.fire({
                            text: `${response.responseText}`,
                            icon: "warning",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn btn-primary",
                            }
                        }).then(() => {
                            targetRaw.addClass('animate__animated animate__bounce');
                            setTimeout(() => { targetRaw.removeClass('animate__animated animate__bounce') }, 3000);
                        });
                    }
                });
            }
        });

    });
});


//DataTables
var KTDatatables = function () {
    // Private functions
    var initDatatable = function () {
        // Init datatable --- more info on datatables: https://datatables.net/manual/
        datatable = $(table).DataTable({
            "info": true,
            "pageLength": 5,
            order: [[1, 'asc']],
            lengthMenu: [5, 10, 15, 25, 50, 75, 100],
            'drawCallback': function () {
                KTMenu.createInstances();
            },
            columnDefs: [
                {
                    target: [-1],
                    searchable: false,
                    orderable: false
                }
            ],
        });
    }

    // Hook export buttons
    var exportButtons = () => {
        const documentTitle = $(".js-datatables").data("document-title");
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                {
                    extend: 'copyHtml5',
                    title: documentTitle,
                    exportOptions: {
                        columns: [1, 2, 3, 4]
                    }
                },
                {
                    extend: 'excelHtml5',
                    title: documentTitle,
                    exportOptions: {
                        columns: [1, 2, 3, 4]
                    }
                },
                {
                    extend: 'csvHtml5',
                    title: documentTitle,
                    exportOptions: {
                        columns: [1, 2, 3, 4]
                    }
                },
                {
                    extend: 'pdfHtml5',
                    title: documentTitle,
                    exportOptions: {
                        columns: [1 , 2 , 3 , 4]
                    }
                }
            ]
        }).container().appendTo($('#kt_datatable_example_buttons'));

        // Hook dropdown menu click event to datatable export buttons
        const exportButtons = document.querySelectorAll('#kt_datatable_example_export_menu [data-kt-export]');
        exportButtons.forEach(exportButton => {
            exportButton.addEventListener('click', e => {
                e.preventDefault();

                // Get clicked export value
                const exportValue = e.target.getAttribute('data-kt-export');
                const target = document.querySelector('.dt-buttons .buttons-' + exportValue);

                // Trigger click event on hidden datatable export buttons
                target.click();
            });
        });
    }

    // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
    var handleSearchDatatable = () => {
        const filterSearch = document.querySelector('[data-kt-filter="search"]:not(.filterSearchForAvailable)');
        filterSearch.addEventListener('keyup', function (e) {
            datatable.search(e.target.value).draw();
        });
    }

    // Public methods
    return {
        init: function () {
            table = document.querySelector('.js-datatables');

            if (!table) {
                return;
            }

            initDatatable();
            exportButtons();
            handleSearchDatatable();
        }
    };
}();


KTUtil.onDOMContentLoaded(function () {
    KTDatatables.init();
});


//functionalites

//libraries handling
$('.js-signout').on('click', function (event) {
    $('#signout').submit();
});

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
        title: "Successfully",
        showConfirmButton: false,
        timer: 1500
    }).then(() => {
        var itemObj = $(response);

        if (updatedRaw != undefined) { //update
            datatable.row(updatedRaw).remove().draw();
            datatable.row.add(itemObj).draw();
        }
        else {//create
            datatable.row.add(itemObj).draw();
        }


        KTMenu.init();
        KTMenu.initHandlers();
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