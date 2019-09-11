$(function() {
    let topics = []
    let search
    let num = 20

    if (localStorage.getItem('theTopics')) {
        topics = JSON.parse(localStorage.getItem('theTopics'))
        $("#history-div").removeClass("disappear")
    }


    //make btn
    function renderButtons() {
        $(".btn-div").empty()

        for (let i = 0; i < topics.length; i++) {
            $(".btn-div").append($("<button>").attr("data-name", topics[i]).addClass("btn btn-outline-secondary btn-search").text(topics[i]))
        }
    }


    //fetch data and create imgs
    function workingBtns() {
        $("#instructions").removeClass("disappear")
        $(".img-div").empty()
        $(".img-div").append($("<div class='card'>").append($("<div>").addClass("card-header img-title")).append($("<div class='card-body'>").append($("<div class='row img-row'>"))))

        let key = "x91xK0YuTl7XYoxf8r50gCfeiEKaiZcj"
        let queryURL = `https://api.giphy.com/v1/gifs/search?q=${search}&api_key=${key}&limit=${num}`
        // console.log(queryURL)
        
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {
            let results = response.data
            // console.log(results);
            
  
            for (let i = 0; i < results.length; i++) {
                //as of april 2018 chrome no longer supporste cross-origin dl: https://developers.google.com/web/updates/2018/02/chrome-65-deprecations#block_cross-origin_wzxhzdk5a_download
                let $gifDiv = $("<div class='col-6 col-sm-3 col-md-2'>")
                let $pTitle = $("<p>").html("<strong>Title:</strong> " + results[i].title)
                let $pRate = $("<p>").html("<strong>Rating:</strong> " + results[i].rating.toUpperCase())
                let $pSource = $("<p>").html("<strong>Source:</strong> <a href='" + results[i].embed_url + "' target ='_blank'>" + results[i].embed_url + "</a>")
                let $pdiv = $("<div class='img-p'>")
                let $searchImg = $("<img>").attr("src", results[i].images.fixed_height_still.url).addClass("res-img").attr("data-still", results[i].images.fixed_height_still.url).attr("data-animate", results[i].images.fixed_height.url).attr("data-state", "still")

                $pdiv.append($pTitle, $pRate, $pSource)
                $gifDiv.append($searchImg, $pdiv)
                $(".img-title").text(search.toUpperCase())
                $(".img-row").prepend($gifDiv)
            }
        })
    }


    // get the search info and run search and append row
    function runSearch(data) {
      search = data
      workingBtns()
      $(".img-row").append($("<div class='add-more col-12'><h3>Add More</h3></div>"))
    }


    //create new btn
    $("#submit").on("click", function(event) {
        event.preventDefault()

        // get input text
        let thisSearch = $("#search-input").val().trim()
        if (thisSearch !== "") {
            // push this search in to search array
            topics.push(thisSearch)

            // clear current local storage data and add new string to data
            localStorage.clear()
            localStorage.setItem('theTopics', JSON.stringify(topics))

            // run the search
            runSearch(thisSearch)

            // add history div if none
            if ($("#history-div").hasClass("disappear")) {
                $("#history-div").removeClass("disappear")
            }

            // create button and clear input
            renderButtons()
            $("#search-input").val("")
        }

    })


    // run search on history buttons 
    $(document).on("click", ".btn-search", function() {
        var data = $(this).attr("data-name")
        runSearch(data)
    })


    // animate or still gif
    $(document).on("click", ".res-img", function() {
        var state = $(this).attr("data-state")

        if (state === "still") {
            $(this).addClass("opacity-none")
            $(this).next(".img-p").addClass("opacity-none")
            $(this).attr("data-state", "animate")
            $(this).attr("src", $(this).attr("data-animate"))
        } else if (state === "animate") {
            $(this).removeClass("opacity-none")
            $(this).next(".img-p").removeClass("opacity-none")
            $(this).attr("data-state", "still")
            $(this).attr("src", $(this).attr("data-still"))
        }
    })

    // add 10 more gifys
    $(document).on("click", ".add-more", function() {
        num += 10
        runSearch(search)
    })


    renderButtons()
})