import { useEffect } from "react";

function App() {
  useEffect(() => {
    console.log("App rendered");
  }, []);

  return <></>;
}

export default App;
