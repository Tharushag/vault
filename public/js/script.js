$(document).ready(() => {
  $('.password-btn').click(({ target }) => {
    const states = $(target).data("toggle").split(';');
    const state = $(target).html();
    const input = $(target).siblings("input").length > 0 ? $(target).siblings("input") : $(target).parent().siblings("input");

    if (state.toLowerCase() === states[0].toLowerCase()) {
      $(input).attr("type", "text");
      $(target).html(states[1]);
    } else {
      $(input).attr("type", "password");
      $(target).html(states[0]);
    }
  });

  $("#form").submit((event) => {
    const inputs = Array.from($("input"));
    const errors = Array.from($(".error"));
    const anyInputsEmpty = inputs.filter(input => $(input).val() === "");

    if (anyInputsEmpty.length) {
      anyInputsEmpty.forEach(inp => {
        $(errors[inputs.indexOf(inp)]).html("*required");
      });
      event.preventDefault();
    }
  });
});
