const dataListItem = `<div class="data-list__item">
<span class="checkbox checkbox__main checkbox--off">
  <i class="fa-solid fa-check checkbox__icon"></i>
</span>
<input type="text">
<div class="rel">
  <input type="password">
  <button type="button" class="password-btn" data-toggle="Show;Hide">Show</button>
</div>
<i class="fa-regular fa-copy data-list__icon"></i>
</div>`;

function toggleCheckBox(chkbx) {
  if ($(chkbx).attr("class").includes("off")) {
    $(chkbx).addClass("checkbox--on");
    $(chkbx).removeClass("checkbox--off");
  } else {
    $(chkbx).addClass("checkbox--off");
    $(chkbx).removeClass("checkbox--on");
  }
}

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

  $(".checkbox__all").click(() => {
    const checkboxes = Array.from($(".checkbox"));
    checkboxes.forEach(chkbx => {
      toggleCheckBox(chkbx);
    });
  });

  $(".checkbox:not(.checkbox__all)").click(({ target }) => {
    toggleCheckBox(target);
  });

  $("#add-item").click(() => {
    $(".data-list").append(dataListItem);
  });
});
