(function() {
  /*
  Initialise datepicker library called 'flatpickr' on all datetime-local inputs.
  */
  const datetimeInputs = document.querySelectorAll('input[type="datetime-local"]');
  const dateTimePickers = flatpickr(datetimeInputs, {
      enableTime: true,
      dateFormat: 'Y-m-d H:i:S',
      altInput: true,
      altFormat: 'd F Y H:i:S',
      time_24hr: true,
      onReady: function(selectedDates, dateStr, instance){
          // Get flatpickr instance then add ID attribute.
          // ID and name are needed for jQuery validation to work.
          // $(instance['altInput']).attr('id', instance['input']['id'] + '-flatpickr');
          // $(instance['altInput']).attr('name', instance['input']['name']);
      }
  });

  /*
  Initialise wysiwyg editor called 'ckeditor' on article content text area.
  */
  let ckeditor;
  if (document.querySelector('[data-ckeditor]')) {
      ClassicEditor
      .create(document.querySelector('[data-ckeditor]'), {
          // Add insertImage button, TODO add filemanger.
          toolbar: [ 'headings', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'insertImage'],
      })
      .then( editor => {
          ckeditor = editor;
          console.log( editor );
      })
      .catch( error => {
          console.error( error );
      });
  }

  /*
  Show/hide event details fieldset
  */
  $('#article-type').on('change', function() {
      if (this.value === 'event') {
          $('#article-event-details').removeClass('invisible');
      } else {
          $('#article-event-details').addClass('invisible');
      }
  });

})();
