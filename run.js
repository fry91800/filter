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
    try {
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
                return fn(elt); // Pass the current element into the function

            });
            if (allTrue) {
                result.push(elt)
            }
        }
        return result
    } catch (error) {
        console.log(`Pipeline is invalid`);
        return false;
    }
}

/*
Transform a html div (a subdivision of a module) into a string
*/
function divToString(div) {
    if (div.data("type") === "number") {
        return parseFloat(div.data("value"))
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

/*
Check the validity of a single filter
*/

function checkValidity(identifier) {
    const $filter = $(`#filter-${identifier}`)
    const singleEvalPipeline = [filterToString($filter)]
    const evalResult = filter(elements, singleEvalPipeline)
    if (evalResult === false) {
        return false
    }
    return true
}

function makeResultElement(data) {
    let res = `<div class="result-element fade-in">`;
    for (const key in data) {
        res = res + `<div class="result-line"><strong>${key}:</strong> ${data[key]}</div>`;
    }
    res = res + '</div>'
    return res
}
function makeErrorMessage(){
    return `<div class="warning">
    <span class="result-line">One or more filters are not valid. Filters that are not valid are highlighted in red</span>
    </div>`
}
function makeNoResultMessage(){
    return `<div class="nothing">
    <span class="result-line">No result</span>
    </div>`
}
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
$(document).ready(function () {
    $("#run").on("click", async function () {
        const pipeline = filtersToPipeline();
        const result = filter(elements, pipeline)
        $("#output").removeClass("visible");
        await wait(500);
        $("#output").empty();
        if (result === false) {
            $("#output").append(makeErrorMessage())
        }
        else if (result.length === 0)
        {
            console.log(makeNoResultMessage())
            $("#output").append(makeNoResultMessage());
        }
        else {
            for (elt of result) {
                $("#output").append(makeResultElement(elt))
            }
        }
        $("#output").addClass("visible");
    });
});