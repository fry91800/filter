$(document).ready(function () {    const elements = [
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
    const result = filter(elements, pipeline)
    console.log(result)
});
});