const AWS = require('aws-sdk');

AWS.config.update({region: 'eu-west-1'})
const ssm = new AWS.SSM();

const getSecret = async (key) => {
    console.log(`Getting secret for ${key}`);
    const params = {
        Name: key,
        WithDecryption: true
    };
    try {
        const result = await ssm.getParameter(params).promise();
        return result.Parameter.Value

    } catch (e) {
        console.log("Oops with retrieving secret " + key, e)
        throw e
    }
};

module.exports = {getSecret};
