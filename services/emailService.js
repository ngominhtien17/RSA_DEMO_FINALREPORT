import { createEmailTransporter } from '../config/emailConfig.js';

export const sendEmailWithLink = async (email, token, userName) => {
    const transporter = createEmailTransporter();

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Tải khóa riêng tư của bạn',
        // html: `
        //     <p>Nhấp vào liên kết sau để tải khóa riêng tư của bạn:</p>
        //     <a href="http://localhost:3000/users/download-key?token=${token}">Tải khóa riêng tư</a>
        // `
        html: `<!DOCTYPE html>
            <html lang=\"en\">
            <head>
                <meta charset=\"UTF-8\">
                <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
                <title>Document</title>
                <style>
                @import url(\"https://fonts.googleapis.com/css2?family=Staatliches&display=swap\");
                @import url(\"https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap\");
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body,
                html {
                    display: grid;
                    background: black;
                    color: black;
                    font-size: 10px;
                    letter-spacing: 0.1em;
                }
                
                .ticket {
                    margin: auto;
                    display: flex;
                    background: white;
                    box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
                }
                
                .left {
                    display: flex;
                }
                
                .image {
                    height: 200px;
                    width: 200px;
                    background-size: contain;
                    opacity: 0.9;
                }
                
                .admit-one {
                    position: absolute;
                    color: darkgray;
                    height: 200px;
                    padding: 0 5px;
                    letter-spacing: 0.15em;
                    display: flex;
                    text-align: center;
                    justify-content: space-around;
                    writing-mode: vertical-rl;
                    transform: rotate(-180deg);
                }
                
                .admit-one span:nth-child(2) {
                    color: white;
                    font-weight: 800;
                }
                
                .left .ticket-number {
                    height: 200px;
                    width: 200px;
                    display: flex;
                    justify-content: flex-end;
                    align-items: flex-end;
                    padding: 10px;
                }
                
                .ticket-info {
                    padding: 5px 10px;
                    display: flex;
                    flex-direction: column;
                    text-align: center;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .date {
                    border-top: 1px solid gray;
                    border-bottom: 1px solid gray;
                    padding: 5px 0;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                }
                
                .date span {
                    width: 90px;
                }
                
                .date span:first-child {
                    text-align: left;
                }
                
                .date span:last-child {
                    text-align: right;
                }
                
                .date .june-29 {
                    color: #d83565;
                    font-size: 10px;
                }
                
                .show-name {
                    font-size: 20px;
                    font-family: \"Nanum Pen Script\", cursive;
                    color: #d83565;
                }
                
                .show-name h1 {
                    font-size: 30px;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    color: #4a437e;
                }
                
                .time {
                    padding: 10px 0;
                    color: #4a437e;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    font-weight: 500;
                }
                
                .time span {
                    font-weight: 500;
                    color: gray;
                }
                
                .left .time {
                    font-size: 14px;
                }
                
                
                
                
                .right {
                    width: 180px;
                    border-left: 1px dashed #404040;
                }
                
                .right .admit-one {
                    color: darkgray;
                }
                
                .right .admit-one span:nth-child(2) {
                    color: gray;
                }
                
                .right .right-info-container {
                    height: 200px;
                    padding: 10px 10px 10px 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    align-items: center;
                }
                
                .right .show-name h1 {
                    font-size: 18px;
                }
                
                .barcode {
                    height: 200px;
                }
                
                .barcode img {
                    height: 100%;
                }
                
                .right .ticket-number {
                    color: gray;
                }
                
                  </style>
            </head>
            <body>
            <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">
            <tbody>
            <tr><td align=\"center\" style=\"min-width:512px;background-color:#f3f3f3\">
                <table width=\"100%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">
                    <tbody>
                    <tr>
                        <td align=\"center\" style=\"padding-bottom:0px\">
                            <table align=\"center\" width=\"512\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">
                                <tbody>    
                                    <tr>
                                        <td align=\"center\" style=\"padding-top:10px;padding-bottom:15px\">
                                            <table width=\"95%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">
                                                <tbody>
                                                <tr>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align=\"center\" style=\"background-color:white\">
                                            <table width=\"100%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">
                                                <tbody>
                                                <tr>
                                                    <td style=\"border-top:3px solid #ae2070;border-radius:4px 4px 0 0\">
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>                     
                                <tr>
                                    <td align=\"center\" style=\"padding-top:25px;padding-bottom:25px;background-color:white\">
                                    <div class=\"logo\">
                                    <div class=\"text header-text\">
                                        <span style=\"font-weight:bold\" class=\"name\">RSADEMO</span>
                                    </div>
                                </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td align=\"center\" style=\"background-color:white\">
                                        <table width=\"90%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">
                                            <tbody>
                                            <tr><td>
                                                <img src=\"https://ci3.googleusercontent.com/meips/ADKq_Nb4_CdH6ivMV5KKC_7dZJeRIFgPMT36aYr6lv1KtFbbaYbkwwboMuqe4EtJr0sKtSO5FxCjpxamr-DPYaXx2jcj5jqq_Ao5gPpCNz1ur7UInVOcaKE=s0-d-e1-ft#https://cdn.mservice.com.vn/app/img/ota/email/banner_cinema.png\" width=\"100%\" alt=\"Ví điện tử MoMo\" style=\"object-fit:contain;display:block;border:0\" class=\"CToWUd a6T\" data-bit=\"iit\" tabindex=\"0\">
                                            </td>
                                            </tr></tbody>
                                        </table>
        
                                    </td>
                                </tr>
                                <tr>
                                    <td align=\"center\" style=\"background-color:white\">
                                        <table width=\"90%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin-bottom:12px\">
                                            <tbody>
                                                <tr>
                                                    <td align=\"left\" style=\"padding-top:25px;padding-bottom:0px;background-color:white;border:1px solid #e8e8e8;border-radius:12px\">
                                                        <table width=\"100%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">
                                                            <tbody>
                                                                <tr align=\"center\">
                                                                    <td style=\"color:#303233;font-size:16px;padding-bottom:5px\">
                                                                        <strong>Tải khóa riêng tư</strong></td>
                                                                </tr>
                                                                <tr>
                                                                    <td align=\"center\" style=\"background-color:white\">
                                                                        <table width=\"90%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">
                                                                            <tbody>
                                                                            <tr><td align=\"left\" style=\"padding-top:25px;padding-bottom:25px;background-color:white\">
                                                                                <p style=\"margin:0 0 0 0;color:#303233;font-size:12px;margin:0;padding-bottom:10px\">
                                                                                    Xin chào <span style=\"color:#303233;font-size:12px;font-weight:bold\">${userName},</span>
                                                                                </p>
                                                                                <p style=\"margin:0 0 0 0;color:#303233;font-size:12px\">
                                                                                    <br> Cảm ơn bạn đã sử dụng dịch vụ Khóa điện tử của RSADEMO!<br>
                                                                                    RSADEMO xác nhận bạn đã đăng ký tài khoản thành công.</span> <br> Hãy tải khóa riêng tư của bạn tại đây:
                                                                                    <a href="http://localhost:3000/users/download-key?token=${token}">Tải khóa riêng tư</a>
                                                                                </p>
                                                                            </td>
                                                                            </tr></tbody>
                                                                        </table>
                                                                    </td>                                   
                                                                </tr>
                                                            </tbody>    
                                                        </table>
                                                    </td>   
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                </body> 
            </html>
    `,
    };
    await transporter.sendMail(mailOptions);
};


