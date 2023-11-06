const dataListItem = `<div class="data-list__item">
<span class="checkbox checkbox__main checkbox--off" onclick="checkboxToggle(this)">
  <i class="fa-solid fa-check checkbox__icon"></i>
</span>
<input type="text" name="website">
<div class="rel">
  <input type="password" name="password" class="password">
  <button type="button" class="password-btn" data-toggle="Show;Hide" onclick="passwordVisibilityToggle(this)">Show</button>
</div>
<i class="fa-regular fa-copy data-list__icon copy" onclick="copy(this)"></i>
</div>`;

function checkboxToggle(target) {
  if ($(target).attr("class").includes("on")) {
    $(target).addClass("checkbox--off");
    $(target).removeClass("checkbox--on");
  } else {
    $(target).addClass("checkbox--on");
    $(target).removeClass("checkbox--off");
  }
}

function copy(target) {
  const text = $(target).siblings(".rel").find("input").val();
  if (text) {
    navigator.clipboard.writeText(text);
  }
}

function passwordVisibilityToggle(target) {
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
}

function getSelectedItems() {
  const checkboxes = Array.from($(".checkbox:not(.checkbox__all)")).filter(chkbx => $(chkbx).attr("class").includes("on"));
  return checkboxes.map(chkbx => $(chkbx).parent());
}

function generatePassword(len=12) {
  const letters = "abcdefghijklmnopqrstuvwxyz".split('');
  const num = Array.from(Array(10).keys());
  const punc = "~`@#$%^&*()_-+={[}]|\:;\"'<,>.?/".split('');
  const char = [...Array(5).fill(letters), num, punc];

  let password = "";

  for (let i=0; i<len; i++) {
    let j = Math.floor(Math.random() * char.length);
    password += char[j][Math.floor(Math.random() * char[j].length)];
  }

  return password;
}

$(document).ready(() => {
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

  $(".checkbox__all").click(({ target }) => {
    const checkboxes = Array.from($(".checkbox:not(.checkbox__all)"));
    const state = { add: String, rm: String };

    if ($(target).attr("class").includes("on")) {
      state.add = "checkbox--off";
      state.rm = "checkbox--on";
    } else {
      state.add = "checkbox--on";
      state.rm = "checkbox--off";
    }

    $(target).addClass(state.add);
    $(target).removeClass(state.rm);
    checkboxes.forEach(chkbx => {
      $(chkbx).addClass(state.add);
      $(chkbx).removeClass(state.rm);
    });
  });

  $("#add-item").click(() => {
    $(".data-list").append(dataListItem);
  });

  $("#delete-item").click(() => {
    const items = getSelectedItems();
    items.forEach(item => $(item).remove());
    $(".checkbox__all").addClass("checkbox--off");
    $(".checkbox__all").removeClass("checkbox--on");
  });

  $("#gen-pass").click(() => {
    const items = getSelectedItems();
    const inputs = items.map(item => item.find(".password"));

    inputs.forEach(input => {
      $(input).val(generatePassword());
    })
  });

  $("#save-as").click(() => {
    const websites = Array.from($("input[name='website']")).map(input => $(input).val());
    if (new Set(websites).size !== websites.length) {
      console.log("Remove duplicate values!");
    } else {
      $("form").submit();
    }
  });
});
