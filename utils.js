import nodeMailer from "nodemailer";

const convertToCSV = (objArray) => {
  var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  var str = "";
  const keys = Object.keys(array[0]);

  // add header row
  str += keys.join(",") + "\r\n";
  // add data rows
  array.forEach(function (item) {
    var line = keys.map(function (key) {
      return item[key];
    });
    str += line.join(",") + "\r\n";
  });

  return str;
};

const sendEmail = async ({ mailTo, subject, dataType, filename }) => {
  let transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: '"Patrick Kabwe 👻" <patrick@sparknspur.com>', // sender address
    to: mailTo, // "bar@example.com, baz@example.com"
    subject, // Subject line
    text: `
Hi Team,

Please find the attached ${dataType} cova data.

Automated email from Cova Data Process.

Thanks,
Patrick

    `, // plain text body
    attachments: [
      {
        filename,
        path: `./reports/${filename}`, // stream this file
      },
    ],
  });

  return info;
};

export { convertToCSV, sendEmail };
