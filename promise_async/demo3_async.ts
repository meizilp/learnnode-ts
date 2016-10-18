
async function asyncFunc() {
    let p = new Promise((s, j) => {
        setTimeout(function () {
            s(Promise.resolve())
        }, 3000);
    })
    console.log('before await')
    let a = await p
    console.log(`after await: ${a}`)
}


function run() {
    console.log('Before call async function')
    asyncFunc()
        .then((result) => {
            console.log(`async result:${result}`)
        })
    console.log('After call async function')
}

export { run }