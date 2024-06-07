//when the document is ready..
$(document).ready(function () {
  const selectedAmenities = [];
  // Attach change event handler to amenity checkboxes within the amenities list
  $('.amenities li input[type="checkbox"]').change(function () {
    const amenityId = $(this).data('id'); // Get the amenity ID from the data-id attribute
    const amenityName = $(this).data('name'); // Get the amenity name from the data-name attribute (optional)

    if ($(this).is(':checked')) {
      selectedAmenities.push({ id: amenityId, name: amenityName });
    } else {
      const index = selectedAmenities.findIndex(function (amenity) {
        return amenity.id === amenityId;
      });
      if (index > -1) {
        selectedAmenities.splice(index, 1);
      }
    }

    const amenityList = selectedAmenities.map(function (amenity) {
      return amenity.name;
    }).join(', ');
    $('.amenities h4').text(amenityList);
  });

const statesId = {};
const citiesId = {};
const citiesStates = {};

$('.locations ul > li > input[type="checkbox"]').change(function () {
  const stateId = $(this).attr('data-id');
  const stateName = $(this).attr('data-name');
  $(this).css('color', 'green');
  if ($(this).prop('checked')) {
    statesId[stateId] = stateName;
    citiesStates[stateId] = stateName;
  } else {
    delete statesId[stateId];
    delete citiesStates[stateId];
  }

  $('.locations h4').text(Object.values(citiesStates).join(', '));
});

$('.locations ul li ul input[type="checkbox"]').change(function () {
  const cityId = $(this).attr('data-id');
  const cityName = $(this).attr('data-name');

  if ($(this).prop('checked')) {
    citiesId[cityId] = cityName;
    citiesStates[cityId] = cityName;
  } else {
    delete citiesId[cityId];
    delete citiesStates[cityId];
  }

  $('.locations h4').text(Object.values(citiesStates).join(', '));
});



//show the api connection with the red color.
  const url = 'http://' + window.location.hostname + ':5001/api/v1/status/';
  $.ajax({
    type: 'GET',
    url,
    success: function (response) {
      if (response.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#api_status').removeClass('available');
    }
  });


//retrieve all the place data with an empty data
  $.ajax({
    type: 'POST',
    url: 'http://localhost:5001/api/v1/places_search/',
    contentType: 'application/json',
    data: '{}',
    dataType: 'json',
    success: function (places) {
     $.each(places, function(index, place){
      $('.places').append(
        '<article>' +
          '<div class="title_box">' +
            '<h2>' + place.name + '</h2>' +
            '<div class="price_by_night">' + place.price_by_night +'</div>' +
          '</div>' +
          '<div class="information">' +
            '<div class="max_guest">' +
            '<br />' + place.max_guest + ' Guests' +
            '</div>' +
            '<div class="number_rooms">' +
            '<br />' + place.number_rooms + ' Bedrooms' +
            '</div>' +
            '<div class="number_bathrooms">' +
            '<br />' + place.number_bathrooms + ' Bathroom' +
            '</div>' +
          '</div>' +
          '<div class="description">' + place.description +'</div>' +
          '<div class="reviews" id="' + place.id + '">' +
              '<h2><b>Reviews</b></h2>' +
              '<span class="display" id="' + place.id + '">show</span>' +
          '</div>' +
        '</article>'
      );
     })
    },
  });

  
//retrieve all the places based on the filter
  $('.filters button').click(function () {
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: 'http://localhost:5001/api/v1/places_search/',
      data: JSON.stringify({
        amenities: selectedAmenities.map(a => a.id),
        states: Object.keys(statesId),
        cities: Object.keys(citiesId)
      }),
      dataType: 'json',
      success: function (places) {
        $('.places').empty();
        $.each(places, function (index, place) {
          $('.places').append(
            '<article>' +
              '<div class="title_box">' +
                '<h2>' + place.name + '</h2>' +
                '<div class="price_by_night">' + place.price_by_night +'</div>' +
              '</div>' +
              '<div class="information">' +
                '<div class="max_guest">' +
                '<br />' + place.max_guest + ' Guests' +
                '</div>' +
                '<div class="number_rooms">' +
                '<br />' + place.number_rooms + ' Bedrooms' +
                '</div>' +
                '<div class="number_bathrooms">' +
                '<br />' + place.number_bathrooms + ' Bathroom' +
                '</div>' +
              '</div>' +
              '<div class="description">' + place.description + '</div>' +
              '<div class="reviews" id="' + place.id + '">' +
                  '<h2><b>Reviews</b></h2>' +
                  '<span class="display" id="' + place.id + '">show</span>' +
              '</div>' +
            '</article>'
          );
        });
      }
    })
  })

//retrieve all the review when the show is clicked
 $('.places').on('click', '.reviews .display', function () {
    const reviewId = $(this).attr('id');
    const theReviewdiv = $(this).parent()
    const theH2 = $(this).siblings('h2')
    if ($(this).text() === 'show') {
      $(this).text('hide');
      $.ajax({
        type: 'GET',
        url: 'http://localhost:5001/api/v1/places/' + reviewId + '/reviews',
        success: function (reviews) {
          const reviewsNumbers = Object.keys(reviews).length;
          theH2.prepend(reviewsNumbers + ' ');
          $.each(reviews, function (index, review) {
            const date = review.created_at.split('T')[0];
            $.ajax({
              type: 'GET',
              url: 'http://localhost:5001/api/v1/users/' + review.user_id,
              success: function (user) {
                theReviewdiv.append(
                  '<ul>' +
                    '<li>' +
                    '<h3>' + 'From ' + user.first_name + ' ' + user.last_name +
                    ' ' + date + '</h3>' +
                    '<p>' + review.text + '</p>' +
                    '</li>' +
                  '</ul>'
                );
              }
            });
          });
        }
      });
    } else {
      $('.reviews h2').text('Reviews');
      $(this).text('show');
      $(this).siblings('ul').hide();
    }
  });

});