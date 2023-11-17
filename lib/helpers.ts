const translateToURLencoded = (obj: any) => {
  let formBody: any = [];
  for (let property in obj) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(obj[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  return formBody;
};

const oneHourfromNowFlipFormat = () => {
  const oneHourFromNow = new Date(
    new Date().getTime() + 60 * 60 * 1000
  ).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const splitedDateTime = oneHourFromNow.split(",");
  const date = splitedDateTime[0];
  const time = splitedDateTime[1];

  const splitedDate = date.split("/");
  const month = splitedDate[0];
  const day = splitedDate[1];
  const year = splitedDate[2];

  const joinedDate = [year, month, day].join("-");
  return `${joinedDate}${time}`;
};

function removeDuplicateObjectFromArray<T>(array: T[], key: keyof T) {
  const check = new Set();
  return array.filter((obj) => !check.has(obj[key]) && check.add(obj[key]));
}
function translateStatus(status: string) {
  const transalatedStatus =
    status === "FINISHED"
      ? { message: "completed", status: "ok" }
      : status === "000"
      ? { message: "transaction created", status: "ok" }
      : status === "001"
      ? { message: "shipper selected", status: "ok" }
      : status === "012"
      ? { message: "waiting payment to complete", status: "pending" }
      : status === "002"
      ? { message: "payment complete", status: "ok" }
      : status === "022"
      ? { message: "payment failed", status: "fail" }
      : status === "003"
      ? { message: "ready for pickup", status: "ok" }
      : status === "013"
      ? { message: "requesting pickup", status: "pending" }
      : status === "023"
      ? { message: "pickup canceled", status: "fail" }
      : status === "114"
      ? { message: "courier picking up", status: "pending" }
      : status === "214"
      ? { message: "picked up", status: "pending" }
      : status === "314"
      ? { message: "sending package", status: "pending" }
      : status === "004"
      ? { message: "package send", status: "ok" }
      : { message: "transaction not found", status: "fail" };
  return transalatedStatus;
}
export {
  translateToURLencoded,
  oneHourfromNowFlipFormat,
  removeDuplicateObjectFromArray,
  translateStatus,
};
