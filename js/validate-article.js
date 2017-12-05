(function() {
    // Before using it we must add the parse and format functions
    // Here is a sample implementation using moment.js
    validate.extend(validate.validators.datetime, {
        // The value is guaranteed not to be null or undefined but otherwise it
        // could be anything.
        parse: function(value, options) {
            return +moment.utc(value);
        },
        // Input is a unix timestamp
        format: function(value, options) {
            var format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";
            return moment.utc(value).format(format);
        }
    });

    // These are the constraints used to validate the form
    var constraints = {
        title: {
            presence: true,
            length: {
                minimum: 3,
                maximum: 150
            }
        },
        summary: {
            presence: true,
            length: {
                minimum: 20,
                maximum: 500
            }
        },
        publish_timestamp: {
            presence: true,
            datetime: true
        },
        expiry_timestamp: {
            presence: true,
            datetime: {
                earliest: moment.utc(document.getElementById('article-publish').value).format('YYYY-MM-DD hh:mm:ss')
            }
        },
        priority: {
            presence: true
        },
        type: {
            presence: true
        }
    };

    var validateEventsRules = {
      location: {
          presence: true
      },
      event_start: {
        presence: true,
        datetime: {
            earliest: moment.utc(document.getElementById('article-publish').value).format('YYYY-MM-DD hh:mm:ss')
        }
      },
      event_end: {
        presence: true,
        datetime: {
            earliest: moment.utc(document.getElementById('article-expiry').value).format('YYYY-MM-DD hh:mm:ss')
        }
      }
    }

    function updateConstraints() {
      constraints.expiry_timestamp.datetime.earliest = moment.utc(document.getElementById('article-publish').value).format('YYYY-MM-DD hh:mm:ss');
    }

    // Hook up the form so we can prevent it from being posted
    var form = document.querySelector(".js-article-validate");

    form.addEventListener("submit", function(ev) {
          ev.preventDefault();
          handleFormSubmit(form);
    });

    // Hook up the inputs to validate on the fly
    var inputs = document.querySelectorAll("input, textarea, select")

    for (var i = 0; i < inputs.length; ++i) {
        inputs.item(i).addEventListener("change", function(ev) {
        console.log(inputs.item(i));
        if(inputs.item(i).value === 'event') {
            constraints = {...constraints, ...validateEventsRules};
        }
        var errors = validate(form, constraints) || {};
        showErrorsForInput(this, errors[this.name])
        });
    }


    function handleFormSubmit(form, input) {
        // validate the form aainst the constraints
        var errors = validate(form, constraints);
        // then we update the form to reflect the results
        showErrors(form, errors || {});
        if (!errors) {
          showSuccess();
        }
    }

    // Updates the inputs with the validation errors
    function showErrors(form, errors) {
        var toValidateElems = form.querySelectorAll('input[name], textarea, select');
        console.log(toValidateElems);
        for (var i = 0, len = toValidateElems.length; i < len; i++) {
          var input = toValidateElems[i];
          showErrorsForInput(input, errors && errors[input.name]);
        }
    }

    // Shows the errors for a specific input
    function showErrorsForInput(input, errors) {
        console.log(input);
        // This is the root of the input
        var formGroup = closestParent(input.parentNode, "form-group")
        // Find where the error messages will be insert into
        var messages = formGroup.querySelector(".messages");

        if (messages === null) {
            return;
        }
        // First we remove any old messages and resets the classes
        resetFormGroup(formGroup);
        // If we have errors
        if (errors) {
          // we first mark the group has having errors
          formGroup.classList.add("has-error");
          // then we append all the errors

          for (var i = 0, len = errors.length; i < len; i++) {
              var error = errors[i];
              addError(messages, error);
          }
          // _.each(errors, function(error) {
          //     addError(messages, error);
          // });
        } else {
        // otherwise we simply mark it as success
        formGroup.classList.add("has-success");
        }
    }

    // Recusively finds the closest parent that has the specified class
    function closestParent(child, className) {
        if (!child || child == document) {
          return;
        }
        if (child.classList.contains(className)) {
          return child;
        } else {
          return closestParent(child.parentNode, className);
        }
    }

    function resetFormGroup(formGroup) {
        // Remove the success and error classes
        formGroup.classList.remove("has-error");
        formGroup.classList.remove("has-success");

        var errorElems = formGroup.querySelectorAll(".help-block.error")
        // and remove any old messages
        for (var i = 0, len = errorElems.length; i < len; i++) {
            var el = errorElems[i];
            el.parentNode.removeChild(el);
        }
        // _.each(formGroup.querySelectorAll(".help-block.error"), function(el) {
        //   el.parentNode.removeChild(el);
        // });
    }

    // Adds the specified error with the following markup
    // <p class="help-block error">[message]</p>
    function addError(messages, error) {
        var block = document.createElement("p");
        block.classList.add("help-block");
        block.classList.add("error");
        block.innerText = error;
        messages.appendChild(block);
    }

    function showSuccess() {
        // We made it \:D/
        alert("Success!");
    }
})();
