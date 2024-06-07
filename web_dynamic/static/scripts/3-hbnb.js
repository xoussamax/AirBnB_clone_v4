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
      return amenity.name; // Use amenity names if available
    }).join(', ');
    $('.amenities h4').text(amenityList);
  });

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
        '<div class="price_by_night">' + place.price_by_night +
        '</div>' +
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
        '<div class="description">' + place.description +
        '</div>' +
        '</article>'
      );
     })
    },
  });
});
