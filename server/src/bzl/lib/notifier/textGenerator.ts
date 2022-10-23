// tslint:disable: quotemark
export const emailConfirmationText = (name: string, link: string): string => {
    const html = "<html><head><style>body {background-color: #b0e0e6;} .b:link, .b:visited {background-color: #f44336;color: white;padding: 14px 25px;text-align: center;border-radius: 15px 50px 30px;text-decoration: none;display: inline-block;}.b:hover, .b:active {background-color: red;}</style></head><body>";
    const text = "Hello " + name + ",<br>&ensp;Welcome to our community! In order to complete your the sign-up process and make use of your account, please click on the button below.<br><br>";
    const button = "<a class=\"b\" href=\"" + link + "\"target=\"_blank\">Sign-up here</a>"
    const text2 = "<br><br>If the button doesn’t work, you can also click on the link below.<br><br>";
    const confLink = "<a href=\"" + link + "\">" + link + "</a> </body></html>";

    return html + text + button + text2 + confLink;
}

export const emailChangePasswordText = (name: string, code: string): string => {
    return `Hello ${name},<br>&ensp;<br><br> The code for changing your password is: <b> ${code} </b>
    <br><br>If you did not ask for password change please ignore this email!`;
}