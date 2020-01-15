<template>
  <div class="container">
    <div class="signup">
      <img
        @click="go('/')"
        src="https://static.koreatech.in/upload/7fb830175c27b396c65d30952c606320.png">
      <div class="id">
        <input
          type="text"
          v-model="userId"
          placeholder="아우누리 아이디를 입력해주세요. (필수)"
          ref="userId">
      </div>
      <div class="help-desc">@koreatech.ac.kr은 입력하지 않으셔도 됩니다.</div>
      <div class="pw">
        <input
          type="password"
          :style="{ border: passwordFirst!==''&&passwordFirst===passwordSecond ? '2px solid #1aa54f' : passwordFirst!=''&&passwordFirst!=passwordSecond ? '2px solid red' : ''}"
          v-model="passwordFirst"
          placeholder="비밀번호 (필수)">
      </div>
      <div class="help-desc">비밀번호는 특수문자, 숫자를 포함한 6자 이상 18자 이하여야 합니다.</div>
      <div class="pw-check">
        <input
          type="password"
          v-model="passwordSecond"
          placeholder="비밀번호 확인 (필수)">
      </div>
      <div class="name">
        <input
          type="text"
          v-model="name"
          placeholder="이름 (선택)">
      </div>
      <div class="nickname">
        <input
          type="text"
          v-model="nickname"
          placeholder="닉네임 (선택)">
        <button
          class="nickname-button"
          @click="clickNicknameCheck">
          중복확인
        </button>
      </div>
      <div class="student-number">
        <input
          type="text"
          v-model="studentNumber"
          placeholder="학번 (선택)">
      </div>
      <div class="phone-number">
        <input
          type="text"
          v-model="phoneNumber"
          placeholder="전화번호 (Ex: 010-0000-0000) (선택)">
      </div>
      <div class="select-list">
        <div class="select-major">
          <div class="dropdown">
            <button
              class="drop-btn"
              type="button"
              value="signUpMajor"
              :style="{ backgroundColor: selectMajorValue !== '학부 (학번 입력시 자동입력)' ? '#175c8e' : '#ffffff', color: selectMajorValue !== '학부 (학번 입력시 자동입력)' ? '#ffffff' : '#bec9d5' }">
              {{ selectMajorValue }}
            </button>
          </div>
        </div>
        <div class="select-gender">
          <div class="dropdown">
            <button
              class="drop-btn gender"
              type="button"
              @click="clickSelectGenderBtn">
              {{ selectGenderValue }}
              <img src="https://static.koreatech.in/assets/img/bus_dropdown.png">
            </button>
            <div
              id="select-gender-dropdown"
              class="dropdown-list gender-list">
              <a
                v-for="gender in genderList"
                :key="gender.id"
                @click="clickGender(gender)">
                {{ gender }}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="access-terms all">
        <input
          id="all"
          type="checkbox"
          v-model="allTermChecked"
          @click="checkAllTerm()">
        <label
          for="all">
          아래 이용약관에 모두 동의합니다.
        </label>
      </div>
      <div class="access-terms personal-data">
        <input
          id="personal-data"
          type="checkbox"
          v-model="personalDataTermsChecked"
          @click="checkPersonalDataTerms()">
        <label
          for="personal-data">
          개인정보 이용약관에 동의합니다.
        </label>
      </div>
      <div class="access-terms koin">
        <input
          id="koin"
          type="checkbox"
          v-model="koinTermsChecked"
          @click="checkKoinTerms()">
        <label
          for="koin">
          코인 이용약관에 동의합니다.
        </label>
      </div>
      <button
        :disabled="signUpFlag"
        class="signup-button"
        @click="signUp">
        <span v-if="!signUpFlag">가입 완료</span>
        <div
          v-if="signUpFlag"
          class="loading">
          <circle2
            stroke="3px"
            background="#ffffff"
            color="#175c8e"
            size="20px">
          </circle2>
        </div>
      </button>
      <div
        class="show-personal-data-terms line"
        @click="showPersonalDataTerms">
        개인정보 이용약관 보기
      </div>
      <div
        class="personal-data-terms"
        v-show="personalDataTermsFlag">
        <textarea
          v-model="personalInformationTerm"
          cols="30"
          rows="10"
          readonly>
        </textarea>
      </div>
      <div
        class="show-koin-terms"
        @click="showKoinTerms">
        코인 이용약관 보기
      </div>
      <div
        class="koin-terms"
        v-show="koinTermsFlag">
        <textarea
          cols="30"
          rows="10"
          readonly
          v-model="koinUseTerm">
        </textarea>
      </div>
      <span class="footer">
        COPYRIGHT ⓒ {{ today.getFullYear() }} BY <span class="bold">BCSDLab</span> All RIGHTS RESERVED.
      </span>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {Circle2} from 'vue-loading-spinner'

  export default {
    name: 'Test',
    components: {
      Circle2
    },
    computed: {
      ...mapGetters({
        nicknameCheck: 'nicknameCheck',
        stateNickname: 'nickname'
      })
    },
    data() {
      return {
        today: new Date(),
        signUpFlag: false,
        userId: "",
        passwordFirst: "",
        passwordSecond: "",
        name: undefined,
        nickname: undefined,
        gender: undefined,
        signUpIdentity: 0,
        isGraduated: undefined,
        signUpMajor: undefined,
        studentNumber: undefined,
        phoneNumber: undefined,
        selectMajorValue: "학부 (학번 입력시 자동으로 입력)",
        nicknameChecker: /admin|관리자/,
        passwordChecker: /[`₩~!@#$%<>^&*()\-=+_?<>:;"',.{}|[\]\/\\]/g,
        majorList: ["기계공학부", "메카트로닉스공학부", "전기전자통신공학부", "컴퓨터공학부", "디자인건축공학부", "에너지신소재화학공학부", "산업경영학부"],
        majorCode: ["120", "140", "161", "135", "136", "151", "174", "180"],
        phoneNumberChecker: /^\d{3}-\d{3,4}-\d{4}$/,
        genderList: ["남", "여"],
        selectGenderValue: "성별",
        personalDataTermsFlag: true,
        koinTermsFlag: true,
        personalDataTermsChecked: false,
        koinTermsChecked: false,
        allTermChecked: this.personalDataTermsChecked && this.koinTermsChecked ? true : false,
        emailLocalPartRegex: /^[a-z_0-9]{1,12}$/,
        personalInformationTerm: "제1조 개인정보의 처리 목적 (‘koreatech.in’이하 ‘코인’) 은(는) 다음의 목적을 위하여 개인정보를 처리하고 있으며, 다음의 목적 이외의 용도로는 이용하지 않습니다.\n" +
        "- 고객 가입의사 확인, 고객에 대한 서비스 제공에 따른 본인 식별.인증, 회원자격 유지.관리, 물품 또는 서비스 공급에 따른 금액 결제, 물품 또는 서비스의 공급.배송 등\n" +
        "\n" +
        "제 2조 개인정보의 처리 및 보유 기간\n" +
        "① (‘koreatech.in’이하 ‘코인’) 은(는) 정보주체로부터 개인정보를 수집할 때 동의 받은 개인정보 보유․이용기간 또는 법령에 따른 개인정보 보유․이용기간 내에서 개인정보를 처리․보유합니다.\n" +
        "\n" +
        "② 구체적인 개인정보 처리 및 보유 기간은 다음과 같습니다.\n" +
        "☞ 아래 예시를 참고하여 개인정보 처리업무와 개인정보 처리업무에 대한 보유기간 및 관련 법령, 근거 등을 기재합니다.\n" +
        "(예시)- 고객 가입 및 관리 : 서비스 이용계약 또는 회원가입 해지시까지, 다만 채권․채무관계 잔존시에는 해당 채권․채무관계 정산시까지\n" +
        "- 전자상거래에서의 계약․청약철회, 대금결제, 재화 등 공급기록 : 5년\n" +
        "\n" +
        "제 3조 개인정보의 제3자 제공\n" +
        "(‘koreatech.in’이하 ‘코인) 은(는) 정보주체의 별도 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조에 해당하는 경우 외에는 개인정보를 제3자에게 제공하지 않습니다.\n" +
        "\n" +
        "제 4조 처리하는 개인정보의 항목 작성\n" +
        "① ('koreatech.in'이하 '코인')은(는) 다음의 개인정보 항목을 처리하고 있습니다.\n" +
        "1<일반 회원가입>\n" +
        "- 필수항목 : 이메일, 로그인ID, 이름, 닉네임, 학번, 학부, 학년\n" +
        "- 선택항목 : 휴대전화번호, 성별, 소속 동아리, 소속 자치지구, 졸업여부\n" +
        "\n" +
        "2<자동 수집 항목>\n" +
        "- 필수항목 : 서비스 이용 기록, 접속 로그, 접속 IP 정보\n" +
        "\n" +
        "제 5조 개인정보의 파기('코인')은(는) 원칙적으로 개인정보 처리목적이 달성된 경우에는 지체없이 해당 개인정보를 파기합니다. 파기의 절차, 기한 및 방법은 다음과 같습니다.\n" +
        "-파기절차이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져(종이의 경우 별도의 서류) 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다. 이 때, DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는 다른 목적으로 이용되지 않습니다.-파기기한이용자의 개인정보는 개인정보의 보유기간이 경과된 경우에는 보유기간의 종료일로부터 5일 이내에, 개인정보의 처리 목적 달성, 해당 서비스의 폐지, 서비스의 종료 등 그 개인정보가 불필요하게 되었을 때에는 개인정보의 처리가 불필요한 것으로 인정되는 날로부터 5일 이내에 그 개인정보를 파기합니다.\n" +
        "\n" +
        "제 6조 개인정보의 안전성 확보 조치 ('코인')은(는) 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를 하고 있습니다.\n" +
        "1. 내부관리계획의 수립 및 시행\n" +
        "개인정보의 안전한 처리를 위하여 내부관리계획을 수립하고 시행하고 있습니다.\n" +
        "\n" +
        "2. 개인정보의 암호화\n" +
        "이용자의 개인정보는 비밀번호는 암호화 되어 저장 및 관리되고 있어, 본인만이 알 수 있으며 중요한 데이터는 파일 및 전송 데이터를 암호화 하거나 파일 잠금 기능을 사용하는 등의 별도 보안기능을 사용하고 있습니다.\n" +
        "\n" +
        "3. 개인정보에 대한 접근 제한\n" +
        "개인정보를 처리하는 데이터베이스시스템에 대한 접근권한의 부여,변경,말소를 통하여 개인정보에 대한 접근통제를 위하여 필요한 조치를 하고 있으며 침입차단시스템을 이용하여 외부로부터의 무단 접근을 통제하고 있습니다.\n" +
        "\n" +
        "제 7조 개인정보 보호책임자 작성\n" +
        "① TAEM_KAP(‘koreatech.in’이하 ‘코인) 은(는) 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.\n" +
        "\n" +
        "▶ 개인정보 보호책임자\n" +
        "성명 : 김남훈 (TEAM_KAP Project Leader)\n" +
        "연락처 : mydamyda1032@gmail.com\n" +
        "※ 개인정보 보호 담당부서로 연결됩니다.\n" +
        "\n" +
        "② 정보주체께서는 TAEM_KAP(‘koreatech.in’이하 ‘코인) 의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. TAEM_KAP(‘koreatech.in’이하 ‘코인) 은(는) 정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.\n" +
        "\n" +
        "\n" +
        "제 8조 개인정보 처리방침 변경\n" +
        "①이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.",
        koinUseTerm: "코인 이용약관\n" +
        "서비스 이용 약관에 동의합니다.\n" +
        "\n" +
        "제1조 (목적)\n" +
        "본 약관은 코인이 제공하는 코인 및 코인 관련 제반 서비스(이하 \"서비스\"라 합니다)의 이용과 관련하여 코인과 코인과의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.\n" +
        "\n" +
        "제2조 (회원의 정의)\n" +
        "① 회원이란 코인이 제공하는 서비스에 접속하여 본 약관에 따라 코인의 이용절차에 동의하고 코인가 제공하는 서비스를 이용하는 이용자를 말합니다.\n" +
        "\n" +
        "제3조 (회원 가입)\n" +
        "① 회원이 되고자 하는 자는 코인이 정한 가입 양식에 따라 회원정보를 기입하고 \"동의\", \"확인\" 등의 버튼을 누르는 방법으로 회원 가입을 신청합니다.\n" +
        "② 코인은 제1항과 같이 회원으로 가입할 것을 신청한 자가 다음 각 호에 해당하지 않는 한 신청한 자를 회원으로 등록합니다.\n" +
        "1. 등록 내용에 허위, 기재누락, 오기가 있는 경우\n" +
        "2. 제6조 제2항에 해당하는 회원 자격 제한 및 정지, 상실을 한 경험이 있었던 경우\n" +
        "3. 기타 회원으로 등록하는 것이 코인의의 서비스 운영 및 기술상 현저히 지장이 있다고 판단되는 경우\n" +
        "③ 회원가입계약의 성립시기는 코인의 승낙이 가입신청자에게 도달한 시점으로 합니다.\n" +
        "④ 회원은 제1항의 회원정보 기재 내용에 변경이 발생한 경우, 즉시 변경사항을 정정하여 기재하여야 합니다.\n" +
        "\n" +
        "제4조 (서비스의 제공 및 변경)\n" +
        "① 코인은 회원에게 아래와 같은 서비스를 제공합니다.\n" +
        "1. 커뮤니티 서비스\n" +
        "2. 개인화 서비스\n" +
        "3. 검색 서비스\n" +
        "4. 기타 코인이 자체 개발하거나 다른 회사와의 협력계약 등을 통해 회원들에게 제공할 일체의 서비스\n" +
        "② 코인 서비스의 내용 및 제공일자를 제7조 제2항에서 정한 방법으로 회원에게 통지하고, 제1항에 정한 서비스를 변경하여 제공할 수 있습니다.\n" +
        "\n" +
        "제5조 (서비스의 중단)\n" +
        "① 코인은 컴퓨터 등 정보통신설비의 보수점검•교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있고, 새로운 서비스로의 교체, 기타 코인이 적절하다고 판단하는 사유에 기하여 현재 제공되는 서비스를 완전히 중단할 수 있습니다.\n" +
        "② 제1항에 의한 서비스 중단의 경우에 코인은 제7조 제2항에서 정한 방법으로 회원에게 통지합니다. 다만, 코인이 통제할 수 없는 사유로 인한 서비스의 중단(시스템 관리자의 고의, 과실이 없는 디스크 장애, 시스템 다운 등)으로 인하여 사전 통지가 불가능한 경우에는 그러하지 아니합니다.\n" +
        "\n" +
        "제6조 (회원 탈퇴 및 자격 상실 등)\n" +
        "① 회원은 코인에 언제든지 자신의 회원 등록 말소(회원 탈퇴)를 요청할 수 있으며 코인는 위 요청을 받은 즉시 해당 회원의 회원 등록 말소를 위한 절차를 밟습니다.\n" +
        "② 회원 탈퇴가 이루어진 경우 회원의 게시물 중 개인 영역(갤로그 서비스 중 마이로그, 방명록 메뉴 등)에 등록된 게시물 일체는 삭제됩니다. 다만, 커뮤니티 서비스, 기타 공용 게시판 등에 등록된 게시물은 삭제되지 않습니다.\n" +
        "③ 회원이 다음 각 호의 사유에 해당하는 경우, 코인은 회원의 회원자격을 적절한 방법으로 제한 및 정지, 상실시킬 수 있습니다.\n" +
        "1. 가입 신청 시에 허위 내용을 등록한 경우\n" +
        "2. 다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자거래질서를 위협하는 경우\n" +
        "3. 서비스를 이용하여 법령과 본 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우\n" +
        "④ 코인이 회원의 회원자격을 상실시키기로 결정한 경우에는 회원등록을 말소합니다.\n" +
        "⑤ 이용자가 본 약관에 의해서 회원 가입 후 서비스를 이용하는 도중, 연속하여 1년 동안 서비스를 이용하기 위해 로그인 기록이 없는 경우, 코인은 회원의 회원자격을 상실시킬 수 있습니다.\n" +
        "\n" +
        "제7조 (회원에 대한 통지)\n" +
        "① 코인이 특정 회원에게 서비스에 관한 통지를 하는 경우 회원정보에 등록된 메일주소를 사용할 수 있습니다.\n" +
        "② 코인이 불특정다수 회원에 대한 통지를 하는 경우 7일 이상 공지사항 게시판에 게시함으로써 개별 통지에 갈음할 수 있습니다.\n" +
        "\n" +
        "제8조 (회원의 개인정보)\n" +
        "코인은 서비스를 제공하기 위하여 관련 법령의 규정에 따라 회원으로부터 필요한 개인정보를 수집합니다. (개인정보에 대한 개별 항목은 개인정보처리방침에서 고지)\n" +
        "\n" +
        "제9조 (코인의 의무)\n" +
        "① 코인은 법령과 본 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 본 약관이 정하는 바에 따라 지속적이고, 안정적으로 서비스를 제공하기 위해서 노력합니다.\n" +
        "② 코인은 회원이 안전하고 편리하게 서비스를 이용할 수 있도록 시스템을 구축합니다.\n" +
        "③ 코인은 회원이 원하지 않는 영리목적의 광고성 전자우편을 발송하지 않습니다.\n" +
        "④ 코인은 회원이 서비스를 이용함에 있어 회원에게 법률적인 증명이 가능한 고의 또는 중대한 과실을 입힐 경우 이로인한 손해를 배상할 책임이 있습니다.\n" +
        "\n" +
        "제10조 (회원의 ID 및 비밀번호에 대한 의무)\n" +
        "① 코인은 관계법령, \"개인정보보호정책\"에 의해서 그 책임을 지는 경우를 제외하고, 자신의 ID와 비밀번호에 관한 관리책임은 각 회원에게 있습니다.\n" +
        "② 회원은 자신의 ID 및 비밀번호를 제3자에게 이용하게 해서는 안됩니다.\n" +
        "③ 회원은 자신의 ID 및 비밀번호를 도난당하거나 제3자가 사용하고 있음을 인지한 경우에는 바로 코인에 통보하고 코인의 안내가 있는 경우에는 그에 따라야 합니다.\n" +
        "\n" +
        "제11조 (회원의 의무)\n" +
        "① 회원은 다음 각 호의 행위를 하여서는 안됩니다.\n" +
        "1. 회원가입신청 또는 변경시 허위내용을 등록하는 행위\n" +
        "2. 코인 및 제3자의 지적재산권을 침해하거나 코인의 권리와 업무 또는 제3자의 권리와 활동을 방해하는 행위\n" +
        "3. 다른 회원의 ID를 도용하는 행위\n" +
        "4. 관련 법령에 의하여 전송 또는 게시가 금지되는 정보(컴퓨터 프로그램 등)의 게시 또는 전송하는 행위\n" +
        "5. 코인의 직원 또는 서비스의 관리자를 가장하거나 타인의 명의를 도용하여 정보를 게시, 전송하는 행위\n" +
        "6. 컴퓨터 소프트웨어, 하드웨어, 전기통신 장비의 정상적인 가동을 방해, 파괴할 목적으로 고안된 소프트웨어 바이러스, 기타 다른 컴퓨터 코드, 파일, 프로그램을 포함하고 있는 자료를 게시하거나 전송하는 행위\n" +
        "7. 스토킹(stalking) 등 다른 회원을 괴롭히는 행위\n" +
        "8. 다른 회원에 대한 개인정보를 그 동의 없이 수집, 저장, 공개하는 행위\n" +
        "9. 불특정 다수의 자를 대상으로 하여 광고 또는 선전을 게시하거나 음란물을 게시하는 행위\n" +
        "10. 코인이 제공하는 갤로그 및 관련 서비스에 게시된 공지사항 규정을 위반하는 행위\n" +
        "② 제1항에 해당하는 행위를 한 회원이 있을 경우 코인은 본 약관 제6조 제2, 3항에서 정한 바에 따라 회원의 회원자격을 적절한 방법으로 제한 및 정지, 상실시킬 수 있습니다.\n" +
        "③ 회원은 그 귀책사유로 인하여 코인이나 다른 회원이 입은 손해를 배상할 책임이 있습니다.\n" +
        "\n" +
        "제12조 (공개게시물의 삭제 또는 이용제한)\n" +
        "① 회원의 공개게시물의 내용이 다음 각 호에 해당하는 경우 코인은 해당 공개게시물에 대한 접근을 임시적으로 차단하는 조치를 취할 수 있고, 7일 이내에 각 호의 동일 사례가 2회 이상 반복되는 경우 해당 게시물을 삭제 또는 해당 회원의 회원 자격을 제한, 정지 또는 상실시킬 수 있습니다.\n" +
        "1. 다른 회원 또는 제3자를 비방하거나 중상 모략으로 명예를 손상시키는 내용\n" +
        "2. 음란물, 욕설 등 공서양속에 위반되는 내용의 정보, 문장, 도형 등을 유포하는 내용\n" +
        "3. 범죄행위와 관련이 있다고 판단되는 내용\n" +
        "4. 다른 회원 또는 제3자의 저작권 등 기타 권리를 침해하는 내용\n" +
        "5. 종교적, 정치적 분쟁을 야기하는 내용으로서, 이러한 분쟁으로 인하여 코인의 업무가 방해되거나 방해되리라고 판단되는 경우\n" +
        "6. 타인의 개인정보, 사생활을 침해하거나 명예를 손상시키는 경우\n" +
        "7. 동일한 내용을 중복하여 다수 게시하는 등 게시의 목적에 어긋나는 경우\n" +
        "8. 불필요하거나 승인되지 않은 광고, 판촉물을 게재하는 경우\n" +
        "② 회원의 공개게시물로 인한 법률상 이익 침해를 근거로, 다른 회원 또는 제3자가 회원 또는 코인을 대상으로 하여 민형사상의 법적 조치(예:고소, 가처분신청, 손해배상청구소송)를 취하는 동시에 법적 조치와 관련된 게시물의 삭제를 요청해오는 경우, 코인은 동 법적 조치의 결과(예: 검찰의 기소, 법원의 가처분결정, 손해배상판결)가 있을 때까지 관련 게시물에 대한 접근을 잠정적으로 제한할 수 있습니다.\n" +
        "\n" +
        "제13조 (저작권의 귀속 및 게시물의 이용)\n" +
        "① 코인이 작성한 저작물에 대한 저작권, 기타 지적재산권은 코인에 귀속합니다.\n" +
        "② 회원은 코인이 제공하는 서비스를 이용함으로써 얻은 정보를 코인의 사전승낙 없이 복제, 전송, 출판, 배포, 방송, 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.\n" +
        "③ 회원이 서비스 내에 게시한 게시물의 저작권은 게시한 회원에게 귀속됩니다. 단, 코인는 서비스의 운영, 전시, 전송, 배포, 홍보의 목적으로 회원의 별도의 허락 없이 무상으로 저작권법에 규정하는 공정한 관행에 합치되게 합리적인 범위 내에서 다음과 같이 회원이 등록한 게시물을 사용할 수 있습니다.\n" +
        "1. 서비스 내에서 회원 게시물의 복제, 수정, 개조, 전시, 전송, 배포 및 저작물성을 해치지 않는 범위 내에서의 편집 저작물 작성\n" +
        "2. 미디어, 통신사 등 서비스 제휴 파트너에게 회원의 게시물 내용을 제공, 전시 혹은 홍보하게 하는 것. 단, 이 경우 코인은 별도의 동의 없이 회원의 이용자ID 외에 회원의 개인정보를 제공하지 않습니다.\n" +
        "3. 코인은 전항 이외의 방법으로 회원의 게시물을 이용하고자 하는 경우, 전화, 팩스, 전자우편 등의 방법을 통해 사전에 회원의 동의를 얻어야 합니다.\n" +
        "\n" +
        "제14조 (광고게재 및 광고주와의 거래)\n" +
        "① 코인이 회원에게 서비스를 제공할 수 있는 서비스 투자기반의 일부는 광고게재를 통한 수익으로부터 나옵니다. 회원은 회원이 등록한 게시물의 내용을 활용한 광고게재 및 기타 서비스상에 노출되는 광고게재에 대해 동의합니다.\n" +
        "② 코인은 서비스상에 게재되어 있거나 서비스를 통한 광고주의 판촉활동에 회원이 참여하거나 교신 또는 거래를 함으로써 발생하는 손실과 손해에 대해 책임을 지지 않습니다\n" +
        "\n" +
        "제15조 (약관의 개정)\n" +
        "① 코인은 약관의규제등에관한법률, 전자거래기본법, 전자서명법, 정보통신망이용촉진등에관한법률 등 관련법을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.\n" +
        "② 다만, 개정 내용이 회원에게 불리할 경우에는 적용일자 30일 이전부터 적용일자 전일까지 공지합니다.\n" +
        "③ 회원은 변경된 약관에 대해 거부할 권리가 있습니다. 회원은 변경된 약관이 공지된 후 15일 이내에 거부의사를 표명할 수 있습니다. 회원이 거부하는 경우 코인은 당해 회원과의 계약을 해지할 수 있습니다. 만약 회원이 변경된 약관이 공지된 후 15일 이내에 거부의사를 표시하지 않는 경우에는 동의하는 것으로 간주합니다.\n" +
        "\n" +
        "제16조 (재판관할)\n" +
        "코인과 회원간에 발생한 서비스 이용에 관한 분쟁에 대하여는 대한민국 법을 적용하며, 본 분쟁으로 인한 소는 민사소송법상의 관할을 가지는 대한민국의 법원에 제기합니다."
      }
    },
    methods: {
      go: function (val) {
        this.$router.push(val)
      },
      signUp: function (e) {
        if (this.userId.indexOf("@koreatech.ac.kr") != -1) {
          alert("@koreatech.ac.kr을 빼고 입력해주세요.");
          return;
        }
        this.userId = this.userId.trim();
        if (!this.emailLocalPartRegex.test(this.userId)) {
          alert("아우누리 계정 형식에서 벗어났습니다.");
          return;
        }
        if (this.nickname === ""){
          this.nickname = undefined;
        }
        if (this.name === "") {
          this.name = undefined;
        }
        if (this.passwordFirst === "" || this.passwordSecond === "" || this.userId === "") {
          alert("필수정보는 입력하셔야 합니다.");
          return;
        }
        if (this.passwordFirst.length < 6 || this.passwordFirst.length > 18) {
          alert("비밀번호는 6자 이상 18자 이하여야 합니다.");
          return;
        }
        if (this.passwordFirst !== this.passwordSecond) {
          alert("입력하신 비밀번호가 일치하지 않습니다.");
          return;
        }
        if (!this.passwordChecker.test(this.passwordFirst)) {
          alert("비밀번호는 하나 이상의 특수문자가 필요합니다.");
          return;
        }
        if (!(this.personalDataTermsChecked && this.koinTermsChecked)) {
          alert("이용 약관에 모두 동의해주세요");
          return;
        }
        if (this.studentNumber === "") {
          this.studentNumber = undefined;
        }
        if (this.studentNumber !== undefined) {
          let majorCode = this.studentNumber.substring(4, 7);
          let cnt = 0;
          if (this.studentNumber.length !== 10) {
            alert("학번은 10자리 숫자여야 합니다.");
            return;
          }
          if (this.studentNumber.substring(0, 4) < 1992 || this.studentNumber.substring(0, 4) > new Date().getFullYear()) {
            alert("올바른 입학년도가 아닙니다.");
            return;
          }
          for (let i = 0; i < this.majorCode.length; i++) {
            if (majorCode !== this.majorCode[i]) cnt++;
            if (cnt === 8) {
              alert('올바른 학부코드가 아닙니다.');
              return;
            }
          }
        }
        this.phoneNumber = this.phoneNumber === "" ? undefined : this.phoneNumber;
        if (this.phoneNumber !== undefined && !this.phoneNumberChecker.test(this.phoneNumber)) {
          alert("전화번호 양식을 지켜주세요. (Ex: 010-1234-5678)");
          return;
        }
        if (this.nickname === undefined || this.stateNickname === this.nickname || this.nickname === '') {
          this.signUpFlag = true;
          this.$store.dispatch('signUp', {
            portal_account: this.userId,
            password: this.passwordFirst,
            name: this.name,
            nickname: this.nickname,
            gender: this.gender,
            identity: this.signUpIdentity,
            is_graduated: this.signUpIdentity == 4 ? true : false,
            major: this.signUpMajor,
            student_number: this.studentNumber,
            phone_number: this.phoneNumber
          }).then((data) => {
            this.signUpFlag = false;
            this.$router.replace('/login');
          }, (reject) => {
            if (!reject)
              this.signUpFlag = false;
          });
        }
        else {
          alert("닉네임 중복확인을 해주세요.")
        }
      },
      clickNicknameCheck: function () {
        if (this.nicknameChecker.test(this.nickname)) {
          alert("사용할 수 없는 닉네임입니다");
          return;
        }
        if (this.nickname === undefined) {
          alert("닉네임을 입력하여주세요.");
          return;
        }
        this.$store.dispatch('nicknameCheck', {
          nickname: this.nickname
        })
      },
      clickSelectGenderBtn() {
        if (document.getElementById("select-gender-dropdown").style.display === 'none' || document.getElementById("select-gender-dropdown").style.display === '')
          document.getElementById("select-gender-dropdown").style.display = 'block';
        else
          document.getElementById("select-gender-dropdown").style.display = 'none';
      },
      clickGender(gender) {
        this.gender = gender === "남" ? 0 : 1;
        this.selectGenderValue = gender;
        document.getElementById("select-gender-dropdown").style.display = 'none';
        document.getElementsByClassName("drop-btn")[1].style.backgroundColor = '#175c8e';
        document.getElementsByClassName("drop-btn")[1].style.color = '#ffffff';
      },
      showPersonalDataTerms() {
        this.personalDataTermsFlag = !this.personalDataTermsFlag;
      },
      showKoinTerms() {
        this.koinTermsFlag = !this.koinTermsFlag;
      },
      checkAllTerm() {
        if (this.allTermChecked) {
          this.koinTermsChecked = false;
          this.personalDataTermsChecked = false;
        } else {
          this.personalDataTermsChecked = true;
          this.koinTermsChecked = true;
        }
        this.allTermChecked = this.koinTermsChecked && this.personalDataTermsChecked;
      },
      checkKoinTerms() {
        this.koinTermsChecked = !this.koinTermsChecked;
        this.allTermChecked = this.koinTermsChecked && this.personalDataTermsChecked;
      },
      checkPersonalDataTerms() {
        this.personalDataTermsChecked = !this.personalDataTermsChecked;
        this.allTermChecked = this.koinTermsChecked && this.personalDataTermsChecked;
      },
      setMajorByStudentNumber() {
        let majorCode;
        if (this.studentNumber !== undefined)
          majorCode = this.studentNumber.substring(4, 7);
        if (majorCode === '120') {
          this.signUpMajor = '기계공학부';
          this.selectMajorValue = '기계공학부';
        } else if (majorCode === '140') {
          this.signUpMajor = '메카트로닉스공학부';
          this.selectMajorValue = '메카트로닉스공학부';
        } else if (majorCode === '161') {
          this.signUpMajor = '전기전자통신공학부';
          this.selectMajorValue = '전기전자통신공학부';
        } else if (majorCode === '136' || majorCode === '135') {
          this.signUpMajor = '컴퓨터공학부';
          this.selectMajorValue = '컴퓨터공학부';
        } else if (majorCode === '151') {
          this.signUpMajor = '디자인건축공학부';
          this.selectMajorValue = '디자인건축공학부';
        } else if (majorCode === '174') {
          this.signUpMajor = '에너지신소재화학공학부';
          this.selectMajorValue = '에너지신소재화학공학부';
        } else if (majorCode === '180') {
          this.signUpMajor = '산업경영학부';
          this.selectMajorValue = '산업경영학부';
        } else {
          this.signUpMajor = undefined;
          this.selectMajorValue = '학부 (학번 입력시 자동입력)';
        }
      }
    },
    created: function () {
      this.$store.dispatch("toggleSearchBarAction", false);
      if (this.$session.get("token") !== undefined) {
        this.$router.push('/');
      }
      this.selectMajorValue = "학부 (학번 입력시 자동입력)";
    },
    updated() {
      this.setMajorByStudentNumber();
    },
    mounted() {
      this.$store.dispatch("setNowRoutingPath", {
        path: "singup"
      });
      this.$refs.userId.focus();
    },
    destroyed() {
      this.$store.dispatch("setNowRoutingPath", {
        path: ""
      });
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  body {
    float: left;
  }

  .container {
    width: 390px;
    margin: 83px auto 53px auto;
  }

  .signup img {
    width: 125px;
    margin-bottom: 39px;
    cursor: pointer;
  }

  input::placeholder {
    font-size: 15px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.8px;
    text-align: left;
    color: #bec9d5;
  }

  .signup .id input, .signup .pw input {
    border:#d2dae2 1px solid;
    width: 368px;
    height: 41px;
    margin-bottom: 9px;
    padding-left: 18px;
    font-size: 15px;
  }

  .signup .pw-check input, .signup .name input, .signup .student-number input, .signup .phone-number input {
    border:#d2dae2 1px solid;
    width: 366px;
    height: 41px;
    margin-bottom: 12px;
    padding-left: 20px;
    font-size: 15px;
  }

  .signup .nickname {
    display: flex;
  }

  .signup .nickname input {
    border:#d2dae2 1px solid;
    width: 281px;
    height: 41px;
    margin-bottom: 12px;
    margin-right: 6px;
    padding-left: 20px;
    font-size: 15px;
  }

  .nickname-button {
    width: 79px;
    height: 45px;
    font-size: 12px;
    background-color: #175c8e;
    color: #ffffff;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 2.17;
    letter-spacing: -0.6px;
    text-align: center;
    border: 1px solid #175c8e;
    cursor: pointer;
  }

  .help-desc {
    height: 12px;
    font-size: 12px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.5;
    letter-spacing: -0.6px;
    text-align: left;
    color: #858585;
    margin-bottom: 16px;
    margin-left: 5px;
  }

  .select-list {
    width: 390x;
    display: flex;
    padding-bottom: 24px;
    margin-bottom: 25px;
    justify-content: center;
    border-bottom: 1px solid #d2dae2;
  }

  .dropdown {
    position: relative;
    display: inline-block;
  }

  .drop-btn {
    padding-left: 19px;
    width: 192px;
    margin: 0;
    height: 42px;
    background-color: #ffffff;
    border: 1px solid #d2dae2;
    cursor: pointer;
    font-size: 15px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.2;
    letter-spacing: -0.8px;
    text-align: left;
    color: #252525;
  }

  .gender {
    padding-top: 10px;
  }

  .drop-btn img {
    width: 17px;
    height: 12px;
    float: right;
    margin-top: 4px;
    margin-right: 5px;
  }

  .select-major .drop-btn {
    margin-right: 6px;
    cursor: default;
  }

  .dropdown-list {
    display: none;
    position: absolute;
    background-color: #ffffff;
    border: 1px solid #d2dae2;
    z-index: 1;
    width: 190px;
    margin: 0;
  }

  .dropdown-list a {
    color: black;
    font-size: 14px;
    padding: 10px 16px;
    text-decoration: none;
    display: block;
    border-bottom: 1px solid #d2dae2;
    cursor: pointer;
  }

  .dropdown a:hover {
    background-color: #175c8e;
    color: #ffffff;
  }

  .dropdown-list a:last-child {
    border-bottom: none;
  }

  .dropdown:active .dropdown-list {
    display: block;
  }

  .access-terms {
    text-align: left;
    margin-bottom: 6px;
  }

  .all label {
    font-size: 15px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.2;
    letter-spacing: -0.8px;
    text-align: left;
    color: #252525;
  }

  .personal-data label, .koin label {
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.5;
    letter-spacing: -0.6px;
    text-align: left;
    color: #858585;
  }

  .signup-button {
    width: 390px;
    height: 45px;
    background-color: #175c83;
    border: 1px solid #175c8e;
    font-family: NanumSquareB;
    font-size: 20px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.3;
    letter-spacing: -1px;
    text-align: center;
    color: #ffffff;
    margin-top: 28px;
    margin-bottom: 24px;
    cursor: pointer;
  }

  .show-personal-data-terms, .show-koin-terms {
    font-size: 15px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.8px;
    text-align: left;
    color: #252525;
    padding-top: 25px;
    margin-bottom: 11px;
    cursor: pointer;
  }

  .show-koin-terms {
    padding-top: 12px;
  }

  .line {
    border-top: 1px solid #d2dae2;
  }

  .koin-terms {
    margin-bottom: 19px;
  }

  textarea {
    resize: none;
    width: 352px;
    border: 1px solid #d2dae2;
    padding: 18px 19px 17px 19px;
    font-family: NanumBarunGothic;
    font-size: 12px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.5;
    letter-spacing: -0.6px;
    text-align: left;
    color: #858585;
    height: 102px;
  }

  .footer {
    height: 13px;
    font-family: NanumBarunGothic;
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.7px;
    text-align: center;
    color: #7d7d7d;
  }

  .footer .bold {
    color: #acabab;
    font-weight: 800;
  }

  input::placeholder {
    font-size: 15px;
  }

  .loading {
    padding-left: 47%;
    padding-right: 50%;
  }

  /* 체크박스 커스텀 */
  input[type=checkbox] {
    display: none;
  }

  input[type=checkbox] + label {
    display: inline-block;
    cursor: pointer;
    position: relative;
    padding-left: 7%;
  }

  input[type=checkbox] + label:before {
    content: "";
    width: 16px;
    height: 16px;
    position: absolute;
    left: 0;
    bottom: 1px;
    background-color: #ffffff;
    border: 1px solid #d2dae2;
    line-height: 13px;
  }

  input[type=checkbox]:checked + label:before {
    content: "";
    background-image: url("https://static.koreatech.in/assets/img/check.png");
    background-size: cover;
  }

  @media (max-width: 576px) {
    .container {
      width: 100%;
      height: 100%;
      margin-top: 28px;
    }

    .signup {
      width: 344px;
      padding-left: 8px;
      padding-right: 8px;
      margin-left: auto;
      margin-right: auto;
    }

    .signup-button {
      width: calc(100% - 8px);
      padding: 0;
      height: 34px;
      font-size: 15px;
    }

    .login img {
      margin-top: 30px;
      width: 105px;
      margin-right: 17px;
      margin-bottom: 60px;
    }

    .footer {
      font-size: 11px;
      margin-top: 8px;
    }

    * input {
      width: calc(100% - 22px) !important;
      padding-left: 10px !important;
      height: 32px !important;
      font-size :14px !important;
    }

    .signup .nickname input {
      width: 232px !important;
      margin-right: 10px;
    }

    .signup .nickname {
      margin-left: 5px;
    }
    .drop-btn {
      width: 162px;
    }

    .select-major .drop-btn {
      margin-right: 11px;
      padding-left: 5px;
      font-size :14px;
    }

    textarea {
      width: calc(100% - 50px);
      height: 90px;
    }

    .select-list, .access-terms{
      margin-left: 5px;
      margin-right: 5px;
      font-size: 15px;
    }
    .help-desc {
      margin-bottom: 12px;
    }
    .show-personal-data-terms, .show-koin-terms {
      margin-left: 5px;
      margin-right: 5px;
    }

    .nickname-button {
      height: 36px;
    }

    .signup img {
      margin-top: 60px;
      width: 104px;
      margin-right: 15px;
      margin-bottom: 64px;
    }
    .drop-btn img {
      width: 17px;
      height: 12px;
      float: right;
      margin-top: 4px;
      margin-right: 5px;
    }
    .dropdown-list {
      width: 160px;
    }
    .dropdown-list a {
      width: 128px;
    }
  }
</style>
