$(function() {
    let topics = ["cinderella", "moana", "rapunzel", "belle", "pocahontas", "mulan", "little mermaid", "princess jasmine", "princess aurora"]
    let search
    let num = 10

    if (localStorage.getItem('theTopics')) {
        topics = JSON.parse(localStorage.getItem('theTopics'))
    } 

    
    
    //make btn
    let renderButtons = () => {
        $(".btn-div").empty()

        for (let i = 0; i < topics.length; i++) {
            $(".btn-div").append($("<button>").attr("data-name", topics[i]).addClass("btn btn-outline-secondary stuff").text(topics[i]))
        }
      }


    //create new btn
    $("#submit").on("click", function(event) {
        event.preventDefault()

        let thisSearch = $("#search-input").val().trim()
        topics.push(thisSearch)

        localStorage.clear()
        localStorage.setItem('theTopics', JSON.stringify(topics))

        renderButtons()
        $("#search-input").val("")
      })


    //fetch data and create imgs
    function workingBtns() {
        $(".img-div").empty()
        $(".img-div").append($("<div class='card'>").append($("<div>").addClass("card-header img-title")).append($("<div class='card-body'>").append($("<div class='row img-row'>"))))

        let key = "x91xK0YuTl7XYoxf8r50gCfeiEKaiZcj"
        let queryURL = `https://api.giphy.com/v1/gifs/search?q=${search}&api_key=${key}&limit=${num}`
        console.log(queryURL)
        
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {
            let results = response.data
  
            for (let i = 0; i < results.length; i++) {
                //as of april 2018 chrome no longer supporste cross-origin dl: https://developers.google.com/web/updates/2018/02/chrome-65-deprecations#block_cross-origin_wzxhzdk5a_download
                let $gifDiv = $("<div class='col-sm-6 col-md-3'>")
                let $pTitle = $("<p>").html("<strong>Title:</strong> " + results[i].title)
                let $pRate = $("<p>").html("<strong>Rating:</strong> " + results[i].rating.toUpperCase())
                let $pSource = $("<p>").html("<strong>Source:</strong> <a href='" + results[i].source + "' target ='_blank'>" + results[i].source + "</a>")
                let $searchImg = $("<img>").attr("src", results[i].images.fixed_height_still.url).addClass("res-img").attr("data-still", results[i].images.fixed_height_still.url).attr("data-animate", results[i].images.fixed_height.url).attr("data-state", "still")
  
                
                if (results[i].source === ""){
                    $gifDiv.append($searchImg, $pTitle, $pRate)
                } else {
                    $gifDiv.append($searchImg, $pTitle, $pRate, $pSource)
                }
                $(".img-title").text(search.toUpperCase())
                $(".img-row").prepend($gifDiv)
            }
          })
      }

    $(document).on("click", ".stuff", function() {
        search = $(this).attr("data-name")
        num = 10
        workingBtns()
        $(".img-row").append($("<div class='col-sm-6 col-md-3'>").append($("<img>").attr("src", "images/plus-box.jpg").addClass("img-fluid")))
    })


      // animate or still gif
    $(document).on("click", ".res-img", function() {
        var state = $(this).attr("data-state")
        console.log(state)
        
        if (state === "still") {
            $(this).attr("data-state", "animate")
            $(this).attr("src", $(this).attr("data-animate"))
            
            
          } else if (state === "animate") {
            $(this).attr("data-state", "still")
            $(this).attr("src", $(this).attr("data-still"))
          }
    })

    $(document).on("click", ".img-fluid", function() {
        num += 10
        workingBtns()
        $(".img-row").append($("<div class='col-sm-6 col-md-3'>").append($("<img>").attr("src", "images/plus-box.jpg").addClass("img-fluid")))
    })


    renderButtons()
})