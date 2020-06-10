// Sidebar Toggler
$("#menu-toggle").click(function (e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
});

// Resizable Panels
$(".panel-left").resizable({
  handleSelector: ".splitter",
  resizeHeight: false,
});

$(".panel-top").resizable({
  handleSelector: ".splitter-horizontal",
  resizeWidth: false,
});

//Ace editor
var editor = ace.edit("editor");

// Using Fetch API to Run code
document.getElementById("runBtn").addEventListener("click", runCode);

function runCode(e) {
  e.preventDefault();
  //Getting current URL
  const URL = window.location.href;
  //Getting input, srcCode, language from ide
  const code = editor.getValue();
  const input = document.getElementById("inputTextbox").value;
  const lang = document.getElementById("langNavbarDropdown").value;

  //Checking SrcCode, language is not empty
  if (lang == "" || !code || code == undefined || code == "" || code.length == 0) {
    document.getElementById("outputTextbox").innerHTML = '<span style="color:red">Please Select Language and Give valid code</span>';
    return;
  }

  //Spinner in output textbox
  document.getElementById("outputSpinner").style.display = "block";
  document.getElementById("outputTextbox").style.display = "none";

  //Disabling Run and submit button while code is running
  document.getElementById("runBtn").disabled = true;
  if (document.getElementById("submitBtn") !== null) {
    document.getElementById("submitBtn").disabled = true;
  }

  fetch(URL + "/run", {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-type": "application/json",
      "user-agent": "*",
    },
    body: JSON.stringify({ lang: lang, code: code, input: input }),
  })
    .then((res) => res.json())
    .then((data) => {
      //Disabling Spinner
      document.getElementById("outputSpinner").style.display = "none";
      document.getElementById("outputTextbox").style.display = "block";
      //Printing Output in Output textbox
      if (data["status"]["id"] == 3 || data["status"]["id"] == 4) {
        //  3 ==> Accepted  4 ==> Wrong Answer
        document.getElementById("outputTextbox").innerHTML = data["stdout"] + "<br/>" + '<span style="color:green">Compiled in <b>' + data["time"] + "</b>&nbsp;ms</span>";
      } else if (data["status"]["id"] == 5) {
        //  5 ==> Time limit exceeds
        document.getElementById("outputTextbox").innerHTML = '<span style="color:#ff8000">Time Limit Exceeded</span>';
      } else if (data["status"]["id"] == 6) {
        //6 ==> Compilation Error
        document.getElementById("outputTextbox").innerHTML = '<span style="color:red">' + data["compile_output"] + "</span>";
      } else if (data["status"]["id"] >= 7 && data["status"]["id"] <= 12) {
        //7,8,9,10,11,12 ==> Runtime Error
        document.getElementById("outputTextbox").innerHTML = `<span style="color:red">Error Code<b>${data["status"]["id"]}</b><br />${data["compile_output"]}</span>`;
      } else {
        document.getElementById("outputTextbox").innerHTML = '<span style="color:red">SERVER INTERNAL ERROR</span>';
      }
      //Enabling Run and submit button while code is running
      document.getElementById("runBtn").disabled = false;
      if (document.getElementById("submitBtn") !== null) {
        document.getElementById("submitBtn").disabled = false;
      }
    })
    .catch((err) => {
      console.log(err);
      //Printing Error in Output textbox
      document.getElementById("outputSpinner").style.display = "none";
      document.getElementById("outputTextbox").style.display = "block";

      //Enabling Run and submit button while code is running
      document.getElementById("runBtn").disabled = false;
      if (document.getElementById("submitBtn") !== null) {
        document.getElementById("submitBtn").disabled = false;
      }

      document.getElementById("outputTextbox").innerHTML = "<span style=color:red>SERVER ERROR: " + err + "</span>";
    });
}

// Function to stop running code
// if (document.getElementById("stopBtn") !== null) {
//   document.getElementById("stopBtn").addEventListener("click", stopCode);
// }

