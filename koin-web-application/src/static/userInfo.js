class UserInfo {
  portal_account;
  password;
  name;
  nickname;
  grade;
  gender;
  identity;
  is_graduated;
  major;
  student_number;
  phone_number;

  constructor(userInfo) {
    if (userInfo != null && userInfo != undefined) {
      this.portal_account = this.valueCheck(userInfo.portal_account);
      this.password = this.valueCheck(userInfo.password);
      this.name = this.valueCheck(userInfo.name);
      this.nickname = this.valueCheck(userInfo.nickname);
      this.grade = this.valueCheck(userInfo.grade);
      this.gender = this.valueCheck(userInfo.gender);
      this.identity = this.valueCheck(userInfo.identity);
      this.is_graduated = this.valueCheck(userInfo.is_graduated);
      this.major = this.valueCheck(userInfo.major);
      this.student_number = this.valueCheck(userInfo.student_number);
      this.phone_number = this.valueCheck(userInfo.phone_number);
    }
  }

  valueCheck(value) {
    if (value == undefined || value == null) {
      return ""
    }
    else return value
  }
}


