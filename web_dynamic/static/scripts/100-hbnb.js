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

  console.log(citiesStates);
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

  console.log(citiesStates);
  $('.locations h4').text(Object.values(citiesStates).join(', '));
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

  const getPlaces = function(){
    $.ajax({
      type: 'POST',
      url: 'http://localhost:5001/api/v1/places_search/',
      contentType: 'application/json',
      data: JSON.stringify({ amenities: selectedAmenities.map(a => a.id) }),
      dataType: 'json',
      success: function (places) {
       $.each(places, function(index, place){
        console.log("the response "+place.name)
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

  }

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
            '<div class="price_by_night">' + '$' + place.price_by_night +
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
            '</article>');
        });
      }
    })
  })

});
