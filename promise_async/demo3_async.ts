async function wfunc() {
    setTimeout(function () {
        console.log('i will be waiting for 5 seconds')
    }, 5000);
    new Promise((resolve, reject) => {
        setTimeout(function () {
            // resolve('you got it')
            reject(new Error('error test'))
        }, 2000);
    }).then((result) => {
        console.log(result)
    }).catch((e) => {
        console.log('you got an error.')
        // throw e
    })
}

async function run() {
    console.log('Before call async function')
    wfunc()
        .then((result) => { console.log(`wfunc result:${result}`) })
        .catch((e) => { console.error(e) })
    // try {
    //     await wfunc()
    // }catch(e) {
    //     console.log('i will be output error')
    //     console.error(e)
    // }
    console.log('After call async function')
}

export { run }