// Gửi email khi yêu cầu ký lại
export const sendEmailRequestResign = async (email, userName) => {
    const transporter = createEmailTransporter();

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Yêu cầu ký lại hợp đồng',
        html: `<!DOCTYPE html>
            <html lang=\"en\">
            <head>
                <meta charset=\"UTF-8\">
                <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
                <title>Document</title>
                <style>
                @import url(\"https://fonts.googleapis.com/css2?family=Staatliches&display=swap\");
                @import url(\"https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap\");
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body,
                html {
                    display: grid;
                    background: black;
                    color: black;
                    font-size: 10px;
                    letter-spacing: 0.1em;
                }
                
                .ticket {
                    margin: auto;
                    display: flex;
                    background: white;
                    box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
                }
                
                .left {
                    display: flex;
                }
                
                .image {
                    height: 200px;
                    width: 200px;
                    background-size: contain;
                    opacity: 0.9;
                }
                
                .admit-one {
                    position: absolute;
                    color: darkgray;
                    height: 200px;
                    padding: 0 5px;
                    letter-spacing: 0.15em;
                    display: flex;
                    text-align: center;
                    justify-content: space-around;
                    writing-mode: vertical-rl;
                    transform: rotate(-180deg);
                }
                
                .admit-one span:nth-child(2) {
                    color: white;
                    font-weight: 800;
                }
                
                .left .ticket-number {
                    height: 200px;
                    width: 200px;
                    display: flex;
                    justify-content: flex-end;
                    align-items: flex-end;
                    padding: 10px;
                }
                
                .ticket-info {
                    padding: 5px 10px;
                    display: flex;
                    flex-direction: column;
                    text-align: center;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .date {
                    border-top: 1px solid gray;
                    border-bottom: 1px solid gray;
                    padding: 5px 0;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                }
                
                .date span {
                    width: 90px;
                }
                
                .date span:first-child {
                    text-align: left;
                }
                
                .date span:last-child {
                    text-align: right;
                }
                
                .date .june-29 {
                    color: #d83565;
                    font-size: 10px;
                }
                
                .show-name {
                    font-size: 20px;
                    font-family: \"Nanum Pen Script\", cursive;
                    color: #d83565;
                }
                
                .show-name h1 {
                    font-size: 30px;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    color: #4a437e;
                }
                
                .time {
                    padding: 10px 0;
                    color: #4a437e;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    font-weight: 500;
                }
                
                .time span {
                    font-weight: 500;
                    color: gray;
                }
                
                .left .time {
                    font-size: 14px;
                }
                
                
                
                
                .right {
                    width: 180px;
                    border-left: 1px dashed #404040;
                }
                
                .right .admit-one {
                    color: darkgray;
                }
                
                .right .admit-one span:nth-child(2) {
                    color: gray;
                }
                
                .right .right-info-container {
                    height: 200px;
                    padding: 10px 10px 10px 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    align-items: center;
                }
                
                .right .show-name h1 {
                    font-size: 18px;
                }
                
                .barcode {
                    height: 200px;
                }
                
                .barcode img {
                    height: 100%;
                }
                
                .right .ticket-number {
                    color: gray;
                }
                
                  </style>
            </head>
            <body>
            <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">
            <tbody>
            <tr><td align=\"center\" style=\"min-width:512px;background-color:#f3f3f3\">
                <table width=\"100%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">
                    <tbody>
                    <tr>
                        <td align=\"center\" style=\"padding-bottom:0px\">
                            <table align=\"center\" width=\"512\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">
                                <tbody>    
                                    <tr>
                                        <td align=\"center\" style=\"padding-top:10px;padding-bottom:15px\">
                                            <table width=\"95%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">
                                                <tbody>
                                                <tr>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align=\"center\" style=\"background-color:white\">
                                            <table width=\"100%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">
                                                <tbody>
                                                <tr>
                                                    <td style=\"border-top:3px solid #ae2070;border-radius:4px 4px 0 0\">
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>                     
                                <tr>
                                    <td align=\"center\" style=\"padding-top:25px;padding-bottom:25px;background-color:white\">
                                    <div class=\"logo\">
                                    <div class=\"text header-text\">
                                        <span style=\"font-weight:bold\" class=\"name\">RSADEMO</span>
                                    </div>
                                </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td align=\"center\" style=\"background-color:white\">
                                        <table width=\"90%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">
                                            <tbody>
                                            <tr><td>
                                                <img src=\"https://ci3.googleusercontent.com/meips/ADKq_Nb4_CdH6ivMV5KKC_7dZJeRIFgPMT36aYr6lv1KtFbbaYbkwwboMuqe4EtJr0sKtSO5FxCjpxamr-DPYaXx2jcj5jqq_Ao5gPpCNz1ur7UInVOcaKE=s0-d-e1-ft#https://cdn.mservice.com.vn/app/img/ota/email/banner_cinema.png\" width=\"100%\" alt=\"Ví điện tử MoMo\" style=\"object-fit:contain;display:block;border:0\" class=\"CToWUd a6T\" data-bit=\"iit\" tabindex=\"0\">
                                            </td>
                                            </tr></tbody>
                                        </table>
        
                                    </td>
                                </tr>
                                <tr>
                                    <td align=\"center\" style=\"background-color:white\">
                                        <table width=\"90%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin-bottom:12px\">
                                            <tbody>
                                                <tr>
                                                    <td align=\"left\" style=\"padding-top:25px;padding-bottom:0px;background-color:white;border:1px solid #e8e8e8;border-radius:12px\">
                                                        <table width=\"100%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">
                                                            <tbody>
                                                                <tr align=\"center\">
                                                                    <td style=\"color:#303233;font-size:16px;padding-bottom:5px\">
                                                                        <strong>Chữ ký không hợp lệ</strong></td>
                                                                </tr>
                                                                <tr>
                                                                    <td align=\"center\" style=\"background-color:white\">
                                                                        <table width=\"90%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">
                                                                            <tbody>
                                                                            <tr><td align=\"left\" style=\"padding-top:25px;padding-bottom:25px;background-color:white\">
                                                                                <p style=\"margin:0 0 0 0;color:#303233;font-size:12px;margin:0;padding-bottom:10px\">
                                                                                    Xin chào <span style=\"color:#303233;font-size:12px;font-weight:bold\">${userName},</span>
                                                                                </p>
                                                                                <p style=\"margin:0 0 0 0;color:#303233;font-size:12px\">
                                                                                    <br> Chữ ký của bạn không hợp lệ. Vui lòng thực hiện ký lại hợp đồng:<br>
                                                                                    <a href="http://localhost:3000/users/login">Ký lại hợp đồng</a>
                                                                                </p>
                                                                            </td>
                                                                            </tr></tbody>
                                                                        </table>
                                                                    </td>                                   
                                                                </tr>
                                                            </tbody>    
                                                        </table>
                                                    </td>   
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                </body> 
            </html>
    `,
    };
    await transporter.sendMail(mailOptions);
}

