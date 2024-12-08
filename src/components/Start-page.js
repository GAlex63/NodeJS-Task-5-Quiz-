import { Link } from "react-router-dom";
import { HistoryList } from "./History-list";

export const StartPage = ({ history }) => {
  return (
    <div className="start-page">
      <h1>Добро пожаловать в игру!</h1>
      <Link to="/questions/0">
        <button>Начать игру</button>
      </Link>
      <Link to="/edit">
        <button>Редактировать тест</button>
      </Link>
      <HistoryList history={history} />
    </div>
  );
};
