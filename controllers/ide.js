const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const readFile = util.promisify(require('fs').readFile)
const writeFile = util.promisify(require('fs').writeFile)
const unlink = util.promisify(require('fs').unlink);

// Models
const Problem = require('../models/Problem');

//Path to user directory
const pathToUserDir = path.join(__dirname, `../userCode/`);



exports.run = async (req, res) => {
    const input = req.body.input;
    const srcCode = req.body.code;
    const lang = req.body.lang;

    //session id
    const sess_id = req.session.id;

    try {
        //Writing input file
        await writeFile(`${pathToUserDir}${sess_id}_input.txt`, input, 'utf8');
        //Writing Src file
        await writeFile(`${pathToUserDir}${sess_id}_${lang}.${lang}`, srcCode, 'utf8');
        //Running Code
        const output = await run(sess_id, lang);
        res.send(JSON.stringify({ "output": output[0], "error": output[1] }))
        // //Deleting created files
        // await unlink(`${pathToUserDir}${sess_id}_input.txt`)
        // await unlink(`${pathToUserDir}${sess_id}_${lang}.${lang}`)
    } catch (e) {
        console.error(e)
    }
}

exports.submit = async (req, res) => {
    const srcCode = req.body.code;
    const lang = req.body.lang;
    const reg_no = req.user.reg_no;
    const urlParts = (req.body.url).split('/');
    const problem_id = urlParts.pop() || urlParts.pop();

    //session id
    const sess_id = req.session.id;
    //Result array
    result = []

    try {
        //Writing Src file
        await writeFile(`${pathToUserDir}${sess_id}_${lang}.${lang}`, srcCode, 'utf8');
        //Getting Problem from DB
        const problem = await Problem.findById(problem_id);
        //Writing Hidden inputs to files & outputs to array
        for (const testcase of problem['hidden_testcases']) {
            //Writing input file
            await writeFile(`${pathToUserDir}${sess_id}_input.txt`, testcase['input'], 'utf8');
            const output = await run(sess_id, lang);
            console.log('user: ', output[0], 'original: ', testcase['output']);
            result.push(testcase['output'] == output[0].trimEnd())
        }
        console.log(result);
    } catch (e) {
        console.log(e);
    }

    return res.send(JSON.stringify({ output: result, error: "" }))
}


//Function to run code
const run = (reg_no, lang) => {
    return new Promise(async (resolve, reject) => {

        let output = '';
        let error = '';

        try {
            if (lang === 'c') {
                await exec(`gcc ${reg_no}_c.c -o ${reg_no}_c`, { cwd: pathToUserDir })
                const { stdout, stderr } = await exec(`./${reg_no}_c < ${reg_no}_input.txt`, { cwd: pathToUserDir })
                output = stdout;
                error = stderr;
            } else if (lang === 'cpp') {
                await exec(`g++ ${reg_no}_cpp.cpp -o ${reg_no}_cpp`, { cwd: pathToUserDir })
                const { stdout, stderr } = await exec(`./${reg_no}_cpp < ${reg_no}_input.txt`, { cwd: pathToUserDir })
                output = stdout;
                error = stderr;
            } else if (lang === 'py') {
                const { stdout, stderr } = await exec(`python3 ${reg_no}_py.py < ${reg_no}_input.txt`, { cwd: pathToUserDir });
                output = stdout;
                error = stderr;
            } else if (lang === 'java') {
                await exec(`javac ${reg_no}_java.java`, { cwd: pathToUserDir });
                const { stdout, stderr } = await exec(`java Main`, { cwd: pathToUserDir });
                output = stdout;
                error = stderr;
            } else {
                console.error("No Language Selected");
                error = "No Language Selected";
            }
            resolve([output, error])
        } catch (e) {
            console.error(`exec error: ${e}`);
            error = e.stderr.toString();
            resolve([output, error])
        }


    });

}