//Khóa riêng tư đã được cấp lại
export const sendEmailKeyReset = async (email, userName, token) => {
    const transporter = createEmailTransporter();

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Khóa riêng tư đã được cấp lại',
        html: `<!DOCTYPE html>
            <html lang=\"en\">
            <head>
                <meta charset=\"UTF-8\">
                <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
                <title>Document</title>
                <style>
                @import url(\"https://fonts.googleapis.com/css2?family=Staatliches&display=swap\");
                @import url(\"https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap\");
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body,
                html {
                    display: grid;
                    background: black;
                    color: black;
                    font-size: 10px;
                    letter-spacing: 0.1em;
                }
                
                .ticket {
                    margin: auto;
                    display: flex;
                    background: white;
                    box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
                }
                
                .left {
                    display: flex;
                }
                
                .image {
                    height: 200px;
                    width: 200px;
                    background-size: contain;
                    opacity: 0.9;
                }
                
                .admit-one {
                    position: absolute;
                    color: darkgray;
                    height: 200px;
                    padding: 0 5px;
                    letter-spacing: 0.15em;
                    display: flex;
                    text-align: center;
                    justify-content: space-around;
                    writing-mode: vertical-rl;
                    transform: rotate(-180deg);
                }
                
                .admit-one span:nth-child(2) {
                    color: white;
                    font-weight: 800;
                }
                
                .left .ticket-number {
                    height: 200px;
                    width: 200px;
                    display: flex;
                    justify-content: flex-end;
                    align-items: flex-end;
                    padding: 10px;
                }
                
                .ticket-info {
                    padding: 5px 10px;
                    display: flex;
                    flex-direction: column;
                    text-align: center;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .date {
                    border-top: 1px solid gray;
                    border-bottom: 1px solid gray;
                    padding: 5px 0;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                }
                
                .date span {
                    width: 90px;
                }
                
                .date span:first-child {
                    text-align: left;
                }
                
                .date span:last-child {
                    text-align: right;
                }
                
                .date .june-29 {
                    color: #d83565;
                    font-size: 10px;
                }
                
                .show-name {
                    font-size: 20px;
                    font-family: \"Nanum Pen Script\", cursive;
                    color: #d83565;
                }
                
                .show-name h1 {
                    font-size: 30px;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    color: #4a437e;
                }
                
                .time {
                    padding: 10px 0;
                    color: #4a437e;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    font-weight: 500;
                }
                
                .time span {
                    font-weight: 500;
                    color: gray;
                }
                
                .left .time {
                    font-size: 14px;
                }
                
                
                
                
                .right {
                    width: 180px;
                    border-left: 1px dashed #404040;
                }
                
                .right .admit-one {
                    color: darkgray;
                }
                
                .right .admit-one span:nth-child(2) {
                    color: gray;
                }
                
                .right .right-info-container {
                    height: 200px;
                    padding: 10px 10px 10px 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    align-items: center;
                }
                
                .right .show-name h1 {
                    font-size: 18px;
                }
                
                .barcode {
                    height: 200px;
                }
                
                .barcode img {
                    height: 100%;
                }
                
                .right .ticket-number {
                    color: gray;
                }
                
                  </style>
            </head>
            <body>
            <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">
            <tbody>
            <tr><td align=\"center\" style=\"min-width:512px;background-color:#f3f3f3\">
                <table width=\"100%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">
                    <tbody>
                    <tr>
                        <td align=\"center\" style=\"padding-bottom:0px\">
                            <table align=\"center\" width=\"512\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">
                                <tbody>    
                                    <tr>
                                        <td align=\"center\" style=\"padding-top:10px;padding-bottom:15px\">
                                            <table width=\"95%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">
                                                <tbody>
                                                <tr>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align=\"center\" style=\"background-color:white\">
                                            <table width=\"100%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">
                                                <tbody>
                                                <tr>
                                                    <td style=\"border-top:3px solid #ae2070;border-radius:4px 4px 0 0\">
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>                     
                                <tr>
                                    <td align=\"center\" style=\"padding-top:25px;padding-bottom:25px;background-color:white\">
                                    <div class=\"logo\">
                                    <div class=\"text header-text\">
                                        <span style=\"font-weight:bold\" class=\"name\">RSADEMO</span>
                                    </div>
                                </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td align=\"center\" style=\"background-color:white\">
                                        <table width=\"90%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">
                                            <tbody>
                                            <tr><td>
                                                <img src=\"https://ci3.googleusercontent.com/meips/ADKq_Nb4_CdH6ivMV5KKC_7dZJeRIFgPMT36aYr6lv1KtFbbaYbkwwboMuqe4EtJr0sKtSO5FxCjpxamr-DPYaXx2jcj5jqq_Ao5gPpCNz1ur7UInVOcaKE=s0-d-e1-ft#https://cdn.mservice.com.vn/app/img/ota/email/banner_cinema.png\" width=\"100%\" alt=\"Ví điện tử MoMo\" style=\"object-fit:contain;display:block;border:0\" class=\"CToWUd a6T\" data-bit=\"iit\" tabindex=\"0\">
                                            </td>
                                            </tr></tbody>
                                        </table>
        
                                    </td>
                                </tr>
                                <tr>
                                    <td align=\"center\" style=\"background-color:white\">
                                        <table width=\"90%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin-bottom:12px\">
                                            <tbody>
                                                <tr>
                                                    <td align=\"left\" style=\"padding-top:25px;padding-bottom:0px;background-color:white;border:1px solid #e8e8e8;border-radius:12px\">
                                                        <table width=\"100%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">
                                                            <tbody>
                                                                <tr align=\"center\">
                                                                    <td style=\"color:#303233;font-size:16px;padding-bottom:5px\">
                                                                        <strong>Tải khóa riêng tư</strong></td>
                                                                </tr>
                                                                <tr>
                                                                    <td align=\"center\" style=\"background-color:white\">
                                                                        <table width=\"90%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">
                                                                            <tbody>
                                                                            <tr><td align=\"left\" style=\"padding-top:25px;padding-bottom:25px;background-color:white\">
                                                                                <p style=\"margin:0 0 0 0;color:#303233;font-size:12px;margin:0;padding-bottom:10px\">
                                                                                    Xin chào <span style=\"color:#303233;font-size:12px;font-weight:bold\">${userName},</span>
                                                                                </p>
                                                                                <p style=\"margin:0 0 0 0;color:#303233;font-size:12px\">
                                                                                    <br> Khóa riêng tư của bạn đã được cấp lại. Vui lòng tải khóa riêng tư:<br>
                                                                                    <a href="http://localhost:3000/users/download-key?token=${token}">Tải khóa riêng tư</a>
                                                                                </p>
                                                                            </td>
                                                                            </tr></tbody>
                                                                        </table>
                                                                    </td>                                   
                                                                </tr>
                                                            </tbody>    
                                                        </table>
                                                    </td>   
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                </body> 
            </html>
    `,
    }
    await transporter.sendMail(mailOptions);
}
