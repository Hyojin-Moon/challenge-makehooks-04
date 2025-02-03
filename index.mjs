// 현재 실행 중인 훅의 인덱스
let currentHook = 0;
// 모든 훅 데이터를 저장하는 배열
let hooks = [];

/**
 * useState 구현
 * 
 * initialValue - 초기 상태 값
 */
const useState = (initialValue) => {
  // 현재 인덱스의 훅 값이 없으면 초기값을 저장
  hooks[currentHook] = hooks[currentHook] || initialValue;
  const hookIndex = currentHook; // 현재 훅 인덱스 저장

  // 상태를 변경하는 setState 함수
  const setState = (newState) => {
    if (typeof newState === "function") {
      // 새로운 상태가 함수라면 이전 상태를 기반으로 새로운 값 설정
      hooks[hookIndex] = newState(hooks[hookIndex]);
    } else {
      // 그렇지 않으면 그대로 새로운 값 설정
      hooks[hookIndex] = newState;
    }
  };

  return [hooks[currentHook++], setState]; // 상태 값과 setState 반환
};

/**
 * useEffect 구현
 * callback - 실행할 콜백 함수
 * depArray - 의존성 배열 (생략 가능)
 */
const useEffect = (callback, depArray) => {
  const hasNoDeps = !depArray; // 의존성 배열이 없으면 항상 실행
  const prevDeps = hooks[currentHook] ? hooks[currentHook].deps : undefined; // 이전 의존성 값
  const prevCleanUp = hooks[currentHook] ? hooks[currentHook].cleanUp : undefined; // 이전 cleanup 함수

  // 의존성 배열이 변경되었는지 확인
  const hasChangedDeps = prevDeps
    ? !depArray.every((el, i) => el === prevDeps[i])
    : true;

  if (hasNoDeps || hasChangedDeps) { //의존성 배열 확인
    if (prevCleanUp) prevCleanUp(); // 이전 cleanup 함수 실행
    const cleanUp = callback(); // effect 실행 후 cleanup 함수 반환
    hooks[currentHook] = { deps: depArray, cleanUp }; // 새로운 effect 정보 저장
  }
  currentHook++;
};

/**
 * MyReact: 가상의 React 렌더링 시스템
 */
const MyReact = {
  /**
   * 컴포넌트 렌더링 함수
   * Component - 렌더링할 컴포넌트
   * 
   */
  render(Component) {
    const instance = Component(); // 컴포넌트 실행
    instance.render(); // render 메서드 실행
    currentHook = 0; // 훅 인덱스 초기화
    return instance; // 컴포넌트 반환
  },
};

// useState, useEffect를 MyReact에 추가
MyReact.useState = useState;
MyReact.useEffect = useEffect;

// 내보내기
export { useState, useEffect };
export default MyReact;
