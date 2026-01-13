import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react'; 
// 만약 lucide-react가 없어서 에러가 나면, 위 줄을 지우고 버튼 텍스트(Next, Back)만 남기셔도 됩니다.

/**
 * Zod Schema Definition
 * 폼 유효성 검사 규칙 정의
 */
const formSchema = z.object({
  // Step 1: Basic Info
  companyName: z.string().min(1, '회사명을 입력해주세요.'),
  contactName: z.string().min(1, '담당자 성함을 입력해주세요.'),
  jobTitle: z.string().min(1, '직책/부서를 입력해주세요.'),
  email: z.string().email('올바른 이메일 형식이 아닙니다.'),
  phone: z.string().regex(/^[0-9-]+$/, '숫자만 입력해주세요.'),

  // Step 2: Service Needs
  employeeCount: z.enum(['1-5', '6-20', '21-50', '50+'], {
    errorMap: () => ({ message: '이주 대상 인원을 선택해주세요.' }),
  }),
  isFamilyAccompanied: z.enum(['yes', 'no'], {
    errorMap: () => ({ message: '가족 동반 여부를 선택해주세요.' }),
  }),
  needSchoolInfo: z.boolean().optional(),
  
  needHousingSupport: z.enum(['yes', 'no'], {
    errorMap: () => ({ message: '주거 지원 필요 여부를 선택해주세요.' }),
  }),
  budgetRange: z.string().optional(),

  // Step 3: Privacy
  privacyAgreement: z.literal(true, {
    errorMap: () => ({ message: '개인정보 처리방침에 동의해야 합니다.' }),
  }),
});

