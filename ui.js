$(document).ready(function () {
    /*
    Create a filter element with an id
    */
    function filterMaker(identifier) {
        return `
    <div id="filter-wrapper${identifier}" class="filter-wrapper valid">
        <div id="delete-filter${identifier}" class="delete-filter" data-target="filter-wrapper${identifier}">
            x
        </div>
        <div id ="filter-name${identifier}" class="filter-name">
            <span class="text">New filter</span>
            <input type="text" class="edit-input hidden" value="New filter"/>
        </div>
        <div id="filter-${identifier}" class="filter" data-identifier="${identifier}">
        </div>
    </div>`
    }
    function deleteEvalElementMaker(identifier, filterIdentifier) {
        return `
                <div id="delete-eval-element${identifier}" class="delete-eval-element" data-target="eval-element${identifier}" data-filter-id="${filterIdentifier}">
                   x
                </div>`
    }
    function refreshFilterValidity(identifier) {
        if (checkValidity(identifier)) {
            $(`#filter-wrapper${identifier}`).addClass('valid')
            $(`#filter-wrapper${identifier}`).removeClass('invalid')
        }
        else {
            $(`#filter-wrapper${identifier}`).addClass('invalid')
            $(`#filter-wrapper${identifier}`).removeClass('valid')
        }
    }
    function makeEditable(base, identifier) {
        $(`#${base}${identifier}`).find('.text').on('click', function () {
            $(this).parent().find('.edit-input').toggleClass('hidden')
            $(this).parent().find('.text').toggleClass('hidden')
            $(this).parent().find('.edit-input').focus();
            $(this).parent().find('.edit-input').select();
        });
        $(`#${base}${identifier}`).find('.edit-input').on('keypress', function (e) {
            if (e.which === 13) {
                const newInput = $(this).parent().find('.edit-input').val();
                $(this).parent().find('.text').text(newInput)
                $(this).parent().data('value', newInput)
                $(this).parent().find('.edit-input').toggleClass('hidden')
                $(this).parent().find('.text').toggleClass('hidden')
            }
        });
    }
    function countEvals($this) {
        return $this.children(".eval-element").length
    }
    let filterCount = 0
    let evalElementCount = 0

    $("#filter-maker").on("click", function () {
        filterCount = filterCount + 1;
        // Step 1: Create the filter
        newFilter = filterMaker(filterCount)
        // Step 2: Add it to the list
        $("#filters").append(newFilter);
        // Step 3: Make the filter name editable
        makeEditable('filter-name', filterCount)
        // Step 4: activate the delete button to delete the filter later
        $(`#delete-filter${filterCount}`).on("click", function () {
            const targetId = $(this).data("target");
            $(`#${targetId}`).remove();
        });

        // Step 5: Make it droppable to accept items from the list
        $(".filter").droppable({
            accept: ".item",
            over: function (event, ui) {
                //$(this).css("background-color", "blue");
            },
            drop: function (event, ui) {
                const filterIdentifier = $(this).data("identifier");
                const evalCount = countEvals($(this));
                if (evalCount >= 15) {
                    alert("too much");
                    return;
                }
                evalElementCount = evalElementCount + 1;
                // Get the dragged element (clone)
                const droppedElement = ui.helper[0];
                // Reset the position to make it stick to the new parent
                $(droppedElement).css({
                    position: 'relative',
                    top: 'auto',
                    left: 'auto'
                });
                $(droppedElement).toggleClass("item")
                $(droppedElement).toggleClass("eval-element")
                $(droppedElement).attr('id', `eval-element${evalElementCount}`);
                $(droppedElement).attr('data-unique', `${evalElementCount}`);
                $(droppedElement).attr('data-filter-id', `${evalElementCount}`);
                if ($(droppedElement).data("type") === "number") {
                    $(droppedElement).find('.text').text("0")
                }
                // Add the delete button, the filterId is added to it to make it easier to refresh the validity of the filter upon deletion
                const deleteButton = deleteEvalElementMaker(evalElementCount, filterIdentifier)
                $(droppedElement).append(deleteButton)
                // Append the dropped element to the filter, wasn't working without taking outerHTML room for improvement 
                $(this).append(droppedElement.outerHTML);

                //Make the new filter deletable
                $(`#delete-eval-element${evalElementCount}`).on("click", function () {
                    const targetId = $(this).data("target");
                    const filterIdentifier = $(this).data("filter-id")
                    $(`#${targetId}`).remove();
                    refreshFilterValidity(filterIdentifier)
                });
                // If this is a number, make it editable
                if ($(`#eval-element${evalElementCount}`).data("type") === "number") {
                    makeEditable('eval-element', evalElementCount);
                }
                // Refresh the filter validity
                refreshFilterValidity(filterCount)
                // Let user set the number
                if ($(`#eval-element${evalElementCount}`).data("type") === "number") {
                    $(`#eval-element${evalElementCount}`).find('.edit-input').toggleClass('hidden')
                    $(`#eval-element${evalElementCount}`).find('.text').toggleClass('hidden')
                    $(`#eval-element${evalElementCount}`).find('.edit-input').focus();
                    $(`#eval-element${evalElementCount}`).find('.edit-input').select();
                }
            }
        });
    })
    /*
    Make items draggable
    */
    $(".item").draggable({
        appendTo: 'body', // Append to the body.
        zIndex: 2,
        containment: $('document'),
        helper: 'clone'
    });
});