// function stopCode(e) {
//   e.preventDefault();
//   //Getting current URL
//   const URL = window.location.href;

//   fetch(URL + "/stop", {
//     method: "GET",
//     headers: {
//       Accept: "application/json, text/plain, */*",
//       "Content-type": "application/json",
//       "user-agent": "*",
//     },
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       //Disabling Spinner
//       document.getElementById("outputSpinner").style.display = "none";
//       document.getElementById("outputTextbox").style.display = "block";
//       //Printing Output in Output textbox
//       document.getElementById("outputTextbox").innerHTML = data;
//       //Enabling Run and submit button while code is running
//       document.getElementById("runBtn").disabled = false;
//       if (document.getElementById("submitBtn") !== null) {
//         document.getElementById("submitBtn").disabled = false;
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//       //Printing Error in Output textbox
//       document.getElementById("outputSpinner").style.display = "none";
//       document.getElementById("outputTextbox").style.display = "block";

//       //Enabling Run and submit button while code is running
//       document.getElementById("runBtn").disabled = false;
//       if (document.getElementById("submitBtn") !== null) {
//         document.getElementById("submitBtn").disabled = false;
//       }

//       document.getElementById("outputTextbox").innerHTML = "<span style=color:red>SERVER ERROR: " + err + "</span>";
//     });
// }

// Function to submit code
if (document.getElementById("submitBtn") !== null) {
  document.getElementById("submitBtn").addEventListener("click", submitCode);
}

function submitCode(e) {
  e.preventDefault();

  //Getting language, srcCode and problem_id
  let code = editor.getValue();
  let lang = document.getElementById("langNavbarDropdown").value;

  //Checking lang and srcCode is valid
  if (lang == "" || !code || code == undefined || code == "" || code.length == 0) {
    document.getElementById("outputTextbox").innerHTML = '<span style="color:red">Please Select Language and Give valid code</span>';
    return;
  }

  //Spinner in output textbox
  document.getElementById("outputSpinner").style.display = "block";
  document.getElementById("outputTextbox").style.display = "none";

  //Disabling Run and submit button while code is running
  document.getElementById("runBtn").disabled = true;
  if (document.getElementById("submitBtn") !== null) {
    document.getElementById("submitBtn").disabled = true;
  }

  fetch(URL + "/submit", {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-type": "application/json",
      "user-agent": "*",
    },
    body: JSON.stringify({ lang: lang, code: code, url: window.location.href }),
  })
    .then((res) => res.json())
    .then((data) => {
      //Disabling Spinner
      document.getElementById("outputSpinner").style.display = "none";
      document.getElementById("outputTextbox").style.display = "block";
      //Clearing Output textbox
      document.getElementById("outputTextbox").innerHTML = "";
      //Printing Output in Output textbox
      let i = 0;
      data["output"].forEach((element) => {
        if (element === true) {
          document.getElementById("outputTextbox").innerHTML += "Test case " + i + ' <span style="color:green; font-size:25px"> &#10004; </span><br>';
        } else {
          document.getElementById("outputTextbox").innerHTML += "Test case " + i + ' <span style="color:red; font-size:25px""> &#10008; </span><br>';
        }

        i++;
      });
      //Enabling Run and submit button while code is running
      document.getElementById("runBtn").disabled = false;
      document.getElementById("submitBtn").disabled = false;
    })
    .catch((err) => {
      console.log(err);
      //Printing Error in Output textbox
      document.getElementById("outputSpinner").style.display = "none";
      document.getElementById("outputTextbox").style.display = "block";

      //Enabling Run and submit button while code is running
      document.getElementById("runBtn").disabled = false;
      document.getElementById("submitBtn").disabled = false;
      document.getElementById("outputTextbox").innerHTML = "<span style=color:red>SERVER ERROR: " + err + "</span>";
    });
}
