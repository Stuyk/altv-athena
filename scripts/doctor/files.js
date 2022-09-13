import glob from 'glob';

export async function fileChecker() {
    const fileList = await new Promise((resolve) => {
        glob('./{src,src-webviews,resources}/**/*', (err, files) => {
            if (err) {
                return resolve(files);
            }

            return resolve(files);
        });
    });

    console.log(`Verifying ${fileList.length} Files`);
    let validated = 0;
    for (let filePath of fileList) {
        let isValid = /^[a-zA-Z 0-9\-._\/\\]+$/g.test(filePath)

        if (isValid) {
            validated += 1;
        } else {
            console.warn(`Invalid File Name: ${filePath}`);
        }
    }

    console.log(`${validated}/${fileList.length} Validated`)
}