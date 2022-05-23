const uuidv1 = require('uuid/v1');
const rp = require('request-promise');

var myjar = rp.jar();

function loginOptions(username, password) {
    return {
        method: 'POST',
        gzip: true,
        uri: 'https://login.xfinity.com/login',
        jar: myjar,
        resolveWithFullResponse: false,
        followAllRedirects: true,
        headers: {
            'Upgrade-Insecure-Request': 1,
            'content-type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.9'
        },
        form: {
            'user': username,
            'passwd': password,
            'r': 'comcast.net',
            's': 'oauth',
            'deviceAuthn': false,
            'continue': 'https://oauth.xfinity.com/oauth/authorize?response_type=code&redirect_uri=https%3A%2F%2Fauth.xfinity.com%2Foauth%2Fcallback&client_id=my-xfinity&state=https%3A%2F%2Fcustomer.xfinity.com%2F%23%2F%3FCMP%3DILC_signin_myxfinity_re&response=1',
            'ipAddrAuthn': false,
            'forceAuthn': 0,
            'lang': 'en',
            'passive': false,
            'client_id': 'my-xfinity',
            'reqId': uuidv1()
        },
    };
}

function oAuthOptions() {
    return {
        method: 'GET',
        uri: 'https://customer.xfinity.com/oauth/passive_connect/?continue=https%3A%2F%2Fcustomer.xfinity.com%2Fassets%2Fimages%2Fpng%2FSearchIcon.e7b5bc42.png',
        jar: myjar,
        resolveWithFullResponse: false,
        followAllRedirects: true,
        gzip: true,
        headers: {
            'authority': 'customer.xfinity.com',
            'Upgrade-Insecure-Request': 1,
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
            'referrer': 'https://customer.xfinity.com',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9'
        }
    };
}

function usageOptions() {
    return {
        method: 'GET',
        gzip: true,
        uri: 'https://customer.xfinity.com/apis/services/internet/usage',
        jar: myjar,
        json: true,
        resolveWithFullResponse: false,
        followAllRedirects: true,
        headers: {
            'accept-encoding': 'gzip, deflate, br'
        }
    };
}

function retrieveDataFromXfinity() {
    var username = process.env.XFIN_USERNAME;
    var password = process.env.XFIN_PASSWORD;
    
    return rp(loginOptions(username, password))
    .then(function (response) {
        return rp(oAuthOptions(myjar));
    })
    .then(function (response) {
        return rp(usageOptions(myjar));
    })
    .then(function (response) {

        return response;
    })
    .catch(function (err) {
        console.log('error occurred');
        console.log(err);
    });
}

exports.retrieveDataFromXfinity = retrieveDataFromXfinity;