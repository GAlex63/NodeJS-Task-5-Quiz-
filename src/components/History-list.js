export const HistoryList = ({ history }) => {
  return (
    <div className="history-list">
      <h3>История прохождений</h3>
      {!history ? (
        <div>Отсутствует история прохождения</div>
      ) : (
        <ul>
          {history.map((entry, id) => (
            <li key={id}>
              {entry.date}: вопросов - {entry.totalQuestions} , правильных
              ответов - {entry.correctAnswers}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
