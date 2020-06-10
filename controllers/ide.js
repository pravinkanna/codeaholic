const path = require("path");
const util = require("util");
const rp = require("request-promise");
const exec = util.promisify(require("child_process").exec);
const writeFile = util.promisify(require("fs").writeFile);
const mkdir = util.promisify(require("fs").mkdir);
const rmdir = util.promisify(require("fs").rmdir);

// Models
const Problem = require("../models/Problem");

exports.run = async (req, res) => {
  const stdin = req.body.input;
  const src = req.body.code;
  const langId = req.body.lang;
  //Token-ID
  var token;

  try {
    //Sending Submission to API
    const token = await creteSingleSubmission(encodeB64(stdin), encodeB64(src), langId);
    //Timeout 1 sec
    await new Promise((resolve) => setTimeout(resolve, 1000));
    //Fetching submission with Token-ID
    var result = await getSingleSubmission(token);
    //Retrying if in Processing or In Queue
    while (result["status"]["id"] <= 2) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      result = await getSingleSubmission(token);
    }
    //Decoding result
    if (result["stdout"]) result["stdout"] = decodeB64(result["stdout"]);
    if (result["stderr"]) result["stderr"] = decodeB64(result["stderr"]);
    if (result["error"]) result["error"] = decodeB64(result["error"]);
    if (result["message"]) result["message"] = decodeB64(result["message"]);
    if (result["compile_output"]) result["compile_output"] = decodeB64(result["compile_output"]);
    //Sending Response to user
    res.send(result);
  } catch (e) {
    console.log(e);
    res.send(JSON.stringify({ output: "", error: "SERVER ERROR" }));
  }
};

exports.submit = async (req, res) => {
  const src = req.body.code;
  const langId = req.body.lang;
  const urlParts = req.body.url.split("/");
  const problem_id = urlParts.pop() || urlParts.pop();
  //Submission Array
  submissions = [];
  //tokens array
  tokens = [];
  //result array
  result = [];

  try {
    //Getting Problem from DB
    const problem = await Problem.findById(problem_id);
    //Writing Testcase inputs and expected output to submission array
    for (const testcase of problem["hidden_testcases"]) {
      submissions.push({
        language_id: langId,
        source_code: encodeB64(src),
        stdin: encodeB64(testcase["input"]),
        expected_output: encodeB64(testcase["output"]),
      });
    }

    //sending submission to API
    tokens = await creteBatchSubmission(submissions);
    //Make token array into string
    var tokenStr = "";
    tokens.forEach((element) => {
      tokenStr += element["token"] + ",";
    });

    //Timeout 1 sec
    await new Promise((resolve) => setTimeout(resolve, 1000));
    //Fetching Results from API
    results = await getBatchSubmission(tokenStr);

    //Retrying if in Processing or In Queue
    for (let i = 0; i < results["submissions"].length; i++) {
      console.log(i, " result", results);
      while (results["submissions"][i]["status_id"] <= 2) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        results = await getBatchSubmission(tokenStr);
        console.log(i, "results", results);
      }
    }
    return res.send(JSON.stringify({ output: results, error: "" }));
  } catch (e) {
    console.log(e);
  }
};

//Encode BASE64
const encodeB64 = (plainStr) => {
  const encodedStr = Buffer.from(plainStr).toString("base64");
  return encodedStr;
};

//Decode BASE64
const decodeB64 = (encodedStr) => {
  const decodedStr = Buffer.from(encodedStr, "base64").toString("utf8");
  return decodedStr;
};

//Function to Create Single Submission
const creteSingleSubmission = async (stdin, src, langId) => {
  return new Promise(async (resolve, reject) => {
    try {
      //CREATING A SUBMISSION
      var options = {
        method: "POST",
        url: "https://codeaholic-api.pravinkanna.me/submissions?base64_encoded=true",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
          useQueryString: true,
        },
        body: {
          language_id: langId,
          source_code: src,
          stdin: stdin,
        },
        json: true,
      };

      await rp(options, function (error, response, body) {
        if (error) throw new Error(error);
        token = body.token;
        console.log(token);
      });

      resolve(token);
    } catch (e) {
      console.error(e);
      error = e.toString();
      reject(error);
    }
  });
};

//Function to Get Single Submission
const getSingleSubmission = async (token) => {
  return new Promise(async (resolve, reject) => {
    var result = "";
    try {
      //GETTING A SUBMISSION
      var options = {
        method: "GET",
        url: `https://codeaholic-api.pravinkanna.me/submissions/${token}?base64_encoded=true`,
        headers: {
          useQueryString: true,
        },
      };

      await rp(options, function (error, response, body) {
        if (error) throw new Error(error);
        result = JSON.parse(body);
      });

      resolve(result);
    } catch (e) {
      console.error(e);
      error = e.toString();
      reject(error);
    }
  });
};

//Function to Create Batch Submission
const creteBatchSubmission = async (submission) => {
  return new Promise(async (resolve, reject) => {
    try {
      //CREATING BATCH SUBMISSION
      var tokens;
      var options = {
        method: "POST",
        url: "https://codeaholic-api.pravinkanna.me/submissions/batch?base64_encoded=true",
        headers: {
          // 'x-rapidapi-host': 'judge0.p.rapidapi.com',
          // 'x-rapidapi-key': '63faedf1dbmsh6aeb037309bac2ep1409e6jsn2526bc9cfe0a',
          "content-type": "application/json",
          accept: "application/json",
          useQueryString: true,
        },
        body: {
          submissions: submission,
        },
        json: true,
      };

      await rp(options, function (error, response, body) {
        if (error) throw new Error(error);
        tokens = body;
      });

      resolve(tokens);
    } catch (e) {
      console.error(e);
      error = e.toString();
      reject(error);
    }
  });
};

//Function to Get Batch Submission
const getBatchSubmission = async (tokenStr) => {
  return new Promise(async (resolve, reject) => {
    var result = "";
    try {
      //GETTING A SUBMISSION
      var options = {
        method: "GET",
        url: `https://codeaholic-api.pravinkanna.me/submissions/batch?tokens=${tokenStr}&base64_encoded=true&fields=status_id`,
        headers: {
          // 'x-rapidapi-host': 'judge0.p.rapidapi.com',
          // 'x-rapidapi-key': '63faedf1dbmsh6aeb037309bac2ep1409e6jsn2526bc9cfe0a',
          useQueryString: true,
        },
      };

      await rp(options, function (error, response, body) {
        if (error) throw new Error(error);
        result = JSON.parse(body);
      });

      resolve(result);
    } catch (e) {
      console.error(e);
      error = e.toString();
      reject(error);
    }
  });
};
