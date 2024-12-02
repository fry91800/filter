$(document).ready(function () {
    /*
    Create a filter element with an id
    */
    function filterMaker(number) {
        return `
    <div id="filter-wrapper${number}" class="filter-wrapper">
        <div id="delete-filter${number}" class="delete-filter" data-target="filter-wrapper${number}">
            x
        </div>
        <div id ="filter-name${number}">
            <span class="text">New filter</span>
            <input type="text" class="edit-input hidden" value="New filter"/>
        </div>
        <div id="filter-${number}" class="filter">
        </div>
    </div>`
    }
    function deleteEvalElementMaker(number) {
        return `
                <div id="delete-eval-element${number}" class="delete-eval-element" data-target="eval-element${number}">
                   x
                </div>`
    }
    function makeFilterNameEditable(filterCount){
        console.log(filterCount)
        $(`#filter-name${filterCount}`).find('.text').on('click', function () {
            $(this).parent().find('.edit-filter-name').toggleClass('hidden')
            $(this).parent().find('.text').toggleClass('hidden')
            $(this).parent().find('.edit-filter-name').focus();
            $(this).parent().find('.edit-filter-name').select();
        });
        $(`#filter-name${filterCount}`).find('.edit-filter-name').on('keypress', function (e) {
            if (e.which === 13) {
                const newInput = $(this).parent().find('.edit-input').val();
                $(this).parent().find('.text').text(newInput)
                $(this).parent().data('value', newInput)
                $(this).parent().find('.edit-input').toggleClass('hidden')
                $(this).parent().find('.text').toggleClass('hidden')
            }
        });
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
    let filterCount = 0
    let evalElementCount = 0

    $("#filter-maker").on("click", function () {
        filterCount = filterCount + 1;
        console.log("New filter made, count: " + filterCount)
        // Step 1: Create the filter
        newFilter = filterMaker(filterCount)
        // Step 2: Add it to the list
        $("#filters").append(newFilter);
        // Step 3: Make the filter name editable
        makeEditable('filter-name', filterCount)
        // Step 4: activate the delete button to delete it later
        $(`#delete-filter${filterCount}`).on("click", function () {
            const targetId = $(this).data("target");
            $(`#${targetId}`).remove();
        });

        // Step 5: Make it droppable to accept items from the list
        $(".filter").droppable({
            accept: ".item",
            over: function (event, ui) {
                $(this).css("background-color", "blue");
            },
            drop: function (event, ui) {

                evalElementCount = evalElementCount + 1;
                console.log("New element dropped, count: " + evalElementCount)
                // Get the dragged element (clone)
                const droppedElement = ui.helper[0];
                // Reset the position to make it stick to the new parent
                $(droppedElement).css({
                    position: 'relative',
                    top: 'auto',
                    left: 'auto'
                });
                // Change it from item to eval-element for future processing
                $(droppedElement).toggleClass("item")
                $(droppedElement).toggleClass("eval-element")
                $(droppedElement).attr('id', `eval-element${evalElementCount}`);
                $(droppedElement).attr('data-unique', `${evalElementCount}`);
                if ($(droppedElement).data("type") === "number") {
                    $(droppedElement).find('.text').text("0")
                }
                const deleteButton = deleteEvalElementMaker(evalElementCount)
                $(droppedElement).append(deleteButton)
                // Append the dropped element to the filter, wasn't working without taking outerHTML room for improvement 
                $(this).append(droppedElement.outerHTML);

                $(`#delete-eval-element${evalElementCount}`).on("click", function () {
                    const targetId = $(this).data("target");
                    $(`#${targetId}`).remove();
                });
                // If this is a number, make it editable
                if ($(`#eval-element${evalElementCount}`).data("type") === "number") {
                    makeEditable('eval-element', evalElementCount);
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