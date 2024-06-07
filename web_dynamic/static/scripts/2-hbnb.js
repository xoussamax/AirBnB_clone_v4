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
});
