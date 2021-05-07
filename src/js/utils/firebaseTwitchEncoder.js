export const encodeEmail = (emailToEncode) => {
  let encodedEmail = emailToEncode.replaceAll(".", "(dot)");
  encodedEmail = encodedEmail.replaceAll("$", "(dollar)");
  encodedEmail = encodedEmail.replaceAll("#", "(numeric)");
  encodedEmail = encodedEmail.replaceAll("[", "(rightBracket)");
  encodedEmail = encodedEmail.replaceAll("]", "(leftBracket)");
  encodedEmail = encodedEmail.replaceAll("/", "(slash)");
  return encodedEmail;
};