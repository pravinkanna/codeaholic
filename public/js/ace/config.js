//Boilerplates
let plaintextboilerplate = "Welcome to Codeaholic IDE";
let cboilerplate = '#include<stdio.h>\nint main(){\n\tprintf("Hello world");\n\treturn 0;\n}';
let cppboilerplate = '#include<iostream>\nusing namespace std;\nint main(){\n\tcout<<"Hello world"<<endl;\n\treturn 0;\n}';
let pythonboilerplate = 'print("Hello world")';
let javaboilerplate = 'class Main{\n\tpublic static void main(String args[]){\n\t\tSystem.out.println("Hello world");\n\t}\n}';
let selectedLanguage = "plain_text";

//Ace Editor Configuration
var editor = ace.edit("editor");
editor.setTheme("ace/theme/textmate");
editor.getSession().setMode("ace/mode/plain_text");
editor.setFontSize(18);
editor.setValue(plaintextboilerplate);

editor.setOptions({
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: true,
});

// Dropdowns
$(".dropdown-menu.dropdown-menu-lang a").click(function () {
  $(this).parents(".dropdown").find(".btn").html($(this).text());
  $(this).parents(".dropdown").find(".btn").val($(this).data("value"));
  selectedLanguage = $(this).data("value");

  switch (selectedLanguage) {
    case 50:
      editor.session.setMode("ace/mode/c_cpp");
      if (editor.getValue() === "" || editor.getValue() === plaintextboilerplate || editor.getValue() === cppboilerplate || editor.getValue() === pythonboilerplate || editor.getValue() === javaboilerplate) {
        editor.setValue(cboilerplate);
      }

      break;
    case 54:
      editor.session.setMode("ace/mode/c_cpp");
      if (editor.getValue() === "" || editor.getValue() === plaintextboilerplate || editor.getValue() === cboilerplate || editor.getValue() === pythonboilerplate || editor.getValue() === javaboilerplate) {
        editor.setValue(cppboilerplate);
      }
      break;
    case 71:
      editor.session.setMode("ace/mode/python");
      if (editor.getValue() === "" || editor.getValue() === plaintextboilerplate || editor.getValue() === cppboilerplate || editor.getValue() === cboilerplate || editor.getValue() === javaboilerplate) {
        editor.setValue(pythonboilerplate);
      }
      break;
    case 62:
      editor.session.setMode("ace/mode/java");
      if (editor.getValue() === "" || editor.getValue() === plaintextboilerplate || editor.getValue() === cppboilerplate || editor.getValue() === pythonboilerplate || editor.getValue() === cboilerplate) {
        editor.setValue(javaboilerplate);
      }
      break;
  }
});

$(".dropdown-menu.dropdown-menu-theme a").click(function () {
  $(this).parents(".dropdown").find(".btn").html($(this).text());
  $(this).parents(".dropdown").find(".btn").val($(this).data("value"));
  switch ($(this).data("value")) {
    case "light":
      editor.setTheme("ace/theme/textmate");
      break;
    case "dark":
      editor.setTheme("ace/theme/monokai");
  }
});
