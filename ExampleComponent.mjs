import MyReact, { useState, useEffect } from "./index.mjs";

/**
 * ExampleComponent: 가상의 React 컴포넌트
 */
function ExampleComponent() {
  // 상태 변수 선언
  const [count, setCount] = useState(0);
  const [text, setText] = useState("foo");

  // useEffect: count 또는 text 값이 변경될 때 실행됨
  useEffect(() => {
    console.log("effect 실행됨:", count, text);
    return () => {
      console.log("cleanup 실행됨:", count, text);
    };
  }, [count, text]);

  return {
    click: () => setCount(count + 1), // count 증가
    type: (newText) => setText(newText), // text 변경
    noop: () => setCount(count), // 같은 값으로 설정 (변화 없음)
    render: () => console.log("render", { count, text }), // 현재 상태 출력
  };
}

// 초기 렌더링
let App = MyReact.render(ExampleComponent);

// count 증가 후 렌더링
App.click();
App = MyReact.render(ExampleComponent);

// text 변경 후 렌더링
App.type("bar");
App = MyReact.render(ExampleComponent);

// 상태 변화 없음 (noop)
App.noop();
App = MyReact.render(ExampleComponent);

// count 증가 후 렌더링
App.click();
App = MyReact.render(ExampleComponent);