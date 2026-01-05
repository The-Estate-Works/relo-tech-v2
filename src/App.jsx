import React, { useState } from 'react'

function App() {
  // =========================================================
  // 👇 2단계에서 '새 배포' 후 복사한 URL을 여기에 넣으세요!
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzEJJbIOstTEFfdMbWhWAEV4OuTFNqgT_9aYtnU-VP7_nZgbZ72OPu851IeWNj0GBvCAA/exec"; 
  // =========================================================

  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. 폼 데이터 상태 관리
  const [formData, setFormData] = useState({
    company: "",
    name: "",
    role: "",
    email: "",
    phone: "",
    employeeCount: "",
    painPoints: [], // 중복 선택이라 배열([])로 관리
    agreement: false
  });

  // 2. 텍스트 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 3. 체크박스(다중 선택) 핸들러 (어려운 부분이지만 제가 다 짰습니다!)
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      // 체크하면 배열에 추가
      setFormData(prev => ({ ...prev, painPoints: [...prev.painPoints, value] }));
    } else {
      // 체크 해제하면 배열에서 제거
      setFormData(prev => ({ ...prev, painPoints: prev.painPoints.filter(item => item !== value) }));
    }
  };

  // 4. 개인정보 동의 핸들러
  const handleAgreementChange = (e) => {
    setFormData({ ...formData, agreement: e.target.checked });
  };

  // 5. 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 유효성 검사: 동의 안 했으면 경고
    if (!formData.agreement) {
      alert("개인정보 수집 및 이용에 동의해주셔야 신청이 가능합니다.");
      return;
    }

    setLoading(true);

    const formBody = new FormData();
    formBody.append("company", formData.company);
    formBody.append("name", formData.name);
    formBody.append("role", formData.role);
    formBody.append("email", formData.email);
    formBody.append("phone", formData.phone);
    formBody.append("employeeCount", formData.employeeCount);
    // 배열을 "비자, 숙소" 처럼 문자열로 합쳐서 보냄
    formBody.append("painPoints", formData.painPoints.join(", ")); 

    fetch(SCRIPT_URL, {
      method: "POST",
      body: formBody
    })
    .then(() => {
      alert("문의가 접수되었습니다. 담당자가 빠르게 연락드리겠습니다.");
      // 초기화
      setFormData({ 
        company: "", name: "", role: "", email: "", phone: "", 
        employeeCount: "", painPoints: [], agreement: false 
      });
      setStarted(false);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("오류가 발생했습니다.");
      setLoading(false);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
      
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 border border-slate-200">
        
        {!started ? (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Relo-Tech Concierge</h1>
            <p className="text-slate-600 mb-2 font-semibold">기업 담당자(HR) 전용 상담 신청</p>
            <p className="text-slate-500 text-sm mb-8">
              외국인 임직원 정착, 이제 전문가에게 맡기세요.<br/>
              사전 진단을 통해 우리 회사에 딱 맞는 제안서를 보내드립니다.
            </p>
            <button 
              onClick={() => setStarted(true)}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-lg transition-colors shadow-md"
            >
              무료 진단 & 견적 요청하기
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">도입 문의 신청서</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 섹션 1: 기본 정보 */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="text-sm font-bold text-blue-700 mb-4 uppercase tracking-wide">Section 1. 기본 정보 (필수)</h3>
                <div className="space-y-3">
                  <input required name="company" value={formData.company} onChange={handleChange} type="text" placeholder="회사명 (주식회사 포함)" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  <div className="grid grid-cols-2 gap-2">
                    <input required name="name" value={formData.name} onChange={handleChange} type="text" placeholder="담당자 성함" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    <input required name="role" value={formData.role} onChange={handleChange} type="text" placeholder="부서 / 직책" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="회사 이메일 (@company.com)" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="연락처 (010-0000-0000)" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              {/* 섹션 2: 사전 진단 */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="text-sm font-bold text-blue-700 mb-4 uppercase tracking-wide">Section 2. 사전 진단 (선택)</h3>
                
                {/* 외국인 임직원 규모 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">외국인 임직원 규모</label>
                  <select name="employeeCount" value={formData.employeeCount} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="">규모를 선택해주세요</option>
                    <option value="5명 미만">5명 미만</option>
                    <option value="5~10명">5 ~ 10명</option>
                    <option value="11~30명">11 ~ 30명</option>
                    <option value="31명 이상">31명 이상</option>
                  </select>
                </div>

                {/* 가장 큰 어려움 (체크박스) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">현재 가장 큰 어려움 (중복 선택)</label>
                  <div className="space-y-2">
                    {["비자 발급 및 행정 처리", "적합한 숙소 찾기 (부동산)", "생활 민원 처리 (병원, 은행 등)", "기타"].map((item) => (
                      <label key={item} className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          value={item} 
                          checked={formData.painPoints.includes(item)}
                          onChange={handleCheckboxChange}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-600">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* 섹션 3: 동의 */}
              <div className="pt-2">
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.agreement}
                    onChange={handleAgreementChange}
                    className="w-4 h-4 mt-1 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-500 leading-tight">
                    [필수] 개인정보 수집 및 이용에 동의합니다. 귀하는 본 동의를 거부할 권리가 있으며, 거부 시 상담 접수가 불가능합니다.
                  </span>
                </label>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className={`w-full text-white font-bold py-4 px-6 rounded-lg transition-colors 
                  ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
              >
                {loading ? '제출 중입니다...' : '진단 결과 및 견적 받기'}
              </button>
            </form>
            
            <button onClick={() => setStarted(false)} className="w-full text-slate-400 text-sm mt-4 hover:text-slate-600">
              ← 뒤로 가기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App