
$.getJSON("/articles", function(data) {

    
    
    for (var i = 0; i < data.length; i++) {

        var imageBox = $("<img>")
        imageBox.attr('src', data[i].image);

    //   $("#picture").append(imageBox);  
      $("#articles").append(imageBox)
      $("#articles").append("<p data-id='" + data[i]._id + "'>"  + "<br />" + data[i].title + "<br />" + "https://community.sportsengine.com" + data[i].link + "</p>");
    }
  });
  
  
  
  $(document).on("click", "p", function() {
    
    $("#notes").empty();

    var thisId = $(this).attr("data-id");
  
  
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      
      .then(function(data) {
        console.log(data);
       
        $("#notes").append("<h2>" + data.title + "</h2>");
        
        $("#notes").append("<input id='titleinput' name='title' >");
        
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        
        if (data.note) {
          
          $("#titleinput").val(data.note.title);
          
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  
  $(document).on("click", "#savenote", function() {
    
    var thisId = $(this).attr("data-id");
  
   
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
      
        title: $("#titleinput").val(),
       
        body: $("#bodyinput").val()
      }
    })
     
      .then(function(data) {
       
        console.log(data);
        
        $("#notes").empty();
      });
  
   
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  