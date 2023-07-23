// user account verification & confirmation template
// send verification code
const passwordVerification = (sendInfo) => {
	return(
		`
        <td style="padding:0 35px;">
            <p style="color:#1e1e2d; margin:0;font-size:20px;font-family:'Rubik',sans-serif;">You have
                requested to reset your password</p>
            <span
                style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
            <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                Please enter below 6 digit verification code into the page.
            </p>
            <p style="color:#1e1e2d; margin:0;font-size:20px;font-family:'Rubik',sans-serif;"><strong>${sendInfo.code}</strong></p>
        </td>
    `
 
)}

// send register Confirmation & notice reset password 
const registerConfirmation = (sendInfo) => {
    return(
		`
        <td style="padding:0 35px;">
            <p><strong>Hi ${sendInfo.name},</strong></p>
            <p>We're happy your account is registered for Stonewell Financial. To access the website, please reset password.</p>
            <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;"> <strong><a href=${sendInfo.linkUrl}>Reset password</a></strong></p>
            <br/>
            <p>If you have any question, please contact <strong>info@stonewellfinancial.com or your administrator</strong></p>
        </td>
        `
)}

// send register Confirmation 
// const registerConfirmation = (sendInfo) => {
//     return(
// 		`
//         <td style="padding:0 35px;">
//             <p><strong>Hi ${sendInfo.name},</strong></p>
//             <p>We're happy you regi for Stonewell Financial. To start exploring the website, please confirm your email address</p>
//             <p>To start exploring the website, please confirm your email address.</p>
//             <br/>
//             <p>If you have any question, please contact <strong>info@stonewellfinancial.com or your administrator</strong></p>
//         </td>
//         `
// )}





module.exports = {
    letterMailOptions(source, data) {

    return new Promise((resolve) => {
        let sendInfo = data
        let subjectText = ''
        let body = ''
        switch (source) {
            case 'Password':
                subjectText = 'Password verification'
                body = passwordVerification(sendInfo)
                break;
            case 'Register':
                subjectText = 'Register Confirmation'
                body = registerConfirmation(sendInfo)
                break;
                default:
                break
        }

        const mailOption = {
            from: {name:'Stonewell Financial', 
                    address: process.env.MAIL_USER},
            to: sendInfo.email,
            subject: subjectText,
            html: `

            <html lang="en-US">

            <head>
                <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                <title>Reset Password Email Template</title>
                <meta name="description" content="Reset Password Email Template.">
                <style type="text/css">
                    a:hover {text-decoration: underline !important;}
                </style>
            </head>

            <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                <!--100% body table-->
                <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                    style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                    <tr>
                        <td>
                            <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                                align="center" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="height:80px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="text-align:center;">
                                        <a href="https://www.stonewellfinancial.com" title="logo" target="_blank">
                                        <img src="https://stonewell-bucket.s3.ca-central-1.amazonaws.com/Image/stonewell_logo_col.png" style="display: block; height: auto; border: 0; width: 136px; max-width: 100%;" width="136" alt="Logo" title="Logo">
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td>
                                        <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                            style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                            <tr>
                                                <td style="height:40px;">&nbsp;</td>
                                            </tr>
                                            <tr>

                                            ${body}

                                            </tr>
                                            <tr>
                                                <td style="height:40px;">&nbsp;</td>
                                            </tr>
                                        </table>
                                    </td>
                                <tr>
                                    <td style="height:20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="text-align:center;">
                                        <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.stonewellfinancial.com</strong></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:80px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <!--/100% body table-->
            </body>

            </html>
                `
            }

        resolve(mailOption)
    })

    }

}