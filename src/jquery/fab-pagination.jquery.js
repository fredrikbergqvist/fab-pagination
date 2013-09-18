(function ($) {
    "use strict";

    $.fn.fabPagination = function (options) {
        var settings = $.extend({},
                {
                    itemsPerPage:        10,
                    rowType:             "tbody tr",
                    paginationContainer: ".fab-pagination-container"
                }, options),
            rowsClone = [],
            container = $(this),
            paginationContainer = [],
            fabPagination = {
                init:       function () {
                    fabPagination.gui.populateRowsClone();
                    fabPagination.gui.writePage(0, (settings.itemsPerPage));
                    fabPagination.pagination.gui.createPagination();
                },
                events:{
                    firePageWritten: function (from, to) {
                        container.trigger('paginatioPageWritten', [from, to]);
                    }
                },
                gui:        {
                    writePage:function (from, to) {
                        var visibleRows = rowsClone.slice(from, to);
                        visibleRows.addClass('show');
                        if(container.find("tbody").length > 0){
                            container.find("tbody").html(visibleRows);
                        }else{
                            container.html(visibleRows);
                        }

                        fabPagination.events.firePageWritten(from, to);
                    },
                    populateRowsClone: function () {
                        var domRows = container.find(settings.rowType);
                        rowsClone = domRows.clone(true);
                    }
                },
                pagination: {
                    handlers:  {
                        registerPaginationClick: function (paginationContainer) {
                            paginationContainer.on("click", ".fab-pagination-link", fabPagination.pagination.callbacks.paginationClick);
                            paginationContainer.on("click", ".fab-pagination-link-next", fabPagination.pagination.callbacks.paginationClickNext);
                            paginationContainer.on("click", ".fab-pagination-link-previous", fabPagination.pagination.callbacks.paginationClickPrevious);
                        },
                        registerKeyDown : function () {
                            $(document).keydown(function (e) {
                                var keyCode = (window.event) ? e.which : e.keyCode;
                                if (keyCode === 78) {
                                    fabPagination.pagination.callbacks.paginationClickNext(e);
                                } else if (keyCode === 80) {
                                    fabPagination.pagination.callbacks.paginationClickPrevious(e);
                                }
                            });
                        }
                    },
                    callbacks: {
                        paginationClick: function (e) {
                            e.preventDefault();
                            var paginationLink = $(this),
                                from = paginationLink.data("from"),
                                to = paginationLink.data("to");
                            paginationContainer.find(".selected").removeClass("selected");
                            paginationLink.addClass("selected");
                            fabPagination.gui.writePage(from, to);
                        },
                        paginationClickNext:     function (e) {
                            e.preventDefault();
                            var currentlySelected = paginationContainer.find(".selected"),
                                toBeSelectedListItem = currentlySelected.parent().next("li"),
                                toBeSelected = toBeSelectedListItem.find(".fab-pagination-link"),
                                from = toBeSelected.data("from"),
                                to = toBeSelected.data("to");

                            if (toBeSelected.length === 0) {
                                return;
                            }
                            currentlySelected.removeClass("selected");
                            toBeSelected.addClass("selected");
                            fabPagination.gui.writePage(from, to);
                        },
                        paginationClickPrevious: function (e) {
                            e.preventDefault();
                            var currentlySelected = paginationContainer.find(".selected"),
                                toBeSelectedListItem = currentlySelected.parent().prev("li"),
                                toBeSelected = toBeSelectedListItem.find(".fab-pagination-link"),
                                from = toBeSelected.data("from"),
                                to = toBeSelected.data("to");
                            if (toBeSelected.length === 0) {
                                return;
                            }
                            currentlySelected.removeClass("selected");
                            toBeSelected.addClass("selected");
                            fabPagination.gui.writePage(from, to);
                        }
                    },
                    gui:       {
                        createPagination: function () {
                            if (rowsClone.length < settings.itemsPerPage) {
                                return;
                            }
                            var elements = fabPagination.pagination.gui.createElements();
                            paginationContainer = $(settings.paginationContainer);
                            if (paginationContainer.length === 0) {
                                var paginationAriaLabel = "<p id=\"fabPaginationLabel\" class=\"fab-pagination-audible\">Pagination</p>";
                                paginationContainer = $("<ul role=\"navigation\" aria-labelledby=\"fabPaginationLabel\" class=\"fab-pagination-container\"></ul>");
                                container.before(paginationAriaLabel);
                                container.before(paginationContainer);
                            }
                            fabPagination.pagination.gui.writePagination(paginationContainer, elements);
                        },
                        createElements:   function () {
                            var itemsPerPage = settings.itemsPerPage,
                                numberOfPages = Math.ceil(rowsClone.length / itemsPerPage),
                                elements = [],
                                i = 1,
                                cssClass = "fab-pagination-link  selected";
                            elements.push(fabPagination.pagination.gui.createElement("fab-pagination-link-previous", 0, 0, "<", "Previous ", "prev"));
                            for (i; i <= numberOfPages; i++) {
                                elements.push(fabPagination.pagination.gui.createElement(cssClass, (i - 1) * itemsPerPage, (i * itemsPerPage), i, "Page "));
                                if (i === 1) {
                                    cssClass = "fab-pagination-link";
                                }
                            }
                            elements.push(fabPagination.pagination.gui.createElement("fab-pagination-link-next", 0, 0, ">", "Next ", "next"));

                            return elements;
                        },

                        createElement:   function (cssClass, from, to, linkText, accessibilityText, rel) {
                            var element = "<li><a href=\"#\" ";
                            if(typeof cssClass !== "undefined"){
                                element += "class=\"" + cssClass + "\"";
                            }
                            if (typeof rel !== "undefined") {
                                element += "rel=\"" + rel + "\"";
                            }
                            if (typeof from !== "undefined") {
                                element += " data-from=\"" + from + "\" ";
                            }
                            if (typeof to !== "undefined") {
                                element += " data-to=\"" + to + "\" ";
                            }
                            element += ">";
                            if (typeof accessibilityText !== "undefined") {
                                element += "<span class=\"fab-pagination-audible\">" + accessibilityText + "</span>";
                            }
                            if(typeof linkText !== "undefined"){
                                element += "<span>" + linkText + "</span>";
                            }
                            element += "</a></li>";

                            return element;
                        },
                        writePagination: function (paginationContainer, elements) {
                            paginationContainer.html(elements);
                            fabPagination.pagination.handlers.registerPaginationClick(paginationContainer);
                            fabPagination.pagination.handlers.registerKeyDown();
                        }
                    }
                }
            };
        fabPagination.init();
    };
}(jQuery));
