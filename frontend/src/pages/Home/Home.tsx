import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

function HomePage() {
  const user = useSelector((state: RootState) => state.user);

  console.log(user);
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}

export default HomePage;