// 단계별 필드 정의
const stepsFields = [
  ['companyName', 'contactName', 'jobTitle', 'email', 'phone'],
  ['employeeCount', 'isFamilyAccompanied', 'needHousingSupport'],
  ['privacyAgreement'],
];

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const isFamilyAccompanied = watch('isFamilyAccompanied');
  const needHousingSupport = watch('needHousingSupport');

  const nextStep = async () => {
    const fields = stepsFields[currentStep];
    const isStepValid = await trigger(fields);

    if (isStepValid) {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, 2));
    }
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // 🔹 기존 onSubmit을 지우고 이 코드로 채워넣으세요
  const onSubmit = (data) => {
    // 👇 여기에 복사해둔 'https://script.google.com/macros/s/AKfycbwUyDtTtMdMOGzIz0N3aQ99sLtqMaye9WnCACBmDlGuqlxEJk0WTKM7GK287DWxSToj/exec' 주소를 붙여넣으세요!
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwUyDtTtMdMOGzIz0N3aQ99sLtqMaye9WnCACBmDlGuqlxEJk0WTKM7GK287DWxSToj/exec";

    // 사용자에게 제출 확인 받기
    if (!confirm("견적 요청서를 제출하시겠습니까?")) return;

    // 데이터 전송 시작
    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", // 구글 시트 전송 필수 설정
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    .then(() => {
      // 전송 성공 시
      alert("성공적으로 접수되었습니다! 담당자가 24시간 내로 연락드리겠습니다.");
      console.log("전송된 데이터:", data);
      
      // (선택사항) 제출 후 페이지 새로고침
      window.location.reload(); 
    })
    .catch((error) => {
      // 전송 실패 시
      console.error("Error:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    });
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Relo-Tech Concierge 견적 요청</h2>
          <p className="text-gray-500 text-sm mb-6">외국인 임직원 정착을 위한 맞춤형 솔루션을 제안해드립니다.</p>
          
          {/* Progress Bar */}
          <div className="relative h-2 bg-gray-100 rounded-full mb-2">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-blue-600 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStep + 1) / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between text-xs font-semibold text-gray-400">
            <span className={currentStep >= 0 ? 'text-blue-600' : ''}>기본 정보</span>
            <span className={currentStep >= 1 ? 'text-blue-600' : ''}>서비스 상세</span>
            <span className={currentStep >= 2 ? 'text-blue-600' : ''}>검토 및 제출</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 min-h-[400px] flex flex-col">
          <div className="flex-grow relative overflow-hidden">
            <AnimatePresence mode='wait' custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {/* STEP 1 */}
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <InputField label="회사명" id="companyName" register={register} error={errors.companyName} placeholder="(주)테크스타트업" />
                    <InputField label="담당자 성함" id="contactName" register={register} error={errors.contactName} placeholder="김철수" />
                    <InputField label="직책 / 부서" id="jobTitle" register={register} error={errors.jobTitle} placeholder="HR 매니저 / 인사팀" />
                    <InputField label="업무용 이메일" id="email" type="email" register={register} error={errors.email} placeholder="hr@company.com" />
                    <InputField label="연락처" id="phone" type="tel" register={register} error={errors.phone} placeholder="010-1234-5678" />
                  </div>
                )}

                {/* STEP 2 */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">이주 대상 외국인 임직원 수</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['1-5', '6-20', '21-50', '50+'].map((opt) => (
                          <label key={opt} className={`cursor-pointer border rounded-lg p-3 text-center transition-all ${watch('employeeCount') === opt ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'border-gray-200 hover:border-blue-300'}`}>
                            <input type="radio" value={opt} {...register('employeeCount')} className="hidden" />
                            {opt}명
                          </label>
                        ))}
                      </div>
                      {errors.employeeCount && <p className="text-red-500 text-xs mt-1">{errors.employeeCount.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">가족이 동반하나요?</label>
                      <div className="flex gap-4">
                        {['yes', 'no'].map((val) => (
                          <label key={val} className="flex items-center space-x-2 cursor-pointer">
                            <input type="radio" value={val} {...register('isFamilyAccompanied')} className="text-blue-600 focus:ring-blue-500 h-4 w-4" />
                            <span>{val === 'yes' ? '네 (Yes)' : '아니오 (No)'}</span>
                          </label>
                        ))}
                      </div>
                      {errors.isFamilyAccompanied && <p className="text-red-500 text-xs mt-1">{errors.isFamilyAccompanied.message}</p>}
                    </div>

                    {isFamilyAccompanied === 'yes' && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                         <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" {...register('needSchoolInfo')} className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500" />
                            <span className="text-sm text-gray-700 font-medium">국제학교(International School) 정보가 필요하신가요?</span>
                         </label>
                      </motion.div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">임시 숙소 및 주거 지원이 필요한가요?</label>
                      <div className="flex gap-4">
                        {['yes', 'no'].map((val) => (
                          <label key={val} className="flex items-center space-x-2 cursor-pointer">
                            <input type="radio" value={val} {...register('needHousingSupport')} className="text-blue-600 focus:ring-blue-500 h-4 w-4" />
                            <span>{val === 'yes' ? '네 (Yes)' : '아니오 (No)'}</span>
                          </label>
                        ))}
                      </div>
                      {errors.needHousingSupport && <p className="text-red-500 text-xs mt-1">{errors.needHousingSupport.message}</p>}
                    </div>

                     {needHousingSupport === 'yes' && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                         <label className="block text-sm font-semibold text-gray-700 mb-2">인당 선호 월 렌트 예산 (단위: 만원)</label>
                         <select {...register('budgetRange')} className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 text-sm">
                           <option value="">예산을 선택해주세요</option>
                           <option value="under_200">200만원 미만</option>
                           <option value="200_400">200 ~ 400만원</option>
                           <option value="400_600">400 ~ 600만원</option>
                           <option value="over_600">600만원 이상</option>
                         </select>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* STEP 3 */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 space-y-3">
                      <h3 className="font-bold text-gray-800 border-b border-gray-200 pb-2">입력 정보 확인</h3>
                      <ReviewItem label="회사명" value={getValues('companyName')} />
                      <ReviewItem label="담당자" value={`${getValues('contactName')} (${getValues('email')})`} />
                      <ReviewItem label="이주 인원" value={`${getValues('employeeCount')}명`} />
                      <ReviewItem label="가족 동반" value={getValues('isFamilyAccompanied') === 'yes' ? '있음' : '없음'} />
                      <ReviewItem label="주거 지원" value={getValues('needHousingSupport') === 'yes' ? `필요함 (${translateBudget(getValues('budgetRange'))})` : '필요 없음'} />
                    </div>

                    <div className="pt-2">
                      <label className="flex items-start space-x-3 cursor-pointer p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <input 
                          type="checkbox" 
                          {...register('privacyAgreement')} 
                          className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500" 
                        />
                        <div className="text-sm">
                          <span className="font-semibold text-gray-900">개인정보 수집 및 이용 동의 (필수)</span>
                          <p className="text-gray-500 mt-1">
                            서비스 제공 및 상담을 위해 입력하신 정보를 수집합니다. 정보는 상담 목적 외 용도로 사용되지 않습니다.
                          </p>
                          {errors.privacyAgreement && <p className="text-red-500 text-xs mt-1 font-bold">{errors.privacyAgreement.message}</p>}
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-between pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentStep === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              이전
            </button>

            {currentStep < 2 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                다음
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-green-700 hover:shadow-lg transition-all focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                제출하기
                <Check className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// Helper Components
const InputField = ({ label, id, type = 'text', register, error, placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
    <input
      id={id}
      type={type}
      {...register(id)}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
        error ? 'border-red-500 bg-red-50' : 'border-gray-300'
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);

const ReviewItem = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-900 text-right">{value || '-'}</span>
  </div>
);

const translateBudget = (value) => {
  switch(value) {
    case 'under_200': return '200만원 미만';
    case '200_400': return '200~400만원';
    case '400_600': return '400~600만원';
    case 'over_600': return '600만원 이상';
    default: return '미선택';
  }
}