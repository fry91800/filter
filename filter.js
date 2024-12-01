$(document).ready(function () {
    /*
    Piece of code to add and delete filters every filter has a unique identifier to
    help destoy it later using the delete filter button
    */
    var captureCurrentId = null
    var captureDeleteId = null
    let filterCount = 0
    let evalElementCount = 0
    $("#filter-maker").on("click", function () {
        filterCount = filterCount + 1;
        const newFilter = `<div id="filter-wrapper${filterCount}" class="filter-wrapper">
                        <div id="delete-filter${filterCount}" class="delete-filter" data-target="filter-wrapper${filterCount}">
                            x
                        </div>
                        <div class="filter-name">
                            New Filter
                        </div>
                        <div id="test-module" class="filter">
                        </div>
                    </div>`
        $("#filters").append(newFilter);

        $(`#delete-filter${filterCount}`).on("click", function () {
            const targetId = $(this).data("target");
            $(`#${targetId}`).remove();
        });

        // Make the newly created filter a droppable area to drop items
        $(".filter").droppable({
            accept: ".item",
            over: function (event, ui) {
                $(this).css("background-color", "blue");
            },
            drop: function (event, ui) {

                evalElementCount = evalElementCount + 1;
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
                    $(droppedElement).html(`
                            <span class="text">0</span>
                             <div id="delete-eval-element${evalElementCount}" class="delete-eval-element" data-target="eval-element${evalElementCount}">
                                x
                             </div>
                            `)
                }
                $(droppedElement).append(`
                <div id="delete-eval-element${evalElementCount}" class="delete-eval-element" data-target="eval-element${evalElementCount}">
                   x
                </div>`)
                // Append the dropped element to the filter, wasn't working without taking outerHTML room for improvement 
                $(this).append(droppedElement.outerHTML);

                $(`#delete-eval-element${evalElementCount}`).on("click", function () {
                    const targetId = $(this).data("target");
                    $(`#${targetId}`).remove();
                });

                /* */
                // When the div is clicked, turn it into an input field
                $(`#eval-element${evalElementCount}`).find('.text').on('click', function () {
                    var currentText = $(this).parent().data("value"); // Get the current text
                    var currentId = $(this).parent().data("unique");
                    console.log("clicked, id found is: " + currentId)
                    $(this).parent().html(`<input type="text" id="input-${currentId}" data-unique="${currentId}" class="edit-input" value="` + currentText + '" />');

                    // Focus on the input field
                    $('.edit-input').focus();
                });

                // Validate the text when Enter is pressed
                $(document).on('keypress', '.edit-input', function (e) {
                    if (e.which === 13) { // Enter key
                        var newText = $(this).val(); // Get the new text
                        var id = $(this).data("unique")
                        console.log("entered, id found is: " + id)
                        $(this).parent().html(`
                            <span class="text">${newText}</span>
                             <div id="delete-eval-element${id}" class="delete-eval-element" data-target="eval-element${id}">
                                x
                             </div>
                            `);
                        $(`#eval-element${id}`).data("value", newText)
                                // Restore data attributes
                                $(this).parent().data("value", newText);
                                $(this).parent().data("unique", id);
                        // $(`#eval-element${evalElementCount}`).append(`
                        //     <div id="delete-eval-element${evalElementCount}" class="delete-eval-element" data-target="eval-element${evalElementCount}">
                        //        x
                        //     </div>`)
                        // Reset the trigger for input
                        console.log("adding event listener for: " +id)
                        $(`#eval-element${id}`).find('.text').on('click', function () {

                            console.log(JSON.stringify($(this)))
                            var currentText = $(this).parent().data("value"); // Get the current text
                            var currentId = $(this).parent().data("unique");
                            console.log("clicked, id passed is: " + currentId)
                            $(this).parent().html(`<input type="text" data-unique="${currentId}" class="edit-input" value="` + currentText + '" />');

                            // Focus on the input field
                            $('.edit-input').focus();
                        });
                        // Reset the delete button trigger
                        $(`#delete-eval-element${id}`).on("click", function () {
                            const targetId = $(this).data("target");
                            $(`#${targetId}`).remove();
                        });
                    }
                });

                // Optional: Close input if clicked outside
                // $(document).on('click', function (e) {
                //     if (!$(e.target).closest(`#eval-element${evalElementCount}`).length) {
                //         var newText = $('.edit-input').val();
                //         $(droppedElement).text(newText); // Set the new text
                //     }
                // });
                /* */
                // // Same, can't change that before dropping the element, doing it after
                // $('.eval-element').on("click", function () {
                //     $(this).remove();
                // });
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
    /*
    This is the example from the mail
    */
    const elements = [
        {
            "rb": 0.5,
            "drb": 0.2,
            "galactic_latitude": 5,
            "jd": 2460318.5,
            "jdstarthist": 2460314.5,
        },
        {
            "rb": 0.5,
            "drb": 0.99,
            "galactic_latitude": -5,
            "jd": 2460318.5,
            "jdstarthist": 2460314.5,
        },
        {
            "rb": 0.5,
            "drb": 0.99,
            "galactic_latitude": 30,
            "jd": 2460318.5,
            "jdstarthist": 2460300.5,
        },
        {
            "rb": 0.9,
            "drb": 0.8,
            "galactic_latitude": 30,
            "jd": 2460318.5,
            "jdstarthist": 2460314.5,
        }
    ]
    /*
    The pipeline, each element correspond to a filter (as a string, to use with javasctipt eval() function)
    */
    const pipeline = [];


    /*
    Takes a list of element and a pipeline, each element goes trough the pipeline
    If the output is true, it means that the element made it through the filters
    */
    function filter(elements, pipeline) {
        if (!pipeline) {
            return elements
        }
        const result = [];
        /*
        This piece of code helps make the code more modular, the pipeline strings don't have to
        specify that the properties used are from the "elt" element from the for loop
        */
        const compiledPipeline = pipeline.map(condition => new Function("elt", `with(elt) { return ${condition}; }`));

        // 
        for (const elt of elements) {
            const allTrue = compiledPipeline.every(fn => {
                try {
                    return fn(elt); // Pass the current element into the function
                } catch (error) {
                    console.error(`Error evaluating: "${fn}"`, error);
                    return false; // Return false if there's an error
                }
            });
            if (allTrue) {
                result.push(elt)
            }
        }
        return result
    }

    /*
    Transform a html div (a subdivision of a module) into a string
    */
    function divToString(div) {
        if (div.data("type") === "number") {
            return parseInt(div.data("value"))
        }
        return div.data("value")
    }

    /*
    Transform a html filter into an eval string
    */
    function filterToString($filter) {
        let string = "";
        const $children = $filter.children();

        $children.each(function () {
            string += divToString($(this)) + " ";
        });
        return string.trim()
    }

    /*
    Filter to pipeline function
    */
    function filtersToPipeline() {
        const pipeline = []
        $(".filter").each(function () {
            const str = filterToString($(this))
            if (str && str != "")
                pipeline.push(str)
        });
        return pipeline
    }

    $("#run").on("click", function () {
        const pipeline = filtersToPipeline();
        console.log(pipeline);
    });
    const $testModule = $('#test-module');
    const evalTest = filterToString($testModule)
    pipeline.push(evalTest)
    const filterTest = filter(elements, pipeline)
    console.log(filterTest)
});